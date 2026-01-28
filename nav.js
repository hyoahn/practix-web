/**
 * Practix Shared Navigation Component
 * Injects the global navigation bar into pages.
 * Handles relative paths automatically.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine the path depth (if we are in a subfolder like /topics/)
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/topics/') || currentPath.split('/').length > 3; // Simple heuristic
    const basePath = isInSubfolder ? '../' : '';

    // 2. Create the nav element
    const nav = document.createElement('nav');
    
    // 3. Build the HTML structure
    nav.innerHTML = `
        <div class="logo">
            <a href="${basePath}index.html">
                <img src="${basePath}logo.png" alt="Practix">
            </a>
        </div>
        <div class="nav-links">
            <a href="${basePath}index.html" class="nav-btn ${currentPath.endsWith('index.html') || currentPath === '/' ? 'active' : ''}">Home</a>
            <a href="${basePath}desmos.html" class="nav-btn ${currentPath.includes('desmos.html') ? 'active' : ''}">Desmos</a>
            <a href="${basePath}formulas.html" class="nav-btn ${currentPath.includes('formulas.html') ? 'active' : ''}">Formulas</a>
            <a href="${basePath}strategy.html" class="nav-btn ${currentPath.includes('strategy.html') ? 'active' : ''}">Strategy</a>
            <a href="${basePath}hardest-questions.html" class="nav-btn ${currentPath.includes('hardest-questions.html') ? 'active' : ''}">Hard Questions</a>
        </div>
    `;

    // 4. Inject into the page (either replace existing nav or prepend to body)
    const existingNav = document.querySelector('nav:not(.breadcrumb)');
    if (existingNav) {
        existingNav.replaceWith(nav);
    } else {
        document.body.prepend(nav);
    }
});
