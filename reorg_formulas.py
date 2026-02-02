import re
import sys

FILE = '_Sever/formulas/index.html'

def parse_gift_score(gift):
    if not gift: return 0
    m = re.search(r'Save\s+(\d+)s', gift, re.IGNORECASE)
    if m: return 100 + int(m.group(1))
    if 'Instant' in gift: return 80
    if 'Fast' in gift: return 70
    if 'Speed' in gift: return 60
    if 'No ' in gift: return 50
    if 'Time' in gift: return 40
    if 'Hack' in gift: return 30
    if 'Factor' in gift or 'Visual' in gift or 'Mental' in gift: return 20 
    return 0

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Parse Formulas JS
js_regex = r'const formulas = \[\s*([\s\S]*?)\s*\];'
js_match = re.search(js_regex, content)
if not js_match:
    print("Error: JS formulas not found")
    sys.exit(1)

js_content = js_match.group(1)
obj_strs = re.findall(r'\{([\s\S]*?)\}', js_content)
formulas_data = []

for s in obj_strs:
    def get_field(name):
        m = re.search(fr'{name}:\s*"(.*?)"', s)
        if m: return m.group(1)
        m = re.search(fr'{name}:\s*(\d+)', s)
        if m: return m.group(1)
        return ""

    fid = get_field('id')
    name = get_field('name')
    math = get_field('math')
    gift = get_field('gift')
    
    if fid:
        formulas_data.append({
            'id': int(fid),
            'name': name,
            'math': math,
            'gift': gift
        })

# 2. Extract Articles
articles = {}
article_regex = r'<article\s+class="formula-card"\s+id="f(\d+)"[^>]*>([\s\S]*?)</article>'
matches = list(re.finditer(article_regex, content))

for m in matches:
    fid = int(m.group(1))
    articles[fid] = m.group(2)

print(f"Found {len(formulas_data)} formulas in JS, {len(articles)} articles.")

# 3. Sort
formulas_data.sort(key=lambda x: (-parse_gift_score(x['gift']), x['id']))

# 4. Reconstruct
new_js_lines = []
new_articles_html = []

for i, f in enumerate(formulas_data):
    new_id = i + 1
    old_id = f['id']
    
    # New JS Object
    obj_str = f'            {{ id: {new_id}, name: "{f["name"]}", math: "{f["math"]}", gift: "{f["gift"]}", link: "#f{new_id}" }}'
    new_js_lines.append(obj_str)
    
    # New Article
    if old_id in articles:
        inner = articles[old_id]
        # Regex to replace "<h3>31. " with "<h3>1. "
        inner = re.sub(r'(<h3>)\d+\.\s*', f'\\1{new_id}. ', inner, count=1)
        
        block = f'\n        <!-- {new_id} -->\n        <article class="formula-card" id="f{new_id}">{inner}</article>'
        new_articles_html.append(block)
    else:
        # Fallback for missing article matching
        block = f'\n        <!-- {new_id} -->\n        <article class="formula-card" id="f{new_id}">\n            <span class="category-badge cat-alg">Formula</span>\n            <h3>{new_id}. {f["name"]}</h3>\n            <div class="formula-display">\[ {f["math"]} \]</div>\n            <p class="formula-explanation">{f["gift"]}</p>\n        </article>'
        new_articles_html.append(block)

# 5. Replace in File
# Articles Zone: From end of scan-table-container to start of "Request a Shortcut"
scan_end_match = re.search(r'class="scan-table-container">.*?</section>', content, re.DOTALL)
cta_start_match = re.search(r'<!-- Request a Shortcut CTA -->', content)

if not scan_end_match or not cta_start_match:
    print("Error: Could not locate article zone boundaries")
    sys.exit(1)

split_head = content[:scan_end_match.end()]
split_tail = content[cta_start_match.start():]

new_content = split_head + "\n" + "\n".join(new_articles_html) + "\n\n    " + split_tail

# JS Zone
# Important: replace the ORIGINAL js string block we found earlier
# But we must be careful if new_content changed the offset of JS block?
# Ah, the JS block is inside 'split_tail' (footer).
# So we can just replace inside new_content using string replacement of the specific block.
new_js_block = "const formulas = [\n" + ",\n".join(new_js_lines) + "\n        ];"
new_content = new_content.replace(js_match.group(0), new_js_block)

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Success")
