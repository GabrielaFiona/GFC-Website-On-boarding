// ======================================================
// --- 1. USER DATA SOURCE (https://docs.google.com/spreadsheets/d/1L9Nic5O9H7ihnjFVoScWl_r1FFFn4-Sjdd_kCQYrA3k/edit?usp=sharing) ---
// ======================================================

// This replaces the old suggestion system. 
// "pages": The suggested sitemap.
// "layouts": The default blocks for those pages.
const INDUSTRY_DB = {
  "Restaurant": {
    pages: ["Home", "Menu", "Reservations", "Events", "Contact"],
    layouts: {
      "Home": ["Hero: Food Visuals", "Intro: Atmosphere", "Featured Dishes", "Testimonials", "Map & Hours", "Footer"],
      "Menu": ["Menu Categories", "Starters List", "Mains List", "Desserts List", "PDF Download Link", "Footer"],
      "Reservations": ["Booking Widget (OpenTable/Resy)", "Policy Text", "Contact Info", "Footer"]
    }
  },
  "Boutique": {
    pages: ["Home", "Shop All", "New Arrivals", "Lookbook", "Contact"],
    layouts: {
      "Home": ["Hero: Lifestyle Image", "New Arrivals Slider", "Category Grid", "Newsletter Signup", "Instagram Feed", "Footer"],
      "Shop All": ["Filters Sidebar", "Product Grid (3-col)", "Pagination", "Footer"],
      "Lookbook": ["Masonry Gallery", "Shop the Look Links", "Footer"]
    }
  },
  "Contractor": {
    pages: ["Home", "Services", "Portfolio", "Testimonials", "Get a Quote"],
    layouts: {
      "Home": ["Hero: Completed Project", "Trust Badges/Licensing", "Services Overview", "Process Steps", "CTA: Free Estimate", "Footer"],
      "Portfolio": ["Gallery Grid", "Before/After Slider", "Project Details", "Footer"],
      "Get a Quote": ["Multi-step Form", "Contact Details", "Service Area Map", "Footer"]
    }
  },
  "Hotel": {
    pages: ["Home", "Rooms", "Amenities", "Local Guide", "Booking"],
    layouts: {
      "Home": ["Hero: Resort View", "Booking Bar (Dates)", "Room Previews", "Amenities Highlights", "Footer"],
      "Rooms": ["Room List (Image + Price)", "Comparison Table", "Footer"]
    }
  },
  "Ecommerce": {
    pages: ["Home", "Shop", "About", "FAQ", "Contact"],
    layouts: {
      "Home": ["Hero: Sale Banner", "Best Sellers", "Brand Story", "Trust Icons", "Footer"]
    }
  },
  // Add your 70+ industries here following this format
};

// Fallback layouts if a specific page doesn't have a match in the industry
const GENERIC_LAYOUTS = {
  "Home": ["Hero Section", "Features/Services", "About Snippet", "Testimonials", "Call to Action", "Footer"],
  "Contact": ["Contact Form", "Map/Location", "Social Links", "Footer"],
  "About": ["Hero: Team Photo", "Our Story", "Values/Mission", "Team Members", "Footer"],
  "Services": ["Service List", "Pricing Tables", "FAQ Accordion", "Footer"],
  "Gallery": ["Image Grid", "Lightbox Viewer", "Footer"],
  "default": ["Header", "Content Block", "Image Block", "Call to Action", "Footer"]
};

// Available blocks for the "Add Block" feature
const BLOCK_LIBRARY = [
  "Hero Section", "Text Content", "Image/Gallery", "Contact Form", 
  "Testimonials", "Map/Location", "Team Grid", "Pricing Table", 
  "FAQ Accordion", "Newsletter Signup", "Video Player", "Calendar/Booking",
  "Blog Post Feed", "Social Media Feed"
];

// ======================================================
// --- 2. STATE MANAGEMENT ---
// ======================================================

const state = {
  package: null,
  brandKit: false,
  industry: "",
  pages: [],
  addons: [],
  // Stores the block layout for each page: { "Home": ["Hero", "Footer"], ... }
  pageLayouts: {}, 
  // Stores simple notes for Package 1
  pageNotes: {}, 
  brandingProvided: null,
  customBranding: { active: false, name: "", price: 0 },
};

// Store uploaded files in memory
const pageAttachments = {}; 
const BASE_BRAND_KIT_PRICE = 500;

// --- PERSISTENCE ---
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

// ======================================================
// --- 3. STEP 2 LOGIC (STRUCTURE & PACKAGES) ---
// ======================================================

function selectPackage(id, name, price, limit, brandKitBundlePrice, extraPageCost, element) {
  document.querySelectorAll('.package-card').forEach(el => el.classList.remove('selected'));
  if (element) element.classList.add('selected');

  state.package = { id, name, price, limit, brandKitBundlePrice, extraPageCost };
  
  // Initialize pages if empty
  if (state.pages.length === 0) state.pages = ['Home', 'Contact'];
  
  handlePackageSelected();
  calculateTotal();
  updateBrandKitDisplay();
  renderActivePages(); 
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
}

// --- INDUSTRY SEARCH (AUTOFILL) ---
function initPageBuilder() {
  const input = document.getElementById('industryInput');
  const suggestionsBox = document.createElement('ul');
  suggestionsBox.id = 'industry-suggestions';
  suggestionsBox.className = 'autocomplete-list hidden';
  
  if(input) {
    input.parentNode.style.position = 'relative'; // Ensure relative parent for absolute dropdown
    input.parentNode.appendChild(suggestionsBox);

    input.addEventListener('input', (e) => handleIndustrySearch(e.target.value));
    
    // Close suggestions on click outside
    document.addEventListener('click', (e) => {
      if (e.target !== input && e.target !== suggestionsBox) {
        suggestionsBox.classList.add('hidden');
      }
    });
  }

  // Restore state
  if (state.industry && input) {
    input.value = state.industry;
    renderChips(getIndustryPages(state.industry));
  }
  renderActivePages();
}

function handleIndustrySearch(query) {
  const list = document.getElementById('industry-suggestions');
  if (!query) {
    list.classList.add('hidden');
    return;
  }

  // "Generous Autofill": Case insensitive check
  const matches = Object.keys(INDUSTRY_DB).filter(key => 
    key.toLowerCase().includes(query.toLowerCase())
  );

  list.innerHTML = '';
  if (matches.length > 0) {
    list.classList.remove('hidden');
    matches.forEach(match => {
      const li = document.createElement('li');
      li.textContent = match;
      li.onclick = () => selectIndustry(match);
      list.appendChild(li);
    });
  } else {
    list.classList.add('hidden');
  }
}

function selectIndustry(industryName) {
  const input = document.getElementById('industryInput');
  input.value = industryName;
  state.industry = industryName;
  document.getElementById('industry-suggestions').classList.add('hidden');
  
  // Auto-populate suggested pages
  const suggestedPages = getIndustryPages(industryName);
  renderChips(suggestedPages);
  
  saveState();
}

function getIndustryPages(industryName) {
  if (INDUSTRY_DB[industryName]) {
    return INDUSTRY_DB[industryName].pages;
  }
  return GENERIC_LAYOUTS["default"]; // Fallback
}

function renderChips(pages) {
  const container = document.getElementById('suggestionChips');
  if (!container) return;
  container.innerHTML = '';
  
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
  const name = nameRaw || input.value.trim();
  if (!name) return;
  
  if (!state.pages.includes(name)) {
    state.pages.push(name);
    // Initialize default layout for this page immediately
    if (!state.pageLayouts[name]) {
        state.pageLayouts[name] = getDefaultLayoutForPage(name);
    }
    
    if (input) input.value = '';
    renderActivePages();
    // Re-render chips to show "added" state
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
  state.pages.forEach(page => {
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

function getDefaultLayoutForPage(pageName) {
  // 1. Check Industry Specific Layouts first
  if (state.industry && INDUSTRY_DB[state.industry] && INDUSTRY_DB[state.industry].layouts[pageName]) {
    return [...INDUSTRY_DB[state.industry].layouts[pageName]]; // Return copy
  }
  // 2. Check Generic Layouts
  if (GENERIC_LAYOUTS[pageName]) {
    return [...GENERIC_LAYOUTS[pageName]];
  }
  // 3. Default
  return [...GENERIC_LAYOUTS["default"]];
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


// ======================================================
// --- 4. STEP 3 LOGIC (LAYOUT BUILDER) ---
// ======================================================

function initStep3() {
  if (!document.body.classList.contains('step3')) return;
  const container = document.getElementById('planContainer');
  const pkgId = state.package ? state.package.id : 'basic';
  container.innerHTML = ''; 

  // Basic Package: Text Notes Only
  if (pkgId === 'basic') {
    renderBasicPlan(container);
  } 
  // Standard & Advanced: Visual Block Builder
  else {
    renderVisualLayoutBuilder(container);
  }
  
  injectDownloadButton();
}

// --- BASIC PLAN (Text Only) ---
function renderBasicPlan(container) {
  state.pages.forEach((page, index) => {
    const noteVal = state.pageNotes[page] || '';
    const fileListId = `file-list-${index}`;
    
    const html = `
      <div class="plan-card collapsed">
        <div class="plan-card-header" onclick="togglePlanCard(this)">
            <div class="plan-card-title-group">
                <span class="plan-card-chevron">▼</span>
                <span>${index + 1}. ${page}</span>
            </div>
        </div>
        <div class="plan-card-body">
          <label>Page Goals & Content Notes</label>
          <textarea rows="5" oninput="savePageNote('${page}', this.value)" placeholder="Describe what you want on this page...">${noteVal}</textarea>
          
          <div style="margin-top:20px;">
              <label>Page Assets</label>
              <div class="file-upload-wrapper">
                 <label for="file-input-${index}" class="custom-file-upload">
                   <span style="font-size:1.2rem;">📂</span><br>Click to Upload
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

function savePageNote(pageName, text) {
  state.pageNotes[pageName] = text;
  saveState();
}

// --- VISUAL LAYOUT BUILDER (Packages 2 & 3) ---
function renderVisualLayoutBuilder(container) {
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Drag and drop blocks to arrange your page layout.</p></div>`;
  container.insertAdjacentHTML('beforebegin', intro);

  state.pages.forEach((page, index) => {
    const fileListId = `file-list-${index}`;
    
    // Ensure we have a layout, if not, get the default
    if (!state.pageLayouts[page]) {
      state.pageLayouts[page] = getDefaultLayoutForPage(page);
    }
    
    const html = `
      <div class="plan-card collapsed" data-page="${page}">
        <div class="plan-card-header" onclick="togglePlanCard(this)">
            <div class="plan-card-title-group">
                <span class="plan-card-chevron">▼</span>
                <span>${index + 1}. ${page}</span>
            </div>
        </div>
        <div class="plan-card-body">
          <div class="layout-builder-wrapper">
             <label>Layout Structure</label>
             <p style="font-size:0.8rem; margin-bottom:15px; opacity:0.7;">Drag items to reorder. Click X to remove.</p>
             
             <div class="layout-blocks-container" id="blocks-${index}">
                ${renderBlocks(page)}
             </div>

             <button class="btn-dashed" onclick="openBlockLibrary('${page}', 'blocks-${index}')">+ Add Block</button>
          </div>

          <div style="margin-top:30px; padding-top:20px; border-top:1px solid var(--border-light);">
              <label>Specific Content Notes</label>
              <textarea rows="3" oninput="savePageNote('${page}', this.value)" placeholder="Any specific details for these blocks?">${state.pageNotes[page] || ''}</textarea>
          </div>
          
          <div style="margin-top:20px;">
              <label>Page Files</label>
              <div class="file-upload-wrapper">
                 <label for="file-input-${index}" class="custom-file-upload">
                   <span>📂 Upload Files</span>
                 </label>
                 <input id="file-input-${index}" type="file" multiple onchange="handlePageFileUpload('${page}', this, '${fileListId}')" />
              </div>
              <div id="${fileListId}" class="mini-file-list"></div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    
    // Initialize Drag and Drop for this container
    setTimeout(() => {
        enableBlockSort(`blocks-${index}`, page);
        renderPageFileList(page, fileListId);
    }, 100);
  });
}

function renderBlocks(pageName) {
  const blocks = state.pageLayouts[pageName] || [];
  return blocks.map((block, i) => `
    <div class="layout-block" draggable="true" data-index="${i}">
      <span class="block-drag-handle">::</span>
      <span class="block-name">${block}</span>
      <span class="block-remove" onclick="removeBlock('${pageName}', ${i})">&times;</span>
    </div>
  `).join('');
}

function enableBlockSort(containerId, pageName) {
  const container = document.getElementById(containerId);
  if(!container) return;

  container.addEventListener('dragstart', e => {
    if(e.target.classList.contains('layout-block')) {
      e.target.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    }
  });

  container.addEventListener('dragend', e => {
    if(e.target.classList.contains('layout-block')) {
      e.target.classList.remove('dragging');
      updateBlockOrder(container, pageName);
    }
  });

  container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterBlock(container, e.clientY);
    const draggable = container.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
}

function getDragAfterBlock(container, y) {
  const draggableElements = [...container.querySelectorAll('.layout-block:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateBlockOrder(container, pageName) {
  const newBlocks = [];
  container.querySelectorAll('.layout-block').forEach(el => {
    newBlocks.push(el.querySelector('.block-name').textContent);
  });
  state.pageLayouts[pageName] = newBlocks;
  // Re-render to fix indices
  container.innerHTML = renderBlocks(pageName);
  saveState();
}

function removeBlock(pageName, index) {
  state.pageLayouts[pageName].splice(index, 1);
  const containerId = `blocks-${state.pages.indexOf(pageName)}`;
  const container = document.getElementById(containerId);
  if(container) container.innerHTML = renderBlocks(pageName);
  saveState();
}

function openBlockLibrary(pageName, containerId) {
  // Simple prompt for now, or you could build a modal
  // Ideally, this creates a temporary overlay
  const existingOverlay = document.getElementById('block-library-overlay');
  if(existingOverlay) existingOverlay.remove();

  const overlay = document.createElement('div');
  overlay.className = 'block-library-overlay';
  
  let optionsHtml = '';
  BLOCK_LIBRARY.forEach(block => {
      optionsHtml += `<div class="library-option" onclick="addBlockToPage('${pageName}', '${block}', '${containerId}')">${block}</div>`;
  });

  overlay.innerHTML = `
    <div class="block-library-modal">
        <h3>Add Block</h3>
        <div class="library-grid">${optionsHtml}</div>
        <button onclick="document.getElementById('block-library-overlay').remove()" class="btn-close-modal">Close</button>
    </div>
  `;
  overlay.id = 'block-library-overlay';
  document.body.appendChild(overlay);
}

function addBlockToPage(pageName, blockName, containerId) {
    state.pageLayouts[pageName].push(blockName);
    const container = document.getElementById(containerId);
    if(container) container.innerHTML = renderBlocks(pageName);
    saveState();
    document.getElementById('block-library-overlay').remove();
}

// ======================================================
// --- 5. COMMON UTILS & DOWNLOADS ---
// ======================================================

function togglePlanCard(header) {
  const card = header.closest('.plan-card');
  card.classList.toggle('collapsed');
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

function downloadProjectOutline() {
    let content = `PROJECT OUTLINE\n\nINDUSTRY: ${state.industry}\nPACKAGE: ${state.package ? state.package.name : 'None'}\n\n`;
    
    state.pages.forEach(page => {
        content += `--------------------------------\nPAGE: ${page}\n`;
        if (state.pageLayouts[page]) {
            content += `LAYOUT:\n`;
            state.pageLayouts[page].forEach((block, i) => {
                content += `  ${i+1}. ${block}\n`;
            });
        }
        if (state.pageNotes[page]) {
            content += `NOTES:\n${state.pageNotes[page]}\n`;
        }
        content += `\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "project-outline.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Also trigger file downloads
    downloadAllFiles();
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

function downloadAllFiles() {
    Object.keys(pageAttachments).forEach(page => {
        pageAttachments[page].forEach(file => {
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${page}-${file.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
}

// Brand Kit & Widget toggles
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

// File Upload Handler (Global)
let uploadedFiles = [];
function handleFileUpload(e) {
    // ... existing global file logic if needed ...
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

// Initialization
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

// CSS Injection for new Layout Builder UI
const style = document.createElement('style');
style.innerHTML = `
  /* Autocomplete Dropdown */
  .autocomplete-list {
    position: absolute; top: 100%; left: 0; right: 0;
    background: #0f1322; border: 1px solid var(--border-light);
    border-radius: 0 0 8px 8px; z-index: 1000;
    max-height: 200px; overflow-y: auto; list-style: none; padding: 0; margin: 0;
  }
  .autocomplete-list li {
    padding: 10px 15px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .autocomplete-list li:hover { background: var(--surface-hover); color: var(--accent-blue); }

  /* Layout Blocks */
  .layout-blocks-container {
    display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;
    min-height: 50px; background: rgba(0,0,0,0.1); padding: 15px; border-radius: 8px;
  }
  .layout-block {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--surface-base); border: 1px solid var(--border-light);
    padding: 12px 15px; border-radius: 6px; cursor: grab;
    transition: all 0.2s;
  }
  .layout-block:hover { border-color: var(--accent-blue); }
  .layout-block.dragging { opacity: 0.5; background: var(--accent-blue); }
  .block-drag-handle { margin-right: 15px; color: var(--text-muted); cursor: grab; font-weight: bold; }
  .block-name { flex-grow: 1; font-size: 0.95rem; }
  .block-remove { cursor: pointer; color: #ff6b6b; font-size: 1.2rem; }
  
  /* Modal */
  .block-library-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); z-index: 2000;
    display: flex; align-items: center; justify-content: center;
  }
  .block-library-modal {
    background: #0f1322; padding: 30px; border-radius: 12px;
    width: 90%; max-width: 600px; border: 1px solid var(--accent-blue);
  }
  .library-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; max-height: 400px; overflow-y: auto;
  }
  .library-option {
    padding: 15px; background: var(--surface-base); border: 1px solid var(--border-light);
    border-radius: 6px; cursor: pointer; text-align: center;
  }
  .library-option:hover { background: var(--accent-blue); color: white; }
  .btn-close-modal {
    background: transparent; border: 1px solid var(--border-light); color: var(--text-muted);
    padding: 8px 16px; cursor: pointer; float: right; border-radius: 4px;
  }
`;
document.head.appendChild(style);
