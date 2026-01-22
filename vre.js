// Mock VRE Demo Script for V2 (Light Mode - Student Friendly)

function runDemo() {
    const container = document.getElementById('vre-container');
    container.innerHTML = ''; // Clear placeholder

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Draw coordinate system (Light Mode)
    drawGrid(ctx, canvas.width, canvas.height);
    
    // Draw a function
    drawFunction(ctx, canvas.width, canvas.height);
    
    // Add some "interactive" points
    drawPoint(ctx, 400, 300, 'P (Interactive)');
}

function drawGrid(ctx, w, h) {
    ctx.strokeStyle = '#e2e8f0'; // Light gray grid
    ctx.lineWidth = 1;

    // Grid lines
    for (let x = 0; x <= w; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b'; // Slate 500
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
    ctx.stroke();
}

function drawFunction(ctx, w, h) {
    ctx.strokeStyle = '#2563EB'; // Primary Blue
    ctx.lineWidth = 4;
    // No shadow for cleaner look
    ctx.beginPath();
    
    const centerX = w/2;
    const centerY = h/2;
    const scale = 50; 

    for (let x = -8; x <= 8; x += 0.1) {
        // y = 0.5 * x^2 - 2
        let y = 0.5 * (x * x) - 2;
        
        const canvasX = centerX + (x * scale);
        const canvasY = centerY - (y * scale);
        
        if (x === -8) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();
}

function drawPoint(ctx, x, y, label) {
    // Point
    ctx.fillStyle = '#ef4444'; // Red
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = '#1e293b'; // Dark text
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.fillText(label, x + 15, y - 10);
}
