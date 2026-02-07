import os
import sys
import re

# The strict security block we want to toggle
SECURITY_META = '<meta http-equiv="Cache-Control" content="no-store">'
# Anchor comment to help us find where to insert
ANCHOR_COMMENT = "<!-- Disable Browser Caching for Development -->"

def toggle_security(root_dir, enable_security):
    print(f"Scanning {root_dir}...")
    print(f"Target Mode: {'SECURITY ON (Block Captures)' if enable_security else 'SECURITY OFF (Allow Captures)'}")
    
    count = 0
    modified = 0
    
    # Regex to find ANY Cache-Control meta tag (to remove or update)
    # We want to be aggressive in cleaning up old versions
    pattern_remove = re.compile(r'<meta\s+http-equiv=["\']Cache-Control["\'].*?>', re.IGNORECASE)
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(subdir, file)
                if process_file(filepath, enable_security, pattern_remove):
                    modified += 1
                count += 1
                
    print(f"\nScanned {count} HTML files.")
    print(f"Modified {modified} files.")

def process_file(filepath, enable_security, pattern_remove):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"[ERROR] Could not read {filepath}: {e}")
        return False
        
    original_content = content
    new_content = content
    
    # Step 1: Always remove existing Cache-Control headers to start fresh
    # This prevents duplicates and ensures we control the state
    new_content = pattern_remove.sub('', new_content)
    
    # Also remove Pragma/Expires if they exist (cleanup)
    new_content = re.sub(r'<meta\s+http-equiv=["\']Pragma["\'].*?>', '', new_content, flags=re.IGNORECASE)
    new_content = re.sub(r'<meta\s+http-equiv=["\']Expires["\'].*?>', '', new_content, flags=re.IGNORECASE)

    # Clean up empty lines left by removal (optional, but nice)
    # collapsing multiple newlines
    # new_content = re.sub(r'\n\s*\n', '\n', new_content)

    if enable_security:
        # Step 2: Add Security Header
        # Try to find the anchor comment
        if ANCHOR_COMMENT in new_content:
            new_content = new_content.replace(ANCHOR_COMMENT, ANCHOR_COMMENT + '\n    ' + SECURITY_META)
        elif '<head>' in new_content:
            new_content = new_content.replace('<head>', '<head>\n    ' + ANCHOR_COMMENT + '\n    ' + SECURITY_META)
        else:
            # Fallback
            new_content = SECURITY_META + '\n' + new_content
            
    else:
        # Step 2: Ensure Security Header is GONE (already removed by Step 1)
        # We might want to keep the Anchor Comment for future toggling?
        # Yes, ANCHOR_COMMENT is untouched by pattern_remove unless we target it.
        # But if it's missing, we might want to add it back for consistency?
        # No, keep it simple.
        pass

    if new_content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            # print(f"[UPDATED] {filepath}")
            return True
        except Exception as e:
            print(f"[ERROR] Could not write {filepath}: {e}")
            return False
            
    return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 toggle_security.py [on|off]")
        print("  on  = ENABLE Security (Block Captures)")
        print("  off = DISABLE Security (Allow Captures)")
        sys.exit(1)
        
    mode = sys.argv[1].lower()
    base_dir = os.getcwd() # Run from current directory
    
    # Adjust base_dir if running from tools/ subdirectory
    if os.path.basename(base_dir) == "tools":
        base_dir = os.path.dirname(base_dir)
        
    if mode == "on":
        toggle_security(base_dir, True)
    elif mode == "off":
        toggle_security(base_dir, False)
    else:
        print("Invalid argument. Use 'on' or 'off'.")
