/**
 * Practix Command Rail & Spotlight Engine
 * Manages the multi-pillar navigation and instant search.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine the path depth (Robust for file:// and hosted)
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);

    // Find the index of the root directory "_Sever"
    const rootIndex = pathSegments.indexOf('_Sever');
    let depth = 0;

    if (rootIndex !== -1) {
        // We are inside _Sever
        const segmentsAfterRoot = pathSegments.slice(rootIndex + 1);
        const hasFile = segmentsAfterRoot.length > 0 && segmentsAfterRoot[segmentsAfterRoot.length - 1].includes('.');
        depth = hasFile ? segmentsAfterRoot.length - 1 : segmentsAfterRoot.length;
    } else {
        // Fallback for hosted environments where root is /
        const hasFile = pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.');
        depth = hasFile ? pathSegments.length - 1 : pathSegments.length;
    }

    const basePath = depth === 0 ? '' : '../'.repeat(depth);

    // 2. Define the Full Site Tree (Categorized by Pillar)
    const PILLARS = [
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
                        { name: "Variables in Linear Equations", topics: [{ name: "Basics", path: "formulas/heart-of-algebra/linear-equations/" }] },
                        { name: "Lines and Linear Functions", topics: [{ name: "Slope & Lines", path: "formulas/heart-of-algebra/slope-and-lines/" }] },
                        { name: "Systems of Linear Equations", topics: [{ name: "System Basics", path: "formulas/heart-of-algebra/linear-equations/#intersect-meaning" }] },
                        { name: "Linear Inequalities", topics: [{ name: "Inequality Shading", path: "formulas/heart-of-algebra/linear-equations/#ineq-shade" }] },
                        { name: "Word Problems on Linear Equations", topics: [] }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "formulas/passport-to-advanced-math/",
                    subsections: [
                        { name: "Polynomial Functions", topics: [{ name: "Polynomial Basics", path: "formulas/" }] },
                        { name: "Quadratic Equations and Parabola", topics: [{ name: "Parabola Mastery", path: "formulas/passport-to-advanced-math/parabola-mastery/" }] },
                        { name: "Solutions of Linear Expressions", topics: [] },
                        { name: "Absolute Value", topics: [] },
                        { name: "Ratios, Proportions, and Rates", topics: [] },
                        { name: "Percentages", topics: [{ name: "Percent Change", path: "formulas/heart-of-algebra/percent-change-shortcuts/" }] },
                        { name: "Exponents", topics: [] },
                        { name: "Exponential Growth and Decay", topics: [{ name: "Growth Basics", path: "formulas/passport-to-advanced-math/exponential-growth/" }] },
                        { name: "Manipulating Expressions", topics: [{ name: "Factoring Patterns", path: "formulas/passport-to-advanced-math/factoring-patterns/" }] }
                    ]
                },
                {
                    name: "Problem-Solving & Data Analysis",
                    path: "formulas/problem-solving-data-analysis/",
                    subsections: [
                        { name: "Probability", topics: [] },
                        { name: "Reading Graphs", topics: [] },
                        { name: "Histograms and Bar Graphs", topics: [] },
                        { name: "Statistics (Mean, Median, Mode)", topics: [{ name: "Averages & Mixtures", path: "formulas/heart-of-algebra/averages-and-mixtures/" }] },
                        { name: "Median and Range in Box Plots", topics: [] },
                        { name: "Studies and Data Interpretation", topics: [] }
                    ]
                },
                {
                    name: "Geometry & Trigonometry",
                    path: "formulas/geometry-trigonometry/",
                    subsections: [
                        { name: "Circles", topics: [{ name: "Circle Equations", path: "formulas/geometry-trigonometry/circle-equations/" }] },
                        { name: "Lines and Angles", topics: [] },
                        { name: "Triangles", topics: [{ name: "Triangle Basics", path: "formulas/" }] },
                        { name: "Quadrilaterals", topics: [] },
                        { name: "Three-Dimensional Figures", topics: [] },
                        { name: "Trigonometry", topics: [{ name: "Trignometry Hacks", path: "formulas/geometry-trigonometry/trigonometry-hacks/" }] }
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
                        { name: "Lines and Linear Functions", topics: [{ name: "Linear Equations", path: "desmos/linear-equations/" }] },
                        { name: "Systems of Linear Equations", topics: [{ name: "System Solver", path: "desmos/system-solver/" }] },
                        { name: "Linear Inequalities", topics: [{ name: "Inequality Shading", path: "desmos/inequality-shading/" }] },
                        { name: "Word Problems on Linear Equations", topics: [] }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "desmos/",
                    subsections: [
                        { name: "Polynomial Functions", topics: [{ name: "Polynomial Roots", path: "desmos/poly-roots/" }] },
                        { name: "Quadratic Equations and Parabola", topics: [] },
                        { name: "Solutions of Linear Expressions", topics: [] },
                        { name: "Absolute Value", topics: [{ name: "Absolute Value Solve", path: "desmos/absolute-value/" }] },
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
                        { name: "Reading Graphs", topics: [{ name: "Visualization Hacks", path: "desmos/visualization-hacks/" }] },
                        { name: "Histograms and Bar Graphs", topics: [] },
                        { name: "Statistics (Mean, Median, Mode)", topics: [{ name: "Mean vs Median", path: "desmos/mean-vs-median/" }] },
                        { name: "Median and Range in Box Plots", topics: [] },
                        { name: "Studies and Data Interpretation", topics: [] }
                    ]
                },
                {
                    name: "Geometry & Trigonometry",
                    path: "desmos/",
                    subsections: [
                        { name: "Circles", topics: [{ name: "Circle Maker", path: "desmos/circle-equations/" }] },
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
                        { name: "Lines and Linear Functions", topics: [{ name: "Algebra Traps", path: "hard-questions/algebra/" }] },
                        { name: "Systems of Linear Equations", topics: [{ name: "System Solutions", path: "hard-questions/system-solutions/" }] },
                        { name: "Linear Inequalities", topics: [] },
                        { name: "Word Problems on Linear Equations", topics: [] }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "hard-questions/",
                    subsections: [
                        { name: "Polynomial Functions", topics: [] },
                        { name: "Quadratic Equations and Parabola", topics: [{ name: "Discriminant Dangers", path: "hard-questions/discriminant-dangers/" }] },
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
                        { name: "Circles", topics: [{ name: "Geometry Traps", path: "hard-questions/geometry/" }] },
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
                        { name: "Variables in Linear Equations", topics: [{ name: "Basics", path: "math/linear-equations/" }] },
                        { name: "Lines and Linear Functions", topics: [{ name: "Lines & Graphs", path: "math/linear-equations/" }] },
                        { name: "Systems of Linear Equations", topics: [{ name: "Systems", path: "math/systems/" }] },
                        { name: "Linear Inequalities", topics: [{ name: "Inequalities", path: "math/inequalities/" }] },
                        { name: "Word Problems on Linear Equations", topics: [] }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "math/",
                    subsections: [
                        { name: "Polynomial Functions", topics: [{ name: "Functions (Section 6)", path: "math/#section-6" }] },
                        { name: "Quadratic Equations and Parabola", topics: [{ name: "Quadratics (Section 7)", path: "math/#section-7" }] },
                        { name: "Solutions of Linear Expressions", topics: [{ name: "Expressions (Section 8)", path: "math/#section-8" }] },
                        { name: "Absolute Value", topics: [{ name: "Abs Value (Section 9)", path: "math/#section-9" }] },
                        { name: "Ratios, Proportions, and Rates", topics: [{ name: "Ratios (Section 10)", path: "math/#section-10" }] },
                        { name: "Percentages", topics: [{ name: "Percentages (Section 11)", path: "math/#section-11" }] },
                        { name: "Exponents", topics: [{ name: "Exponents (Section 12)", path: "math/#section-12" }] },
                        { name: "Exponential Growth and Decay", topics: [{ name: "Growth (Section 13)", path: "math/#section-13" }] },
                        { name: "Manipulating Expressions", topics: [{ name: "Manipulation (Section 14)", path: "math/#section-14" }] }
                    ]
                },
                {
                    name: "Problem-Solving & Data Analysis",
                    path: "math/",
                    subsections: [
                        { name: "Probability", topics: [{ name: "Probability (Section 15)", path: "math/#section-15" }] },
                        { name: "Reading Graphs", topics: [{ name: "Graphs (Section 16)", path: "math/#section-16" }] },
                        { name: "Histograms and Bar Graphs", topics: [{ name: "Bar Graphs (Section 17)", path: "math/#section-17" }] },
                        { name: "Statistics (Mean, Median, Mode)", topics: [{ name: "Statistics (Section 18)", path: "math/#section-18" }] },
                        { name: "Median and Range in Box Plots", topics: [{ name: "Box Plots (Section 19)", path: "math/#section-19" }] },
                        { name: "Studies and Data Interpretation", topics: [{ name: "Studies (Section 20)", path: "math/#section-20" }] }
                    ]
                },
                {
                    name: "Geometry & Trigonometry",
                    path: "math/",
                    subsections: [
                        { name: "Circles", topics: [{ name: "Circles", path: "math/circles/" }] },
                        { name: "Lines and Angles", topics: [{ name: "Angles (Section 22)", path: "math/#section-22" }] },
                        { name: "Triangles", topics: [{ name: "Triangles (Section 23)", path: "math/#section-23" }] },
                        { name: "Quadrilaterals", topics: [{ name: "Quadrilaterals (Section 24)", path: "math/#section-24" }] },
                        { name: "Three-Dimensional Figures", topics: [{ name: "3D (Section 25)", path: "math/#section-25" }] },
                        { name: "Trigonometry", topics: [{ name: "Trigonometry (Section 26)", path: "math/#section-26" }] }
                    ]
                }
            ]
        },
        {
            id: 'wallpapers',
            name: 'Viral Assets',
            icon: '📱',
            path: 'wallpapers/',
            categories: [
                {
                    name: "Cheat Sheets",
                    path: "wallpapers/",
                    topics: [
                        { name: "Lockscreen Walls", path: "wallpapers/" },
                        { name: "Desmos Hacks", path: "wallpapers/" }
                    ]
                }
            ]
        }
    ];

    // Hub Mapping for automated linking
    const SUBSECTION_TO_HUB = {
        "Variables in Linear Equations": "variables-linear-equations",
        "Lines and Linear Functions": "lines-and-functions",
        "Systems of Linear Equations": "systems-of-equations",
        "Linear Inequalities": "linear-inequalities",
        "Word Problems on Linear Equations": "linear-word-problems",
        "Polynomial Functions": "polynomial-functions",
        "Quadratic Equations and Parabola": "quadratic-equations",
        "Solutions of Linear Expressions": "linear-expressions-solutions",
        "Absolute Value": "absolute-value",
        "Ratios, Proportions, and Rates": "ratios-proportions-rates",
        "Percentages": "percentages",
        "Exponents": "exponents",
        "Exponential Growth and Decay": "exponential-growth",
        "Manipulating Expressions": "manipulating-expressions",
        "Probability": "probability",
        "Reading Graphs": "reading-graphs",
        "Histograms and Bar Graphs": "histograms-bar-graphs",
        "Statistics (Mean, Median, Mode)": "statistics-measures",
        "Median and Range in Box Plots": "median-range-box-plots",
        "Studies and Data Interpretation": "studies-data-interpretation",
        "Circles": "circles",
        "Lines and Angles": "lines-and-angles",
        "Triangles": "triangles",
        "Quadrilaterals": "quadrilaterals",
        "Three-Dimensional Figures": "three-dimensional-figures",
        "Trigonometry": "trigonometry"
    };

    // 3. UI Elements
    const railContainer = document.getElementById('narrow-rail');
    const sidebarTree = document.getElementById('sidebar-tree');
    const searchInput = document.getElementById('sidebar-search');

    // RENDER RAIL FIRST - This must run on ALL pages including Home, App, Contact
    // which don't have a sidebar-tree element
    renderRail();

    // If no sidebar tree, exit early (Home, App, Contact pages)
    // The rail is already rendered above
    if (!sidebarTree) return;

    // 4. State Management
    let activePillarId = PILLARS.find(p => currentPath.includes(p.path))?.id || 'formulas';
    let sidebarView = localStorage.getItem('practix_sidebar_view') || 'pillar'; // 'pillar' or 'topic'

    // Check for search query in URL params (from Homepage Search-First Hero)
    const urlParams = new URLSearchParams(window.location.search);
    let searchQuery = urlParams.get('q') || '';

    // 4.1 Search Intent Logic for Phase 2
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const pillarKeywords = ['desmos', 'formula', 'trap', 'hard', 'hardest', 'cheat'];
        const isPillarSearch = pillarKeywords.some(keyword => query.includes(keyword));

        if (isPillarSearch) {
            sidebarView = 'pillar';
        } else {
            sidebarView = 'topic';
        }
    }

    // 5. Rendering Functions
    function renderToggle() {
        const sidebar = document.querySelector('.command-sidebar');
        if (!sidebar) return;

        // Check if toggle already exists
        if (document.getElementById('sidebar-view-toggle')) return;

        const toggleHTML = `
            <div class="sidebar-view-toggle-container" id="sidebar-view-toggle">
                <div class="view-toggle" id="view-toggle-btn">
                    <div class="view-toggle-pill ${sidebarView === 'topic' ? 'right' : ''}"></div>
                    <div class="view-toggle-option ${sidebarView === 'pillar' ? 'active' : ''}" data-view="pillar">
                        <span>Pillars</span>
                    </div>
                    <div class="view-toggle-option ${sidebarView === 'topic' ? 'active' : ''}" data-view="topic">
                        <span>Topics</span>
                    </div>
                </div>
            </div>
        `;

        // Insert after search container
        const searchContainer = document.querySelector('.sidebar-search-container');
        if (searchContainer) {
            searchContainer.insertAdjacentHTML('afterend', toggleHTML);
        } else {
            sidebar.insertAdjacentHTML('afterbegin', toggleHTML);
        }

        // Add Event Listeners
        document.getElementById('view-toggle-btn').addEventListener('click', (e) => {
            const option = e.target.closest('.view-toggle-option');
            if (!option) return;

            const newView = option.dataset.view;
            if (newView === sidebarView) return;

            sidebarView = newView;
            localStorage.setItem('practix_sidebar_view', sidebarView);

            // UI Update
            document.querySelectorAll('.view-toggle-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            document.querySelector('.view-toggle-pill').classList.toggle('right', sidebarView === 'topic');

            renderTree();
        });
    }

    function initResizableSidebar() {
        const sidebar = document.querySelector('.command-sidebar');
        if (!sidebar) return;

        // Create resize handle
        const handle = document.createElement('div');
        handle.className = 'sidebar-resize-handle';
        sidebar.appendChild(handle);

        let isResizing = false;

        // Restore saved width
        const savedWidth = localStorage.getItem('practix_sidebar_width');
        if (savedWidth) {
            sidebar.style.width = savedWidth + 'px';
        }

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            handle.classList.add('active');
            e.preventDefault(); // Prevent text selection
        });

        window.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const sidebarRect = sidebar.getBoundingClientRect();
            let newWidth = e.clientX - sidebarRect.left;

            // Constrain
            if (newWidth < 200) newWidth = 200;
            if (newWidth > 600) newWidth = 600;

            sidebar.style.width = newWidth + 'px';
        });

        window.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                handle.classList.remove('active');
                localStorage.setItem('practix_sidebar_width', sidebar.style.width.replace('px', ''));
            }
        });
    }

    function renderRail() {
        if (!railContainer) return;

        // Global Navigation Rail - 8 Icons as specified by user
        // hasFlyout: true means on mobile, clicking opens a flyout sidebar
        const NAV_ITEMS = [
            { id: 'home', name: 'Home', icon: '🏠', path: '', hasFlyout: false },
            { id: 'app', name: 'App', icon: '🚀', path: 'app/', hasFlyout: false },
            { id: 'math', name: 'Math', icon: '📐', path: 'math/', hasFlyout: true },
            { id: 'formulas', name: 'Formulas', icon: 'Σ', path: 'formulas/', hasFlyout: true },
            { id: 'hard-questions', name: 'Hardest Questions', icon: '☠️', path: 'hard-questions/', hasFlyout: true },
            { id: 'desmos', name: 'Desmos', icon: 'y=', path: 'desmos/', hasFlyout: true },
            { id: 'wallpapers', name: 'Wallpapers', icon: '📱', path: 'wallpapers/', hasFlyout: false },
            { id: 'contact', name: 'About Us', icon: 'ℹ️', path: 'contact/', hasFlyout: false }
        ];

        // Determine active item based on current path
        const getActiveId = () => {
            if (currentPath === '/' || currentPath.endsWith('/index.html') && depth === 0) return 'home';
            for (const item of NAV_ITEMS) {
                if (item.path && currentPath.includes(item.path)) return item.id;
            }
            return 'home';
        };

        const activeId = getActiveId();
        const isMobile = window.innerWidth <= 1024;

        railContainer.innerHTML = NAV_ITEMS.map(item => {
            const href = item.path ? `${basePath}${item.path}` : `${basePath}index.html`;
            // On mobile, pillar items with flyout become buttons instead of links
            if (isMobile && item.hasFlyout) {
                return `
                <button class="rail-item ${item.id === activeId ? 'active' : ''}" 
                        title="${item.name}" 
                        data-pillar="${item.id}" 
                        data-path="${item.path}">
                    ${item.icon}
                </button>`;
            }
            return `
            <a href="${href}" class="rail-item ${item.id === activeId ? 'active' : ''}" title="${item.name}" data-pillar="${item.id}">
                ${item.icon}
            </a>`;
        }).join('');

        // Mobile flyout toggle behavior
        if (isMobile) {
            initMobileFlyout(NAV_ITEMS);
        }
    }



    // Mobile Flyout Sidebar for Pillar Navigation
    function initMobileFlyout(navItems) {
        // Create flyout container if it doesn't exist
        let flyout = document.getElementById('mobile-flyout');
        if (!flyout) {
            flyout = document.createElement('div');
            flyout.id = 'mobile-flyout';
            flyout.className = 'mobile-flyout';
            flyout.innerHTML = `
                <div class="flyout-header">
                    <span class="flyout-title">Navigation</span>
                    <button class="flyout-close">✕</button>
                </div>
                <div class="flyout-content"></div>
            `;
            document.body.appendChild(flyout);

            // Add flyout styles dynamically
            if (!document.getElementById('flyout-styles')) {
                const style = document.createElement('style');
                style.id = 'flyout-styles';
                style.textContent = `
                    .mobile-flyout {
                        position: fixed;
                        top: 0;
                        left: 60px;
                        width: 280px;
                        height: 100vh;
                        background: white;
                        border-right: 1px solid var(--border);
                        z-index: 1999;
                        transform: translateX(-340px);
                        transition: transform 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        box-shadow: 4px 0 20px rgba(0,0,0,0.1);
                    }
                    .mobile-flyout.active {
                        transform: translateX(0);
                    }
                    .flyout-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1rem;
                        border-bottom: 1px solid var(--border);
                        background: var(--bg-secondary);
                    }
                    .flyout-title {
                        font-weight: 600;
                        font-size: 1.1rem;
                    }
                    .flyout-close {
                        background: none;
                        border: none;
                        font-size: 1.2rem;
                        cursor: pointer;
                        padding: 0.5rem;
                        color: var(--text-secondary);
                    }
                    .flyout-content {
                        flex: 1;
                        overflow-y: auto;
                        padding: 1rem;
                    }
                    .flyout-content a {
                        display: block;
                        padding: 0.75rem 1rem;
                        color: var(--text-primary);
                        text-decoration: none;
                        border-radius: 8px;
                        margin-bottom: 0.25rem;
                        transition: background 0.2s;
                    }
                    .flyout-content a:hover {
                        background: var(--bg-secondary);
                    }
                    .flyout-content a.active {
                        background: var(--accent-primary);
                        color: white;
                    }
                    .flyout-section {
                        margin-bottom: 1rem;
                    }
                    .flyout-section-title {
                    .flyout-section-title {
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        color: var(--accent-primary);
                        padding: 0.75rem 1rem;
                        margin-top: 1rem;
                        margin-bottom: 0.5rem;
                        font-weight: 800;
                        letter-spacing: 0.05em;
                        background: var(--bg-secondary);
                        border-radius: 8px;
                        border-left: 4px solid var(--accent-primary);
                    }
                    .flyout-subsection-title {
                        font-size: 0.7rem;
                        font-weight: 700;
                        color: var(--text-muted);
                        padding: 0.5rem 0.5rem 0.25rem 0.5rem;
                        margin-top: 0.75rem;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        pointer-events: none;
                        border-bottom: 1px dashed var(--border);
                        margin-bottom: 0.5rem;
                        opacity: 0.8;
                    }
                    .flyout-topic {
                        display: block;
                        padding: 0.85rem 1rem;
                        color: var(--text-primary);
                        text-decoration: none;
                        border-radius: 12px;
                        font-size: 0.95rem;
                        font-weight: 600;
                        transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
                        background: #ffffff !important;
                        margin-bottom: 0.6rem; 
                        /* USER REQUEST: Red Outline Box FORCE */
                        border: 2px solid #ff4d4f !important; 
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
                        position: relative;
                        overflow: hidden;
                    }
                    /* Add a subtle indicator arrow or icon if needed, but for now just the box */
                    .flyout-topic::after {
                        content: '→';
                        position: absolute;
                        right: 1rem;
                        opacity: 0;
                        transform: translateX(-10px);
                        transition: all 0.2s;
                        color: var(--accent-primary);
                    }
                    .flyout-topic:hover {
                        background: #f8f9fa;
                        border-color: var(--accent-primary);
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
                        padding-right: 2rem; /* Make room for arrow */
                    }
                    .flyout-topic:hover::after {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    .flyout-topic.active {
                        background: var(--accent-primary);
                        color: white !important;
                        border-color: var(--accent-primary);
                        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                    }
                    .flyout-topic.active::after {
                        color: white;
                        opacity: 1;
                        transform: translateX(0);
                    }
                    .flyout-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.3);
                        z-index: 1998;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s;
                    }
                    .flyout-overlay.active {
                        opacity: 1;
                        pointer-events: auto;
                    }
                `;
                document.head.appendChild(style);
            }

            // Create overlay
            if (!document.getElementById('flyout-overlay')) {
                const overlay = document.createElement('div');
                overlay.id = 'flyout-overlay';
                overlay.className = 'flyout-overlay';
                document.body.appendChild(overlay);
            }
        }

        const flyoutContent = flyout.querySelector('.flyout-content');
        const flyoutTitle = flyout.querySelector('.flyout-title');
        const flyoutClose = flyout.querySelector('.flyout-close');
        const flyoutOverlay = document.getElementById('flyout-overlay');

        // Mobile Split-Screen Desmos Toggle
        function toggleDesmosSplitScreen() {
            const body = document.body;
            const existingPanel = document.getElementById('mobile-desmos-panel');

            // If panel exists, just toggle visibility class
            if (existingPanel) {
                body.classList.toggle('desmos-split-active');
                return;
            }

            // Create panel and iframe
            const panel = document.createElement('div');
            panel.id = 'mobile-desmos-panel';
            panel.innerHTML = `
            <div class="desmos-handle">
                <span>Desmos Calculator</span>
                <button class="desmos-close-btn">✕</button>
            </div>
            <iframe src="https://www.desmos.com/calculator?lang=ko" frameborder="0"></iframe>
        `;
            body.appendChild(panel);

            // Add styles
            if (!document.getElementById('desmos-split-styles')) {
                const style = document.createElement('style');
                style.id = 'desmos-split-styles';
                style.textContent = `
                /* Split Screen Styles for Mobile (Aggressive Overrides) */
                @media (max-width: 1024px) {
                    body.desmos-split-active {
                        overflow: hidden !important;
                    }
                    
                    body.desmos-split-active main,
                    body.desmos-split-active .main-stage,
                    body.desmos-split-active #content-area {
                        height: 50vh !important;
                        overflow-y: auto !important;
                        padding-bottom: 150px !important; /* increased to prevent overlap */
                        -webkit-overflow-scrolling: touch; /* Smooth scroll */
                    }

                    body.desmos-split-active .stage-content-scroll {
                        height: auto !important;
                        overflow: visible !important;
                    }

                    /* FIX: Force 1 column for options in split screen (Flex Column) */
                    body.desmos-split-active .sat-option-grid {
                        display: flex !important;
                        flex-direction: column !important;
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }

                    /* FIX: Prevent right cut-off */
                    body.desmos-split-active .main-stage {
                        padding-right: 1.5rem !important;
                        width: 100% !important;
                        box-sizing: border-box !important;
                    }

                    /* FIX: Ensure card doesn't overflow */
                    body.desmos-split-active .sat-problem-card {
                        width: 100% !important;
                        max-width: 100% !important;
                        overflow-x: hidden !important;
                    }
                    
                    /* FIX: Reveal Button Visibility */
                    body.desmos-split-active .practix-reveal {
                        margin-bottom: 20px !important;
                        position: relative !important;
                        z-index: 5 !important;
                    }

                    #mobile-desmos-panel {
                        position: fixed;
                        bottom: 0;
                        left: 0; /* Full width on mobile, ignoring rail indentation if needed, but rail is 60px */
                        right: 0;
                        height: 50vh;
                        background: white;
                        z-index: 2005; /* High z-index to sit above everything */
                        border-top: 1px solid var(--border);
                        box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
                        display: none;
                        flex-direction: column;
                        transition: transform 0.3s ease;
                        transform: translateY(100%);
                    }
                    
                    /* Adjust for rail if body has padding */
                    body.desmos-split-active #mobile-desmos-panel {
                        display: flex;
                        transform: translateY(0);
                        left: 60px; /* Keep 60px offset if rail is visible */
                    }

                    /* FIX: Hide 'Try It' Toggle Button in Split Screen */
                    body.desmos-split-active #calcToggle,
                    body.desmos-split-active .calc-toggle {
                        display: none !important;
                    }

                    .desmos-handle {
                        height: 40px;
                        background: var(--bg-secondary);
                        border-bottom: 1px solid var(--border);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 1rem;
                        font-size: 0.9rem;
                        font-weight: 600;
                        color: var(--text-primary);
                    }

                    .desmos-close-btn {
                        background: none;
                        border: none;
                        font-size: 1.2rem;
                        cursor: pointer;
                        padding: 0.25rem;
                        color: var(--text-secondary);
                    }

                    #mobile-desmos-panel iframe {
                        flex: 1;
                        width: 100%;
                        height: 100%;
                    }
                }
            `;
                document.head.appendChild(style);
            }

            // Close button handler
            panel.querySelector('.desmos-close-btn').addEventListener('click', () => {
                body.classList.remove('desmos-split-active');
                // Update rail button state
                const desmosBtn = document.querySelector('button[data-pillar="desmos"]');
                if (desmosBtn) desmosBtn.classList.remove('flyout-active');
            });

            // Activate after creation
            // Small timeout to allow transition if we were using it, but display:none prevents it initially
            requestAnimationFrame(() => {
                body.classList.add('desmos-split-active');
            });
        }

        // Mobile Split-Screen Desmos Toggle
        function toggleDesmosSplitScreen(forceOpen = false) {
            const body = document.body;
            const existingPanel = document.getElementById('mobile-desmos-panel');

            // If panel exists, toggle or force open
            if (existingPanel) {
                if (forceOpen) {
                    body.classList.add('desmos-split-active');
                } else {
                    body.classList.toggle('desmos-split-active');
                }
                return;
            }

            // Create panel and iframe
            const panel = document.createElement('div');
            panel.id = 'mobile-desmos-panel';
            panel.innerHTML = `
            <div class="desmos-handle">
                <span>Desmos Calculator</span>
                <button class="desmos-close-btn">✕</button>
            </div>
            <iframe src="https://www.desmos.com/calculator?lang=ko" frameborder="0"></iframe>
        `;
            // Ensure it's hidden by default globally via inline style until class kicks in
            panel.style.display = 'none';
            body.appendChild(panel);

            // Add styles
            if (!document.getElementById('desmos-split-styles')) {
                const style = document.createElement('style');
                style.id = 'desmos-split-styles';
                style.textContent = `
                /* Global default: hide panel */
                #mobile-desmos-panel {
                    display: none;
                }

                /* Split Screen Styles for Mobile Portrait */
                @media (max-width: 1024px) and (orientation: portrait) {
                    body.desmos-split-active {
                        overflow: hidden !important;
                    }
                    
                    body.desmos-split-active main,
                    body.desmos-split-active .main-stage,
                    body.desmos-split-active #content-area {
                        height: 50vh !important;
                        overflow-y: auto !important;
                        padding-bottom: 60px !important; 
                    }

                    #mobile-desmos-panel {
                        position: fixed;
                        bottom: 0;
                        left: 60px; /* Width of narrow rail */
                        right: 0;
                        height: 50vh;
                        background: white;
                        z-index: 1005; 
                        border-top: 1px solid var(--border);
                        box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
                        /* display is managed by parent logic */
                        display: none; 
                        flex-direction: column;
                        transition: transform 0.3s ease;
                        transform: translateY(100%);
                    }

                    body.desmos-split-active #mobile-desmos-panel {
                        display: flex !important;
                        transform: translateY(0);
                    }

                    .desmos-handle {
                        height: 40px;
                        background: var(--bg-secondary);
                        border-bottom: 1px solid var(--border);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 1rem;
                        font-size: 0.9rem;
                        font-weight: 600;
                        color: var(--text-primary);
                    }

                    .desmos-close-btn {
                        background: none;
                        border: none;
                        font-size: 1.2rem;
                        cursor: pointer;
                        padding: 0.25rem;
                        color: var(--text-secondary);
                    }

                    #mobile-desmos-panel iframe {
                        flex: 1;
                        width: 100%;
                        height: 100%;
                    }
                }
            `;
                document.head.appendChild(style);
            }

            // Close button handler
            panel.querySelector('.desmos-close-btn').addEventListener('click', () => {
                body.classList.remove('desmos-split-active');
            });

            // Activate after creation
            requestAnimationFrame(() => {
                body.classList.add('desmos-split-active');
            });
        }

        // Auto-init Desmos on Mobile Portrait and Remove Button
        function checkAndInitDesmos() {
            // Only run on Desmos pillar pages
            if (!window.location.pathname.includes('/desmos/')) return;

            const isPortrait = window.matchMedia('(orientation: portrait)').matches;
            const isMobileWidth = window.innerWidth <= 1024;

            if (isPortrait && isMobileWidth) {
                // Only init if not already present
                if (!document.getElementById('mobile-desmos-panel')) {
                    toggleDesmosSplitScreen(true);
                } else {
                    document.body.classList.add('desmos-split-active');
                }
            }
        }

        // Check on load
        checkAndInitDesmos();
        // Check on resize (debounced)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkAndInitDesmos, 200);
        });

        // Close flyout function
        const closeFlyout = () => {
            flyout.classList.remove('active');
            flyoutOverlay.classList.remove('active');

            // Remove flyout-active from all items
            railContainer.querySelectorAll('.rail-item').forEach(b => {
                b.classList.remove('flyout-active');
            });

            // Restore original active state
            const activeElement = railContainer.querySelector(`.rail-item[data-pillar="${activeId}"]`);
            if (activeElement) activeElement.classList.add('active');
        };

        // Close button event
        flyoutClose.addEventListener('click', closeFlyout);
        flyoutOverlay.addEventListener('click', closeFlyout);

        // Pillar button click handlers
        railContainer.querySelectorAll('button[data-pillar]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const pillarId = btn.dataset.pillar;
                const pillarPath = btn.dataset.path;
                const pillar = PILLARS.find(p => p.id === pillarId);



                if (!pillar) {
                    // Navigate directly if no pillar data
                    window.location.href = `${basePath}${pillarPath}`;
                    return;
                }

                // Highlight the active pillar button in the rail
                // Use closest to ensure we have the live DOM element
                const rail = btn.closest('#narrow-rail') || railContainer;
                rail.querySelectorAll('.rail-item').forEach(b => {
                    b.classList.remove('flyout-active');
                    b.classList.remove('active'); // Ensure mutual exclusivity
                });
                btn.classList.add('flyout-active');

                // Update flyout title
                flyoutTitle.textContent = pillar.name;

                // Build flyout content from pillar categories
                // Structure: Category (header) > Subsection (sub-header, NOT clickable) > Topics (clickable links)
                let html = '';
                pillar.categories.forEach(category => {
                    html += `<div class="flyout-section">`;
                    html += `<div class="flyout-section-title">${category.name}</div>`;

                    category.subsections.forEach(sub => {
                        // Only show subsections that have topics with paths
                        if (sub.topics && sub.topics.length > 0) {
                            // Subsection name as sub-header (NOT clickable)
                            html += `<div class="flyout-subsection-title">${sub.name}</div>`;

                            // Topics are the actual clickable exercise links
                            sub.topics.forEach(topic => {
                                if (topic.path) {
                                    const topicHref = `${basePath}${topic.path}`;
                                    // STRICT MATCHING LOGIC
                                    // 1. Remove leading/trailing slashes for comparison
                                    const cleanCurrent = currentPath.replace(/^\/|\/$/g, '').replace('index.html', '');
                                    const cleanTopic = topic.path.replace(/^\/|\/$/g, '').replace('index.html', '');

                                    // 2. Exact match on the last segment (folder name) is absolutely required to prevent sticky active states
                                    // Split by '/' and compare the last non-empty part
                                    const currentSegments = cleanCurrent.split('/').filter(Boolean);
                                    const topicSegments = cleanTopic.split('/').filter(Boolean);

                                    const currentFolder = currentSegments.length > 0 ? currentSegments[currentSegments.length - 1] : '';
                                    const topicFolder = topicSegments.length > 0 ? topicSegments[topicSegments.length - 1] : '';

                                    // The folder names MUST match exactly. No fuzzy matching allowed.
                                    const isActive = (currentFolder !== '' && topicFolder !== '' && currentFolder === topicFolder);

                                    html += `<a href="${topicHref}" class="flyout-topic ${isActive ? 'active' : ''}" style="border: 2px solid #ff4d4f !important;">${topic.name}</a>`;
                                }
                            });
                        }
                    });

                    html += `</div>`;
                });


                flyoutContent.innerHTML = html;

                // Attach click handlers for links - navigate and close flyout
                flyoutContent.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        // Allow default navigation to happen
                        closeFlyout();
                        // Remove flyout-active from buttons
                        railContainer.querySelectorAll('button[data-pillar]').forEach(b => {
                            b.classList.remove('flyout-active');
                        });
                    });
                });

                // Open flyout (or update if already open)
                flyout.classList.add('active');
                flyoutOverlay.classList.add('active');
            });
        });

        // Add style for flyout-active state
        if (!document.getElementById('flyout-active-style')) {
            const activeStyle = document.createElement('style');
            activeStyle.id = 'flyout-active-style';
            activeStyle.textContent = `
                .rail-item.flyout-active {
                    background: var(--accent-primary) !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                }
            `;
            document.head.appendChild(activeStyle);
        }
    }



    function renderByTopic() {
        let html = '';
        const currentHash = window.location.hash;

        // 1. Get the unified Domain/Subsection structure from the first pillar (canonical)
        const domains = PILLARS[0].categories;

        // Pillars to track for gaps (excluding Wallpapers)
        const TARGET_PILLAR_IDS = ['math', 'formulas', 'desmos', 'hard-questions'];

        html = domains.map(domain => {
            if (!domain.subsections) return '';

            // Check if domain has any matching content
            const matchingSubsections = domain.subsections.map(sub => {
                // 2. For each subsection, gather content from TARGET pillars
                const pillarContent = PILLARS
                    .filter(p => TARGET_PILLAR_IDS.includes(p.id))
                    .map(p => {
                        const pDomain = p.categories.find(d => d.name === domain.name);
                        const pSub = pDomain?.subsections?.find(s => s.name === sub.name);

                        const hasContent = pSub && pSub.topics.length > 0;

                        // Tokenize search query for fuzzy matching (match all terms)
                        const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
                        const isMatch = (text) => {
                            if (!searchQuery) return true;
                            const lowerText = text.toLowerCase();
                            return searchTerms.every(term => lowerText.includes(term));
                        };

                        // Check match (Subsection name or Topic name)
                        const subNameMatch = isMatch(sub.name);

                        let matchTopics = [];
                        if (hasContent) {
                            matchTopics = searchQuery
                                ? pSub.topics.filter(t => subNameMatch || isMatch(t.name))
                                : pSub.topics;
                        }

                        // Logic: Show placeholder if EMPTY, but only if:
                        // 1. No search query (show all gaps)
                        // 2. Search query matches Subsection Name (show gaps for this specific sub)

                        const showPlaceholder = !hasContent && (!searchQuery || subNameMatch);
                        const showContent = hasContent && matchTopics.length > 0;

                        if (showPlaceholder) {
                            return { pillar: p, isPlaceholder: true };
                        } else if (showContent) {
                            return { pillar: p, content: { name: pSub.name, topics: matchTopics } };
                        }
                        return null;
                    }).filter(item => item !== null);

                if (pillarContent.length === 0) return null;

                return { subName: sub.name, content: pillarContent };
            }).filter(sub => sub !== null);

            if (matchingSubsections.length === 0) return '';

            return `
                <div class="side-tree-group active">
                    <h4>${domain.name}</h4>
                    ${matchingSubsections.map(subItem => {
                const hubPath = SUBSECTION_TO_HUB[subItem.subName];
                // CHANGED: Render as plain text (no link, no arrow)
                const headerHTML = subItem.subName;

                return `
                        <div class="side-tree-subsection">
                            <div class="side-tree-subsection-header">
                                ${headerHTML}
                            </div>
                            <ul class="side-tree-topic">
                                ${subItem.content.map(pc => {
                    if (pc.isPlaceholder) {
                        return `
                                            <li>
                                                <span class="side-link" style="opacity: 0.3; cursor: default;">
                                                    <span style="margin-right: 4px;">[${pc.pillar.icon}]</span> —
                                                </span>
                                            </li>
                                        `;
                    }
                    return pc.content.topics.map(topic => {
                        const isActive = isLinkActive(topic.path, currentPath, currentHash);
                        let href = basePath + topic.path;
                        if (window.location.protocol === 'file:' && href.endsWith('/')) {
                            href += 'index.html';
                        }
                        return `
                                            <li>
                                                <a href="${href}" class="side-link ${isActive ? 'active' : ''}">
                                                    <span style="opacity: 0.6; margin-right: 4px;">[${pc.pillar.icon}]</span> ${topic.name}
                                                </a>
                                            </li>
                                        `;
                    }).join('');
                }).join('')}
                            </ul>
                        </div>
                    `}).join('')}
                </div>
            `;
        }).join('');

        if (!html && searchQuery) {
            html = `<div style="padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">No topics found for "${searchQuery}"</div>`;
        }

        sidebarTree.innerHTML = html;
    }

    function renderTree() {
        if (searchQuery || sidebarView === 'topic') {
            renderByTopic();
            return;
        }

        const activePillar = PILLARS.find(p => p.id === activePillarId);
        if (!activePillar) return;

        let html = '';
        const currentHash = window.location.hash;

        html = activePillar.categories.map(cat => {
            if (!cat.subsections) return '';

            return `
                <div class="side-tree-group active">
                    <h4>${cat.name}</h4>
                    ${cat.subsections.map(subsection => {
                const hubPath = SUBSECTION_TO_HUB[subsection.name];
                // CHANGED: Render as plain text (no link, no arrow)
                const headerHTML = subsection.name;

                return `
                        <div class="side-tree-subsection">
                            <div class="side-tree-subsection-header">${headerHTML}</div>
                            <ul class="side-tree-topic">
                                ${subsection.topics.map(topic => {
                    const isActive = isLinkActive(topic.path, currentPath, currentHash);
                    let href = basePath + topic.path;
                    if (window.location.protocol === 'file:' && href.endsWith('/')) {
                        href += 'index.html';
                    }
                    return `
                                        <li>
                                            <a href="${href}" class="side-link ${isActive ? 'active' : ''}">
                                                ${topic.name}
                                            </a>
                                        </li>
                                    `;
                }).join('')}
                            </ul>
                        </div>
                    `}).join('')}
                </div>
            `;
        }).join('');

        sidebarTree.innerHTML = html;
    }

    // Helper function to determine if a link is active
    function isLinkActive(topicPath, currentPath, currentHash) {
        if (topicPath.includes('#')) {
            const [topicBase, topicHash] = topicPath.split('#');
            return currentPath.includes(topicBase) && currentHash === `#${topicHash}`;
        }
        return currentPath.includes(topicPath) && !currentHash;
    }

    // 6. Event Handlers
    if (searchInput) {
        if (searchQuery) searchInput.value = searchQuery;

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderTree();
        });

        searchInput.addEventListener('focus', () => {
            if (sidebarView !== 'topic') {
                sidebarView = 'topic';
                document.querySelectorAll('.view-toggle-option').forEach(opt => opt.classList.remove('active'));
                const topicOption = document.querySelector('[data-view="topic"]');
                if (topicOption) topicOption.classList.add('active');
                const togglePill = document.querySelector('.view-toggle-pill');
                if (togglePill) togglePill.classList.add('right');
                renderTree();
            }
        });

        document.addEventListener('keydown', (e) => {
            const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    function initMobileToggle() {
        // Inject toggle button if it doesn't exist
        if (!document.querySelector('.mobile-tree-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-tree-toggle';
            toggle.innerHTML = 'INDEX ☰';
            document.body.appendChild(toggle);
        }

        const toggleBtn = document.querySelector('.mobile-tree-toggle');
        const sidebar = document.querySelector('.command-sidebar');
        const body = document.body;

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('mobile-active');
                body.classList.toggle('mobile-active');

                // Update button text
                if (sidebar.classList.contains('mobile-active')) {
                    toggleBtn.innerHTML = 'CLOSE ✕';
                } else {
                    toggleBtn.innerHTML = 'INDEX ☰';
                }
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (sidebar.classList.contains('mobile-active') && !sidebar.contains(e.target) && e.target !== toggleBtn) {
                    sidebar.classList.remove('mobile-active');
                    body.classList.remove('mobile-active');
                    toggleBtn.innerHTML = 'INDEX ☰';
                }
            });

            // Close when clicking a link (optional, depends on UX)
            sidebar.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    sidebar.classList.remove('mobile-active');
                    body.classList.remove('mobile-active');
                    toggleBtn.innerHTML = 'INDEX ☰';
                }
            });
        }
    }

    // 7. Initialize (note: renderRail() was already called earlier)
    renderTree();
    renderToggle();
    initResizableSidebar();
    initMobileToggle();

    // Listen for hash changes to update active highlighting
    window.addEventListener('hashchange', () => {
        renderTree();
        const activeLink = sidebarTree.querySelector('.side-link.active');
        if (activeLink) {
            activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Auto-scroll to active link
    const activeLink = sidebarTree.querySelector('.side-link.active');
    if (activeLink) {
        setTimeout(() => {
            activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
});
