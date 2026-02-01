const container = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModal');

// === Expanded Country List for Flags ===
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
    // Europe
    "Russia": "ru", "Ukraine": "ua", "Belarus": "by", "Poland": "pl", "Romania": "ro",
    "Bulgaria": "bg", "Serbia": "rs", "Bosnia": "ba", "Montenegro": "me", "Croatia": "hr",
    "Slovenia": "si", "Hungary": "hu", "Czech Republic": "cz", "Slovakia": "sk",
    "Greece": "gr", "Italy": "it", "France": "fr", "Switzerland": "ch", "Austria": "at",
    "Germany": "de", "Netherlands": "nl", "Belgium": "be", "UK": "gb", "Ireland": "ie",
    "Spain": "es", "Portugal": "pt", "Finland": "fi", "Sweden": "se", "Norway": "no",
    "Denmark": "dk", "Lithuania": "lt", "Latvia": "lv", "Estonia": "ee", "Georgia": "ge",
    "Azerbaijan": "az", "Armenia": "am",
    // Asia
    "India": "in", "Pakistan": "pk", "Bangladesh": "bd", "Sri Lanka": "lk", "Nepal": "np",
    "Maldives": "mv", "Kazakhstan": "kz", "Kyrgyzstan": "kg", "Uzbekistan": "uz",
    "Turkmenistan": "tm", "Tajikistan": "tj", "Thailand": "th", "Malaysia": "my",
    "Singapore": "sg", "Indonesia": "id", "Philippines": "ph", "Vietnam": "vn",
    "China": "cn", "Hong Kong": "hk", "Taiwan": "tw", "South Korea": "kr", "Japan": "jp",
    "Myanmar": "mm",
    // Americas & Oceania
    "USA": "us", "Canada": "ca", "Mexico": "mx", "Australia": "au", "New Zealand": "nz",
    // Islands
    "Mauritius": "mu", "Seychelles": "sc"
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
    // Handles cases like "Switzerland / France" -> Takes "Switzerland"
    let cleanName = countryName.split('/')[0].trim();
    let code = countryCodes[cleanName] || "un"; // 'un' is generic United Nations flag
    return `https://flagcdn.com/w40/${code}.png`;
}

// === Live Clock Logic ===
function updateLiveClock() {
    const now = new Date();
    // UTC
    document.getElementById('utcTime').textContent = now.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false });
    // DXB
    document.getElementById('dxbTime').textContent = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Dubai', hour12: false });
}

// === Time Difference Logic ===
function getTimeDiff(timezone) {
    try {
        const now = new Date();
        const dubaiStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(now);
        const targetStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }).format(now);
        
        let diff = parseInt(targetStr) - parseInt(dubaiStr);
        
        // Handle day wrap-around logic
        if (diff > 12) diff -= 24;
        if (diff < -12) diff += 24;

        if (diff === 0) return `<span style="color:#10b981; font-size:0.8rem;">(Same Time)</span>`;
        const sign = diff > 0 ? "+" : "";
        return `<span style="color:#f59e0b; font-size:0.8rem;">(${sign}${diff}h vs DXB)</span>`;
    } catch (e) { return ""; }
}

// === Day/Night Icon Logic ===
function getDayNightIcon(timezone) {
    try {
        const hour = parseInt(new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric', hour12: false, timeZone: timezone
        }).format(new Date()));

        // Day is roughly 6 AM to 6 PM (18:00)
        return (hour >= 6 && hour < 18) 
            ? `<i data-lucide="sun" class="icon-sun"></i>` 
            : `<i data-lucide="moon" class="icon-moon"></i>`;
    } catch (e) { return ''; }
}

function renderCards(filterText = '') {
    container.innerHTML = ''; 

    if (!filterText.trim()) {
        clearBtn.classList.add('hidden');
        return; 
    }
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
        const timeDiff = getTimeDiff(airport.timezone);
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
                    <div>${timeDiff}</div>
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

closeModalBtn.onclick = () => modal.classList.add('hidden');
window.onclick = (event) => { if (event.target == modal) modal.classList.add('hidden'); }

searchInput.addEventListener('input', (e) => renderCards(e.target.value));

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderCards('');
    searchInput.focus();
});

setInterval(() => {
    // 1. Update the Main ZULU/DXB Clock
    updateLiveClock();

    // 2. Update each individual card clock
    document.querySelectorAll('.time-badge').forEach(el => {
        const timezone = el.getAttribute('data-timezone');
        const dayNightIcon = getDayNightIcon(timezone);
        el.innerHTML = `${dayNightIcon} ${getLocalTime(timezone)}`;
    });
    
    // Refresh Icons
    lucide.createIcons(); 
}, 1000);

// Run once on load
updateLiveClock();
renderCards('');
