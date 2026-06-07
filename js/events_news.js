const eventCnt = document.querySelector("#events > section");

const template = document.getElementById("template_eventcard");

if (template) {
    const eventCardTemplate = template.content;

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
            
            // Reverse the array so items added to the bottom of the sheet appear first
            items.reverse();

            const events = items.filter(item => item.type && item.type.toLowerCase() === 'event');


            function renderItems(container, dataArray) {
                if (!container || !dataArray) return;
                dataArray.forEach(item => {
                    const clone = eventCardTemplate.cloneNode(true);
                    const cardInner = clone.querySelector(".card-cnt > div");

                    // Front - check if image is a direct URL or a local file
                    const imgUrl = item.image.startsWith('http') ? item.image : `./media/events_news/${item.image}`;
                    cardInner.children[0].style.backgroundImage = `url(${imgUrl})`;
                    cardInner.children[0].querySelector("span").innerText = item.title;

                    // Back
                    cardInner.children[1].querySelector("img").src = item.logo;
                    cardInner.children[1].querySelector("p").innerText = item.description;

                    // Click Logic
                    const exploreBtn = cardInner.children[1].querySelector(".explore");
                    if (exploreBtn && item.reference) {
                        exploreBtn.onclick = () => {
                            window.location.href = item.reference;
                        };
                    }
                    container.appendChild(clone);
                });
            }

            // --- 1. RENDER EVENTS ---
            renderItems(eventCnt, events);


        })
        .catch(err => {
            console.error("Data could not be loaded. Check your CSV path or Live Server.", err);
        });
}