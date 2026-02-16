const container = document.getElementById("papers-container");
const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalSummary = document.getElementById("modal-summary");
const modalLink = document.getElementById("modal-link");
const closeBtn = document.getElementById("close");

let papers = [];

/* ---------- LOAD PAPERS FROM N8N ---------- */

async function loadPapers(query = "transformer") {

    container.innerHTML =
        `<div class="loading">Loading research papers...</div>`;

    try {

        const response = await fetch(
            `http://localhost:5678/webhook-test/papers?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        console.log("Webhook data:", data);

        // arXiv XML → JSON structure
        const entries = data.feed?.entry || [];

        papers = entries.map(paper => ({
            title: paper.title,
            summary: paper.summary,
            link:
                paper.link.find(l => l.title === "pdf")?.href ||
                paper.link[0].href
        }));

        renderPapers(papers);

    } catch (error) {
        console.error(error);

        container.innerHTML =
            `<div class="loading">Failed to load papers ❌</div>`;
    }
}

/* ---------- RENDER ---------- */

function renderPapers(list) {

    container.innerHTML = "";

    if (!list.length) {
        container.innerHTML =
            `<div class="loading">No papers found</div>`;
        return;
    }

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

/* ---------- MODAL ---------- */

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

/* ---------- SEARCH (DEBOUNCED) ---------- */

let debounceTimer;

searchInput.addEventListener("input", () => {

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            loadPapers(query);
        }
    }, 500);
});

/* hajime */

loadPapers();
