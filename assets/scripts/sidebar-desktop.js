/**
 * Practix Command Rail & Spotlight Engine (v5)
 * Manages the multi-pillar navigation and instant search.
 */

// 1. DATA STRUCTURES (Youngja's Note: Globalized for zero race conditions! 📱✨)
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
                    { name: "Quadratic Equations and Parabola", topics: [{ name: "Discriminant Dangers", path: "hard-questions/discriminant-dangers/index.html" }] },
                    { name: "Solutions of Linear Expressions", topics: [] },
                    { name: "Absolute Value", topics: [] },
                    { name: "Ratios, Proportions, and Rates", topics: [] },
                    { name: "Percentages", topics: [] },
                    { name: "Exponents", topics: [] },
                    { name: "Exponential Growth and Decay", topics: [] },
                    { name: "Manipulating Expressions", topics: [] }
                ]
            },
            {
                name: "Problem-Solving & Data Analysis",
                path: "hard-questions/",
                subsections: [
                    { name: "Probability", topics: [] },
                    { name: "Reading Graphs", topics: [] },
                    { name: "Histograms and Bar Graphs", topics: [] },
                    { name: "Statistics (Mean, Median, Mode)", topics: [] },
                    { name: "Median and Range in Box Plots", topics: [] },
                    { name: "Studies and Data Interpretation", topics: [] }
                ]
            },
            {
                name: "Geometry & Trigonometry",
                path: "hard-questions/",
                subsections: [
                    { name: "Circles", topics: [{ name: "Geometry Traps", path: "hard-questions/geometry/index.html" }] },
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

// 2. GLOBAL PATH & NAVIGATION ENGINE (v5)
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

window.PRACTIX_NAVIGATE = function (link, e) {
    const href = link.getAttribute('href');
    if (!href) return;
    if (link.dataset.navigating === 'true') {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        return;
    }
    let targetUrl;
    try {
        targetUrl = new URL(href, window.location.href);
    } catch (err) { return; }
    const currentUrl = new URL(window.location.href);
    const normPath = (p) => p.replace(/\/$/, '').replace('/index.html', '') || '/';
    const isSamePage = normPath(targetUrl.pathname) === normPath(currentUrl.pathname);
    if (isSamePage && targetUrl.hash) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const anchorId = targetUrl.hash.substring(1);
        const anchorElement = document.getElementById(anchorId);
        if (window.PRACTIX_CLOSE_FLYOUT) window.PRACTIX_CLOSE_FLYOUT();
        if (anchorElement) {
            anchorElement.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, null, targetUrl.hash);
        } else {
            window.location.hash = targetUrl.hash;
        }
        return;
    }
    if (e) { e.preventDefault(); e.stopPropagation(); }
    link.dataset.navigating = 'true';
    if (window.PRACTIX_CLOSE_FLYOUT) window.PRACTIX_CLOSE_FLYOUT();
    window.location.href = targetUrl.href;
    setTimeout(() => { link.dataset.navigating = 'false'; }, 2000);
};

// 3. RAIL RENDERING
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
    else if (currentPath.includes('contact/')) activeId = 'contact';
    const basePath = window.PRACTIX_BASE_PATH;
    const isMobile = window.innerWidth <= 1280 || window.matchMedia('(max-width: 1280px)').matches || window.matchMedia('(pointer: coarse)').matches;
    railContainer.innerHTML = NAV_ITEMS_GLOBAL.map(item => {
        let href = item.path ? `${basePath}${item.path}index.html` : `${basePath}index.html`;
        href = window.PRACTIX_NORMALIZE_HREF(href);
        if (isMobile && item.hasFlyout) {
            return `<button class="rail-item ${item.id === activeId ? 'active' : ''}" title="${item.name}" data-pillar="${item.id}" data-path="${item.path}">${item.icon}</button>`;
        }
        return `<a href="${href}" class="rail-item ${item.id === activeId ? 'active' : ''}" title="${item.name}" data-pillar="${item.id}">${item.icon}</a>`;
    }).join('');
    railContainer.dataset.rendered = "true";
}

// 5. INITIALIZATION POLL (Desktop Version - No Flyout)
const railPoll = setInterval(() => {
    const rail = document.getElementById('narrow-rail');
    if (rail) {
        globalRenderRail();
        // Desktop does not need initMobileFlyout
        clearInterval(railPoll);
    }
}, 10);
setTimeout(() => clearInterval(railPoll), 3000);
