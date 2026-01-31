/**
 * Practix Shared Navigation Component
 * Injects the global navigation bar into pages.
 * Handles relative paths automatically.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine the path depth
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);

    // If the last segment is a file (like index.html), don't count it for depth
    const hasFile = pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.');
    const depth = hasFile ? pathSegments.length - 1 : pathSegments.length;

    // Build relative basePath (e.g., "", "../", "../../")
    const basePath = depth === 0 ? '' : '../'.repeat(depth);

    // 2. Create the nav element
    const nav = document.createElement('nav');

    // 3. Build the HTML structure
    nav.innerHTML = `
        <div class="logo">
            <a href="${basePath}index.html">
                <img src="${basePath}assets/images/logo.png" alt="Practix">
            </a>
        </div>
        <button class="hamburger" id="nav-toggle" aria-label="Toggle Navigation">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <div class="nav-links" id="nav-menu">
            <a href="${basePath}index.html" class="nav-btn ${currentPath.endsWith('index.html') || currentPath === '/' ? 'active' : ''}">Home</a>
            <a href="${basePath}strategy/" class="nav-btn ${currentPath.includes('/strategy/') ? 'active' : ''}">Strategy</a>
            <a href="${basePath}formulas/" class="nav-btn ${currentPath.includes('/formulas/') ? 'active' : ''}">Formulas</a>
            <a href="${basePath}desmos/" class="nav-btn ${currentPath.includes('/desmos/') ? 'active' : ''}">Desmos</a>
            <a href="${basePath}hard-questions/" class="nav-btn ${currentPath.includes('/hard-questions/') ? 'active' : ''}">Hardest Questions</a>
            <a href="${basePath}wallpapers/" class="nav-btn ${currentPath.includes('/wallpapers/') ? 'active' : ''}" style="color: var(--accent-primary); font-weight: 700;">Wallpapers</a>
            <button id="layout-toggle" 
                    class="nav-btn icon-btn" 
                    title="Toggle Footer Panel" 
                    style="display: flex; align-items: center; justify-content: center; padding: 0.5rem; cursor: pointer;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="15" x2="21" y2="15"></line>
                </svg>
            </button>
            <a href="${basePath}contact/" class="nav-btn ${currentPath.includes('/contact/') ? 'active' : ''}">Contact</a>
        </div>
    `;

    // 4. Inject into the page
    const existingNav = document.body.querySelector('nav:not(.breadcrumb)');
    if (existingNav) {
        existingNav.replaceWith(nav);
    } else {
        document.body.insertBefore(nav, document.body.firstChild);
    }

    // 5. Layout Toggle Logic (Self-contained)
    const layoutBtn = document.getElementById('layout-toggle');
    if (layoutBtn) {
        // Sync initial state color
        const storedState = localStorage.getItem('practix_ui_footer_hidden');
        const isHidden = (storedState === null || storedState === 'true');
        layoutBtn.style.color = isHidden ? 'var(--text-muted)' : 'var(--accent-primary)';

        layoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Keep it here to avoid closing menu if nested, or just for safety

            console.log('Practix: Layout toggle clicked');

            // Find by ID
            const footer = document.getElementById('practix-global-footer-panel');
            if (!footer) {
                console.warn('Practix: #practix-global-footer-panel not found');
                return;
            }

            const isCurrentlyVisible = footer.classList.contains('visible') || footer.style.display === 'flex';
            const nextTargetVisible = !isCurrentlyVisible;

            if (nextTargetVisible) {
                footer.classList.add('visible');
                footer.style.display = 'flex';
                footer.style.opacity = '1';
                footer.style.visibility = 'visible';
                setTimeout(() => {
                    footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                footer.classList.remove('visible');
                footer.style.display = 'none';
            }

            localStorage.setItem('practix_ui_footer_hidden', !nextTargetVisible);
            layoutBtn.style.color = nextTargetVisible ? 'var(--accent-primary)' : 'var(--text-muted)';
        });
    }

    // 6. Mobile Toggle Logic
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            menu.classList.remove('active');
        });

        menu.addEventListener('click', (e) => {
            // Only stop if they didn't click a link
            if (!e.target.closest('a')) {
                e.stopPropagation();
            }
        });
    }
});
