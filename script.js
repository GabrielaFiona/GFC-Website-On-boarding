// ======================================================
// --- 1. DATA & CONFIGURATION ---
// ======================================================

const BASE_BRAND_KIT_PRICE = 500;

// Mapping for Visual Wireframes (Icons & Types)
const BLOCK_TYPES = {
  "Hero Section": { icon: "🖼️", type: "hero" },
  "Text Content": { icon: "📝", type: "text" },
  "Image/Gallery": { icon: "📷", type: "image" },
  "Button / CTA": { icon: "🖱️", type: "button" },
  "Contact Form": { icon: "✉️", type: "form" },
  "Testimonials": { icon: "💬", type: "quote" },
  "Map/Location": { icon: "📍", type: "map" },
  "Footer": { icon: "🔻", type: "footer" },
  "Header/Nav": { icon: "🧭", type: "header" },
  "Video Player": { icon: "▶️", type: "video" },
  "Icon Grid": { icon: "💠", type: "grid" }
};

const LAYOUT_DEFINITIONS = {
  "L-01": ["Hero Section", "Text Content", "Image/Gallery", "Button / CTA", "Footer"],
  "L-02": ["Hero Section", "Text Content", "Icon Grid", "Testimonials", "Footer"],
  "default": ["Header/Nav", "Hero Section", "Text Content", "Button / CTA", "Footer"]
};

// Simplified Industry DB for demo
const INDUSTRY_DB = {
  "Restaurant": { pages: ["Home", "Menu", "Reservations"], layouts: { "Home": "L-01", "Menu": "L-02" } },
  "Retail": { pages: ["Home", "Shop", "Cart"], layouts: { "Home": "L-01" } }
};

const BLOCK_LIBRARY = Object.keys(BLOCK_TYPES);

// ======================================================
// --- 2. STATE MANAGEMENT ---
// ======================================================
const state = {
  package: null,
  brandKit: false,
  industry: "",
  pages: [],
  pagePlans: {}, // { "Home": { notes: "", grid: [] }, ... }
  brandingProvided: null,
  customBranding: { active: false, name: "", price: 0 },
};
const pageAttachments = {}; 

function saveState() { localStorage.setItem('onboardingState', JSON.stringify(state)); }
function loadState() {
  const raw = localStorage.getItem('onboardingState');
  if (raw) Object.assign(state, JSON.parse(raw));
}
function nextStep(step) { saveState(); window.location.href = `step${step}.html`; }

// ======================================================
// --- 3. STEP 2 LOGIC (Abbreviated for brevity, kept functional) ---
// ======================================================
function selectPackage(id, name, price, limit, bkPrice, exCost, el) {
  document.querySelectorAll('.package-card').forEach(e => e.classList.remove('selected'));
  if (el) el.classList.add('selected');
  state.package = { id, name, price, limit, bkPrice, exCost };
  if (state.pages.length === 0) state.pages = ['Home', 'Contact'];
  handlePackageSelected(); calculateTotal(); updatePageBuilderUI(); saveState();
}
function handlePackageSelected() {
  document.getElementById('brandingLockedNotice')?.classList.add('hidden');
  document.getElementById('brandingUnlocked')?.classList.remove('hidden');
  document.getElementById('pageBuilderSection')?.classList.remove('hidden');
  document.getElementById('brandingSection')?.classList.remove('collapsed');
}
function calculateTotal() { 
  const fwItems = document.getElementById('fw-items');
  if (!fwItems) return;
  let html = '';
  let total = 0;
  if (state.package) {
    html += `<div class="fw-item"><span>${state.package.name}</span><span>$${state.package.price.toLocaleString()}</span></div>`;
    total += state.package.price;
    if (state.pages.length > state.package.limit) {
      const extra = state.pages.length - state.package.limit;
      const extraCost = extra * state.package.extraPageCost;
      html += `<div class="fw-item"><span style="color:#ff6b6b">${extra} Extra Pages</span><span>$${extraCost.toLocaleString()}</span></div>`;
      total += extraCost;
    }
  }
  if (state.brandKit) {
    let kitPrice = BASE_BRAND_KIT_PRICE;
    let label = 'Brand Kit';
    if (state.package && state.package.brandKitBundlePrice) { kitPrice = Number(state.package.brandKitBundlePrice); label += ' (Bundled)'; }
    html += `<div class="fw-item"><span>+ ${label}</span><span>$${kitPrice.toLocaleString()}</span></div>`;
    total += kitPrice;
  }
  if (state.customBranding && state.customBranding.price > 0) {
    html += `<div class="fw-item"><span>+ ${state.customBranding.name}</span><span>$${state.customBranding.price.toLocaleString()}</span></div>`;
    total += state.customBranding.price;
  }
  
  if (!html) html = '<p class="empty-state">Select a package to start...</p>';
  fwItems.innerHTML = html;
  const headerTotalEl = document.getElementById('fw-header-total');
  if (headerTotalEl) headerTotalEl.textContent = `$${total.toLocaleString()}`;
  const fullTotalEl = document.getElementById('fw-full-total');
  if (fullTotalEl) fullTotalEl.textContent = `$${total.toLocaleString()}`;
  const depositEl = document.getElementById('fw-deposit');
  if (depositEl) depositEl.textContent = `$${(total / 2).toLocaleString()}`;
}
function addPage(n) { 
  const val = n || document.getElementById('customPageInput').value; 
  if(val && !state.pages.includes(val)) { 
    state.pages.push(val); 
    if(!state.pagePlans[val]) state.pagePlans[val] = {};
    // Default layout setup
    state.pagePlans[val].grid = convertListToFreeGrid(LAYOUT_DEFINITIONS['default']);
    updatePageBuilderUI(); saveState(); 
  }
}
function removePage(n) { state.pages = state.pages.filter(p => p !== n); updatePageBuilderUI(); saveState(); }
function updatePageBuilderUI() {
    const list = document.getElementById('activePagesList');
    if(!list) return;
    list.innerHTML = state.pages.map(p => `<div class="page-tag">${p} <span onclick="removePage('${p}')" style="cursor:pointer">&times;</span></div>`).join('');
}

// ======================================================
// --- 4. STEP 3: VISUAL LAYOUT BUILDER (UPDATED) ---
// ======================================================

function initStep3() {
  if (!document.body.classList.contains('step3')) return;
  const container = document.getElementById('planContainer');
  container.innerHTML = ''; 
  const pkgId = state.package ? state.package.id : 'basic';

  if (pkgId === 'basic') {
      // Basic Text Logic (Keep if needed)
      container.innerHTML = "<p>Basic package uses text notes only.</p>";
  } else {
      renderVisualLayoutBuilder(container); 
  }
  injectDownloadButton();
}

function renderVisualLayoutBuilder(container) {
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Drag & Drop Wireframe Tool. Move elements freely. They snap to grid.</p></div>`;
  container.insertAdjacentHTML('beforebegin', intro);

  state.pages.forEach((page, index) => {
    if(!state.pagePlans[page]) state.pagePlans[page] = {};
    if (!state.pagePlans[page].grid || state.pagePlans[page].grid.length === 0) {
      state.pagePlans[page].grid = convertListToFreeGrid(LAYOUT_DEFINITIONS["default"]);
    }
    
    const gridId = `grid-canvas-${index}`;
    const mobileId = `mobile-preview-${index}`;
    const fileListId = `file-list-${index}`;

    const html = `
      <div class="plan-card collapsed" data-page="${page}">
        <div class="plan-card-header" onclick="togglePlanCard(this)">
            <div class="plan-card-title-group"><span>▼ ${index + 1}. ${page}</span></div>
            <div style="font-size:0.8rem; opacity:0.7;">Click to Edit Layout</div>
        </div>
        
        <div class="plan-card-body">
          <div class="builder-layout-container">
            <div class="editor-pane">
               <div class="editor-header">
                 <span>Desktop Wireframe</span>
                 <button class="btn-dashed" style="width:auto; margin:0; padding:5px 10px;" onclick="openBlockLibrary('${page}', '${gridId}')">+ Add Element</button>
               </div>
               <div class="grid-canvas" id="${gridId}"></div>
            </div>
            <div class="preview-pane">
              <div class="mobile-frame">
                 <div class="mobile-screen" id="${mobileId}"><div class="mobile-notch"></div></div>
              </div>
            </div>
          </div>
          <div style="margin-top:30px; border-top:1px solid var(--border-light); padding-top:20px;">
              <label>Content Notes</label>
              <textarea rows="3" oninput="savePageNote('${page}', this.value)">${state.pagePlans[page].notes || ''}</textarea>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    setTimeout(() => refreshPageBuilderUI(page, gridId, mobileId), 100);
  });
}

// Convert list to Free-Floating Grid Objects (Absolute Position Logic)
function convertListToFreeGrid(listItems) {
    return listItems.map((item, index) => ({
        id: `block-${Date.now()}-${index}`,
        name: item,
        x: 1, // Grid column start
        y: 1 + (index * 2), // Grid row start (spaced out)
        w: 12, // Width
        h: 2   // Height
    }));
}

// --- RENDER FUNCTIONS ---
function refreshPageBuilderUI(pageName, gridId, mobileId) {
    const gridContainer = document.getElementById(gridId);
    const mobileContainer = document.getElementById(mobileId);
    if(!gridContainer) return;

    gridContainer.innerHTML = '';
    mobileContainer.innerHTML = '<div class="mobile-notch"></div>';

    const blocks = state.pagePlans[pageName].grid || [];
    
    // Sort for mobile flow (Top to bottom based on Y)
    const sortedBlocks = [...blocks].sort((a,b) => a.y - b.y);

    blocks.forEach((block, idx) => {
        // 1. Desktop Render
        const info = BLOCK_TYPES[block.name] || { icon: "📦", type: "generic" };
        const el = document.createElement('div');
        el.className = `grid-item block-type-${info.type}`;
        el.id = block.id;
        
        // CSS Grid Positioning for "Free Float" feel but snapped to grid lines
        el.style.gridColumnStart = block.x;
        el.style.gridColumnEnd = `span ${block.w}`;
        el.style.gridRowStart = block.y;
        el.style.gridRowEnd = `span ${block.h}`;
        
        el.innerHTML = `
          <div class="grid-remove" onclick="removeBlock('${pageName}', '${block.id}')">&times;</div>
          <div class="grid-item-content">
             <div class="grid-visual-icon">${info.icon}</div>
             <div class="grid-label">${block.name}</div>
          </div>
          <div class="grid-resize-handle"></div>
        `;
        setupFreeInteraction(el, pageName, idx, gridId, mobileId);
        gridContainer.appendChild(el);
    });

    sortedBlocks.forEach(block => {
        const info = BLOCK_TYPES[block.name] || { icon: "📦" };
        const div = document.createElement('div');
        div.className = `mobile-block ${info.type === 'button' ? 'mobile-block-button' : ''}`;
        div.innerHTML = `<span class="mobile-block-icon">${info.icon}</span> <span>${block.name}</span>`;
        mobileContainer.appendChild(div);
    });
}

// --- INTERACTION: FREE FLOATING DRAG ---
function setupFreeInteraction(element, pageName, index, gridId, mobileId) {
    const container = document.getElementById(gridId);
    let startX, startY, startGridX, startGridY;
    
    // DRAG LOGIC
    element.addEventListener('mousedown', (e) => {
        if(e.target.classList.contains('grid-resize-handle') || e.target.classList.contains('grid-remove')) return;
        
        e.preventDefault();
        element.classList.add('interacting');
        
        const rect = container.getBoundingClientRect();
        // Calculate cell size based on current container size
        const colWidth = rect.width / 12; 
        const rowHeight = 60; // Fixed row height defined in CSS

        startX = e.clientX;
        startY = e.clientY;
        const blockData = state.pagePlans[pageName].grid[index];
        startGridX = blockData.x;
        startGridY = blockData.y;

        const onMove = (moveEvent) => {
            const diffX = moveEvent.clientX - startX;
            const diffY = moveEvent.clientY - startY;
            
            const colsMoved = Math.round(diffX / colWidth);
            const rowsMoved = Math.round(diffY / rowHeight);

            let newX = startGridX + colsMoved;
            let newY = startGridY + rowsMoved;

            // Constraints
            if(newX < 1) newX = 1;
            if(newX + blockData.w > 13) newX = 13 - blockData.w;
            if(newY < 1) newY = 1;

            element.style.gridColumnStart = newX;
            element.style.gridRowStart = newY;
        };

        const onUp = (upEvent) => {
            element.classList.remove('interacting');
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            
            // Save final position
            const finalStyle = window.getComputedStyle(element);
            state.pagePlans[pageName].grid[index].x = parseInt(finalStyle.gridColumnStart);
            state.pagePlans[pageName].grid[index].y = parseInt(finalStyle.gridRowStart);
            saveState();
            refreshPageBuilderUI(pageName, gridId, mobileId);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    });

    // RESIZE LOGIC
    const resizeHandle = element.querySelector('.grid-resize-handle');
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const colWidth = rect.width / 12;
        const rowHeight = 60;
        
        startX = e.clientX;
        startY = e.clientY;
        const blockData = state.pagePlans[pageName].grid[index];
        const startW = blockData.w;
        const startH = blockData.h;

        const onResize = (moveEvent) => {
            const diffX = moveEvent.clientX - startX;
            const diffY = moveEvent.clientY - startY;
            
            let newW = startW + Math.round(diffX / colWidth);
            let newH = startH + Math.round(diffY / rowHeight);

            if(newW < 2) newW = 2; if(newW + blockData.x > 13) newW = 13 - blockData.x;
            if(newH < 1) newH = 1;

            element.style.gridColumnEnd = `span ${newW}`;
            element.style.gridRowEnd = `span ${newH}`;
        };

        const onEndResize = () => {
             // Parse spans manually as computed style returns raw numbers often
             const spanW = element.style.gridColumnEnd.replace('span ','');
             const spanH = element.style.gridRowEnd.replace('span ','');
             state.pagePlans[pageName].grid[index].w = parseInt(spanW);
             state.pagePlans[pageName].grid[index].h = parseInt(spanH);
             saveState();
             refreshPageBuilderUI(pageName, gridId, mobileId);
             window.removeEventListener('mousemove', onResize);
             window.removeEventListener('mouseup', onEndResize);
        };

        window.addEventListener('mousemove', onResize);
        window.addEventListener('mouseup', onEndResize);
    });
}

function openBlockLibrary(pageName, gridId) {
    // Determine page index from gridId
    const pageIndex = gridId.split('-')[2];
    const existing = document.getElementById('lib-modal');
    if(existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'lib-modal';
    overlay.className = 'block-library-overlay';
    
    const items = BLOCK_LIBRARY.map(name => {
        const info = BLOCK_TYPES[name];
        return `<div class="library-option" onclick="addBlock('${pageName}', '${name}', '${pageIndex}')">
            <span class="library-icon">${info.icon}</span><span>${name}</span>
        </div>`;
    }).join('');

    overlay.innerHTML = `<div class="block-library-modal"><h3>Add Element</h3><div class="library-grid">${items}</div><button class="btn-close-modal" onclick="this.closest('.block-library-overlay').remove()">Cancel</button></div>`;
    document.body.appendChild(overlay);
}

function addBlock(pageName, blockName, pageIndex) {
    const grid = state.pagePlans[pageName].grid;
    // Find next available Y slot roughly
    const maxY = grid.length > 0 ? Math.max(...grid.map(b => b.y + b.h)) : 1;
    
    grid.push({
        id: `block-${Date.now()}`,
        name: blockName,
        x: 1, y: maxY, w: 12, h: 2
    });
    
    document.getElementById('lib-modal').remove();
    refreshPageBuilderUI(pageName, `grid-canvas-${pageIndex}`, `mobile-preview-${pageIndex}`);
    saveState();
}

function removeBlock(pageName, id) {
    state.pagePlans[pageName].grid = state.pagePlans[pageName].grid.filter(b => b.id !== id);
    const idx = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, `grid-canvas-${idx}`, `mobile-preview-${idx}`);
    saveState();
}

function togglePlanCard(header) { header.closest('.plan-card').classList.toggle('collapsed'); }
function savePageNote(p, t) { if(!state.pagePlans[p]) state.pagePlans[p]={}; state.pagePlans[p].notes=t; saveState(); }
function injectDownloadButton() { /* ... existing logic ... */ }
function downloadProjectOutline() { /* ... existing logic ... */ }

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  if (window.location.pathname.includes('step2')) initPageBuilder();
  if (window.location.pathname.includes('step3')) initStep3();
  calculateTotal();
  // Handle collapsibles generic
  document.querySelectorAll('[data-collapsible-header]').forEach(h => {
      h.addEventListener('click', () => h.closest('.collapsible').classList.toggle('collapsed'));
  });
});
