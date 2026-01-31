// 1. تعريف العناصر من الصفحة
const container = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');

// 2. دالة حساب الوقت المحلي
function getLocalTime(timezone) {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone,
            hour12: false
        }).format(new Date());
    } catch (e) {
        return "--:--";
    }
}

// 3. دالة رسم الكروت (Rendering)
function renderCards(filterText = '') {
    container.innerHTML = ''; // مسح القديم

    const filtered = airportsData.filter(airport => 
        airport.iata.toLowerCase().includes(filterText.toLowerCase()) ||
        airport.city.toLowerCase().includes(filterText.toLowerCase()) ||
        airport.country.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: white; margin-top: 50px;">
                <h3 style="font-size: 1.5rem;">No destination found for "${filterText}"</h3>
            </div>
        `;
        return;
    }

    filtered.forEach(airport => {
        // تحديد هل يوجد تنبيه أم لا
        const hasAlert = airport.alert ? 'alert-active' : '';
        
        // بناء كود HTML للكارت
        const cardHTML = `
            <div class="card ${hasAlert}">
                <div class="card-header">
                    <div>
                        <div class="iata-code">${airport.iata}</div>
                        <div class="city-name">${airport.city}, ${airport.country}</div>
                    </div>
                    <div class="time-badge" data-timezone="${airport.timezone}">
                        ${getLocalTime(airport.timezone)}
                    </div>
                </div>

                <div class="terminal-info">
                    <i data-lucide="map-pin" style="width:18px"></i>
                    <span>${airport.terminal}</span>
                </div>

                ${airport.alert ? `
                <div class="alert-box">
                    <i data-lucide="alert-triangle" style="width:20px; flex-shrink:0;"></i>
                    <span>${airport.alert}</span>
                </div>
                ` : ''}
            </div>
        `;
        
        container.innerHTML += cardHTML;
    });

    // إعادة تفعيل الأيقونات
    lucide.createIcons();
}

// 4. تشغيل البحث
searchInput.addEventListener('input', (e) => {
    renderCards(e.target.value);
});

// 5. تحديث الساعة كل ثانية
setInterval(() => {
    document.querySelectorAll('.time-badge').forEach(el => {
        const timezone = el.getAttribute('data-timezone');
        el.textContent = getLocalTime(timezone);
    });
}, 1000);

// التشغيل الأولي عند فتح الصفحة
renderCards();
