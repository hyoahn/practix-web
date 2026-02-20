/**
 * Floating Desmos Calculator Functionality
 * Handles showing/hiding, dragging, popping out, and auto-injecting "Try It" buttons.
 */

(function () {
    // 1. Inject CSS if not present
    function injectStyles() {
        if (document.getElementById('floating-calc-styles')) return;
        const link = document.createElement('link');
        link.id = 'floating-calc-styles';
        link.rel = 'stylesheet';
        link.href = '/assets/styles/floating-calculator.css';
        document.head.appendChild(link);
    }

    // 2. Inject Calculator HTML
    function injectCalculator() {
        if (document.getElementById('calculatorFloat')) return;

        const calcHtml = `
            <div id="calculatorFloat" class="calculator-float" style="display: none;">
                <div id="calcHeader" class="calculator-float-header">
                    <div class="calculator-title">
                        <span class="calc-icon">📉</span>
                        <span>DESMOS CALCULATOR (DRAG TO RESIZE)</span>
                    </div>
                    <div class="calculator-controls">
                        <button class="calculator-btn" id="helpBtn" title="Help">💡</button>
                        <button class="calculator-btn" id="popoutBtn" title="Pop out">↗️</button>
                        <button class="calculator-btn" id="closeBtn" title="Close">❌</button>
                    </div>
                </div>
                <div class="calculator-float-body">
                    <div id="helpOverlay" class="calculator-help-overlay">
                        <div class="help-title">💡 How to use Desmos Hacks</div>
                        <div class="help-step">
                            <span class="help-step-num">1</span>
                            <span class="help-step-text"><strong>Step 1:</strong> Always clear the calculator when starting a new problem.</span>
                        </div>
                        <div class="help-step">
                            <span class="help-step-num">2</span>
                            <span class="help-step-text"><strong>Step 2:</strong> Click the empty space <strong>Line 2</strong> BELOW the table.</span>
                        </div>
                        <div class="help-step">
                            <span class="help-step-num">3</span>
                            <span class="help-step-text"><strong>Step 3:</strong> Click <strong>Copy Code</strong> (e.g., Linear Regression) on the page and <strong>Paste</strong> it.</span>
                        </div>
                        <div class="help-step">
                            <span class="help-step-num">4</span>
                            <span class="help-step-text"><strong>Result:</strong> Look at <strong>m</strong> and <strong>b</strong> on the left. That's your answer!</span>
                        </div>
                        <div style="background: #fef2f2; border: 1px solid #fee2e2; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
                            <div style="color: #991b1b; font-weight: 700; font-size: 0.8rem; margin-bottom: 0.25rem;">⚠️ Error Alert:</div>
                            <p style="color: #991b1b; font-size: 0.75rem; margin: 0; line-height: 1.4;">Don't paste <strong>inside</strong> the table. Always click the empty Line 2 first!</p>
                        </div>
                        <div class="help-footer">
                            <button class="btn-got-it" id="gotItBtn">Got it, let's start!</button>
                        </div>
                    </div>
                    <iframe class="calculator-iframe" id="calcIframe" src="https://www.desmos.com/calculator"></iframe>
                </div>
            </div>
            <button class="calculator-toggle-btn" id="calcToggle">🧮</button>
        `;
        document.body.insertAdjacentHTML('beforeend', calcHtml);

        setupCalculatorListeners();
        hookButtons();
    }

    // 3. Add "Try It" buttons and Hook Existing Buttons
    function hookButtons() {
        // A. Inject Try It buttons next to Copy buttons if on desktop
        const isMobile = window.innerWidth <= 1024 || window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(pointer: coarse)').matches;

        // Match the stricter logic in desmos-calculator.js
        const strictIsMobile = (window.innerWidth < 1280) || (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1366);

        if (!strictIsMobile) {
            document.querySelectorAll('.btn-copy').forEach(copyBtn => {
                if (copyBtn.innerText.includes('Try It')) return;
                if (copyBtn.previousElementSibling && copyBtn.previousElementSibling.classList.contains('try-it-btn')) return;

                const tryItBtn = document.createElement('button');
                tryItBtn.className = 'btn-copy try-it-btn';
                tryItBtn.innerHTML = '🧮 Try It';
                tryItBtn.style.background = 'var(--accent-primary)';
                tryItBtn.style.color = 'white';
                tryItBtn.style.borderColor = 'var(--accent-primary)';
                tryItBtn.style.marginRight = '0.5rem';

                copyBtn.parentNode.insertBefore(tryItBtn, copyBtn);
            });
        }
    }

    // 4. Aggressive Global Listener
    function setupGlobalListeners() {
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            // 1. Hook into "Try It" buttons
            if (target.classList.contains('try-it-btn')) {
                e.preventDefault();
                window.toggleCalculator(true);
                return;
            }

            // 2. Hook into "Reveal Desmos Solve" (The red buttons)
            // Use closest to catch summary or its ::after content
            const revealSummary = target.closest('.practix-reveal summary');
            if (revealSummary) {
                // We don't preventDefault here because we want the details to open
                // but we DO want to show the calculator
                window.toggleCalculator(true);
                return;
            }

            // 3. Hook into "Copy Code" buttons (optional, but requested by user)
            if (target.classList.contains('btn-copy') && !target.classList.contains('try-it-btn')) {
                // If user clicks Copy, they likely want to Paste in Desmos. Open it.
                window.toggleCalculator(true);
            }
        }, true); // Use capture phase to be safe

        // 5. Watch for dynamic content (e.g. reveal blocks opening)
        const observer = new MutationObserver((mutations) => {
            hookButtons();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupCalculatorListeners() {
        const calcFloat = document.getElementById('calculatorFloat');
        const calcToggle = document.getElementById('calcToggle');
        const calcHeader = document.getElementById('calcHeader');
        const helpBtn = document.getElementById('helpBtn');
        const popoutBtn = document.getElementById('popoutBtn');
        const closeBtn = document.getElementById('closeBtn');
        const helpOverlay = document.getElementById('helpOverlay');
        const gotItBtn = document.getElementById('gotItBtn');

        if (calcToggle) {
            const isMobile = window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches;
            if (isMobile) {
                calcToggle.style.display = 'none';
            }
        }

        // Help mechanics
        helpBtn.addEventListener('click', () => {
            helpOverlay.classList.toggle('active');
        });

        gotItBtn.addEventListener('click', () => {
            helpOverlay.classList.remove('active');
            sessionStorage.setItem('desmos_help_shown', 'true');
        });

        // Explicit close
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleCalculator(false);
        });

        if (calcToggle) {
            calcToggle.addEventListener('click', (e) => {
                e.preventDefault();
                window.toggleCalculator();
            });
        }

        // Pop-out functionality
        popoutBtn.addEventListener('click', function () {
            window.open('https://www.desmos.com/calculator', 'DesmosCalculator', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no');
        });

        // Dragging functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        calcHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        calcHeader.addEventListener('touchstart', dragStart);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', dragEnd);

        function dragStart(e) {
            if (e.target.closest('.calculator-controls')) return;

            const rect = calcFloat.getBoundingClientRect();

            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - rect.left;
                initialY = e.touches[0].clientY - rect.top;
            } else {
                initialX = e.clientX - rect.left;
                initialY = e.clientY - rect.top;
            }

            if (e.target === calcHeader || e.target.parentElement === calcHeader || calcHeader.contains(e.target)) {
                isDragging = true;

                // Clear initial right/bottom positioning before drag to avoid conflicts
                calcFloat.style.right = 'auto';
                calcFloat.style.bottom = 'auto';
                calcFloat.style.left = rect.left + 'px';
                calcFloat.style.top = rect.top + 'px';
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                if (e.type === 'touchmove') {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                calcFloat.style.left = currentX + 'px';
                calcFloat.style.top = currentY + 'px';
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    // 6. Define Toggle Globally
    window.toggleCalculator = function (forceOpen) {
        // MOBILE DISPATCH: If the split-screen mobil calc is loaded, use it instead.
        const strictIsMobile = (window.innerWidth < 1280) || (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1366);

        if (strictIsMobile && typeof window.toggleMobileDesmos === 'function') {
            window.toggleMobileDesmos(forceOpen);
            return;
        }

        let calcFloat = document.getElementById('calculatorFloat');
        const calcToggle = document.getElementById('calcToggle');

        if (!calcFloat) {
            injectCalculator();
            calcFloat = document.getElementById('calculatorFloat');
        }

        if (!calcFloat) return;

        const helpOverlay = document.getElementById('helpOverlay');
        const isActive = calcFloat.classList.contains('active');
        const shouldBeOpen = typeof forceOpen === 'boolean' ? forceOpen : !isActive;

        if (shouldBeOpen) {
            calcFloat.style.display = 'flex';
            // Use requestAnimationFrame or double timeout to ensure transition works
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    calcFloat.classList.add('active');
                });
            });
            if (calcToggle) calcToggle.classList.add('hidden');

            if (!sessionStorage.getItem('desmos_help_shown') && helpOverlay) {
                helpOverlay.classList.add('active');
            }
        } else {
            calcFloat.classList.remove('active');
            setTimeout(() => {
                if (!calcFloat.classList.contains('active')) {
                    calcFloat.style.display = 'none';
                }
            }, 300);
            if (calcToggle) calcToggle.classList.remove('hidden');
        }
    };

    // Initialize
    function init() {
        injectCalculator();
        setupGlobalListeners();

        // Auto-open on Desmos topic pages (but not the main /desmos/ hub which has an iframe)
        const path = window.location.pathname;
        const strictIsMobile = (window.innerWidth < 1280) || (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1366);

        console.log("Practix: Floating Calculator checking auto-open for path:", path, "isMobile:", strictIsMobile);
        if (!strictIsMobile && path.includes('/desmos/') && !path.endsWith('/desmos/') && !path.endsWith('/desmos/index.html')) {
            console.log("Practix: Triggering auto-open for Desmos subpage (Desktop Only).");
            // Slight delay to ensure DOM and CSS are ready for transitions
            setTimeout(() => {
                if (typeof window.toggleCalculator === 'function') {
                    window.toggleCalculator(true);
                    console.log("Practix: toggleCalculator(true) called successfully.");
                } else {
                    console.log("Practix: toggleCalculator(true) failed, function not defined.");
                }
            }, 500);
        } else {
            console.log("Practix: Skipping auto-open for this path or viewport.");
        }
    }

    injectStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Dynamic resize handling
    window.addEventListener('resize', () => {
        hookButtons();
        // Hide/Show calcToggle based on viewport
        const calcToggle = document.getElementById('calcToggle');
        if (calcToggle) {
            const strictIsMobile = (window.innerWidth < 1280) || (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1366);
            calcToggle.style.display = strictIsMobile ? 'none' : 'flex';
        }
    });
})();
