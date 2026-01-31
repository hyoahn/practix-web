/**
 * Practix Global Footer Component
 * Injects a SEO-friendly footer with link categories.
 * Features: Collapsible Pane (User Preference Persisted)
 */

console.log('Practix Footer v2 Loaded'); // Debug: Ensure script update

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine path depth
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/topics/') ||
        (currentPath.includes('topics/') && !currentPath.includes('../topics/'));
    const basePath = isInSubfolder ? '../' : '';

    // 2. Initial State (Default to COLLAPSED)
    const storedState = localStorage.getItem('practix_footer_collapsed');
    // If no state stored, default to TRUE (Collapsed/Hidden)
    const isCollapsed = storedState === null ? true : storedState === 'true';

    // 3. Create footer element
    const footer = document.createElement('footer');
    footer.className = `practix-footer ${isCollapsed ? 'collapsed' : ''}`;

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
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: left;">
                    <div>
                        <h4 style="color: #6366f1; margin-bottom: 1.5rem; font-family: 'Space Grotesk', sans-serif;">Practix</h4>
                        <p style="font-size: 0.9rem; opacity: 0.7; line-height: 1.6;">
                            Stop studying. Start training. The flight simulator for the Digital SAT.
                        </p>
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
                    <div>
                        <h4 style="margin-bottom: 1.5rem;">Resources</h4>
                        <ul style="list-style: none; padding: 0; font-size: 0.9rem; line-height: 2;">
                            <li><a href="${basePath}formulas.html" style="color: white; opacity: 0.7; text-decoration: none;">Formula Hub</a></li>
                            <li><a href="${basePath}desmos.html" style="color: white; opacity: 0.7; text-decoration: none;">Desmos Tricks</a></li>
                            <li><a href="${basePath}strategy.html" style="color: white; opacity: 0.7; text-decoration: none;">800 Strategy</a></li>
                            <li><a href="${basePath}contact.html" style="color: white; opacity: 0.7; text-decoration: none;">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-copyright" style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4rem; padding-top: 2rem; text-align: center; font-size: 0.8rem; opacity: 0.5;">
                    &copy; 2026 Practix. Train different.
                </div>
            </div>
        </div>
    `;

    // 6. Inject
    const targetContainer = document.querySelector('.main-content') || document.body;
    const existingFooter = document.querySelector('footer');

    if (existingFooter) {
        existingFooter.replaceWith(footer);
    } else {
        targetContainer.appendChild(footer);
    }

    if (existingFooter) {
        existingFooter.replaceWith(footer);
    } else {
        targetContainer.appendChild(footer);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine path depth
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/topics/') ||
        (currentPath.includes('topics/') && !currentPath.includes('../topics/'));
    const basePath = isInSubfolder ? '../' : '';

    // 2. Create footer element
    const footer = document.createElement('footer');
    footer.style.background = '#1a1a2e';
    footer.style.color = 'white';
    footer.style.padding = '4rem 5% 2rem';
    footer.style.marginTop = '4rem';

    // 3. Define Topic Loop
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

    // 4. HTML Structure
    footer.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto;">
            ${loopHTML}
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: left;">
                <div>
                    <h4 style="color: #6366f1; margin-bottom: 1.5rem; font-family: 'Space Grotesk', sans-serif;">Practix</h4>
                    <p style="font-size: 0.9rem; opacity: 0.7; line-height: 1.6;">
                        Stop studying. Start training. The flight simulator for the Digital SAT.
                    </p>
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
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Resources</h4>
                    <ul style="list-style: none; padding: 0; font-size: 0.9rem; line-height: 2;">
                        <li><a href="${basePath}formulas.html" style="color: white; opacity: 0.7; text-decoration: none;">Formula Hub</a></li>
                        <li><a href="${basePath}desmos.html" style="color: white; opacity: 0.7; text-decoration: none;">Desmos Tricks</a></li>
                        <li><a href="${basePath}strategy.html" style="color: white; opacity: 0.7; text-decoration: none;">800 Strategy</a></li>
                        <li><a href="${basePath}contact.html" style="color: white; opacity: 0.7; text-decoration: none;">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4rem; padding-top: 2rem; text-align: center; font-size: 0.8rem; opacity: 0.5;">
            &copy; 2026 Practix. Train different.
        </div>
    `;

    // 4. Inject
    const targetContainer = document.querySelector('.main-content') || document.body;
    const existingFooter = document.querySelector('footer');

    if (existingFooter) {
        existingFooter.replaceWith(footer);
    } else {
        targetContainer.appendChild(footer);
    }
});
