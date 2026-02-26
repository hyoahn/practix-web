function renderFormulaCards() {
    const container = document.getElementById('formulas-dynamic-container');
    if (!container) return;

    let html = '';

    formulas.forEach(formula => {
        // Construct the card
        let cardHtml = `
            <article class="formula-card" id="${formula.link.replace('#', '')}">
                <span class="category-badge cat-alg">${formula.category || 'Algebra'}</span>
                <h3>${formula.name}</h3>
        `;

        if (formula.visual) {
            // Visual is already pre-compiled HTML string in the data
            cardHtml += `<div class="card-visual" style="margin-top: 2rem;">${formula.visual}</div>`;
        } else if (formula.math) {
            cardHtml += `
                <div class="formula-display">\\[ ${formula.math} \\]</div>
                <p class="formula-explanation">${formula.gift || 'Important shortcut'}</p>
            `;
        }

        // TODO: Map step-by-step logic from data if it exists
        // Currently relying on existing structure matching the spec

        cardHtml += `</article>`;
        html += cardHtml;
    });

    container.innerHTML = html;

    // Trigger MathJax typesetting if available
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([container]).catch((err) => console.log(err.message));
    }
}

document.addEventListener('DOMContentLoaded', renderFormulaCards);
