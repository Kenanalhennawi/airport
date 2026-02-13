const container = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModal');

// === MASTER COUNTRY LIST (Preserved 100%) ===
const countryCodes = {
    "Saudi Arabia": "sa", "UAE": "ae", "United Arab Emirates": "ae", "Bahrain": "bh",
    "Kuwait": "kw", "Oman": "om", "Qatar": "qa", "Jordan": "jo", "Lebanon": "lb",
    "Iraq": "iq", "Iran": "ir", "Syria": "sy", "Israel": "il", "Yemen": "ye", "Turkey": "tr",
    "Egypt": "eg", "Sudan": "sd", "Djibouti": "dj", "Eritrea": "er", "Somalia": "so",
    "Ethiopia": "et", "South Sudan": "ss", "Kenya": "ke", "Uganda": "ug", "Tanzania": "tz",
    "Zanzibar": "tz", "South Africa": "za", "Nigeria": "ng", "Ghana": "gh", "Senegal": "sn",
    "Ivory Coast": "ci", "Morocco": "ma", "Tunisia": "tn", "Algeria": "dz", "Zambia": "zm",
    "Congo": "cg", "Democratic Republic of the Congo": "cd", "Zimbabwe": "zw", "Namibia": "na",
    "Rwanda": "rw", "Libya": "ly", "Mauritius": "mu", "Seychelles": "sc",
    "Russia": "ru", "Ukraine": "ua", "Belarus": "by", "Poland": "pl", "Romania": "ro",
    "Bulgaria": "bg", "Serbia": "rs", "Bosnia": "ba", "Montenegro": "me", "Croatia": "hr",
    "Slovenia": "si", "Hungary": "hu", "Czech Republic": "cz", "Slovakia": "sk",
    "Greece": "gr", "Italy": "it", "France": "fr", "Switzerland": "ch", "Austria": "at",
    "Germany": "de", "Netherlands": "nl", "Belgium": "be", "UK": "gb", "Ireland": "ie",
    "Spain": "es", "Portugal": "pt", "Finland": "fi", "Sweden": "se", "Norway": "no",
    "Denmark": "dk", "Lithuania": "lt", "Latvia": "lv", "Estonia": "ee", "Georgia": "ge",
    "Azerbaijan": "az", "Armenia": "am", "Iceland": "is", "Malta": "mt", "Cyprus": "cy",
    "India": "in", "Pakistan": "pk", "Bangladesh": "bd", "Sri Lanka": "lk", "Nepal": "np",
    "Maldives": "mv", "Kazakhstan": "kz", "Kyrgyzstan": "kg", "Uzbekistan": "uz",
    "Turkmenistan": "tm", "Tajikistan": "tj", "Thailand": "th", "Malaysia": "my",
    "Singapore": "sg", "Indonesia": "id", "Philippines": "ph", "Vietnam": "vn",
    "China": "cn", "Hong Kong": "hk", "Taiwan": "tw", "South Korea": "kr", "Japan": "jp",
    "Myanmar": "mm", "Afghanistan": "af",
    "USA": "us", "Canada": "ca", "Mexico": "mx", "Brazil": "br", "Argentina": "ar",
    "Chile": "cl", "Colombia": "co", "Peru": "pe", "Venezuela": "ve", "Panama": "pa",
    "Australia": "au", "New Zealand": "nz", "Fiji": "fj"
};

/**
 * 24-HOUR CALCULATOR LOGIC
 * Shows remaining/passed time in HH:MM format
 */
function calculateTimeDifference(iata) {
    const inputEl = document.getElementById(`timeInput-${iata}`);
    const resultEl = document.getElementById(`timeResult-${iata}`);
    if (!inputEl || !inputEl.value) return;

    const targetDate = new Date(inputEl.value);
    const now = new Date();
    const diffMs = targetDate - now;
    const absDiff = Math.abs(diffMs);
    
    const diffHrs = Math.floor(absDiff / (1000 * 60 * 60));
    const diffMins = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    const hh = diffHrs.toString().padStart(2, '0');
    const mm = diffMins.toString().padStart(2, '0');
    const color = diffMs > 0 ? "#16a34a" : "#dc2626";
    const status = diffMs > 0 ? "remaining" : "passed";

    resultEl.innerHTML = `<span style="color:${color}; font-weight:bold; display:block; margin-top:5px;">${hh}:${mm} ${status}</span>`;
}

// === VIEW SWITCHING LOGIC (Restored Interline) ===
var currentView = 'airports';
function switchView(view) {
    currentView = view;
    const airportsPanel = document.getElementById('airportsView');
    const interlinePanel = document.getElementById('interlineView');
    const tabAirports = document.getElementById('tabAirports');
    const tabInterline = document.getElementById('tabInterline');

    if (view === 'airports') {
        airportsPanel.classList.add('active');
        interlinePanel.classList.remove('active');
        tabAirports.classList.add('active');
        tabInterline.classList.remove('active');
        renderCards(searchInput.value);
    } else {
        interlinePanel.classList.add('active');
        airportsPanel.classList.remove('active');
        tabInterline.classList.add('active');
        tabAirports.classList.remove('active');
        filterCarriers(searchInput.value);
    }
    lucide.createIcons();
}

function filterCarriers(query) {
    const tbody = document.getElementById('carrierTableBody');
    if (!tbody) return;
    const q = (query || '').trim().toLowerCase();
    for (let row of tbody.rows) {
        const carrier = row.cells[1].textContent.toLowerCase();
        const code = row.cells[2].textContent.toLowerCase();
        row.style.display = (!q || carrier.includes(q) || code.includes(q)) ? '' : 'none';
    }
}

// === TIME & UI HELPERS ===
function getLocalTime(timezone) {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', timeZone: timezone, hour12: false
        }).format(new Date());
    } catch (e) { return "--:--"; }
}

function getFlagUrl(countryName) {
    let code = countryCodes[countryName.split('/')[0].trim()] || "un"; 
    return `https://flagcdn.com/w40/${code}.png`;
}

function updateLiveClock() {
    const now = new Date();
    document.getElementById('utcTime').textContent = now.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false });
    document.getElementById('dxbTime').textContent = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Dubai', hour12: false });
}

function getTimeDiffHTML(timezone) {
    try {
        const now = new Date();
        const dxbStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(now);
        const targetStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }).format(now);
        let diff = parseInt(targetStr) - parseInt(dxbStr);
        if (diff > 12) diff -= 24; if (diff < -12) diff += 24;
        if (diff === 0) return `<span class="time-diff diff-same">(Same Time)</span>`;
        return diff > 0 ? `<span class="time-diff diff-plus">(+${diff}h vs DXB)</span>` : `<span class="time-diff diff-minus">(${diff}h vs DXB)</span>`;
    } catch (e) { return ""; }
}

function getDayNightIcon(timezone) {
    try {
        const hour = parseInt(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: timezone }).format(new Date()));
        return (hour >= 6 && hour < 18) ? `<i data-lucide="sun" class="icon-sun"></i>` : `<i data-lucide="moon" class="icon-moon"></i>`;
    } catch (e) { return ''; }
}

// === RENDERING ENGINE ===
function renderCards(filterText = '') {
    container.innerHTML = ''; 
    const query = filterText.trim().toLowerCase();
    if (!query) { clearBtn.classList.add('hidden'); return; }
    clearBtn.classList.remove('hidden');

    const filtered = airportsData.filter(a => a.iata.toLowerCase().includes(query) || a.city.toLowerCase().includes(query) || a.country.toLowerCase().includes(query));
    if (filtered.length === 0) { container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:white;">No destination found.</div>`; return; }

    filtered.forEach(airport => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div onclick="openModal(${JSON.stringify(airport).replace(/"/g, '&quot;')})">
                <div class="card-header">
                    <div><div class="iata-code">${airport.iata}</div><div class="city-name"><img src="${getFlagUrl(airport.country)}" class="flag-icon"> ${airport.city}</div></div>
                    <div class="time-container"><div class="time-badge" data-timezone="${airport.timezone}">${getDayNightIcon(airport.timezone)} ${getLocalTime(airport.timezone)}</div><div>${getTimeDiffHTML(airport.timezone)}</div></div>
                </div>
                <div class="terminal-info"><i data-lucide="plane-landing" style="width:16px"></i><span>${airport.terminal}</span></div>
                <div class="distance-preview"><i data-lucide="car" style="width:16px"></i><span>${airport.distanceCenter}</span></div>
            </div>
            <div class="calc-section" style="margin-top:15px; padding-top:10px; border-top: 1px solid rgba(0,0,0,0.05);">
                <label style="font-size:0.7rem; font-weight:bold; color:var(--fz-blue); text-transform:uppercase;">Check Hours (DD/MM/YYYY):</label>
                <input type="datetime-local" id="timeInput-${airport.iata}" onchange="calculateTimeDifference('${airport.iata}')" 
                       style="width:100%; font-size:0.8rem; padding:5px; border-radius:5px; border:1px solid #ddd; background:white; margin-top:5px;">
                <div id="timeResult-${airport.iata}" style="text-align:center; font-size:0.85rem; min-height:1.5em;"></div>
            </div>
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
}

function openModal(data) {
    document.getElementById('modalIata').textContent = data.iata;
    document.getElementById('modalCity').textContent = `${data.city}, ${data.country}`;
    document.getElementById('modalDistance').textContent = data.distanceCenter;
    document.getElementById('modalOtherAirports').textContent = data.nearbyAirports;
    document.getElementById('modalPhone').textContent = data.phone;
    document.getElementById('modalMapBtn').href = data.locationUrl;
    document.getElementById('modalWebBtn').href = data.website;
    modal.classList.remove('hidden');
    lucide.createIcons();
}

// === INITIALIZATION ===
function init() {
    closeModalBtn.onclick = () => modal.classList.add('hidden');
    window.onclick = (e) => { if (e.target == modal) modal.classList.add('hidden'); }
    document.getElementById('tabAirports').onclick = () => switchView('airports');
    document.getElementById('tabInterline').onclick = () => switchView('interline');
    searchInput.addEventListener('input', (e) => { if(currentView === 'airports') renderCards(e.target.value); else filterCarriers(e.target.value); });
    clearBtn.onclick = () => { searchInput.value = ''; renderCards(''); switchView(currentView); };

    setInterval(() => {
        updateLiveClock();
        document.querySelectorAll('.time-badge').forEach(el => {
            const tz = el.getAttribute('data-timezone');
            el.innerHTML = `${getDayNightIcon(tz)} ${getLocalTime(tz)}`;
        });
        lucide.createIcons(); 
    }, 1000);

    updateLiveClock();
    lucide.createIcons();
    renderCards('');
}

document.addEventListener('DOMContentLoaded', init);
