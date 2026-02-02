import os

# SEO Injection Script
# Adds GR9 mandatory keywords to all Desmos pages

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DESMOS_DIR = os.path.join(ROOT_DIR, "desmos")

META_TAG = '    <meta name="description" content="Master the Desmos SAT Calculator for the SAT Math hardest questions. Learn essential SAT math formulas and hacks.">\n'

def update_seo():
    print("Updating SEO tags...")
    count = 0
    for root, dirs, files in os.walk(DESMOS_DIR):
        for file in files:
            if file.endswith("index.html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                
                # Check if meta description already exists
                if any("meta name=\"description\"" in line for line in lines):
                    continue
                
                # Find insertion point (after title)
                new_lines = []
                inserted = False
                for line in lines:
                    new_lines.append(line)
                    if "</title>" in line and not inserted:
                        new_lines.append(META_TAG)
                        inserted = True
                
                if inserted:
                    with open(path, "w", encoding="utf-8") as f:
                        f.writelines(new_lines)
                    count += 1
                    print(f"Updated {path}")
                    
    print(f"SEO Injection Complete. Updated {count} files.")

if __name__ == "__main__":
    update_seo()
