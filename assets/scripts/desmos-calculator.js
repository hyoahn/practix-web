/**
 * Practix Resizable Desmos Calculator (v1.1)
 * Restores the bottom-half calculator with draggable height.
 * Optimized for mobile-only visibility.
 */
(function () {
    // 1. Mobile Detection (Stricter logic to avoid desktop false positives)
    function isMobile() {
        // Breakpoint matches the sidebar rail appearance
        const isNarrow = window.innerWidth < 1280;
        // Check for touch intent but only if narrow enough (to avoid touch laptops at 1440p)
        const isTouch = window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1366;

        return isNarrow || isTouch;
    }

    if (!isMobile()) {
        console.log("Practix: Window too wide for mobile calculator. Skipping.");
        return;
    }

    // 2. Inject Calculator HTML
    const containerId = 'desmos-mobile-calc';
    if (document.getElementById(containerId)) return;

    const containerHtml = `
        <div id="${containerId}" class="desmos-calculator-container">
            <div id="desmos-drag-handle" class="desmos-drag-handle">
                <div class="drag-pill"></div>
                <span>DESMOS CALCULATOR (DRAG TO RESIZE)</span>
            </div>
            <div class="desmos-iframe-wrapper">
                <iframe src="https://www.desmos.com/calculator" id="desmos-iframe" loading="lazy"></iframe>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', containerHtml);

    const calc = document.getElementById(containerId);
    const handle = document.getElementById('desmos-drag-handle');

    // Default to hidden
    calc.style.display = 'none';

    // 3. Define Toggle Globally
    window.toggleMobileDesmos = function (forceOpen) {
        const isActive = calc.style.display !== 'none';
        const shouldBeOpen = typeof forceOpen === 'boolean' ? forceOpen : !isActive;

        if (shouldBeOpen) {
            calc.style.display = 'flex';
            // Ensure padding is applied
            const savedHeight = localStorage.getItem('practix_desmos_height');
            const currentHeight = savedHeight ? parseInt(savedHeight) : window.innerHeight * 0.5;
            setHeight(currentHeight);
        } else {
            calc.style.display = 'none';
            // Remove padding
            const scrollContent = document.querySelector('.stage-content-scroll');
            if (scrollContent) {
                scrollContent.style.paddingBottom = '0px';
            } else {
                document.body.style.paddingBottom = '0px';
            }
        }
    };

    // 4. Resizing Logic
    let isResizing = false;
    let startY;
    let startHeight;

    // Load saved height or default to 50%
    const savedHeight = localStorage.getItem('practix_desmos_height');
    const defaultHeight = savedHeight ? parseInt(savedHeight) : window.innerHeight * 0.5;

    function setHeight(h) {
        // Constraints: 20% to 80% of window height
        const minHeight = window.innerHeight * 0.2;
        const maxHeight = window.innerHeight * 0.8;
        const finalH = Math.max(minHeight, Math.min(h, maxHeight));

        calc.style.height = `${finalH}px`;

        // Push content up
        const scrollContent = document.querySelector('.stage-content-scroll');
        if (scrollContent) {
            scrollContent.style.paddingBottom = `${finalH + 40}px`;
        } else {
            document.body.style.paddingBottom = `${finalH}px`;
        }

        localStorage.setItem('practix_desmos_height', finalH);
    }

    // Mouse Events
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        startHeight = calc.offsetHeight;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResizing);
        calc.classList.add('resizing');
    });

    // Touch Events
    handle.addEventListener('touchstart', (e) => {
        isResizing = true;
        startY = e.touches[0].clientY;
        startHeight = calc.offsetHeight;
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', stopResizing);
        calc.classList.add('resizing');
    });

    function handleMouseMove(e) {
        if (!isResizing) return;
        const delta = startY - e.clientY;
        setHeight(startHeight + delta);
    }

    function handleTouchMove(e) {
        if (!isResizing) return;
        // Only prevent default if we are specifically dragging via the handle
        if (e.target === handle || handle.contains(e.target)) {
            if (e.cancelable) e.preventDefault();
        }
        const delta = startY - e.touches[0].clientY;
        setHeight(startHeight + delta);
    }

    function stopResizing() {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', stopResizing);
        calc.classList.remove('resizing');
    }

    // Auto-update on orientation change
    window.addEventListener('resize', () => {
        if (isMobile()) {
            const currentH = calc.offsetHeight;
            setHeight(currentH);
        } else {
            calc.style.display = 'none';
        }
    });
})();
