/**
 * Practix Command Rail & Spotlight Engine
 * Manages the multi-pillar navigation and instant search.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine the path depth
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);
    const hasFile = pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.');
    const depth = hasFile ? pathSegments.length - 1 : pathSegments.length;
    const basePath = depth === 0 ? '' : '../'.repeat(depth);

    // 2. Define the Full Site Tree (Categorized by Pillar)
    const PILLARS = [
        {
            id: 'formulas',
            name: 'Formula Hub',
            icon: 'Σ',
            path: 'formulas/',
            categories: [
                {
                    name: "Heart of Algebra",
                    path: "formulas/heart-of-algebra/",
                    topics: [
                        { name: "Linear Equations", path: "formulas/heart-of-algebra/linear-equations/" },
                        { name: "Percent Change Hacks", path: "formulas/heart-of-algebra/percent-change-shortcuts/" },
                        { name: "Slope & Line Mastery", path: "formulas/heart-of-algebra/slope-and-lines/" },
                        { name: "Averages & Mixtures", path: "formulas/heart-of-algebra/averages-and-mixtures/" }
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
                        { name: "Arcs & Sectors", path: "formulas/geometry-trigonometry/arcs-and-sectors/" },
                        { name: "Polygons & Ratios", path: "formulas/geometry-trigonometry/polygons-and-ratio/" },
                        { name: "Trigonometry Hacks", path: "formulas/geometry-trigonometry/trigonometry-hacks/" }
                    ]
                }
            ]
        },
        {
            id: 'desmos',
            name: 'Desmos Hacks',
            icon: 'y=',
            path: 'desmos/',
            categories: [
                {
                    name: "Core Techniques",
                    path: "desmos/",
                    topics: [
                        { name: "Regression Secrets", path: "desmos/regression-secrets/" },
                        { name: "Lists & Tables", path: "desmos/lists-and-tables/" },
                        { name: "Visualization Hacks", path: "desmos/visualization-hacks/" }
                    ]
                }
            ]
        },
        {
            id: 'hard-questions',
            name: 'Boss Mode',
            icon: '☠️',
            path: 'hard-questions/',
            categories: [
                {
                    name: "Trap Slayer",
                    path: "hard-questions/",
                    topics: [
                        { name: "Algebra Traps", path: "hard-questions/algebra/" },
                        { name: "Advanced Math", path: "hard-questions/advanced-math/" },
                        { name: "Geometry & Trig", path: "hard-questions/geometry/" }
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
                                    ${cat.topics.map(topic => `
                                        <li>
                                            <a href="${basePath}${topic.path}" class="side-link ${currentPath.includes(topic.path) ? 'active' : ''}">
                                                ${topic.name}
                                            </a>
                                        </li>
                                    `).join('')}
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
                        ${cat.topics.map(topic => `
                            <li>
                                <a href="${basePath}${topic.path}" class="side-link ${currentPath.includes(topic.path) ? 'active' : ''}">
                                    ${topic.name}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('');
        }

        sidebarTree.innerHTML = html;
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
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // 7. Initialize
    renderRail();
    renderTree();

    // Auto-scroll to active link
    const activeLink = sidebarTree.querySelector('.side-link.active');
    if (activeLink) {
        setTimeout(() => {
            activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
});
