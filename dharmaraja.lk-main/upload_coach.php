<?php
// ==========================================
// 1. DATABASE CONFIGURATION
// Update these variables with your server details
// ==========================================
$host = "localhost";
$username = "root";          // Replace with your DB username
$password = "";              // Replace with your DB password
$dbname = "vacancy";    // Replace with your DB name

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitize Inputs
    $full_name = htmlspecialchars($_POST['full_name']);
    $age = intval($_POST['age']);
    $address = htmlspecialchars($_POST['address']);
    $contact_number = htmlspecialchars($_POST['contact_number']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $sport_applied = htmlspecialchars($_POST['sport_applied']);
    $age_group_applied = htmlspecialchars($_POST['age_group_applied']);
    $experience = htmlspecialchars($_POST['experience']);
    $certifications = htmlspecialchars($_POST['certifications']);
    $education = htmlspecialchars($_POST['education']);
    $availability = htmlspecialchars($_POST['availability']);
    $declaration = isset($_POST['declaration']) ? 1 : 0;

    $key_skills = "";
    if (isset($_POST['key_skills'])) {
        $key_skills = implode(", ", $_POST['key_skills']);
    }

    // ==========================================
    // MULTIPLE FILE UPLOAD LOGIC
    // ==========================================
    $upload_dir = "uploads/resumes/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $uploaded_file_paths = []; // Array to store all successfully uploaded file paths
    $allowed_types = array("pdf", "doc", "docx");

    // Check if files were actually selected
    if(isset($_FILES['reference_files'])) {
        $file_count = count($_FILES['reference_files']['name']);
        
        // Loop through each file
        for($i = 0; $i < $file_count; $i++) {
            $original_file_name = basename($_FILES["reference_files"]["name"][$i]);
            $tmp_name = $_FILES["reference_files"]["tmp_name"][$i];
            
            // Skip empty inputs if any
            if(empty($original_file_name)) continue;

            // Create unique name combining timestamp and the loop index ($i) to avoid overwriting
            $unique_file_name = time() . "_" . $i . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $original_file_name);
            $target_file = $upload_dir . $unique_file_name;
            $file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

            if (!in_array($file_type, $allowed_types)) {
                echo json_encode(['status' => 'error', 'message' => "File '$original_file_name' has an invalid format. Only PDF, DOC, and DOCX allowed."]);
                exit;
            }

            // Move the file
            if (move_uploaded_file($tmp_name, $target_file)) {
                $uploaded_file_paths[] = $target_file; // Add path to array
            } else {
                echo json_encode(['status' => 'error', 'message' => "Failed to upload file: '$original_file_name'."]);
                exit;
            }
        }
    }

    // Ensure at least one file was uploaded
    if (empty($uploaded_file_paths)) {
        echo json_encode(['status' => 'error', 'message' => 'Please upload at least one document.']);
        exit;
    }

    // Join all file paths into a single string separated by commas to store in the database
    $final_paths_string = implode(", ", $uploaded_file_paths);

    // ==========================================
    // INSERT INTO DATABASE
    // ==========================================
    $stmt = $conn->prepare("INSERT INTO coach_applications 
        (full_name, age, address, contact_number, email, sport_applied, age_group_applied, experience, certifications, education, key_skills, availability, reference_file_paths, declaration) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("sisssssssssssi", 
        $full_name, $age, $address, $contact_number, $email, 
        $sport_applied, $age_group_applied, $experience, $certifications, 
        $education, $key_skills, $availability, $final_paths_string, $declaration
    );

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Application submitted successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database Error: ' . $stmt->error]);
    }
    $stmt->close();
}

$conn->close();
?>