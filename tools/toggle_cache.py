import os
import sys
import re
import time

# Configuration
DISABLE_CACHE_BLOCK = """    <!-- Disable Browser Caching for Development -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">"""

def scan_and_toggle(root_dir, enable_dev_mode):
    print(f"Scanning {root_dir}...")
    count = 0
    
    # Current timestamp for versioning
    timestamp = int(time.time())
    version_string = f"?v={timestamp}" if enable_dev_mode else ""
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(subdir, file)
                process_file(filepath, enable_dev_mode, version_string)
                count += 1
                
    status = "DISABLED (Dev Mode)" if enable_dev_mode else "ENABLED (Prod Mode)"
    print(f"\nSuccess! Browser Caching is now [{status}] for {count} files.")

def process_file(filepath, enable_dev_mode, version_string):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # 1. Handle Meta Tags for Caching
    has_block = "<!-- Disable Browser Caching for Development -->" in content
    
    if enable_dev_mode and not has_block:
        # Inject meta tags
        if "<head>" in content:
            target = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
            if target in content:
                content = content.replace(target, target + "\n" + DISABLE_CACHE_BLOCK)
            else:
                content = content.replace("<head>", "<head>\n" + DISABLE_CACHE_BLOCK)
            print(f"[META ADDED] {filepath}")
            
    elif not enable_dev_mode and has_block:
        # Remove meta tags
        lines = content.splitlines()
        new_lines = []
        skip = False
        for line in lines:
            if "<!-- Disable Browser Caching for Development -->" in line:
                skip = True
            
            if skip:
                if '<meta http-equiv="Expires" content="0">' in line:
                    skip = False
                continue
            new_lines.append(line)
        content = "\n".join(new_lines)
        print(f"[META REMOVED] {filepath}")

    # 2. Update Version Query Strings for CSS and JS
    # Regex to find .css?v=... or .js?v=... and update it
    # Pattern: (href|src)=["']([^"']+\.(css|js))(\?v=[^"']*)?["']
    
    def replace_version(match):
        prefix = match.group(1) # href or src
        path = match.group(2)   # file path (assets/styles.css)
        # ext = match.group(3)    # css or js
        # old_ver = match.group(4) # existing ?v=...
        
        # Don't touch external links (http/https)
        if "http" in path or "//" in path:
            return match.group(0)
            
        if enable_dev_mode:
            return f'{prefix}="{path}{version_string}"'
        else:
            # Remove version querying string for production (or set to standard)
            # For now, let's just strip it to let browser cache naturally, 
            # OR we could set a production version. Let's strip for "off" mode to be clean.
            return f'{prefix}="{path}"'

    # Apply regex replacement
    # We look for src="..." or href="..." ending in .js or .css, optionally with ?v=...
    content = re.sub(r'(src|href)=["\']([^"\']+\.(js|css))(\?v=[^"\']*)?["\']', replace_version, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[UPDATED] {filepath}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    print("Practix Cache Control Tool")
    print("--------------------------")
    
    if len(sys.argv) < 2:
        print("Usage: python3 toggle_cache.py [on|off]")
        print("  on  = Dev Mode (Disable Cache & Timestamp Assets)")
        print("  off = Prod Mode (Enable Cache & Strip Timestamps)")
        sys.exit(1)
        
    mode = sys.argv[1].lower()
    if mode == "on":
        scan_and_toggle(base_dir, True)
    elif mode == "off":
        scan_and_toggle(base_dir, False)
    else:
        print("Invalid argument. Use 'on' or 'off'.")
