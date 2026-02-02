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
                        <button class="calculator-btn" id="popoutBtn" title="Pop-out (Open in new window)">🗗</button>
                        <button class="calculator-btn" id="closeBtn" title="Close">✕</button>
                    </div>
                </div>
                <div class="calculator-float-body">
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
        const popoutBtn = document.getElementById('popoutBtn');
        const closeBtn = document.getElementById('closeBtn');

        // Toggle visibility
        window.toggleCalculator = function () {
            if (!calcFloat.classList.contains('active')) {
                calcFloat.style.display = 'flex';
                // Trigger reflow for animation if any
                setTimeout(() => calcFloat.classList.add('active'), 10);
                calcToggle.classList.add('hidden');
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
