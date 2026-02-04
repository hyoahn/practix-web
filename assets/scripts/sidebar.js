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
                                { name: "Slope & Line Mastery", path: "formulas/heart-of-algebra/slope-and-lines/" }
                            ]
                        },
                        {
                            name: "Rate, Ratio, Proportion",
                            topics: [
                                { name: "Percent Change Hacks", path: "formulas/heart-of-algebra/percent-change-shortcuts/" }
                            ]
                        },
                        {
                            name: "Averages & Statistics Basics",
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
                        { name: "Polynomial Operations", topics: [] },
                        {
                            name: "Exponential Functions",
                            topics: [
                                { name: "Exponential Growth", path: "formulas/passport-to-advanced-math/exponential-growth/" }
                            ]
                        },
                        { name: "Rational Expressions & Equations", topics: [] },
                        { name: "Radicals & Complex Numbers", topics: [] },
                        { name: "Functions (Advanced)", topics: [] },
                        {
                            name: "Factoring Techniques",
                            topics: [
                                { name: "Factoring Patterns", path: "formulas/passport-to-advanced-math/factoring-patterns/" }
                            ]
                        },
                        { name: "Word Problems (Advanced)", topics: [] },
                        { name: "Sequences & Series", topics: [] }
                    ]
                },
                {
                    name: "Problem-Solving & Data Analysis",
                    path: "formulas/",
                    subsections: [
                        { name: "Percentages & Percent Change", topics: [] },
                        { name: "Data Interpretation (Tables, Charts)", topics: [] },
                        { name: "Statistical Measures (Mean, Median, Mode)", topics: [] },
                        { name: "Probability & Counting", topics: [] },
                        { name: "Scatterplots & Regression", topics: [] },
                        { name: "Study Design & Sampling", topics: [] }
                    ]
                },
                {
                    name: "Geometry & Trigonometry",
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
                            name: "Triangles & Pythagorean Theorem",
                            topics: [
                                { name: "Pythagorean Triples", path: "formulas/heart-of-algebra/linear-equations/#pythag-triples" }
                            ]
                        },
                        { name: "Coordinate Geometry", topics: [] },
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
                        },
                        { name: "Unit Circle & Radians", topics: [] }
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
                                { name: "Polynomial Roots", path: "desmos/polynomial-roots/" },
                                { name: "Poly-Solve Variables", path: "desmos/poly-solve/" }
                            ]
                        }
                    ]
                },
                {
                    name: "Problem-Solving & Data Analysis",
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
                            name: "Data Interpretation (Tables, Charts)",
                            topics: [
                                { name: "Lists & Tables", path: "desmos/lists-and-tables/" },
                                { name: "Visualization Hacks", path: "desmos/visualization-hacks/" }
                            ]
                        },
                        {
                            name: "Statistical Measures (Mean, Median, Mode)",
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
                    name: "Problem-Solving & Data Analysis",
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
                    name: "Geometry & Trigonometry",
                    path: "hard-questions/",
                    subsections: [
                        {
                            name: "Circles & Arc Measures",
                            topics: [
                                { name: "Geometry & Trig", path: "hard-questions/geometry/" }
                            ]
                        }
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
                        {
                            name: "Linear Equations & Systems",
                            topics: [
                                { name: "Variables in Linear Equations", path: "math/linear-equations/" },
                                { name: "Lines and Linear Functions", path: "math/linear-equations/" },
                                { name: "Systems of Linear Equations", path: "math/systems/" }
                            ]
                        },
                        {
                            name: "Inequalities & Absolute Value",
                            topics: [
                                { name: "Linear Inequalities", path: "math/inequalities/" }
                            ]
                        }
                    ]
                },
                {
                    name: "Advanced Math",
                    path: "math/",
                    subsections: [
                        {
                            name: "Polynomial Operations",
                            topics: [
                                { name: "Polynomial Functions", path: "math/#section-6" }
                            ]
                        },
                        {
                            name: "Quadratic Equations & Parabolas",
                            topics: [
                                { name: "Quadratic Equations", path: "math/#section-7" }
                            ]
                        },
                        {
                            name: "Rational Expressions & Equations",
                            topics: [
                                { name: "Solutions of Linear Expressions", path: "math/#section-8" }
                            ]
                        },
                        {
                            name: "Inequalities & Absolute Value",
                            topics: [
                                { name: "Absolute Value", path: "math/#section-9" }
                            ]
                        },
                        {
                            name: "Rate, Ratio, Proportion",
                            topics: [
                                { name: "Ratios, Fractions, Proportions", path: "math/#section-10" }
                            ]
                        },
                        {
                            name: "Percentages & Percent Change",
                            topics: [
                                { name: "Percentages", path: "math/#section-11" }
                            ]
                        },
                        {
                            name: "Exponential Functions",
                            topics: [
                                { name: "Exponents", path: "math/#section-12" },
                                { name: "Exponential Growth & Decay", path: "math/#section-13" }
                            ]
                        },
                        {
                            name: "Polynomial Operations",
                            topics: [
                                { name: "Manipulating Expressions", path: "math/#section-14" }
                            ]
                        }
                    ]
                },
                {
                    name: "Problem-Solving & Data Analysis",
                    path: "math/",
                    subsections: [
                        {
                            name: "Probability & Counting",
                            topics: [
                                { name: "Probability", path: "math/#section-15" }
                            ]
                        },
                        {
                            name: "Data Interpretation (Tables, Charts)",
                            topics: [
                                { name: "Reading Graphs", path: "math/#section-16" },
                                { name: "Histograms & Bar Graphs", path: "math/#section-17" },
                                { name: "Studies & Data Interpretation", path: "math/#section-20" }
                            ]
                        },
                        {
                            name: "Statistical Measures (Mean, Median, Mode)",
                            topics: [
                                { name: "Mean, Median, Mode, Range", path: "math/#section-18" },
                                { name: "Median in Box Plots", path: "math/#section-19" }
                            ]
                        }
                    ]
                },
                {
                    name: "Geometry & Trigonometry",
                    path: "math/",
                    subsections: [
                        {
                            name: "Circles & Arc Measures",
                            topics: [
                                { name: "Circles", path: "math/circles/" }
                            ]
                        },
                        {
                            name: "Angles & Polygons",
                            topics: [
                                { name: "Lines and Angles", path: "math/#section-22" },
                                { name: "Quadrilaterals", path: "math/#section-24" }
                            ]
                        },
                        {
                            name: "Triangles & Pythagorean Theorem",
                            topics: [
                                { name: "Triangles", path: "math/#section-23" }
                            ]
                        },
                        {
                            name: "Coordinate Geometry",
                            topics: [
                                { name: "Three-Dimensional Figures", path: "math/#section-25" }
                            ]
                        },
                        {
                            name: "Trigonometric Ratios",
                            topics: [
                                { name: "Trigonometry", path: "math/#section-26" }
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
                    ${matchingSubsections.map(subItem => `
                        <div class="side-tree-subsection">
                            <div class="side-tree-subsection-header">
                                ${subItem.subName === 'Circles & Arc Measures'
                    ? `<a href="${basePath}circle-equations/" style="color: inherit; text-decoration: none; border-bottom: 1px dashed var(--accent-primary);"> ${subItem.subName} →</a>`
                    : subItem.subName
                }
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
                    `).join('')}
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
            if (cat.subsections) {
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

    // 7. Initialize
    renderRail();
    renderTree();
    renderToggle();
    initResizableSidebar();

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
