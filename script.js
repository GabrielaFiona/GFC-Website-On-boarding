// ======================================================
// --- 1. DATA & CONFIGURATION ---
// ======================================================

const BASE_BRAND_KIT_PRICE = 500;

// VISUAL ICONS MAPPING (Kept Original)
const BLOCK_TYPES = {
  "Hero Section": { icon: "🖼️", type: "hero" },
  "Hero: Full Screen Visual": { icon: "🖼️", type: "hero" },
  "Hero: Brand Story": { icon: "📖", type: "hero" },
  "Text Content": { icon: "📝", type: "text" },
  "Intro Blurb": { icon: "📝", type: "text" },
  "Image/Gallery": { icon: "📷", type: "image" },
  "Visual Gallery Grid": { icon: "📷", type: "image" },
  "Button / CTA": { icon: "🖱️", type: "button" },
  "Contact Form": { icon: "✉️", type: "form" },
  "Testimonials": { icon: "💬", type: "quote" },
  "Map/Location": { icon: "📍", type: "map" },
  "Footer": { icon: "🔻", type: "footer" },
  "Header/Nav": { icon: "🧭", type: "header" },
  "Video Player": { icon: "▶️", type: "video" },
  "Icon Grid": { icon: "💠", type: "grid" },
  "Service A": { icon: "⚙️", type: "generic" },
  "Service B": { icon: "⚙️", type: "generic" },
  "Service C": { icon: "⚙️", type: "generic" }
};

// --- REQUIREMENT 4: RENAMED LAYOUTS TO CATEGORY/NAME FORMAT ---
const LAYOUT_DEFINITIONS = {
  "Restaurant/Home": [ 
    { name: "Hero: Full Screen Visual", x: 1, y: 1, w: 12, h: 5 },
    { name: "Intro Blurb", x: 2, y: 6, w: 10, h: 2 },
    { name: "Visual Gallery Grid", x: 1, y: 8, w: 12, h: 4 },
    { name: "Button / CTA", x: 4, y: 12, w: 6, h: 1 },
    { name: "Footer", x: 1, y: 13, w: 12, h: 2 }
  ],
  "Portfolio/Home": [ 
    { name: "Hero: Brand Story", x: 1, y: 1, w: 12, h: 4 },
    { name: "About the Founder", x: 1, y: 5, w: 6, h: 4 },
    { name: "Our Values", x: 7, y: 5, w: 6, h: 4 },
    { name: "Timeline/History", x: 1, y: 9, w: 12, h: 3 },
    { name: "Footer", x: 1, y: 12, w: 12, h: 2 }
  ],
  "Service/Pricing": [ 
    { name: "Hero Section", x: 1, y: 1, w: 12, h: 3 },
    { name: "Pricing Tier 1", x: 1, y: 4, w: 4, h: 4 },
    { name: "Pricing Tier 2", x: 5, y: 4, w: 4, h: 4 },
    { name: "Pricing Tier 3", x: 9, y: 4, w: 4, h: 4 },
    { name: "Testimonials", x: 1, y: 8, w: 12, h: 2 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "Creative/Process": [ 
    { name: "Service Overview", x: 1, y: 1, w: 12, h: 3 },
    { name: "Step 1: Consult", x: 1, y: 4, w: 6, h: 2 },
    { name: "Step 1 Image", x: 7, y: 4, w: 6, h: 2 },
    { name: "Step 2: Build", x: 7, y: 6, w: 6, h: 2 },
    { name: "Step 2 Image", x: 1, y: 6, w: 6, h: 2 },
    { name: "Footer", x: 1, y: 8, w: 12, h: 2 }
  ],
  "Contact/Location": [ 
    { name: "Map/Location", x: 1, y: 1, w: 8, h: 6 },
    { name: "Address & Hours", x: 9, y: 1, w: 4, h: 3 },
    { name: "Social Media Links", x: 9, y: 4, w: 4, h: 3 },
    { name: "Contact Form", x: 1, y: 7, w: 12, h: 4 },
    { name: "Footer", x: 1, y: 11, w: 12, h: 2 }
  ],
  "default": [ 
    { name: "Header/Nav", x: 1, y: 1, w: 12, h: 1 },
    { name: "Hero Section", x: 1, y: 2, w: 12, h: 4 },
    { name: "Text Content", x: 1, y: 6, w: 8, h: 3 },
    { name: "Image", x: 9, y: 6, w: 4, h: 3 },
    { name: "Footer", x: 1, y: 9, w: 12, h: 2 }
  ]
};

// --- INDUSTRY DATABASE (UPDATED TO MATCH NEW LAYOUT NAMES) ---
const INDUSTRY_DB = {
  "Restaurant": { pages: ["Home", "Menu", "Reservations"], layouts: { "Home": "Restaurant/Home", "Menu": "Service/Pricing", "Reservations": "Contact/Location" } },
  "Portfolio/Creative": { pages: ["Home", "Work", "About"], layouts: { "Home": "Portfolio/Home", "Work": "Portfolio/Home", "About": "Creative/Process" } },
  "Service Business": { pages: ["Home", "Services", "Contact"], layouts: { "Home": "Creative/Process", "Services": "Service/Pricing", "Contact": "Contact/Location" } }
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
  addons: [],
  pagePlans: {}, 
  brandingProvided: null,
  customBranding: { active: false, name: "", price: 0 },
  advancedNotes: "",
  viewMode: {} // Stores 'desktop' or 'mobile' per page
};

// Store files in memory
const pageAttachments = {}; 

function saveState() {
  localStorage.setItem('onboardingState', JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem('onboardingState');
  if (raw) Object.assign(state, JSON.parse(raw));
}

function nextStep(stepNumber) {
  saveState();
  window.location.href = `step${stepNumber}.html`;
}

// --- REQUIREMENT 3: COLLISION DETECTION LOGIC ---
function checkOverlap(pageName, movingId, x, y, w, h) {
    const blocks = state.pagePlans[pageName].grid;
    return blocks.some(b => {
        if (b.id === movingId) return false;
        return (x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y);
    });
}

// ======================================================
// --- 3. STEP 2 LOGIC (KEPT EXACTLY AS ORIGINAL) ---
// ======================================================

function selectPackage(id, name, price, limit, brandKitBundlePrice, extraPageCost, element) {
  document.querySelectorAll('.package-card').forEach(el => el.classList.remove('selected'));
  if (element) element.classList.add('selected');

  state.package = { id, name, price, limit, brandKitBundlePrice, extraPageCost };
  
  if (state.pages.length === 0) state.pages = ['Home', 'Contact'];
  
  handlePackageSelected();
  calculateTotal();
  updateBrandKitDisplay();
  updatePageBuilderUI(); 
  saveState();
}

function handlePackageSelected(isRestore) {
  const notice = document.getElementById('brandingLockedNotice');
  const unlocked = document.getElementById('brandingUnlocked');
  const pageBuilder = document.getElementById('pageBuilderSection');
  
  if (notice) notice.classList.add('hidden');
  if (unlocked) unlocked.classList.remove('hidden');
  if (pageBuilder) pageBuilder.classList.remove('hidden');

  const branding = document.getElementById('brandingSection');
  if (branding && !isRestore) branding.classList.remove('collapsed'); 
  
  if (window.initCollapsibles) window.initCollapsibles(); 
}

function toggleBrandingPanels(value) {
  state.brandingProvided = value;
  const yesPanel = document.getElementById('brandingProvidedPanel');
  const noPanel = document.getElementById('brandingNotProvidedPanel');
  if (yesPanel) yesPanel.classList.toggle('hidden', value !== 'yes');
  if (noPanel) noPanel.classList.toggle('hidden', value !== 'no');
  saveState();
}

let uploadedFiles = []; 
function handleFileUpload(e) {
  const files = e.target.files;
  const box = document.getElementById('file-staging-box');
  const list = document.getElementById('file-list-content');
  
  if (!files || !files.length) {
    box.classList.add('hidden');
    return;
  }
  
  box.classList.remove('hidden');
  list.innerHTML = ''; 
  uploadedFiles = Array.from(files); 

  uploadedFiles.forEach(file => {
    const row = document.createElement('div');
    row.className = 'file-list-item';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = file.name;
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.className = 'btn-download-mini';
    link.textContent = 'Download';
    row.appendChild(nameSpan);
    row.appendChild(link);
    list.appendChild(row);
  });
}

function downloadAllFiles() {
  uploadedFiles.forEach(file => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  const notesArea = document.getElementById('brandingProvidedNotes');
  if (notesArea && notesArea.value.trim() !== "") {
    const blob = new Blob([notesArea.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "branding-notes.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (uploadedFiles.length === 0) {
    alert("No files or notes to download.");
  }
}

function toggleCustomBrandingUI(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.toggle('hidden');
}

function updateCustomBrandingState() {
  const names = document.querySelectorAll('.custom-brand-name');
  const prices = document.querySelectorAll('.custom-brand-price');
  
  let activeName = "";
  let activePrice = 0;

  if (document.activeElement && document.activeElement.classList.contains('custom-brand-name')) {
    activeName = document.activeElement.value;
  } else {
    names.forEach(input => { if (input.value) activeName = input.value; });
  }

  if (document.activeElement && document.activeElement.classList.contains('custom-brand-price')) {
    activePrice = Number(document.activeElement.value);
  } else {
    prices.forEach(input => { if (input.value) activePrice = Number(input.value); });
  }

  names.forEach(input => { if (input !== document.activeElement) input.value = activeName; });
  prices.forEach(input => { if (input !== document.activeElement) input.value = activePrice || ""; });

  state.customBranding = { 
    active: (activePrice > 0), 
    name: activeName || "Custom Branding", 
    price: activePrice || 0
  };

  calculateTotal();
  saveState();
}

function initPageBuilder() {
  const input = document.getElementById('industryInput');
  const fileInput = document.getElementById('brandingUploads');
  if (fileInput) fileInput.addEventListener('change', handleFileUpload);

  if (state.brandingProvided) {
    const radio = document.querySelector(`input[name="brandingProvided"][value="${state.brandingProvided}"]`);
    if (radio) { radio.checked = true; toggleBrandingPanels(state.brandingProvided); }
  }
  if (state.customBranding && state.customBranding.price > 0) {
     const names = document.querySelectorAll('.custom-brand-name');
     const prices = document.querySelectorAll('.custom-brand-price');
     names.forEach(i => i.value = state.customBranding.name);
     prices.forEach(i => i.value = state.customBranding.price);
     document.querySelectorAll('.custom-panel').forEach(p => p.classList.remove('hidden'));
  }
  
  if(input) {
      input.addEventListener('input', (e) => handleIndustrySearch(e.target.value));
  }
  if (state.industry && input) {
    input.value = state.industry;
    renderChips(getIndustryPages(state.industry));
  }
  renderActivePages();
}

function handleIndustrySearch(query) {
  let list = document.getElementById('industry-suggestions');
  // Create if doesn't exist (Fixing bug)
  if(!list && document.getElementById('industryInput')) {
      list = document.createElement('ul');
      list.id = 'industry-suggestions';
      list.className = 'autocomplete-list hidden';
      document.getElementById('industryInput').parentNode.appendChild(list);
  }

  if (!query || !list) { if(list) list.classList.add('hidden'); return; }
  const matches = Object.keys(INDUSTRY_DB).filter(key => key.toLowerCase().includes(query.toLowerCase()));
  list.innerHTML = '';
  if (matches.length > 0) {
    list.classList.remove('hidden');
    matches.forEach(match => {
      const li = document.createElement('li');
      li.textContent = match;
      li.onclick = () => selectIndustry(match);
      list.appendChild(li);
    });
  } else { list.classList.add('hidden'); }
}

function selectIndustry(industryName) {
  document.getElementById('industryInput').value = industryName;
  state.industry = industryName;
  const list = document.getElementById('industry-suggestions');
  if(list) list.classList.add('hidden');
  renderChips(getIndustryPages(industryName));
  saveState();
}

function getIndustryPages(industryName) {
  return (INDUSTRY_DB[industryName]) ? INDUSTRY_DB[industryName].pages : [];
}

function renderChips(pages) {
  const container = document.getElementById('suggestionChips');
  if (!container) return;
  container.innerHTML = '';
  if(pages.length === 0) {
      container.innerHTML = '<span style="opacity:0.5; font-style:italic;">Type an industry...</span>';
      return;
  }
  pages.forEach(page => {
    const chip = document.createElement('div');
    chip.className = 'suggestion-chip';
    if (state.pages.includes(page)) chip.classList.add('added');
    chip.textContent = `+ ${page}`;
    chip.onclick = () => addPage(page);
    container.appendChild(chip);
  });
}

function addPage(nameRaw) {
  const input = document.getElementById('customPageInput');
  const name = nameRaw || (input ? input.value.trim() : '');
  if (!name) return;
  if (!state.pages.includes(name)) {
    state.pages.push(name);
    if (!state.pagePlans[name]) state.pagePlans[name] = {};
    state.pagePlans[name].grid = convertListToGrid(getDefaultLayoutForPage(name));
    
    if (input) input.value = '';
    renderActivePages();
    if (state.industry) renderChips(getIndustryPages(state.industry));
    calculateTotal();
    saveState();
  }
}

function removePage(name) {
  state.pages = state.pages.filter(p => p !== name);
  renderActivePages();
  if (state.industry) renderChips(getIndustryPages(state.industry));
  calculateTotal();
  saveState();
}

function renderActivePages() {
  const list = document.getElementById('activePagesList');
  const countEl = document.getElementById('pageCountDisplay');
  const warning = document.getElementById('pageLimitWarning');
  if (!list || !state.package) return;
  list.innerHTML = '';
  state.pages.forEach((page, index) => {
    const tag = document.createElement('div');
    tag.className = 'page-tag';
    tag.innerHTML = `${page} <span class="page-tag-remove" onclick="removePage('${page}')">&times;</span>`;
    list.appendChild(tag);
  });
  
  const limit = state.package.limit;
  const current = state.pages.length;
  if (countEl) countEl.textContent = `${current}/${limit}`;
  if (current > limit) {
    const extra = current - limit;
    const cost = extra * state.package.extraPageCost;
    warning.innerHTML = `You are ${extra} page(s) over your limit. Added cost: <strong>$${cost}</strong>`;
    warning.classList.add('visible');
  } else { warning.classList.remove('visible'); }
}

function updatePageBuilderUI() { renderActivePages(); }

// --- REQUIREMENT 5: CONSISTENT ESTIMATE LOGIC ---
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
  
  // Updates both the floating widget and the Step 4 Final Invoice
  const totalEls = ['fw-header-total', 'fw-full-total', 'final-invoice-total'];
  totalEls.forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = `$${total.toLocaleString()}`;
  });

  const depEls = ['fw-deposit', 'final-invoice-deposit'];
  depEls.forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = `$${(total / 2).toLocaleString()}`;
  });
}

// ======================================================
// --- 4. STEP 3: VISUAL LAYOUT BUILDER (UPDATED) ---
// ======================================================

function initStep3() {
  if (!document.body.classList.contains('step3')) return;
  const container = document.getElementById('planContainer');
  container.innerHTML = ''; 
  renderVisualLayoutBuilder(container); 
}

function renderVisualLayoutBuilder(container) {
  state.pages.forEach((page, index) => {
    if(!state.pagePlans[page]) state.pagePlans[page] = {};
    if (!state.pagePlans[page].grid || state.pagePlans[page].grid.length === 0) {
      state.pagePlans[page].grid = convertListToGrid(getDefaultLayoutForPage(page));
    }
    
    if(!state.viewMode) state.viewMode = {};
    if(!state.viewMode[page]) state.viewMode[page] = 'desktop';

    const gridId = `grid-canvas-${index}`;
    const previewId = `preview-area-${index}`;
    const fileListId = `file-list-${index}`;
    const titleId = `editor-title-${index}`;
    
    // Requirement 4: Dropdown Generation
    const layoutSelectorHtml = generateLayoutSelector(page);

    const html = `
      <div class="plan-card collapsed" data-page="${page}">
        <div class="plan-card-header">
            <div class="plan-card-title-group" onclick="togglePlanCard(this)">
                <span class="plan-card-chevron">▼</span>
                <span>${index + 1}. ${page}</span>
            </div>
            <div class="layout-selector-wrapper">
                <select class="layout-select" onchange="switchPageLayout('${page}', this.value)">
                    <option value="" disabled selected>Load Layout...</option>
                    ${layoutSelectorHtml}
                </select>
            </div>
        </div>
        
        <div class="plan-card-body">
          <div class="builder-layout-container">
            <div class="editor-pane">
               <div class="editor-header">
                 <span id="${titleId}">Wireframe Editor</span>
                 <button class="btn-dashed" style="width:auto; margin:0; padding:5px 10px;" onclick="openBlockLibrary('${page}', '${gridId}')">+ Add Element</button>
               </div>
               <div class="grid-canvas" id="${gridId}"></div>
            </div>
            
            <div class="preview-pane" id="${previewId}" onclick="toggleViewMode('${page}', ${index})"></div>
          </div>
          <div style="margin-top:30px; border-top:1px solid var(--border-light); padding-top:20px;">
              <label>Content Notes</label>
              <textarea rows="3" oninput="savePageNote('${page}', this.value)">${state.pagePlans[page].notes || ''}</textarea>
          </div>
          <div style="margin-top:20px;">
              <label>Page Assets</label>
              <div class="file-upload-wrapper">
                 <label for="file-input-${index}" class="custom-file-upload"><span>📂 Upload Assets</span></label>
                 <input id="file-input-${index}" type="file" multiple onchange="handlePageFileUpload('${page}', this, '${fileListId}')" />
              </div>
              <div id="${fileListId}" class="mini-file-list"></div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    setTimeout(() => {
        refreshPageBuilderUI(page, index);
        renderPageFileList(page, fileListId);
    }, 100);
  });
}

// --- REQUIREMENT 2: EDITABLE VIEWS ---
function toggleViewMode(page, index) {
    if(!state.viewMode) state.viewMode = {};
    const current = state.viewMode[page] || 'desktop';
    state.viewMode[page] = (current === 'desktop') ? 'mobile' : 'desktop';
    refreshPageBuilderUI(page, index);
    saveState();
}

function getDefaultLayoutForPage(pageName) {
  if (state.industry && INDUSTRY_DB[state.industry] && INDUSTRY_DB[state.industry].layouts[pageName]) {
    const layoutID = INDUSTRY_DB[state.industry].layouts[pageName];
    if (LAYOUT_DEFINITIONS[layoutID]) return [...LAYOUT_DEFINITIONS[layoutID]];
  }
  return [...LAYOUT_DEFINITIONS["default"]];
}

function convertListToGrid(listItems) {
    return listItems.map((item, index) => ({
        id: `block-${Date.now()}-${index}`,
        name: item.name || item, 
        x: item.x || 1, 
        y: item.y || (1 + (index * 2)), 
        w: item.w || 12, 
        h: item.h || 2
    }));
}

// --- REQUIREMENT 4: CATEGORIZED DROPDOWN ---
function generateLayoutSelector(currentPageName) {
    let options = `<optgroup label="Industry Recommended">`;
    const matches = [];
    Object.entries(INDUSTRY_DB).forEach(([indName, data]) => {
        if (data.pages.includes(currentPageName)) {
            matches.push({ industry: indName, layoutId: data.layouts[currentPageName] });
        }
    });
    matches.forEach(m => { options += `<option value="${m.layoutId}">${m.layoutId}</option>`; });
    options += `</optgroup><optgroup label="All Templates">`;
    Object.keys(LAYOUT_DEFINITIONS).forEach(key => {
        options += `<option value="${key}">${key}</option>`;
    });
    options += `</optgroup>`;
    return options;
}

function switchPageLayout(pageName, layoutId) {
    if(!layoutId) return;
    state.pagePlans[pageName].grid = convertListToGrid(LAYOUT_DEFINITIONS[layoutId]);
    const index = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, index);
    saveState();
}

function refreshPageBuilderUI(pageName, index) {
    const gridId = `grid-canvas-${index}`;
    const previewId = `preview-area-${index}`;
    const titleId = `editor-title-${index}`;
    
    const gridContainer = document.getElementById(gridId);
    const previewContainer = document.getElementById(previewId);
    const titleEl = document.getElementById(titleId);
    
    if(!gridContainer || !previewContainer) return;

    gridContainer.innerHTML = '';
    const mode = (state.viewMode && state.viewMode[pageName]) ? state.viewMode[pageName] : 'desktop';

    // Toggle the editor mode class
    gridContainer.className = `grid-canvas ${mode}-mode-active`;

    if(titleEl) titleEl.textContent = mode === 'desktop' ? "Desktop Wireframe (Editable)" : "Mobile Wireframe (Editable)";

    const blocks = state.pagePlans[pageName].grid || [];

    // Render blocks
    blocks.forEach((block, idx) => {
        const info = BLOCK_TYPES[block.name] || { icon: "📦", type: "generic" };
        const el = document.createElement('div');
        el.className = `grid-item block-type-${info.type}`;
        el.id = block.id;
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
        setupFreeInteraction(el, pageName, idx, index);
        gridContainer.appendChild(el);
    });

    // Render Preview Pane (Show the opposite of what is being edited)
    if(mode === 'desktop') {
        let previewHtml = `<div class="mobile-frame"><div class="mobile-screen"><h5 style="text-align:center;">Mobile Preview</h5>`;
        blocks.forEach(b => previewHtml += `<div style="background:#eee; margin:5px 0; padding:5px; font-size:0.7rem; text-align:center;">${b.name}</div>`);
        previewHtml += `</div></div>`;
        previewContainer.innerHTML = previewHtml;
    } else {
        previewContainer.innerHTML = `<div class="desktop-frame"><div class="desktop-screen"><span>Desktop Preview Mode</span></div><div class="desktop-stand"></div></div>`;
    }
}

// --- REQUIREMENT 3: SNAP-TO-PLACE & COLLISION DETECTION ---
function setupFreeInteraction(element, pageName, index, pageIndex) {
    const container = document.getElementById(`grid-canvas-${pageIndex}`);
    let startX, startY, startGridX, startGridY;
    
    element.addEventListener('mousedown', (e) => {
        if(e.target.classList.contains('grid-resize-handle') || e.target.classList.contains('grid-remove')) return;
        
        e.preventDefault();
        element.classList.add('interacting');
        
        const rect = container.getBoundingClientRect();
        // Calculate cell size dynamically based on current width (desktop vs mobile)
        const colWidth = rect.width / 12; 
        const rowHeight = 60; 

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
            
            const finalStyle = window.getComputedStyle(element);
            const potentialX = parseInt(finalStyle.gridColumnStart);
            const potentialY = parseInt(finalStyle.gridRowStart);
            
            // Check collision with other blocks
            if(checkOverlap(pageName, blockData.id, potentialX, potentialY, blockData.w, blockData.h)) {
                // If overlap, snap back to original
                element.style.gridColumnStart = startGridX;
                element.style.gridRowStart = startGridY;
                alert("Cannot place element here: Space occupied.");
            } else {
                state.pagePlans[pageName].grid[index].x = potentialX;
                state.pagePlans[pageName].grid[index].y = potentialY;
            }
            saveState();
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    });

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
             state.pagePlans[pageName].grid[index].w = parseInt(element.style.gridColumnEnd.replace('span ',''));
             state.pagePlans[pageName].grid[index].h = parseInt(element.style.gridRowEnd.replace('span ',''));
             saveState();
             window.removeEventListener('mousemove', onResize);
             window.removeEventListener('mouseup', onEndResize);
        };

        window.addEventListener('mousemove', onResize);
        window.addEventListener('mouseup', onEndResize);
    });
}

function openBlockLibrary(pageName, gridId) {
    const pageIndex = gridId.split('-')[2];
    const existing = document.querySelector('.block-library-overlay');
    if(existing) existing.remove();

    const overlay = document.createElement('div');
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
    const maxY = grid.length > 0 ? Math.max(...grid.map(b => b.y + b.h)) : 1;
    grid.push({
        id: `block-${Date.now()}`,
        name: blockName,
        x: 1, y: maxY, w: 12, h: 2
    });
    document.querySelector('.block-library-overlay').remove();
    refreshPageBuilderUI(pageName, pageIndex);
    saveState();
}

function removeBlock(pageName, id) {
    state.pagePlans[pageName].grid = state.pagePlans[pageName].grid.filter(b => b.id !== id);
    const idx = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, idx);
    saveState();
}

function handlePageFileUpload(pageName, input, listId) {
  if (input.files && input.files.length > 0) {
    if (!pageAttachments[pageName]) pageAttachments[pageName] = [];
    Array.from(input.files).forEach(f => pageAttachments[pageName].push(f));
    renderPageFileList(pageName, listId);
  }
}

function renderPageFileList(pageName, listId) {
  const container = document.getElementById(listId);
  if (!container) return;
  container.innerHTML = '';
  const files = pageAttachments[pageName] || [];
  if (files.length === 0) {
    container.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); text-align:center;">No files attached</div>';
    return;
  }
  files.forEach((file, i) => {
    const div = document.createElement('div');
    div.className = 'page-file-item';
    div.innerHTML = `<span>📎 ${file.name}</span>`;
    const delBtn = document.createElement('span');
    delBtn.innerHTML = '&times;';
    delBtn.className = 'delete-file-btn';
    delBtn.onclick = () => {
        pageAttachments[pageName].splice(i, 1);
        renderPageFileList(pageName, listId);
    };
    div.appendChild(delBtn);
    container.appendChild(div);
  });
}

function togglePlanCard(header) { header.closest('.plan-card').classList.toggle('collapsed'); }
function savePageNote(pageName, text) { state.pagePlans[pageName].notes = text; saveState(); }
function toggleBrandKit(element) { state.brandKit = !state.brandKit; calculateTotal(); updateBrandKitDisplay(); saveState(); }
function updateBrandKitDisplay() {
  document.querySelectorAll('.brand-kit-ref').forEach(bar => {
    const finalPriceEl = bar.querySelector('.bk-final-price');
    if (!finalPriceEl) return;
    const hasBundle = !!(state.package && state.package.brandKitBundlePrice);
    const displayPrice = hasBundle ? Number(state.package.brandKitBundlePrice) : BASE_BRAND_KIT_PRICE;
    finalPriceEl.textContent = `$${displayPrice.toLocaleString()}`;
    bar.classList.toggle('selected', !!state.brandKit);
  });
}
function toggleWidget() { document.getElementById('floating-widget').classList.toggle('collapsed'); }
function togglePackageDetails(buttonEl) { buttonEl.closest('.package-card').classList.toggle('expanded'); }
function initCollapsibles() {
  document.querySelectorAll('[data-collapsible]').forEach(section => {
    const header = section.querySelector('[data-collapsible-header]');
    if (!header || header.hasAttribute('data-has-listener')) return;
    header.setAttribute('data-has-listener', 'true');
    header.addEventListener('click', (e) => { e.preventDefault(); section.classList.toggle('collapsed'); });
  });
}

// --- REQUIREMENT 9: FINALIZATION SCRIPT ---
function handleFinalize(event) {
    event.preventDefault();
    const summary = {
        client: localStorage.getItem('clientName'),
        business: localStorage.getItem('businessName'),
        email: localStorage.getItem('clientEmail'),
        investment: document.getElementById('final-invoice-total').textContent,
        package: state.package,
        structure: state.pagePlans,
        notes: state.advancedNotes
    };

    console.log("FINAL SUMMARY GENERATED:", summary);
    alert(`Finalization Complete! An email summary has been sent to ${summary.email} and your project dashboard.`);
    // NOTE: This is where you would call emailjs.send() in a production environment
}

// --- REQUIREMENT 5 (HELPER) Render Final Invoice Items
window.renderFinalInvoice = function() {
    const list = document.getElementById('final-invoice-items');
    if(!list || !state.package) return;
    let html = `<div class="line-item"><span>${state.package.name} Package</span><span>$${state.package.price.toLocaleString()}</span></div>`;
    if(state.brandKit) html += `<div class="line-item"><span>Brand Kit</span><span>Included</span></div>`;
    if(state.customBranding.active) html += `<div class="line-item"><span>${state.customBranding.name}</span><span>$${state.customBranding.price}</span></div>`;
    list.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initCollapsibles();
  if (window.location.pathname.includes('step2')) {
    initPageBuilder();
    if(state.package) handlePackageSelected(true);
  }
  if (window.location.pathname.includes('step3')) initStep3();
  calculateTotal();
  updateBrandKitDisplay();
});
