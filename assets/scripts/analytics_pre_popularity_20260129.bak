/**
 * Practix Analytics Engine
 * Centralized tracking for user engagement and mastery depth.
 */

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with real ID later

// Initialize GA4
function initGA() {
    if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.log('📊 Analytics: Placeholder active. Set GA_MEASUREMENT_ID to track live.');
        return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
}

// Unified Event Tracker
window.practixLog = function(eventName, params = {}) {
    console.log(`[Practix Tracking] ${eventName}:`, params);
    
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
};

// Auto-bind engagement events
document.addEventListener('DOMContentLoaded', () => {
    initGA();

    // Track Mastery Checkboxes (Formulas)
    document.querySelectorAll('.mastery-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const formulaId = e.target.closest('article')?.id || 'unknown';
            window.practixLog('formula_mastery_toggle', {
                formula_id: formulaId,
                status: e.target.checked ? 'mastered' : 'unmastered'
            });
        });
    });

    // Track Question Reveal (Hard Questions)
    // Assuming we might add an "Answer Reveal" button later, for now we track clicks on the solution-box
    document.querySelectorAll('.solution-box').forEach(box => {
        box.addEventListener('click', () => {
            const questionTitle = box.parentElement.querySelector('h2')?.innerText || 'unknown';
            window.practixLog('solution_view', {
                question: questionTitle
            });
        }, { once: true }); // Only log the first time they see the solution in a session
    });

    // Track Waitlist Clicks
    document.querySelectorAll('a[href*="#waitlist"]').forEach(link => {
        link.addEventListener('click', () => {
            window.practixLog('conversion_intent', {
                target: 'waitlist',
                location: window.location.pathname
            });
        });
    });
});
