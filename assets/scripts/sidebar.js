/**
 * Practix Sidebar Loader (Separation Strategy)
 * Dispatches to sidebar-mobile.js (Frozen/Safe) or sidebar-desktop.js (Active Dev)
 */
(function () {
    // 1. Calculate Base Path (Shared Logic)
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(s => s.length > 0);
    const rootIndex = pathSegments.indexOf('_Sever');
    let depth = 0;
    if (rootIndex !== -1) {
        const segmentsAfterRoot = pathSegments.slice(rootIndex + 1);
        const hasFile = segmentsAfterRoot.length > 0 && segmentsAfterRoot[segmentsAfterRoot.length - 1].includes('.');
        depth = hasFile ? segmentsAfterRoot.length - 1 : segmentsAfterRoot.length;
    } else {
        const hasFile = pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.');
        depth = hasFile ? pathSegments.length - 1 : pathSegments.length;
    }
    const basePath = depth === 0 ? '' : '../'.repeat(depth);

    // 2. Detect Device Type (Matching original logic)
    const isMobile = window.innerWidth <= 1024 || window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(pointer: coarse)').matches;

    // 3. Load Appropriate Script
    const script = document.createElement('script');
    const version = new Date().getTime();
    script.src = basePath + (isMobile ? 'assets/scripts/sidebar-mobile.js' : 'assets/scripts/sidebar-desktop.js') + '?v=' + version;
    script.async = false; // Execute in order if possible (though sidebar is usually standalone)
    document.head.appendChild(script);

    console.log('[Sidebar Loader] Loaded:', isMobile ? 'Mobile (Safe)' : 'Desktop (Dev)');
})();
