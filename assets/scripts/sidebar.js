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
                        {
                            name: "Linear Equations & Systems",
                            topics: [
                                { name: "Linear Equations", path: "formulas/heart-of-algebra/linear-equations/" },
                                { name: "Slope from Standard Form", path: "formulas/heart-of-algebra/linear-equations/#standard-slope" },
                                { name: "Point-Slope Form", path: "formulas/heart-of-algebra/linear-equations/#point-slope" },
                                { name: "Midpoint Formula", path: "formulas/heart-of-algebra/linear-equations/#midpoint" },
                                { name: "Distance Formula", path: "formulas/heart-of-algebra/linear-equations/#distance" },
                                { name: "Parallel Lines", path: "formulas/heart-of-algebra/linear-equations/#parallel-slope" },
                                { name: "Perpendicular Lines", path: "formulas/heart-of-algebra/linear-equations/#perp-slope" },
                                { name: "Horizontal Line (HOY)", path: "formulas/heart-of-algebra/linear-equations/#horiz-slope" },
                                { name: "Vertical Line (VUX)", path: "formulas/heart-of-algebra/linear-equations/#vert-slope" },
                                { name: "X-Intercept Hack", path: "formulas/heart-of-algebra/linear-equations/#x-int-hack" },
                                { name: "Intersection Meaning", path: "formulas/heart-of-algebra/linear-equations/#intersect-meaning" },
                                { name: "Infinite Solutions", path: "formulas/heart-of-algebra/linear-equations/#infinite-sols" },
                                { name: "No Solution", path: "formulas/heart-of-algebra/linear-equations/#no-sols" },
                                { name: "Standard Form Intercepts", path: "formulas/heart-of-algebra/linear-equations/#standard-ints" }
                            ]
                        },
                        {
                            name: "Inequalities & Absolute Value",
                            topics: [
                                { name: "Inequality Shading", path: "formulas/heart-of-algebra/linear-equations/#ineq-shade" }
                            ]
                        },
                        {
                            name: "Functions & Graphing",
                            topics: [
                                { name: "Slope & Line Mastery", path: "formulas/heart-of-algebra/slope-and-lines/" },
                                { name: "Pythagorean Triples", path: "formulas/heart-of-algebra/linear-equations/#pythag-triples" }
                            ]
                        },
                        {
                            name: "Rate, Ratio, Proportion",
                            topics: [
                                { name: "Percent Change Hacks", path: "formulas/heart-of-algebra/percent-change-shortcuts/" }
                            ]
                        },
                        {
                            name: "Averages & Statistics",
                            topics: [
                                { name: "Averages & Mixtures", path: "formulas/heart-of-algebra/averages-and-mixtures/" }
                            ]
                        }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "formulas/passport-to-advanced-math/",
                    subsections: [
                        {
                            name: "Quadratic Equations & Parabolas",
                            topics: [
                                { name: "Parabola Mastery", path: "formulas/passport-to-advanced-math/parabola-mastery/" },
                                { name: "Quadratic Solutions", path: "formulas/passport-to-advanced-math/quadratic-solutions/" }
                            ]
                        },
                        {
                            name: "Exponential Functions",
                            topics: [
                                { name: "Exponential Growth", path: "formulas/passport-to-advanced-math/exponential-growth/" }
                            ]
                        },
                        {
                            name: "Factoring Techniques",
                            topics: [
                                { name: "Factoring Patterns", path: "formulas/passport-to-advanced-math/factoring-patterns/" }
                            ]
                        }
                    ]
                },
                {
                    name: "Geometry & Trig",
                    path: "formulas/geometry-trigonometry/",
                    subsections: [
                        {
                            name: "Circles & Arc Measures",
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
                                { name: "Arcs & Sectors", path: "formulas/geometry-trigonometry/arcs-and-sectors/" }
                            ]
                        },
                        {
                            name: "Angles & Polygons",
                            topics: [
                                { name: "Polygons & Ratios", path: "formulas/geometry-trigonometry/polygons-and-ratio/" }
                            ]
                        },
                        {
                            name: "Trigonometric Ratios",
                            topics: [
                                { name: "Trigonometry Hacks", path: "formulas/geometry-trigonometry/trigonometry-hacks/" }
                            ]
                        }
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
                        {
                            name: "Linear Equations & Systems",
                            topics: [
                                { name: "System Solver", path: "desmos/system-solver/" }
                            ]
                        },
                        {
                            name: "Inequalities & Absolute Value",
                            topics: [
                                { name: "Absolute Value Solves", path: "desmos/absolute-value/" },
                                { name: "Inequality Shading", path: "desmos/inequality-shading/" }
                            ]
                        }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "desmos/",
                    subsections: [
                        {
                            name: "Polynomial Operations",
                            topics: [
                                { name: "Polynomial Roots", path: "desmos/poly-roots/" },
                                { name: "Poly-Solve Variables", path: "desmos/poly-solve/" }
                            ]
                        }
                    ]
                },
                {
                    name: "Problem-Solving & Data",
                    path: "desmos/",
                    subsections: [
                        {
                            name: "Scatterplots & Regression",
                            topics: [
                                { name: "Regression Secrets", path: "desmos/regression-secrets/" },
                                { name: "Logarithmic Regression", path: "desmos/log-reg/" },
                                { name: "Logistic Growth", path: "desmos/logistic-reg/" },
                                { name: "Power Regression", path: "desmos/power-reg/" },
                                { name: "R-squared Check", path: "desmos/r-squared/" },
                                { name: "Residual Plot", path: "desmos/residual-plot/" },
                                { name: "Prediction Value", path: "desmos/prediction-value/" }
                            ]
                        },
                        {
                            name: "Data Interpretation",
                            topics: [
                                { name: "Lists & Tables", path: "desmos/lists-and-tables/" },
                                { name: "Visualization Hacks", path: "desmos/visualization-hacks/" }
                            ]
                        },
                        {
                            name: "Statistical Measures",
                            topics: [
                                { name: "Mean vs Median", path: "desmos/mean-vs-median/" }
                            ]
                        }
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
                        {
                            name: "Linear Equations & Systems",
                            topics: [
                                { name: "Algebra Traps", path: "hard-questions/algebra/" },
                                { name: "Infinite Solutions Trap", path: "hard-questions/algebra/#q10" },
                                { name: "No Solution Constants", path: "hard-questions/algebra/#q11" },
                                { name: "Infinite Mystery", path: "hard-questions/algebra/#q17" },
                                { name: "System Solutions", path: "hard-questions/system-solutions/" }
                            ]
                        },
                        {
                            name: "Functions & Graphing",
                            topics: [
                                { name: "Perpendicular Slopes", path: "hard-questions/algebra/#q12" },
                                { name: "Slope Interpretation", path: "hard-questions/algebra/#q16" },
                                { name: "Parallel Barrier", path: "hard-questions/algebra/#q18" }
                            ]
                        },
                        {
                            name: "Inequalities & Absolute Value",
                            topics: [
                                { name: "Inequality Zone", path: "hard-questions/algebra/#q19" },
                                { name: "Absolute Range", path: "hard-questions/algebra/#q24" }
                            ]
                        }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "hard-questions/",
                    subsections: [
                        {
                            name: "Quadratic Equations & Parabolas",
                            topics: [
                                { name: "Advanced Math", path: "hard-questions/advanced-math/" },
                                { name: "Quadratic Sum Hack", path: "hard-questions/algebra/#q13" },
                                { name: "Vertex Speed Run", path: "hard-questions/advanced-math/#q9" },
                                { name: "Two Root Test", path: "hard-questions/advanced-math/#q10" },
                                { name: "Ghost Roots", path: "hard-questions/advanced-math/#q11" },
                                { name: "Sum it Up", path: "hard-questions/advanced-math/#q12" },
                                { name: "Product Power", path: "hard-questions/advanced-math/#q13" },
                                { name: "Fake Roots", path: "hard-questions/advanced-math/#q17" },
                                { name: "Discriminant Dangers", path: "hard-questions/discriminant-dangers/" }
                            ]
                        },
                        {
                            name: "Polynomial Operations",
                            topics: [
                                { name: "Manipulating Constants", path: "hard-questions/algebra/#q15" },
                                { name: "Expression Match", path: "hard-questions/advanced-math/#q15" }
                            ]
                        },
                        {
                            name: "Rational Expressions & Equations",
                            topics: [
                                { name: "Extraneous Roots", path: "hard-questions/algebra/#q14" },
                                { name: "Shifting Asymptote", path: "hard-questions/algebra/#q22" },
                                { name: "Forbidden Values", path: "hard-questions/advanced-math/#q18" }
                            ]
                        },
                        {
                            name: "Functions (Advanced)",
                            topics: [
                                { name: "Composite Chaos", path: "hard-questions/algebra/#q20" },
                                { name: "Inverse Trap", path: "hard-questions/algebra/#q21" }
                            ]
                        },
                        {
                            name: "Exponential Functions",
                            topics: [
                                { name: "Growth Identity", path: "hard-questions/algebra/#q23" },
                                { name: "Decay Delay", path: "hard-questions/advanced-math/#q16" }
                            ]
                        },
                        {
                            name: "Factoring Techniques",
                            topics: [
                                { name: "Factor Logic", path: "hard-questions/advanced-math/#q14" }
                            ]
                        }
                    ]
                },
                {
                    name: "Problem-Solving & Data",
                    path: "hard-questions/",
                    subsections: [
                        {
                            name: "Rate, Ratio, Proportion",
                            topics: [
                                { name: "Problem Solving", path: "hard-questions/problem-solving/" },
                                { name: "Unit Conversion", path: "hard-questions/unit-conversion/" }
                            ]
                        }
                    ]
                },
                {
                    name: "Geometry & Trig",
                    path: "hard-questions/",
                    subsections: [
                        {
                            name: "General Geometry",
                            topics: [
                                { name: "Geometry & Trig", path: "hard-questions/geometry/" }
                            ]
                        }
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
    let sidebarView = localStorage.getItem('practix_sidebar_view') || 'pillar'; // 'pillar' or 'topic'

    // Check for search query in URL params (from Homepage Search-First Hero)
    const urlParams = new URLSearchParams(window.location.search);
    let searchQuery = urlParams.get('q') || '';

    // If there's a search query, default to 'topic' view for better discovery
    if (searchQuery) sidebarView = 'topic';

    // 5. Rendering Functions
    function renderToggle() {
        const sidebar = document.querySelector('.command-sidebar') || document.querySelector('.sidebar-nav');
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

    function renderByTopic() {
        let html = '';
        const currentHash = window.location.hash;

        // 1. Get the unified Domain/Subsection structure from the first pillar (canonical)
        const domains = PILLARS[0].categories;

        html = domains.map(domain => {
            if (!domain.subsections) return '';

            return `
                <div class="side-tree-group active">
                    <h4>${domain.name}</h4>
                    ${domain.subsections.map(sub => {
                // 2. For each subsection, find content across ALL pillars
                const pillarContent = PILLARS.map(p => {
                    const pDomain = p.categories.find(d => d.name === domain.name);
                    if (!pDomain || !pDomain.subsections) return null;
                    const pSub = pDomain.subsections.find(s => s.name === sub.name);
                    return { pillar: p, content: pSub };
                }).filter(item => item && item.content);

                return `
                            <div class="side-tree-subsection">
                                <div class="side-tree-subsection-header">${sub.name}</div>
                                <ul class="side-tree-topic">
                                    ${pillarContent.map(pc => {
                    return pc.content.topics.map(topic => {
                        const isActive = isLinkActive(topic.path, currentPath, currentHash);
                        let href = basePath + topic.path;
                        if (window.location.protocol === 'file:' && href.endsWith('/')) {
                            href += 'index.html';
                        }
                        // Add pillar icon/marker
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
                        `;
            }).join('')}
                </div>
            `;
        }).join('');

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

        // Get current hash for precise matching
        const currentHash = window.location.hash;

        // STANDARD PILLAR VIEW
        let filteredCategories = activePillar.categories;

        html = filteredCategories.map(cat => {
            // Check if category has subsections or direct topics
            if (cat.subsections) {
                // Render with subsections (3-level hierarchy)
                return `
                    <div class="side-tree-group active">
                        <h4>${cat.name}</h4>
                        ${cat.subsections.map(subsection => `
                            <div class="side-tree-subsection">
                                <div class="side-tree-subsection-header">${subsection.name}</div>
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
                        `).join('')}
                    </div>
                `;
            } else {
                // Legacy: direct topics (2-level hierarchy for wallpapers etc.)
                return `
                    <div class="side-tree-group active">
                        <h4>${cat.name}</h4>
                        <ul class="side-tree-topic">
                            ${cat.topics.map(topic => {
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
                `;
            }
        }).join('');

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

        // Auto-switch to topic mode on search focus
        searchInput.addEventListener('focus', () => {
            if (sidebarView !== 'topic') {
                sidebarView = 'topic';
                // Trigger UI update for toggle
                document.querySelectorAll('.view-toggle-option').forEach(opt => opt.classList.remove('active'));
                document.querySelector('[data-view="topic"]').classList.add('active');
                document.querySelector('.view-toggle-pill').classList.add('right');
                renderTree();
            }
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
    renderToggle();
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
