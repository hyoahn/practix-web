/**
 * Digital SAT Score Predictor
 * Simulates the adaptive nature of the new SAT.
 */

document.addEventListener('DOMContentLoaded', () => {
    const m1Input = document.getElementById('m1-mistakes');
    const m2Input = document.getElementById('m2-mistakes');
    const m1Value = document.getElementById('m1-value');
    const m2Value = document.getElementById('m2-value');
    const scoreDisplay = document.getElementById('predicted-score');
    const messageDisplay = document.getElementById('predictor-message');
    const predictorSection = document.getElementById('score-predictor');

    if (!m1Input || !m2Input) return; // Guard clause if elements don't exist yet

    function updateScore() {
        const m1 = parseInt(m1Input.value) || 0;
        const m2 = parseInt(m2Input.value) || 0;

        // Update UI numbers
        m1Value.textContent = m1;
        m2Value.textContent = m2;

        const result = calculateSATMathScore(m1, m2);
        
        // Animate score count-up
        animateValue(scoreDisplay, parseInt(scoreDisplay.textContent) || 600, result.score, 500);
        
        // Update message and color
        messageDisplay.textContent = result.message;
        messageDisplay.className = 'predictor-message ' + result.status; // safe, warning, danger
        
        // Update section border/glow based on status
        predictorSection.className = 'predictor-section ' + result.status;
    }

    // Attach listeners
    m1Input.addEventListener('input', updateScore);
    m2Input.addEventListener('input', updateScore);
    
    // Initial run
    updateScore();
});

/**
 * Approximate scoring algorithm for Digital SAT Math
 */
function calculateSATMathScore(m1Mistakes, m2Mistakes) {
    const totalMistakes = m1Mistakes + m2Mistakes;
    let score;
    let status;
    let message;

    // 1. Adaptive Logic: Did they route to Easy Module 2?
    // Threshold is typically around 7-9 mistakes in Module 1.
    const isEasyModule2 = m1Mistakes > 7;

    if (isEasyModule2) {
        // --- EASY MODULE 2 ROUTING ---
        // Cap is significantly lower (usually max 600-650 depending on curve).
        // Penalty per question is softer, but the ceiling is the problem.
        
        const baseScore = 600; 
        // Penalize heavily for potential "Hard" questions they missed in Mod 1 that routed them here
        score = baseScore - (totalMistakes * 10);
        
        status = 'danger';
        message = "⚠️ Danger Zone: High Module 1 errors likely routed you to the Easy Module 2. Your score is capped. You need to train endurance.";
        
    } else {
        // --- HARD MODULE 2 ROUTING ---
        // Access to 800 is possible.
        // Penalty is steeper per question because questions are weighted higher.
        
        const baseScore = 800;
        
        if (totalMistakes === 0) {
            score = 800;
        } else if (totalMistakes <= 2) {
            score = 790 - ((totalMistakes - 1) * 10);
        } else {
            // Curve approximation
            score = baseScore - (totalMistakes * 15); // Rough avg 15 pts per q
        }
        
        status = totalMistakes < 5 ? 'safe' : 'warning';
        
        if (score >= 750) {
            message = "🌟 Elite Range: You are on track for a top-tier score. Fix those last few gaps.";
        } else {
            message = "📈 Good Potential: You made the Hard Module, but specific concept gaps are dragging you down.";
        }
    }

    // Clamp score
    if (score < 200) score = 200;
    if (score > 800) score = 800;

    // Round to nearest 10
    score = Math.round(score / 10) * 10;

    return { score, status, message };
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}
