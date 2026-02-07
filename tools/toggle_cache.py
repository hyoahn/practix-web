import os
import sys

# Configuration
DISABLE_CACHE_BLOCK = """
    <!-- Disable Browser Caching for Development -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
"""

def scan_and_toggle(root_dir, enable_dev_mode):
    print(f"Scanning {root_dir}...")
    count = 0
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file == "index.html":
                filepath = os.path.join(subdir, file)
                process_file(filepath, enable_dev_mode)
                count += 1
                
    status = "DISABLED" if enable_dev_mode else "ENABLED"
    print(f"\nSuccess! Browser Caching is now [{status}] for {count} files.")

def process_file(filepath, enable_dev_mode):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    has_block = "<!-- Disable Browser Caching for Development -->" in content
    
    new_content = content
    if enable_dev_mode:
        if not has_block:
            # Inject after <head> or <meta charset>
            if "<head>" in content:
                # Try to put it after viewport or charset for neatness
                target = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
                if target in content:
                    new_content = content.replace(target, target + "\n" + DISABLE_CACHE_BLOCK)
                else:
                    new_content = content.replace("<head>", "<head>\n" + DISABLE_CACHE_BLOCK)
            print(f"[UPDATED] {filepath} -> Cache Disabled")
        else:
            print(f"[SKIPPED] {filepath} -> Already Disabled")
            
    else: # Disable Dev Mode (Enable Caching)
        if has_block:
            # Remove the block. We need to be careful with exact string matching.
            # We will use a regex or simple string replacement if the block is exact.
            # Since we wrote it, we can try to replace the exact block.
            # If line endings differ, we might need a more robust approach.
            
            # Simple approach: Identify the start and end of our known block
            start_marker = "<!-- Disable Browser Caching for Development -->"
            end_marker = '<meta http-equiv="Expires" content="0">'
            
            s_idx = new_content.find(start_marker)
            if s_idx != -1:
                e_idx = new_content.find(end_marker, s_idx)
                if e_idx != -1:
                    # Include the end marker length
                    e_idx += len(end_marker)
                    # Remove content from s_idx to e_idx
                    # Also look for trailing newlines created by us
                    chunk = new_content[s_idx:e_idx]
                    new_content = new_content.replace(chunk, "").strip()
                    
                    # Clean up potential double newlines
                    # This is a bit rough, but safe enough for dev tools.
                    # Better: Read file as lines and filter.
                    
            # Let's try the cleaner read-lines approach for removal to be safe
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
            
            new_content = "\n".join(new_lines)
            print(f"[RESTORED] {filepath} -> Cache Enabled")

        else:
            print(f"[SKIPPED] {filepath} -> Cache Already Enabled")

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    print("Practix Cache Control Tool")
    print("--------------------------")
    
    if len(sys.argv) < 2:
        print("Usage: python3 toggle_cache.py [on|off]")
        print("  on  = Turn Dev Mode ON (Disable Caching)")
        print("  off = Turn Dev Mode OFF (Enable Caching)")
        sys.exit(1)
        
    mode = sys.argv[1].lower()
    if mode == "on":
        scan_and_toggle(base_dir, True)
    elif mode == "off":
        scan_and_toggle(base_dir, False)
    else:
        print("Invalid argument. Use 'on' or 'off'.")
