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
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
}

// Unified Event Tracker
window.practixLog = function (eventName, params = {}) {
    console.log(`[Practix Tracking] ${eventName}:`, params);

    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }

    // Forward to Live Pulse Relay
    if (window.PulseRelay) {
        window.PulseRelay.broadcast(eventName, params);
    }
};

// Auto-bind engagement events
document.addEventListener('DOMContentLoaded', () => {
    initGA();

    // Track Mastery Checkboxes (Formulas)
    let masteredCount = parseInt(localStorage.getItem('practix_mastery_count') || '0');

    document.querySelectorAll('.mastery-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const formulaId = e.target.closest('article')?.id || 'unknown';
            const isChecked = e.target.checked;

            window.practixLog('formula_mastery_toggle', {
                formula_id: formulaId,
                status: isChecked ? 'mastered' : 'unmastered'
            });

            if (isChecked) {
                masteredCount++;
                localStorage.setItem('practix_mastery_count', masteredCount);

                // Trigger Wallpaper Reward at 5 Masteries
                if (masteredCount === 5) {
                    showMasteryReward();
                }
            }
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

/**
 * SHOW MASTERY REWARD POPUP
 */
function showMasteryReward() {
    const rewardDiv = document.createElement('div');
    rewardDiv.id = 'mastery-reward-popup';
    rewardDiv.style = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #0f172a; color: white; padding: 2.5rem; border-radius: 24px;
        box-shadow: 0 30px 60px rgba(0,0,0,0.5); border: 2px solid #6366f1;
        z-index: 10000; max-width: 400px; text-align: center; font-family: 'Space Grotesk', sans-serif;
    `;

    rewardDiv.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Intensity Milestone!</h2>
        <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 2rem; line-height: 1.5;">
            You just mastered 5 SAT formulas. You've earned the <strong>Elite Lock Screen</strong> pack to keep these fresh in your brain.
        </p>
        <a href="/wallpapers/" class="btn-primary" style="display: block; text-decoration: none; background: #6366f1; padding: 1rem; border-radius: 12px; font-weight: 700; margin-bottom: 1rem;">Claim Reward</a>
        <button onclick="this.parentElement.remove()" style="background: transparent; color: white; opacity: 0.5; border: none; cursor: pointer; font-size: 0.8rem;">Maybe later</button>
    `;

    document.body.appendChild(rewardDiv);

    window.practixLog('reward_popup_shown', { type: 'wallpaper_pack' });
}
