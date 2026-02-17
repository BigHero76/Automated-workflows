console.log("JS LOADED");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let currentResults = [];

searchBtn.addEventListener("click", searchPapers);

async function searchPapers() {
  const query = searchInput.value.trim();
  if (!query) return;

  const response = await fetch("http://localhost:5678/webhook/papers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const data = await response.json();

  console.log("BACKEND RESPONSE:", data);

  currentResults = data;

  renderResults();
  renderSaved();
  renderRecent();
}

function renderResults() {
  const container = document.getElementById("results");
  container.innerHTML = "";

  currentResults.forEach(paper => {
    const card = document.createElement("div");
    card.className = "paper-card";

    card.innerHTML = `
      <div class="paper-title" onclick="openPaper('${paper.link}', '${paper.id}')">
        ${paper.title}
      </div>
      <div class="paper-summary">${paper.summary}</div>
      <button class="small-btn" onclick="savePaper('${paper.id}')">
        Save for Later
      </button>
    `;

    container.appendChild(card);
  });
}

function savePaper(paperId) {
  let saved = JSON.parse(localStorage.getItem("savedPapers")) || [];

  if (!saved.includes(paperId)) {
    saved.push(paperId);
    localStorage.setItem("savedPapers", JSON.stringify(saved));
  }

  renderSaved();
}

function renderSaved() {
  const savedIds = JSON.parse(localStorage.getItem("savedPapers")) || [];
  const container = document.getElementById("savedPapers");
  container.innerHTML = "";

  savedIds.forEach(id => {
    const paper = currentResults.find(p => p.id === id);
    if (paper) {
      const card = document.createElement("div");
      card.className = "paper-card saved";

      card.innerHTML = `
        <div class="paper-title" onclick="openPaper('${paper.link}', '${paper.id}')">
          ${paper.title}
        </div>
        <button class="small-btn" onclick="removeSaved('${paper.id}')">
          Remove
        </button>
      `;

      container.appendChild(card);
    }
  });
}

function removeSaved(paperId) {
  let saved = JSON.parse(localStorage.getItem("savedPapers")) || [];
  saved = saved.filter(id => id !== paperId);
  localStorage.setItem("savedPapers", JSON.stringify(saved));
  renderSaved();
}

function openPaper(url, paperId) {
  let recent = JSON.parse(localStorage.getItem("recentPapers")) || [];

  recent = recent.filter(id => id !== paperId);
  recent.unshift(paperId);

  if (recent.length > 5) recent.pop();

  localStorage.setItem("recentPapers", JSON.stringify(recent));

  renderRecent();
  window.open(url, "_blank");
}

function renderRecent() {
  const recentIds = JSON.parse(localStorage.getItem("recentPapers")) || [];
  const container = document.getElementById("recentPapers");
  container.innerHTML = "";

  recentIds.forEach(id => {
    const paper = currentResults.find(p => p.id === id);
    if (paper) {
      const card = document.createElement("div");
      card.className = "paper-card recent";

      card.innerHTML = `
        <div class="paper-title">
          ${paper.title}
        </div>
      `;

      container.appendChild(card);
    }
  });
}
