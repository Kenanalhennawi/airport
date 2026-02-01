const container = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModal');

const countryCodes = {
    "Saudi Arabia": "sa", "UAE": "ae", "United Arab Emirates": "ae",
    "Ghana": "gh", "Ethiopia": "et", "Australia": "au", "Russia": "ru",
    "New Zealand": "nz", "Kazakhstan": "kz", "Algeria": "dz", "India": "in",
    "Jordan": "jo", "Netherlands": "nl", "Sweden": "se", "Turkmenistan": "tm",
    "Eritrea": "er", "Greece": "gr", "Turkey": "tr", "Bahrain": "bh",
    "Spain": "es", "Serbia": "rs", "Lebanon": "lb", "UK": "gb", "Iraq": "iq",
    "Italy": "it", "Thailand": "th", "USA": "us", "Belgium": "be",
    "Switzerland": "ch", "France": "fr", "Kyrgyzstan": "kg", "Hungary": "hu",
    "Egypt": "eg", "China": "cn", "Philippines": "ph", "Morocco": "ma",
    "South Africa": "za", "Vietnam": "vn", "Syria": "sy", "Tanzania": "tz",
    "Croatia": "hr", "Qatar": "qa", "Indonesia": "id", "Senegal": "sn",
    "Ireland": "ie", "Germany": "de", "Uganda": "ug", "Zimbabwe": "zw",
    "South Korea": "kr", "Iran": "ir", "Pakistan": "pk", "Japan": "jp",
    "Kenya": "ke", "Ivory Coast": "ci", "Norway": "no", "Romania": "ro",
    "Malaysia": "my", "Poland": "pl", "Sudan": "sd", "Nepal": "np",
    "Lithuania": "lt", "Montenegro": "me", "Israel": "il", "Taiwan": "tw",
    "Tunisia": "tn", "Uzbekistan": "uz", "Georgia": "ge", "Bulgaria": "bg",
    "Canada": "ca", "Oman": "om", "Bangladesh": "bd", "Sri Lanka": "lk",
    "Maldives": "mv", "Mauritius": "mu", "Seychelles": "sc", "Singapore": "sg",
    "Bosnia": "ba", "Austria": "at", "Kuwait": "kw", "Ukraine": "ua",
    "Czech Republic": "cz", "Tajikistan": "tj", "Somalia": "so", "Djibouti": "dj",
    "Zambia": "zm", "Portugal": "pt", "Yemen": "ye"
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

function getTimeDiff(timezone) {
    try {
        const now = new Date();
        const dubaiStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(now);
        const targetStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }).format(now);
        let diff = parseInt(targetStr) - parseInt(dubaiStr);
        if (diff > 12) diff -= 24;
        if (diff < -12) diff += 24;
        if (diff === 0) return `<span style="color:#10b981; font-size:0.8rem;">(Same Time)</span>`;
        const sign = diff > 0 ? "+" : "";
        return `<span style="color:#f59e0b; font-size:0.8rem;">(${sign}${diff}h vs DXB)</span>`;
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
clearBtn.addEventListener('click', () => { searchInput.value = ''; renderCards(''); searchInput.focus(); });

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
