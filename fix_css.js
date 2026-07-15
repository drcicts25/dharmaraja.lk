const fs = require('fs');

const cssPath = 'css/home.css';
let lines = fs.readFileSync(cssPath, 'utf8').split('\n');

// The file currently has 712 lines.
// Lines up to 676 are fine. 
// At 677, we should insert `}` to close the `max-width: 520px` media query.
// Then insert the fully restored `max-width: 768px` media query.

let newLines = lines.slice(0, 677); // Keep up to line 677 (index 676)
newLines.push("}");

const restoredMobileBlock = `
/* ── Mobile Responsiveness ── */
@media screen and (max-width: 768px) {
    #updates {
        min-height: auto;
        margin-top: 40px;
        margin-bottom: 40px;
    }
    #updates > h1 {
        font-size: 1.6em;
    }
    #updates > h3 {
        font-size: 1em;
    }
    #updates > hr {
        width: 90%;
    }
    #updates > section {
        width: 95vw;
        height: 400px;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        justify-content: flex-start;
        align-items: stretch;
        gap: 1em;
        padding-bottom: 20px;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
    }
    #updates > section::-webkit-scrollbar {
        height: 6px;
    }
    #updates > section::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;
    }
    #updates > section > .event-card {
        flex: 0 0 auto;
        width: 180px !important;
        height: 100%;
        border-radius: 30px;
        scroll-snap-align: start;
    }
    #updates > section > .event-card.active {
        width: 300px !important;
    }
    #updates > section > .event-card.explore-card.active {
        width: 200px !important;
    }

    #about {
        padding: 60px 20px;
    }
    #about > section {
        left: 0;
        max-width: 100%;
        margin: 0 auto;
        border-radius: 1em;
    }
    #about > img {
        display: none;
    }

    #land {
        padding: 1em;
        height: auto;
        min-height: 60vh;
    }
    #land > section {
        font-size: 2.5vw;
        padding: 1em;
        padding-top: 80px;
    }

    #history > h1 {
        font-size: 2em;
    }
    #history > p {
        padding: 1em;
        font-size: 0.95rem;
    }

    .score-section {
        padding: 2rem 1rem;
        margin-top: 40px;
    }
    .score-section h1 {
        font-size: 1.8rem;
    }
    .scoreboard {
        flex-direction: column;
    }
    .sb-team {
        padding: 1.5rem 1rem;
    }
    .sb-logo {
        width: 70px;
    }
    .sb-runs {
        font-size: 2.5rem;
    }
    .sb-vs {
        width: 36px;
        height: 36px;
        font-size: 0.75rem;
    }
    .sb-status {
        flex-wrap: wrap;
        gap: 0.8rem;
        padding: 0.8rem 1rem;
    }
    .sb-result {
        font-size: 0.95rem;
        padding: 0.7rem 1rem;
    }
}

#features h2 {
    font-family: "Old-English", serif !important;
    text-transform: capitalize !important;
}
`;

newLines.push(restoredMobileBlock);

fs.writeFileSync(cssPath, newLines.join('\n'), 'utf8');
console.log("Restored CSS successfully!");
