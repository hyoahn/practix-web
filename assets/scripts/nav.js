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
        <div class="nav-links">
            <a href="${basePath}index.html" class="nav-btn ${currentPath.endsWith('index.html') || currentPath === '/' ? 'active' : ''}">Home</a>
            <a href="${basePath}strategy/" class="nav-btn ${currentPath.includes('/strategy/') ? 'active' : ''}">Strategy</a>
            <a href="${basePath}formulas/" class="nav-btn ${currentPath.includes('/formulas/') ? 'active' : ''}">Formulas</a>
            <a href="${basePath}desmos/" class="nav-btn ${currentPath.includes('/desmos/') ? 'active' : ''}">Desmos</a>
            <a href="${basePath}hard-questions/" class="nav-btn ${currentPath.includes('/hard-questions/') ? 'active' : ''}">Hardest Questions</a>
            <a href="${basePath}contact/" class="nav-btn ${currentPath.includes('/contact/') ? 'active' : ''}">Contact</a>
        </div>
    `;

    // 4. Inject into the page
    // Look for various insertion points
    const existingNav = document.querySelector('nav:not(.breadcrumb)');
    const navPlaceholder = document.body.querySelector('body > :first-child');

    if (existingNav) {
        existingNav.replaceWith(nav);
    } else {
        // Prepend to body, ensuring it's before any specific content containers
        document.body.insertBefore(nav, document.body.firstChild);
    }
});
