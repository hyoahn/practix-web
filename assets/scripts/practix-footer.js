/**
 * Practix Global Footer Component
 * Injects a SEO-friendly footer with link categories.
 * Features: Collapsible Pane (User Preference Persisted)
 */

console.log('Practix Footer v23 Loaded'); // Debug: Ensure script update

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine Robust Path Depth (Same as nav.js)
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);
    const hasFile = pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.');
    const depth = hasFile ? pathSegments.length - 1 : pathSegments.length;
    const basePath = depth === 0 ? '' : '../'.repeat(depth);
    const isInSubfolder = depth > 0;

    // 2. Initial State (Default to HIDDEN)
    const storedState = localStorage.getItem('practix_ui_footer_hidden');
    const isHidden = storedState === null ? true : storedState === 'true';

    // 3. Create footer element
    const footer = document.createElement('footer');
    footer.id = 'practix-global-footer-panel';
    footer.className = `practix-footer-panel ${!isHidden ? 'visible' : ''}`;

    // Explicitly set flex if visible (override CSS display:none)
    if (!isHidden) {
        footer.style.display = 'flex';
    }

    // AGGRESSIVE PURGE: Remove ALL existing footers to prevent duplicates
    const allFooters = document.querySelectorAll('footer');
    allFooters.forEach(f => f.remove());

    console.log('Practix Footer Init (v23): Hidden =', isHidden);

    // 4. Define Topic Loop
    const topics = [
        { name: "Quadratic Equations", path: "quadratic-equations.html", icon: "📐" },
        { name: "Circle Equations", path: "circle-equations.html", icon: "⭕" },
        { name: "Systems of Equations", path: "systems-of-equations.html", icon: "🤝" },
        { name: "Polynomial Division", path: "polynomial-division.html", icon: "➗" },
        { name: "Discriminant Hack", path: "discriminant-trick.html", icon: "⚡" },
        { name: "Exponential Growth", path: "exponential-growth.html", icon: "📈" },
        { name: "Unit Circle Hack", path: "unit-circle.html", icon: "🎯" }
    ];

    let loopHTML = '';
    if (isInSubfolder) {
        // Find current topic index
        const filename = currentPath.split('/').pop();
        const currentIndex = topics.findIndex(t => filename.includes(t.path.replace('.html', '')));
        const nextTopic = topics[(currentIndex + 1) % topics.length];

        loopHTML = `
            <div style="max-width: 800px; margin: 0 auto 4rem; background: rgba(99, 102, 241, 0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2); text-align: center;">
                <p style="color: #6366f1; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.8rem;">Master the Next Trick</p>
                <h3 style="margin-bottom: 1.5rem; color: white;">${nextTopic.icon} ${nextTopic.name}</h3>
                <a href="${nextTopic.path}" class="btn-primary" style="display: inline-block; padding: 0.8rem 2rem; text-decoration: none;">Keep Training →</a>
            </div>
        `;
    }

    // 5. HTML Structure
    footer.innerHTML = `
        <div class="footer-content">

            <div style="max-width: 1200px; margin: 0 auto;">
                ${loopHTML}
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 2rem; text-align: left;">
                    <div>
                        <h4 style="color: #6366f1; margin-bottom: 1.5rem; font-family: 'Space Grotesk', sans-serif;">Practix</h4>
                        <p style="font-size: 0.9rem; opacity: 0.7; line-height: 1.6;">
                            Stop studying. Start training. The flight simulator for the Digital SAT.
                        </p>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 1.5rem;">Resources</h4>
                        <ul style="list-style: none; padding: 0; font-size: 0.9rem; line-height: 2;">
                            <li><a href="${basePath}formulas.html" style="color: white; opacity: 0.7; text-decoration: none;">Formula Hub</a></li>
                            <li><a href="${basePath}desmos.html" style="color: white; opacity: 0.7; text-decoration: none;">Desmos Tricks</a></li>
                            <li><a href="${basePath}strategy.html" style="color: white; opacity: 0.7; text-decoration: none;">800 Strategy</a></li>
                            <li><a href="${basePath}contact.html" style="color: white; opacity: 0.7; text-decoration: none;">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 1.5rem;">Topic Guides</h4>
                        <ul style="list-style: none; padding: 0; font-size: 0.9rem; line-height: 2;">
                            <li><a href="${basePath}topics/quadratic-equations.html" style="color: white; opacity: 0.7; text-decoration: none;">Quadratic Equations</a></li>
                            <li><a href="${basePath}topics/circle-equations.html" style="color: white; opacity: 0.7; text-decoration: none;">Circle Equations</a></li>
                            <li><a href="${basePath}topics/systems-of-equations.html" style="color: white; opacity: 0.7; text-decoration: none;">Systems of Equations</a></li>
                            <li><a href="${basePath}topics/polynomial-division.html" style="color: white; opacity: 0.7; text-decoration: none;">Polynomial Division</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 1.5rem;">Quick Hacks</h4>
                        <ul style="list-style: none; padding: 0; font-size: 0.9rem; line-height: 2;">
                            <li><a href="${basePath}topics/discriminant-trick.html" style="color: white; opacity: 0.7; text-decoration: none;">Discriminant Hack</a></li>
                            <li><a href="${basePath}topics/exponential-growth.html" style="color: white; opacity: 0.7; text-decoration: none;">Growth & Decay</a></li>
                            <li><a href="${basePath}topics/unit-circle.html" style="color: white; opacity: 0.7; text-decoration: none;">Unit Circle Hack</a></li>
                            <li><a href="${basePath}hardest-questions.html" style="color: white; opacity: 0.7; text-decoration: none;">Hardest Questions</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-copyright" style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4rem; padding-top: 2rem; text-align: center; font-size: 0.8rem; opacity: 0.5;">
                    &copy; 2026 Practix. Train different.
                </div>
            </div>
        </div>
    `;

    // 6. Inject with Reflow Logic (Handle Pillar Constraints)
    const stageScroll = document.querySelector('.stage-content-scroll');

    if (stageScroll) {
        // PILLAR PAGES: Unwrap constraints
        // Create a wrapper for the existing content to keep it constrained
        const wrapper = document.createElement('div');
        wrapper.className = 'practix-content-wrapper';

        // Move all children into the wrapper
        while (stageScroll.firstChild) {
            wrapper.appendChild(stageScroll.firstChild);
        }

        // Append wrapper back to stage
        stageScroll.appendChild(wrapper);

        // Apply reflow class to remove padding from parent
        stageScroll.classList.add('practix-reflow');

        // Append footer OUTSIDE wrapper but INSIDE stage (Full Width!)
        stageScroll.appendChild(footer);

    } else {
        // HOMEPAGE / FALLBACK: Standard append
        const target = document.querySelector('.main-content') ||
            document.querySelector('.main-stage') ||
            document.body;
        if (target) {
            target.appendChild(footer);
        }
    }

    // 7. Global Interface for Toggle
    window.practixToggleLayout = function () {
        footer.classList.toggle('visible');
        const isVisible = footer.classList.contains('visible');
        footer.style.display = isVisible ? 'flex' : 'none';
        localStorage.setItem('practix_ui_footer_hidden', !isVisible);

        // Return state for button sync
        return !isVisible;
    };
});
