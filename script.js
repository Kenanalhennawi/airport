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
    const carrierTableBody = document.getElementById('carrierTableBody');
    const carrierModalTableBody = document.getElementById('carrierModalTableBody');
    const carriers = getUniqueInterlineCarriers();

    if (!carrierTableBody && !carrierModalTableBody) return;

    if (carrierModalTableBody) {
        carrierModalTableBody.innerHTML = '';
        carriers.forEach(function (carrier, i) {
            carrierModalTableBody.appendChild(createInterlineCarrierRow(carrier, i));
        });
    }

    if (carrierTableBody) {
        const sortedCarriers = carriers.slice().sort(function (a, b) {
            const nameA = (a.carrier || '').trim().toLowerCase();
            const nameB = (b.carrier || '').trim().toLowerCase();

            return nameA.localeCompare(nameB);
        });

        carrierTableBody.innerHTML = '';
        sortedCarriers.forEach(function (carrier, i) {
            carrierTableBody.appendChild(createInterlineCarrierRow(carrier, i));
        });
    }
}

function getUniqueInterlineCarriers() {
    const data = Array.isArray(window.interlineCarriers) ? window.interlineCarriers : [];
    const seen = new Set();

    return data.filter(function (carrier) {
        const code = (carrier.code || '').trim();

        if (!code || seen.has(code)) return false;

        seen.add(code);
        return true;
    });
}

function createInterlineCarrierRow(carrier, index) {
    const row = document.createElement('tr');
    const cells = [
        index + 1,
        carrier.carrier,
        carrier.code,
        carrier.account,
        carrier.host,
        carrier.type,
        carrier.iatci,
        carrier.iatciType,
        carrier.throughCheckInBp,
        carrier.throughCheckInBag,
        carrier.bpAtTransfer,
        carrier.remarks
    ];

    cells.forEach(function (value) {
        const cell = document.createElement('td');
        cell.textContent = value || '';
        row.appendChild(cell);
    });

    return row;
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
    const operationsPanel = document.getElementById('operationsView');
    const currencyPanel = document.getElementById('currencyView');

    const tabAirports = document.getElementById('tabAirports');
    const tabInterline = document.getElementById('tabInterline');
    const tabDelay = document.getElementById('tabDelayPolicy');
    const tabSpecialServices = document.getElementById('tabSpecialServices');
    const tabOperations = document.getElementById('tabOperations');
    const tabCurrency = document.getElementById('tabCurrency');

    const containerEl = document.querySelector('.container');

    if (!airportsPanel || !interlinePanel) return;

    if (containerEl) {
        containerEl.classList.toggle(
            'interline-active',
            view === 'interline' ||
            view === 'delay' ||
            view === 'specialServices' ||
            view === 'operations' ||
            view === 'currency'
        );
    }

    [
        airportsPanel,
        interlinePanel,
        delayPanel,
        specialServicesPanel,
        operationsPanel,
        currencyPanel
    ].forEach(function (p) {
        if (p) p.classList.remove('active');
    });

    [
        tabAirports,
        tabInterline,
        tabDelay,
        tabSpecialServices,
        tabOperations,
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

    } else if (view === 'operations') {
        if (operationsPanel) operationsPanel.classList.add('active');

        if (tabOperations) {
            tabOperations.classList.add('active');
            tabOperations.setAttribute('aria-pressed', 'true');
        }

        if (searchInput && searchInput.parentElement) searchInput.parentElement.style.display = 'none';
        if (clearBtn) clearBtn.classList.add('hidden');

        renderOperationsGuide();

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
                            '<img src="' + getFlagUrl(flagCountry) + '" class="flag-icon" alt="Flag of ' + escapeHTML(flagCountry) + '">' +
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
        const flagImg = card.querySelector('.flag-icon');

        if (flagImg) {
            flagImg.addEventListener('error', function () {
                flagImg.style.display = 'none';
            });
        }

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

const currencyFlagByCode = {
    AFN: "af",
    AUD: "au",
    AZN: "az",
    BHD: "bh",
    BDT: "bd",
    BYN: "by",
    CAD: "ca",
    XCG: "cw",
    CZK: "cz",
    DKK: "dk",
    DJF: "dj",
    EGP: "eg",
    ERN: "er",
    ETB: "et",
    EUR: "eu",
    FJD: "fj",
    HKD: "hk",
    HUF: "hu",
    INR: "in",
    IDR: "id",
    IRR: "ir",
    JOD: "jo",
    KZT: "kz",
    KES: "ke",
    KWD: "kw",
    LYD: "ly",
    MYR: "my",
    NPR: "np",
    ILS: "il",
    NZD: "nz",
    NOK: "no",
    OMR: "om",
    PKR: "pk",
    PLN: "pl",
    QAR: "qa",
    RUB: "ru",
    SAR: "sa",
    RSD: "rs",
    SGD: "sg",
    SSP: "ss",
    LKR: "lk",
    SDG: "sd",
    SEK: "se",
    CHF: "ch",
    SYP: "sy",
    TZS: "tz",
    THB: "th",
    TRY: "tr",
    GBP: "gb",
    UAH: "ua",
    AED: "ae",
    USD: "us",
    UZS: "uz",
    ZWG: "zw"
};

function getCurrencyCode(currencyName) {
    const match = String(currencyName || "").match(/\(([A-Z]{3})\)$/);
    return match ? match[1] : "";
}

function getCurrencyFlagUrl(currencyName) {
    const countryCode = currencyFlagByCode[getCurrencyCode(currencyName)];
    return countryCode ? `https://flagcdn.com/24x18/${countryCode}.png` : "";
}

function renderCurrencySelectOption(data, escape) {
    const label = data.text || data.value || "";
    const flagUrl = getCurrencyFlagUrl(label);
    const flagMarkup = flagUrl
        ? `<img class="currency-select-flag" src="${flagUrl}" alt="">`
        : '<span class="currency-select-flag currency-select-flag-fallback" aria-hidden="true"></span>';

    return [
        '<div class="currency-select-option">',
        flagMarkup,
        '<span class="currency-select-label">', escape(label), '</span>',
        '</div>'
    ].join("");
}

function initialiseCurrencyConverter() {
    const from = document.getElementById("currencyFrom");
    const to = document.getElementById("currencyTo");
    const dateInput = document.getElementById("currencyDate");
    const swapBtn = document.getElementById("currencySwapBtn");
    const convertBtn = document.getElementById("currencyConvertBtn");
    const clearBtn = document.getElementById("currencyClearBtn");
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
        placeholder: "Search currency...",
        render: {
            option: renderCurrencySelectOption,
            item: renderCurrencySelectOption
        }
    });

    window.currencyToTom = new TomSelect("#currencyTo", {
        create: false,
        maxOptions: 100,
        searchField: ["text", "value"],
        sortField: {
            field: "text",
            direction: "asc"
        },
        placeholder: "Search currency...",
        render: {
            option: renderCurrencySelectOption,
            item: renderCurrencySelectOption
        }
    });

    window.currencyFromTom.setValue("United States Dollar (USD)");
    window.currencyToTom.setValue("United Arab Emirates Dirham (AED)");

    setCurrencyDateToToday();

    swapBtn.onclick = function () {
        const temp = window.currencyFromTom.getValue();

        window.currencyFromTom.setValue(window.currencyToTom.getValue());
        window.currencyToTom.setValue(temp);

        convertCurrencyPayport();
    };

    convertBtn.onclick = convertCurrencyPayport;

    if (clearBtn) {
        clearBtn.onclick = clearCurrencyConverter;
    }

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

function setCurrencyDateToToday() {
    const dateInput = document.getElementById("currencyDate");
    const today = new Date();

    if (!dateInput) return;

    dateInput.value =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");
}

function clearCurrencyConverter() {
    const amountInput = document.getElementById("currencyAmount");
    const resultEl = document.getElementById("currencyResult");
    const rateEl = document.getElementById("currencyRate");

    if (amountInput) amountInput.value = "1";

    if (window.currencyFromTom) {
        window.currencyFromTom.setValue("United States Dollar (USD)");
    }

    if (window.currencyToTom) {
        window.currencyToTom.setValue("United Arab Emirates Dirham (AED)");
    }

    setCurrencyDateToToday();

    if (resultEl) resultEl.textContent = "--";
    if (rateEl) rateEl.textContent = "Rate: --";
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

function renderSpecialServices(activeServiceId) {
    const grid = document.getElementById("specialServicesGrid");
    const tabs = document.getElementById("specialServicesTabs");

    if (!grid) return;

    const services = getSpecialServicesData();
    const activeService = services.find(function (service) {
        return service.id === activeServiceId;
    }) || services[0];

    if (!activeService) {
        grid.innerHTML = '<div class="special-services-empty">No special services available.</div>';
        return;
    }

    if (tabs) {
        tabs.innerHTML = services.map(function (service) {
            const activeClass = service.id === activeService.id ? " active" : "";
            const ssr = Array.isArray(service.ssr) && service.ssr.length ? " · " + service.ssr.join("/") : "";

            return (
                '<button type="button" class="special-service-tab' + activeClass + '" data-special-service-tab="' + escapeHTML(service.id || "") + '">' +
                    '<i data-lucide="' + escapeHTML(service.icon || "clipboard-list") + '"></i>' +
                    '<span>' + escapeHTML(service.title || "Service") + '</span>' +
                    '<small>' + escapeHTML(ssr) + '</small>' +
                '</button>'
            );
        }).join("");
    }

    grid.innerHTML = "";

    [activeService].forEach(function (service) {
        const card = document.createElement("div");
        card.className = "special-service-card";
        card.setAttribute("data-service-id", service.id || "");

        card.innerHTML =
            '<div class="special-service-card-header">' +
                '<div class="special-service-icon-wrap">' +
                    '<i data-lucide="' + escapeHTML(service.icon || "clipboard-list") + '"></i>' +
                "</div>" +
                '<div class="special-service-heading">' +
                    "<h3>" + escapeHTML(service.title || "Untitled Service") + "</h3>" +
                    renderSsrBadges(service) +
                "</div>" +
            "</div>" +

            renderAgentQuickGuide(service) +
            renderWorkflowHint(service) +
            renderAgentForm(service) +
            renderAgentEmailActions(service) +
            renderSpecialServiceDisclosureGroup(service);

        grid.appendChild(card);
    });

    if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderSsrBadges(service) {
    const badges = [];

    if (Array.isArray(service.ssr)) {
        service.ssr.forEach(function (item) {
            badges.push('<span class="special-service-badge">SSR: ' + escapeHTML(item) + "</span>");
        });
    }

    if (!badges.length) return "";

    return '<div class="special-service-badges">' + badges.join("") + "</div>";
}

function renderAgentQuickGuide(service) {
    const guide = service.agentQuickGuide;

    if (!guide) return "";

    return (
        '<div class="special-agent-guide">' +
            '<div class="special-agent-guide-title">' +
                '<i data-lucide="gauge"></i>' +
                '<span>Agent Quick Guide</span>' +
            "</div>" +
            '<div class="special-agent-guide-grid">' +
                renderQuickGuideItem("Cut-off", guide.cutOff, "clock") +
                renderQuickGuideItem("Charge", guide.charge, "credit-card") +
                renderQuickGuideItem("Approval", guide.approval, "shield-check") +
                renderQuickGuideItem("Main Action", guide.mainAction, "list-checks") +
            "</div>" +
            (guide.warning ? '<div class="special-agent-warning"><i data-lucide="triangle-alert"></i><span>' + escapeHTML(guide.warning) + "</span></div>" : "") +
        "</div>"
    );
}

function renderQuickGuideItem(label, value, icon) {
    if (!value) return "";

    return (
        '<div class="special-agent-guide-item">' +
            '<i data-lucide="' + escapeHTML(icon || "info") + '"></i>' +
            "<div>" +
                "<strong>" + escapeHTML(label) + "</strong>" +
                "<span>" + escapeHTML(value) + "</span>" +
            "</div>" +
        "</div>"
    );
}

function renderWorkflowHint(service) {
    const hasEmailWorkflow = !!(service && service.agentEmail && service.agentEmail.enabled);
    const actionStep = hasEmailWorkflow ? "Open Outlook" : "Apply SSR / Escalate";

    return (
        '<div class="special-workflow-strip" aria-label="Contact centre workflow">' +
            '<span>Request</span>' +
            '<i data-lucide="chevron-right"></i>' +
            '<span>Quick Guide</span>' +
            '<i data-lucide="chevron-right"></i>' +
            '<span>Fill Form</span>' +
            '<i data-lucide="chevron-right"></i>' +
            '<span>' + escapeHTML(actionStep) + "</span>" +
            '<i data-lucide="chevron-right"></i>' +
            '<span>Update SF / Sprint</span>' +
        "</div>"
    );
}

function renderAgentForm(service) {
    if (!service.agentForm || !Array.isArray(service.agentForm.fields) || !service.agentForm.fields.length) {
        return "";
    }

    const serviceId = escapeHTML(service.id || "");

    const fieldsHtml = service.agentForm.fields.map(function (field) {
        return renderAgentFormField(service.id, field);
    }).join("");

    return (
        '<div class="special-service-form-box">' +
            '<div class="special-service-form-title">' +
                '<i data-lucide="clipboard-pen-line"></i>' +
                '<span>' + escapeHTML(service.agentForm.title || "Request Details") + "</span>" +
            "</div>" +
            (service.agentForm.description ? '<p class="special-service-form-desc">' + escapeHTML(service.agentForm.description) + "</p>" : "") +
            '<div class="special-service-form-grid" data-service-form="' + serviceId + '">' +
                fieldsHtml +
            "</div>" +
        "</div>"
    );
}

function renderAgentFormField(serviceId, field) {
    const safeServiceId = escapeHTML(serviceId || "");
    const fieldId = escapeHTML(field.id || "");
    const fieldType = String(field.type || "text").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "text";
    const inputId = "special_" + safeServiceId + "_" + fieldId;
    const label = escapeHTML(field.label || field.id || "");
    const requiredMark = field.required ? ' <span class="required-star">*</span>' : "";
    const placeholder = escapeHTML(field.placeholder || "");
    const defaultValue = escapeHTML(field.defaultValue || "");

    let inputHtml = "";

    if (field.type === "textarea") {
        inputHtml =
            '<textarea id="' + inputId + '" data-field-id="' + fieldId + '" placeholder="' + placeholder + '">' +
                defaultValue +
            "</textarea>";
    } else if (field.type === "select") {
        const options = Array.isArray(field.options) ? field.options : [];

        inputHtml =
            '<select id="' + inputId + '" data-field-id="' + fieldId + '">' +
                '<option value="">Select</option>' +
                options.map(function (option) {
                    return '<option value="' + escapeHTML(option) + '">' + escapeHTML(option) + "</option>";
                }).join("") +
            "</select>";
    } else {
        inputHtml =
            '<input id="' + inputId + '" data-field-id="' + fieldId + '" type="' + escapeHTML(field.type || "text") + '" placeholder="' + placeholder + '" value="' + defaultValue + '">';
    }

    return (
        '<label class="special-service-form-field special-service-form-field-' + escapeHTML(fieldType) + '" for="' + inputId + '">' +
            '<span>' + label + requiredMark + "</span>" +
            inputHtml +
        "</label>"
    );
}

function renderAgentEmailActions(service) {
    if (!service.agentEmail || !service.agentEmail.enabled) return "";

    const serviceId = escapeHTML(service.id || "");

    return (
        '<div class="special-email-actions">' +
            '<button type="button" class="special-copy-email-btn" data-special-action="copy-email" data-service-id="' + serviceId + '">' +
                '<i data-lucide="copy"></i>' +
                '<span>Copy Email Body</span>' +
            "</button>" +
            '<button type="button" class="special-open-email-btn" data-special-action="open-email" data-service-id="' + serviceId + '">' +
                '<i data-lucide="mail"></i>' +
                '<span>Open in Outlook Web</span>' +
            "</button>" +
        "</div>"
    );
}

function renderSpecialServiceDisclosureGroup(service) {
    const serviceId = escapeHTML(service.id || "");
    const blocks = [];

    if (Array.isArray(service.agentProcess) && service.agentProcess.length) {
        blocks.push(renderSpecialDisclosure(serviceId, "agent-process", "Show Agent Process", "route", renderSpecialServiceSection("Agent Process", service.agentProcess)));
    }

    if (Array.isArray(service.customerAdvice) && service.customerAdvice.length) {
        blocks.push(renderSpecialDisclosure(serviceId, "customer-advice", "Show Customer Advice", "message-circle", renderSpecialServiceSection("Customer Advice", service.customerAdvice)));
    }

    blocks.push(renderHiddenDetailsByCategory(service, "restrictions", "Show Restrictions & Conditions", "ban"));
    blocks.push(renderHiddenDetailsByCategory(service, "charges", "Show Charges & Limits", "circle-dollar-sign"));
    blocks.push(renderSupervisorSection(service));
    blocks.push(renderFullPolicyDetails(service));

    const content = blocks.filter(Boolean).join("");

    if (!content) return "";

    return (
        '<div class="special-disclosure-group">' +
            content +
        "</div>"
    );
}

function renderSupervisorSection(service) {
    if (!service.supervisorSection || !Array.isArray(service.supervisorSection.items) || !service.supervisorSection.items.length) {
        return "";
    }

    const serviceId = escapeHTML(service.id || "");

    return renderSpecialDisclosure(
        serviceId,
        "supervisor",
        "Show FS / Supervisor Process",
        "user-check",
        renderSpecialServiceSection(service.supervisorSection.title || "FS / Supervisor Steps", service.supervisorSection.items),
        "special-toggle-supervisor"
    );
}

function renderHiddenDetailsByCategory(service, category, buttonText, icon) {
    if (!service.hiddenDetails || !Array.isArray(service.hiddenDetails.sections) || !service.hiddenDetails.sections.length) {
        return "";
    }

    const serviceId = escapeHTML(service.id || "");
    const sections = service.hiddenDetails.sections.filter(function (section) {
        return getSpecialDetailsCategory(section.title) === category;
    });

    if (!sections.length) return "";

    const sectionsHtml = sections.map(function (section) {
        return renderSpecialServiceSection(section.title, section.items);
    }).join("");

    return renderSpecialDisclosure(serviceId, category, buttonText, icon, sectionsHtml);
}

function renderFullPolicyDetails(service) {
    if (!service.hiddenDetails || !Array.isArray(service.hiddenDetails.sections) || !service.hiddenDetails.sections.length) {
        return "";
    }

    const serviceId = escapeHTML(service.id || "");
    const sectionsHtml = service.hiddenDetails.sections.map(function (section) {
        return renderSpecialServiceSection(section.title, section.items);
    }).join("");

    return renderSpecialDisclosure(serviceId, "full-policy", "Show Full Policy", "file-text", sectionsHtml);
}

function getSpecialDetailsCategory(title) {
    const t = normalizeSpecialServiceText(title);

    if (
        t.includes("charge") ||
        t.includes("fare") ||
        t.includes("limit") ||
        t.includes("dimension") ||
        t.includes("weight") ||
        t.includes("baggage")
    ) {
        return "charges";
    }

    if (
        t.includes("restriction") ||
        t.includes("condition") ||
        t.includes("timing") ||
        t.includes("special arrangement") ||
        t.includes("document") ||
        t.includes("interline") ||
        t.includes("codeshare") ||
        t.includes("seat rule") ||
        t.includes("refund")
    ) {
        return "restrictions";
    }

    return "full-policy";
}

function renderSpecialDisclosure(serviceId, type, buttonText, icon, content, extraButtonClass) {
    if (!content) return "";

    const safeType = escapeHTML(type || "details");
    const buttonClass = "special-toggle-btn" + (extraButtonClass ? " " + extraButtonClass : "");

    return (
        '<div class="special-hidden-block">' +
            '<button type="button" class="' + buttonClass + '" data-special-action="toggle-block" data-service-id="' + serviceId + '" data-block-type="' + safeType + '" data-show-label="' + escapeHTML(buttonText) + '">' +
                '<i data-lucide="' + escapeHTML(icon || "chevron-down") + '"></i>' +
                '<span>' + escapeHTML(buttonText) + "</span>" +
            "</button>" +
            '<div class="special-collapsible hidden" data-special-block="' + serviceId + "-" + safeType + '">' +
                content +
            "</div>" +
        "</div>"
    );
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

function toggleSpecialBlock(serviceId, type, button) {
    const block = document.querySelector('[data-special-block="' + serviceId + '-' + type + '"]');

    if (!block) return;

    const isHidden = block.classList.contains("hidden");

    block.classList.toggle("hidden", !isHidden);

    if (button) {
        const span = button.querySelector("span");

        if (span) {
            const showLabel = button.dataset.showLabel || span.textContent || "Show Details";
            span.textContent = isHidden ? showLabel.replace(/^Show\b/, "Hide") : showLabel;
        }
    }
}

function getSpecialServiceById(serviceId) {
    const services = getSpecialServicesData();

    return services.find(function (service) {
        return service.id === serviceId;
    });
}

function getSpecialServiceFormValues(serviceId) {
    const values = {};
    const form = document.querySelector('[data-service-form="' + serviceId + '"]');

    if (!form) return values;

    form.querySelectorAll("[data-field-id]").forEach(function (field) {
        values[field.dataset.fieldId] = field.value || "";
    });

    return values;
}

function applySpecialTemplate(template, values) {
    return String(template || "").replace(/\{\{(.*?)\}\}/g, function (match, key) {
        const cleanKey = String(key || "").trim();
        return values[cleanKey] || "";
    });
}

function buildSpecialServiceEmail(serviceId) {
    const service = getSpecialServiceById(serviceId);

    if (!service || !service.agentEmail) return null;

    const values = getSpecialServiceFormValues(serviceId);

    const subject = applySpecialTemplate(service.agentEmail.subjectTemplate, values);
    const body = buildSpecialServiceTextTableEmail(service, values);

    return {
        to: Array.isArray(service.agentEmail.to) ? service.agentEmail.to.join(";") : "",
        cc: Array.isArray(service.agentEmail.cc) ? service.agentEmail.cc.join(";") : "",
        subject: subject,
        body: body
    };
}

function buildSpecialServiceTextTableEmail(service, values) {
    const lines = [];
    const title = service.title || "Special Service";

    lines.push("Dear Team,");
    lines.push("");
    lines.push("Kindly assist with the below " + title + " request.");
    lines.push("");
    lines.push(title + " Request Details");
    lines.push("------------------------------------------------------------");

    if (service.agentForm && Array.isArray(service.agentForm.fields)) {
        let maxLabelLength = 0;

        service.agentForm.fields.forEach(function (field) {
            const label = field.label || field.id || "";
            if (label.length > maxLabelLength) maxLabelLength = label.length;
        });

        service.agentForm.fields.forEach(function (field) {
            const label = field.label || field.id || "";
            const value = values[field.id] || "";
            const paddedLabel = label.padEnd(maxLabelLength, " ");

            lines.push(paddedLabel + " : " + value);
        });
    }

    lines.push("------------------------------------------------------------");
    lines.push("");

    if (service.id === "falcon") {
        lines.push("Note:");
        lines.push("Customer has been advised that this request is subject to approval and is not a confirmation to carry the falcon(s).");
        lines.push("");
    }

    if (service.id === "cake-on-board") {
        lines.push("Note:");
        lines.push("Payment link has been sent / payment status to be verified as per process.");
        lines.push("");
    }

    lines.push("Regards");

    return lines.join("\r\n");
}
function buildSpecialServicePlainEmail(service, values) {
    const lines = [];

    lines.push("Dear Team,");
    lines.push("");
    lines.push("Kindly assist with the below " + (service.title || "Special Service") + " request.");
    lines.push("");

    if (service.agentForm && Array.isArray(service.agentForm.fields)) {
        service.agentForm.fields.forEach(function (field) {
            const label = field.label || field.id || "";
            const value = values[field.id] || "";
            lines.push(label + ": " + value);
        });
    }

    lines.push("");

    if (service.id === "falcon") {
        lines.push("Customer has been advised that this request is subject to approval and is not a confirmation to carry the falcon(s).");
    }

    if (service.id === "cake-on-board") {
        lines.push("Payment link has been sent / payment status to be verified as per process.");
    }

    lines.push("");
    lines.push("Regards");

    return lines.join("\n");
}


function copySpecialServiceEmail(serviceId) {
    const email = buildSpecialServiceEmail(serviceId);

    if (!email) return;

    const fullText =
        "To: " + email.to + "\n" +
        (email.cc ? "CC: " + email.cc + "\n" : "") +
        "Subject: " + email.subject + "\n\n" +
        email.body;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(function () {
            alert("Email body copied successfully.");
        }).catch(function () {
            fallbackCopyText(fullText);
        });
    } else {
        fallbackCopyText(fullText);
    }
}

function fallbackCopyText(text) {
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        document.execCommand("copy");
        alert("Email body copied successfully.");
    } catch (error) {
        alert("Copy failed. Please copy manually.");
    }

    document.body.removeChild(textarea);
}

function openSpecialServiceEmail(serviceId) {
    const email = buildSpecialServiceEmail(serviceId);

    if (!email) return;

    const baseUrl = "https://outlook.cloud.microsoft/mail/deeplink/compose";

    const outlookUrl =
        baseUrl +
        "?to=" + encodeURIComponent(email.to || "") +
        (email.cc ? "&cc=" + encodeURIComponent(email.cc) : "") +
        "&subject=" + encodeURIComponent(email.subject || "") +
        "&body=" + encodeURIComponent(email.body || "");

    window.open(outlookUrl, "_blank", "noopener,noreferrer");
}

function handleSpecialServicesClick(event) {
    const serviceTab = event.target.closest("[data-special-service-tab]");
    const button = event.target.closest("[data-special-action]");

    if (serviceTab) {
        renderSpecialServices(serviceTab.dataset.specialServiceTab);
        return;
    }

    if (!button) return;

    const action = button.dataset.specialAction;
    const serviceId = button.dataset.serviceId;
    const blockType = button.dataset.blockType;

    if (!serviceId) return;

    if (action === "copy-email") {
        copySpecialServiceEmail(serviceId);
    } else if (action === "open-email") {
        openSpecialServiceEmail(serviceId);
    } else if (action === "toggle-block") {
        toggleSpecialBlock(serviceId, blockType, button);
    }
}

function clearSpecialServiceFormValues() {
    const grid = document.getElementById("specialServicesGrid");

    if (!grid) return;

    grid.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (field.type === "checkbox" || field.type === "radio") {
            field.checked = false;
        } else if (field.tagName === "SELECT") {
            field.selectedIndex = 0;
        } else {
            field.value = "";
        }

        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
    });
}

const operationsGuideData = [
    {
        id: "holidays",
        title: "Holidays Bookings",
        icon: "palmtree",
        quickGuide: {
            channel: "PureCloud transfer / Supervisor callback",
            timing: "Mon-Thu 09:00-20:00, Fri-Sun 09:00-18:00",
            type: "Holiday package / existing holiday booking",
            action: "During working hours transfer to Holidays Team; outside hours collect details or use emergency flow for urgent existing bookings.",
            warning: "Do not use the Holidays emergency number for new package enquiries during working hours."
        },
        classifications: [
            "General holidays enquiry / quotation request",
            "New holidays package booking",
            "Amend / cancel existing holidays booking"
        ],
        sections: [
            {
                title: "Agent Process",
                items: [
                    "General information: guide customer to https://holidays.flydubai.com/en/ and assist with basic navigation.",
                    "New package within working hours: transfer caller to Holidays Team via PureCloud.",
                    "New package outside working hours: collect caller name, mobile number, and preferred communication language AR / EN / RU, then escalate to Supervisor for callback.",
                    "Existing booking within working hours: transfer caller to Holidays Team via PureCloud.",
                    "Existing booking outside working hours with travel within 48 hours: transfer via PureCloud to Holidays emergency number."
                ]
            },
            {
                title: "Customer Advice",
                items: [
                    "Holiday packages include flights and hotels, with activities, transfers, insurance, and UAE visa services if available.",
                    "Holiday packages can be purchased on codeshare flights.",
                    "Miles points are accrued for flights only.",
                    "Payment option is credit card only.",
                    "Contact Centre can assist through SPRINT for existing flight services only: baggage, seats, special meals, baggage upgrade, wheelchair, insurance, and similar services."
                ]
            },
            {
                title: "Contacts",
                items: [
                    "Holidays by flydubai: holidays@flydubai.com",
                    "Group inquiries, 10 or more passengers: holidaysgroups@flydubai.com",
                    "Travel Agent: holidaysoperation@flydubai.com",
                    "UAE retail shops can assist with Holidays enquiries within retail shop working hours."
                ]
            }
        ]
    },
    {
        id: "auto-split-od",
        title: "Auto Split OD",
        icon: "git-branch",
        quickGuide: {
            channel: "SPRINT",
            timing: "After flight closure when connection legs have different statuses",
            type: "FZ-FZ connection booking handling",
            action: "Check leg status order, then follow allowed / not allowed modify or cancellation flow.",
            warning: "Interline, codeshare, circular flights, and unsupported segment statuses are excluded."
        },
        classifications: [
            "Boarded then No-show",
            "No-show then Boarded",
            "Connection modification / cancellation"
        ],
        sections: [
            {
                title: "Applies To",
                items: [
                    "FZ-FZ connection bookings only.",
                    "Fare types: Lite, Value, Flex, and Business Class.",
                    "OD split occurs only when flight legs have different statuses.",
                    "After flight closure, SPRINT automatically updates each leg status."
                ]
            },
            {
                title: "Core Rules",
                items: [
                    "Leg 1 boarded and Leg 2 no-show: customer can cancel or modify the no-show leg as per fare rules.",
                    "Leg 1 no-show and Leg 2 boarded: modification or cancellation is not permitted.",
                    "One-way connection, boarded then no-show: modification or cancellation on no-show leg may be allowed as per fare rules.",
                    "Round-trip connection: inbound segment changes may be allowed as per fare rules; no-show leg handling depends on leg status order and system flow.",
                    "Cancellation of no-show segment must be completed by Supervisor / FS in-charge when applicable."
                ]
            },
            {
                title: "Exclusions",
                items: [
                    "Interline bookings.",
                    "Codeshare bookings.",
                    "Circular flights.",
                    "Any segment status outside Leg 1 Boarded / Leg 2 No-show or Leg 1 No-show / Leg 2 Boarded."
                ]
            }
        ]
    },
    {
        id: "olci-lounge",
        title: "OLCI Lounge",
        icon: "armchair",
        quickGuide: {
            channel: "Online Check-In via flydubai website",
            timing: "Within 48 hours before departure when OLCI is open",
            type: "Business Class lounge access purchase",
            action: "Explain eligibility and expected SSR handling; classify case as Online check-in > Lounge when needed.",
            warning: "Only 4-hour access remains available online; 8-hour online access is disabled."
        },
        classifications: [
            "Case reason: Online check-in",
            "Sub reason: Lounge",
            "Use for pricing complaints, unavailable access due to peak hours, or unsuccessful payment."
        ],
        sections: [
            {
                title: "Eligibility",
                items: [
                    "Available for passengers travelling or connecting with flydubai from DXB Terminal 2.",
                    "Available during OLCI via flydubai website if OLCI is open for the flight.",
                    "Supported for Economy passengers.",
                    "Supported for passengers upgraded to J class via OLCI or Plusgrade.",
                    "Supported for ID50 bookings in J and Y class.",
                    "Infants receive complimentary access when accompanied by an eligible adult."
                ]
            },
            {
                title: "Restrictions",
                items: [
                    "Group bookings are excluded from online lounge purchase.",
                    "Infant passengers cannot purchase lounge access independently.",
                    "Passengers already eligible for lounge access, such as Business Class or loyalty tier entitlement, are restricted.",
                    "All charges are non-refundable and non-transferable.",
                    "If OLCI is cancelled, the SSR remains retained."
                ]
            },
            {
                title: "Expected Handling",
                items: [
                    "Economy voluntary modification: SSR is non-refundable and agents should drop the SSR.",
                    "Economy voluntary cancellation: drop SSR and do not offer refund.",
                    "Economy upgraded to J class: SSR is dropped and no refund offered.",
                    "FDIS re-accommodation to new flight: SSR is moved to the new flight.",
                    "FDIS cancellation and refund to FOP or voucher: SSR refund follows FOP or voucher.",
                    "Flight reinstatement, no-show change or cancel, terminal change: refer to Shift In Charge for manual SSR handling."
                ]
            }
        ]
    },
    {
        id: "dubai-stopover",
        title: "Dubai Stopover",
        icon: "hotel",
        quickGuide: {
            channel: "flydubai.com / Travel Agency portal",
            timing: "Book at least 5 days before travel; connection in Dubai 12-24 hours",
            type: "Complimentary 24-hour Dubai hotel stay",
            action: "Check eligibility at initial booking and explain hotel voucher / exclusion rules.",
            warning: "Dubai Stopover cannot be added later and is not available for one-way, Pay Later, interline, codeshare, group, GDS PNRs."
        },
        classifications: [
            "Dubai stopover > Terms and conditions",
            "Dubai stopover > Cleanliness/service"
        ],
        sections: [
            {
                title: "Eligibility",
                items: [
                    "Return bookings only with a Dubai connection between 12 and 24 hours.",
                    "Economy and Business cabins are eligible.",
                    "Both flights in the itinerary must be operated by flydubai.",
                    "Offer can be used once per booking, either outbound or inbound.",
                    "Available only on selected origin-destination routes.",
                    "Eligible flights show a Complementary Dubai hotel tag during booking."
                ]
            },
            {
                title: "Hotel Rules",
                items: [
                    "Hotel is auto-assigned based on availability; passenger cannot choose or change preference.",
                    "Hotel details are shown on the review page before payment.",
                    "After booking confirmation, hotel voucher is sent to the registered email ID.",
                    "Room is complimentary.",
                    "Meals, transfers, upgrades, incidental charges, and UAE visa are not included.",
                    "Passenger is responsible for visa eligibility and compliance."
                ]
            },
            {
                title: "Modification / Cancellation / FDIS",
                items: [
                    "DSO is removed if passenger cancels booking.",
                    "DSO is removed if passenger modifies the DSO segment.",
                    "DSO is removed if travel sector is changed via TA portal.",
                    "DSO is removed if a no-show segment is modified via TA portal.",
                    "DSO is removed if passenger experiences flight disruption and opts for rebooking or cancellation.",
                    "DSO is retained for adding or removing passenger, cabin upgrade or downgrade, adding or removing SSRs, non-DSO date changes, schedule changes, and aircraft changes."
                ]
            }
        ]
    },
    {
        id: "standard-ssr-cutoffs",
        title: "Standard SSR Cut-offs",
        icon: "timer",
        quickGuide: {
            channel: "Website / Manage Booking, Contact Centre, OLCI, Travel Shop where applicable",
            timing: "Meal 24h, Seat 3h, Baggage 6h existing booking, Insurance before journey commences",
            type: "Pre-purchased SSR / ancillary cut-off matrix",
            action: "Check booking scenario first: existing booking, modification, or new booking.",
            warning: "For new booking requests via Contact Centre, seats, baggage, and insurance can be added up to 2h before departure."
        },
        classifications: ["From consolidated GO TO guide", "Lite / Value / Flex / Business"],
        sections: [
            {
                title: "General Cut-offs",
                items: [
                    "Special Meal SPML: selected up to 24 hours prior to departure.",
                    "Seat selection: up to 3 hours prior to departure.",
                    "Travel insurance: added any time before the journey commences.",
                    "Baggage add or upgrade for existing booking: up to 6 hours prior via Website, Contact Centre, or OLCI.",
                    "Modifying a flight and adding baggage: Website up to 2 hours prior; Contact Centre must seek Supervisor approval up to 2 hours prior.",
                    "New booking and adding baggage: up to 2 hours prior via Website or Contact Centre; Contact Centre requires Supervisor approval."
                ]
            },
            {
                title: "Important Rules",
                items: [
                    "Moving or cancellation of optional extras such as baggage and seat is allowed only 24 hours prior to departure.",
                    "Insurance is non-refundable.",
                    "If modification is done within the last 24 hours before departure, already paid SSR charges may not be carried forward or adjusted."
                ]
            }
        ]
    },
    {
        id: "economy-seating-matrix",
        title: "Economy Seating Matrix",
        icon: "armchair",
        quickGuide: {
            channel: "Manage Booking, OLCI, SPRINT",
            timing: "Seat selection up to 3 hours prior to departure",
            type: "Seat availability by booking type and channel",
            action: "Check booking type first, then use the allowed channel for seat purchase or complimentary seat.",
            warning: "Rows 11-32 excluding 15 and 16 may be complimentary for some EK codeshare cases; rows 1-10 and 15-16 are purchasable."
        },
        classifications: ["Seat", "XLGR / FRST / SPST", "Web / OLCI / SPRINT"],
        sections: [
            {
                title: "FZ Prime Direct",
                items: [
                    "Manage Booking: Lite / Value all seats paid; Flex standard free and XLGR paid.",
                    "OLCI: auto-seat is free; specific selection available for purchase.",
                    "SPRINT: Lite / Value all seats paid; Flex standard free and XLGR paid."
                ]
            },
            {
                title: "FZ Prime GDS",
                items: [
                    "Manage Booking: all seats available for pre-purchase, none complimentary.",
                    "OLCI: SPST can be booked directly from GDS for free.",
                    "SPRINT: all seats available for pre-purchase, none complimentary."
                ]
            },
            {
                title: "Codeshare Notes",
                items: [
                    "EK codeshare: XLGR / FRST available for purchase, SPST is free.",
                    "UA / AC codeshare: XLGR / FRST purchasable, SPST is free.",
                    "Use exact booking channel and aircraft/seat map availability before advising."
                ]
            }
        ]
    },
    {
        id: "baggage-upgrade-matrix",
        title: "Baggage Upgrade Matrix",
        icon: "luggage",
        quickGuide: {
            channel: "Website, TA Portal, SPRINT, OLCI, Airport check-in for excluded cases",
            timing: "Existing booking 6h; new booking or modification 2h where allowed",
            type: "Baggage add / upgrade channel matrix",
            action: "Check itinerary type and ticket document number before advising channel.",
            warning: "Interline booking baggage upgrades are never permitted prior to departure; must be done at airport check-in counter."
        },
        classifications: ["Baggage", "Web / TA / SPRINT / OLCI", "GDS document matrix"],
        sections: [
            {
                title: "FZ Prime Direct / TA Portal Non-GDS",
                items: [
                    "FZ Prime point-to-point: Web YES, TA Portal NA, SPRINT YES, OLCI YES where available.",
                    "FZ Prime connection: Web YES, TA Portal NA, SPRINT YES, OLCI YES where available.",
                    "OLCI baggage upgrade is not available for passengers from Non-DCS stations.",
                    "Eligible booking channels for OLCI baggage upgrade include Web / ENT / mobile app bookings, Travel Agent portal bookings, Staff ID50 bookings, and eligible GDS point-to-point bookings at SPRINT stations.",
                    "Codeshare baggage upgrade is available only for point-to-point bookings in weight concept, with no additional purchase allowed for bookings with BAGC 25kg."
                ]
            },
            {
                title: "GDS Matrix By Document",
                items: [
                    "141 FZ Prime PTP / CNX: Web NO, TA Portal NO, SPRINT YES but Contact Centre will not add, OLCI YES.",
                    "141 FZ DCI: Web NO, TA Portal NO, SPRINT NO, OLCI NO.",
                    "169 / 275 / 365 FZ Prime PTP / CNX: Web NO, TA Portal NO, SPRINT YES, OLCI YES.",
                    "176 FZ Prime or EK: Web NO, TA Portal NO, SPRINT NO, OLCI YES using weight concept.",
                    "016 / 014 EK / UA / AC: Web NO, TA Portal NO, SPRINT NO, OLCI NO."
                ]
            },
            {
                title: "Baggage Code Notes",
                items: [
                    "KRT deal example: BAGX included 40kg; BUPD upgrades to 50kg; BUPE upgrades to 60kg.",
                    "EXBG is an excess baggage waiver authorized by Chief or SVP and can use EB1.0, EB1.5, EB2.0, or PC values.",
                    "BUPX may be used in normal upgrade examples when adding allowance on top of existing baggage and waiver.",
                    "EXPC is extra piece handling for more than three checked pieces, subject to availability.",
                    "OOGS / OOGL are airport oversize baggage SSRs based on dimensions."
                ]
            }
        ]
    },
    {
        id: "assistance-medical",
        title: "Assistance / Medical",
        icon: "accessibility",
        quickGuide: {
            channel: "Contact Centre, Manage Booking where available, Travel Shop, Airport support",
            timing: "12h to 72h depending SSR",
            type: "Assistance, medical, and special requests",
            action: "Use SSR-specific cut-off and check whether medical or approval documents are required.",
            warning: "WCHC and medical-sensitive requests may require document verification or approval."
        },
        classifications: ["Wheelchair", "WCHR / WCHS / WCHC", "DPNA", "PPOC", "SVAN", "RSTD", "BLND / DEAF"],
        sections: [
            {
                title: "Cut-offs",
                items: [
                    "Wheelchair WCHR: at least 12 hours prior to departure.",
                    "Wheelchair WCHS / WCHC: at least 24 hours prior to departure.",
                    "Disabled Passenger DPNA: added up to 12 hours prior to departure.",
                    "Portable Oxygen PPOC: Contact Centre can add up to 4 hours prior to departure.",
                    "Service Animal SVAN: pre-approval required no less than 72 hours prior.",
                    "Restraint Device RSTD: clearance required at least 48 hours before flight.",
                    "Visual / Hearing BLND / DEAF: added up to 48 hours prior to departure."
                ]
            },
            {
                title: "Catering / Gift Requests",
                items: [
                    "Cake and Fruit Basket: requested at least 48 hours prior to departure.",
                    "Flower arrangements: 48 hours prior, currently suspended."
                ]
            }
        ]
    },
    {
        id: "equipment-animals",
        title: "Equipment / Animals",
        icon: "package-check",
        quickGuide: {
            channel: "Contact Centre, SPRINT, Supervisor / FS, Security approval where applicable",
            timing: "Sporting 24h, Weapons 96h, Falcon 48h+",
            type: "Equipment, weapons, and animal carriage",
            action: "Check item type, dimensions, weight, documents, approval, and applicable charge.",
            warning: "Weapons and falcons must not be confirmed before required approval is received."
        },
        classifications: ["SPEQ / SPEX", "WEAP", "PETC"],
        sections: [
            {
                title: "Cut-offs",
                items: [
                    "Sporting Equipment SPEQ / SPEX: pre-booked at least 24 hours prior.",
                    "Supervisors can add sporting equipment up to 12 hours prior if the limit is not reached.",
                    "Sporting Weapons WEAP: documents must be provided at least 96 hours / 4 working days prior.",
                    "Falcon PETC: booking requests must be more than 48 hours before departure."
                ]
            },
            {
                title: "Agent Warning",
                items: [
                    "Sporting equipment over 32 kg is not accepted.",
                    "Sporting weapons require documents and security approval.",
                    "Falcon carriage is subject to airline and destination approval."
                ]
            }
        ]
    },
    {
        id: "travel-shops-cutoffs",
        title: "Travel Shops Cut-offs",
        icon: "store",
        quickGuide: {
            channel: "UAE Travel Shops",
            timing: "D > 6, D > 4, D > 72h, D > 24 depending service",
            type: "Travel shop service cut-offs",
            action: "Use Travel Shop D-rules before accepting the request.",
            warning: "Travel Shop cut-offs are stricter than some Contact Centre / Web flows."
        },
        classifications: ["UAE Travel Shops", "D-rule cut-offs"],
        sections: [
            {
                title: "Cut-off Rules",
                items: [
                    "Name Change / Correction: more than 6 days before departure.",
                    "New Ticket Government Deals: more than 6 days before departure.",
                    "Visa OK to Board VIOK: more than 4 days before departure.",
                    "Credit Card Verification CCOK: more than 4 days before departure.",
                    "Baggage Add / Upgrade: more than 4 days before departure.",
                    "Seat Assignment: more than 4 days before departure.",
                    "Insurance: more than 4 days before departure.",
                    "Business Class Upgrade: more than 4 days before departure.",
                    "New Ticket Normal: more than 4 days before departure.",
                    "Iraq OK to Board: more than 72 hours before departure.",
                    "Special Meal SPML: more than 24 hours before departure.",
                    "Cancelling extras seat / bag: more than 24 hours before departure."
                ]
            }
        ]
    },
    {
        id: "upgrade-cutoffs",
        title: "Upgrade Cut-offs",
        icon: "arrow-up-circle",
        quickGuide: {
            channel: "Bidding, OLCI banner, Airport counter",
            timing: "Bidding 18h outstations / 10h Dubai; OLCI 48h to 3h or 12h; airport up to 2h",
            type: "Business Class upgrade cut-offs",
            action: "Choose the correct upgrade path by departure point and channel.",
            warning: "OLCI upgrade window differs for Dubai and outstation departures."
        },
        classifications: ["Bid upgrade", "OLCI banner upgrade", "Airport counter upgrade"],
        sections: [
            {
                title: "Cut-offs",
                items: [
                    "Bidding for upgrades: starts any time.",
                    "Bidding cut-off: 18 hours for outstations.",
                    "Bidding cut-off: 10 hours for Dubai.",
                    "OLCI banner upgrade for Dubai departures: from 48 hours down to 3 hours before departure.",
                    "OLCI banner upgrade for outstation departures: from 48 hours down to 12 hours before departure.",
                    "Airport counter upgrade: up to 2 hours prior to departure.",
                    "Airport Business Class upgrade applies to DXB Terminal 2 and Terminal 3 departure flights.",
                    "Passenger can purchase upgrade to J class at check-in desk for FZ flights when offered D-2 hours."
                ]
            },
            {
                title: "Airport Upgrade Product",
                items: [
                    "Product includes J class seat.",
                    "Product includes priority baggage.",
                    "Product includes priority boarding.",
                    "Product includes free IFE on board.",
                    "Product includes J class meal.",
                    "Use SSR / code BUPZ where applicable for Business Class airport upgrade handling."
                ]
            }
        ]
    },
    {
        id: "g-fare-rules",
        title: "G Fare Rules",
        icon: "ticket",
        quickGuide: {
            channel: "Web / Mobile / SPRINT / TA Portal depending G fare type",
            timing: "Follow fare and channel rules",
            type: "G fare modification and SSR action rules",
            action: "Identify G fare type and booking channel before modifying or adding SSR.",
            warning: "For Group Booking through TA Portal, Contact Centre must refer to issuer and cannot modify, name change, or add SSR."
        },
        classifications: ["Block Fare", "Group Booking", "TA Portal"],
        sections: [
            {
                title: "Rules By Channel",
                items: [
                    "Block Fare through Web / Mobile / SPRINT: permitted through direct channels; name change permitted.",
                    "Group Booking through TA Portal: refer to issuer; Contact Centre cannot modify, name change, or add SSRs.",
                    "Block Fare through TA Portal: refer to issuer for modification.",
                    "Block Fare through TA Portal: customer can add SSRs via Manage Booking.",
                    "Contact Centre can cancel SSR only if it was added via Web."
                ]
            }
        ]
    },
    {
        id: "operational-airport-ssrs",
        title: "Operational SSRs",
        icon: "plane-takeoff",
        quickGuide: {
            channel: "Contact Centre, Supervisor / FS, Airport as applicable",
            timing: "BHFT 50h, CCHK 4h, baggage 6h, LRPT/ERPT by DXB T2 timing",
            type: "Operational and airport SSRs",
            action: "Use only for the operational scenario described; escalate unclear cases.",
            warning: "These SSRs are operational controls and should not be treated like normal paid ancillaries."
        },
        classifications: ["BHFT", "CCHK", "ID50 baggage", "LRPT / ERPT"],
        sections: [
            {
                title: "Operational SSRs",
                items: [
                    "Hold My Fare BHFT: sale cut-off is 50 hours before departure; hold time limit is 49 hours.",
                    "Credit Card Verification CCHK: must be done at least 4 hours prior to departure at the airport if not verified elsewhere.",
                    "Staff ID50 Waitlist Baggage: added before the 6-hour cut-off.",
                    "Early / Late Reporting DXB T2 only: LRPT within 6 hours of flight and ERPT within 12 hours of earlier flight."
                ]
            }
        ]
    },
    {
        id: "airport-shop-fees",
        title: "Airport / Shop Fees",
        icon: "receipt",
        quickGuide: {
            channel: "Airport Sales Desk / UAE Retail Shops",
            timing: "At point of service / payment",
            type: "Service fee and administrative fee reference",
            action: "Check service type, location, and whether exception applies before quoting fee.",
            warning: "A 3% administrative fee applies to all payment transactions completed at UAE travel shops, except Deira Travel Shop and Airport Sales Desk."
        },
        classifications: ["Airport Sales Desk", "UAE Travel Shops", "3% admin fee", "PRNT"],
        feeRows: [
            ["New booking - Economy", "AED 80 per passenger per segment", "AED 60 per passenger per segment"],
            ["New booking - Business", "AED 100 per passenger per segment", "AED 100 per passenger per segment"],
            ["Modification of flights including upgrade to J class", "AED 80 per passenger irrespective of the segments", "AED 30 per passenger irrespective of the segments"],
            ["Baggage / seat / ancillary addition", "AED 80 per PNR", "AED 30 per passenger irrespective of the segments"],
            ["Ticket print out", "AED 80 per PNR", "AED 30 per PNR"],
            ["Name correction", "AED 80 per passenger + applicable NC SSR", "AED 30 per passenger irrespective of the segments + applicable NC SSR"],
            ["Visa OK to board", "AED 80 per passenger", "AED 30 per passenger"],
            ["Rebate ticket issuance / rebooking", "AED 80 per passenger irrespective of segment", "AED 60 per passenger irrespective of segment"],
            ["Credit card verification", "AED 80 per PNR", "AED 30 per PNR"],
            ["Book online / call centre complete payment", "AED 80 per PNR irrespective of class / segments / number of pax", "AED 60 per PNR irrespective of class / segments / number of pax"],
            ["Issuing fee IFEE, rarely used in AUH for TA", "NA", "AED 45 per passenger per segment"],
            ["DXB POL / ESAAD CARD DEAL", "NA", "Regular charges at all UAE shops. Deira charges AED 120 for Y class return ticket and AED 200 for J class return ticket per pax."],
            ["DXB IMG COR DEAL", "NA", "Regular charges at all UAE shops. Deira charges AED 120 for Y class return ticket and AED 200 for J class return ticket per pax."],
            ["GOSHOW FEE", "NIL", "Passengers may request last-minute booking at the check-in desk, including addition of infants to an existing booking. Applies to DXB T2 departures only. Acceptance and carriage is subject to capacity restrictions and approval. Handled at airport only."],
            ["Balance payment completion", "Balance due + service fee of AED 80", "AED 30 per PNR. Applies to DXB T2 departures only. Passengers with balance payment that cannot be cleared at check-in desk will be directed to Sales Desk. Agent may inform customer with this service."],
            ["Printing fee", "SSR: PRNT AED 25 + VAT", "Passengers need missing printouts as part of travel document requirements. Nominal fee per document of max 3 papers. Applies to DXB T2 departures only and all passenger types flying on FZ flights, codeshare, interline, staff. Handled at airport only."]
        ],
        sections: [
            {
                title: "Important Note",
                items: [
                    "A 3% administrative fee applies to all payment transactions completed at UAE travel shops, except for Deira Travel Shop and the Airport Sales Desk."
                ]
            }
        ]
    },
    {
        id: "ssr-guide",
        title: "SSR / Ancillary Guide",
        icon: "list-checks",
        quickGuide: {
            channel: "SPRINT / Salesforce / email as applicable",
            timing: "Use service-specific cut-off",
            type: "SSR and common ancillary quick reference",
            action: "Use this table to choose the correct SSR or service code, channel, charge, and approval path.",
            warning: "Some rows are ancillary/service actions rather than technical SSRs; open the full policy or SPRINT flow before applying."
        },
        ssrRows: [
            ["PETC", "Falcon", "Contact Centre, Salesforce, Supervisor / FS, Reservations Support", "More than 48h before departure", "Approval request", "AED 1500 per falcon per direction", "Yes", "Create unpaid booking, collect falcon details, escalate case, update SPRINT. Do not confirm until approved."],
            ["CAKE", "Cake on Board", "Contact Centre, email request, Supervisor / FS", "More than 48h before departure", "Catering request", "As per cake option", "Special stations need Shift In Charge", "Add SSR CAKE, collect cake details, send request email, send payment link, update Salesforce / SPRINT."],
            ["FRBS", "Fruit Basket", "Contact Centre / SPRINT", "Up to 48h before departure", "Paid ancillary", "AED 35 or equivalent", "No special approval mentioned", "Use SPRINT flow. Apply service cut-off and payment rules."],
            ["EXST", "Extra Seat for Comfort", "Contact Centre / SPRINT; GDS requires separate PNR handling; airport go-show at DXB T2 subject to approval", "At least 2h before departure", "Seat ancillary", "Equal fare + standard seat assignment charges", "Depends booking type", "EXST is available in both Economy and Business Class. FZ prime only, not interline/codeshare. Add adult extra seat, add zero-value SSR EXST to requesting passenger, assign adjoining seats. Max 2 EXST per passenger; not emergency exit rows 15/16."],
            ["CBBG", "Cabin Baggage on Seat", "Contact Centre / SPRINT; GDS requires separate PNR handling; airport go-show at DXB T2 subject to approval", "At least 2h before departure", "Cabin baggage / seat ancillary", "Equal fare + standard seat assignment charges", "Depends booking type", "CBBG is available only in Economy Class. CBBG is not available in Business Class. FZ prime only, not interline/codeshare. Add zero-value SSR CBBG to requesting passenger, assign adjoining seats, avoid rows 14/15/16/17. Max 1 CBBG seat; max baggage on blocked seat 75kg; no extra checked baggage allowance."],
            ["SPEQ", "Sporting Equipment 160-189cm", "Contact Centre / SPRINT / Supervisor or FS", "At least 24h before departure; Supervisor / FS may check possibility up to 12h if limit not reached", "Special baggage", "AED 150 per flight / sector", "Restricted / capacity controlled", "Max 32kg and max 10 equipment per flight. Add SPEQ per leg for 160-189cm by L+W+H. Cancellation allowed up to 24h before departure with refund to voucher where applicable."],
            ["SPEX", "Sporting Equipment 190-350cm", "Contact Centre / SPRINT / Supervisor or FS", "At least 24h before departure; Supervisor / FS may check possibility up to 12h if limit not reached", "Special baggage", "AED 270 per flight / sector", "Restricted / capacity controlled", "Max 32kg and max 10 equipment per flight. Add SPEX per leg for 190-350cm by L+W+H. Beyond 350cm requires pre-authorization. Cancellation allowed up to 24h before departure with refund to voucher where applicable."],
            ["WEAP / SPEX", "Sporting Weapons", "Contact Centre, letstalk, Supervisor / FS, Security approval", "96h / 4 working days before travel", "Security approval", "WEAP AED 300 + SPEX AED 270 per passenger per segment", "Yes", "Customer must email documents first or provide case number. Sporting weapons need WEAP plus SPEX charges. Do not confirm without security approval."],
            ["BAG / BAGX / BUP*", "Baggage / Baggage Upgrade", "Website / Manage Booking, Contact Centre, Travel Shop, OLCI, SPRINT, Airport where applicable", "Existing booking: 6h before departure. New booking / modification: Website 2h; Contact Centre up to D-2 via Shift In Charge, subject to availability.", "Ancillary service", "As per system / baggage product / route", "Usually no", "Baggage upgrade is multi-channel, not airport-only. OLCI supported for eligible bookings; interline baggage upgrade is not available before departure."],
            ["BAGX / BUPL / BUPX / BUPZ / BUPD / BUPE", "Baggage Upgrade SSR Codes", "Website, Contact Centre, Travel Shop, OLCI, SPRINT as eligible", "Use baggage upgrade cut-off: 6h existing booking, 2h new booking/modification where allowed", "Baggage upgrade", "As per system / route. KRT example: BAGX 40kg included, BUPD 50kg AED 100, BUPE 60kg AED 200.", "Depends eligibility", "BAGX adds 40kg, BUPL adds 10kg to existing 20kg, BUPX adds 20kg to existing 20kg, BUPZ adds 10kg to existing 30kg, BUPD 50kg, BUPE 60kg. Upgrade on top of existing baggage SSR; do not cancel/refund existing baggage SSR just to reprice."],
            ["BAGI", "Infant Baggage Allowance", "SPRINT / applicable booking flow", "As per infant/baggage handling rules", "Baggage SSR", "Included only when baggage-inclusive fare applies", "No", "GO TO: 10kg checked-in baggage allowance SSR on SPRINT is BAGI."],
            ["EXPC", "Extra Checked Baggage Piece", "Sprint DCS / Airport handling", "At airport / check-in handling", "Baggage handling SSR", "Approx AED 200 per extra piece, subject to change + airport service fee", "Subject to availability", "For passengers with more than three checked baggage pieces. Each piece still must comply with baggage rules."],
            ["OOGS / OOGL", "Out of Gauge / Oversize Bag", "Airport / check-in handling", "At check-in", "Oversize baggage SSR", "Additional airport handling charge", "Airport acceptance", "OOGS small 160-189cm; OOGL large 190-300cm by L+W+H."],
            ["EXBG", "Excess Baggage Waiver", "SPRINT ENT / authorized waiver", "Pre-approved only", "Waiver / allowance SSR", "Authorized by Chief / SVP", "Yes", "EXBG uses values like EB1.0 extra 10kg, EB1.5 extra 15kg, EB2.0 extra 20kg, or PC concept. If customer wants normal upgrade, follow normal baggage upgrade process."],
            ["SEAT", "Seat Selection", "Website / Manage Booking, Contact Centre, OLCI, Travel Shop, Airport where applicable", "Up to 3h before departure", "Ancillary service", "As per selected seat", "Usually no", "Seats can be added up to 3h prior. Moving/cancellation of optional extras such as seat is allowed only 24h prior."],
            ["SPML / MLIN", "Meals / Special Meals", "Website / Manage Booking, Contact Centre, Travel Shop, OLCI where available", "SPML up to 24h before departure. MLIN included where applicable.", "Meal service", "As per meal / fare product", "Catering exception only", "Lite/Value/Flex: MLIN included, SPML selectable up to 24h. Business: meal included, SPML selectable up to 24h."],
            ["WCHR / WCHS / WCHC", "Wheelchair Assistance", "Contact Centre, Website / Manage Booking where available, Travel Shop, Airport", "Request as early as possible before departure", "Assistance SSR", "Free service", "WCHC may require medical document verification", "GO TO lists WCHR, WCHS, WCHC and battery wheelchair SSRs WCBD, WCBW, WCLB. WCHC only upon verification of medical docs."],
            ["WCBD / WCBW / WCLB", "Battery Wheelchair", "Contact Centre, Airport, Supervisor / FS if unclear", "Request as early as possible before departure", "Mobility aid SSR", "Free service", "Battery acceptance criteria apply", "Dry, wet, and lithium battery wheelchairs require acceptance checks and battery rules."],
            ["INS", "Insurance", "Website / Manage Booking, Contact Centre, Travel Shop where applicable", "Any time before journey commences", "Ancillary service", "As per insurance product", "Subject to product eligibility", "Insurance is non-refundable. Can be added any time before the journey commences."],
            ["TRBF", "Transfer Baggage Fee", "Contact Centre / Airport / transfer handling flow", "Connection handling dependent", "Transfer baggage", "As applicable", "Depends itinerary", "Applies where transfer baggage fee is required for separate tickets / connection handling."],
            ["Airport J Upgrade", "Business Class Upgrade at Airport", "Airport check-in desk / Airport Sales Desk", "Offered D-2 hours for DXB T2 and T3 departures", "Airport upgrade", "Dynamic / airport upgrade charge + applicable service fee", "Subject to availability", "Applies to DXB T2 and T3 departure flights on FZ where offered. Includes J class seat, priority baggage, priority boarding, free IFE, and J class meal."],
            ["PRNT", "Printing Fee", "Airport Sales Desk / DXB T2 airport handling", "At airport when document printout is required", "Airport service SSR", "AED 25 + VAT", "No", "For missing printouts required as travel documents. Applies per document of maximum 3 papers."],
            ["NCFB / NCFE", "Name Correction Fees", "Contact Centre with Supervisor / FS confirmation, Airport Sales Desk, UAE Travel Shops", "Not permitted within 6h before departure; fully active PNR only", "Name correction service", "NCFB = name change fee 2 characters. NCFE = fee charges for name change. Apply USD 30 / USD 100 policy where applicable plus local service fee.", "Supervisor / FS confirmation required", "Use only for genuine corrections, not different passengers. Not for GDS/codeshare/interline, checked-in/OLCI, utilized, or no-show bookings. Airport Sales Desk AED 80 per passenger + applicable NC SSR; UAE shops AED 30 per passenger + applicable NC SSR."],
            ["VIOK", "Visa OK to Board", "UAE Travel Shops / Airport Sales Desk where applicable", "Travel shop cut-off D > 4", "Document / visa service", "Airport AED 80 per passenger; UAE shops AED 30 per passenger", "Depends destination/document requirement", "Use for Visa OK to Board service handling."],
            ["CCOK / CCHK", "Credit Card Verification", "Airport / Travel Shop / operational verification", "At least 4h prior if airport verification required", "Payment verification", "Airport AED 80 per PNR; UAE shops AED 30 per PNR", "May be required", "CCHK must be done at least 4h prior at airport if not verified elsewhere."],
            ["STPN", "Stopover / Re-accommodation SSR", "Supervisor / FS / Reservations Support", "After reaccommodation where applicable", "Disruption handling SSR", "Override may be AED 100 when system not picking charge", "Senior Manager approval if overridden", "Used after reaccommodation when applicable. Senior Manager approval required only if STPN charge is overridden."],
            ["KEEP", "Keep Booking From Auto Cancellation", "Contact Centre escalation to Supervisor", "Within 48h when balance due risk applies", "Balance due protection SSR", "No customer-facing charge", "Supervisor action required", "For partially paid booking only. Escalate for Supervisor to add KEEP if paid service / balance due issue may trigger auto cancellation."]
        ]
    }
];

const operationsCategoryData = [
    { id: "products", label: "Products", icon: "shopping-bag" },
    { id: "ssr", label: "SSR / Ancillary", icon: "list-checks" },
    { id: "airport", label: "Airport / Ops", icon: "plane-takeoff" },
    { id: "disruption", label: "Disruption", icon: "route" }
];

let activeOperationsCategory = "products";
let activeOperationsSearch = "";

function getOperationsTopicCategory(topic) {
    const id = topic && topic.id;

    if (["holidays", "olci-lounge", "dubai-stopover", "upgrade-cutoffs"].includes(id)) return "products";
    if (["ssr-guide", "standard-ssr-cutoffs", "economy-seating-matrix", "baggage-upgrade-matrix", "assistance-medical", "equipment-animals", "travel-shops-cutoffs"].includes(id)) return "ssr";
    if (["operational-airport-ssrs", "airport-shop-fees"].includes(id)) return "airport";
    if (["auto-split-od", "g-fare-rules"].includes(id)) return "disruption";

    return "products";
}

function buildOperationsTopicSearchText(topic) {
    const parts = [
        topic.id,
        topic.title,
        topic.icon,
        ...(topic.classifications || [])
    ];

    if (topic.quickGuide) {
        Object.keys(topic.quickGuide).forEach(function (key) {
            parts.push(topic.quickGuide[key]);
        });
    }

    if (Array.isArray(topic.sections)) {
        topic.sections.forEach(function (section) {
            parts.push(section.title);
            if (Array.isArray(section.items)) parts.push(section.items.join(" "));
        });
    }

    if (Array.isArray(topic.ssrRows)) {
        topic.ssrRows.forEach(function (row) {
            parts.push(row.join(" "));
        });
    }

    return normalizeSpecialServiceText(parts.filter(Boolean).join(" "));
}

function getFilteredOperationsTopics() {
    const query = normalizeSpecialServiceText(activeOperationsSearch);

    const filtered = operationsGuideData.filter(function (topic) {
        const categoryMatch = !query && getOperationsTopicCategory(topic) === activeOperationsCategory;
        const searchMatch = query && buildOperationsTopicSearchText(topic).includes(query);

        return categoryMatch || searchMatch;
    });

    if (!query) return filtered;

    return filtered.sort(function (a, b) {
        return getOperationsSearchScore(b, query) - getOperationsSearchScore(a, query);
    });
}

function getOperationsSearchScore(topic, query) {
    let score = 0;
    const title = normalizeSpecialServiceText(topic.title || "");
    const classifications = normalizeSpecialServiceText((topic.classifications || []).join(" "));
    const quickGuide = normalizeSpecialServiceText(Object.values(topic.quickGuide || {}).join(" "));
    const sections = normalizeSpecialServiceText((topic.sections || []).map(function (section) {
        return [section.title, ...(section.items || [])].join(" ");
    }).join(" "));
    const ssrRows = normalizeSpecialServiceText((topic.ssrRows || []).map(function (row) {
        return row.join(" ");
    }).join(" "));

    if (title.includes(query)) score += 120;
    if (classifications.includes(query)) score += 90;
    if (ssrRows.includes(query)) score += 75;
    if (quickGuide.includes(query)) score += 45;
    if (sections.includes(query)) score += 25;

    return score;
}

function renderOperationsGuide(activeId) {
    const tabs = document.getElementById("operationsTabs");
    const content = document.getElementById("operationsContent");
    const visibleTopics = getFilteredOperationsTopics();
    const activeTopic = visibleTopics.find(function (topic) {
        return topic.id === activeId;
    }) || visibleTopics[0] || operationsGuideData[0];

    if (!tabs || !content || !activeTopic) return;

    tabs.innerHTML = renderOperationsControls() + visibleTopics.map(function (topic) {
        const activeClass = topic.id === activeTopic.id ? " active" : "";

        return (
            '<button type="button" class="operations-tab' + activeClass + '" data-operations-id="' + escapeHTML(topic.id) + '">' +
                '<i data-lucide="' + escapeHTML(topic.icon || "circle") + '"></i>' +
                '<span>' + escapeHTML(topic.title) + "</span>" +
            "</button>"
        );
    }).join("") + (!visibleTopics.length ? '<div class="operations-empty">No operations topic found.</div>' : "");

    content.innerHTML = renderOperationsTopic(activeTopic);

    if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderOperationsControls() {
    const categories = operationsCategoryData.map(function (category) {
        const activeClass = !activeOperationsSearch && category.id === activeOperationsCategory ? " active" : "";

        return (
            '<button type="button" class="operations-category-btn' + activeClass + '" data-operations-category="' + escapeHTML(category.id) + '">' +
                '<i data-lucide="' + escapeHTML(category.icon) + '"></i>' +
                '<span>' + escapeHTML(category.label) + '</span>' +
            '</button>'
        );
    }).join("");

    return (
        '<div class="operations-control-bar">' +
            '<div class="operations-category-list">' + categories + '</div>' +
            '<div class="operations-search-wrap">' +
                '<i data-lucide="search"></i>' +
                '<input type="text" id="operationsSearch" value="' + escapeHTML(activeOperationsSearch) + '" placeholder="Search ops, SSR, channel, or keyword..." autocomplete="off">' +
                '<button type="button" id="operationsSearchClear" class="operations-clear-btn" aria-label="Clear operations search"><i data-lucide="x"></i><span>Clear</span></button>' +
            '</div>' +
        '</div>'
    );
}

function renderOperationsTopic(topic) {
    const guide = topic.quickGuide || {};
    const sections = Array.isArray(topic.sections) ? topic.sections : [];

    return (
        '<article class="operations-card">' +
            '<div class="operations-card-header">' +
                '<div class="operations-icon-wrap"><i data-lucide="' + escapeHTML(topic.icon || "workflow") + '"></i></div>' +
                '<div>' +
                    '<h3>' + escapeHTML(topic.title) + '</h3>' +
                    renderOperationsClassifications(topic.classifications) +
                '</div>' +
            '</div>' +
            '<div class="operations-quick-grid">' +
                renderOperationsQuickItem("Channel", guide.channel, "radio-tower") +
                renderOperationsQuickItem("Time / Window", guide.timing, "clock") +
                renderOperationsQuickItem("Type", guide.type, "tag") +
                renderOperationsQuickItem("Main Action", guide.action, "list-checks") +
            '</div>' +
            (guide.warning ? '<div class="operations-warning"><i data-lucide="triangle-alert"></i><span>' + escapeHTML(guide.warning) + '</span></div>' : '') +
            (Array.isArray(topic.ssrRows) ? renderOperationsSsrTable(topic.ssrRows) : '') +
            (Array.isArray(topic.feeRows) ? renderOperationsFeeTable(topic.feeRows) : '') +
            sections.map(function (section, index) {
                return renderOperationsDisclosure(topic.id, index, section);
            }).join("") +
        '</article>'
    );
}

function renderOperationsQuickItem(label, value, icon) {
    if (!value) return "";

    return (
        '<div class="operations-quick-item">' +
            '<i data-lucide="' + escapeHTML(icon || "info") + '"></i>' +
            '<div><strong>' + escapeHTML(label) + '</strong><span>' + escapeHTML(value) + '</span></div>' +
        '</div>'
    );
}

function renderOperationsClassifications(items) {
    if (!Array.isArray(items) || !items.length) return "";

    return (
        '<div class="operations-classifications">' +
            items.map(function (item) {
                return '<span>' + escapeHTML(item) + '</span>';
            }).join("") +
        '</div>'
    );
}

function renderOperationsDisclosure(topicId, index, section) {
    const blockId = escapeHTML(topicId + "-" + index);

    return (
        '<div class="operations-disclosure">' +
            '<button type="button" class="operations-toggle-btn" data-operations-block="' + blockId + '">' +
                '<i data-lucide="chevron-down"></i>' +
                '<span>Show ' + escapeHTML(section.title || "Details") + '</span>' +
            '</button>' +
            '<div class="operations-collapsible hidden" id="operations-block-' + blockId + '">' +
                renderOperationsSection(section.title, section.items) +
            '</div>' +
        '</div>'
    );
}

function renderOperationsSection(title, items) {
    if (!Array.isArray(items) || !items.length) return "";

    return (
        '<div class="operations-section">' +
            '<strong>' + escapeHTML(title || "Details") + '</strong>' +
            '<ul>' + items.map(function (item) { return '<li>' + escapeHTML(item) + '</li>'; }).join("") + '</ul>' +
        '</div>'
    );
}

function renderOperationsFeeTable(rows) {
    const body = rows.map(function (row) {
        return (
            '<tr>' +
                '<td class="operations-fee-service">' + escapeHTML(row[0] || "") + '</td>' +
                '<td>' + formatOperationsFeeCell(row[1] || "") + '</td>' +
                '<td>' + formatOperationsFeeCell(row[2] || "") + '</td>' +
            '</tr>'
        );
    }).join("");

    return (
        '<div class="operations-fee-table-wrap">' +
            '<table class="operations-fee-table">' +
                '<thead><tr><th>Service</th><th>Airport Sales Desk</th><th>UAE Retail Shops</th></tr></thead>' +
                '<tbody>' + body + '</tbody>' +
            '</table>' +
        '</div>'
    );
}

function formatOperationsFeeCell(value) {
    const text = String(value || "");
    const lines = text.split(/(?<=\.)\s+|;\s+/).map(function (line) {
        return line.trim();
    }).filter(Boolean);

    if (lines.length <= 1) return '<span class="operations-fee-pill">' + escapeHTML(text) + '</span>';

    return lines.map(function (line) {
        return '<span class="operations-fee-pill">' + escapeHTML(line) + '</span>';
    }).join("");
}

function renderOperationsSsrTable(rows) {
    const body = rows.map(function (row) {
        return (
            '<tr data-ssr-row="' + escapeHTML(row.join(" ")) + '">' +
                row.map(function (cell, index) { return renderOperationsSsrCell(cell, index); }).join("") +
            '</tr>'
        );
    }).join("");

    return (
        '<div class="operations-ssr-search-wrap">' +
            '<i data-lucide="search"></i>' +
            '<input type="text" id="operationsSsrSearch" placeholder="Search SSR, service, channel, cut-off, or keyword..." autocomplete="off">' +
            '<button type="button" id="operationsSsrSearchClear" class="operations-clear-btn operations-ssr-clear-btn" aria-label="Clear SSR search"><i data-lucide="x"></i><span>Clear</span></button>' +
        '</div>' +
        '<div class="operations-ssr-wrap">' +
            '<table class="operations-ssr-table">' +
                '<thead><tr><th>SSR / Code</th><th>Service</th><th>Channels</th><th>Add Cut-off</th><th>Type</th><th>Charge</th><th>Approval</th><th>Key Notes</th></tr></thead>' +
                '<tbody>' + body + '</tbody>' +
            '</table>' +
        '</div>' +
        '<div id="operationsSsrEmpty" class="operations-ssr-empty hidden">No matching SSR / ancillary found.</div>'
    );
}

function renderOperationsSsrCell(cell, index) {
    const text = String(cell || "");
    const lines = splitOperationsSsrCell(text, index);
    const classNames = ["operations-ssr-col-" + index];

    if (index === 0) {
        return '<td class="' + classNames.concat("operations-ssr-code-cell").join(" ") + '">' + renderOperationsCodeBadges(text) + '</td>';
    }

    if (lines.length <= 1) {
        return '<td class="' + classNames.join(" ") + '">' + escapeHTML(text) + '</td>';
    }

    classNames.push("operations-ssr-lines");
    if (index === 7) classNames.push("operations-ssr-key-notes");

    return (
        '<td class="' + classNames.join(" ") + '">' +
            lines.map(function (line) {
                const codeMatch = line.match(/^(BAGX|BUPL|BUPX|BUPZ|BUPD|BUPE|NCFB|NCFE|SPEQ|SPEX|WEAP|EXST|CBBG)\b/i);
                const label = codeMatch ? '<strong>' + escapeHTML(codeMatch[1].trim()) + '</strong> ' : "";
                const body = codeMatch ? line.replace(codeMatch[1], "").trim() : line;

                return '<span>' + label + escapeHTML(body) + '</span>';
            }).join("") +
        '</td>'
    );
}

function renderOperationsCodeBadges(text) {
    return (
        '<div class="operations-code-badges">' +
            String(text || "").split("/").map(function (part) {
                const code = part.trim();
                return code ? '<span>' + escapeHTML(code) + '</span>' : "";
            }).join("") +
        '</div>'
    );
}

function splitOperationsSsrCell(text, index) {
    if (!text || index < 4) return [text];

    const codeSplit = text
        .replace(/,\s+(BAGX|BUPL|BUPX|BUPZ|BUPD|BUPE|NCFB|NCFE|SPEQ|SPEX|WEAP|EXST|CBBG)\s+/g, "\n$1 ")
        .replace(/\.\s+(BAGX|BUPL|BUPX|BUPZ|BUPD|BUPE|NCFB|NCFE|SPEQ|SPEX|WEAP|EXST|CBBG)\s+/g, ".\n$1 ");

    if (codeSplit.includes("\n")) {
        return codeSplit.split("\n").map(function (line) {
            return line.replace(/^,\s*/, "").trim();
        }).filter(Boolean);
    }

    if (index === 5 && /[,;]/.test(text) && text.length > 45) {
        return text.split(/[,;]\s+/).map(function (line) {
            return line.trim().replace(/\.$/, "");
        }).filter(Boolean);
    }

    if (index === 7) {
        const sentenceLines = text.split(/(?<=\.)\s+|;\s+/).map(function (line) {
            return line.trim();
        }).filter(Boolean);

        return sentenceLines.length ? sentenceLines : [text];
    }

    if (text.length < 95) return [text];

    return text.split(/(?<=\.)\s+/).map(function (line) {
        return line.trim();
    }).filter(Boolean);
}

function filterOperationsSsrRows(query) {
    const normalized = normalizeSpecialServiceText(query || "");
    const rows = Array.from(document.querySelectorAll(".operations-ssr-table tbody tr"));
    const empty = document.getElementById("operationsSsrEmpty");
    let visible = 0;

    rows.forEach(function (row) {
        const text = normalizeSpecialServiceText(row.dataset.ssrRow || row.textContent || "");
        const match = !normalized || text.includes(normalized);

        row.style.display = match ? "" : "none";
        if (match) visible += 1;
    });

    if (empty) empty.classList.toggle("hidden", visible !== 0);
}

function handleOperationsClick(event) {
    const category = event.target.closest("[data-operations-category]");
    const tab = event.target.closest("[data-operations-id]");
    const toggle = event.target.closest("[data-operations-block]");
    const clearOperationsSearch = event.target.closest("#operationsSearchClear");
    const clearSsrSearch = event.target.closest("#operationsSsrSearchClear");

    if (clearOperationsSearch) {
        activeOperationsSearch = "";
        renderOperationsGuide();
        return;
    }

    if (clearSsrSearch) {
        const search = document.getElementById("operationsSsrSearch");
        if (search) {
            search.value = "";
            filterOperationsSsrRows("");
            search.focus();
        }
        return;
    }

    if (category) {
        activeOperationsCategory = category.dataset.operationsCategory || "products";
        activeOperationsSearch = "";
        renderOperationsGuide();
        return;
    }

    if (tab) {
        renderOperationsGuide(tab.dataset.operationsId);
        return;
    }

    if (toggle) {
        const block = document.getElementById("operations-block-" + toggle.dataset.operationsBlock);
        const label = toggle.querySelector("span");
        const isHidden = block && block.classList.contains("hidden");

        if (!block) return;

        block.classList.toggle("hidden", !isHidden);

        if (label) {
            label.textContent = label.textContent.replace(isHidden ? /^Show\b/ : /^Hide\b/, isHidden ? "Hide" : "Show");
        }
    }
}

function handleOperationsInput(event) {
    if (event.target && event.target.id === "operationsSearch") {
        activeOperationsSearch = event.target.value || "";
        renderOperationsGuide();
        const search = document.getElementById("operationsSearch");
        if (search) {
            search.focus();
            search.setSelectionRange(search.value.length, search.value.length);
        }
        return;
    }

    if (event.target && event.target.id === "operationsSsrSearch") {
        filterOperationsSsrRows(event.target.value);
    }
}

function initialiseOperationsGuide() {
    const panel = document.getElementById("operationsView");

    renderOperationsGuide();

    if (panel && !panel.dataset.operationsReady) {
        panel.addEventListener("click", handleOperationsClick);
        panel.addEventListener("input", handleOperationsInput);
        panel.dataset.operationsReady = "true";
    }
}

function initialiseSpecialServices() {
    const clearFormsBtn = document.getElementById("specialServicesClearFormsBtn");
    const panel = document.getElementById("specialServicesView");

    renderSpecialServices();

    if (clearFormsBtn && !clearFormsBtn.dataset.specialClearAttached) {
        clearFormsBtn.addEventListener("click", clearSpecialServiceFormValues);
        clearFormsBtn.dataset.specialClearAttached = "true";
    }

    if (panel && !panel.dataset.specialEventsAttached) {
        panel.addEventListener("click", handleSpecialServicesClick);
        panel.dataset.specialEventsAttached = "true";
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
    initialiseSpecialServices();
    initialiseOperationsGuide();

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
const tabOperations = document.getElementById('tabOperations');
const tabCurrency = document.getElementById('tabCurrency');

if (tabAirports) tabAirports.onclick = function () { switchView('airports'); };
if (tabInterline) tabInterline.onclick = function () { switchView('interline'); };
if (tabDelay) tabDelay.onclick = function () { switchView('delay'); };
if (tabSpecialServices) tabSpecialServices.onclick = function () { switchView('specialServices'); };
if (tabOperations) tabOperations.onclick = function () { switchView('operations'); };
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

    const btn12 = document.getElementById('format12h');
    const btn24 = document.getElementById('format24h');

    function syncFormatButtons() {
        const is12 = use12Hour();

        if (btn12) {
            btn12.classList.toggle('active', is12);
            btn12.setAttribute('aria-pressed', is12 ? 'true' : 'false');
        }

        if (btn24) {
            btn24.classList.toggle('active', !is12);
            btn24.setAttribute('aria-pressed', !is12 ? 'true' : 'false');
        }
    }

    if (btn12) {
        btn12.onclick = function () {
            setTimeFormatPreference('12');
            syncFormatButtons();
            updateLiveClock();
            updateTimeInputPlaceholders();
            convertAllTimeInputs();
        };
    }

    if (btn24) {
        btn24.onclick = function () {
            setTimeFormatPreference('24');
            syncFormatButtons();
            updateLiveClock();
            updateTimeInputPlaceholders();
            convertAllTimeInputs();
        };
    }

    syncFormatButtons();

setInterval(updateLiveClock, 1000);
    
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
