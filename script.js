// ======================================================
// --- 1. DATA & CONFIGURATION ---
// ======================================================

const BASE_BRAND_KIT_PRICE = 500;

// VISUAL ICONS MAPPING
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

// --- UPDATED LAYOUT DEFINITIONS (Friendly Names) ---
// Structure: { name: "Block Name", x: Column(1-12), y: Row, w: Width(1-12), h: Height }
const LAYOUT_DEFINITIONS = {
  "Visual/Home": [ // Was L-01
    { name: "Hero: Full Screen Visual", x: 1, y: 1, w: 12, h: 5 },
    { name: "Intro Blurb", x: 2, y: 6, w: 10, h: 2 },
    { name: "Visual Gallery Grid", x: 1, y: 8, w: 12, h: 4 },
    { name: "Button / CTA", x: 4, y: 12, w: 6, h: 1 },
    { name: "Footer", x: 1, y: 13, w: 12, h: 2 }
  ],
  "Brand Story/About": [ // Was L-02
    { name: "Hero: Brand Story", x: 1, y: 1, w: 12, h: 4 },
    { name: "About the Founder", x: 1, y: 5, w: 6, h: 4 },
    { name: "Our Values", x: 7, y: 5, w: 6, h: 4 },
    { name: "Timeline/History", x: 1, y: 9, w: 12, h: 3 },
    { name: "Footer", x: 1, y: 12, w: 12, h: 2 }
  ],
  "Services/Pricing": [ // Was L-03
    { name: "Hero Section", x: 1, y: 1, w: 12, h: 3 },
    { name: "Pricing Tier 1", x: 1, y: 4, w: 4, h: 4 },
    { name: "Pricing Tier 2", x: 5, y: 4, w: 4, h: 4 },
    { name: "Pricing Tier 3", x: 9, y: 4, w: 4, h: 4 },
    { name: "Testimonials", x: 1, y: 8, w: 12, h: 2 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "Process/ZigZag": [ // Was L-04
    { name: "Service Overview", x: 1, y: 1, w: 12, h: 3 },
    { name: "Step 1: Consult", x: 1, y: 4, w: 6, h: 2 },
    { name: "Step 1 Image", x: 7, y: 4, w: 6, h: 2 },
    { name: "Step 2: Build", x: 7, y: 6, w: 6, h: 2 },
    { name: "Step 2 Image", x: 1, y: 6, w: 6, h: 2 },
    { name: "Footer", x: 1, y: 8, w: 12, h: 2 }
  ],
  "Contact/Location": [ // Was L-05
    { name: "Map/Location", x: 1, y: 1, w: 8, h: 6 },
    { name: "Address & Hours", x: 9, y: 1, w: 4, h: 3 },
    { name: "Social Media Links", x: 9, y: 4, w: 4, h: 3 },
    { name: "Contact Form", x: 1, y: 7, w: 12, h: 4 },
    { name: "Footer", x: 1, y: 11, w: 12, h: 2 }
  ],
  "default": [ // Basic Fallback
    { name: "Header/Nav", x: 1, y: 1, w: 12, h: 1 },
    { name: "Hero Section", x: 1, y: 2, w: 12, h: 4 },
    { name: "Text Content", x: 1, y: 6, w: 8, h: 3 },
    { name: "Image", x: 9, y: 6, w: 4, h: 3 },
    { name: "Footer", x: 1, y: 9, w: 12, h: 2 }
  ]
};

// --- INDUSTRY DATABASE (Updated references) ---
const INDUSTRY_DB = {
  "Restaurant": { pages: ["Home", "Menu", "Reservations"], layouts: { "Home": "Visual/Home", "Menu": "Services/Pricing", "Reservations": "Contact/Location" } },
  "Portfolio/Creative": { pages: ["Home", "Work", "About"], layouts: { "Home": "Visual/Home", "Work": "Visual/Home", "About": "Brand Story/About" } },
  "Service Business": { pages: ["Home", "Services", "Contact"], layouts: { "Home": "Process/ZigZag", "Services": "Services/Pricing", "Contact": "Contact/Location" } }
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
  viewMode: {}, // Stores 'desktop' or 'mobile' per page
  clientName: "",
  businessName: "",
  clientEmail: "",
  clientPhone: ""
};

// Store files in memory
const pageAttachments = {}; 

function saveState() {
  // Also save inputs from Step 1 if they exist on page
  const cName = document.getElementById('clientName');
  if(cName) state.clientName = cName.value;
  const bName = document.getElementById('businessName');
  if(bName) state.businessName = bName.value;
  
  localStorage.setItem('onboardingState', JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem('onboardingState');
  if (raw) Object.assign(state, JSON.parse(raw));
  
  // Restore Step 1 inputs if on Step 1
  if(document.getElementById('clientName')) document.getElementById('clientName').value = state.clientName || "";
  if(document.getElementById('businessName')) document.getElementById('businessName').value = state.businessName || "";
}

function nextStep(stepNumber) {
  saveState();
  window.location.href = `step${stepNumber}.html`;
}

// ======================================================
// --- 3. STEP 2 LOGIC ---
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
      let list = document.getElementById('industry-suggestions');
      if(!list) {
          list = document.createElement('ul');
          list.id = 'industry-suggestions';
          list.className = 'autocomplete-list hidden';
          input.parentNode.style.position = 'relative';
          input.parentNode.appendChild(list);
      }
      input.addEventListener('input', (e) => handleIndustrySearch(e.target.value));
      document.addEventListener('click', (e) => {
          if (e.target !== input && e.target !== list) list.classList.add('hidden');
      });
  }
  if (state.industry && input) {
    input.value = state.industry;
    renderChips(getIndustryPages(state.industry));
  }
  renderActivePages();
}

function handleIndustrySearch(query) {
  const list = document.getElementById('industry-suggestions');
  if (!query) { list.classList.add('hidden'); return; }
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

// Added alias to ensure button click works
window.generateSuggestions = handleIndustrySearch;

function selectIndustry(industryName) {
  document.getElementById('industryInput').value = industryName;
  state.industry = industryName;
  document.getElementById('industry-suggestions').classList.add('hidden');
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
    tag.draggable = true;
    tag.innerHTML = `<span class="drag-handle">::</span> ${page} <span class="page-tag-remove" onclick="removePage('${page}')">&times;</span>`;
    
    tag.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index);
      tag.classList.add('dragging');
    });
    tag.addEventListener('dragend', () => tag.classList.remove('dragging'));
    tag.addEventListener('dragover', (e) => e.preventDefault());
    tag.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const toIndex = index;
      if (fromIndex !== toIndex) {
        const item = state.pages.splice(fromIndex, 1)[0];
        state.pages.splice(toIndex, 0, item);
        renderActivePages();
        saveState();
      }
    });

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

function calculateTotal() {
  // Try finding elements on current page (works for step 2, 3, 4)
  const fwItems = document.getElementById('fw-items') || document.getElementById('final-invoice-items');
  const fwTotal = document.getElementById('fw-full-total') || document.getElementById('final-invoice-total');
  const fwDeposit = document.getElementById('fw-deposit') || document.getElementById('final-invoice-deposit');
  const headerTotalEl = document.getElementById('fw-header-total');

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
  state.addons.forEach(addon => {
    html += `<div class="fw-item"><span>+ ${addon.name}</span><span>$${Number(addon.price).toLocaleString()}</span></div>`;
    total += Number(addon.price) || 0;
  });

  if (!html) html = '<p class="empty-state">Select a package to start...</p>';
  
  fwItems.innerHTML = html;
  if (headerTotalEl) headerTotalEl.textContent = `$${total.toLocaleString()}`;
  if (fwTotal) fwTotal.textContent = `$${total.toLocaleString()}`;
  if (fwDeposit) fwDeposit.textContent = `$${(total / 2).toLocaleString()}`;
}

// ======================================================
// --- 4. STEP 3: VISUAL LAYOUT BUILDER (UPDATED) ---
// ======================================================

function initStep3() {
  if (!document.body.classList.contains('step3')) return;
  const container = document.getElementById('planContainer');
  const pkgId = state.package ? state.package.id : 'basic';
  container.innerHTML = ''; 
  
  if (pkgId === 'basic') {
    const sortableList = document.createElement('div');
    sortableList.id = 'sortable-list';
    container.appendChild(sortableList);
    renderBasicPlan(sortableList);
  } 
  else {
    renderVisualLayoutBuilder(container); 
  }

  injectDownloadButton();
}

function renderVisualLayoutBuilder(container) {
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Drag & Drop Wireframe Tool. Drag elements to swap positions. Click Mobile to toggle views.</p></div>`;
  container.insertAdjacentHTML('beforebegin', intro);

  state.pages.forEach((page, index) => {
    if(!state.pagePlans[page]) state.pagePlans[page] = {};
    if (!state.pagePlans[page].grid || state.pagePlans[page].grid.length === 0) {
      state.pagePlans[page].grid = convertListToGrid(getDefaultLayoutForPage(page));
    }
    
    // Set default view mode to desktop
    if(!state.viewMode) state.viewMode = {};
    if(!state.viewMode[page]) state.viewMode[page] = 'desktop';

    const gridId = `grid-canvas-${index}`;
    const previewId = `preview-area-${index}`;
    const fileListId = `file-list-${index}`;
    const titleId = `editor-title-${index}`;
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
                 <span id="${titleId}">Desktop Wireframe</span>
                 <button class="btn-dashed" style="width:auto; margin:0; padding:5px 10px;" onclick="openBlockLibrary('${page}', '${gridId}')">+ Add Element</button>
               </div>
               <div class="grid-canvas" id="${gridId}"></div>
            </div>
            
            <div class="preview-pane" id="${previewId}" onclick="toggleViewMode('${page}', ${index})">
              </div>

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

// Convert Layout Data (with coordinates) to Grid Objects
function convertListToGrid(listItems) {
    return listItems.map((item, index) => ({
        id: `block-${Date.now()}-${index}`,
        name: item.name || item, // Support both string and object
        x: item.x || 1, 
        y: item.y || (1 + (index * 2)), 
        w: item.w || 12, 
        h: item.h || 2
    }));
}

// Updated Generator with Separators and Category Names
function generateLayoutSelector(currentPageName) {
    let options = `<optgroup label="Generic"><option value="default">Default Basic</option></optgroup>`;
    
    // Thin line separator using disabled option
    options += `<option disabled>────────────────</option>`;

    const matches = [];
    Object.entries(INDUSTRY_DB).forEach(([indName, data]) => {
        if (data.pages.includes(currentPageName)) {
            matches.push({ industry: indName, layoutId: data.layouts[currentPageName] });
        }
    });
    if (matches.length > 0) {
        options += `<optgroup label="Suggested for ${currentPageName}">`;
        matches.forEach(m => { options += `<option value="${m.layoutId}">${m.industry} / ${currentPageName}</option>`; });
        options += `</optgroup>`;
        options += `<option disabled>────────────────</option>`;
    }
    options += `<optgroup label="All Layouts">`;
    Object.entries(LAYOUT_DEFINITIONS).forEach(([lid, blocks]) => {
        if (lid !== 'default') {
            options += `<option value="${lid}">${lid} (${blocks.length} blocks)</option>`;
        }
    });
    options += `</optgroup>`;
    return options;
}

function switchPageLayout(pageName, layoutId) {
    if(!layoutId) return;
    const choice = confirm("Replace current layout?");
    let newBlocksRaw = LAYOUT_DEFINITIONS[layoutId] || LAYOUT_DEFINITIONS['default'];
    let newGridBlocks = convertListToGrid(newBlocksRaw);

    if (choice) {
        state.pagePlans[pageName].grid = newGridBlocks;
    } else {
        const currentBlocks = state.pagePlans[pageName].grid;
        // Find bottom most block to append after
        const maxY = currentBlocks.length > 0 ? Math.max(...currentBlocks.map(b => b.y + b.h)) : 1;
        newGridBlocks = newGridBlocks.map(b => ({ ...b, y: b.y + maxY })); 
        state.pagePlans[pageName].grid = [...currentBlocks, ...newGridBlocks];
    }
    
    const index = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, index);
    saveState();
}

// --- RENDER FUNCTIONS (Removed Hover Text, Fixed Interaction) ---
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

    // Update Title Label
    if(titleEl) titleEl.textContent = mode === 'desktop' ? "Desktop Wireframe" : "Mobile Wireframe";

    const blocks = state.pagePlans[pageName].grid || [];
    const sortedBlocks = [...blocks].sort((a,b) => a.y - b.y);

    // --- Render Grid Items ---
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

    // --- Render Preview (Opposite of Current Mode) ---
    // Note: REMOVED the "Switch to..." overlay hint text as requested
    if(mode === 'desktop') {
        // Render Mobile Preview
        let previewHtml = `
          <div class="mobile-frame">
             <div class="mobile-notch"></div>
             <div class="mobile-screen">`;
        
        sortedBlocks.forEach(block => {
            const info = BLOCK_TYPES[block.name] || { icon: "📦" };
            previewHtml += `<div class="mobile-block ${info.type === 'button' ? 'mobile-block-button' : ''}">
               <span class="mobile-block-icon">${info.icon}</span> <span>${block.name}</span>
            </div>`;
        });
        
        previewHtml += `</div></div>`; // Removed overlay text
        previewContainer.innerHTML = previewHtml;
    } else {
        // Render Desktop Preview
        previewContainer.innerHTML = `
          <div class="desktop-frame">
              <div class="desktop-screen" style="display:flex; align-items:center; justify-content:center; background:#111; color:#555;">
                  <span style="font-size:0.8rem; text-transform:uppercase;">Desktop Preview Active</span>
              </div>
              <div class="desktop-stand"></div>
          </div>
        `; // Removed overlay text
    }
}

// --- INTERACTION: DRAG & SWAP + NO STACKING ---
function findOverlappingBlock(pageName, movingId, x, y, w, h) {
    const blocks = state.pagePlans[pageName].grid;
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.id === movingId) continue; 
        
        // Strict overlap detection
        if (x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y) {
            return i; 
        }
    }
    return -1;
}

function setupFreeInteraction(element, pageName, index, pageIndex) {
    const container = document.getElementById(`grid-canvas-${pageIndex}`);
    let startX, startY, startGridX, startGridY;
    let originalGridX, originalGridY; 
    
    element.addEventListener('mousedown', (e) => {
        if(e.target.classList.contains('grid-resize-handle') || e.target.classList.contains('grid-remove')) return;
        
        e.preventDefault();
        element.classList.add('interacting');
        
        const rect = container.getBoundingClientRect();
        const colWidth = rect.width / 12; 
        const rowHeight = 60; 

        startX = e.clientX;
        startY = e.clientY;
        const blockData = state.pagePlans[pageName].grid[index];
        startGridX = blockData.x;
        startGridY = blockData.y;
        originalGridX = blockData.x;
        originalGridY = blockData.y;

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
            
            // Check Collision for SWAP Logic or Snap prevention
            let overlappedIdx = findOverlappingBlock(pageName, blockData.id, potentialX, potentialY, blockData.w, blockData.h);
            
            if (overlappedIdx !== -1) {
                // Perform Swap if clean overlap, otherwise standard swap strategy
                const targetBlock = state.pagePlans[pageName].grid[overlappedIdx];
                
                // Swap coordinates
                state.pagePlans[pageName].grid[overlappedIdx].x = originalGridX;
                state.pagePlans[pageName].grid[overlappedIdx].y = originalGridY;
                
                state.pagePlans[pageName].grid[index].x = potentialX;
                state.pagePlans[pageName].grid[index].y = potentialY;

                // Double check if the swapped items now overlap something else (recursive safety)
                // For simplicity, we assume swap resolves it. 
            } else {
                state.pagePlans[pageName].grid[index].x = potentialX;
                state.pagePlans[pageName].grid[index].y = potentialY;
            }

            // Final safety pass to ensure no stacking (Prevent piling on top)
            // If the drop resulted in an overlap we didn't catch (e.g. multi-block), push down
            // For now, the swap logic usually handles the primary interaction.

            saveState();
            refreshPageBuilderUI(pageName, pageIndex);
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
             const spanW = parseInt(element.style.gridColumnEnd.replace('span ',''));
             const spanH = parseInt(element.style.gridRowEnd.replace('span ',''));
             
             state.pagePlans[pageName].grid[index].w = spanW;
             state.pagePlans[pageName].grid[index].h = spanH;
             saveState();
             refreshPageBuilderUI(pageName, pageIndex);
             window.removeEventListener('mousemove', onResize);
             window.removeEventListener('mouseup', onEndResize);
        };

        window.addEventListener('mousemove', onResize);
        window.addEventListener('mouseup', onEndResize);
    });
}

function openBlockLibrary(pageName, gridId) {
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
    const maxY = grid.length > 0 ? Math.max(...grid.map(b => b.y + b.h)) : 1;
    
    grid.push({
        id: `block-${Date.now()}`,
        name: blockName,
        x: 1, y: maxY, w: 12, h: 2
    });
    
    document.getElementById('lib-modal').remove();
    refreshPageBuilderUI(pageName, pageIndex);
    saveState();
}

function removeBlock(pageName, id) {
    state.pagePlans[pageName].grid = state.pagePlans[pageName].grid.filter(b => b.id !== id);
    const idx = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, idx);
    saveState();
}

// --- BASIC PLAN LOGIC (Restored) ---
function renderBasicPlan(container) {
  state.pages.forEach((page, index) => {
    if(!state.pagePlans[page]) state.pagePlans[page] = {};
    const noteVal = state.pagePlans[page].notes || '';
    const fileListId = `file-list-${index}`;
    
    const html = `
      <div class="plan-card collapsed" draggable="true" data-page-name="${page}">
        <div class="plan-card-header" onclick="togglePlanCard(this)">
            <div class="plan-card-title-group">
                <span class="plan-card-chevron">▼</span>
                <span>${index + 1}. ${page}</span>
            </div>
            <div class="drag-handle">☰</div>
        </div>
        <div class="plan-card-body">
          <label>Page Goals & Content Notes</label>
          <textarea rows="5" oninput="savePageNote('${page}', this.value)" placeholder="What should be on this page?">${noteVal}</textarea>
          
          <div style="margin-top:20px;">
              <label>Page Assets</label>
              <div class="file-upload-wrapper">
                 <label for="file-input-${index}" class="custom-file-upload">
                   <span>📂 Upload Assets</span>
                 </label>
                 <input id="file-input-${index}" type="file" multiple onchange="handlePageFileUpload('${page}', this, '${fileListId}')" />
              </div>
              <div id="${fileListId}" class="mini-file-list"></div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    setTimeout(() => renderPageFileList(page, fileListId), 50);
  });
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

function togglePlanCard(header) {
  const card = header.closest('.plan-card');
  card.classList.toggle('collapsed');
}

function savePageNote(pageName, text) {
  if(!state.pagePlans[pageName]) state.pagePlans[pageName] = {};
  state.pagePlans[pageName].notes = text;
  saveState();
}

function toggleBrandKit(element) {
  state.brandKit = !state.brandKit;
  document.querySelectorAll('.brand-kit-ref').forEach(el => { el.classList.toggle('selected', state.brandKit); });
  calculateTotal(); updateBrandKitDisplay(); saveState();
}

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

function toggleWidget() {
  const widget = document.getElementById('floating-widget');
  if (widget) widget.classList.toggle('collapsed');
}

function togglePackageDetails(buttonEl) {
  const card = buttonEl.closest('.package-card');
  if (card) {
    const expanded = card.classList.toggle('expanded');
    buttonEl.textContent = expanded ? 'Close Details' : 'View Details';
  }
}

function initCollapsibles() {
  const sections = document.querySelectorAll('[data-collapsible]');
  sections.forEach(section => {
    const header = section.querySelector('[data-collapsible-header]');
    if (!header || header.hasAttribute('data-has-listener')) return;
    header.setAttribute('data-has-listener', 'true');
    header.addEventListener('click', (e) => {
      e.preventDefault();
      section.classList.toggle('collapsed');
    });
  });
}

function injectDownloadButton() {
  const existingBtn = document.getElementById('globalDownloadBtn');
  if(existingBtn) existingBtn.remove();
  const navContainer = document.querySelector('.step-nav-buttons');
  if(navContainer) {
    const btn = document.createElement('button');
    btn.id = 'globalDownloadBtn';
    btn.className = 'btn-download-all';
    btn.textContent = 'Download Project Outline';
    btn.onclick = downloadProjectOutline;
    navContainer.insertBefore(btn, navContainer.lastElementChild);
  }
}

// ======================================================
// --- 5. FINALIZATION & STEP 4 LOGIC (New) ---
// ======================================================

function initStep4() {
  if (!document.body.classList.contains('step4')) return;

  // 1. Inject Steps Header if missing (Restores navigation)
  const headerContainer = document.querySelector('.progress-header');
  if (headerContainer && !headerContainer.innerHTML.trim().includes('step-indicator')) {
      headerContainer.innerHTML = `
        <div class="progress-bar">
          <div class="progress-line-bg"></div>
          <div class="progress-line-fill" style="width:100%;"></div>
          <div class="step-indicator completed">1 <div class="step-label">Goals</div></div>
          <div class="step-indicator completed">2 <div class="step-label">Structure</div></div>
          <div class="step-indicator completed">3 <div class="step-label">Plan</div></div>
          <div class="step-indicator active">4 <div class="step-label">Finalize</div></div>
        </div>
      `;
  }

  // 2. Styling Fix: Ensure invoice box has dark mode style to match site
  const invoiceBox = document.querySelector('.invoice-box');
  if (invoiceBox) {
      invoiceBox.style.background = 'var(--surface-base)';
      invoiceBox.style.border = '1px solid var(--border-light)';
      invoiceBox.style.borderRadius = '12px';
      invoiceBox.style.padding = '30px';
      invoiceBox.style.marginTop = '20px';
      invoiceBox.style.marginBottom = '30px';
  }
  
  // 3. Render Invoice Data
  calculateTotal(); // This will populate #final-invoice-items if IDs match

  // 4. Inject & Auto-Fill Billing Form
  const form = document.getElementById('finalizeForm');
  if (form) {
      // Create inputs if they don't exist in HTML
      if (!document.getElementById('billingName')) {
          const billingHtml = `
            <div class="form-grid" style="margin-bottom:30px;">
                <h4 class="full-width" style="margin-top:0;">Billing Details</h4>
                <div>
                  <label>Full Name</label>
                  <input type="text" id="billingName" required />
                </div>
                <div>
                  <label>Business Name</label>
                  <input type="text" id="billingBusiness" />
                </div>
                <div class="full-width">
                  <label>Billing Email</label>
                  <input type="email" id="billingEmail" required />
                </div>
            </div>
          `;
          form.insertAdjacentHTML('afterbegin', billingHtml);
      }

      // Auto-Fill Logic
      document.getElementById('billingName').value = state.clientName || "";
      document.getElementById('billingBusiness').value = state.businessName || "";
      document.getElementById('billingEmail').value = state.clientEmail || "";
  }
}

function handleFinalize(event) {
    event.preventDefault();
    
    // Save Billing Info
    state.billing = {
        name: document.getElementById('billingName').value,
        business: document.getElementById('billingBusiness').value,
        email: document.getElementById('billingEmail').value
    };
    saveState();

    // Generate Summary Content
    const summary = JSON.stringify(state, null, 2);
    const blob = new Blob([summary], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Trigger Download
    const a = document.createElement('a');
    a.href = url;
    a.download = `Project_Summary_${state.clientName.replace(/ /g,'_')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Mailto Link (Simulated Email)
    const subject = `Project Kickoff: ${state.businessName}`;
    const body = `Hi! I'm ready to start. Please find my project summary attached (check your downloads folder).\n\nTotal Estimated: $${document.getElementById('final-invoice-total').innerText}\n\nClient: ${state.clientName}`;
    window.location.href = `mailto:youremail@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    alert("Project Finalized! A summary file has been downloaded for your records. Please attach this file to the email that just opened.");
}

// Global Download Function (Helper)
function downloadProjectOutline() {
    const text = `
    PROJECT OUTLINE
    ================
    Client: ${state.clientName}
    Business: ${state.businessName}
    
    PACKAGE: ${state.package ? state.package.name : 'None'}
    PAGES: ${state.pages.join(', ')}
    
    PLANNING NOTES:
    ${Object.keys(state.pagePlans).map(p => `\n--- ${p} ---\n${state.pagePlans[p].notes || 'No notes'}`).join('')}
    `;
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Project_Outline.txt";
    document.body.appendChild(a);
    a.click();
}


document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initCollapsibles();
  if (window.location.pathname.includes('step2')) {
    initPageBuilder();
    if(state.package) handlePackageSelected(true);
  }
  if (window.location.pathname.includes('step3')) initStep3();
  
  // New Step 4 Init
  if (window.location.pathname.includes('step4')) initStep4();

  calculateTotal();
  updateBrandKitDisplay();
});

// --- CSS STYLES FOR GRID SYSTEM (Injected) ---
const style = document.createElement('style');
style.innerHTML = `
  /* Autocomplete */
  .autocomplete-list { position: absolute; top: 100%; left: 0; right: 0; background: #0f1322; border: 1px solid var(--border-light); max-height: 200px; overflow-y: auto; list-style: none; padding: 0; z-index:1000; }
  .autocomplete-list li { padding: 10px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .autocomplete-list li:hover { background: var(--surface-hover); color: var(--accent-blue); }

  /* Grid Canvas */
  .grid-canvas {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 50px;
    gap: 10px;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 100% 50px, 8.33% 100%;
    background-color: rgba(0,0,0,0.1); 
    border: 1px solid var(--border-light);
    border-radius: 8px;
    padding: 10px;
    min-height: 300px;
    position: relative;
    user-select: none;
  }
  
  .grid-item {
    background: var(--surface-base);
    border: 1px solid var(--border-light);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    touch-action: none; 
    transition: box-shadow 0.2s, opacity 0.2s;
  }
  
  .grid-item.interacting {
    z-index: 100;
    box-shadow: 0 0 15px rgba(44,166,224,0.5);
    border-color: var(--accent-blue);
    opacity: 0.9;
  }

  .grid-item-content {
    width: 100%; height: 100%;
    display: flex; align-items: center; padding: 0 10px;
  }

  .grid-drag-handle { cursor: grab; margin-right: 8px; color: var(--text-muted); padding: 10px 5px; }
  .grid-label { flex-grow: 1; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none;}
  .grid-remove { cursor: pointer; color: #ff6b6b; padding: 5px; z-index: 10; }
  
  .grid-resize-handle {
    position: absolute; bottom: 0; right: 0;
    width: 15px; height: 15px;
    background: linear-gradient(135deg, transparent 50%, var(--text-muted) 50%);
    cursor: se-resize;
    z-index: 5;
  }

  /* Layout Selector */
  .layout-selector-wrapper { margin-left: auto; padding-left: 10px; }
  .layout-select {
    background: #050508; color: #fff; border: 1px solid var(--border-light);
    padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; max-width: 150px;
  }

  /* Modal */
  .block-library-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; justify-content: center; align-items: center; }
  .block-library-modal { background: #0f1322; padding: 30px; border-radius: 12px; width: 90%; max-width: 600px; border: 1px solid var(--accent-blue); }
  .library-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; max-height: 400px; overflow-y: auto; }
  .library-option { padding: 15px; background: var(--surface-base); border: 1px solid var(--border-light); border-radius: 6px; cursor: pointer; text-align: center; }
  .library-option:hover { background: var(--accent-blue); color: white; }
  .btn-close-modal { background: transparent; border: 1px solid var(--border-light); color: var(--text-muted); padding: 8px 16px; cursor: pointer; float: right; border-radius: 4px; }
`;
document.head.appendChild(style);
