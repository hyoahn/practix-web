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

// 4. MOBILE FLYOUT (v5 - Robust Styling & Red Borders! 🔴✨)
function initMobileFlyout() {
    let flyout = document.getElementById('mobile-flyout');
    if (!flyout) {
        flyout = document.createElement('div');
        flyout.id = 'mobile-flyout';
        flyout.className = 'mobile-flyout';
        flyout.innerHTML = `
            <div class="flyout-header"><span class="flyout-title">Navigation</span><button class="flyout-close">✕</button></div>
            <div class="flyout-content"></div>
        `;
        document.body.appendChild(flyout);

        // Youngja's Note: Always refresh styles to prevent stale cache!
        const existingStyle = document.getElementById('flyout-styles');
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = 'flyout-styles';
        style.textContent = `
            .mobile-flyout { position: fixed; top: 0; left: 60px; width: 280px; height: 100vh; background: white; border-right: 1px solid #e5e7eb; z-index: 9999; transform: translateX(-340px); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; box-shadow: 10px 0 30px rgba(0,0,0,0.15); }
            .mobile-flyout.active { transform: translateX(0); }
            .flyout-header { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #f3f4f6; }
            .flyout-title { font-weight: 800; font-size: 1.25rem; color: #1f2937; }
            .flyout-close { background: #f3f4f6; border: none; font-size: 1.2rem; color: #4b5563; cursor: pointer; padding: 0.5rem; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
            .flyout-content { flex: 1; overflow-y: auto; padding: 1.25rem; -webkit-overflow-scrolling: touch; }
            .flyout-section { margin-bottom: 2rem; }
            .flyout-section-title { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.1em; margin-bottom: 1rem; padding-left: 0.25rem; }
            .flyout-subsection-title { font-size: 0.9rem; font-weight: 700; color: #374151; margin: 1rem 0 0.75rem 0; border-left: 3px solid #6366f1; padding-left: 1rem; line-height: 1.4; }
            
            /* RED EDGES RESTORATION 🔴 (Youngja's Note: Very important for representative-nim!) */
            .flyout-topic { 
                display: block !important; 
                padding: 0.65rem 0.85rem !important; 
                text-decoration: none !important; 
                color: #1f2937 !important; 
                font-size: 1rem !important; 
                border-radius: 12px !important; 
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; 
                margin-bottom: 0.5rem !important; 
                font-weight: 600 !important; 
                border: 1px solid #ef4444 !important; /* THE RED EDGE 🔴 */
                background: white !important; 
                box-shadow: 0 2px 4px rgba(239, 68, 68, 0.05) !important;
                position: relative !important;
            }
            .flyout-topic:active { background-color: #fef2f2 !important; transform: scale(0.97) !important; }
            .flyout-topic:hover { border-color: #dc2626 !important; background: #fff5f5 !important; transform: translateX(4px) !important; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1) !important; }
            .flyout-topic.active { background: #ef4444 !important; color: white !important; border-color: #ef4444 !important; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important; }
            
            .flyout-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 9998; opacity: 0; pointer-events: none; transition: opacity 0.3s; backdrop-filter: blur(2px); }
            .flyout-overlay.active { opacity: 1; pointer-events: auto; }
        `;
        document.head.appendChild(style);

        const existingOverlay = document.getElementById('flyout-overlay');
        if (existingOverlay) existingOverlay.remove();
        const overlay = document.createElement('div');
        overlay.id = 'flyout-overlay';
        overlay.className = 'flyout-overlay';
        document.body.appendChild(overlay);

        flyout.addEventListener('click', (e) => {
            const link = e.target.closest('.flyout-topic');
            if (link) window.PRACTIX_NAVIGATE(link, e);
        });
        flyout.addEventListener('touchend', (e) => {
            const link = e.target.closest('.flyout-topic');
            if (link) { e.preventDefault(); window.PRACTIX_NAVIGATE(link, e); }
        });
    }

    const flyoutContent = flyout.querySelector('.flyout-content');
    const flyoutTitle = flyout.querySelector('.flyout-title');
    const flyoutClose = flyout.querySelector('.flyout-close');
    const flyoutOverlay = document.getElementById('flyout-overlay');
    const railContainer = document.getElementById('narrow-rail');

    window.PRACTIX_CLOSE_FLYOUT = () => {
        flyout.classList.remove('active');
        if (flyoutOverlay) flyoutOverlay.classList.remove('active');
    };

    flyoutClose.addEventListener('click', window.PRACTIX_CLOSE_FLYOUT);
    if (flyoutOverlay) flyoutOverlay.addEventListener('click', window.PRACTIX_CLOSE_FLYOUT);

    if (railContainer) {
        const railInteractionHandler = (e) => {
            // Only intercept flyout buttons, let links work naturally
            const btn = e.target.closest('button[data-pillar]');
            if (!btn) return; // Let browser handle link navigation naturally

            e.preventDefault();
            e.stopPropagation();

            const pillarId = btn.dataset.pillar;

            // Intercept Desmos click for mobile toggle
            if (pillarId === 'desmos' && window.location.pathname.includes('/desmos/')) {
                if (window.toggleMobileDesmos) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.toggleMobileDesmos();
                    if (window.PRACTIX_CLOSE_FLYOUT) window.PRACTIX_CLOSE_FLYOUT();
                    return;
                }
            }

            const pillar = window.PRACTIX_PILLARS.find(p => p.id === pillarId);
            if (!pillar) return;

            flyoutTitle.textContent = pillar.name;
            let html = '';
            if (pillar.id === 'formulas' || pillar.id === 'math') {
                const bPath = window.PRACTIX_BASE_PATH;
                let flashHref = window.PRACTIX_NORMALIZE_HREF(`${bPath}formulas/index.html#flash-card-container`);
                html += `
                    <div class="flyout-section" style="margin-bottom: 0.75rem;">
                        <a href="${flashHref}" class="flyout-topic" style="border: 2px solid #10b981 !important; background-color: #f0fdf4 !important; display: flex !important; align-items: center; gap: 0.75rem; border-radius: 16px !important;">
                            <span style="font-size: 1.75rem;">⚡</span>
                            <div><div style="font-weight: 800; color: #047857; line-height: 1.2; font-size: 1.1rem;">Flash Cards</div><div style="font-size: 0.8rem; color: #059669; font-weight: 600;">Swipe & Memorize</div></div>
                        </a>
                    </div>
                `;
            }
            pillar.categories.forEach(category => {
                html += `<div class="flyout-section"><div class="flyout-section-title">${category.name}</div>`;
                category.subsections.forEach(sub => {
                    if (sub.topics && sub.topics.length > 0) {
                        html += `<div class="flyout-subsection-title">${sub.name}</div>`;
                        sub.topics.forEach(topic => {
                            let topicHref = (window.PRACTIX_BASE_PATH + topic.path);
                            topicHref = window.PRACTIX_NORMALIZE_HREF(topicHref);
                            html += `<a href="${topicHref}" class="flyout-topic">${topic.name}</a>`;
                        });
                    }
                });
                html += `</div>`;
            });
            flyoutContent.innerHTML = html;
            flyout.classList.add('active');
            if (flyoutOverlay) flyoutOverlay.classList.add('active');
        };

        // Only use click handler - works on both desktop and mobile
        railContainer.addEventListener('click', railInteractionHandler);
    }
}

// 5. INITIALIZATION POLL
const railPoll = setInterval(() => {
    const rail = document.getElementById('narrow-rail');
    if (rail) {
        globalRenderRail();
        const isMobile = window.innerWidth <= 1280 || window.matchMedia('(max-width: 1280px)').matches || window.matchMedia('(pointer: coarse)').matches;
        if (isMobile) initMobileFlyout();
        clearInterval(railPoll);
    }
}, 10);
setTimeout(() => clearInterval(railPoll), 3000);
