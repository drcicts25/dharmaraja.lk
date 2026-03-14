const eventCnt = document.querySelector("#events > section");
const newsCnt = document.querySelector("#news > section");
const template = document.getElementById("template_eventcard");

if (template) {
    const eventCardTemplate = template.content;

    fetch("../data/events_news.json")
        .then(response => {
            if (!response.ok) throw new Error("Fetch failed");
            return response.json();
        })
        .then(data => {
            // --- 1. RENDER EVENTS ---
            if (eventCnt && data.events) {
                data.events.forEach(item => {
                    const clone = eventCardTemplate.cloneNode(true);
                    const cardInner = clone.querySelector(".card-cnt > div");

                    // Front
                    cardInner.children[0].style.backgroundImage = `url(./media/events_news/${item.image})`;
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
                    eventCnt.appendChild(clone);
                });
            }

            // --- 2. RENDER NEWS ---
            if (newsCnt && data.news) {
                data.news.forEach(item => {
                    const clone = eventCardTemplate.cloneNode(true);
                    const cardInner = clone.querySelector(".card-cnt > div");

                    // Front
                    cardInner.children[0].style.backgroundImage = `url(./media/events_news/${item.image})`;
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
                    newsCnt.appendChild(clone);
                });
            }
        })
        .catch(err => {
            console.error("Data could not be loaded. Check your JSON path or Live Server.", err);
        });
}