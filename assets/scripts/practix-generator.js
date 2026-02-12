/**
 * Practix Global Formula Engine
 * Handles dynamic problem generation, interactive checking, 
 * and comparative solution rendering (School vs Practix).
 */

class PractixGenerator {
    constructor() {
        this.currentAnswers = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupListeners();
            this.initialGenerate();
        });
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            // Randomize Buttons
            if (e.target.classList.contains('randomize-btn')) {
                const type = e.target.dataset.type;
                this.generate(type);
            }
            // Check Answer Buttons
            if (e.target.classList.contains('check-answer-btn')) {
                const type = e.target.dataset.type;
                this.checkAnswer(type);
            }
        });
    }

    initialGenerate() {
        // Automatically generate for all elements with data-eqn-type on page load
        const types = new Set();
        document.querySelectorAll('[data-eqn-type]').forEach(el => {
            if (el.dataset.eqnType) types.add(el.dataset.eqnType);
        });

        // Generate content for all types WITHOUT triggering individual MathJax behaviors
        types.forEach(type => this.generate(type, false));

        // Single MathJax pass at the end
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }

    generate(type, triggerMathJax = true) {
        let data = {};

        // --- QUADRATIC/PARABOLA MODULE ---
        if (['product', 'sum', 'discriminant', 'vertex-shortcut', 'vertex-line'].includes(type)) {
            data = this.genQuadraticCoeffs(type);
            this.updateQuadraticUI(type, data);
        }

        // --- LINEAR MODULE ---
        if (['standard-slope', 'intercept-hack', 'slope-formula', 'constant-trick', 'linear-base', 'midpoint', 'distance', 'parallel-slope', 'perp-slope', 'horiz-slope', 'vert-slope', 'point-slope', 'standard-ints', 'x-int-hack'].includes(type)) {
            data = this.genLinearCoeffs(type);
            this.updateLinearUI(type, data);
        }

        // Reset feedback
        const feedback = document.querySelector(`#${type}-feedback`);
        if (feedback) { feedback.innerHTML = ''; }

        // Re-render MathJax
        if (triggerMathJax && window.MathJax) {
            MathJax.typesetPromise();
        }
    }

    // --- COEFF GENERATORS ---
    genQuadraticCoeffs(type) {
        let a = Math.floor(Math.random() * 5) + 1;
        let b = Math.floor(Math.random() * 21) - 10;
        let c = Math.floor(Math.random() * 31) - 15;
        if (type === 'product' && c === 0) c = 12;
        if (type === 'sum' && b === 0) b = 8;
        if (type === 'discriminant' && Math.random() < 0.2) {
            let k = Math.floor(Math.random() * 5) + 1;
            a = 1; b = 2 * k; c = k * k;
        }
        return { a, b, c };
    }

    genLinearCoeffs(type) {
        if (type === 'linear-base') {
            const m = (Math.floor(Math.random() * 40) + 1) * (Math.random() > 0.5 ? 1 : -1);
            const b = Math.floor(Math.random() * 100) - 50;
            return { m, b };
        }
        if (type === 'slope-formula') {
            const x1 = Math.floor(Math.random() * 10) - 5;
            const y1 = Math.floor(Math.random() * 10) - 5;
            let x2 = Math.floor(Math.random() * 10) - 5;
            let y2 = Math.floor(Math.random() * 10) - 5;
            if (x1 === x2) x2 += 3;
            return { x1, y1, x2, y2 };
        }
        if (type === 'constant-trick') {
            const ks = [0.5, 2, 3, 4, 1.5, 2.5, 10];
            const k = ks[Math.floor(Math.random() * ks.length)];
            const x1 = (Math.floor(Math.random() * 5) + 1) * 2;
            const y1 = x1 * k;
            const x2 = (Math.floor(Math.random() * 10) + 1) * 2;
            const y2 = x2 * k;
            return { x1, y1, x2, y2, k };
        }
        if (type === 'distance') {
            // Generate clean pythagorean triples for distance
            const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]];
            const t = triples[Math.floor(Math.random() * triples.length)];
            const x1 = Math.floor(Math.random() * 10) - 5;
            const y1 = Math.floor(Math.random() * 10) - 5;
            // Randomly flip signs/directions
            const dx = Math.random() > 0.5 ? t[0] : -t[0];
            const dy = Math.random() > 0.5 ? t[1] : -t[1];
            return { x1, y1, x2: x1 + dx, y2: y1 + dy, d: t[2] };
        }
        if (type === 'midpoint') {
            // Ensure even differences for integer midpoints
            let x1 = Math.floor(Math.random() * 10) - 5;
            let y1 = Math.floor(Math.random() * 10) - 5;
            let dx = (Math.floor(Math.random() * 5) + 1) * 2;
            let dy = (Math.floor(Math.random() * 5) + 1) * 2;
            return { x1, y1, x2: x1 + dx, y2: y1 + dy };
        }
        if (['parallel-slope', 'perp-slope'].includes(type)) {
            let n = Math.floor(Math.random() * 5) + 1;
            let d = Math.floor(Math.random() * 5) + 1;
            if (d === n) d++;
            return { n, d, sign: Math.random() > 0.5 ? 1 : -1 };
        }
        if (type === 'horiz-slope' || type === 'vert-slope') {
            return { val: Math.floor(Math.random() * 20) - 10 };
        }
        if (type === 'point-slope') {
            const x1 = Math.floor(Math.random() * 20) - 10;
            const y1 = Math.floor(Math.random() * 20) - 10;
            const m = Math.floor(Math.random() * 12) + 2;
            return { x1, y1, m };
        }
        // Generate nice integer intercepts for standard forms
        if (type === 'standard-ints' || type === 'x-int-hack') {
            let A = Math.floor(Math.random() * 5) + 1;
            let B = Math.floor(Math.random() * 5) + 1;
            // Ensure C is divisible by both
            let C = A * B * (Math.floor(Math.random() * 3) + 1);
            return { a: A, b: B, c: C };
        }

        let a = Math.floor(Math.random() * 10) + 1;
        let b = Math.floor(Math.random() * 10) + 1;
        if (Math.random() > 0.5) b = -b;
        let c = Math.floor(Math.random() * 50) - 25;
        return { a, b, c };
    }

    // --- UI UPDATERS ---
    updateQuadraticUI(type, { a, b, c }) {
        const eqnEls = document.querySelectorAll(`[data-eqn-type="${type}"]`);
        eqnEls.forEach(el => {
            let termA = a === 1 ? 'x^2' : (a === -1 ? '-x^2' : `${a}x^2`);
            let absB = Math.abs(b);
            let termB = b === 0 ? '' : (absB === 1 ? (b > 0 ? ' + x' : ' - x') : (b > 0 ? ` + ${b}x` : ` - ${absB}x`));
            let termC = c === 0 ? '' : (c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`);
            el.innerHTML = `\\( ${termA}${termB}${termC} = 0 \\)`;
        });

        const d = b * b - 4 * a * c;
        const schoolBox = document.querySelector(`#${type}-school-steps`);
        const practixBox = document.querySelector(`#${type}-practix-steps`);

        if (type === 'product') {
            this.currentAnswers[type] = this.simplifyFraction(c, a);
            if (practixBox) practixBox.innerHTML = `**Step 1:** Identify coefficients.<br>\\( a=${a}, c=${c} \\).<br>**Step 2:** Apply shortcut.<br>Product = \\( c/a = ${c}/${a} \\).<br>**Result: ${this.currentAnswers[type]}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Setup Quadratic Formula:</strong><br>Identify \\( a=${a}, b=${b}, c=${c} \\).<br>\\( x = \\frac{ -(${b}) \\pm \\sqrt{ b^2-4ac } }{ 2a } \\)<br><strong>2. Simplify Root:</strong><br>\\( \\sqrt{ ${d} } \\)<br><strong>3. Result:</strong> \\( ${this.currentAnswers[type]} \\)`;
        }
        else if (type === 'sum') {
            this.currentAnswers[type] = this.simplifyFraction(-b, a);
            if (practixBox) practixBox.innerHTML = `**Step 1:** Identify coefficients.<br>\\( a=${a}, b=${b} \\).<br>**Step 2:** Apply shortcut.<br>Sum = \\( -b/a = ${-b}/${a} \\).<br>**Result: ${this.currentAnswers[type]}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Setup Quadratic Formula:</strong><br>Identify \\( a=${a}, b=${b}, c=${c} \\).<br>\\( x = \\frac{ -b \\pm \\sqrt{ D } }{ 2a } \\)<br><strong>2. Sum Roots:</strong><br>\\( x_1 + x_2 = \\frac{-b+\\sqrt{D}}{2a} + \\frac{-b-\\sqrt{D}}{2a} = \\frac{-2b}{2a} \\)<br><strong>Result: ${this.currentAnswers[type]}</strong>`;
        }
        else if (type === 'discriminant') {
            const outcome = d > 0 ? "2 Real Solutions" : (d === 0 ? "1 Real Solution" : "No Real Solutions");
            this.currentAnswers[type] = d > 0 ? "2" : (d === 0 ? "1" : "0");
            if (practixBox) practixBox.innerHTML = `**Step 1:** Calculate \\( D = b^2 - 4ac \\).<br>\\( D = (${b})^2 - 4(${a})(${c}) = ${d} \\).<br>**Step 2:** Interpret result.<br>\\( D ${d > 0 ? '>' : (d === 0 ? '=' : '<')} 0 \\).<br>**Result: ${outcome}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Use Quadratic Formula:</strong><br>Analyze \\( \\sqrt{b^2 - 4ac} \\).<br><strong>2. Square Root:</strong><br>\\( \\sqrt{${d}} \\) is ${d < 0 ? 'imaginary' : 'real'}.<br><strong>3. Count:</strong><br>Result: <strong>${outcome}</strong>`;
        }
        else if (type === 'vertex-shortcut') {
            this.currentAnswers[type] = this.simplifyFraction(-b, 2 * a);
            if (practixBox) practixBox.innerHTML = `**Step 1:** Identify coefficients.<br>\\( a=${a}, b=${b} \\).<br>**Step 2:** Apply shortcut \\( x = -b/2a \\).<br>\\( x = -(${b}) / (2 \\cdot ${a}) = ${-b}/${2 * a} \\).<br>**Result: ${this.currentAnswers[type]}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Complete the Square:</strong><br>Factor out \\( a \\) and isolate terms.<br><strong>2. Find Symmetry:</strong><br>The vertex is the midpoint of the intercepts.<br><strong>Result: ${this.currentAnswers[type]}</strong>`;
        }
        else if (type === 'vertex-line') {
            // k = c - b^2/4a (Value of y at vertex)
            // x_v = -b/2a. y_v = a(-b/2a)^2 + b(-b/2a) + c
            const num = 4 * a * c - b * b;
            const den = 4 * a;
            this.currentAnswers[type] = this.simplifyFraction(num, den);
            if (practixBox) practixBox.innerHTML = `**Step 1:** Use Formula.<br>\\( k = c - \\frac{b^2}{4a} \\)<br>\\( k = ${c} - \\frac{${b * b}}{${4 * a}} \\).<br>**Result: ${this.currentAnswers[type]}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Find x-vertex:</strong><br>\\( x = -b/2a = ${this.simplifyFraction(-b, 2 * a)} \\)<br><strong>2. Plug in x:</strong><br>Solve for y.<br><strong>Result: ${this.currentAnswers[type]}**`;
        }
    }

    updateLinearUI(type, data) {
        const schoolBox = document.querySelector(`#${type}-school-steps`);
        const practixBox = document.querySelector(`#${type}-practix-steps`);
        const eqnEls = document.querySelectorAll(`[data-eqn-type="${type}"]`);

        if (type === 'standard-slope') {
            const { a, b, c } = data;
            eqnEls.forEach(el => {
                let termA = a === 1 ? 'x' : (a === -1 ? '-x' : `${a}x`);
                let termB = b === 1 ? ' + y' : (b === -1 ? ' - y' : (b > 0 ? ` + ${b}y` : ` - ${Math.abs(b)}y`));
                el.innerHTML = `\\( ${termA}${termB} = ${c} \\)`;
            });
            this.currentAnswers[type] = this.simplifyFraction(-a, b);
            if (practixBox) practixBox.innerHTML = `**Step 1:** Identify coefficients.<br>\\( A=${a}, B=${b} \\).<br>**Step 2:** Apply shortcut.<br>Slope \\( m = -A/B = -(${a})/${b} \\).<br>**Result: ${this.currentAnswers[type]}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Isolate y:</strong><br>\\( ${b}y = -${a}x + ${c} \\).<br><strong>2. Divide by ${b}:</strong><br>\\( y = \\left(\\frac{-${a}}{${b}}\\right)x + \\frac{${c}}{${b}} \\).<br><strong>Result: ${this.currentAnswers[type]}</strong>`;
        }

        if (type === 'slope-formula') {
            const { x1, y1, x2, y2 } = data;
            eqnEls.forEach(el => {
                el.innerHTML = `\\( (${x1}, ${y1}) \\) and \\( (${x2}, ${y2}) \\)`;
            });
            this.currentAnswers[type] = this.simplifyFraction(y2 - y1, x2 - x1);
            if (practixBox) practixBox.innerHTML = `**Step 1:** ΔY = \\( ${y2} - (${y1}) = ${y2 - y1} \\).<br>**Step 2:** ΔX = \\( ${x2} - (${x1}) = ${x2 - x1} \\).<br>**Step 3:** Divide ΔY/ΔX.<br>**Result: ${this.currentAnswers[type]}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Label points:</strong><br>\\( (x_1, y_1) = (${x1}, ${y1}) \\)<br>\\( (x_2, y_2) = (${x2}, ${y2}) \\)<br><strong>2. Apply formula:</strong><br>\\( m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2 - y1}}{${x2 - x1}} \\)<br><strong>Result: ${this.currentAnswers[type]}</strong>`;
        }

        if (type === 'constant-trick') {
            const { x1, y1, x2, y2, k } = data;
            eqnEls.forEach(el => {
                el.innerHTML = `If \\( y=${y1} \\) when \\( x=${x1} \\), what is \\( y \\) when \\( x=${x2} \\)?`;
            });
            this.currentAnswers[type] = String(y2);
            if (practixBox) practixBox.innerHTML = `**Step 1:** Find Ratio \\( k = y/x = ${y1}/${x1} = ${k} \\).<br>**Step 2:** Apply to new X.<br>\\( y = ${x2} \\times ${k} \\).<br>**Result: ${y2}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Constant of Proportionality:</strong><br>\\( y = kx \\implies ${y1} = k(${x1}) \\)<br><strong>2. Solve for k:</strong><br>\\( k = ${y1}/${x1} = ${k} \\)<br><strong>3. Use new equation:</strong><br>\\( y = ${k}x \\implies y = ${k}(${x2}) \\)<br><strong>Result: ${y2}</strong>`;
        }

        if (type === 'linear-base') {
            const { m, b } = data;
            const termM = m === 1 ? 'x' : (m === -1 ? '-x' : (m === 0 ? '' : `${m}x`));
            const termB = b === 0 ? '' : (b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`);
            eqnEls.forEach(el => {
                el.innerHTML = `\\( y = ${termM}${termB} \\)`;
            });
            this.currentAnswers[type] = String(m);
            if (practixBox) practixBox.innerHTML = `**Step 1:** Identify the coefficient of \\( x \\).<br>**Result: ${m}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Standard Form Check:</strong><br>Equation is in \\( y = mx + b \\).<br><strong>2. Extract Slope:</strong><br>The value multiplying \\( x \\) is the slope.<br><strong>Result: ${m}</strong>`;
        }

        if (type === 'midpoint') {
            const { x1, y1, x2, y2 } = data;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            eqnEls.forEach(el => el.innerHTML = `\\( (${x1}, ${y1}) \\) and \\( (${x2}, ${y2}) \\)`);
            this.currentAnswers[type] = `(${mx}, ${my})`; // Strict format
            // Allow sloppy whitespace in checkAnswer later or just strict
            if (practixBox) practixBox.innerHTML = `**Step 1:** Average X's: \\( (${x1}+${x2})/2 = ${mx} \\).<br>**Step 2:** Average Y's: \\( (${y1}+${y2})/2 = ${my} \\).<br>**Result: (${mx}, ${my})**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Sum coordinates:</strong><br>\\( x_1+x_2 = ${x1 + x2} \\), \\( y_1+y_2=${y1 + y2} \\)<br><strong>2. Divide by 2:</strong><br>\\( x=${mx}, y=${my} \\)<br><strong>Result: (${mx}, ${my})</strong>`;
        }

        if (type === 'distance') {
            const { x1, y1, x2, y2, d } = data;
            eqnEls.forEach(el => el.innerHTML = `\\( (${x1}, ${y1}) \\) and \\( (${x2}, ${y2}) \\)`);
            this.currentAnswers[type] = String(d);
            if (practixBox) practixBox.innerHTML = `**Step 1:** Find ΔX, ΔY.<br>\\( ${Math.abs(x2 - x1)}, ${Math.abs(y2 - y1)} \\).<br>**Step 2:** Recognize Triple.<br>It's a \\( ${Math.abs(x2 - x1)}-${Math.abs(y2 - y1)}-${d} \\) triangle.<br>**Result: ${d}**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Formula:</strong><br>\\( \\sqrt{(${x2}-(${x1}))^2 + (${y2}-(${y1}))^2} \\)<br><strong>2. Simplify:</strong><br>\\( \\sqrt{${Math.pow(x2 - x1, 2)} + ${Math.pow(y2 - y1, 2)}} = \\sqrt{${d * d}} \\)<br><strong>Result: ${d}</strong>`;
        }

        if (type === 'parallel-slope' || type === 'perp-slope') {
            const { n, d, sign } = data;
            const m = this.simplifyFraction(sign * n, d);
            eqnEls.forEach(el => el.innerHTML = `a line with slope \\( m = ${m} \\)`);

            if (type === 'parallel-slope') {
                this.currentAnswers[type] = m;
                if (practixBox) practixBox.innerHTML = `**Step 1:** Recall definition.<br>Parallel lines have the **SAME** slope.<br>**Result: ${m}**`;
                if (schoolBox) schoolBox.innerHTML = `<strong>1. Check condition:</strong><br>Lines never touch.<br><strong>2. Match slope:</strong><br>Slope must be identical.<br><strong>Result: ${m}</strong>`;
            } else {
                // Perp logic
                const prepAns = this.simplifyFraction(sign * -d, n); // Flip and negate
                this.currentAnswers[type] = prepAns;
                if (practixBox) practixBox.innerHTML = `**Step 1:** Flip fraction.<br>\\( ${d}/${n} \\).<br>**Step 2:** Flip sign.<br>\\( ${-sign * d}/${n} \\).<br>**Result: ${prepAns}**`;
                if (schoolBox) schoolBox.innerHTML = `<strong>1. Negative Reciprocal:</strong><br>\\( m_2 = -1/m_1 \\)<br><strong>2. Calculate:</strong><br>\\( -1 / (${m}) = ${prepAns} \\)<br><strong>Result: ${prepAns}</strong>`;
            }
        }

        if (type === 'horiz-slope') {
            const { val } = data;
            eqnEls.forEach(el => el.innerHTML = `\\( y = ${val} \\)`);
            this.currentAnswers[type] = "0";
            if (practixBox) practixBox.innerHTML = `**Step 1:** Visualize.<br>It's flat.<br>**Result: 0**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Identify Form:</strong><br>\\( y = 0x + ${val} \\)<br><strong>2. Coefficient of x:</strong><br>It is 0.<br><strong>Result: 0</strong>`;
        }

        if (type === 'vert-slope') {
            const { val } = data;
            eqnEls.forEach(el => el.innerHTML = `\\( x = ${val} \\)`);
            this.currentAnswers[type] = "undefined";
            if (practixBox) practixBox.innerHTML = `**Step 1:** Visualize.<br>Straight up.\\( \\Delta x = 0 \\).<br>**Result: undefined**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Formula:</strong><br>\\( \\frac{\\Delta y}{\\Delta x} \\)<br><strong>2. Divide by Zero:</strong><br>Impossible.<br><strong>Result: undefined</strong>`;
        }

        if (type === 'point-slope') {
            const { x1, y1, m } = data;
            // Form: y - y1 = m(x - x1)
            // Signs: if y1 is positive, 'y - 5'. If negative, 'y + 5'.
            let termY = y1 >= 0 ? `- ${y1}` : `+ ${Math.abs(y1)}`;
            let termX = x1 >= 0 ? `- ${x1}` : `+ ${Math.abs(x1)}`;
            eqnEls.forEach(el => el.innerHTML = `\\( y ${termY} = ${m}(x ${termX}) \\)`);

            this.currentAnswers[type] = `(${x1}, ${y1})`;
            if (practixBox) practixBox.innerHTML = `**Step 1:** Extract Opposite Signs.<br>\\( (x ${termX}) \\to ${x1} \\).<br>\\( (y ${termY}) \\to ${y1} \\).<br>**Result: (${x1}, ${y1})**`;
            if (schoolBox) schoolBox.innerHTML = `<strong>1. Compare to Formula:</strong><br>\\( y - y_1 = m(x - x_1) \\)<br><strong>2. Match terms:</strong><br>\\( -y_1 = ${termY} \\implies y_1=${y1} \\)<br>\\( -x_1 = ${termX} \\implies x_1=${x1} \\)<br><strong>Result: (${x1}, ${y1})</strong>`;
        }

        if (type === 'standard-ints' || type === 'x-int-hack') {
            const { a, b, c } = data;
            // Render 3x + 4y = 12
            eqnEls.forEach(el => {
                let termB = b > 0 ? `+ ${b}y` : `- ${Math.abs(b)}y`;
                el.innerHTML = `\\( ${a}x ${termB} = ${c} \\)`;
            });

            if (type === 'standard-ints') {
                // Ask for X-intercept (Keep it simple) or both? Card explanation says both.
                // Let's ask for X-intercept for standard-ints to avoid parsing complex tuple
                // Actually, let's just ask for x-int. Simpler to check. "Find the x-intercept".
                this.currentAnswers[type] = String(c / a);
                if (practixBox) practixBox.innerHTML = `**Step 1:** Cover y (set y=0).<br>\\( ${a}x = ${c} \\).<br>**Step 2:** Solve.<br>\\( x = ${c}/${a} = ${c / a} \\).<br>**Result: ${c / a}**`;
                if (schoolBox) schoolBox.innerHTML = `<strong>1. Set y = 0:</strong><br>\\( ${a}x + ${b}(0) = ${c} \\)<br><strong>2. Solve for x:</strong><br>\\( ${a}x = ${c} \\implies x = ${c / a} \\)<br><strong>Result: ${c / a}</strong>`;
            } else {
                // x-int-hack: Explicitly x intercept
                this.currentAnswers[type] = String(c / a);
                if (practixBox) practixBox.innerHTML = `**Step 1:** "Hide" the y term.<br>\\( ${a}x = ${c} \\).<br>**Step 2:** Divide.<br>\\( ${c}/${a} = ${c / a} \\).<br>**Result: ${c / a}**`;
                if (schoolBox) schoolBox.innerHTML = `<strong>1. Algebra:</strong><br>Substitute \\( y=0 \\).<br>\\( ${a}x = ${c} \\)<br><strong>2. Isolate:</strong><br>\\( x=${c / a} \\)<br><strong>Result: ${c / a}</strong>`;
            }
        }

    }


    // --- UTILS ---
    checkAnswer(type) {
        const input = document.querySelector(`#${type}-answer-input`);
        const feedback = document.querySelector(`#${type}-feedback`);
        if (!input || !feedback) return;

        // Strip whitespace and normalize (sloppy matching for coordinate commas)
        const normalize = (val) => String(val).replace(/\s+/g, '').replace(/[()]/g, '').toLowerCase();

        const userAnswer = normalize(input.value);
        const correctAnswer = normalize(this.currentAnswers[type]);

        if (userAnswer === correctAnswer && userAnswer !== '') {
            feedback.innerHTML = "✅ Correct! Mastery Earned +1";
            feedback.style.color = "#10b981";
            this.triggerConfetti();
        } else {
            feedback.innerHTML = `❌ Try again! (Hint: Open the solution below)`;
            feedback.style.color = "#ef4444";
        }
    }

    triggerConfetti() {
        document.body.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
        setTimeout(() => document.body.style.backgroundColor = '', 100);
    }

    simplifyFraction(n, d) {
        if (d === 0) return "undefined";
        if (n === 0) return "0";
        const common = this.gcd(Math.abs(n), Math.abs(d));
        n /= common; d /= common;
        if (d === 1) return `${n}`;
        if (d === -1) return `${-n}`;
        if (d < 0) { n = -n; d = -d; }
        return `${n}/${d}`;
    }

    gcd(a, b) { return b ? this.gcd(b, a % b) : a; }
}

window.practixGenerator = new PractixGenerator();
