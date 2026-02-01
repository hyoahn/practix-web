/**
 * Quadratic Problem Generator for Practix
 * Generates random a, b, c coefficients and updates the DOM with solutions.
 */

class QuadraticGenerator {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupListeners();
        });
    }

    setupListeners() {
        const randomizeButtons = document.querySelectorAll('.randomize-btn');
        randomizeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.generate(type);
            });
        });

        const checkButtons = document.querySelectorAll('.check-answer-btn');
        checkButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.checkAnswer(type);
            });
        });

        // Initial generation
        this.generate('product');
        this.generate('sum');
        this.generate('discriminant');
    }

    generate(type) {
        // Generate coefficients: a (1-5), b (-10 to 10), c (-15 to 15)
        let a = Math.floor(Math.random() * 5) + 1;
        let b = Math.floor(Math.random() * 21) - 10;
        let c = Math.floor(Math.random() * 31) - 15;

        // Ensure c is not 0 for product, b is not 0 for sum to keep it interesting
        if (type === 'product' && c === 0) c = 12;
        if (type === 'sum' && b === 0) b = 8;
        if (type === 'discriminant') {
            // For discriminant, sometimes we want D=0 or D<0
            const rand = Math.random();
            if (rand < 0.2) { // Perfection square case D=0: (x+k)^2 = x^2 + 2kx + k^2
                let k = Math.floor(Math.random() * 5) + 1;
                a = 1; b = 2 * k; c = k * k;
            }
        }

        // Store current answer for validation
        this.currentAnswers = this.currentAnswers || {};
        if (type === 'product') this.currentAnswers.product = this.simplifyFraction(c, a);
        if (type === 'sum') this.currentAnswers.sum = this.simplifyFraction(-b, a);
        if (type === 'discriminant') {
            const d = b * b - 4 * a * c;
            this.currentAnswers.discriminant = d > 0 ? "2" : (d === 0 ? "1" : "0");
        }

        const equations = document.querySelectorAll(`[data-eqn-type="${type}"]`);
        equations.forEach(el => {
            el.innerHTML = this.formatEquation(a, b, c);
        });

        if (type === 'product') this.updateProductSolution(a, b, c);
        if (type === 'sum') this.updateSumSolution(a, b, c);
        if (type === 'discriminant') this.updateDiscriminantSolution(a, b, c);

        // Reset feedback
        const feedback = document.querySelector(`#${type}-feedback`);
        if (feedback) {
            feedback.innerHTML = '';
            feedback.style.color = '';
        }

        // Re-render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }

    checkAnswer(type) {
        const input = document.querySelector(`#${type}-answer-input`);
        const feedback = document.querySelector(`#${type}-feedback`);
        const userAnswer = input.value.trim();
        const correctAnswer = this.currentAnswers[type];

        if (userAnswer === correctAnswer) {
            feedback.innerHTML = "✅ Correct! Mastery Earned +1";
            feedback.style.color = "#10b981";
            this.triggerConfetti();
        } else {
            feedback.innerHTML = `❌ Try again! (Hint: Look at the steps below)`;
            feedback.style.color = "#ef4444";
        }
    }

    triggerConfetti() {
        // Simple visual reward
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            // Check if user has a confetti library or just do a simple flash
            document.body.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
            setTimeout(() => document.body.style.backgroundColor = '', 100);
        }());
    }

    formatEquation(a, b, c) {
        let termA = a === 1 ? 'x^2' : `${a}x^2`;
        let termB = b === 0 ? '' : (b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`);
        let termC = c === 0 ? '' : (c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`);
        return `\\( ${termA}${termB}${termC} = 0 \\)`;
    }

    updateProductSolution(a, b, c) {
        const d = b * b - 4 * a * c;
        const schoolBox = document.querySelector('#product-school-steps');
        const practixBox = document.querySelector('#product-practix-steps');

        // Practix Way
        practixBox.innerHTML = `
            **Step 1:** Identify coefficients.<br>
            \\( a=${a}, c=${c} \\).<br>
            **Step 2:** Apply shortcut.<br>
            Product = \\( c/a = ${c}/${a} \\).<br>
            **Result: ${this.simplifyFraction(c, a)}**<br>
            <span style="color: #10b981; font-weight: 600;">Time saved: 85+ seconds.</span>
        `;

        // School Way (Granular)
        schoolBox.innerHTML = `
            <strong>1. Setup Quadratic Formula:</strong><br>
            Identify \\( a=${a}, b=${b}, c=${c} \\).<br>
            \\( x = \\frac{ -(${b}) \\pm \\sqrt{ (${b})^2 - 4(${a})(${c}) } }{ 2(${a}) } \\)<br>
            <strong>2. Simplify:</strong><br>
            \\( x = \\frac{ ${-b} \\pm \\sqrt{${d}} }{ ${2 * a} } \\)<br>
            <strong>3. Calculate Product:</strong><br>
            \\( x_1 = \\frac{ ${-b} + \\sqrt{${d}} }{ ${2 * a} }, x_2 = \\frac{ ${-b} - \\sqrt{${d}} }{ ${2 * a} } \\)<br>
            \\( x_1 \\cdot x_2 = \\frac{ (${-b} + \\sqrt{${d}})(${-b} - \\sqrt{${d}}) }{ ${4 * a * a} } \\)<br>
            \\( x_1 \\cdot x_2 = \\frac{ ${b * b} - (${d}) }{ ${4 * a * a} } = \\frac{ ${b * b - d} }{ ${4 * a * a} } \\)<br>
            <strong>5. Result:</strong> \\( ${this.simplifyFraction(b * b - d, 4 * a * a)} \\).
        `;
    }

    updateSumSolution(a, b, c) {
        const practixBox = document.querySelector('#sum-practix-steps');
        const schoolBox = document.querySelector('#sum-school-steps');
        const d = b * b - 4 * a * c;

        practixBox.innerHTML = `
            **Step 1:** Identify coefficients.<br>
            \\( a=${a}, b=${b} \\).<br>
            **Step 2:** Apply shortcut.<br>
            Sum = \\( -b/a = ${-b}/${a} \\).<br>
            **Result: ${this.simplifyFraction(-b, a)}**<br>
            <span style="color: #10b981; font-weight: 600;">Done in seconds.</span>
        `;

        schoolBox.innerHTML = `
            <strong>1. Setup Quadratic Formula:</strong><br>
            Identify \\( a=${a}, b=${b}, c=${c} \\).<br>
            \\( x = \\frac{ -(${b}) \\pm \\sqrt{ (${b})^2 - 4(${a})(${c}) } }{ 2(${a}) } \\)<br>
            <strong>2. Simplify Terms:</strong><br>
            \\( x = \\frac{ ${-b} }{ ${2 * a} } \\pm \\frac{ \\sqrt{${d}} }{ ${2 * a} } \\)<br>
            <strong>4. Calculate Sum:</strong><br>
            \\( x_1 + x_2 = \\left( \\frac{ ${-b} }{ ${2 * a} } + \\frac{ \\sqrt{${d}} }{ ${2 * a} } \\right) + \\left( \\frac{ ${-b} }{ ${2 * a} } - \\frac{ \\sqrt{${d}} }{ ${2 * a} } \\right) \\)<br>
            Radicals cancel out: \\( \\frac{ ${-b} }{ ${2 * a} } + \\frac{ ${-b} }{ ${2 * a} } = \\frac{ ${-2 * b} }{ ${2 * a} } \\)<br>
            <strong>Result: ${this.simplifyFraction(-b, a)}</strong>
        `;
    }

    updateDiscriminantSolution(a, b, c) {
        const practixBox = document.querySelector('#disc-practix-steps');
        const schoolBox = document.querySelector('#disc-school-steps');
        const d = b * b - 4 * a * c;
        let outcome = "";
        if (d > 0) outcome = "2 Real Solutions";
        else if (d === 0) outcome = "1 Real Solution";
        else outcome = "No Real Solutions";

        practixBox.innerHTML = `
            **Step 1:** Calculate the Discriminant \\( D \\).<br>
            \\( b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${d} \\).<br>
            **Step 2:** Interpret result.<br>
            \\( D ${d > 0 ? '>' : (d === 0 ? '=' : '<')} 0 \\implies \\text{${outcome}} \\).<br>
            **Result: ${outcome}**<br>
            <span style="color: #10b981; font-weight: 600;">Essential for equations that don't factor easily.</span>
        `;

        schoolBox.innerHTML = `
            <strong>1. Use Quadratic Formula:</strong><br>
            Identify \\( a=${a}, b=${b}, c=${c} \\).<br>
            \\( x = \\frac{ -(${b}) \\pm \\sqrt{${d}} }{ ${2 * a} } \\)<br>
            <strong>2. Analyze Square Root:</strong><br>
            The root \\( \\sqrt{${d}} \\) is ${d < 0 ? 'imaginary' : (d === 0 ? 'zero' : 'real')}.<br>
            <strong>3. Count Solutions:</strong><br>
            Since the discriminant is ${d}, there are <strong>${outcome}</strong>.<br>
            <strong>Result: ${outcome}</strong>
        `;
    }

    simplifyFraction(n, d) {
        if (d === 0) return "undefined";
        if (n === 0) return "0";
        const common = this.gcd(Math.abs(n), Math.abs(d));
        n /= common;
        d /= common;
        if (d === 1) return `${n}`;
        if (d === -1) return `${-n}`;
        // If d is negative, move negative to numerator
        if (d < 0) { n = -n; d = -d; }
        return `${n}/${d}`;
    }

    gcd(a, b) {
        return b ? this.gcd(b, a % b) : a;
    }
}

// Instantiate
window.practixGenerator = new QuadraticGenerator();
