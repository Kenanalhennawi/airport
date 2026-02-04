const container = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModal');

// === MASTER COUNTRY LIST (Updated with Americas & All Missing Flags) ===
const countryCodes = {
    // Middle East
    "Saudi Arabia": "sa", "UAE": "ae", "United Arab Emirates": "ae", "Bahrain": "bh",
    "Kuwait": "kw", "Oman": "om", "Qatar": "qa", "Jordan": "jo", "Lebanon": "lb",
    "Iraq": "iq", "Iran": "ir", "Syria": "sy", "Israel": "il", "Yemen": "ye", "Turkey": "tr",
    // Africa
    "Egypt": "eg", "Sudan": "sd", "Djibouti": "dj", "Eritrea": "er", "Somalia": "so",
    "Ethiopia": "et", "South Sudan": "ss", "Kenya": "ke", "Uganda": "ug", "Tanzania": "tz",
    "Zanzibar": "tz", "South Africa": "za", "Nigeria": "ng", "Ghana": "gh", "Senegal": "sn",
    "Ivory Coast": "ci", "Morocco": "ma", "Tunisia": "tn", "Algeria": "dz", "Zambia": "zm",
    "Congo": "cg", "Democratic Republic of the Congo": "cd", "Zimbabwe": "zw", "Namibia": "na",
    "Rwanda": "rw", "Libya": "ly", "Mauritius": "mu", "Seychelles": "sc",
    // Europe
    "Russia": "ru", "Ukraine": "ua", "Belarus": "by", "Poland": "pl", "Romania": "ro",
    "Bulgaria": "bg", "Serbia": "rs", "Bosnia": "ba", "Montenegro": "me", "Croatia": "hr",
    "Slovenia": "si", "Hungary": "hu", "Czech Republic": "cz", "Slovakia": "sk",
    "Greece": "gr", "Italy": "it", "France": "fr", "Switzerland": "ch", "Austria": "at",
    "Germany": "de", "Netherlands": "nl", "Belgium": "be", "UK": "gb", "Ireland": "ie",
    "Spain": "es", "Portugal": "pt", "Finland": "fi", "Sweden": "se", "Norway": "no",
    "Denmark": "dk", "Lithuania": "lt", "Latvia": "lv", "Estonia": "ee", "Georgia": "ge",
    "Azerbaijan": "az", "Armenia": "am", "Iceland": "is", "Malta": "mt", "Cyprus": "cy",
    // Asia
    "India": "in", "Pakistan": "pk", "Bangladesh": "bd", "Sri Lanka": "lk", "Nepal": "np",
    "Maldives": "mv", "Kazakhstan": "kz", "Kyrgyzstan": "kg", "Uzbekistan": "uz",
    "Turkmenistan": "tm", "Tajikistan": "tj", "Thailand": "th", "Malaysia": "my",
    "Singapore": "sg", "Indonesia": "id", "Philippines": "ph", "Vietnam": "vn",
    "China": "cn", "Hong Kong": "hk", "Taiwan": "tw", "South Korea": "kr", "Japan": "jp",
    "Myanmar": "mm", "Afghanistan": "af",
    // Americas
    "USA": "us", "Canada": "ca", "Mexico": "mx", "Brazil": "br", "Argentina": "ar",
    "Chile": "cl", "Colombia": "co", "Peru": "pe", "Venezuela": "ve", "Panama": "pa",
    // Oceania
    "Australia": "au", "New Zealand": "nz", "Fiji": "fj"
};

function getLocalTime(timezone) {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit',
            timeZone: timezone, hour12: false
        }).format(new Date());
    } catch (e) { return "--:--"; }
}

function getFlagUrl(countryName) {
    let cleanName = countryName.split('/')[0].trim();
    let code = countryCodes[cleanName] || "un"; 
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
        const dubaiStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(now);
        const targetStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }).format(now);
        
        let diff = parseInt(targetStr) - parseInt(dubaiStr);
        if (diff > 12) diff -= 24;
        if (diff < -12) diff += 24;

        if (diff === 0) {
            return `<span class="time-diff diff-same">(Same Time)</span>`;
        } else if (diff > 0) {
            return `<span class="time-diff diff-plus">(+${diff}h vs DXB)</span>`; // Green
        } else {
            return `<span class="time-diff diff-minus">(${diff}h vs DXB)</span>`; // Red
        }
    } catch (e) { return ""; }
}

function getDayNightIcon(timezone) {
    try {
        const hour = parseInt(new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric', hour12: false, timeZone: timezone
        }).format(new Date()));
        return (hour >= 6 && hour < 18) 
            ? `<i data-lucide="sun" class="icon-sun"></i>` 
            : `<i data-lucide="moon" class="icon-moon"></i>`;
    } catch (e) { return ''; }
}

function getAirportsData() {
    var data = (typeof window !== 'undefined' && window.airportsData) || [];
    return Array.isArray(data) ? data : [];
}

function renderCards(filterText = '') {
    if (!container) return;
    const data = getAirportsData();
    container.innerHTML = '';
    const query = (filterText || '').trim();
    if (query) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');

    if (!query) {
        container.innerHTML = '<div class="search-hint">Search by IATA code, city, or country to see airports</div>';
        return;
    }

    const filtered = data.filter(airport =>
        airport.iata.toLowerCase().includes(query.toLowerCase()) ||
        airport.city.toLowerCase().includes(query.toLowerCase()) ||
        airport.country.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = '<div class="search-hint search-hint-empty">No destination found.</div>';
        return;
    }

    filtered.forEach(airport => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openModal(airport);

        const flagUrl = getFlagUrl(airport.country);
        const timeDiffHTML = getTimeDiffHTML(airport.timezone);
        const dayNightIcon = getDayNightIcon(airport.timezone);

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="iata-code">${airport.iata}</div>
                    <div class="city-name">
                        <img src="${flagUrl}" class="flag-icon" alt="Flag">
                        ${airport.city}
                    </div>
                </div>
                <div class="time-container">
                    <div class="time-badge" data-timezone="${airport.timezone}">
                        ${dayNightIcon} ${getLocalTime(airport.timezone)}
                    </div>
                    <div>${timeDiffHTML}</div>
                </div>
            </div>

            <div class="terminal-info">
                <i data-lucide="plane-landing" style="width:16px"></i>
                <span>${airport.terminal}</span>
            </div>

            <div class="distance-preview">
                <i data-lucide="car" style="width:16px"></i>
                <span>${airport.distanceCenter}</span>
            </div>
            
            <div class="click-hint">Click for Map & Contact</div>
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

var currentView = 'airports';

function switchView(view) {
    currentView = view;
    var airportsView = document.getElementById('airportsView');
    var interlineView = document.getElementById('interlineView');
    var tabAirports = document.getElementById('tabAirports');
    var tabInterline = document.getElementById('tabInterline');
    if (!airportsView || !interlineView) return;

    if (view === 'airports') {
        airportsView.classList.add('active');
        interlineView.classList.remove('active');
        if (tabAirports) { tabAirports.classList.add('active'); tabAirports.setAttribute('aria-pressed', 'true'); }
        if (tabInterline) { tabInterline.classList.remove('active'); tabInterline.setAttribute('aria-pressed', 'false'); }
        searchInput.placeholder = 'Search IATA, City, or Country...';
        renderCards(searchInput.value);
    } else {
        interlineView.classList.add('active');
        airportsView.classList.remove('active');
        if (tabInterline) { tabInterline.classList.add('active'); tabInterline.setAttribute('aria-pressed', 'true'); }
        if (tabAirports) { tabAirports.classList.remove('active'); tabAirports.setAttribute('aria-pressed', 'false'); }
        searchInput.placeholder = 'Search carrier name or code...';
        if (searchInput.value.trim()) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
        filterCarriers(searchInput.value);
    }
    lucide.createIcons();
}

function filterCarriers(query) {
    var tbody = document.getElementById('carrierTableBody');
    if (!tbody) return;
    var q = (query || '').trim().toLowerCase();
    for (var i = 0; i < tbody.rows.length; i++) {
        var row = tbody.rows[i];
        var carrier = (row.cells[1] && row.cells[1].textContent) || '';
        var code = (row.cells[2] && row.cells[2].textContent) || '';
        var match = !q || carrier.toLowerCase().indexOf(q) !== -1 || code.toLowerCase().indexOf(q) !== -1;
        row.style.display = match ? '' : 'none';
    }
}

function init() {
    var carrierModal = document.getElementById('carrierModal');
    var closeCarrierModal = document.getElementById('closeCarrierModal');
    var modalTable = carrierModal && carrierModal.querySelector('.carrier-table');
    var carrierTableBody = document.getElementById('carrierTableBody');
    if (modalTable && modalTable.tBodies[0] && carrierTableBody) {
        carrierTableBody.innerHTML = '';
        for (var i = 0; i < modalTable.tBodies[0].rows.length; i++) {
            carrierTableBody.appendChild(modalTable.tBodies[0].rows[i].cloneNode(true));
        }
    }

    if (closeModalBtn) closeModalBtn.onclick = function () { modal.classList.add('hidden'); };
    window.onclick = function (event) { if (event.target === modal) modal.classList.add('hidden'); };
    if (closeCarrierModal && carrierModal) closeCarrierModal.onclick = function () { carrierModal.classList.add('hidden'); };
    if (carrierModal) carrierModal.onclick = function (e) { if (e.target === carrierModal) carrierModal.classList.add('hidden'); };

    var tabAirports = document.getElementById('tabAirports');
    var tabInterline = document.getElementById('tabInterline');
    if (tabAirports) tabAirports.addEventListener('click', function () { switchView('airports'); });
    if (tabInterline) tabInterline.addEventListener('click', function () { switchView('interline'); });

    if (searchInput) searchInput.addEventListener('input', function (e) {
        var val = e.target.value;
        if (val.trim()) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
        if (currentView === 'airports') renderCards(val);
        else filterCarriers(val);
    });
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            searchInput.value = '';
            clearBtn.classList.add('hidden');
            if (currentView === 'airports') renderCards('');
            else filterCarriers('');
            searchInput.focus();
        });
    }

    setInterval(function () {
        updateLiveClock();
        document.querySelectorAll('.time-badge').forEach(function (el) {
            var timezone = el.getAttribute('data-timezone');
            var dayNightIcon = getDayNightIcon(timezone);
            el.innerHTML = dayNightIcon + ' ' + getLocalTime(timezone);
        });
        lucide.createIcons();
    }, 1000);

    updateLiveClock();
    switchView('airports');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
