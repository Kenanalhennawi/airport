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

// === NEW: IATCI PARTNER DATABASE (55 Carriers) ===
const iatciPartners = [
    { name: "Emirates", code: "EK", host: "MARS", tagging: "YES", bp: "Not Required", remarks: "Bilateral/Codeshare" },
    { name: "United Airlines", code: "UA", host: "Shares B", tagging: "YES", bp: "Not Required", remarks: "Unilateral/Codeshare" },
    { name: "Air Canada", code: "AC", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Unilateral/Codeshare" },
    { name: "Access Rail", code: "9B", host: "Amadeus", tagging: "NO", bp: "N/A", remarks: "Onward via DB Rail" },
    { name: "Aegean Airlines", code: "A3", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Bilateral" },
    { name: "Batik Air", code: "OD", host: "Sabre", tagging: "YES", bp: "Not Required", remarks: "IATCI Activation 27Jan'26" },
    { name: "Royal Brunei", code: "BI", host: "Hitit", tagging: "YES", bp: "Transfer Desk", remarks: "Bilateral" },
    { name: "Air France", code: "AF", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Unilateral" },
    { name: "KLM", code: "KL", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Unilateral" },
    { name: "China Southern", code: "CZ", host: "Travelsky", tagging: "YES", bp: "Transfer Desk", remarks: "Unilateral" },
    { name: "Air China", code: "CA", host: "Travelsky", tagging: "YES", bp: "Transfer Desk", remarks: "Bilateral" },
    { name: "EL Israel", code: "LY", host: "Amadeus", tagging: "YES", bp: "Transfer Desk", remarks: "INVOL Only" },
    { name: "Singapore", code: "SQ", host: "Amadeus", tagging: "YES", bp: "Transfer Desk", remarks: "Unilateral" },
    { name: "Srilankan", code: "UL", host: "Amadeus", tagging: "YES", bp: "Transfer Desk", remarks: "Bilateral" },
    { name: "Condor", code: "DE", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Bilateral" },
    { name: "Air Astana", code: "KC", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Bilateral" },
    { name: "Philippine Airlines", code: "PR", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Bilateral" },
    { name: "Korean Air", code: "KE", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Bilateral" },
    { name: "Virgin Atlantic", code: "VS", host: "AIR4", tagging: "YES", bp: "Not Required", remarks: "Bilateral" },
    { name: "Gulf Air", code: "GF", host: "Sabre", tagging: "YES", bp: "Transfer Desk", remarks: "Bilateral" },
    { name: "Saudia", code: "SV", host: "Amadeus", tagging: "YES", bp: "Transfer Desk", remarks: "Bilateral" },
    { name: "Kenya Air", code: "KQ", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Bilateral" },
    { name: "Cathay Pacific", code: "CX", host: "Amadeus", tagging: "YES", bp: "Transfer Desk", remarks: "Bilateral" },
    { name: "Pakistan Intl", code: "PK", host: "Hitit", tagging: "YES", bp: "Transfer Desk", remarks: "Bilateral" },
    { name: "LOT Polish", code: "LO", host: "Amadeus", tagging: "YES", bp: "Not Required", remarks: "Bilateral" },
    { name: "ITA Airlines", code: "AZ", host: "Amadeus", tagging: "YES", bp: "Transfer Desk", remarks: "15Jul25 Activation" },
    { name: "Air India", code: "AI", host: "Amadeus", tagging: "YES", bp: "Transfer Desk", remarks: "11Dec 25 Activation" },
    { name: "Royal Jordanian", code: "RJ", host: "Amadeus", tagging: "YES", bp: "Transfer Desk", remarks: "11Dec 25 Activation" }
];

// === TAB SWITCHING LOGIC ===
function switchTab(tab) {
    const iatciWrapper = document.getElementById('iatciWrapper');
    if (tab === 'airports') {
        container.classList.remove('hidden');
        iatciWrapper.classList.add('hidden');
        document.getElementById('btnAirports').classList.add('active');
        document.getElementById('btnIatci').classList.remove('active');
        renderCards(searchInput.value);
    } else {
        container.classList.add('hidden');
        iatciWrapper.classList.remove('hidden');
        document.getElementById('btnAirports').classList.remove('active');
        document.getElementById('btnIatci').classList.add('active');
        renderIatci(searchInput.value);
    }
}

// === RENDER IATCI TABLE ===
function renderIatci(filter = '') {
    const body = document.getElementById('iatciBody');
    body.innerHTML = '';
    const filtered = iatciPartners.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase()) || 
        p.code.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(p => {
        const tr = document.createElement('tr');
        const tagBadge = p.tagging === 'YES' ? 'bg-yes' : 'bg-no';
        const bpBadge = p.bp === 'Not Required' ? 'bg-yes' : (p.bp.includes('Desk') ? 'bg-warn' : 'bg-no');
        
        tr.innerHTML = `
            <td><strong>${p.name}</strong></td>
            <td style="color:var(--fz-blue); font-weight:bold;">${p.code}</td>
            <td><span class="badge ${tagBadge}">${p.tagging}</span></td>
            <td><span class="badge ${bpBadge}">${p.bp}</span></td>
            <td style="color:#64748b; font-size:0.8rem;">${p.remarks}</td>
        `;
        body.appendChild(tr);
    });
}

// === HELPER FUNCTIONS ===
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

// === DESTINATION RENDERING ===
function renderCards(filterText = '') {
    container.innerHTML = ''; 
    if (!filterText.trim()) { clearBtn.classList.add('hidden'); return; }
    clearBtn.classList.remove('hidden');

    const filtered = airportsData.filter(airport => 
        airport.iata.toLowerCase().includes(filterText.toLowerCase()) ||
        airport.city.toLowerCase().includes(filterText.toLowerCase()) ||
        airport.country.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:white;">No destination found.</div>`;
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

// === MODAL & SEARCH HANDLERS ===
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

closeModalBtn.onclick = () => modal.classList.add('hidden');
window.onclick = (event) => { if (event.target == modal) modal.classList.add('hidden'); }

searchInput.addEventListener('input', (e) => {
    const isIatci = document.getElementById('btnIatci').classList.contains('active');
    if (isIatci) renderIatci(e.target.value);
    else renderCards(e.target.value);
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    const isIatci = document.getElementById('btnIatci').classList.contains('active');
    if (isIatci) renderIatci('');
    else renderCards('');
    searchInput.focus();
});

// === INITIALIZATION ===
setInterval(() => {
    updateLiveClock();
    document.querySelectorAll('.time-badge').forEach(el => {
        const timezone = el.getAttribute('data-timezone');
        const dayNightIcon = getDayNightIcon(timezone);
        el.innerHTML = `${dayNightIcon} ${getLocalTime(timezone)}`;
    });
    lucide.createIcons(); 
}, 1000);

updateLiveClock();
renderCards('');
