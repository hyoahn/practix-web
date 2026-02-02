/**
 * Desmos Calculator Sidebar Toggle
 * Handles showing/hiding the calculator on mobile devices
 */

function toggleCalculator() {
    const sidebar = document.querySelector('.calculator-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}
