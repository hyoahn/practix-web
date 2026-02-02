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
            <div class="calculator-float" id="calculatorFloat">
                <div class="calculator-float-header" id="calcHeader">
                    <h3>🧮 Desmos Calculator</h3>
                    <div class="calculator-controls">
                        <button class="calculator-btn" id="helpBtn" title="Help / Instructions">?</button>
                        <button class="calculator-btn" id="popoutBtn" title="Pop-out (Open in new window)">🗗</button>
                        <button class="calculator-btn" id="closeBtn" title="Close">✕</button>
                    </div>
                </div>
                <div class="calculator-float-body">
                    <div class="calculator-help-overlay" id="helpOverlay">
                        <div class="help-title">🚀 Complete Step-by-Step Guide</div>
                        
                        <div class="help-step">
                            <span class="help-step-num">1</span>
                            <span class="help-step-text"><strong>Open:</strong> Click the <strong>🧮 Try It</strong> or <strong>🧮</strong> button.</span>
                        </div>
                        
                        <div class="help-step">
                            <span class="help-step-num">2</span>
                            <span class="help-step-text"><strong>Create Table:</strong> Inside Desmos, click the <strong>+</strong> icon (top left) and select <strong>Table</strong>.</span>
                        </div>
                        
                        <div class="help-step">
                            <span class="help-step-num">3</span>
                            <span class="help-step-text"><strong>Add Data:</strong> Type your numbers into the <strong>x₁</strong> and <strong>y₁</strong> columns.</span>
                        </div>
                        
                        <div class="help-step">
                            <span class="help-step-num">4</span>
                            <span class="help-step-text"><strong>Click Below:</strong> Click the empty space <strong>BELOW</strong> the table. You should see a new number <strong>"2"</strong> appear on the left.</span>
                        </div>

                        <div class="help-step">
                            <span class="help-step-num">5</span>
                            <span class="help-step-text"><strong>Paste Code:</strong> Click <strong>Copy Code</strong> for your technique on this page, then <strong>Paste</strong> it into that new Line 2. (It will look like <strong>y_1 ~ m*x_1 + b</strong>).</span>
                        </div>

                        <div style="background: #fef2f2; border: 1px solid #fee2e2; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <div style="color: #991b1b; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.25rem;">⚠️ High Alert: Don't Paste in Table!</div>
                            <p style="color: #991b1b; font-size: 0.8rem; margin: 0; line-height: 1.4;">If you paste <strong>inside</strong> the table (Box 1), you'll get a warning triangle. Always click the empty Line 2 first!</p>
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
        addTryItButtons();
    }

    // 3. Add "Try It" buttons next to all "Copy Code" buttons
    function addTryItButtons() {
        document.querySelectorAll('.btn-copy').forEach(copyBtn => {
            // Check if it's already a "Try It" button to avoid recursion
            if (copyBtn.innerText.includes('Try It')) return;
            // Check if a "Try It" button already exists next to it
            if (copyBtn.previousElementSibling && copyBtn.previousElementSibling.innerText.includes('Try It')) return;

            const tryItBtn = document.createElement('button');
            tryItBtn.className = 'btn-copy try-it-btn';
            tryItBtn.innerHTML = '🧮 Try It';
            tryItBtn.style.background = 'var(--accent-primary)';
            tryItBtn.style.color = 'white';
            tryItBtn.style.borderColor = 'var(--accent-primary)';
            tryItBtn.style.marginRight = '0.5rem';
            tryItBtn.onclick = window.toggleCalculator;

            copyBtn.parentNode.insertBefore(tryItBtn, copyBtn);
        });
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

        // Toggle visibility
        window.toggleCalculator = function () {
            if (!calcFloat.classList.contains('active')) {
                calcFloat.style.display = 'flex';
                // Trigger reflow for animation if any
                setTimeout(() => calcFloat.classList.add('active'), 10);
                calcToggle.classList.add('hidden');

                // Show help by default on first open of the session
                if (!sessionStorage.getItem('desmos_help_shown')) {
                    helpOverlay.classList.add('active');
                }
            } else {
                calcFloat.classList.remove('active');
                setTimeout(() => {
                    if (!calcFloat.classList.contains('active')) {
                        calcFloat.style.display = 'none';
                    }
                }, 300);
                calcToggle.classList.remove('hidden');
            }
        };

        // Help mechanics
        helpBtn.addEventListener('click', () => {
            helpOverlay.classList.toggle('active');
        });

        gotItBtn.addEventListener('click', () => {
            helpOverlay.classList.remove('active');
            sessionStorage.setItem('desmos_help_shown', 'true');
        });

        // Explicit close
        closeBtn.addEventListener('click', toggleCalculator);
        calcToggle.addEventListener('click', toggleCalculator);

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

            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - (parseInt(calcFloat.style.left) || 0);
                initialY = e.touches[0].clientY - (parseInt(calcFloat.style.top) || 0);
            } else {
                initialX = e.clientX - (parseInt(calcFloat.style.left) || 0);
                initialY = e.clientY - (parseInt(calcFloat.style.top) || 0);
            }

            if (e.target === calcHeader || e.target.parentElement === calcHeader || calcHeader.contains(e.target)) {
                isDragging = true;
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

                // Get calculator dimensions
                const calcWidth = calcFloat.offsetWidth;
                const calcHeight = calcFloat.offsetHeight;

                // Constrain within viewport
                const maxX = window.innerWidth - calcWidth;
                const maxY = window.innerHeight - calcHeight;

                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                calcFloat.style.right = 'auto';
                calcFloat.style.bottom = 'auto';
                calcFloat.style.left = currentX + 'px';
                calcFloat.style.top = currentY + 'px';
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    // Initialize
    injectStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCalculator);
    } else {
        injectCalculator();
    }
})();
