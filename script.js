// ======================================================
// --- 1. DATA & CONFIGURATION ---
// ======================================================

const BASE_BRAND_KIT_PRICE = 500;

// NEW: MAPPING FOR VISUAL ICONS
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

// --- LAYOUT DEFINITIONS (The Blocks for each Layout ID) ---
const LAYOUT_DEFINITIONS = {
  "L-01": ["Hero Section", "Text Content", "Image/Gallery", "Button / CTA", "Footer"],
  "L-02": ["Hero Section", "Text Content", "Icon Grid", "Testimonials", "Footer"],
  "L-03": ["Pricing Tiers", "Membership Benefits", "Button / CTA", "Testimonials", "Footer"],
  "L-04": ["Service Overview", "Process Steps", "Deliverables List", "Button / CTA", "Footer"],
  "L-05": ["Contact Form", "Map/Location", "Address & Hours", "Social Media Links", "Footer"],
  "L-06": ["Menu Header", "Starters/Small Plates", "Mains/Large Plates", "Drinks/Sides", "Dietary Info Footer"],
  "L-07": ["Team Header", "Founder Bio", "Team Grid (Photos + Bios)", "Join the Team CTA", "Footer"],
  "L-08": ["Location Info", "Interactive Map", "Parking/Arrival Instructions", "Nearby Attractions", "Footer"],
  "L-09": ["Live Location Tracker", "Schedule List", "Map Embed", "Social Updates", "Footer"],
  "L-10": ["Shop Filters", "Product Grid (Featured)", "New Arrivals", "Newsletter Signup", "Footer"],
  "L-11": ["Blog Header", "Featured Article", "Recent Posts Grid", "Categories Sidebar", "Footer"],
  "L-12": ["Events Calendar View", "Upcoming Events List", "Button / CTA", "Event Details", "Footer"],
  "L-13": ["Masonry Gallery", "Lightbox Viewer", "Project Details", "Share Buttons", "Footer"],
  "L-14": ["Booking Calendar Embed", "Service Selection", "Date/Time Picker", "Confirmation", "Footer"],
  "L-15": ["Inquiry Details", "Long Form Contact", "FAQ Accordion", "Footer"],
  "L-16": ["Hero: Action Focus", "Button / CTA", "Supporting Info", "Footer"],
  "L-17": ["Legal Text Block", "FAQ Accordion", "Return Policy", "Contact Support", "Footer"],
  "L-18": ["Job Openings List", "Company Culture Video", "Perks & Benefits", "Application Form", "Footer"],
  "L-19": ["Minimalist Hero", "Single Image Focus", "Artist Statement", "Portfolio Grid", "Footer"],
  "L-20": ["Retail Hero Slider", "Shop Categories", "Best Sellers", "Brand Manifesto", "Footer"],
  "L-21": ["Trust Badges/Certifications", "Service Guarantee", "Customer Reviews", "Service List", "Footer"],
  "L-22": ["Review Highlight", "Testimonial Grid", "Video Testimonials", "Submit Review", "Footer"],
  "L-23": ["Corporate Header", "Mission Statement", "Departments Grid", "Investor Relations", "Footer"],
  "L-24": ["Search Bar Hero", "Filters", "Results Grid", "Map View", "Footer"],
  "L-25": ["Icon Grid", "Detailed Descriptions", "Comparison Table", "Footer"],
  "default": ["Header/Nav", "Hero Section", "Text Content", "Button / CTA", "Footer"]
};

// --- INDUSTRY DATABASE (For Auto-Suggestions & Layouts) ---
const INDUSTRY_DB = {
  "Bakery / Donut Shop": { pages: ["Home", "Menu / Daily Flavors", "Pre-Order / Catering", "About the Baker", "Location & Hours"], layouts: { "Home": "L-01", "Menu / Daily Flavors": "L-06", "Pre-Order / Catering": "L-15", "About the Baker": "L-02", "Location & Hours": "L-05" } },
  "Brewery / Distillery / Winery": { pages: ["Home", "Our Beers/Wines", "Visit Tasting Room", "Events & Music", "Club Signup", "Shop Merch"], layouts: { "Home": "L-01", "Our Beers/Wines": "L-06", "Visit Tasting Room": "L-08", "Events & Music": "L-12", "Club Signup": "L-03", "Shop Merch": "L-10" } },
  "Coffee Shop / Café": { pages: ["Home", "Menu", "Order Online", "Our Coffee Source", "Careers"], layouts: { "Home": "L-01", "Menu": "L-06", "Order Online": "L-16", "Our Coffee Source": "L-02", "Careers": "L-18" } },
  "Food Truck": { pages: ["Home (Location Tracker)", "Menu", "Catering", "Calendar / Schedule"], layouts: { "Home (Location Tracker)": "L-09", "Menu": "L-06", "Catering": "L-15", "Calendar / Schedule": "L-12" } },
  "Restaurant": { pages: ["Home", "Full Menu", "Reservations", "Private Dining", "Gallery", "Contact & Location"], layouts: { "Home": "L-01", "Full Menu": "L-06", "Reservations": "L-14", "Private Dining": "L-04", "Gallery": "L-13", "Contact & Location": "L-05" } },
  "Art Gallery": { pages: ["Home", "Current Exhibitions", "Artist Roster", "Visit Us", "Shop Collection"], layouts: { "Home": "L-19", "Current Exhibitions": "L-12", "Artist Roster": "L-07", "Visit Us": "L-05", "Shop Collection": "L-10" } },
  "Bookstore / Toy Store": { pages: ["Home", "Staff Picks", "Upcoming Events", "Shop Online", "Membership"], layouts: { "Home": "L-20", "Staff Picks": "L-11", "Upcoming Events": "L-12", "Shop Online": "L-10", "Membership": "L-03" } },
  "Boutique / Jewelry": { pages: ["Home", "Shop All", "New Arrivals", "About the Brand", "Customer Care"], layouts: { "Home": "L-20", "Shop All": "L-10", "New Arrivals": "L-10", "About the Brand": "L-02", "Customer Care": "L-17" } },
  "Farmers Market Vendor": { pages: ["Home", "Our Products", "Market Schedule", "Contact"], layouts: { "Home": "L-02", "Our Products": "L-13", "Market Schedule": "L-12", "Contact": "L-05" } },
  "Florist": { pages: ["Home", "Shop Bouquets", "Wedding & Events", "Flower Care Tips", "Delivery Info"], layouts: { "Home": "L-01", "Shop Bouquets": "L-10", "Wedding & Events": "L-13", "Flower Care Tips": "L-11", "Delivery Info": "L-08" } },
  "Automotive": { pages: ["Home", "Services List", "Schedule Service", "Inventory", "About Us"], layouts: { "Home": "L-21", "Services List": "L-04", "Schedule Service": "L-14", "Inventory": "L-10", "About Us": "L-02" } },
  "Beauty / Salon / Spa": { pages: ["Home", "Service Menu", "Book Appointment", "Stylist Portfolio", "Team"], layouts: { "Home": "L-01", "Service Menu": "L-06", "Book Appointment": "L-14", "Stylist Portfolio": "L-13", "Team": "L-07" } },
  "Construction / Home Services": { pages: ["Home", "Our Services", "Project Portfolio", "Request a Quote", "Testimonials"], layouts: { "Home": "L-21", "Our Services": "L-04", "Project Portfolio": "L-13", "Request a Quote": "L-15", "Testimonials": "L-22" } },
  "Fitness Studio / Gym": { pages: ["Home", "Class Schedule", "Instructors", "Membership Pricing", "New Student Info"], layouts: { "Home": "L-01", "Class Schedule": "L-12", "Instructors": "L-07", "Membership Pricing": "L-03", "New Student Info": "L-17" } },
  "Law Firm / Financial": { pages: ["Home", "Practice Areas", "Our Team", "Resources / Blog", "Consultation"], layouts: { "Home": "L-23", "Practice Areas": "L-04", "Our Team": "L-07", "Resources / Blog": "L-11", "Consultation": "L-15" } },
  "Real Estate": { pages: ["Home", "Current Listings", "Buyers / Sellers Info", "Meet the Agents", "Market Reports"], layouts: { "Home": "L-24", "Current Listings": "L-10", "Buyers / Sellers Info": "L-08", "Meet the Agents": "L-07", "Market Reports": "L-11" } },
  "Bed & Breakfast / Hotel": { pages: ["Home", "Rooms", "Amenities", "Things To Do", "Book Now"], layouts: { "Home": "L-01", "Rooms": "L-04", "Amenities": "L-25", "Things To Do": "L-11", "Book Now": "L-14" } },
  "Event Venue": { pages: ["Home", "Venue Spaces", "Packages & Pricing", "Preferred Vendors", "Inquiry Form"], layouts: { "Home": "L-01", "Venue Spaces": "L-13", "Packages & Pricing": "L-03", "Preferred Vendors": "L-25", "Inquiry Form": "L-15" } },
  "Tours": { pages: ["Home", "Our Tours", "FAQ", "About the Guides", "Book Online"], layouts: { "Home": "L-01", "Our Tours": "L-03", "FAQ": "L-17", "About the Guides": "L-07", "Book Online": "L-14" } },
  "Museum": { pages: ["Home", "Exhibits", "Plan Your Visit", "Membership", "Education"], layouts: { "Home": "L-23", "Exhibits": "L-04", "Plan Your Visit": "L-08", "Membership": "L-15", "Education": "L-04" } },
  "Agriculture / Farm": { pages: ["Home", "CSA Signup", "Harvest Calendar", "Wholesale", "Visit the Farm"], layouts: { "Home": "L-01", "CSA Signup": "L-03", "Harvest Calendar": "L-12", "Wholesale": "L-15", "Visit the Farm": "L-08" } },
  "Pet Services": { pages: ["Home", "Grooming Services", "Boarding Info", "Gallery", "Book Appointment"], layouts: { "Home": "L-01", "Grooming Services": "L-06", "Boarding Info": "L-17", "Gallery": "L-13", "Book Appointment": "L-14" } },
  "Fishing Charters": { pages: ["Home", "Charter Packages", "Captain & Crew", "Fishing Reports", "Book a Trip"], layouts: { "Home": "L-01", "Charter Packages": "L-03", "Captain & Crew": "L-07", "Fishing Reports": "L-11", "Book a Trip": "L-14" } },
  "Artisan Market": { pages: ["Home", "Vendor Directory", "Apply to Sell", "Upcoming Markets", "About"], layouts: { "Home": "L-20", "Vendor Directory": "L-10", "Apply to Sell": "L-15", "Upcoming Markets": "L-12", "About": "L-02" } },
  "Home Décor": { pages: ["Home", "Shop by Room", "Design Services", "Inspiration", "Shipping"], layouts: { "Home": "L-20", "Shop by Room": "L-10", "Design Services": "L-04", "Inspiration": "L-13", "Shipping": "L-17" } },
  "Wellness Shop": { pages: ["Home", "Shop Products", "Workshops", "Practitioners", "About Sourcing"], layouts: { "Home": "L-19", "Shop Products": "L-10", "Workshops": "L-12", "Practitioners": "L-07", "About Sourcing": "L-02" } },
  "Ice Cream Shop": { pages: ["Home", "Current Flavors", "Party Info", "Locations", "Gift Cards"], layouts: { "Home": "L-01", "Current Flavors": "L-06", "Party Info": "L-15", "Locations": "L-09", "Gift Cards": "L-03" } },
  "Specialty Foods": { pages: ["Home", "Shop Online", "Recipes", "Gift Baskets", "Wholesale"], layouts: { "Home": "L-20", "Shop Online": "L-10", "Recipes": "L-11", "Gift Baskets": "L-03", "Wholesale": "L-15" } },
  "Logistics / Freight": { pages: ["Home", "Freight Services", "Track Shipment", "Fleet Info", "Request Quote"], layouts: { "Home": "L-23", "Freight Services": "L-04", "Track Shipment": "L-16", "Fleet Info": "L-25", "Request Quote": "L-15" } },
  "Manufacturing": { pages: ["Home", "Capabilities", "Certifications", "Industries Served", "Contact"], layouts: { "Home": "L-23", "Capabilities": "L-25", "Certifications": "L-21", "Industries Served": "L-04", "Contact": "L-15" } },
  "Recruiting": { pages: ["Home", "Job Board", "For Employers", "Submit Resume", "Team"], layouts: { "Home": "L-23", "Job Board": "L-18", "For Employers": "L-04", "Submit Resume": "L-15", "Team": "L-07" } },
  "Tech Startup": { pages: ["Home", "Features", "Pricing", "Download App", "Help Center"], layouts: { "Home": "L-24", "Features": "L-25", "Pricing": "L-03", "Download App": "L-16", "Help Center": "L-17" } },
  "SaaS": { pages: ["Home", "Solutions", "Case Studies", "Pricing", "Book Demo"], layouts: { "Home": "L-24", "Solutions": "L-04", "Case Studies": "L-11", "Pricing": "L-03", "Book Demo": "L-14" } },
  "Local Government": { pages: ["Home", "Departments", "Meeting Agendas", "Pay Bills", "Contact Officials"], layouts: { "Home": "L-23", "Departments": "L-25", "Meeting Agendas": "L-11", "Pay Bills": "L-16", "Contact Officials": "L-05" } },
  "Insurance": { pages: ["Home", "Personal Insurance", "Business Insurance", "File a Claim", "Get a Quote"], layouts: { "Home": "L-21", "Personal Insurance": "L-04", "Business Insurance": "L-04", "File a Claim": "L-15", "Get a Quote": "L-15" } },
  "Tattoo Studio": { pages: ["Home", "Artist Portfolios", "Aftercare", "Booking Policy", "FAQ"], layouts: { "Home": "L-01", "Artist Portfolios": "L-13", "Aftercare": "L-17", "Booking Policy": "L-15", "FAQ": "L-17" } },
  "Gaming / Esports": { pages: ["Home", "Tournaments", "Team Roster", "Join Community", "Merch Store"], layouts: { "Home": "L-01", "Tournaments": "L-12", "Team Roster": "L-07", "Join Community": "L-16", "Merch Store": "L-10" } },
  "Art Classes": { pages: ["Home", "Class Schedule", "Workshops", "Student Gallery", "Private Events"], layouts: { "Home": "L-01", "Class Schedule": "L-12", "Workshops": "L-03", "Student Gallery": "L-13", "Private Events": "L-15" } },
  "Theater / Music Venue": { pages: ["Home", "Upcoming Shows", "Buy Tickets", "Venue Info", "Rent the Venue"], layouts: { "Home": "L-01", "Upcoming Shows": "L-12", "Buy Tickets": "L-16", "Venue Info": "L-08", "Rent the Venue": "L-15" } },
  "Photography": { pages: ["Home", "Portfolio", "Investment", "About", "Contact"], layouts: { "Home": "L-19", "Portfolio": "L-13", "Investment": "L-03", "About": "L-02", "Contact": "L-05" } },
  "Bike / Kayak Rentals": { pages: ["Home", "Rentals & Rates", "Maps", "Waiver Info", "Reserve Gear"], layouts: { "Home": "L-01", "Rentals & Rates": "L-03", "Maps": "L-08", "Waiver Info": "L-17", "Reserve Gear": "L-14" } },
  "Surf Lessons": { pages: ["Home", "Packages", "Surf Report", "Instructors", "Book Lesson"], layouts: { "Home": "L-01", "Packages": "L-03", "Surf Report": "L-09", "Instructors": "L-07", "Book Lesson": "L-14" } },
  "Family Attractions": { pages: ["Home", "The Rooms", "FAQ", "Parties", "Book Time Slot"], layouts: { "Home": "L-01", "The Rooms": "L-13", "FAQ": "L-17", "Parties": "L-15", "Book Time Slot": "L-14" } },
  "Vacation Rentals": { pages: ["Home", "Property Photos", "Amenities", "Local Guide", "Book"], layouts: { "Home": "L-01", "Property Photos": "L-13", "Amenities": "L-25", "Local Guide": "L-11", "Book": "L-16" } },
  "Visitor Center": { pages: ["Home", "Things to Do", "Events", "Interactive Map", "Visitor Guide"], layouts: { "Home": "L-24", "Things to Do": "L-11", "Events": "L-12", "Interactive Map": "L-09", "Visitor Guide": "L-16" } },
  "Travel Agency": { pages: ["Home", "Destinations", "Packages", "Travel Blog", "Plan My Trip"], layouts: { "Home": "L-01", "Destinations": "L-13", "Packages": "L-03", "Travel Blog": "L-11", "Plan My Trip": "L-15" } },
  "Transportation": { pages: ["Home", "Fleet", "Rates", "Service Area", "Book a Ride"], layouts: { "Home": "L-24", "Fleet": "L-25", "Rates": "L-06", "Service Area": "L-09", "Book a Ride": "L-14" } },
  "Property Services": { pages: ["Home", "Checklist", "Pricing", "Service Area", "Request Service"], layouts: { "Home": "L-21", "Checklist": "L-04", "Pricing": "L-03", "Service Area": "L-08", "Request Service": "L-15" } },
  "Education": { pages: ["Home", "Courses", "Admissions", "Calendar", "Student Portal"], layouts: { "Home": "L-23", "Courses": "L-06", "Admissions": "L-15", "Calendar": "L-12", "Student Portal": "L-16" } },
  "Nonprofit": { pages: ["Home", "Our Mission", "Programs", "Donate", "Volunteer"], layouts: { "Home": "L-02", "Our Mission": "L-02", "Programs": "L-04", "Donate": "L-03", "Volunteer": "L-15" } }
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
  advancedNotes: ""
};

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
    state.pagePlans[name].grid = convertListToFreeGrid(getDefaultLayoutForPage(name));
    
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
  state.addons.forEach(addon => {
    html += `<div class="fw-item"><span>+ ${addon.name}</span><span>$${Number(addon.price).toLocaleString()}</span></div>`;
    total += Number(addon.price) || 0;
  });
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
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Drag & Drop Wireframe Tool. Move elements freely. They will snap back if they overlap.</p></div>`;
  container.insertAdjacentHTML('beforebegin', intro);

  state.pages.forEach((page, index) => {
    if(!state.pagePlans[page]) state.pagePlans[page] = {};
    if (!state.pagePlans[page].grid || state.pagePlans[page].grid.length === 0) {
      state.pagePlans[page].grid = convertListToFreeGrid(getDefaultLayoutForPage(page));
    }
    
    const gridId = `grid-canvas-${index}`;
    const mobileId = `mobile-preview-${index}`;
    const fileListId = `file-list-${index}`;
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
        refreshPageBuilderUI(page, gridId, mobileId);
        renderPageFileList(page, fileListId);
    }, 100);
  });
}

function getDefaultLayoutForPage(pageName) {
  if (state.industry && INDUSTRY_DB[state.industry] && INDUSTRY_DB[state.industry].layouts[pageName]) {
    const layoutID = INDUSTRY_DB[state.industry].layouts[pageName];
    if (LAYOUT_DEFINITIONS[layoutID]) return [...LAYOUT_DEFINITIONS[layoutID]];
  }
  return [...LAYOUT_DEFINITIONS["default"]];
}

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

function generateLayoutSelector(currentPageName) {
    let options = `<optgroup label="Generic"><option value="default">Default Basic</option></optgroup>`;
    const matches = [];
    Object.entries(INDUSTRY_DB).forEach(([indName, data]) => {
        if (data.pages.includes(currentPageName)) {
            matches.push({ industry: indName, layoutId: data.layouts[currentPageName] });
        }
    });
    if (matches.length > 0) {
        options += `<optgroup label="Industry Suggestions">`;
        matches.forEach(m => { options += `<option value="${m.layoutId}">${m.industry} / ${currentPageName}</option>`; });
        options += `</optgroup>`;
    }
    options += `<optgroup label="All Layouts">`;
    Object.entries(LAYOUT_DEFINITIONS).forEach(([lid, blocks]) => {
        options += `<option value="${lid}">${lid} (${blocks.length} blocks)</option>`;
    });
    options += `</optgroup>`;
    return options;
}

function switchPageLayout(pageName, layoutId) {
    if(!layoutId) return;
    const choice = confirm("Replace current layout?");
    let newBlocksRaw = LAYOUT_DEFINITIONS[layoutId] || LAYOUT_DEFINITIONS['default'];
    let newGridBlocks = convertListToFreeGrid(newBlocksRaw);

    if (choice) {
        state.pagePlans[pageName].grid = newGridBlocks;
    } else {
        const currentBlocks = state.pagePlans[pageName].grid;
        const maxY = currentBlocks.length > 0 ? Math.max(...currentBlocks.map(b => b.y + b.h)) : 1;
        newGridBlocks = newGridBlocks.map(b => ({ ...b, y: b.y + maxY - 1 })); 
        state.pagePlans[pageName].grid = [...currentBlocks, ...newGridBlocks];
    }
    
    const index = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, `grid-canvas-${index}`, `mobile-preview-${index}`);
    saveState();
}

// --- RENDER FUNCTIONS ---
function refreshPageBuilderUI(pageName, gridId, mobileId) {
    const gridContainer = document.getElementById(gridId);
    const mobileContainer = document.getElementById(mobileId);
    if(!gridContainer) return;

    gridContainer.innerHTML = '';
    mobileContainer.innerHTML = '<div class="mobile-notch"></div>';

    const blocks = state.pagePlans[pageName].grid || [];
    const sortedBlocks = [...blocks].sort((a,b) => a.y - b.y);

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

// --- INTERACTION: FREE FLOATING DRAG WITH COLLISION CHECK ---
function checkCollision(pageName, id, x, y, w, h) {
    const blocks = state.pagePlans[pageName].grid;
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.id === id) continue; // Skip self
        if (x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y) {
            return true; 
        }
    }
    return false;
}

function setupFreeInteraction(element, pageName, index, gridId, mobileId) {
    const container = document.getElementById(gridId);
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
            
            if (checkCollision(pageName, blockData.id, potentialX, potentialY, blockData.w, blockData.h)) {
                state.pagePlans[pageName].grid[index].x = originalGridX;
                state.pagePlans[pageName].grid[index].y = originalGridY;
                alert("Blocks cannot overlap! Snapping back.");
            } else {
                state.pagePlans[pageName].grid[index].x = potentialX;
                state.pagePlans[pageName].grid[index].y = potentialY;
            }
            saveState();
            refreshPageBuilderUI(pageName, gridId, mobileId);
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
             refreshPageBuilderUI(pageName, gridId, mobileId);
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
    refreshPageBuilderUI(pageName, `grid-canvas-${pageIndex}`, `mobile-preview-${pageIndex}`);
    saveState();
}

function removeBlock(pageName, id) {
    state.pagePlans[pageName].grid = state.pagePlans[pageName].grid.filter(b => b.id !== id);
    const idx = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, `grid-canvas-${idx}`, `mobile-preview-${idx}`);
    saveState();
}

// --- BASIC PLAN LOGIC (Restored for older packages) ---
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
