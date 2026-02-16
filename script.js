const container = document.getElementById("papers-container");
const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalSummary = document.getElementById("modal-summary");
const modalLink = document.getElementById("modal-link");
const closeBtn = document.getElementById("close");

let papers = [];

/* ---------- LOAD PAPERS ---------- */

async function loadPapers() {

    container.innerHTML =
        `<div class="loading">Loading research papers...</div>`;

    try {

        // 👉 REPLACE THIS WITH YOUR N8N WEBHOOK LATER
        const searchInput = document.getElementById("search");

searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {

        const query = searchInput.value;

        const response = await fetch(
            "http://localhost:5678/webhook-test/papers?q=" + encodeURIComponent(query)
        );

        const data = await response.json();

        console.log(data);
        alert(data.message);
    }
});


/* ---------- RENDER ---------- */

function renderPapers(list) {
    container.innerHTML = "";

    list.forEach(paper => {

        const card = document.createElement("div");
        card.className = "paper-card";

        card.innerHTML = `
            <div class="paper-title">${paper.title}</div>
            <div class="paper-summary">${paper.summary}</div>
        `;

        card.onclick = () => openModal(paper);

        container.appendChild(card);
    });
}

/*Modal Logic*/

function openModal(paper) {
    modalTitle.textContent = paper.title;
    modalSummary.textContent = paper.summary;
    modalLink.href = paper.link;
    modal.classList.remove("hidden");
}

closeBtn.onclick = () => modal.classList.add("hidden");

window.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
};


searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = papers.filter(p =>
        p.title.toLowerCase().includes(value)
    );

    renderPapers(filtered);
});

/*Start*/
loadPapers();
