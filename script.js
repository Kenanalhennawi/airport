/**
 * FlyDubai Ops Guide - Production-Ready Script
 * Airport operations tool with interline data, 24h calculator, and live clocks.
 */
const container = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModal');

// === MASTER COUNTRY LIST (FlagCDN ISO codes) ===
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

// === DD/MM/YYYY MASKED INPUT (bypasses browser regional MM/DD) ===
function formatDateInput(el) {
    let v = el.value.replace(/[^\d]/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + '/' + v.slice(5, 9);
    el.value = v.slice(0, 10);
}

function formatTimeInput(el) {
    let v = el.value.replace(/[^\d]/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + ':' + v.slice(2);
    el.value = v.slice(0, 5);
}

function isValidDate(d, m, y) {
    if (m < 1 || m > 12 || y < 1900 || y > 2100) return false;
    const daysInMonth = [31, (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return d >= 1 && d <= daysInMonth[m - 1];
}

function isValidTime(hr, min) {
    return hr >= 0 && hr <= 23 && min >= 0 && min <= 59;
}

// === 24-HOUR CALCULATOR (strict HH:MM format) ===
function calculateTimeDifference(iata) {
    const dIn = document.getElementById('dateIn-' + iata);
    const tIn = document.getElementById('timeIn-' + iata);
    const resultEl = document.getElementById('timeResult-' + iata);
    if (!dIn || !tIn || !resultEl) return;

    const dStr = dIn.value.trim();
    const tStr = tIn.value.trim();
    if (dStr.length < 10 || tStr.length < 5) {
        resultEl.innerHTML = '';
        return;
    }

    const parts = dStr.split('/').map(Number);
    const [d, m, y] = parts;
    const [hr, min] = tStr.split(':').map(Number);

    if (!isValidDate(d, m, y) || !isValidTime(hr, min)) {
        resultEl.innerHTML = '<span style="color:#dc2626;font-weight:bold;">Invalid date/time</span>';
        return;
    }

    const targetDate = new Date(y, m - 1, d, hr, min);
    const now = new Date();
    const absDiff = Math.abs(targetDate - now);

    const hDisplay = Math.floor(absDiff / 3600000).toString().padStart(2, '0');
    const mDisplay = Math.floor((absDiff % 3600000) / 60000).toString().padStart(2, '0');
    const status = (targetDate - now) > 0 ? 'remaining' : 'passed';
    const color = (targetDate - now) > 0 ? '#16a34a' : '#dc2626';

    resultEl.innerHTML = '<span style="color:' + color + ';font-weight:bold;display:block;margin-top:5px;">' + hDisplay + ':' + mDisplay + ' ' + status + '</span>';
}

// === HELPER FUNCTIONS ===
function getLocalTime(timezone) {
    try {
        return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone, hour12: false }).format(new Date());
    } catch (e) { return '--:--'; }
}

function getFlagUrl(countryName) {
    const code = countryCodes[countryName.split('/')[0].trim()] || 'un';
    return 'https://flagcdn.com/w40/' + code + '.png';
}

function getTimeDiffHTML(timezone) {
    try {
        const now = new Date();
        const dxbStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(now);
        const targetStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }).format(now);
        let diff = parseInt(targetStr) - parseInt(dxbStr);
        if (diff > 12) diff -= 24;
        if (diff < -12) diff += 24;
        if (diff === 0) return '<span class="time-diff diff-same">(Same Time)</span>';
        return diff > 0 ? '<span class="time-diff diff-plus">(+' + diff + 'h vs DXB)</span>' : '<span class="time-diff diff-minus">(' + diff + 'h vs DXB)</span>';
    } catch (e) { return ''; }
}

function getDayNightIcon(timezone) {
    try {
        const hour = parseInt(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: timezone }).format(new Date()));
        return (hour >= 6 && hour < 18) ? '<i data-lucide="sun" class="icon-sun"></i>' : '<i data-lucide="moon" class="icon-moon"></i>';
    } catch (e) { return ''; }
}

function updateLiveClock() {
    const now = new Date();
    const utcEl = document.getElementById('utcTime');
    const dxbEl = document.getElementById('dxbTime');
    if (utcEl) utcEl.textContent = now.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false });
    if (dxbEl) dxbEl.textContent = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Dubai', hour12: false });
}

// === INTERLINE: Populate from hidden carrier source (55 carriers) ===
function populateInterlineTable() {
    const carrierModal = document.getElementById('carrierModal');
    const carrierTableBody = document.getElementById('carrierTableBody');
    const modalTable = carrierModal && carrierModal.querySelector('.carrier-table');
    if (!modalTable || !modalTable.tBodies[0] || !carrierTableBody) return;

    carrierTableBody.innerHTML = '';
    const rows = Array.from(modalTable.tBodies[0].rows).map(r => r.cloneNode(true));
    rows.sort((a, b) => {
        const nameA = (a.cells[1] && a.cells[1].textContent || '').trim().toLowerCase();
        const nameB = (b.cells[1] && b.cells[1].textContent || '').trim().toLowerCase();
        return nameA.localeCompare(nameB);
    });
    rows.forEach((row, i) => {
        if (row.cells[0]) row.cells[0].textContent = i + 1;
        carrierTableBody.appendChild(row);
    });
}

function filterCarriers(query) {
    const tbody = document.getElementById('carrierTableBody');
    if (!tbody) return;
    const q = (query || '').trim().toLowerCase();
    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        const carrier = (row.cells[1] && row.cells[1].textContent) || '';
        const code = (row.cells[2] && row.cells[2].textContent) || '';
        const host = (row.cells[4] && row.cells[4].textContent) || '';
        const match = !q || carrier.toLowerCase().includes(q) || code.toLowerCase().includes(q) || host.toLowerCase().includes(q);
        row.style.display = match ? '' : 'none';
    }
}

// === VIEW SWITCHING ===
let currentView = 'airports';
function switchView(view) {
    currentView = view;
    const airportsPanel = document.getElementById('airportsView');
    const interlinePanel = document.getElementById('interlineView');
    const tabAirports = document.getElementById('tabAirports');
    const tabInterline = document.getElementById('tabInterline');
    if (!airportsPanel || !interlinePanel) return;

    if (view === 'airports') {
        airportsPanel.classList.add('active');
        interlinePanel.classList.remove('active');
        if (tabAirports) tabAirports.classList.add('active');
        if (tabInterline) tabInterline.classList.remove('active');
        if (searchInput) searchInput.placeholder = 'Search IATA, City, or Country...';
        renderCards(searchInput ? searchInput.value : '');
    } else {
        interlinePanel.classList.add('active');
        airportsPanel.classList.remove('active');
        if (tabInterline) tabInterline.classList.add('active');
        if (tabAirports) tabAirports.classList.remove('active');
        if (searchInput) searchInput.placeholder = 'Search carrier name or code...';
        filterCarriers(searchInput ? searchInput.value : '');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// === RENDERING ENGINE (cards hidden until user types) ===
function renderCards(filterText) {
    if (!container) return;
    const data = (typeof window !== 'undefined' && window.airportsData) || [];
    const airportsData = Array.isArray(data) ? data : [];
    container.innerHTML = '';

    const query = (filterText || '').trim();
    if (query) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');

    if (!query) {
        container.innerHTML = '<div class="search-hint">Search by IATA code, city, or country to see airports</div>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    const filtered = airportsData.filter(a =>
        a.iata.toLowerCase().includes(query.toLowerCase()) ||
        a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.country.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = '<div class="search-hint search-hint-empty">No destination found.</div>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    filtered.forEach(airport => {
        const card = document.createElement('div');
        card.className = 'card';
        const cardClickable = document.createElement('div');
        cardClickable.className = 'card-clickable';
        cardClickable.innerHTML =
            '<div class="card-header"><div><div class="iata-code">' + airport.iata + '</div><div class="city-name"><img src="' + getFlagUrl(airport.country) + '" class="flag-icon" alt=""> ' + airport.city + '</div></div>' +
            '<div class="time-container"><div class="time-badge" data-timezone="' + airport.timezone + '">' + getDayNightIcon(airport.timezone) + ' ' + getLocalTime(airport.timezone) + '</div><div>' + getTimeDiffHTML(airport.timezone) + '</div></div></div>' +
            '<div class="terminal-info"><i data-lucide="plane-landing" style="width:16px"></i><span>' + airport.terminal + '</span></div>' +
            '<div class="distance-preview"><i data-lucide="car" style="width:16px"></i><span>' + airport.distanceCenter + '</span></div>';
        cardClickable.onclick = function () { openModal(airport); };
        card.appendChild(cardClickable);

        const calcSection = document.createElement('div');
        calcSection.className = 'calc-section';
        calcSection.style.cssText = 'margin-top:15px;padding-top:10px;border-top:1px solid rgba(0,0,0,0.05);';
        calcSection.innerHTML =
            '<label style="font-size:0.7rem;font-weight:bold;color:var(--fz-blue);text-transform:uppercase;">Check Hours (DD/MM/YYYY HH:MM):</label>' +
            '<div style="display:flex;gap:5px;margin-top:5px;">' +
            '<input type="text" id="dateIn-' + airport.iata + '" placeholder="DD/MM/YYYY" maxlength="10" style="width:60%;font-size:0.8rem;padding:5px;border-radius:5px;border:1px solid #ddd;">' +
            '<input type="text" id="timeIn-' + airport.iata + '" placeholder="HH:MM" maxlength="5" style="width:35%;font-size:0.8rem;padding:5px;border-radius:5px;border:1px solid #ddd;">' +
            '</div><div id="timeResult-' + airport.iata + '" style="text-align:center;font-size:0.85rem;min-height:1.5em;"></div>';

        card.appendChild(calcSection);
        const dateIn = card.querySelector('#dateIn-' + airport.iata);
        const timeIn = card.querySelector('#timeIn-' + airport.iata);
        if (dateIn) {
            dateIn.oninput = function () { formatDateInput(this); calculateTimeDifference(airport.iata); };
        }
        if (timeIn) {
            timeIn.oninput = function () { formatTimeInput(this); calculateTimeDifference(airport.iata); };
        }

        container.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openModal(data) {
    document.getElementById('modalIata').textContent = data.iata;
    document.getElementById('modalCity').textContent = data.city + ', ' + data.country;
    document.getElementById('modalDistance').textContent = data.distanceCenter;
    document.getElementById('modalOtherAirports').textContent = data.nearbyAirports;
    document.getElementById('modalPhone').textContent = data.phone;
    document.getElementById('modalMapBtn').href = data.locationUrl;
    document.getElementById('modalWebBtn').href = data.website;
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// === INITIALIZATION ===
function init() {
    if (closeModalBtn) closeModalBtn.onclick = function () { modal.classList.add('hidden'); };
    window.onclick = function (e) { if (e.target === modal) modal.classList.add('hidden'); };

    const closeCarrierModal = document.getElementById('closeCarrierModal');
    const carrierModal = document.getElementById('carrierModal');
    if (closeCarrierModal && carrierModal) closeCarrierModal.onclick = function () { carrierModal.classList.add('hidden'); };
    if (carrierModal) carrierModal.onclick = function (e) { if (e.target === carrierModal) carrierModal.classList.add('hidden'); };

    const tabAirports = document.getElementById('tabAirports');
    const tabInterline = document.getElementById('tabInterline');
    if (tabAirports) tabAirports.onclick = function () { switchView('airports'); };
    if (tabInterline) tabInterline.onclick = function () { switchView('interline'); };

    if (searchInput) searchInput.addEventListener('input', function () {
        if (currentView === 'airports') renderCards(searchInput.value);
        else filterCarriers(searchInput.value);
    });
    if (clearBtn) clearBtn.onclick = function () {
        searchInput.value = '';
        clearBtn.classList.add('hidden');
        renderCards('');
        switchView(currentView);
    };

    populateInterlineTable();
    updateLiveClock();
    setInterval(function () {
        updateLiveClock();
        document.querySelectorAll('.time-badge').forEach(function (el) {
            const tz = el.getAttribute('data-timezone');
            el.innerHTML = getDayNightIcon(tz) + ' ' + getLocalTime(tz);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 1000);

    lucide.createIcons();
    switchView('airports');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
