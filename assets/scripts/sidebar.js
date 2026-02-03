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
                    topics: [
                        { name: "Linear Equations", path: "formulas/heart-of-algebra/linear-equations/" },
                        { name: "Slope from Standard Form", path: "formulas/heart-of-algebra/linear-equations/#standard-slope" },
                        { name: "Point-Slope Form", path: "formulas/heart-of-algebra/linear-equations/#point-slope" },
                        { name: "Midpoint Formula", path: "formulas/heart-of-algebra/linear-equations/#midpoint" },
                        { name: "Distance Formula", path: "formulas/heart-of-algebra/linear-equations/#distance" },
                        { name: "Pythagorean Triples", path: "formulas/heart-of-algebra/linear-equations/#pythag-triples" },
                        { name: "Percent Change Hacks", path: "formulas/heart-of-algebra/percent-change-shortcuts/" },
                        { name: "Slope & Line Mastery", path: "formulas/heart-of-algebra/slope-and-lines/" },
                        { name: "Averages & Mixtures", path: "formulas/heart-of-algebra/averages-and-mixtures/" },
                        { name: "Parallel Lines", path: "formulas/heart-of-algebra/linear-equations/#parallel-slope" },
                        { name: "Perpendicular Lines", path: "formulas/heart-of-algebra/linear-equations/#perp-slope" },
                        { name: "Horizontal Line (HOY)", path: "formulas/heart-of-algebra/linear-equations/#horiz-slope" },
                        { name: "Vertical Line (VUX)", path: "formulas/heart-of-algebra/linear-equations/#vert-slope" },
                        { name: "X-Intercept Hack", path: "formulas/heart-of-algebra/linear-equations/#x-int-hack" },
                        { name: "Intersection Meaning", path: "formulas/heart-of-algebra/linear-equations/#intersect-meaning" },
                        { name: "Infinite Solutions", path: "formulas/heart-of-algebra/linear-equations/#infinite-sols" },
                        { name: "No Solution", path: "formulas/heart-of-algebra/linear-equations/#no-sols" },
                        { name: "Standard Form Intercepts", path: "formulas/heart-of-algebra/linear-equations/#standard-ints" },
                        { name: "Inequality Shading", path: "formulas/heart-of-algebra/linear-equations/#ineq-shade" }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "formulas/passport-to-advanced-math/",
                    topics: [
                        { name: "Parabola Mastery", path: "formulas/passport-to-advanced-math/parabola-mastery/" },
                        { name: "Quadratic Solutions", path: "formulas/passport-to-advanced-math/quadratic-solutions/" },
                        { name: "Exponential Growth", path: "formulas/passport-to-advanced-math/exponential-growth/" },
                        { name: "Factoring Patterns", path: "formulas/passport-to-advanced-math/factoring-patterns/" }
                    ]
                },
                {
                    name: "Geometry & Trig",
                    path: "formulas/geometry-trigonometry/",
                    topics: [
                        { name: "Circle Equations", path: "formulas/geometry-trigonometry/circle-equations/" },
                        { name: "Arc Length (Degrees)", path: "formulas/geometry-trigonometry/circle-equations/#arc-len-deg" },
                        { name: "Sector Area (Degrees)", path: "formulas/geometry-trigonometry/circle-equations/#sector-area-deg" },
                        { name: "Arc Length (Radians)", path: "formulas/geometry-trigonometry/circle-equations/#arc-len-rad" },
                        { name: "Sector Area (Radians)", path: "formulas/geometry-trigonometry/circle-equations/#sector-area-rad" },
                        { name: "Inscribed Angle", path: "formulas/geometry-trigonometry/circle-equations/#inscribed-angle" },
                        { name: "Central Angle", path: "formulas/geometry-trigonometry/circle-equations/#central-angle" },
                        { name: "Tangent-Radius", path: "formulas/geometry-trigonometry/circle-equations/#tangent-rad" },
                        { name: "Diameter to Equation", path: "formulas/geometry-trigonometry/circle-equations/#diameter-endpoints" },
                        { name: "Cyclic Quadrilateral", path: "formulas/geometry-trigonometry/circle-equations/#cyclic-quad" },
                        { name: "Annulus Area", path: "formulas/geometry-trigonometry/circle-equations/#annulus-area" },
                        { name: "Arcs & Sectors", path: "formulas/geometry-trigonometry/arcs-and-sectors/" },
                        { name: "Polygons & Ratios", path: "formulas/geometry-trigonometry/polygons-and-ratio/" },
                        { name: "Trigonometry Hacks", path: "formulas/geometry-trigonometry/trigonometry-hacks/" }
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
                    name: "Core Techniques",
                    path: "desmos/",
                    topics: [
                        { name: "System Solver", path: "desmos/system-solver/" },
                        { name: "Absolute Value Solves", path: "desmos/absolute-value/" },
                        { name: "Polynomial Roots", path: "desmos/poly-roots/" },

                        { name: "Poly-Solve Variables", path: "desmos/poly-solve/" },
                        { name: "Regression Secrets", path: "desmos/regression-secrets/" },
                        { name: "Logarithmic Regression", path: "desmos/log-reg/" },
                        { name: "Logistic Growth", path: "desmos/logistic-reg/" },
                        { name: "Power Regression", path: "desmos/power-reg/" },
                        { name: "R-squared Check", path: "desmos/r-squared/" },
                        { name: "Residual Plot", path: "desmos/residual-plot/" },
                        { name: "Prediction Value", path: "desmos/prediction-value/" },
                        { name: "Lists & Tables", path: "desmos/lists-and-tables/" },

                        { name: "Visualization Hacks", path: "desmos/visualization-hacks/" },
                        { name: "Inequality Shading", path: "desmos/inequality-shading/" },
                        { name: "Mean vs Median", path: "desmos/mean-vs-median/" }
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
                    name: "Trap Slayer",
                    path: "hard-questions/",
                    topics: [
                        { name: "Algebra Traps", path: "hard-questions/algebra/" },
                        { name: "Infinite Solutions Trap", path: "hard-questions/algebra/#q10" },
                        { name: "No Solution Constants", path: "hard-questions/algebra/#q11" },
                        { name: "Perpendicular Slopes", path: "hard-questions/algebra/#q12" },
                        { name: "Quadratic Sum Hack", path: "hard-questions/algebra/#q13" },
                        { name: "Extraneous Roots", path: "hard-questions/algebra/#q14" },
                        { name: "Manipulating Constants", path: "hard-questions/algebra/#q15" },
                        { name: "Slope Interpretation", path: "hard-questions/algebra/#q16" },
                        { name: "Infinite Mystery", path: "hard-questions/algebra/#q17" },
                        { name: "Parallel Barrier", path: "hard-questions/algebra/#q18" },
                        { name: "Inequality Zone", path: "hard-questions/algebra/#q19" },
                        { name: "Composite Chaos", path: "hard-questions/algebra/#q20" },
                        { name: "Inverse Trap", path: "hard-questions/algebra/#q21" },
                        { name: "Shifting Asymptote", path: "hard-questions/algebra/#q22" },
                        { name: "Growth Identity", path: "hard-questions/algebra/#q23" },
                        { name: "Absolute Range", path: "hard-questions/algebra/#q24" },
                        { name: "Problem Solving", path: "hard-questions/problem-solving/" },
                        { name: "Advanced Math", path: "hard-questions/advanced-math/" },
                        { name: "Vertex Speed Run", path: "hard-questions/advanced-math/#q9" },
                        { name: "Two Root Test", path: "hard-questions/advanced-math/#q10" },
                        { name: "Ghost Roots", path: "hard-questions/advanced-math/#q11" },
                        { name: "Sum it Up", path: "hard-questions/advanced-math/#q12" },
                        { name: "Product Power", path: "hard-questions/advanced-math/#q13" },
                        { name: "Factor Logic", path: "hard-questions/advanced-math/#q14" },
                        { name: "Expression Match", path: "hard-questions/advanced-math/#q15" },
                        { name: "Decay Delay", path: "hard-questions/advanced-math/#q16" },
                        { name: "Fake Roots", path: "hard-questions/advanced-math/#q17" },
                        { name: "Forbidden Values", path: "hard-questions/advanced-math/#q18" },
                        { name: "Geometry & Trig", path: "hard-questions/geometry/" },
                        { name: "Discriminant Dangers", path: "hard-questions/discriminant-dangers/" },
                        { name: "Unit Conversion", path: "hard-questions/unit-conversion/" },
                        { name: "System Solutions", path: "hard-questions/system-solutions/" }
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

    // 3. UI Elements
    const railContainer = document.getElementById('narrow-rail');
    const sidebarTree = document.getElementById('sidebar-tree');
    const searchInput = document.getElementById('sidebar-search');

    if (!sidebarTree) return;

    // 4. State Management
    let activePillarId = PILLARS.find(p => currentPath.includes(p.path))?.id || 'formulas';

    // Check for search query in URL params (from Homepage Search-First Hero)
    const urlParams = new URLSearchParams(window.location.search);
    let searchQuery = urlParams.get('q') || '';

    // 5. Rendering Functions
    function renderRail() {
        if (!railContainer) return;
        railContainer.innerHTML = PILLARS.map(p => `
            <a href="${basePath}${p.path}" class="rail-item ${p.id === activePillarId ? 'active' : ''}" title="${p.name}">
                ${p.icon}
            </a>
        `).join('') + `
            <div style="flex-grow: 1;"></div>
            <a href="${basePath}settings/" class="rail-item" title="Settings">⚙️</a>
        `;
    }

    function renderTree() {
        const activePillar = PILLARS.find(p => p.id === activePillarId);
        if (!activePillar) return;

        let html = '';

        // Get current hash for precise matching
        const currentHash = window.location.hash;
        const currentFullPath = currentPath + currentHash;

        if (searchQuery) {
            // GLOBAL SEARCH ACROSS ALL PILLARS
            PILLARS.forEach(pillar => {
                let matches = pillar.categories.map(cat => ({
                    ...cat,
                    topics: cat.topics.filter(t =>
                        t.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                })).filter(cat => cat.topics.length > 0);

                if (matches.length > 0) {
                    html += `<div class="pillar-search-header" style="font-size: 0.7rem; color: var(--accent-primary); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 0.5rem; padding: 0 1rem;">${pillar.name}</div>`;
                    matches.forEach(cat => {
                        html += `
                            <div class="side-tree-group active">
                                <h4>${cat.name}</h4>
                                <ul class="side-tree-topic">
                                    ${cat.topics.map(topic => {
                            const isActive = isLinkActive(topic.path, currentPath, currentHash);
                            return `
                                        <li>
                                            <a href="${basePath}${topic.path}" class="side-link ${isActive ? 'active' : ''}">
                                                ${topic.name}
                                            </a>
                                        </li>
                                    `}).join('')}
                                </ul>
                            </div>
                        `;
                    });
                }
            });

            if (!html) {
                html = `<div style="padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">No shortcuts found for "${searchQuery}"</div>`;
            }
        } else {
            // STANDARD PILLAR VIEW
            let filteredCategories = activePillar.categories;

            html = filteredCategories.map(cat => `
                <div class="side-tree-group active">
                    <h4>${cat.name}</h4>
                    <ul class="side-tree-topic">
                        ${cat.topics.map(topic => {
                const isActive = isLinkActive(topic.path, currentPath, currentHash);
                // Verify if we are in local file mode and append index.html for smoother navigation
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
                        `}).join('')}
                    </ul>
                </div>
            `).join('');
        }

        sidebarTree.innerHTML = html;
    }

    // Helper function to determine if a link is active
    function isLinkActive(topicPath, currentPath, currentHash) {
        // If topic has a hash, match exact hash
        if (topicPath.includes('#')) {
            const [topicBase, topicHash] = topicPath.split('#');
            return currentPath.includes(topicBase) && currentHash === `#${topicHash}`;
        }
        // If no hash in topic path, only match if current page also has no hash
        return currentPath.includes(topicPath) && !currentHash;
    }

    // 6. Event Handlers
    if (searchInput) {
        // Sync input value with searchQuery (if from URL)
        if (searchQuery) {
            searchInput.value = searchQuery;
        }

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderTree();
        });

        // Hotkey: "/" to focus search
        document.addEventListener('keydown', (e) => {
            const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;

            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // 7. Initialize
    renderRail();
    renderTree();

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
