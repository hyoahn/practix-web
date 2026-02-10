import os
import re

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

def update_css_links():
    count = 0
    updated_files = 0
    
    # Walk through all directories
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                
                # Calculate relative path to assets based on depth
                # _Sever/index.html -> assets/styles/styles.v4.css
                # _Sever/hard-questions/algebra/index.html -> ../../assets/styles/styles.v4.css
                
                rel_path_from_root = os.path.relpath(root, ROOT_DIR)
                if rel_path_from_root == ".":
                    depth = 0
                else:
                    depth = len(rel_path_from_root.split(os.sep))
                
                prefix = "../" * depth if depth > 0 else ""
                new_href = f"{prefix}assets/styles/styles.v4.css"
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Regex to find existing style links:
                # <link rel="stylesheet" href="...styles.css...">
                # We need to be careful not to match other headers like fonts
                
                # Pattern: Find any <link> tag that contains "styles.css" inside href attribute
                # We'll use a simpler approach: read file, find lines with styles.css, replace them.
                
                new_lines = []
                file_changed = False
                
                for line in content.splitlines():
                    if '<link' in line and 'styles.css' in line and 'rel="stylesheet"' in line:
                         # Construct the new line preserving indentation if possible
                         # But standardizing the tag
                         indent = line[:line.find('<')]
                         new_line = f'{indent}<link rel="stylesheet" href="{new_href}">'
                         new_lines.append(new_line)
                         file_changed = True
                         print(f"  ✅ Updating line in {file}: {line.strip()} -> {new_line.strip()}")
                    else:
                        new_lines.append(line)
                
                if file_changed:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write('\n'.join(new_lines))
                    updated_files += 1
                
                count += 1

    print(f"Scanned {count} files. Updated {updated_files} files.")

if __name__ == "__main__":
    update_css_links()
