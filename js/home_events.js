const container = document.getElementById("home-events-container");

if (container) {
    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTa7pz-8Jhp7uzvIM28u_khLZuNx3lfAa76JIZDv8cmo6vaiIwj7WBhwVtYZIAaYmBvwBqubtwymxEs/pub?gid=929059797&single=true&output=csv";

    function parseCSV(csvText) {
        const lines = csvText.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));

        return lines.slice(1).filter(line => line.trim()).map(line => {
            const values = [];
            let current = "";
            let inQuotes = false;
            for (const char of line) {
                if (char === '"') { inQuotes = !inQuotes; }
                else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ""; }
                else { current += char; }
            }
            values.push(current.trim());

            const obj = {};
            headers.forEach((h, i) => { obj[h] = values[i] || ""; });
            return obj;
        });
    }

    fetch(CSV_URL)
        .then(response => {
            if (!response.ok) throw new Error("Fetch failed");
            return response.text();
        })
        .then(csvText => {
            let items = parseCSV(csvText);
            
            // Reverse to get newest first
            items.reverse();
            
            // Filter events only
            const events = items.filter(item => item.type && item.type.toLowerCase() === 'event');

            // Take first 6 events
            const top6Events = events.slice(0, 6);

            // Clear container just in case
            container.innerHTML = "";

            // Render each event
            top6Events.forEach(item => {
                const imageStr = item.image || "";
                const titleStr = item.title || "Untitled Event";
                const refStr = item.reference || "#";

                const imgUrl = imageStr.startsWith('http') ? imageStr : `./media/events_news/${imageStr}`;
                
                const aTag = document.createElement("a");
                aTag.href = refStr;
                aTag.style.backgroundImage = `url("${imgUrl}")`;

                const spanTag = document.createElement("span");
                spanTag.innerText = titleStr;

                aTag.appendChild(spanTag);
                container.appendChild(aTag);
            });

            // Add the final 'Explore' button capsule
            const exploreTag = document.createElement("a");
            exploreTag.href = "events_news.html";
            exploreTag.style.backgroundImage = "url(media/right-arrow-white.png)";
            exploreTag.style.backgroundColor = "#0b0b0b";
            exploreTag.style.backgroundSize = "auto 80px";
            
            const exploreSpan = document.createElement("span");
            exploreSpan.innerText = "Explore All";
            exploreTag.appendChild(exploreSpan);

            container.appendChild(exploreTag);
        })
        .catch(err => {
            console.error("Data could not be loaded.", err);
        });
}
