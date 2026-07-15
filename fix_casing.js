const fs = require('fs');
const path = require('path');

function titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Match h1 to h6 tags, including attributes and content
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gis;
    
    content = content.replace(headingRegex, (match, level, innerHtml) => {
        // Split by HTML tags to preserve them, only modify text nodes
        const parts = innerHtml.split(/(<[^>]+>)/g);
        
        const newInnerHtml = parts.map(part => {
            if (part.startsWith('<')) {
                return part; // Keep HTML tags as is
            } else {
                // Title case the text node, but fix special cases like "Th" -> "th", "Nd" -> "nd", "Rd" -> "rd"
                let text = titleCase(part);
                text = text.replace(/\b(Th|Nd|Rd|St)\b/g, s => s.toLowerCase());
                return text;
            }
        }).join('');
        
        return match.replace(innerHtml, newInnerHtml);
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                walkDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            processHtmlFile(fullPath);
        }
    }
}

walkDir('.');
console.log('Finished updating HTML headings to Title Case.');
