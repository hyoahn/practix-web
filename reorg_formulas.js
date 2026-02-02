const fs = require('fs');
const path = '_Sever/formulas/index.html';

const content = fs.readFileSync(path, 'utf8');

// 1. JS Formulas
const jsMatch = content.match(/const formulas = \[\s*([\s\S]*?)\s*\];/);
if (!jsMatch) { console.error("No JS found"); process.exit(1); }

const jsBody = jsMatch[1];
const objMatches = jsBody.match(/\{([\s\S]*?)\}/g);

let formulas = [];
objMatches.forEach(s => {
    const getId = (name) => {
        let m = s.match(new RegExp(name + ':\\s*"(.*?)"'));
        if (m) return m[1];
        m = s.match(new RegExp(name + ':\\s*(\\d+)'));
        if (m) return m[1];
        return "";
    };
    const id = parseInt(getId('id'));
    if (id) {
        formulas.push({
            id: id,
            name: getId('name'),
            math: getId('math'),
            gift: getId('gift'),
            originalStr: s
        });
    }
});

// 2. Articles
const articleRegex = /<article\s+class="formula-card"\s+id="f(\d+)"[^>]*>([\s\S]*?)<\/article>/g;
let articles = {};
let m;
while ((m = articleRegex.exec(content)) !== null) {
    articles[parseInt(m[1])] = m[2];
}

console.log(`Found ${formulas.length} formulas, ${Object.keys(articles).length} articles.`);

// 3. Score
function getScore(f) {
    // Force 31-35 (Hacks) to top as per user request ("original position" + "save time")
    if (f.id >= 31 && f.id <= 35) return 300;

    const g = f.gift || "";
    const m = g.match(/Save\s+(\d+)s/i);
    if (m) return 200 + parseInt(m[1]);

    if (g.includes('Instant')) return 180;
    if (g.includes('Fast')) return 170;
    if (g.includes('Speed')) return 160;
    if (g.includes('No ') || g.includes('Hack')) return 150;
    if (g.includes('Time')) return 140;

    return 0;
}

formulas.sort((a, b) => {
    const sA = getScore(a);
    const sB = getScore(b);
    if (sA !== sB) return sB - sA;
    return a.id - b.id;
});

// 4. Reconstruct
let newJsLines = [];
let newArticleBlocks = [];

formulas.forEach((f, index) => {
    const newId = index + 1;
    // JS
    const newObj = `            { id: ${newId}, name: "${f.name}", math: "${f.math}", gift: "${f.gift}", link: "#f${newId}" }`;
    newJsLines.push(newObj);

    // Article
    let inner = articles[f.id];
    if (inner) {
        // Replace "<h3>31. " -> "<h3>1. "
        inner = inner.replace(/<h3>\d+\.\s*/, `<h3>${newId}. `);
        newArticleBlocks.push(`
        <!-- ${newId} -->
        <article class="formula-card" id="f${newId}">${inner}</article>`);
    } else {
        newArticleBlocks.push(`
        <!-- ${newId} -->
        <article class="formula-card" id="f${newId}">
            <span class="category-badge cat-alg">Formula</span>
            <h3>${newId}. ${f.name}</h3>
            <div class="formula-display">\\[ ${f.math} \\]</div>
            <p class="formula-explanation">${f.gift}</p>
        </article>`);
    }
});

// 5. Replace in file
const allArticleMatches = [];
let am;
const finder = /<!--\s*(\d+)\s*-->\s*<article\s+class="formula-card"\s+id="f\1"[^>]*>[\s\S]*?<\/article>/g;
while ((am = finder.exec(content)) !== null) {
    allArticleMatches.push({ start: am.index, end: am.index + am[0].length });
}

if (allArticleMatches.length === 0) {
    // Fallback: try finding articles without matching comments
    const looseFinder = /<article\s+class="formula-card"\s+id="f(\d+)"[^>]*>[\s\S]*?<\/article>/g;
    while ((am = looseFinder.exec(content)) !== null) {
        allArticleMatches.push({ start: am.index, end: am.index + am[0].length });
    }
}

if (allArticleMatches.length > 0) {
    const startIdx = allArticleMatches[0].start;
    const endIdx = allArticleMatches[allArticleMatches.length - 1].end;

    const head = content.substring(0, startIdx);
    const tail = content.substring(endIdx);
    const body = newArticleBlocks.join("\n");

    let newContent = head + body + tail;

    const tailNew = tail.replace(/const formulas = \[\s*([\s\S]*?)\s*\];/,
        `const formulas = [\n${newJsLines.join(",\n")}\n        ];`);

    newContent = head + body + tailNew;

    fs.writeFileSync(path, newContent);
    console.log("Sort complete");
} else {
    console.error("Could not find article blocks to replace");
    process.exit(1);
}
