// ======================================================
// --- 1. DATA & CONFIGURATION ---
// ======================================================
const BASE_BRAND_KIT_PRICE = 500;
const BLOCK_TYPES = {
  "Hero Section": { icon: "🖼️", type: "hero" },
  "Text Content": { icon: "📝", type: "text" },
  "Image/Gallery": { icon: "📷", type: "image" },
  "Button / CTA": { icon: "🖱️", type: "button" },
  "Contact Form": { icon: "✉️", type: "form" },
  "Footer": { icon: "🔻", type: "footer" },
  "Header/Nav": { icon: "🧭", type: "header" }
};

const LAYOUT_DEFINITIONS = {
  "default": [
    { name: "Header/Nav", x: 1, y: 1, w: 12, h: 1 },
    { name: "Hero Section", x: 1, y: 2, w: 12, h: 4 },
    { name: "Text Content", x: 1, y: 6, w: 8, h: 3 },
    { name: "Image/Gallery", x: 9, y: 6, w: 4, h: 3 },
    { name: "Footer", x: 1, y: 9, w: 12, h: 2 }
  ],
  "L-01": [ { name: "Hero Section", x: 1, y: 1, w: 12, h: 5 }, { name: "Footer", x: 1, y: 6, w: 12, h: 2 } ]
};

const LAYOUT_NAMES = { "default": "Basic Starter", "L-01": "Visual Hero / Gallery" };
const INDUSTRY_DB = { "Restaurant": { pages: ["Home", "Menu"], layouts: { "Home": "L-01", "Menu": "default" } } };

// ======================================================
// --- 2. STATE MANAGEMENT ---
// ======================================================
const state = {
  package: null, brandKit: false, pages: [], pagePlans: {}, 
  customBranding: { active: false, name: "", price: 0 }, viewMode: {} 
};

function saveState() { localStorage.setItem('onboardingState', JSON.stringify(state)); }
function loadState() { 
    const raw = localStorage.getItem('onboardingState'); 
    if (raw) Object.assign(state, JSON.parse(raw)); 
}
function nextStep(stepNumber) { saveState(); window.location.href = `step${stepNumber}.html`; }

// ======================================================
// --- 3. CORE CALCULATIONS (GLOBAL) ---
// ======================================================
function calculateTotal() {
  const fwItems = document.getElementById('fw-items');
  if (!fwItems) return;
  
  let html = ''; let total = 0;
  if (state.package) {
    html += `<div class="fw-item"><span>${state.package.name}</span><span>$${state.package.price.toLocaleString()}</span></div>`;
    total += state.package.price;
    if (state.pages.length > state.package.limit) {
      const extra = state.pages.length - state.package.limit;
      const extraCost = extra * state.package.extraPageCost;
      html += `<div class="fw-item"><span>${extra} Extra Pages</span><span>$${extraCost.toLocaleString()}</span></div>`;
      total += extraCost;
    }
  }
  if (state.brandKit) {
    let kitPrice = (state.package && state.package.brandKitBundlePrice) ? Number(state.package.brandKitBundlePrice) : BASE_BRAND_KIT_PRICE;
    html += `<div class="fw-item"><span>Brand Kit</span><span>$${kitPrice.toLocaleString()}</span></div>`;
    total += kitPrice;
  }
  if (state.customBranding.price > 0) {
    html += `<div class="fw-item"><span>${state.customBranding.name}</span><span>$${state.customBranding.price.toLocaleString()}</span></div>`;
    total += state.customBranding.price;
  }
  
  fwItems.innerHTML = html || '<p>Select a package...</p>';
  document.getElementById('fw-header-total').textContent = `$${total.toLocaleString()}`;
  document.getElementById('fw-full-total').textContent = `$${total.toLocaleString()}`;
  document.getElementById('fw-deposit').textContent = `$${(total / 2).toLocaleString()}`;

  // Step 4 Sync
  const invItems = document.getElementById('final-invoice-items');
  if (invItems) {
      invItems.innerHTML = html.replace(/fw-item/g, 'line-item');
      document.getElementById('final-invoice-total').textContent = `$${total.toLocaleString()}`;
      document.getElementById('final-invoice-deposit').textContent = `$${(total / 2).toLocaleString()}`;
  }
}

// ======================================================
// --- 4. STEP 3: VISUAL BUILDER & SWAP LOGIC ---
// ======================================================
function initStep3() {
    if (!document.body.classList.contains('step3')) return;
    const container = document.getElementById('planContainer');
    container.innerHTML = '';
    
    state.pages.forEach((page, index) => {
        if (!state.pagePlans[page]) state.pagePlans[page] = {};
        if (!state.pagePlans[page].grid) state.pagePlans[page].grid = JSON.parse(JSON.stringify(LAYOUT_DEFINITIONS['default']));
        if (!state.viewMode[page]) state.viewMode[page] = 'desktop';

        const html = `
          <div class="plan-card" data-page="${page}">
            <div class="plan-card-header" onclick="this.closest('.plan-card').classList.toggle('collapsed')">
                <span>${index + 1}. ${page}</span>
            </div>
            <div class="plan-card-body">
              <div class="builder-layout-container">
                <div class="editor-pane">
                   <div class="editor-header"><span id="title-${index}">Desktop Edit</span></div>
                   <div class="grid-canvas" id="grid-${index}"></div>
                </div>
                <div class="preview-pane" id="preview-${index}" onclick="toggleViewMode('${page}', ${index})"></div>
              </div>
            </div>
          </div>`;
        container.insertAdjacentHTML('beforeend', html);
        refreshPageBuilderUI(page, index);
    });
}

function refreshPageBuilderUI(page, index) {
    const gridEl = document.getElementById(`grid-${index}`);
    const prevEl = document.getElementById(`preview-${index}`);
    const titleEl = document.getElementById(`title-${index}`);
    if (!gridEl) return;

    gridEl.innerHTML = '';
    const mode = state.viewMode[page] || 'desktop';
    titleEl.textContent = mode === 'desktop' ? 'Desktop Wireframe' : 'Mobile Wireframe';

    const blocks = state.pagePlans[page].grid;
    blocks.forEach((block, idx) => {
        const info = BLOCK_TYPES[block.name] || { icon: "📦", type: "generic" };
        const el = document.createElement('div');
        el.className = `grid-item block-type-${info.type}`;
        el.style.gridColumn = `${block.x} / span ${block.w}`;
        el.style.gridRow = `${block.y} / span ${block.h}`;
        el.innerHTML = `<div class="grid-item-content"><div class="grid-label">${block.name}</div></div>`;
        
        setupSwapInteraction(el, page, idx, index);
        gridEl.appendChild(el);
    });

    // Render Preview
    if (mode === 'desktop') {
        let html = `<div class="mobile-frame"><div class="mobile-screen">`;
        blocks.sort((a,b) => a.y - b.y).forEach(b => html += `<div class="mobile-block"><span>${b.name}</span></div>`);
        prevEl.innerHTML = html + `</div></div>`;
    } else {
        let html = `<div class="desktop-frame"><div class="desktop-screen">`;
        blocks.sort((a,b) => a.y - b.y).forEach(b => html += `<div class="mini-desktop-block" style="width: calc(${(b.w/12)*100}% - 5px)">${b.name}</div>`);
        prevEl.innerHTML = html + `</div></div>`;
    }
}

function setupSwapInteraction(element, page, blockIdx, pageIdx) {
    let originalX, originalY;
    element.addEventListener('mousedown', (e) => {
        e.preventDefault();
        element.classList.add('interacting');
        const block = state.pagePlans[page].grid[blockIdx];
        originalX = block.x; originalY = block.y;
        
        const onMove = (me) => {
            const rect = element.parentElement.getBoundingClientRect();
            const x = Math.round(((me.clientX - rect.left) / rect.width) * 12) + 1;
            const y = Math.round((me.clientY - rect.top) / 60) + 1;
            if (x >= 1 && x <= 13 - block.w) element.style.gridColumnStart = x;
            if (y >= 1) element.style.gridRowStart = y;
        };

        const onUp = () => {
            element.classList.remove('interacting');
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            
            const newX = parseInt(element.style.gridColumnStart);
            const newY = parseInt(element.style.gridRowStart);
            
            // SWAP LOGIC: Find if dropped on another block
            const targetIdx = state.pagePlans[page].grid.findIndex((b, i) => i !== blockIdx && newX < b.x + b.w && newX + block.w > b.x && newY < b.y + b.h && newY + block.h > b.y);
            
            if (targetIdx !== -1) {
                state.pagePlans[page].grid[targetIdx].x = originalX;
                state.pagePlans[page].grid[targetIdx].y = originalY;
            }
            state.pagePlans[page].grid[blockIdx].x = newX;
            state.pagePlans[page].grid[blockIdx].y = newY;
            
            saveState(); refreshPageBuilderUI(page, pageIdx);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    });
}

function toggleViewMode(page, index) {
    state.viewMode[page] = (state.viewMode[page] === 'desktop') ? 'mobile' : 'desktop';
    refreshPageBuilderUI(page, index);
}

// ======================================================
// --- 5. INITIALIZATION ---
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    if (window.location.pathname.includes('step3')) initStep3();
    if (window.location.pathname.includes('step4')) {
        document.getElementById('fullName').value = localStorage.getItem('clientName') || '';
        document.getElementById('businessName').value = localStorage.getItem('businessName') || '';
        document.getElementById('email').value = localStorage.getItem('clientEmail') || '';
    }
    calculateTotal();
});

function toggleWidget() { document.getElementById('floating-widget').classList.toggle('collapsed'); }
