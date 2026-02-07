/**
 * Landscape Mode Enforcer for Desmos Pillar Pages
 * Shows an overlay prompting users to rotate their device when in portrait mode
 * This enables split-screen layout: content on left, Desmos calculator on right
 */

(function () {
    'use strict';

    // Only apply on mobile devices (screen width <= 1024px in portrait)
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    if (!isMobileDevice()) return;

    // Create landscape overlay
    const overlay = document.createElement('div');
    overlay.id = 'landscape-overlay';
    overlay.innerHTML = `
        <div class="rotate-prompt">
            <div class="rotate-icon">📱↻</div>
            <h2>화면을 가로로 돌려주세요</h2>
            <p>Please rotate your device to landscape mode</p>
            <p class="subtext">Desmos 계산기가 화면 오른쪽에 표시됩니다</p>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.id = 'landscape-styles';
    style.textContent = `
        #landscape-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        
        #landscape-overlay.show {
            display: flex;
        }
        
        .rotate-prompt {
            text-align: center;
            color: white;
            padding: 2rem;
        }
        
        .rotate-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: rotate-hint 2s ease-in-out infinite;
        }
        
        @keyframes rotate-hint {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg); }
            75% { transform: rotate(15deg); }
        }
        
        .rotate-prompt h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .rotate-prompt p {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 0.5rem;
        }
        
        .rotate-prompt .subtext {
            font-size: 0.85rem;
            opacity: 0.7;
        }
        
        /* Hide overlay in landscape mode */
        @media (orientation: landscape) {
            #landscape-overlay {
                display: none !important;
            }
        }
        
        /* Show overlay only in portrait mode on mobile */
        @media (orientation: portrait) and (max-width: 1024px) {
            #landscape-overlay {
                display: flex !important;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Check orientation on load and resize
    function checkOrientation() {
        const isPortrait = window.matchMedia('(orientation: portrait)').matches;
        const isMobileWidth = window.innerWidth <= 1024;

        if (isPortrait && isMobileWidth) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    // Try to lock orientation if API is supported
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
            // Lock not supported or denied, rely on overlay
            console.log('Orientation lock not supported, using overlay');
        });
    }

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Initial check
    checkOrientation();
})();
