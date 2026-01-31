// DOM Elements
const container = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModal');

// Time Function
function getLocalTime(timezone) {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone,
            hour12: false
        }).format(new Date());
    } catch (e) {
        return "--:--";
    }
}

// Render Cards
function renderCards(filterText = '') {
    container.innerHTML = ''; 

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
        // Create Card Element
        const card = document.createElement('div');
        card.className = 'card';
        // Add Click Event to Open Modal
        card.onclick = () => openModal(airport);

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="iata-code">${airport.iata}</div>
                    <div class="city-name">${airport.city}</div>
                </div>
                <div class="time-badge" data-timezone="${airport.timezone}">
                    ${getLocalTime(airport.timezone)}
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

// Modal Functions
function openModal(data) {
    // Fill Data
    document.getElementById('modalIata').textContent = data.iata;
    document.getElementById('modalCity').textContent = `${data.city}, ${data.country}`;
    document.getElementById('modalDistance').textContent = data.distanceCenter;
    document.getElementById('modalOtherAirports').textContent = data.nearbyAirports;
    document.getElementById('modalPhone').textContent = data.phone;
    
    // Set Links
    document.getElementById('modalMapBtn').href = data.locationUrl;
    document.getElementById('modalWebBtn').href = data.website;

    // Show Modal
    modal.classList.remove('hidden');
    lucide.createIcons();
}

// Close Modal
closeModalBtn.onclick = () => modal.classList.add('hidden');
window.onclick = (event) => {
    if (event.target == modal) {
        modal.classList.add('hidden');
    }
}

// Live Search & Time Update
searchInput.addEventListener('input', (e) => renderCards(e.target.value));

setInterval(() => {
    document.querySelectorAll('.time-badge').forEach(el => {
        const timezone = el.getAttribute('data-timezone');
        el.textContent = getLocalTime(timezone);
    });
}, 1000);

// Initial Render
renderCards();
