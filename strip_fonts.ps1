$files = Get-ChildItem -Path "css" -Filter "*.css" -Recurse

foreach ($file in $files) {
    if ($file.Name -eq "common.css") {
        continue
    }
    
    $content = Get-Content $file.FullName
    $newContent = @()
    $inFontFace = $false
    
    foreach ($line in $content) {
        if ($line -match "@font-face") {
            $inFontFace = $true
        }
        if ($line -match "}") {
            $inFontFace = $false
        }
        
        if ($line -match "font-family:" -and -not $inFontFace) {
            # Preserve the logo font in nav bar.css and style.css
            if ($line -match "'MyOldEnglish'" -or $line -match '"MyOldEnglish"') {
                $newContent += $line
            } else {
                # Skip the line (strip it)
            }
        } else {
            $newContent += $line
        }
    }
    
    Set-Content -Path $file.FullName -Value $newContent
}
