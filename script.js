const container = document.getElementById("papers-container");
const searchInput = document.getElementById("search");

let papers = [
    {
        title: "Deep Reinforcement Learning for Trading",
        summary: "This paper explores RL agents for market decision making.",
        link: "https://arxiv.org"
    },
    {
        title: "Transformer Models in Finance",
        summary: "Using attention mechanisms to predict stock trends.",
        link: "https://arxiv.org"
    }
];
function renderPapers(list) {
    container.innerHTML = "";

    list.forEach((paper, index) => {
        const card = document.createElement("div");
        card.className = "paper-card";
        card.style.animation = `fadeIn 0.4s ease ${index * 0.05}s forwards`;
        card.style.opacity = "0";

        card.innerHTML = `
            <div class="paper-title">${paper.title}</div>
            <div class="paper-summary">${paper.summary}</div>
            <a class="paper-link" href="${paper.link}" target="_blank">
                Read Paper →
            </a>
        `;

        container.appendChild(card);
    });
}

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = papers.filter(p =>
        p.title.toLowerCase().includes(value)
    );

    renderPapers(filtered);
});
renderPapers(papers);
