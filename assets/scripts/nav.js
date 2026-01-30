/**
 * Practix Shared Navigation Component
 * Injects the global navigation bar into pages.
 * Handles relative paths automatically.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine the path depth (if we are in a subfolder like /topics/)
    const currentPath = window.location.pathname;
    // Modular check: Are we in a subfolder? (e.g., /strategy/, /topics/, etc.)
    // If pathname ends with / or has more than one segment, we are likely in a subfolder.
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);
    const isInSubfolder = pathSegments.length > 0 && !currentPath.endsWith('index.html') && pathSegments[0] !== 'index.html';
    // However, since we use folder/index.html, depth 1 subfolders need ../
    // We'll check if we are NOT at the root index.
    const basePath = (currentPath === '/' || currentPath.endsWith('index.html') && pathSegments.length <= 1) ? '' : '../';

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

    // 5. Mobile Toggle Logic
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
            e.stopPropagation();
        });
    }
});
