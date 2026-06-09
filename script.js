/**
 * FlyDubai Ops Guide - Production-Ready Script
 * Airport operations tool with interline data, 24h calculator, live clocks, and PayPort currency tab.
 */

const container = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModal');

const PAYPORT_PROXY_URL =
    "https://payport-proxy.dominater988.workers.dev/api/convert";

const PAYPORT_PROXY_VERSION = "1.1";

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
    "Russia": "ru", "Russian Federation": "ru", "Ukraine": "ua", "Belarus": "by", "Poland": "pl", "Romania": "ro",
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
    "USA": "us", "United States": "us", "Guam": "gu", "Canada": "ca", "Mexico": "mx", "Brazil": "br", "Argentina": "ar",
    "Chile": "cl", "Colombia": "co", "Peru": "pe", "Venezuela": "ve", "Panama": "pa",
    "Australia": "au", "New Zealand": "nz", "Fiji": "fj",
    "Bermuda": "bm", "Cape Verde": "cv",
    "Papua New Guinea": "pg", "Solomon Islands": "sb", "New Caledonia": "nc",
    "Samoa": "ws", "Tonga": "to", "Réunion": "re", "Bhutan": "bt", "Ecuador": "ec"
};

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

        if ((m12[3] || '').toLowerCase() === 'pm') {
            if (hr !== 12) hr += 12;
        } else {
            if (hr === 12) hr = 0;
        }

        if (hr < 0 || hr > 23) return null;

        return { hr: hr, min: min };
    }

    var parts = s.split(':');

    if (parts.length !== 2) return null;

    var hour = parseInt(parts[0], 10);
    var minute = parseInt(parts[1], 10);

    if (!isValidTime(hour, minute)) return null;

    return { hr: hour, min: minute };
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

    const daysInMonth = [
        31,
        (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    return d >= 1 && d <= daysInMonth[m - 1];
}

function isValidTime(hr, min) {
    return hr >= 0 && hr <= 23 && min >= 0 && min <= 59;
}

function getTimezoneOffsetMinutes(timezone, date) {
    var fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    var parts = fmt.formatToParts(date).reduce(function (acc, p) {
        if (p.type !== 'literal') acc[p.type] = p.value;
        return acc;
    }, {});

    var asUTC = Date.UTC(
        parseInt(parts.year, 10),
        parseInt(parts.month, 10) - 1,
        parseInt(parts.day, 10),
        parseInt(parts.hour, 10),
        parseInt(parts.minute, 10),
        parseInt(parts.second, 10)
    );

    return Math.round((asUTC - date.getTime()) / 60000);
}

function localTimeInTimezoneToUTC(y, m, d, hr, min, timezone) {
    try {
        var utcGuess = new Date(Date.UTC(y, m - 1, d, hr, min, 0));

        for (var i = 0; i < 4; i++) {
            var offsetMinutes = getTimezoneOffsetMinutes(timezone, utcGuess);
            var nextGuess = new Date(Date.UTC(y, m - 1, d, hr, min, 0) - offsetMinutes * 60000);

            if (Math.abs(nextGuess.getTime() - utcGuess.getTime()) < 1000) break;

            utcGuess = nextGuess;
        }

        return utcGuess;
    } catch (e) {
        return null;
    }
}

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

        resultEl.innerHTML = (dStr || tStr)
            ? '<span style="color:' + (tStr.length >= 3 ? '#dc2626' : '#64748b') + ';font-size:0.8rem;font-weight:' + (tStr.length >= 3 ? 'bold' : 'normal') + ';">' + msg + '</span>'
            : '';

        return;
    }

    var hr = parsed.hr;
    var min = parsed.min;
    var targetDate;

    if (dStr.length >= 10) {
        var parts = dStr.split('/').map(Number);
        var d = parts[0];
        var m = parts[1];
        var y = parts[2];

        if (!isValidDate(d, m, y)) {
            resultEl.innerHTML = '<span style="color:#dc2626;font-weight:bold;">Invalid date</span>';
            return;
        }

        targetDate = localTimeInTimezoneToUTC(y, m, d, hr, min, tz);
    } else {
        var pt = new Intl.DateTimeFormat('en-CA', {
            timeZone: tz,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).formatToParts(now);

        var currentYear = parseInt(pt.find(function (p) { return p.type === 'year'; }).value, 10);
        var currentMonth = parseInt(pt.find(function (p) { return p.type === 'month'; }).value, 10);
        var currentDay = parseInt(pt.find(function (p) { return p.type === 'day'; }).value, 10);

        targetDate = localTimeInTimezoneToUTC(currentYear, currentMonth, currentDay, hr, min, tz);
    }

    if (!targetDate) {
        resultEl.innerHTML = '<span style="color:#dc2626;font-weight:bold;">Invalid timezone</span>';
        return;
    }

    const absDiff = Math.abs(targetDate - now);
    const days = Math.floor(absDiff / 86400000);
    const hours = Math.floor((absDiff % 86400000) / 3600000);
    const minutes = Math.floor((absDiff % 3600000) / 60000);
    const status = (targetDate - now) > 0 ? 'remaining' : 'passed';
    const color = (targetDate - now) > 0 ? '#16a34a' : '#dc2626';

    var outputParts = [];

    if (days > 0) outputParts.push(days + ' day' + (days !== 1 ? 's' : ''));

    outputParts.push(hours + 'h');
    outputParts.push(minutes + 'm');

    const display = outputParts.join(' ') + ' ' + status;

    resultEl.innerHTML = '<span style="color:' + color + ';font-weight:bold;display:block;margin-top:5px;">' + display + '</span>';
}

function getTimeFormatPreference() {
    try {
        return localStorage.getItem('timeFormat') || '24';
    } catch (e) {
        return '24';
    }
}

function setTimeFormatPreference(val) {
    try {
        localStorage.setItem('timeFormat', val === '12' ? '12' : '24');
    } catch (e) {}
}

function use12Hour() {
    return getTimeFormatPreference() === '12';
}

function getTimePlaceholder() {
    return use12Hour() ? 'h:MM AM/PM' : 'HH:MM';
}

function getLocalTime(timezone) {
    try {
        var s = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone,
            hour12: use12Hour()
        }).format(new Date());

        return s.replace(/\bam\b/gi, 'AM').replace(/\bpm\b/gi, 'PM');
    } catch (e) {
        return '--:--';
    }
}

function getFlagUrl(countryName) {
    const normalizedCountry = String(countryName || '').split('/')[0].trim();
    const code = countryCodes[normalizedCountry] || 'un';
    return 'https://flagcdn.com/w40/' + code + '.png';
}

function escapeHTML(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function hasValue(value) {
    return typeof value === 'string' ? value.trim() !== '' : !!value;
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
        var diffMinutes = getTimezoneOffsetMinutes(timezone, now) - getTimezoneOffsetMinutes('Asia/Dubai', now);

        if (diffMinutes === 0) return '<span class="time-diff diff-same">(Same Time)</span>';

        var txt = formatTimeDiffDisplay(diffMinutes) + ' vs DXB';

        return diffMinutes > 0
            ? '<span class="time-diff diff-plus">(' + txt + ')</span>'
            : '<span class="time-diff diff-minus">(' + txt + ')</span>';
    } catch (e) {
        return '';
    }
}

function getDayNightIcon(timezone) {
    try {
        const hour = parseInt(new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric',
            hour12: false,
            timeZone: timezone
        }).format(new Date()));

        return (hour >= 6 && hour < 18)
            ? '<i data-lucide="sun" class="icon-sun"></i>'
            : '<i data-lucide="moon" class="icon-moon"></i>';
    } catch (e) {
        return '';
    }
}

function updateLiveClock() {
    const now = new Date();
    const utcEl = document.getElementById('utcTime');
    const dxbEl = document.getElementById('dxbTime');

    var opts = {
        hour12: use12Hour(),
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    var fmt = function (tz) {
        var s = now.toLocaleTimeString('en-GB', Object.assign({ timeZone: tz }, opts));
        return s.replace(/\bam\b/gi, 'AM').replace(/\bpm\b/gi, 'PM');
    };

    if (utcEl) utcEl.textContent = fmt('UTC');
    if (dxbEl) dxbEl.textContent = fmt('Asia/Dubai');
}

function populateInterlineTable() {
    const carrierModal = document.getElementById('carrierModal');
    const carrierTableBody = document.getElementById('carrierTableBody');
    const modalTable = carrierModal && carrierModal.querySelector('.carrier-table');

    if (!modalTable || !modalTable.tBodies[0] || !carrierTableBody) return;

    carrierTableBody.innerHTML = '';

    const rows = Array.from(modalTable.tBodies[0].rows).map(function (r) {
        return r.cloneNode(true);
    });

    const seen = new Set();

    const unique = rows.filter(function (r) {
        const code = (r.cells[2] && r.cells[2].textContent || '').trim();

        if (!code || seen.has(code)) return false;

        seen.add(code);
        return true;
    });

    unique.sort(function (a, b) {
        const nameA = (a.cells[1] && a.cells[1].textContent || '').trim().toLowerCase();
        const nameB = (b.cells[1] && b.cells[1].textContent || '').trim().toLowerCase();

        return nameA.localeCompare(nameB);
    });

    unique.forEach(function (row, i) {
        if (row.cells[0]) row.cells[0].textContent = i + 1;
        carrierTableBody.appendChild(row);
    });
}

var delayPolicyData = [
    { airports: 'ALA', std03: 'X', etd03: 'X', closure90: '√', closure30: '√', closureTime: 'ETD-60' },
    { airports: 'IST', std03: 'X', etd03: 'X', closure90: '√', closure30: '√', closureTime: 'ETD-60' },
    { airports: 'DXB/DWC', std03: 'X', etd03: 'X', closure90: '√', closure30: '√', closureTime: 'ETD-60' },
    { airports: 'BEG', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BSR', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BGW', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BUD', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'CTA', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'LJU', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'NAP', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'NJF', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'PSA', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'SJJ', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'SZG', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'TIA', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'ZAG', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'CMB', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'CGP', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'DAC', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'HGA', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'JIB', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'JUB', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'KTM', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'LYP', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'MGQ', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'MUX', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'UET', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'RUH', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'JMK', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'JTR', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'CFU', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'PRG', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BGY', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BSL', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'OLB', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'TIV', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'DBV', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'EBL', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'ISU', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'AMM', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BEY', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'AYT', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'DAM', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'TZX', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BJV', std03: '√', etd03: '√', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'All Other', std03: '√', etd03: 'X', closure90: 'X', closure30: '√', closureTime: 'ETD-60' }
];

function formatMark(value) {
    if (value === '√') return '<span class="delay-yes">√</span>';
    return '<span class="delay-no">X</span>';
}

function populateDelayPolicyTable() {
    var tbody = document.getElementById('delayPolicyBody');

    if (!tbody) return;

    tbody.innerHTML = '';

    delayPolicyData.forEach(function (r) {
        var tr = document.createElement('tr');

        tr.dataset.airports = r.airports.toLowerCase();

        var isStd = r.closureTime.indexOf('STD') >= 0;

        tr.dataset.closureType = isStd ? 'std' : 'etd';
        tr.classList.add('delay-row-' + (isStd ? 'std' : 'etd'));

        var closureBadge =
            '<span class="closure-badge closure-' +
            (isStd ? 'std' : 'etd') +
            '">' +
            r.closureTime +
            '</span>';

        tr.innerHTML =
            '<td><strong>' + r.airports + '</strong></td>' +
            '<td>' + formatMark(r.std03) + '</td>' +
            '<td>' + formatMark(r.etd03) + '</td>' +
            '<td>' + formatMark(r.closure90) + '</td>' +
            '<td>' + formatMark(r.closure30) + '</td>' +
            '<td class="closure-cell">' + closureBadge + '</td>';

        tbody.appendChild(tr);
    });

    filterDelayPolicy(
        document.getElementById('delayPolicySearch')
            ? document.getElementById('delayPolicySearch').value
            : ''
    );
}

function filterDelayPolicy(query) {
    var tbody = document.getElementById('delayPolicyBody');

    if (!tbody) return;

    var q = (query || '').trim().toLowerCase();
    var allOtherRow = null;
    var hasMatch = false;
    var matchedRows = [];

    for (var i = 0; i < tbody.rows.length; i++) {
        var row = tbody.rows[i];
        var airports = (row.dataset.airports || '').toLowerCase();
        var isAllOther = airports.indexOf('all other') >= 0;

        if (isAllOther) allOtherRow = row;

        var match =
            !q ||
            airports.indexOf(q) >= 0 ||
            airports.split('/').some(function (a) {
                return a.trim().indexOf(q) >= 0;
            });

        if (match) {
            hasMatch = true;
            if (q && !isAllOther) matchedRows.push(row);
        }

        row.style.display = match ? '' : 'none';
        row.classList.remove('delay-result-highlight', 'delay-all-other', 'delay-row-std', 'delay-row-etd');

        if (match && q) {
            row.classList.add('delay-result-highlight');

            var ct = row.dataset.closureType || '';

            if (ct === 'std') row.classList.add('delay-row-std');
            else row.classList.add('delay-row-etd');
        }
    }

    var hintEl = document.getElementById('delaySearchHint');
    var summaryEl = document.getElementById('delayResultSummary');

    if (q && allOtherRow && !hasMatch) {
        allOtherRow.style.display = '';
        allOtherRow.classList.add('delay-result-highlight', 'delay-all-other', 'delay-row-etd');

        if (hintEl) {
            hintEl.textContent = 'Airport not in list — applies: All Other';
            hintEl.classList.remove('hidden');
        }

        if (summaryEl) {
            summaryEl.innerHTML = '<span class="delay-summary-label">Result:</span> <strong>All Other</strong> — <span class="closure-badge closure-etd">ETD-60</span> (ETD-based)';
            summaryEl.classList.remove('hidden');
        }
    } else {
        if (hintEl) hintEl.classList.add('hidden');

        if (summaryEl) {
            if (q && matchedRows.length > 0) {
                var first = matchedRows[0];
                var apt = first.cells[0] ? first.cells[0].textContent.trim() : '';
                var closure = first.cells[5] ? first.cells[5].innerHTML : '';
                var type = first.dataset.closureType === 'std' ? 'STD-based' : 'ETD-based';

                summaryEl.innerHTML = '<span class="delay-summary-label">Result:</span> <strong>' + apt + '</strong> — ' + closure + ' (' + type + ')';

                if (matchedRows.length > 1) summaryEl.innerHTML += ' <small>+' + (matchedRows.length - 1) + ' more</small>';

                summaryEl.classList.remove('hidden');
            } else {
                summaryEl.classList.add('hidden');
            }
        }
    }
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
        const type = (row.cells[5] && row.cells[5].textContent) || '';
        const iatci = ((row.cells[6] && row.cells[6].textContent) || '').trim().toUpperCase();
        const iatciType = (row.cells[7] && row.cells[7].textContent) || '';
        const bp = (row.cells[8] && row.cells[8].textContent) || '';
        const bag = ((row.cells[9] && row.cells[9].textContent) || '').trim().toUpperCase();
        const transfer = (row.cells[10] && row.cells[10].textContent) || '';
        const remarks = (row.cells[11] && row.cells[11].textContent) || '';

        const searchableText = [
            carrier,
            code,
            host,
            type,
            iatci,
            iatciType,
            bp,
            bag,
            transfer,
            remarks
        ].join(' ').toLowerCase();

        const searchMatch =
            !q ||
            searchableText.includes(q);

        let filterMatch = true;

        if (carrierFilterMode === 'iatci') {
            filterMatch = iatci === 'YES';
        } else if (carrierFilterMode === 'iet') {
            filterMatch = bag === 'YES';
        }

        const finalMatch = searchMatch && filterMatch;

        row.style.display = finalMatch ? '' : 'none';

        if (finalMatch && q) {
            row.classList.add('carrier-search-match');
        } else {
            row.classList.remove('carrier-search-match');
        }
    }
}

let currentView = 'airports';

function switchView(view) {
    currentView = view;

    const airportsPanel = document.getElementById('airportsView');
    const interlinePanel = document.getElementById('interlineView');
    const delayPanel = document.getElementById('delayPolicyView');
    const specialServicesPanel = document.getElementById('specialServicesView');
    const currencyPanel = document.getElementById('currencyView');

    const tabAirports = document.getElementById('tabAirports');
    const tabInterline = document.getElementById('tabInterline');
    const tabDelay = document.getElementById('tabDelayPolicy');
    const tabSpecialServices = document.getElementById('tabSpecialServices');
    const tabCurrency = document.getElementById('tabCurrency');

    const containerEl = document.querySelector('.container');

    if (!airportsPanel || !interlinePanel) return;

    if (containerEl) {
        containerEl.classList.toggle(
            'interline-active',
            view === 'interline' ||
            view === 'delay' ||
            view === 'specialServices' ||
            view === 'currency'
        );
    }

    [
        airportsPanel,
        interlinePanel,
        delayPanel,
        specialServicesPanel,
        currencyPanel
    ].forEach(function (p) {
        if (p) p.classList.remove('active');
    });

    [
        tabAirports,
        tabInterline,
        tabDelay,
        tabSpecialServices,
        tabCurrency
    ].forEach(function (t) {
        if (t) {
            t.classList.remove('active');
            t.setAttribute('aria-pressed', 'false');
        }
    });

    if (view === 'airports') {
        airportsPanel.classList.add('active');

        if (tabAirports) {
            tabAirports.classList.add('active');
            tabAirports.setAttribute('aria-pressed', 'true');
        }

        if (searchInput && searchInput.parentElement) {
            searchInput.placeholder = 'Search IATA, airport, city, country, or region...';
            searchInput.parentElement.style.display = '';
        }

        renderCards(searchInput ? searchInput.value : '');

    } else if (view === 'interline') {
        interlinePanel.classList.add('active');

        if (tabInterline) {
            tabInterline.classList.add('active');
            tabInterline.setAttribute('aria-pressed', 'true');
        }

        if (searchInput && searchInput.parentElement) {
            searchInput.placeholder = 'Search carrier name or code...';
            searchInput.parentElement.style.display = '';
        }

        if (clearBtn) {
            if (searchInput && searchInput.value.trim()) clearBtn.classList.remove('hidden');
            else clearBtn.classList.add('hidden');
        }

        filterCarriers(searchInput ? searchInput.value : '');

    } else if (view === 'delay') {
        if (delayPanel) delayPanel.classList.add('active');

        if (tabDelay) {
            tabDelay.classList.add('active');
            tabDelay.setAttribute('aria-pressed', 'true');
        }

        if (searchInput && searchInput.parentElement) searchInput.parentElement.style.display = 'none';
        if (clearBtn) clearBtn.classList.add('hidden');

        populateDelayPolicyTable();

    } else if (view === 'specialServices') {
        if (specialServicesPanel) specialServicesPanel.classList.add('active');

        if (tabSpecialServices) {
            tabSpecialServices.classList.add('active');
            tabSpecialServices.setAttribute('aria-pressed', 'true');
        }

        if (searchInput && searchInput.parentElement) searchInput.parentElement.style.display = 'none';
        if (clearBtn) clearBtn.classList.add('hidden');

        renderSpecialServices('');

    } else if (view === 'currency') {
        if (currencyPanel) currencyPanel.classList.add('active');

        if (tabCurrency) {
            tabCurrency.classList.add('active');
            tabCurrency.setAttribute('aria-pressed', 'true');
        }

        if (searchInput && searchInput.parentElement) searchInput.parentElement.style.display = 'none';
        if (clearBtn) clearBtn.classList.add('hidden');

        convertCurrencyPayport();
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}
const countrySearchAliases = {
    // United States
    "usa": ["United States", "USA", "United States of America"],
    "us": ["United States", "USA", "United States of America"],
    "america": ["United States", "USA", "United States of America"],
    "united states": ["United States", "USA", "United States of America"],

    // United Arab Emirates
    "uae": ["United Arab Emirates", "UAE"],
    "ae": ["United Arab Emirates", "UAE"],
    "emirates": ["United Arab Emirates", "UAE"],
    "dubai country": ["United Arab Emirates", "UAE"],
    "united arab emirates": ["United Arab Emirates", "UAE"],

    // Saudi Arabia
    "ksa": ["Saudi Arabia"],
    "sa": ["Saudi Arabia"],
    "saudi": ["Saudi Arabia"],
    "saudi arabia": ["Saudi Arabia"],

    // United Kingdom
    "uk": ["UK", "United Kingdom"],
    "gb": ["UK", "United Kingdom"],
    "britain": ["UK", "United Kingdom"],
    "great britain": ["UK", "United Kingdom"],
    "united kingdom": ["UK", "United Kingdom"],
    "england": ["UK", "United Kingdom"],

    // GCC / Middle East
    "bh": ["Bahrain"],
    "bahrain": ["Bahrain"],

    "kw": ["Kuwait"],
    "kuwait": ["Kuwait"],

    "om": ["Oman"],
    "oman": ["Oman"],

    "qa": ["Qatar"],
    "qatar": ["Qatar"],

    "jo": ["Jordan"],
    "jordan": ["Jordan"],

    "lb": ["Lebanon"],
    "lebanon": ["Lebanon"],

    "iq": ["Iraq"],
    "iraq": ["Iraq"],

    "ir": ["Iran"],
    "iran": ["Iran"],

    "sy": ["Syria"],
    "syria": ["Syria"],

    "il": ["Israel"],
    "israel": ["Israel"],

    "ye": ["Yemen"],
    "yemen": ["Yemen"],

    "tr": ["Türkiye", "Turkey"],
    "turkey": ["Türkiye", "Turkey"],
    "turkiye": ["Türkiye", "Turkey"],
    "türkiye": ["Türkiye", "Turkey"],

    // Africa
    "eg": ["Egypt"],
    "egypt": ["Egypt"],

    "sd": ["Sudan"],
    "sudan": ["Sudan"],

    "dj": ["Djibouti"],
    "djibouti": ["Djibouti"],

    "er": ["Eritrea"],
    "eritrea": ["Eritrea"],

    "so": ["Somalia"],
    "somalia": ["Somalia"],

    "et": ["Ethiopia"],
    "ethiopia": ["Ethiopia"],

    "ss": ["South Sudan"],
    "south sudan": ["South Sudan"],

    "ke": ["Kenya"],
    "kenya": ["Kenya"],

    "ug": ["Uganda"],
    "uganda": ["Uganda"],

    "tz": ["Tanzania", "Zanzibar"],
    "tanzania": ["Tanzania"],
    "zanzibar": ["Zanzibar", "Tanzania"],

    "za": ["South Africa"],
    "south africa": ["South Africa"],

    "ng": ["Nigeria"],
    "nigeria": ["Nigeria"],

    "gh": ["Ghana"],
    "ghana": ["Ghana"],

    "sn": ["Senegal"],
    "senegal": ["Senegal"],

    "ci": ["Ivory Coast"],
    "ivory coast": ["Ivory Coast"],
    "cote d ivoire": ["Ivory Coast"],
    "côte d ivoire": ["Ivory Coast"],

    "ma": ["Morocco"],
    "morocco": ["Morocco"],

    "tn": ["Tunisia"],
    "tunisia": ["Tunisia"],

    "dz": ["Algeria"],
    "algeria": ["Algeria"],

    "zm": ["Zambia"],
    "zambia": ["Zambia"],

    "cg": ["Congo"],
    "congo": ["Congo"],

    "cd": ["Democratic Republic of the Congo"],
    "drc": ["Democratic Republic of the Congo"],
    "democratic republic of the congo": ["Democratic Republic of the Congo"],

    "zw": ["Zimbabwe"],
    "zimbabwe": ["Zimbabwe"],

    "na": ["Namibia"],
    "namibia": ["Namibia"],

    "rw": ["Rwanda"],
    "rwanda": ["Rwanda"],

    "ly": ["Libya"],
    "libya": ["Libya"],

    "mu": ["Mauritius"],
    "mauritius": ["Mauritius"],

    "sc": ["Seychelles"],
    "seychelles": ["Seychelles"],

    "cv": ["Cape Verde"],
    "cape verde": ["Cape Verde"],

    "re": ["Réunion"],
    "reunion": ["Réunion"],
    "réunion": ["Réunion"],

    // Europe / CIS
    "ru": ["Russian Federation", "Russia"],
    "russia": ["Russian Federation", "Russia"],
    "russian federation": ["Russian Federation", "Russia"],

    "ua": ["Ukraine"],
    "ukraine": ["Ukraine"],

    "by": ["Belarus"],
    "belarus": ["Belarus"],

    "pl": ["Poland"],
    "poland": ["Poland"],

    "ro": ["Romania"],
    "romania": ["Romania"],

    "bg": ["Bulgaria"],
    "bulgaria": ["Bulgaria"],

    "rs": ["Serbia"],
    "serbia": ["Serbia"],

    "ba": ["Bosnia", "Bosnia and Herzegovina"],
    "bosnia": ["Bosnia", "Bosnia and Herzegovina"],
    "bosnia and herzegovina": ["Bosnia and Herzegovina"],

    "me": ["Montenegro"],
    "montenegro": ["Montenegro"],

    "hr": ["Croatia"],
    "croatia": ["Croatia"],

    "si": ["Slovenia"],
    "slovenia": ["Slovenia"],

    "hu": ["Hungary"],
    "hungary": ["Hungary"],

    "cz": ["Czech Republic"],
    "czech": ["Czech Republic"],
    "czech republic": ["Czech Republic"],

    "sk": ["Slovakia"],
    "slovakia": ["Slovakia"],

    "gr": ["Greece"],
    "greece": ["Greece"],

    "it": ["Italy"],
    "italy": ["Italy"],

    "fr": ["France"],
    "france": ["France"],

    "ch": ["Switzerland"],
    "switzerland": ["Switzerland"],

    "at": ["Austria"],
    "austria": ["Austria"],

    "de": ["Germany"],
    "germany": ["Germany"],

    "nl": ["Netherlands"],
    "netherlands": ["Netherlands"],
    "holland": ["Netherlands"],

    "be": ["Belgium"],
    "belgium": ["Belgium"],

    "ie": ["Ireland"],
    "ireland": ["Ireland"],

    "es": ["Spain"],
    "spain": ["Spain"],

    "pt": ["Portugal"],
    "portugal": ["Portugal"],

    "fi": ["Finland"],
    "finland": ["Finland"],

    "se": ["Sweden"],
    "sweden": ["Sweden"],

    "no": ["Norway"],
    "norway": ["Norway"],

    "dk": ["Denmark"],
    "denmark": ["Denmark"],

    "lt": ["Lithuania"],
    "lithuania": ["Lithuania"],

    "lv": ["Latvia"],
    "latvia": ["Latvia"],

    "ee": ["Estonia"],
    "estonia": ["Estonia"],

    "ge": ["Georgia"],
    "georgia": ["Georgia"],

    "md": ["Moldova"],
    "moldova": ["Moldova"],

    "al": ["Albania"],
    "albania": ["Albania"],

    "az": ["Azerbaijan"],
    "azerbaijan": ["Azerbaijan"],

    "am": ["Armenia"],
    "armenia": ["Armenia"],

    "is": ["Iceland"],
    "iceland": ["Iceland"],

    "mt": ["Malta"],
    "malta": ["Malta"],

    "cy": ["Cyprus"],
    "cyprus": ["Cyprus"],

    // Indian Subcontinent / Asia
    "in": ["India"],
    "india": ["India"],

    "pk": ["Pakistan"],
    "pakistan": ["Pakistan"],

    "bd": ["Bangladesh"],
    "bangladesh": ["Bangladesh"],

    "lk": ["Sri Lanka"],
    "sri lanka": ["Sri Lanka"],

    "np": ["Nepal"],
    "nepal": ["Nepal"],

    "mv": ["Maldives"],
    "maldives": ["Maldives"],

    "af": ["Afghanistan"],
    "afghanistan": ["Afghanistan"],

    "bt": ["Bhutan"],
    "bhutan": ["Bhutan"],

    // Central Asia
    "kz": ["Kazakhstan"],
    "kazakhstan": ["Kazakhstan"],

    "kg": ["Kyrgyzstan"],
    "kyrgyzstan": ["Kyrgyzstan"],

    "uz": ["Uzbekistan"],
    "uzbekistan": ["Uzbekistan"],

    "tm": ["Turkmenistan"],
    "turkmenistan": ["Turkmenistan"],

    "tj": ["Tajikistan"],
    "tajikistan": ["Tajikistan"],

    // Southeast / East Asia
    "th": ["Thailand"],
    "thailand": ["Thailand"],

    "my": ["Malaysia"],
    "malaysia": ["Malaysia"],

    "sg": ["Singapore"],
    "singapore": ["Singapore"],

    "id": ["Indonesia"],
    "indonesia": ["Indonesia"],

    "ph": ["Philippines"],
    "philippines": ["Philippines"],

    "vn": ["Vietnam"],
    "vietnam": ["Vietnam"],

    "cn": ["China"],
    "china": ["China"],

    "hk": ["Hong Kong"],
    "hong kong": ["Hong Kong"],

    "tw": ["Taiwan"],
    "taiwan": ["Taiwan"],

    "kr": ["South Korea"],
    "korea": ["South Korea"],
    "south korea": ["South Korea"],

    "jp": ["Japan"],
    "japan": ["Japan"],

    "mm": ["Myanmar"],
    "myanmar": ["Myanmar"],

    // North / South America
    "ca": ["Canada"],
    "canada": ["Canada"],

    "mx": ["Mexico"],
    "mexico": ["Mexico"],

    "br": ["Brazil"],
    "brazil": ["Brazil"],

    "ar": ["Argentina"],
    "argentina": ["Argentina"],

    "cl": ["Chile"],
    "chile": ["Chile"],

    "co": ["Colombia"],
    "colombia": ["Colombia"],

    "pe": ["Peru"],
    "peru": ["Peru"],

    "ve": ["Venezuela"],
    "venezuela": ["Venezuela"],

    "pa": ["Panama"],
    "panama": ["Panama"],

    "ec": ["Ecuador"],
    "ecuador": ["Ecuador"],

    "bm": ["Bermuda"],
    "bermuda": ["Bermuda"],

    // Oceania / Pacific
    "au": ["Australia"],
    "australia": ["Australia"],

    "nz": ["New Zealand"],
    "new zealand": ["New Zealand"],

    "fj": ["Fiji"],
    "fiji": ["Fiji"],

    "pg": ["Papua New Guinea"],
    "papua new guinea": ["Papua New Guinea"],

    "sb": ["Solomon Islands"],
    "solomon islands": ["Solomon Islands"],

    "nc": ["New Caledonia"],
    "new caledonia": ["New Caledonia"],

    "ws": ["Samoa"],
    "samoa": ["Samoa"],

    "to": ["Tonga"],
    "tonga": ["Tonga"],

    "gu": ["Guam"],
    "gum": ["Guam"],
    "guam": ["Guam"]
};

function normalizeSearchText(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/ü/g, "u")
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ş/g, "s")
        .replace(/ç/g, "c")
        .replace(/ö/g, "o")
        .replace(/\s+/g, " ");
}

function getCountryAliasMatches(query) {
    const normalizedQuery = normalizeSearchText(query);

    if (countrySearchAliases[normalizedQuery]) {
        return countrySearchAliases[normalizedQuery];
    }

    const dynamicMatches = [];

    Object.keys(countryCodes).forEach(function (countryName) {
        const code = normalizeSearchText(countryCodes[countryName]);

        if (code === normalizedQuery) {
            dynamicMatches.push(countryName);
        }
    });

    return dynamicMatches.length ? dynamicMatches : null;
}
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
        container.innerHTML = '<div class="search-hint">Search by IATA code, airport, city, country, or region to see airports</div>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    const q = normalizeSearchText(query);
    const countryAliasMatches = getCountryAliasMatches(q);

    const exactCountrySearch = airportsData.some(function (a) {
        return normalizeSearchText(a.country) === q;
    });

    const strictCountryOnlyAliases = [
        "usa",
        "uae",
        "ksa"
    ];

    const isShortCodeSearch = q.length <= 2;

    const shouldSearchText =
        !exactCountrySearch &&
        (
            isShortCodeSearch ||
            !strictCountryOnlyAliases.includes(q)
        );

    const filtered = airportsData.filter(function (a) {
        const iata = normalizeSearchText(a.iata);
        const airport = normalizeSearchText(a.airport);
        const city = normalizeSearchText(a.city);
        const country = normalizeSearchText(a.country);
        const region = normalizeSearchText(a.region);

        const aliasMatch = countryAliasMatches
            ? countryAliasMatches.some(function (aliasCountry) {
                return country === normalizeSearchText(aliasCountry);
            })
            : false;

        if (exactCountrySearch) {
            return country === q;
        }

        if (countryAliasMatches && !shouldSearchText) {
            return aliasMatch;
        }

        const textMatch =
            iata.includes(q) ||
            airport.includes(q) ||
            city.includes(q) ||
            country.includes(q) ||
            region.includes(q);

        if (countryAliasMatches) {
            return aliasMatch || textMatch;
        }

        return textMatch;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="search-hint search-hint-empty">No destination found.</div>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    filtered.forEach(function (airport) {
        const card = document.createElement('div');

        card.className = 'card';
        card.dataset.iata = airport.iata;

        const safeIata = escapeHTML(airport.iata || '');
        const safeCity = escapeHTML(airport.city || '');
        const safeCountry = escapeHTML(airport.country || '');
        const safeRegion = escapeHTML(airport.region || '');
        const safeAirportName = escapeHTML(airport.airport || '');
        const safeTerminal = escapeHTML(airport.terminal || '');
        const safeDistance = escapeHTML(airport.distanceCenter || '');
        const safeTimezone = escapeHTML(airport.timezone || '');
        const flagCountry = airport.iata === 'HKG' ? 'Hong Kong' : (airport.country || '');

        card.innerHTML =
            '<div class="card-clickable">' +
                '<div class="card-header">' +
                    '<div>' +
                        '<div class="iata-code">' + safeIata + '</div>' +
                        '<div class="city-name">' +
                            '<img src="' + getFlagUrl(flagCountry) + '" class="flag-icon" alt="Flag of ' + escapeHTML(flagCountry) + '" onerror="this.style.display=\'none\';">' +
                            '<span>' + safeCity + '</span>' +
                        '</div>' +
                        '<div class="country-name"><span class="meta-label">Country:</span> ' + safeCountry + '</div>' +
                        (safeRegion ? '<div class="region-name"><span class="meta-label">Region:</span> ' + safeRegion + '</div>' : '') +
                        (safeAirportName ? '<div class="airport-name">' + safeAirportName + '</div>' : '') +
                    '</div>' +
                    '<div class="time-container">' +
                        '<div class="time-badge" data-timezone="' + safeTimezone + '">' + getDayNightIcon(airport.timezone) + ' ' + getLocalTime(airport.timezone) + '</div>' +
                        '<div>' + getTimeDiffHTML(airport.timezone) + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="terminal-info"><i data-lucide="plane-landing" style="width:16px"></i><span>' + safeTerminal + '</span></div>' +
                '<div class="distance-preview"><i data-lucide="car" style="width:16px"></i><span>' + safeDistance + '</span></div>' +
            '</div>' +
            '<div class="calc-section" style="margin-top:15px;padding-top:10px;border-top:1px solid rgba(0,0,0,0.05);">' +
                '<label style="font-size:0.7rem;font-weight:bold;color:var(--fz-blue);text-transform:uppercase;">Check Hours (DD/MM/YYYY ' + getTimePlaceholder() + '):</label>' +
                '<div style="display:flex;gap:5px;margin-top:5px;align-items:center;">' +
                    '<div style="flex:1;display:flex;gap:4px;">' +
                        '<input type="text" id="dateIn-' + safeIata + '" placeholder="DD/MM/YYYY" maxlength="10" style="flex:1;font-size:0.8rem;padding:5px;border-radius:5px;border:1px solid #ddd;">' +
                        '<input type="date" id="datePicker-' + safeIata + '" title="Pick date" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;">' +
                        '<button type="button" class="cal-btn" title="Pick date" style="flex-shrink:0;width:36px;height:34px;margin:0;padding:0;border:1px solid #ddd;border-radius:5px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--fz-blue);"><i data-lucide="calendar" style="width:18px;height:18px;"></i></button>' +
                    '</div>' +
                    '<input type="text" id="timeIn-' + safeIata + '" placeholder="' + getTimePlaceholder() + '" maxlength="' + (use12Hour() ? 10 : 5) + '" style="width:' + (use12Hour() ? 110 : 80) + 'px;font-size:0.8rem;padding:5px;border-radius:5px;border:1px solid #ddd;" class="calc-time-input">' +
                '</div>' +
                '<div id="timeResult-' + safeIata + '" style="text-align:center;font-size:0.85rem;min-height:1.5em;margin-top:5px;"></div>' +
            '</div>';

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
            dateIn.addEventListener('paste', function () {
                setTimeout(runCalc, 0);
            });
        }

        if (timeIn) {
            timeIn.addEventListener('input', runCalc);
            timeIn.addEventListener('change', runCalc);
            timeIn.addEventListener('paste', function () {
                setTimeout(runCalc, 0);
            });
        }

        const datePicker = card.querySelector('#datePicker-' + airport.iata);
        const calBtn = datePicker && datePicker.nextElementSibling;

        if (datePicker && calBtn) {
            calBtn.onclick = function (e) {
                e.stopPropagation();

                try {
                    if (datePicker.showPicker) datePicker.showPicker();
                    else datePicker.click();
                } catch (err) {
                    datePicker.click();
                }
            };

            datePicker.addEventListener('change', function () {
                const v = datePicker.value;

                if (v) {
                    const p = v.split('-');

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

    if (modalCity) {
        modalCity.textContent =
            (data.airport ? data.airport + ' • ' : '') +
            (data.city || '') +
            ', ' +
            (data.country || '') +
            (data.region ? ' • ' + data.region : '');
    }

    if (modalDistance) modalDistance.textContent = data.distanceCenter || '';
    if (modalOtherAirports) modalOtherAirports.textContent = data.nearbyAirports || '';

    if (modalPhone) {
        const phoneRow = modalPhone.closest ? modalPhone.closest('.detail-row') : null;

        if (hasValue(data.phone)) {
            modalPhone.textContent = data.phone;
            if (phoneRow) phoneRow.style.display = '';
        } else {
            modalPhone.textContent = '';
            if (phoneRow) phoneRow.style.display = 'none';
        }
    }

    if (modalMapBtn) {
        if (hasValue(data.locationUrl)) {
            modalMapBtn.href = data.locationUrl;
            modalMapBtn.style.display = '';
        } else {
            modalMapBtn.removeAttribute('href');
            modalMapBtn.style.display = 'none';
        }
    }

    if (modalWebBtn) {
        if (hasValue(data.website)) {
            modalWebBtn.href = data.website;
            modalWebBtn.style.display = '';
        } else {
            modalWebBtn.removeAttribute('href');
            modalWebBtn.style.display = 'none';
        }
    }

    modal.classList.remove('hidden');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

const payportCurrencies = [
    "Afghanistan Afghani (AFN)",
    "Australian Dollar (AUD)",
    "Azerbaijan Manat (AZN)",
    "Bahraini Dinar (BHD)",
    "Bangladesh Taka (BDT)",
    "Belarusian Ruble (BYN)",
    "Canadian Dollar (CAD)",
    "Caribbean Guilder (XCG)",
    "Czech Koruna (CZK)",
    "Danish Krone (DKK)",
    "Djibouti Franc (DJF)",
    "Egyptian Pound (EGP)",
    "Eritrean Nakfa (ERN)",
    "Ethiopian Birr (ETB)",
    "Euro (EUR)",
    "Fiji Dollar (FJD)",
    "Hong Kong Dollar (HKD)",
    "Hungarian Forint (HUF)",
    "Indian Rupee (INR)",
    "Indonesian Rupiah (IDR)",
    "Iranian Rial (IRR)",
    "Jordanian Dinar (JOD)",
    "Kazakhstan Tenge (KZT)",
    "Kenyan Shilling (KES)",
    "Kuwaiti Dinar (KWD)",
    "Libyan Dinar (LYD)",
    "Malaysian Ringgit (MYR)",
    "Nepalese Rupee (NPR)",
    "New Israeli Sheqel (ILS)",
    "New Zealand Dollar (NZD)",
    "Norwegian Krone (NOK)",
    "Omani Rial (OMR)",
    "Pakistan Rupee (PKR)",
    "Polish Zloty (PLN)",
    "Qatari Rial (QAR)",
    "Russian Ruble (RUB)",
    "Saudi Riyal (SAR)",
    "Serbian Dinar (RSD)",
    "Singapore Dollar (SGD)",
    "South Sudanese Pound (SSP)",
    "Sri Lanka Rupee (LKR)",
    "Sudanese Pound (SDG)",
    "Swedish Krona (SEK)",
    "Swiss Franc (CHF)",
    "Syrian Pound (SYP)",
    "Tanzanian Shilling (TZS)",
    "Thai Baht (THB)",
    "Turkish Yeni Lira (TRY)",
    "UK Pound Sterling (GBP)",
    "Ukraine Hryvnia (UAH)",
    "United Arab Emirates Dirham (AED)",
    "United States Dollar (USD)",
    "Uzbekistan Sum (UZS)",
    "Zimbabwe's ZWG (ZWG)"
];

function initialiseCurrencyConverter() {
    const from = document.getElementById("currencyFrom");
    const to = document.getElementById("currencyTo");
    const dateInput = document.getElementById("currencyDate");
    const swapBtn = document.getElementById("currencySwapBtn");
    const convertBtn = document.getElementById("currencyConvertBtn");
    const amountInput = document.getElementById("currencyAmount");

    if (!from || !to || !dateInput || !swapBtn || !convertBtn || !amountInput) return;

    from.innerHTML = "";
    to.innerHTML = "";

    payportCurrencies.forEach(function (currency) {
        from.add(new Option(currency, currency));
        to.add(new Option(currency, currency));
    });

    if (window.currencyFromTom) window.currencyFromTom.destroy();
    if (window.currencyToTom) window.currencyToTom.destroy();

    window.currencyFromTom = new TomSelect("#currencyFrom", {
        create: false,
        maxOptions: 100,
        searchField: ["text", "value"],
        sortField: {
            field: "text",
            direction: "asc"
        },
        placeholder: "Search currency..."
    });

    window.currencyToTom = new TomSelect("#currencyTo", {
        create: false,
        maxOptions: 100,
        searchField: ["text", "value"],
        sortField: {
            field: "text",
            direction: "asc"
        },
        placeholder: "Search currency..."
    });

    window.currencyFromTom.setValue("United States Dollar (USD)");
    window.currencyToTom.setValue("United Arab Emirates Dirham (AED)");

    const today = new Date();

    dateInput.value =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    swapBtn.onclick = function () {
        const temp = window.currencyFromTom.getValue();

        window.currencyFromTom.setValue(window.currencyToTom.getValue());
        window.currencyToTom.setValue(temp);

        convertCurrencyPayport();
    };

    convertBtn.onclick = convertCurrencyPayport;

    amountInput.onkeydown = function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            convertCurrencyPayport();
        }
    };

    dateInput.onkeydown = function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            convertCurrencyPayport();
        }
    };

   if (!window.currencyEnterListenerAdded) {

    document.addEventListener("keydown", function (e) {

        if (
            e.key === "Enter" &&
            document.activeElement &&
            document.activeElement.closest(".ts-control")
        ) {
            e.preventDefault();
            convertCurrencyPayport();
        }

    });

    window.currencyEnterListenerAdded = true;
}
}
   
async function convertCurrencyPayport() {
    try {
        const amountEl = document.getElementById("currencyAmount");
        const fromEl = document.getElementById("currencyFrom");
        const toEl = document.getElementById("currencyTo");
        const dateEl = document.getElementById("currencyDate");
        const resultEl = document.getElementById("currencyResult");
        const rateEl = document.getElementById("currencyRate");

        if (!amountEl || !fromEl || !toEl || !dateEl || !resultEl || !rateEl) return;

        const amount = amountEl.value.trim();
        const from = fromEl.value;
        const to = toEl.value;
        const selectedDate = dateEl.value;

        if (!amount || Number(amount) <= 0) {
            resultEl.textContent = "Enter Amount";
            rateEl.textContent = "";
            return;
        }

        if (!selectedDate) {
            resultEl.textContent = "Select Date";
            rateEl.textContent = "";
            return;
        }

        resultEl.textContent = "Loading...";
        rateEl.textContent = "";

        const d = new Date(selectedDate);

        const period = d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).replace(/ /g, "-");

        const url =
            PAYPORT_PROXY_URL +
            "?amount=" + encodeURIComponent(amount) +
            "&from=" + encodeURIComponent(from) +
            "&to=" + encodeURIComponent(to) +
            "&period=" + encodeURIComponent(period);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to reach PayPort service");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.message || "PayPort returned an error");
        }

        const result =
            data.targetValue ||
            data.TargetValue ||
            (data.raw && data.raw.TargetValue) ||
            "N/A";

        const rate =
            data.rate ||
            (data.raw && data.raw.rate) ||
            "N/A";

        const targetCode =
            (to.match(/\(([A-Z]{3})\)/) || [])[1] || "";

        resultEl.textContent = result + " " + targetCode;
        rateEl.textContent = "Rate: " + rate;

    } catch (error) {
        const resultEl = document.getElementById("currencyResult");
        const rateEl = document.getElementById("currencyRate");

        if (resultEl) resultEl.textContent = "Live Rate Unavailable";
        if (rateEl) rateEl.textContent = "Please try again later";

        console.error("PayPort Error:", error);
    }
}
function normalizeSpecialServiceText(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

function getSpecialServicesData() {
    if (Array.isArray(window.specialServicesData)) {
        return window.specialServicesData;
    }

    if (typeof specialServicesData !== "undefined" && Array.isArray(specialServicesData)) {
        return specialServicesData;
    }

    return [];
}

function buildSpecialServiceSearchText(service) {
    const parts = [];

    Object.keys(service).forEach(function (key) {
        const value = service[key];

        if (typeof value === "string") {
            parts.push(value);
        } else if (Array.isArray(value)) {
            parts.push(value.join(" "));
        }
    });

    return parts.join(" ").toLowerCase();
}

function renderSpecialServices(filterText) {
    const grid = document.getElementById("specialServicesGrid");
    const clearBtn = document.getElementById("specialServicesClearBtn");

    if (!grid) return;

    const query = normalizeSpecialServiceText(filterText);
    const services = getSpecialServicesData();

    if (clearBtn) {
        clearBtn.classList.toggle("hidden", !query);
    }

    const filtered = services.filter(function (service) {
        const searchableText = buildSpecialServiceSearchText(service);
        return !query || searchableText.includes(query);
    });

    if (!filtered.length) {
        grid.innerHTML =
            '<div class="special-services-empty">' +
                "No special service found. Try searching by service name, SSR, item, keyword, route, or process." +
            "</div>";

        if (typeof lucide !== "undefined") lucide.createIcons();
        return;
    }

    grid.innerHTML = "";

    filtered.forEach(function (service) {
        const card = document.createElement("div");
        card.className = "special-service-card";

        card.innerHTML =
            '<div class="special-service-card-header">' +
                '<div class="special-service-icon-wrap">' +
                    '<i data-lucide="' + escapeHTML(service.icon || "clipboard-list") + '"></i>' +
                "</div>" +
                "<div>" +
                    "<h3>" + escapeHTML(service.title || "Untitled Service") + "</h3>" +
                    '<div class="special-service-category">' + escapeHTML(service.category || "Special Service") + "</div>" +
                "</div>" +
            "</div>" +

            renderSpecialServiceBadges(service) +

            '<p class="special-service-summary">' + escapeHTML(service.summary || "") + "</p>" +

            renderSpecialServiceSection("Quick Facts", service.quickFacts) +
            renderSpecialServiceSection("Timing", service.timing) +
            renderSpecialServiceSection("Charges", service.charges) +
            renderSpecialServiceSection("Limits", service.limits) +
            renderSpecialServiceSection("Dimensions", service.dimensions) +
            renderSpecialServiceSection("Restrictions", service.restrictions) +
            renderSpecialServiceSection("Required Details", service.requiredDetails) +
            renderSpecialServiceSection("Agent Process", service.agentProcess) +
            renderSpecialServiceSection("Supervisor Process", service.supervisorProcess) +
            renderSpecialServiceSection("Customer Advice", service.customerAdvice) +
            renderSpecialServiceSection("Interline / Codeshare", service.interlineCodeshareRules) +
            renderSpecialServiceSection("Cancellation Rules", service.cancellationRules) +
            renderSpecialServiceSection("Emails", service.emails) +

            renderSpecialServiceNote(service.note);

        grid.appendChild(card);
    });

    if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderSpecialServiceBadges(service) {
    const badges = [];

    if (Array.isArray(service.ssr)) {
        service.ssr.forEach(function (item) {
            badges.push('<span class="special-service-badge">SSR: ' + escapeHTML(item) + "</span>");
        });
    }

    if (!badges.length) return "";

    return '<div class="special-service-badges">' + badges.join("") + "</div>";
}

function renderSpecialServiceSection(title, items) {
    if (!Array.isArray(items) || !items.length) return "";

    const listItems = items.map(function (item) {
        return "<li>" + escapeHTML(item) + "</li>";
    }).join("");

    return (
        '<div class="special-service-section">' +
            "<strong>" + escapeHTML(title) + "</strong>" +
            "<ul>" + listItems + "</ul>" +
        "</div>"
    );
}

function renderSpecialServiceNote(note) {
    if (!note) return "";

    return (
        '<div class="special-service-note">' +
            "<strong>Note:</strong> " + escapeHTML(note) +
        "</div>"
    );
}

function initialiseSpecialServices() {
    const search = document.getElementById("specialServicesSearch");
    const clearBtn = document.getElementById("specialServicesClearBtn");

    renderSpecialServices("");

    if (search) {
        search.addEventListener("input", function () {
            renderSpecialServices(search.value);
        });
    }

    if (clearBtn && search) {
        clearBtn.addEventListener("click", function () {
            search.value = "";
            renderSpecialServices("");
            search.focus();
        });
    }
}
function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function init() {
    updateLiveClock();
    populateInterlineTable();
    initialiseCurrencyConverter();

    if (typeof lucide !== 'undefined') lucide.createIcons();

    const carrierModal = document.getElementById('carrierModal');
    const closeCarrierModal = document.getElementById('closeCarrierModal');

    if (closeModalBtn) {
        closeModalBtn.onclick = function () {
            modal.classList.add('hidden');
        };
    }

    window.onclick = function (e) {
        if (e.target === modal) modal.classList.add('hidden');
    };

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

    if (closeCarrierModal && carrierModal) {
        closeCarrierModal.onclick = function () {
            carrierModal.classList.add('hidden');
        };
    }

    if (carrierModal) {
        carrierModal.onclick = function (e) {
            if (e.target === carrierModal) carrierModal.classList.add('hidden');
        };
    }

    const tabAirports = document.getElementById('tabAirports');
const tabInterline = document.getElementById('tabInterline');
const tabDelay = document.getElementById('tabDelayPolicy');
const tabSpecialServices = document.getElementById('tabSpecialServices');
const tabCurrency = document.getElementById('tabCurrency');

if (tabAirports) tabAirports.onclick = function () { switchView('airports'); };
if (tabInterline) tabInterline.onclick = function () { switchView('interline'); };
if (tabDelay) tabDelay.onclick = function () { switchView('delay'); };
if (tabSpecialServices) tabSpecialServices.onclick = function () { switchView('specialServices'); };
if (tabCurrency) tabCurrency.onclick = function () { switchView('currency'); };

    document.querySelectorAll('.carrier-filter-btn').forEach(function (btn) {
        btn.onclick = function () {
            document.querySelectorAll('.carrier-filter-btn').forEach(function (b) {
                b.classList.remove('active');
            });

            btn.classList.add('active');

            carrierFilterMode = btn.dataset.filter || 'all';

            filterCarriers(searchInput ? searchInput.value : '');
        };
    });

    var delaySearch = document.getElementById('delayPolicySearch');
    var delayClearBtn = document.getElementById('delayClearBtn');

    if (delaySearch) {
        delaySearch.addEventListener('input', function () {
            var val = delaySearch.value;

            if (delayClearBtn) delayClearBtn.classList.toggle('hidden', !val.trim());

            filterDelayPolicy(val);
        });

        delaySearch.addEventListener('keyup', function (e) {
            if (e.key === 'Escape') {
                delaySearch.value = '';

                if (delayClearBtn) delayClearBtn.classList.add('hidden');

                filterDelayPolicy('');
            }
        });
    }

    if (delayClearBtn) {
        delayClearBtn.onclick = function () {
            if (delaySearch) {
                delaySearch.value = '';
                delaySearch.focus();
            }

            delayClearBtn.classList.add('hidden');

            var h = document.getElementById('delaySearchHint');
            var s = document.getElementById('delayResultSummary');

            if (h) h.classList.add('hidden');
            if (s) s.classList.add('hidden');

            filterDelayPolicy('');
        };
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            var val = searchInput.value;

            if (clearBtn) {
                if (val.trim()) clearBtn.classList.remove('hidden');
                else clearBtn.classList.add('hidden');
            }

            if (currentView === 'airports') renderCards(val);
            else if (currentView === 'interline') filterCarriers(val);
        });
    }

    if (clearBtn) {
        clearBtn.onclick = function () {
            searchInput.value = '';
            clearBtn.classList.add('hidden');
            renderCards('');
            switchView(currentView);
        };
    }
initialiseSpecialServices();
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

    if (btn12) {
        btn12.onclick = function () {
            setTimeFormatPreference('12');
            syncFormatButtons();
            refreshAllTimes();
            updateTimeInputPlaceholders();
            convertAllTimeInputs();
        };
    }

    if (btn24) {
        btn24.onclick = function () {
            setTimeFormatPreference('24');
            syncFormatButtons();
            refreshAllTimes();
            updateTimeInputPlaceholders();
            convertAllTimeInputs();
        };
    }

    setInterval(refreshAllTimes, 1000);

    switchView('airports');

    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(function () {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
