import os

# 1. The CSS to Inject (Mobile Layout Fixes)
INLINE_CSS = """
<style>
/* NUCLEAR MOBILE FIXES - INJECTED INLINE */
@media (max-width: 1024px) {
    /* 1. FORCE HIDE TOP NAV */
    nav { display: none !important; }
    
    /* 2. FIX HOMEPAGE LAYOUT MASH */
    .hero-split-fullscreen {
        display: flex !important;
        flex-direction: column !important;
        height: auto !important;
        min-height: auto !important;
        padding-top: 2rem !important;
        gap: 3rem !important;
    }
    .hero-text-container {
        width: 100% !important;
        padding: 2rem 5% !important;
        order: 1 !important;
        text-align: left !important;
        display: block !important;
    }
    .hero-image-container {
        width: 100% !important;
        height: 350px !important;
        order: 2 !important;
        position: relative !important;
        display: block !important;
    }
    .hero-split-fullscreen h1 {
        font-size: 2.5rem !important;
        line-height: 1.1 !important;
    }
    
    /* 3. FIX MENU Z-INDEX */
    .nav-links {
        z-index: 9999 !important;
    }
}
</style>
"""

# 2. The JS to Inject (Nav Removal + Menu Close)
INLINE_JS = """
<script>
// NUCLEAR JS FIXES - INJECTED INLINE
(function() {
    // 1. ELIMINATE TOP NAV ON MOBILE
    function nukeNav() {
        if (window.innerWidth <= 1024) {
            const nav = document.querySelector('nav:not(.breadcrumb)');
            if (nav) nav.remove();
        }
    }
    // Run immediately
    nukeNav();
    // Run on resize
    window.addEventListener('resize', nukeNav);
    // Observe for re-injection
    new MutationObserver(nukeNav).observe(document.body, {childList: true, subtree: true});

    // 2. FIX MENU CLOSING
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('nav-menu');
        const toggle = document.getElementById('nav-toggle');
        
        // If clicking inside menu on a link (or child of link)
        if (menu && menu.classList.contains('active')) {
            if (e.target.closest('a') || !menu.contains(e.target)) {
                 // But don't close if clicking the toggle itself
                 if (toggle && toggle.contains(e.target)) return;
                 
                 menu.classList.remove('active');
                 document.body.style.overflow = '';
            }
        }
    }, true); // Capture phase to beat other listeners
})();
</script>
"""

TARGET_FILES = [
    "_Sever/index.html",
    "_Sever/desmos/index.html",
    "_Sever/formulas/index.html",
    "_Sever/hard-questions/index.html"
]

def apply_fixes():
    print("Applying NUCLEAR fixes...")
    
    # Get base dir (assuming script is in _Sever/tools)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    root_dir = os.path.dirname(base_dir) # Go up to Practix folder to be safe, or just use base_dir if _Sever is root
    
    # Actually base_dir is _Sever
    
    for relative_path in TARGET_FILES:
        # Fix path mapping
        if relative_path.startswith("_Sever/"):
            file_path = os.path.join(base_dir, relative_path.replace("_Sever/", ""))
        else:
            file_path = os.path.join(base_dir, relative_path)
            
        print(f"Processing: {file_path}")
        
        if not os.path.exists(file_path):
            print(f"  ❌ File not found: {file_path}")
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # Inject CSS before </head>
        if "/* NUCLEAR MOBILE FIXES" not in content:
            if "</head>" in content:
                new_content = new_content.replace("</head>", INLINE_CSS + "\n</head>")
                print("  ✅ Injected Inline CSS")
        else:
            print("  ⚠️ CSS already present")
            
        # Inject JS after <body>
        if "// NUCLEAR JS FIXES" not in content:
             if "<body" in content:
                 # Find the end of the opening body tag
                 import re
                 body_match = re.search(r'<body[^>]*>', content)
                 if body_match:
                     body_tag = body_match.group(0)
                     new_content = new_content.replace(body_tag, body_tag + "\n" + INLINE_JS)
                     print("  ✅ Injected Inline JS")
        else:
             print("  ⚠️ JS already present")
             
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("  💾 Saved.")
        else:
            print("  ⏩ No changes needed.")

if __name__ == "__main__":
    apply_fixes()
