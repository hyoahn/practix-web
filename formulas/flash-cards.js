document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Data - 'formulas' is already defined in index.html, but let's check
    if (typeof formulas === 'undefined' || !formulas.length) {
        console.error("Flash Cards: No formulas data found!");
        return;
    }

    const container = document.getElementById('flash-card-container');
    if (!container) return;

    let currentIndex = 0;

    // 2. Create HTML Structure
    container.innerHTML = `
        <div class="flash-cards-section">
            <h2 style="text-align: center; margin-bottom: 1.5rem; font-family: 'Space Grotesk', sans-serif;">
                ⚡ Fast Review <span style="font-size:0.6em; color:var(--text-muted); font-weight:400; vertical-align:middle; margin-left:0.5rem">(Flash Cards)</span>
            </h2>
            
            <div class="card-wrapper" id="card-wrapper">
                <!-- Navigation Buttons (Desktop) -->
                <button class="card-nav-btn nav-prev" id="prev-btn" aria-label="Previous Card">←</button>
                <button class="card-nav-btn nav-next" id="next-btn" aria-label="Next Card">→</button>

                <!-- The Card -->
                <div class="flash-card" id="flash-card">
                    <!-- Front -->
                    <div class="card-face card-front">
                        <div class="card-label">Concept #${currentIndex + 1}</div>
                        <div class="card-title">${formulas[currentIndex].name}</div>
                        <div style="margin-top:1.5rem; font-size:0.8rem; color: #94a3b8;">Tap to flip</div>
                    </div>
                    
                    <!-- Back -->
                    <div class="card-face card-back">
                        <div class="card-label">Formula</div>
                        <div class="card-math">\\[ ${formulas[currentIndex].math} \\]</div>
                        <div class="card-gift">💡 ${formulas[currentIndex].gift}</div>
                    </div>
                </div>
            </div>

            <div class="interaction-hint">
                <span>👆 Tap to Flip</span>
                <span>↔️ Swipe / Arrow Keys to Nav</span>
            </div>
        </div>
    `;

    // 3. Select Elements
    const card = document.getElementById('flash-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // 4. Render Function
    const renderCard = (index) => {
        const formula = formulas[index];

        // 1. Reset Flip State (always show front first when changing cards)
        card.classList.remove('is-flipped');

        // 2. Update Content
        // We use a small timeout to allow the flip-back animation to start if it was flipped
        // But for navigation, we want instant updates.

        const frontFace = card.querySelector('.card-front');
        const backFace = card.querySelector('.card-back');

        // Update Text
        frontFace.querySelector('.card-label').textContent = `Concept #${index + 1}`;
        frontFace.querySelector('.card-title').textContent = formula.name;

        // Update Math (Use innerHTML to support MathJax elements if needed, but we rely on re-typesetting)
        const mathContainer = backFace.querySelector('.card-math');
        mathContainer.innerHTML = `\\[ ${formula.math} \\]`; // Reset to raw LaTeX

        backFace.querySelector('.card-gift').innerHTML = `💡 ${formula.gift}`;

        // 3. Re-render MathJax
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([mathContainer]).then(() => {
                // Formatting complete
            }).catch((err) => console.log('MathJax error:', err));
        } else if (window.MathJax && window.MathJax.Hub) {
            // Legacy MathJax support if needed
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, mathContainer]);
        }
    };

    // Initial Render
    renderCard(currentIndex);

    // 5. Navigation Logic
    const nextCard = () => {
        currentIndex = (currentIndex + 1) % formulas.length;
        renderCard(currentIndex);
    };

    const prevCard = () => {
        currentIndex = (currentIndex - 1 + formulas.length) % formulas.length;
        renderCard(currentIndex);
    };

    // 6. Interaction: Click to Flip
    card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });

    // 7. Interaction: Buttons
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card flip
        nextCard();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card flip
        prevCard();
    });

    // 8. Interaction: Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === 'ArrowLeft') prevCard();
        if (e.key === ' ' || e.key === 'Enter') card.classList.toggle('is-flipped');
    });

    // 9. Interaction: Touch / Swipe
    let touchStartX = 0;
    let touchEndX = 0;

    const handleSwipe = () => {
        const threshold = 50; // min distance
        if (touchEndX < touchStartX - threshold) nextCard(); // Swipe Left -> Next
        if (touchEndX > touchStartX + threshold) prevCard(); // Swipe Right -> Prev
    };

    card.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
});
