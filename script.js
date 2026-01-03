/* REQUIREMENT 1: Remove Hover Labels */
.mobile-overlay-hint, .preview-mode-tag {
    display: none !important;
}

/* REQUIREMENT 7: Finalize Page Styling */
.step4 .container {
    background: var(--bg-dark);
    padding: 50px;
    border-radius: 20px;
    border: 1px solid var(--border-light);
}

.invoice-box {
    background: var(--surface-base);
    padding: 30px;
    border-radius: 12px;
    margin-top: 30px;
}

.line-item {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid var(--border-light);
}

.total-row {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-blue);
    border-bottom: 2px solid var(--accent-blue);
}

/* REQUIREMENT 4: Clean Dropdown Dividers */
select optgroup {
    border-top: 1px solid var(--border-light);
    padding-top: 10px;
    font-weight: 600;
    color: var(--accent-blue);
    background: #0f1322;
}

/* REQUIREMENT 2: Grid Layouts */
.grid-canvas.desktop-mode-active {
    width: 100%;
    min-height: 500px;
}
.grid-canvas.mobile-mode-active {
    max-width: 400px;
    margin: 0 auto;
    min-height: 600px;
}

// Add this check inside your setupFreeInteraction "onUp" event
const potentialX = parseInt(element.style.gridColumnStart);
const potentialY = parseInt(element.style.gridRowStart);

// Requirement 3: Check for collision
const overlapped = state.pagePlans[pageName].grid.some(b => {
    if (b.id === blockData.id) return false;
    return (potentialX < b.x + b.w && potentialX + blockData.w > b.x && potentialY < b.y + b.h && potentialY + blockData.h > b.y);
});

if (overlapped) {
    // If it overlaps, snap it back to original position or the next available row
    element.style.gridColumnStart = startGridX;
    element.style.gridRowStart = startGridY;
    alert("Space already occupied! Elements cannot stack.");
} else {
    // Save new position
    state.pagePlans[pageName].grid[index].x = potentialX;
    state.pagePlans[pageName].grid[index].y = potentialY;
}
