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
    "Iraq": "iq", "Iran": "ir", "Syria": "sy", "Israel": "il", "Yemen": "ye", "Turkey": "tr", "Türkiye": "tr",
    "Egypt": "eg", "Sudan": "sd", "Djibouti": "dj", "Eritrea": "er", "Somalia": "so",
    "Ethiopia": "et", "South Sudan": "ss", "Kenya": "ke", "Uganda": "ug", "Tanzania": "tz",
    "Zanzibar": "tz", "South Africa": "za", "Nigeria": "ng", "Ghana": "gh", "Senegal": "sn",
    "Ivory Coast": "ci", "Morocco": "ma", "Tunisia": "tn", "Algeria": "dz", "Zambia": "zm",
    "Congo": "cg", "Democratic Republic of the Congo": "cd", "Zimbabwe": "zw", "Namibia": "na",
    "Rwanda": "rw", "Libya": "ly", "Mauritius": "mu", "Seychelles": "sc",
    "Russia": "ru", "Ukraine": "ua", "Belarus": "by", "Poland": "pl", "Romania": "ro",
    "Bulgaria": "bg", "Serbia": "rs", "Bosnia": "ba", "Bosnia and Herzegovina": "ba", "Montenegro": "me", "Croatia": "hr",
    "Slovenia": "si", "Hungary": "hu", "Czech Republic": "cz", "Slovakia": "sk",
    "Greece": "gr", "Italy": "it", "France": "fr", "Switzerland": "ch", "Austria": "at",
    "Germany": "de", "Netherlands": "nl", "Belgium": "be", "UK": "gb", "Ireland": "ie",
    "Spain": "es", "Portugal": "pt", "Finland": "fi", "Sweden": "se", "Norway": "no",
    "Denmark": "dk", "Lithuania": "lt", "Latvia": "lv", "Estonia": "ee", "Georgia": "ge", "Moldova": "md", "Albania": "al",
    "Azerbaijan": "az", "Armenia": "am", "Iceland": "is", "Malta": "mt", "Cyprus": "cy",
    "India": "in", "Pakistan": "pk", "Bangladesh": "bd", "Sri Lanka": "lk", "Nepal": "np",
    "Maldives": "mv", "Kazakhstan": "kz", "Kyrgyzstan": "kg", "Uzbekistan": "uz",
    "Turkmenistan": "tm", "Tajikistan": "tj", "Thailand": "th", "Malaysia": "my",
    "Singapore": "sg", "Indonesia": "id", "Philippines": "ph", "Vietnam": "vn",
    "China": "cn", "Hong Kong": "hk", "Taiwan": "tw", "South Korea": "kr", "Japan": "jp",
    "Myanmar": "mm", "Afghanistan": "af",
    "USA": "us", "Canada": "ca", "Mexico": "mx", "Brazil": "br", "Argentina": "ar",
    "Chile": "cl", "Colombia": "co", "Peru": "pe", "Venezuela": "ve", "Panama": "pa",
    "Australia": "au", "New Zealand": "nz", "Fiji": "fj",
    "Bermuda": "bm", "Cape Verde": "cv",
    "Papua New Guinea": "pg", "Solomon Islands": "sb", "New Caledonia": "nc",
    "Samoa": "ws", "Tonga": "to", "Réunion": "re", "Bhutan": "bt", "Ecuador": "ec"
};

// === DD/MM/YYYY MASKED INPUT (bypasses browser regional MM/DD) ===
function formatDateInput(el) {
    let v = el.value.replace(/[^\d]/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + '/' + v.slice(5, 9);
    el.value = v.slice(0, 10);
}

function formatTimeInput(el) {
    if (use12Hour()) {
        var raw = el.value;
        var digits = raw.replace(/\D/g, '').slice(0, 4);
        var ampm = raw.match(/([ap]m?)$/i);
        var suffix = ampm ? (ampm[1].toLowerCase().charAt(0) === 'p' ? ' PM' : ' AM') : '';
        if (digits.length === 4) digits = digits.slice(0, 2) + ':' + digits.slice(2);
        else if (digits.length === 3) digits = digits.slice(0, 1) + ':' + digits.slice(1);
        else if (digits.length === 2) digits = digits.slice(0, 1) + ':' + digits.slice(1, 2);
        el.value = digits + suffix;
        return;
    }
    let v = el.value.replace(/[^\d]/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + ':' + v.slice(2);
    el.value = v.slice(0, 5);
}

function parseTimeInput(str) {
    return parseTimeFlexible(str);
}
function parseTimeFlexible(str) {
    var s = (str || '').trim();
    if (!s || s.length < 4) return null;
    var m12 = s.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
    if (m12) {
        var hr = parseInt(m12[1], 10);
        var min = parseInt(m12[2], 10);
        if (min < 0 || min > 59) return null;
        if ((m12[3] || '').toLowerCase() === 'pm') { if (hr !== 12) hr += 12; } else { if (hr === 12) hr = 0; }
        if (hr < 0 || hr > 23) return null;
        return { hr: hr, min: min };
    }
    var parts = s.split(':');
    if (parts.length !== 2) return null;
    var hr = parseInt(parts[0], 10);
    var min = parseInt(parts[1], 10);
    if (!isValidTime(hr, min)) return null;
    return { hr: hr, min: min };
}
function formatTimeDisplay(hr, min, use12h) {
    if (use12h) {
        var h = hr === 0 ? 12 : (hr > 12 ? hr - 12 : hr);
        var suffix = hr < 12 ? ' AM' : ' PM';
        return (h < 10 ? '0' : '') + h + ':' + (min < 10 ? '0' : '') + min + suffix;
    }
    return (hr < 10 ? '0' : '') + hr + ':' + (min < 10 ? '0' : '') + min;
}

function isValidDate(d, m, y) {
    if (m < 1 || m > 12 || y < 1900 || y > 2100) return false;
    const daysInMonth = [31, (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return d >= 1 && d <= daysInMonth[m - 1];
}

function isValidTime(hr, min) {
    return hr >= 0 && hr <= 23 && min >= 0 && min <= 59;
}

// Converts (year, month, day, hour, min) in a given timezone to a UTC Date.
// Handles DST (summer/winter) via IANA timezones: offset is computed for the target date.
function localTimeInTimezoneToUTC(y, m, d, hr, min, timezone) {
    try {
        var refUtc = new Date(Date.UTC(y, m - 1, d, 12, 0));
        var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
        var tzParts = fmt.formatToParts(refUtc);
        var hourInTZ = parseInt(tzParts.find(function (p) { return p.type === 'hour'; }).value, 10);
        var minInTZ = parseInt(tzParts.find(function (p) { return p.type === 'minute'; }).value, 10);
        var offsetMinutes = (hourInTZ * 60 + minInTZ) - 720;
        var targetMinutes = hr * 60 + min;
        var utcMinutes = targetMinutes - offsetMinutes;
        return new Date(Date.UTC(y, m - 1, d, 0, 0) + utcMinutes * 60000);
    } catch (e) { return null; }
}

// === 24-HOUR CALCULATOR (time-only OR date+time) - uses airport's timezone ===
function calculateTimeDifference(iata, timezone) {
    const dIn = document.getElementById('dateIn-' + iata);
    const tIn = document.getElementById('timeIn-' + iata);
    const resultEl = document.getElementById('timeResult-' + iata);
    if (!dIn || !tIn || !resultEl) return;

    var tz = timezone;
    if (!tz) {
        var data = (typeof window !== 'undefined' && window.airportsData) || [];
        var apt = Array.isArray(data) ? data.find(function (a) { return a.iata === iata; }) : null;
        tz = apt ? apt.timezone : 'Asia/Dubai';
    }

    const dStr = dIn.value.trim();
    const tStr = tIn.value.trim();
    const now = new Date();

    var parsed = parseTimeInput(tStr);
    if (!parsed) {
        var msg = (tStr.length >= 3) ? 'Invalid time' : 'Enter time (' + (use12Hour() ? 'h:MM AM/PM' : 'HH:MM') + ')';
        resultEl.innerHTML = (dStr || tStr) ? '<span style="color:' + (tStr.length >= 3 ? '#dc2626' : '#64748b') + ';font-size:0.8rem;font-weight:' + (tStr.length >= 3 ? 'bold' : 'normal') + ';">' + msg + '</span>' : '';
        return;
    }
    var hr = parsed.hr, min = parsed.min;

    var targetDate;
    if (dStr.length >= 10) {
        var parts = dStr.split('/').map(Number);
        var d = parts[0], m = parts[1], y = parts[2];
        if (!isValidDate(d, m, y)) {
            resultEl.innerHTML = '<span style="color:#dc2626;font-weight:bold;">Invalid date</span>';
            return;
        }
        targetDate = localTimeInTimezoneToUTC(y, m, d, hr, min, tz);
    } else {
        var pt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now);
        var y = parseInt(pt.find(function (p) { return p.type === 'year'; }).value, 10);
        var m = parseInt(pt.find(function (p) { return p.type === 'month'; }).value, 10);
        var d = parseInt(pt.find(function (p) { return p.type === 'day'; }).value, 10);
        targetDate = localTimeInTimezoneToUTC(y, m, d, hr, min, tz);
    }
    if (!targetDate) {
        resultEl.innerHTML = '<span style="color:#dc2626;font-weight:bold;">Invalid timezone</span>';
        return;
    }

    const absDiff = Math.abs(targetDate - now);
    const totalMs = absDiff;
    const days = Math.floor(totalMs / 86400000);
    const hours = Math.floor((totalMs % 86400000) / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const status = (targetDate - now) > 0 ? 'remaining' : 'passed';
    const color = (targetDate - now) > 0 ? '#16a34a' : '#dc2626';

    var parts = [];
    if (days > 0) parts.push(days + ' day' + (days !== 1 ? 's' : ''));
    parts.push(hours + 'h');
    parts.push(minutes + 'm');
    const display = parts.join(' ') + ' ' + status;

    resultEl.innerHTML = '<span style="color:' + color + ';font-weight:bold;display:block;margin-top:5px;">' + display + '</span>';
}

// === TIME FORMAT PREFERENCE (12h / 24h) ===
function getTimeFormatPreference() {
    try { return (localStorage.getItem('timeFormat') || '24'); } catch (e) { return '24'; }
}
function setTimeFormatPreference(val) {
    try { localStorage.setItem('timeFormat', val === '12' ? '12' : '24'); } catch (e) {}
}
function use12Hour() { return getTimeFormatPreference() === '12'; }
function getTimePlaceholder() { return use12Hour() ? 'h:MM AM/PM' : 'HH:MM'; }

// === HELPER FUNCTIONS (DST handled via IANA timezones) ===
function getLocalTime(timezone) {
    try {
        var s = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone, hour12: use12Hour() }).format(new Date());
        return s.replace(/\bam\b/gi, 'AM').replace(/\bpm\b/gi, 'PM');
    } catch (e) { return '--:--'; }
}

function getTimezoneAbbr(timezone) {
    try {
        var parts = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, timeZoneName: 'short' }).formatToParts(new Date());
        var tz = parts.find(function (p) { return p.type === 'timeZoneName'; });
        return tz ? tz.value : '';
    } catch (e) { return ''; }
}

function getFlagUrl(countryName) {
    const code = countryCodes[countryName.split('/')[0].trim()] || 'un';
    return 'https://flagcdn.com/w40/' + code + '.png';
}

function formatTimeDiffDisplay(diffMinutes) {
    var sign = diffMinutes >= 0 ? '+' : '-';
    var abs = Math.abs(diffMinutes);
    var h = Math.floor(abs / 60);
    var m = abs % 60;
    if (m === 0) return sign + h + 'h';
    if (h === 0) return sign + m + 'm';
    return sign + h + 'h ' + m + 'm';
}

function getTimeDiffHTML(timezone) {
    try {
        var now = new Date();
        var utcNoon = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0));
        var dxbFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: false });
        var tgtFmt = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
        var dxbParts = dxbFmt.formatToParts(utcNoon);
        var tgtParts = tgtFmt.formatToParts(utcNoon);
        var dxbMin = parseInt(dxbParts.find(function (p) { return p.type === 'hour'; }).value, 10) * 60 + parseInt(dxbParts.find(function (p) { return p.type === 'minute'; }).value, 10);
        var tgtMin = parseInt(tgtParts.find(function (p) { return p.type === 'hour'; }).value, 10) * 60 + parseInt(tgtParts.find(function (p) { return p.type === 'minute'; }).value, 10);
        var diffMinutes = tgtMin - dxbMin;
        if (diffMinutes > 720) diffMinutes -= 1440;
        if (diffMinutes < -720) diffMinutes += 1440;
        if (diffMinutes === 0) return '<span class="time-diff diff-same">(Same Time)</span>';
        var txt = formatTimeDiffDisplay(diffMinutes) + ' vs DXB';
        return diffMinutes > 0 ? '<span class="time-diff diff-plus">(' + txt + ')</span>' : '<span class="time-diff diff-minus">(' + txt + ')</span>';
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
    var opts = { hour12: use12Hour(), hour: '2-digit', minute: '2-digit', second: '2-digit' };
    var fmt = function (tz) {
        var s = now.toLocaleTimeString('en-GB', Object.assign({ timeZone: tz }, opts));
        return s.replace(/\bam\b/gi, 'AM').replace(/\bpm\b/gi, 'PM');
    };
    if (utcEl) utcEl.textContent = fmt('UTC');
    if (dxbEl) dxbEl.textContent = fmt('Asia/Dubai');
}

// === INTERLINE: Populate from hidden carrier source (55 carriers) ===
function populateInterlineTable() {
    const carrierModal = document.getElementById('carrierModal');
    const carrierTableBody = document.getElementById('carrierTableBody');
    const modalTable = carrierModal && carrierModal.querySelector('.carrier-table');
    if (!modalTable || !modalTable.tBodies[0] || !carrierTableBody) return;

    carrierTableBody.innerHTML = '';
    const rows = Array.from(modalTable.tBodies[0].rows).map(r => r.cloneNode(true));
    const seen = new Set();
    const unique = rows.filter(r => {
        const code = (r.cells[2] && r.cells[2].textContent || '').trim();
        if (!code || seen.has(code)) return false;
        seen.add(code);
        return true;
    });
    unique.sort((a, b) => {
        const nameA = (a.cells[1] && a.cells[1].textContent || '').trim().toLowerCase();
        const nameB = (b.cells[1] && b.cells[1].textContent || '').trim().toLowerCase();
        return nameA.localeCompare(nameB);
    });
    unique.forEach((row, i) => {
        if (row.cells[0]) row.cells[0].textContent = i + 1;
        carrierTableBody.appendChild(row);
    });
}

let carrierFilterMode = 'all';
function filterCarriers(query) {
    const tbody = document.getElementById('carrierTableBody');
    if (!tbody) return;
    const q = (query || '').trim().toLowerCase();
    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        const carrier = (row.cells[1] && row.cells[1].textContent) || '';
        const code = (row.cells[2] && row.cells[2].textContent) || '';
        const host = (row.cells[4] && row.cells[4].textContent) || '';
        const iatci = (row.cells[6] && row.cells[6].textContent || '').trim().toUpperCase();
        const bag = (row.cells[9] && row.cells[9].textContent || '').trim().toUpperCase();
        const searchMatch = !q || carrier.toLowerCase().includes(q) || code.toLowerCase().includes(q) || host.toLowerCase().includes(q);
        let filterMatch = true;
        if (carrierFilterMode === 'iatci') filterMatch = iatci === 'YES';
        else if (carrierFilterMode === 'iet') filterMatch = bag === 'YES';
        row.style.display = (searchMatch && filterMatch) ? '' : 'none';
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
    const containerEl = document.querySelector('.container');
    if (!airportsPanel || !interlinePanel) return;

    if (containerEl) containerEl.classList.toggle('interline-active', view === 'interline');

    if (view === 'airports') {
        airportsPanel.classList.add('active');
        interlinePanel.classList.remove('active');
        if (tabAirports) { tabAirports.classList.add('active'); tabAirports.setAttribute('aria-pressed', 'true'); }
        if (tabInterline) { tabInterline.classList.remove('active'); tabInterline.setAttribute('aria-pressed', 'false'); }
        if (searchInput) searchInput.placeholder = 'Search IATA, City, or Country...';
        renderCards(searchInput ? searchInput.value : '');
    } else {
        interlinePanel.classList.add('active');
        airportsPanel.classList.remove('active');
        if (tabInterline) { tabInterline.classList.add('active'); tabInterline.setAttribute('aria-pressed', 'true'); }
        if (tabAirports) { tabAirports.classList.remove('active'); tabAirports.setAttribute('aria-pressed', 'false'); }
        if (searchInput) searchInput.placeholder = 'Search carrier name or code...';
        if (clearBtn) {
            if (searchInput && searchInput.value.trim()) clearBtn.classList.remove('hidden');
            else clearBtn.classList.add('hidden');
        }
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
    if (clearBtn) {
        if (query) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
    }

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
        card.dataset.iata = airport.iata;
        card.innerHTML =
            '<div class="card-clickable">' +
            '<div class="card-header"><div><div class="iata-code">' + airport.iata + '</div><div class="city-name"><img src="' + getFlagUrl(airport.iata === 'HKG' ? 'Hong Kong' : airport.country) + '" class="flag-icon" alt=""> ' + airport.city + '</div></div>' +
            '<div class="time-container"><div class="time-badge" data-timezone="' + airport.timezone + '">' + getDayNightIcon(airport.timezone) + ' ' + getLocalTime(airport.timezone) + '</div><div>' + getTimeDiffHTML(airport.timezone) + '</div></div></div>' +
            '<div class="terminal-info"><i data-lucide="plane-landing" style="width:16px"></i><span>' + airport.terminal + '</span></div>' +
            '<div class="distance-preview"><i data-lucide="car" style="width:16px"></i><span>' + airport.distanceCenter + '</span></div></div>' +
            '<div class="calc-section" style="margin-top:15px;padding-top:10px;border-top:1px solid rgba(0,0,0,0.05);">' +
            '<label style="font-size:0.7rem;font-weight:bold;color:var(--fz-blue);text-transform:uppercase;">Check Hours (DD/MM/YYYY ' + getTimePlaceholder() + '):</label>' +
            '<div style="display:flex;gap:5px;margin-top:5px;align-items:center;">' +
            '<div style="flex:1;display:flex;gap:4px;">' +
            '<input type="text" id="dateIn-' + airport.iata + '" placeholder="DD/MM/YYYY" maxlength="10" style="flex:1;font-size:0.8rem;padding:5px;border-radius:5px;border:1px solid #ddd;">' +
            '<input type="date" id="datePicker-' + airport.iata + '" title="Pick date" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;">' +
            '<button type="button" class="cal-btn" title="Pick date" style="flex-shrink:0;width:36px;height:34px;margin:0;padding:0;border:1px solid #ddd;border-radius:5px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--fz-blue);"><i data-lucide="calendar" style="width:18px;height:18px;"></i></button>' +
            '</div>' +
            '<input type="text" id="timeIn-' + airport.iata + '" placeholder="' + getTimePlaceholder() + '" maxlength="' + (use12Hour() ? 10 : 5) + '" style="width:' + (use12Hour() ? 110 : 80) + 'px;font-size:0.8rem;padding:5px;border-radius:5px;border:1px solid #ddd;" class="calc-time-input">' +
            '</div><div id="timeResult-' + airport.iata + '" style="text-align:center;font-size:0.85rem;min-height:1.5em;margin-top:5px;"></div></div>';

        const dateIn = card.querySelector('#dateIn-' + airport.iata);
        const timeIn = card.querySelector('#timeIn-' + airport.iata);
        const runCalc = function () {
            if (dateIn) formatDateInput(dateIn);
            if (timeIn) formatTimeInput(timeIn);
            calculateTimeDifference(airport.iata, airport.timezone);
        };
        if (dateIn) {
            dateIn.addEventListener('input', runCalc);
            dateIn.addEventListener('change', runCalc);
            dateIn.addEventListener('paste', function () { setTimeout(runCalc, 0); });
        }
        if (timeIn) {
            timeIn.addEventListener('input', runCalc);
            timeIn.addEventListener('change', runCalc);
            timeIn.addEventListener('paste', function () { setTimeout(runCalc, 0); });
        }

        var datePicker = card.querySelector('#datePicker-' + airport.iata);
        var calBtn = datePicker && datePicker.nextElementSibling;
        if (datePicker && calBtn) {
            calBtn.onclick = function (e) {
                e.stopPropagation();
                try {
                    if (datePicker.showPicker) datePicker.showPicker();
                    else datePicker.click();
                } catch (err) { datePicker.click(); }
            };
            datePicker.addEventListener('change', function () {
                var v = datePicker.value;
                if (v) {
                    var p = v.split('-');
                    dateIn.value = p[2] + '/' + p[1] + '/' + p[0];
                    runCalc();
                }
            });
        }

        container.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openModal(data) {
    if (!data || !modal) return;
    const modalIata = document.getElementById('modalIata');
    const modalCity = document.getElementById('modalCity');
    const modalDistance = document.getElementById('modalDistance');
    const modalOtherAirports = document.getElementById('modalOtherAirports');
    const modalPhone = document.getElementById('modalPhone');
    const modalMapBtn = document.getElementById('modalMapBtn');
    const modalWebBtn = document.getElementById('modalWebBtn');
    if (modalIata) modalIata.textContent = data.iata || '';
    if (modalCity) modalCity.textContent = (data.city || '') + ', ' + (data.country || '');
    if (modalDistance) modalDistance.textContent = data.distanceCenter || '';
    if (modalOtherAirports) modalOtherAirports.textContent = data.nearbyAirports || '';
    if (modalPhone) modalPhone.textContent = data.phone || '';
    if (modalMapBtn) modalMapBtn.href = data.locationUrl || '#';
    if (modalWebBtn) modalWebBtn.href = data.website || '#';
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// === INITIALIZATION ===
function init() {
    updateLiveClock();
    populateInterlineTable();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const carrierModal = document.getElementById('carrierModal');
    const closeCarrierModal = document.getElementById('closeCarrierModal');
    if (closeModalBtn) closeModalBtn.onclick = function () { modal.classList.add('hidden'); };
    window.onclick = function (e) { if (e.target === modal) modal.classList.add('hidden'); };
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (modal && !modal.classList.contains('hidden')) modal.classList.add('hidden');
            if (carrierModal && !carrierModal.classList.contains('hidden')) carrierModal.classList.add('hidden');
        }
    });

    if (container) {
        container.addEventListener('click', function (e) {
            if (e.target.closest('input') || e.target.closest('button')) return;
            const card = e.target.closest('.card');
            if (!card) return;
            const iata = card.dataset.iata || (card.querySelector('.iata-code') && card.querySelector('.iata-code').textContent);
            if (!iata) return;
            const data = (typeof window !== 'undefined' && window.airportsData) || [];
            const airportsData = Array.isArray(data) ? data : [];
            const airport = airportsData.find(function (a) { return a.iata === iata; });
            if (airport) openModal(airport);
        });
    }

    if (closeCarrierModal && carrierModal) closeCarrierModal.onclick = function () { carrierModal.classList.add('hidden'); };
    if (carrierModal) carrierModal.onclick = function (e) { if (e.target === carrierModal) carrierModal.classList.add('hidden'); };

    const tabAirports = document.getElementById('tabAirports');
    const tabInterline = document.getElementById('tabInterline');
    if (tabAirports) tabAirports.onclick = function () { switchView('airports'); };
    if (tabInterline) tabInterline.onclick = function () { switchView('interline'); };

    document.querySelectorAll('.carrier-filter-btn').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('.carrier-filter-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            carrierFilterMode = btn.dataset.filter || 'all';
            filterCarriers(searchInput ? searchInput.value : '');
        };
    });

    if (searchInput) searchInput.addEventListener('input', function () {
        var val = searchInput.value;
        if (clearBtn) {
            if (val.trim()) clearBtn.classList.remove('hidden');
            else clearBtn.classList.add('hidden');
        }
        if (currentView === 'airports') renderCards(val);
        else filterCarriers(val);
    });
    if (clearBtn) clearBtn.onclick = function () {
        searchInput.value = '';
        clearBtn.classList.add('hidden');
        renderCards('');
        switchView(currentView);
    };

    function syncFormatButtons() {
        var pref = getTimeFormatPreference();
        var btn12 = document.getElementById('format12h');
        var btn24 = document.getElementById('format24h');
        if (btn12) btn12.classList.toggle('active', pref === '12');
        if (btn24) btn24.classList.toggle('active', pref === '24');
    }
    syncFormatButtons();
    var btn12 = document.getElementById('format12h');
    var btn24 = document.getElementById('format24h');
    function refreshAllTimes() {
        updateLiveClock();
        document.querySelectorAll('.time-badge').forEach(function (el) {
            const tz = el.getAttribute('data-timezone');
            el.innerHTML = getDayNightIcon(tz) + ' ' + getLocalTime(tz);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    function updateTimeInputPlaceholders() {
        document.querySelectorAll('.calc-time-input').forEach(function (el) {
            el.placeholder = getTimePlaceholder();
            el.maxLength = use12Hour() ? 10 : 5;
            el.style.width = use12Hour() ? '110px' : '80px';
        });
    }
    function convertAllTimeInputs() {
        document.querySelectorAll('.calc-time-input').forEach(function (el) {
            var val = (el.value || '').trim();
            if (!val) return;
            var p = parseTimeFlexible(val);
            if (p) {
                el.value = formatTimeDisplay(p.hr, p.min, use12Hour());
                var iata = (el.id || '').replace('timeIn-', '');
                if (iata) calculateTimeDifference(iata, null);
            }
        });
    }
    if (btn12) btn12.onclick = function () { setTimeFormatPreference('12'); syncFormatButtons(); refreshAllTimes(); updateTimeInputPlaceholders(); convertAllTimeInputs(); };
    if (btn24) btn24.onclick = function () { setTimeFormatPreference('24'); syncFormatButtons(); refreshAllTimes(); updateTimeInputPlaceholders(); convertAllTimeInputs(); };

    setInterval(refreshAllTimes, 1000);

    switchView('airports');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(function () { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
