/**
 * Practix Resizable Desmos Calculator (v1)
 * Restores the bottom-half calculator with draggable height.
 */
(function () {
    // 1. Mobile Detection (Same logic as sidebar.js for consistency)
    function isMobile() {
        return window.innerWidth <= 1280 ||
            window.matchMedia('(max-width: 1280px)').matches ||
            window.matchMedia('(pointer: coarse)').matches;
    }

    if (!isMobile()) return;

    // 2. Inject Calculator HTML
    const containerHtml = `
        <div id="desmos-mobile-calc" class="desmos-calculator-container">
            <div id="desmos-drag-handle" class="desmos-drag-handle">
                <div class="drag-pill"></div>
                <span>DESMOS CALCULATOR (DRAG TO RESIZE)</span>
            </div>
            <div class="desmos-iframe-wrapper">
                <iframe src="https://www.desmos.com/calculator" id="desmos-iframe"></iframe>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', containerHtml);

    const calc = document.getElementById('desmos-mobile-calc');
    const handle = document.getElementById('desmos-drag-handle');
    const mainStage = document.querySelector('.main-stage') || document.body;

    // 3. Resizing Logic
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
        // Push content up - find the stage-content-scroll if it exists
        const scrollContent = document.querySelector('.stage-content-scroll');
        if (scrollContent) {
            scrollContent.style.paddingBottom = `${finalH + 40}px`;
        } else {
            document.body.style.paddingBottom = `${finalH}px`;
        }

        localStorage.setItem('practix_desmos_height', finalH);
    }

    setHeight(defaultHeight);

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
        e.preventDefault(); // Prevent scrolling while resizing
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
})();
