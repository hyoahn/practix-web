/**
 * Practix Desktop Sidebar (Separation Strategy)
 * RESTORED LOGIC FOR TREE VIEW + RAIL
 * Handles Rail Rendering AND Sidebar Panel Injection.
 */

// 1. GLOBAL PATH UTILS (Essential for Deep Links)
window.PRACTIX_BASE_PATH = (function () {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);
    const rootIndex = pathSegments.indexOf('_Sever');
    let depth = 0;
    if (rootIndex !== -1) {
        const segmentsAfterRoot = pathSegments.slice(rootIndex + 1);
        const hasFile = segmentsAfterRoot.length > 0 && segmentsAfterRoot[segmentsAfterRoot.length - 1].includes('.');
        depth = hasFile ? segmentsAfterRoot.length - 1 : segmentsAfterRoot.length;
    } else {
        const hasFile = pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.');
        depth = hasFile ? pathSegments.length - 1 : pathSegments.length;
    }
    return depth === 0 ? '' : '../'.repeat(depth);
})();

// 2. DATA STRUCTURES (Matches sidebar.js.bak)
const NAV_ITEMS_GLOBAL = [
    { id: 'home', name: 'Home', icon: '🏠', path: '', hasFlyout: false },
    { id: 'app', name: 'App', icon: '🚀', path: 'app/', hasFlyout: false },
    { id: 'math', name: 'Math', icon: '📐', path: 'math/', hasFlyout: true },
    { id: 'formulas', name: 'Formulas', icon: 'Σ', path: 'formulas/', hasFlyout: true },
    { id: 'hard-questions', name: 'Hardest Questions', icon: '☠️', path: 'hard-questions/', hasFlyout: true },
    { id: 'desmos', name: 'Desmos', icon: 'y=', path: 'desmos/', hasFlyout: true },
    { id: 'wallpapers', name: 'Wallpapers', icon: '📱', path: 'wallpapers/', hasFlyout: false },
    { id: 'contact', name: 'About Us', icon: 'ℹ️', path: 'contact/', hasFlyout: false }
];

const PILLARS_CONFIG = [
    {
        id: 'formulas',
        name: 'SAT Math Formulas',
        icon: 'Σ',
        path: 'formulas/',
        categories: [
            {
                name: "Heart of Algebra",
                path: "formulas/heart-of-algebra/",
                subsections: [
                    { name: "Variables in Linear Equations", topics: [{ name: "Basics", path: "formulas/heart-of-algebra/linear-equations/index.html" }] },
                    { name: "Lines and Linear Functions", topics: [{ name: "Slope & Lines", path: "formulas/heart-of-algebra/slope-and-lines/index.html" }] },
                    { name: "Systems of Linear Equations", topics: [{ name: "System Basics", path: "formulas/heart-of-algebra/linear-equations/index.html#intersect-meaning" }] },
                    { name: "Linear Inequalities", topics: [{ name: "Inequality Shading", path: "formulas/heart-of-algebra/linear-equations/index.html#ineq-shade" }] },
                    { name: "Word Problems on Linear Equations", topics: [] }
                ]
            },
            {
                name: "Advanced Math",
                path: "formulas/passport-to-advanced-math/",
                subsections: [
                    { name: "Polynomial Functions", topics: [{ name: "Polynomial Basics", path: "formulas/index.html" }] },
                    { name: "Quadratic Equations and Parabola", topics: [{ name: "Parabola Mastery", path: "formulas/passport-to-advanced-math/parabola-mastery/index.html" }] },
                    { name: "Solutions of Linear Expressions", topics: [] },
                    { name: "Absolute Value", topics: [] },
                    { name: "Ratios, Proportions, and Rates", topics: [] },
                    { name: "Percentages", topics: [{ name: "Percent Change", path: "formulas/heart-of-algebra/percent-change-shortcuts/index.html" }] },
                    { name: "Exponents", topics: [] },
                    { name: "Exponential Growth and Decay", topics: [{ name: "Growth Basics", path: "formulas/passport-to-advanced-math/exponential-growth/index.html" }] },
                    { name: "Manipulating Expressions", topics: [{ name: "Factoring Patterns", path: "formulas/passport-to-advanced-math/factoring-patterns/index.html" }] }
                ]
            },
            {
                name: "Problem-Solving & Data Analysis",
                path: "formulas/problem-solving-data-analysis/",
                subsections: [
                    { name: "Probability", topics: [] },
                    { name: "Reading Graphs", topics: [] },
                    { name: "Histograms and Bar Graphs", topics: [] },
                    { name: "Statistics (Mean, Median, Mode)", topics: [{ name: "Averages & Mixtures", path: "formulas/heart-of-algebra/averages-and-mixtures/index.html" }] },
                    { name: "Median and Range in Box Plots", topics: [] },
                    { name: "Studies and Data Interpretation", topics: [] }
                ]
            },
            {
                name: "Geometry & Trigonometry",
                path: "formulas/geometry-trigonometry/",
                subsections: [
                    { name: "Circles", topics: [{ name: "Circle Equations", path: "formulas/geometry-trigonometry/circle-equations/index.html" }] },
                    { name: "Lines and Angles", topics: [] },
                    { name: "Triangles", topics: [{ name: "Triangle Basics", path: "formulas/index.html" }] },
                    { name: "Quadrilaterals", topics: [] },
                    { name: "Three-Dimensional Figures", topics: [] },
                    { name: "Trigonometry", topics: [{ name: "Trignometry Hacks", path: "formulas/geometry-trigonometry/trigonometry-hacks/index.html" }] }
                ]
            }
        ]
    },
    {
        id: 'desmos',
        name: 'Desmos SAT Calculator',
        icon: 'y=',
        path: 'desmos/',
        categories: [
            {
                name: "Heart of Algebra",
                path: "desmos/",
                subsections: [
                    { name: "Variables in Linear Equations", topics: [] },
                    { name: "Lines and Linear Functions", topics: [{ name: "Linear Equations", path: "desmos/linear-equations/index.html" }] },
                    { name: "Systems of Linear Equations", topics: [{ name: "System Solver", path: "desmos/system-solver/index.html" }] },
                    { name: "Linear Inequalities", topics: [{ name: "Inequality Shading", path: "desmos/inequality-shading/index.html" }] },
                    { name: "Word Problems on Linear Equations", topics: [] }
                ]
            },
            {
                name: "Advanced Math",
                path: "desmos/",
                subsections: [
                    { name: "Polynomial Functions", topics: [{ name: "Polynomial Roots", path: "desmos/poly-roots/index.html" }] },
                    { name: "Quadratic Equations and Parabola", topics: [] },
                    { name: "Solutions of Linear Expressions", topics: [] },
                    { name: "Absolute Value", topics: [{ name: "Absolute Value Solve", path: "desmos/absolute-value/index.html" }] },
                    { name: "Ratios, Proportions, and Rates", topics: [] },
                    { name: "Percentages", topics: [] },
                    { name: "Exponents", topics: [] },
                    { name: "Exponential Growth and Decay", topics: [] },
                    { name: "Manipulating Expressions", topics: [] }
                ]
            },
            {
                name: "Problem-Solving & Data Analysis",
                path: "desmos/",
                subsections: [
                    { name: "Probability", topics: [] },
                    { name: "Reading Graphs", topics: [{ name: "Visualization Hacks", path: "desmos/visualization-hacks/index.html" }] },
                    { name: "Histograms and Bar Graphs", topics: [] },
                    { name: "Statistics (Mean, Median, Mode)", topics: [{ name: "Mean vs Median", path: "desmos/mean-vs-median/index.html" }] },
                    { name: "Median and Range in Box Plots", topics: [] },
                    { name: "Studies and Data Interpretation", topics: [] }
                ]
            },
            {
                name: "Geometry & Trigonometry",
                path: "desmos/",
                subsections: [
                    { name: "Circles", topics: [{ name: "Circle Maker", path: "desmos/circle-equations/index.html" }] },
                    { name: "Lines and Angles", topics: [] },
                    { name: "Triangles", topics: [] },
                    { name: "Quadrilaterals", topics: [] },
                    { name: "Three-Dimensional Figures", topics: [] },
                    { name: "Trigonometry", topics: [] }
                ]
            }
        ]
    },
    {
        id: 'hard-questions',
        name: 'Hardest Questions',
        icon: '☠️',
        path: 'hard-questions/',
        categories: [
            {
                name: "Heart of Algebra",
                path: "hard-questions/",
                subsections: [
                    { name: "Variables in Linear Equations", topics: [] },
                    { name: "Lines and Linear Functions", topics: [{ name: "Algebra Traps", path: "hard-questions/algebra/index.html" }] },
                    { name: "Systems of Linear Equations", topics: [{ name: "System Solutions", path: "hard-questions/system-solutions/index.html" }] },
                    { name: "Linear Inequalities", topics: [] },
                    { name: "Word Problems on Linear Equations", topics: [] }
                ]
            },
            {
                name: "Advanced Math",
                path: "hard-questions/",
                subsections: [
                    { name: "Polynomial Functions", topics: [] },
                    { name: "Quadratic Equations and Parabola", topics: [{ name: "Discriminant Dangers", path: "hard-questions/discriminant-dangers/index.html" }] }
                ]
            }
        ]
    },
    {
        id: 'math',
        name: 'SAT Math Knowledge',
        icon: '📐',
        path: 'math/',
        categories: [
            {
                name: "Heart of Algebra",
                path: "math/",
                subsections: [
                    { name: "Variables in Linear Equations", topics: [{ name: "Basics", path: "math/linear-equations/index.html" }] },
                    { name: "Lines and Linear Functions", topics: [{ name: "Lines & Graphs", path: "math/linear-equations/index.html#interpreting" }] },
                    { name: "Systems of Linear Equations", topics: [{ name: "Systems", path: "math/systems/index.html" }] },
                    { name: "Linear Inequalities", topics: [{ name: "Inequalities", path: "math/inequalities/index.html" }] },
                    { name: "Word Problems on Linear Equations", topics: [] }
                ]
            }
        ]
    }
];

// 2. PATH UTILS
window.PRACTIX_PILLARS = PILLARS_CONFIG;

window.PRACTIX_NORMALIZE_HREF = function (href) {
    if (!href || href.startsWith('#')) return href;
    const [pathPart, extra] = href.split(/(?=[#?])/);
    let normalized = pathPart;
    if (normalized.endsWith('/') || !normalized.split('/').pop().includes('.')) {
        if (!normalized.endsWith('/')) normalized += '/';
        normalized += 'index.html';
    }
    return normalized + (extra || '');
};

// 3. INJECTION LOGIC (Fix for Missing Container)
function ensureDesktopSidebar() {
    const rail = document.getElementById('narrow-rail');
    if (!rail) return null;

    let sidebar = document.getElementById('practix-desktop-sidebar');
    if (!sidebar) {
        // Create Sidebar Container
        sidebar = document.createElement('div');
        sidebar.id = 'practix-desktop-sidebar';
        sidebar.className = 'command-sidebar-injected'; // Custom class to avoid overrides

        // Inject Search Bar + Tree Container
        sidebar.innerHTML = `
            <div class="sidebar-search-container">
                <div class="sidebar-search-wrapper">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="sidebar-search" placeholder="Search hacks..." autocomplete="off">
                </div>
            </div>
            <div id="sidebar-tree" class="sidebar-tree"></div>
            <div class="sidebar-resize-handle"></div>
        `;

        // Inject Styles Locally to ensure they work
        const style = document.createElement('style');
        style.textContent = `
            #practix-desktop-sidebar {
                position: fixed !important;
                top: 0;
                left: 60px;
                bottom: 0;
                width: 320px;
                background: white;
                border-right: 1px solid #e5e7eb;
                z-index: 2147483647 !important; /* MAX INT to be sure */
                display: flex !important;
                flex-direction: column;
                box-shadow: 4px 0 24px rgba(0,0,0,0.02);
                opacity: 1 !important;
                visibility: visible !important;
            }
            .sidebar-search-container {
                padding: 1.5rem;
                border-bottom: 1px solid #f3f4f6;
            }
            .sidebar-search-wrapper {
                position: relative;
                width: 100%;
            }
            #sidebar-search {
                width: 100%;
                padding: 0.75rem 1rem 0.75rem 2.5rem;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                font-size: 0.9rem;
                background: #f9fafb;
                transition: all 0.2s;
            }
            #sidebar-search:focus {
                background: white;
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                outline: none;
            }
            .search-icon {
                position: absolute;
                left: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                font-size: 1rem;
                opacity: 0.5;
            }
            .sidebar-tree {
                flex: 1;
                overflow-y: auto;
                padding: 1.5rem;
            }
            .side-tree-group h4 {
                font-size: 0.75rem;
                font-weight: 800;
                text-transform: uppercase;
                color: #9ca3af;
                letter-spacing: 0.05em;
                margin-bottom: 1rem;
                margin-top: 1.5rem;
            }
            .side-tree-group:first-child h4 { margin-top: 0; }
            .side-tree-subsection {
                margin-bottom: 0.5rem;
                padding-left: 0.5rem;
                border-left: 2px solid #e5e7eb;
            }
            .side-tree-subsection-header {
                font-weight: 700;
                font-size: 0.9rem;
                color: #374151;
                margin-bottom: 0.5rem;
                padding-left: 0.5rem;
            }
            .side-link {
                display: block;
                padding: 0.5rem 0.75rem;
                margin-bottom: 0.25rem;
                color: #4b5563;
                text-decoration: none;
                font-size: 0.9rem;
                border-radius: 6px;
                transition: all 0.15s;
                font-weight: 600;
                border: 1px solid transparent;
            }
            .side-link:hover {
                background: #f3f4f6;
                color: #111827;
            }
            .side-link.active {
                background: white;
                color: #ef4444; /* THE RED TEXT 🔴 */
                border-color: #ef4444; /* THE RED BORDER 🔴 */
                box-shadow: 0 2px 4px rgba(239, 68, 68, 0.05);
            }
            
            /* Body Padding Adjustment */
            body { padding-left: 380px !important; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(sidebar);
    }
    return sidebar;
}

// 4. RENDERING LOGIC
function renderTree() {
    const sidebar = ensureDesktopSidebar();
    if (!sidebar) return;

    const treeContainer = document.getElementById('sidebar-tree');
    const currentPath = window.location.pathname;

    let activePillarId = PILLARS_CONFIG.find(p => currentPath.includes(p.path))?.id || 'formulas';
    if (currentPath.includes('desmos')) activePillarId = 'desmos';

    // Header Title
    const activePillar = PILLARS_CONFIG.find(p => p.id === activePillarId);
    let html = '';

    if (activePillar) {
        html += `<h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; margin-bottom: 1.5rem; color: #1f2937;">${activePillar.name}</h2>`;
        html += activePillar.categories.map(cat => {
            if (!cat.subsections) return '';
            return `
                <div class="side-tree-group">
                    <h4>${cat.name}</h4>
                    ${cat.subsections.map(sub => {
                return `
                            <div class="side-tree-subsection">
                                <div class="side-tree-subsection-header">${sub.name}</div>
                                ${sub.topics.map(topic => {
                    // Normalize Path
                    const topicPath = topic.path.startsWith('http') ? topic.path : (window.PRACTIX_BASE_PATH || '') + topic.path;
                    // Check if active (simple string match)
                    // But be careful with matching logic
                    const isActive = currentPath.endsWith(topic.path) || currentPath.includes(topic.path.replace('index.html', ''));

                    return `<a href="${topicPath}" class="side-link ${isActive ? 'active' : ''}">${topic.name}</a>`;
                }).join('')}
                            </div>
                        `;
            }).join('')}
                </div>
            `;
        }).join('');
    } else {
        html = `<div style="padding: 1rem;">Select a pillar to view topics.</div>`;
    }

    treeContainer.innerHTML = html;
}

function globalRenderRail() {
    const railContainer = document.getElementById('narrow-rail');
    if (!railContainer) return;
    const currentPath = window.location.pathname;
    let activeId = 'home';
    if (currentPath.includes('app/')) activeId = 'app';
    else if (currentPath.includes('math/')) activeId = 'math';
    else if (currentPath.includes('formulas/')) activeId = 'formulas';
    else if (currentPath.includes('hard-questions/')) activeId = 'hard-questions';
    else if (currentPath.includes('desmos/')) activeId = 'desmos';
    else if (currentPath.includes('wallpapers/')) activeId = 'wallpapers';

    // Get correct base path
    // We can recalculate it here to be safe (since this is standalone)
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);
    const rootIndex = pathSegments.indexOf('_Sever');
    let depth = 0;
    if (rootIndex !== -1) {
        const segmentsAfterRoot = pathSegments.slice(rootIndex + 1);
        const hasFile = segmentsAfterRoot.length > 0 && segmentsAfterRoot[segmentsAfterRoot.length - 1].includes('.');
        depth = hasFile ? segmentsAfterRoot.length - 1 : segmentsAfterRoot.length;
    } else {
        const hasFile = pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.');
        depth = hasFile ? pathSegments.length - 1 : pathSegments.length;
    }
    const basePath = depth === 0 ? '' : '../'.repeat(depth);


    railContainer.innerHTML = NAV_ITEMS_GLOBAL.map(item => {
        let href = item.path ? `${basePath}${item.path}index.html` : `${basePath}index.html`;
        // HACK: Fix homepage link
        if (item.id === 'home') href = `${basePath}index.html`;

        return `<a href="${href}" class="rail-item ${item.id === activeId ? 'active' : ''}" title="${item.name}" data-pillar="${item.id}">${item.icon}</a>`;
    }).join('');
    railContainer.dataset.rendered = "true";
}

// 5. INITIALIZATION
const initPoll = setInterval(() => {
    const rail = document.getElementById('narrow-rail');
    if (rail) {
        globalRenderRail();
        renderTree();
        clearInterval(initPoll);
    }
}, 50);
setTimeout(() => clearInterval(initPoll), 5000);

// IMMEDIATE EXECUTION ATTEMPT (SAFEGUARDED)
if (document.body) {
    try {
        ensureDesktopSidebar();
        renderTree();
    } catch (e) {
        console.error('Sidebar Init Error:', e);
    }
}
