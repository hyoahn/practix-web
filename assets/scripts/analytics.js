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

    // Track All Content Clicks (Popularity Engine)
    document.querySelectorAll('[id^="f"], [id^="q"], [id^="m"]').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.tagName === 'ARTICLE' || item.tagName === 'SECTION' ? 'content_block' : 'mini_block';
            window.practixLog('content_popularity_click', {
                content_id: item.id,
                content_type: item.closest('main')?.parentElement?.className || 'unknown',
                location: window.location.pathname
            });
        }, { once: true });
    });

    // Track Waitlist Clicks (Intent)
    document.querySelectorAll('a[href*="#waitlist"]').forEach(link => {
        link.addEventListener('click', () => {
            window.practixLog('conversion_intent', {
                target: 'waitlist',
                location: window.location.pathname
            });
        });
    });

    // Track Actual Tally Submissions (Real Leads)
    window.addEventListener('message', (e) => {
        // Tally sends data objects, check if it exists and has the correct event
        if (e.data && e.data.includes && e.data.includes('Tally.FormSubmitted')) {
            window.practixLog('lead_captured', {
                source: 'tally_popup',
                location: window.location.pathname
            });
        }
        // Fallback for object-based messages (newer Tally API)
        if (e.data && e.data.event === 'Tally.FormSubmitted') {
             window.practixLog('lead_captured', {
                source: 'tally_popup',
                location: window.location.pathname,
                form_id: e.data.payload?.formId
            });
        }
    });
});
