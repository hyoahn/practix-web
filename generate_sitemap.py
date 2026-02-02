import os
import datetime

# Basic sitemap generator for Practix
# Scans _Sever directory and generates sitemap.xml

BASE_URL = "https://practix.org"
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_sitemap():
    print("Generating sitemap.xml...")
    urls = []
    
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith("index.html"):
                # specific exclusion logic can go here
                path = os.path.relpath(os.path.join(root, file), ROOT_DIR)
                if path == "index.html":
                   url_path = ""
                else:
                   url_path = path.replace("/index.html", "/")
                
                urls.append(f"{BASE_URL}/{url_path}")

    with open(os.path.join(ROOT_DIR, "sitemap.xml"), "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for url in urls:
            f.write('  <url>\n')
            f.write(f'    <loc>{url}</loc>\n')
            f.write(f'    <lastmod>{datetime.date.today().isoformat()}</lastmod>\n')
            f.write('    <changefreq>daily</changefreq>\n')
            f.write('  </url>\n')
        f.write('</urlset>\n')
    print("sitemap.xml generated.")

if __name__ == "__main__":
    generate_sitemap()
