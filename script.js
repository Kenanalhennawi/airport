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

// === CALCULATOR LOGIC (Hours & Minutes) ===
function calculateTimeDifference(iata) {
    const inputEl = document.getElementById(`timeInput-${iata}`);
    const resultEl = document.getElementById(`timeResult-${iata}`);
    if (!inputEl.value) return;

    const targetDate = new Date(inputEl.value);
    const now = new Date();
    const diffMs = targetDate - now;
    
    const absDiff = Math.abs(diffMs);
    const diffHrs = Math.floor(absDiff / (1000 * 60 * 60));
    const diffMins = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    const color = diffMs > 0 ? "#16a34a" : "#dc2626";
    const status = diffMs > 0 ? "remaining" : "ago";

    resultEl.innerHTML = `<span style="color:${color}; font-weight:bold; display:block; margin-top:5px;">${diffHrs}h ${diffMins}m ${status}</span>`;
}

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
            return `<span class="time-diff diff-plus">(+${diff}h vs DXB)</span>`;
        } else {
            return `<span class="time-diff diff-minus">(${diff}h vs DXB)</span>`;
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

function renderCards(filterText = '') {
    container.innerHTML = ''; 
    const query = filterText.trim().toLowerCase();
    
    // Only show results when searching
    if (!query) {
        clearBtn.classList.add('hidden');
        return; 
    }
    clearBtn.classList.remove('hidden');

    const filtered = airportsData.filter(airport => 
        airport.iata.toLowerCase().includes(query) ||
        airport.city.toLowerCase().includes(query) ||
        airport.country.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:white;">No destination found.</div>`;
        return;
    }

    filtered.forEach(airport => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const flagUrl = getFlagUrl(airport.country);
        const timeDiffHTML = getTimeDiffHTML(airport.timezone);
        const dayNightIcon = getDayNightIcon(airport.timezone);

        card.innerHTML = `
            <div onclick="openModal(${JSON.stringify(airport).replace(/"/g, '&quot;')})">
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
            </div>
            
            <div class="calc-section" style="margin-top:15px; padding-top:10px; border-top: 1px solid rgba(0,0,0,0.05);">
                <label style="font-size:0.7rem; font-weight:bold; color:var(--fz-blue); text-transform:uppercase;">Check Hours Until:</label>
                <input type="datetime-local" id="timeInput-${airport.iata}" 
                       onchange="calculateTimeDifference('${airport.iata}')"
                       style="width:100%; font-size:0.8rem; padding:5px; border-radius:5px; border:1px solid #ddd; background:white; margin-top:5px;">
                <div id="timeResult-${airport.iata}" style="text-align:center; font-size:0.85rem; min-height:1.5em;"></div>
            </div>
        `;
        
        container.appendChild(card);
    });

    // Force icons to load immediately for results
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

closeModalBtn.onclick = () => modal.classList.add('hidden');
window.onclick = (event) => { if (event.target == modal) modal.classList.add('hidden'); }

searchInput.addEventListener('input', (e) => renderCards(e.target.value));

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderCards('');
    searchInput.focus();
});

// Initialization
function init() {
    updateLiveClock();
    lucide.createIcons(); 
    
    setInterval(() => {
        updateLiveClock();
        document.querySelectorAll('.time-badge').forEach(el => {
            const timezone = el.getAttribute('data-timezone');
            const dayNightIcon = getDayNightIcon(timezone);
            el.innerHTML = `${dayNightIcon} ${getLocalTime(timezone)}`;
        });
        lucide.createIcons(); 
    }, 1000);
}

init();
renderCards(''); // Empty start state
