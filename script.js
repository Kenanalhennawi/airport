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
    "Iraq": "iq", "Iran": "ir", "Syria": "sy", "Israel": "il", "Yemen": "ye", "Turkey": "tr", "TÃ¼rkiye": "tr",
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
    "Samoa": "ws", "Tonga": "to", "RÃ©union": "re", "Bhutan": "bt", "Ecuador": "ec"
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
    const sortedCarriers = carriers.slice().sort(function (a, b) {
        const nameA = (a.carrier || '').trim().toLowerCase();
        const nameB = (b.carrier || '').trim().toLowerCase();

        return nameA.localeCompare(nameB);
    });

    if (!carrierTableBody && !carrierModalTableBody) return;

    if (carrierModalTableBody) {
        carrierModalTableBody.innerHTML = '';
        sortedCarriers.forEach(function (carrier, i) {
            carrierModalTableBody.appendChild(createInterlineCarrierRow(carrier, i));
        });
    }

    if (carrierTableBody) {
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
    { airports: 'ALA', std03: 'X', etd03: 'X', closure90: 'âˆš', closure30: 'âˆš', closureTime: 'ETD-60' },
    { airports: 'IST', std03: 'X', etd03: 'X', closure90: 'âˆš', closure30: 'âˆš', closureTime: 'ETD-60' },
    { airports: 'DXB/DWC', std03: 'X', etd03: 'X', closure90: 'âˆš', closure30: 'âˆš', closureTime: 'ETD-60' },
    { airports: 'BEG', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BSR', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BGW', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BUD', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'CTA', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'LJU', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'NAP', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'NJF', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'PSA', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'SJJ', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'SZG', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'TIA', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'ZAG', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'CMB', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'CGP', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'DAC', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'HGA', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'JIB', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'JUB', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'KTM', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'LYP', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'MGQ', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'MUX', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'UET', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'RUH', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'JMK', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'JTR', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'CFU', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'PRG', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BGY', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BSL', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'OLB', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'TIV', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'DBV', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'EBL', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'ISU', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'AMM', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BEY', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'AYT', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'DAM', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'TZX', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'BJV', std03: 'âˆš', etd03: 'âˆš', closure90: 'X', closure30: 'X', closureTime: 'STD-60' },
    { airports: 'All Other', std03: 'âˆš', etd03: 'X', closure90: 'X', closure30: 'âˆš', closureTime: 'ETD-60' }
];

function formatMark(value) {
    if (value === 'âˆš') return '<span class="delay-yes">âˆš</span>';
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
            hintEl.textContent = 'Airport not in list â€” applies: All Other';
            hintEl.classList.remove('hidden');
        }

        if (summaryEl) {
            summaryEl.innerHTML = '<span class="delay-summary-label">Result:</span> <strong>All Other</strong> â€” <span class="closure-badge closure-etd">ETD-60</span> (ETD-based)';
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

                summaryEl.innerHTML = '<span class="delay-summary-label">Result:</span> <strong>' + apt + '</strong> â€” ' + closure + ' (' + type + ')';

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

    "tr": ["TÃ¼rkiye", "Turkey"],
    "turkey": ["TÃ¼rkiye", "Turkey"],
    "turkiye": ["TÃ¼rkiye", "Turkey"],
    "tÃ¼rkiye": ["TÃ¼rkiye", "Turkey"],

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
    "cÃ´te d ivoire": ["Ivory Coast"],

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

    "re": ["RÃ©union"],
    "reunion": ["RÃ©union"],
    "rÃ©union": ["RÃ©union"],

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
        .replace(/Ã¼/g, "u")
        .replace(/Ä±/g, "i")
        .replace(/ÄŸ/g, "g")
        .replace(/ÅŸ/g, "s")
        .replace(/Ã§/g, "c")
        .replace(/Ã¶/g, "o")
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
            (data.airport ? data.airport + ' - ' : '') +
            (data.city || '') +
            ', ' +
            (data.country || '') +
            (data.region ? ' - ' + data.region : '');
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
            let message = "Unable to reach live PayPort service";

            try {
                const errorData = await response.json();
                message = errorData.message || message;
            } catch (parseError) {
                // Keep the safe generic message when the proxy returns a non-JSON error page.
            }

            throw new Error(message);
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
        if (rateEl) rateEl.textContent = "Open Official PayPort to verify the live rate.";

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

let activeSpecialServicesSearch = "";

function buildSpecialServiceSearchText(service) {
    const parts = [];

    function collect(value) {
        if (!value) return;

        if (typeof value === "string") {
            parts.push(value);
        } else if (Array.isArray(value)) {
            value.forEach(collect);
        } else if (typeof value === "object") {
            Object.keys(value).forEach(function (key) {
                collect(value[key]);
            });
        }
    }

    collect(service);
    return normalizeSpecialServiceText(parts.join(" "));
}

function renderSpecialServices(activeServiceId) {
    const grid = document.getElementById("specialServicesGrid");
    const tabs = document.getElementById("specialServicesTabs");

    if (!grid) return;

    const services = getSpecialServicesData();
    const query = normalizeSpecialServiceText(activeSpecialServicesSearch);
    const terms = query.split(/\s+/).filter(Boolean);
    const visibleServices = terms.length ? services.filter(function (service) {
        const haystack = buildSpecialServiceSearchText(service);

        return terms.every(function (term) {
            return haystack.includes(term);
        });
    }) : services;
    const activeService = services.find(function (service) {
        return service.id === activeServiceId && visibleServices.includes(service);
    }) || visibleServices[0];

    if (!activeService) {
        if (tabs) tabs.innerHTML = "";
        grid.innerHTML = '<div class="special-services-empty">No special service found.</div>';
        return;
    }

    if (tabs) {
        tabs.innerHTML = visibleServices.map(function (service) {
            const activeClass = service.id === activeService.id ? " active" : "";
            const ssr = Array.isArray(service.ssr) && service.ssr.length ? " - " + service.ssr.join("/") : "";

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

            renderSpecialServiceMainContent(service) +
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

function renderSpecialServiceMainContent(service) {
    return renderSpecialAnswerFinder(service);
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

function renderSpecialAnswerFinder(service) {
    const answers = buildSpecialAnswerItems(service);

    if (!answers.length) return "";

    const serviceId = escapeHTML(service.id || "");
    const visibleDefaultCount = 5;
    const answersHtml = answers.map(function (item, index) {
        const defaultHidden = !item.featured || index >= visibleDefaultCount;
        const itemText = [item.label, item.answer, item.keywords].filter(Boolean).join(" ");

        return (
            '<article class="special-answer-item' + (defaultHidden ? ' is-hidden-default' : '') + (item.tone === "warning" ? ' is-warning' : '') + '"' + (defaultHidden ? ' hidden' : '') + ' data-special-answer-item data-default-hidden="' + (defaultHidden ? "true" : "false") + '" data-featured="' + (item.featured ? "true" : "false") + '" data-answer-text="' + escapeHTML(normalizeSpecialServiceText(itemText)) + '">' +
                '<strong>' + escapeHTML(item.label) + "</strong>" +
                '<span>' + escapeHTML(item.answer) + "</span>" +
            "</article>"
        );
    }).join("");

    return (
        '<section class="special-answer-finder" data-special-answer-finder="' + serviceId + '">' +
            '<div class="special-answer-finder-head">' +
                '<div>' +
                    '<strong>Find Answer</strong>' +
                    '<span>Search inside this service. Default shows the most used answers only.</span>' +
                "</div>" +
            "</div>" +
            '<div class="special-answer-search-wrap">' +
                '<i data-lucide="search"></i>' +
                '<input type="text" data-special-answer-search placeholder="Search this service: charge, refund, GDS, business, approval..." autocomplete="off">' +
            "</div>" +
            '<div class="special-answer-meta" data-special-answer-meta>Showing most used answers.</div>' +
            '<div class="special-answer-list" data-special-answer-list>' + answersHtml + "</div>" +
        "</section>"
    );
}

function buildSpecialAnswerItems(service) {
    const answers = [];
    const guide = service.agentQuickGuide || {};

    addSpecialAnswer(answers, "Cut-off", guide.cutOff, "time deadline cutoff window", true);
    addSpecialAnswer(answers, "Charge", guide.charge, "fee price amount payment cost", true);
    addSpecialAnswer(answers, "Approval", guide.approval, "approval required yes no supervisor fs", true);
    addSpecialAnswer(answers, "Agent Action", guide.mainAction, "main action process what to do", true);
    addSpecialAnswer(answers, "Warning", guide.warning, "warning important do not confirm", true, "warning");

    if (service.decisionGuide) {
        addSpecialAnswer(answers, "Decision", service.decisionGuide.result, "decision proceed eligible not eligible", true);

        if (Array.isArray(service.decisionGuide.checks)) {
            service.decisionGuide.checks.forEach(function (item) {
                addSpecialAnswer(answers, "Eligibility Check", item, "eligibility allowed restricted", false);
            });
        }
    }

    addSpecialAnswer(answers, "Tell Customer", service.customerScript, "customer script advise say", true);

    if (Array.isArray(service.fastAnswers)) {
        service.fastAnswers.forEach(function (item) {
            addSpecialAnswer(answers, item.label || "Answer", item.answer, item.keywords || item.label, true);
        });
    }

    if (Array.isArray(service.agentChecklist)) {
        service.agentChecklist.forEach(function (item) {
            addSpecialAnswer(answers, "Agent Step", item, "agent action checklist process", false);
        });
    }

    if (Array.isArray(service.agentProcess)) {
        service.agentProcess.forEach(function (item) {
            addSpecialAnswer(answers, "Agent Process", item, "agent process sprint salesforce", false);
        });
    }

    if (Array.isArray(service.customerAdvice)) {
        service.customerAdvice.forEach(function (item) {
            addSpecialAnswer(answers, "Customer Advice", item, "customer advise tell passenger", false);
        });
    }

    if (service.hiddenDetails && Array.isArray(service.hiddenDetails.sections)) {
        service.hiddenDetails.sections.forEach(function (section) {
            if (!Array.isArray(section.items)) return;

            section.items.forEach(function (item) {
                addSpecialAnswer(answers, section.title || "Policy", item, section.title || "policy", false);
            });
        });
    }

    if (service.supervisorSection && Array.isArray(service.supervisorSection.items)) {
        service.supervisorSection.items.forEach(function (item) {
            addSpecialAnswer(answers, service.supervisorSection.title || "Supervisor / FS", item, "supervisor fs escalation approval", false);
        });
    }

    return dedupeSpecialAnswers(answers);
}

function addSpecialAnswer(answers, label, answer, keywords, featured, tone) {
    if (!answer) return;

    answers.push({
        label: label || "Answer",
        answer: answer,
        keywords: keywords || "",
        featured: !!featured,
        tone: tone || ""
    });
}

function dedupeSpecialAnswers(answers) {
    const seen = new Set();

    return answers.filter(function (item) {
        const key = normalizeSpecialServiceText(item.label + " " + item.answer);

        if (!key || seen.has(key)) return false;

        seen.add(key);
        return true;
    });
}

function renderSpecialServiceSnapshot(service) {
    const guide = service.agentQuickGuide || {};
    const decision = service.decisionGuide || {};

    return (
        '<div class="special-service-snapshot">' +
            '<div class="special-service-snapshot-head">' +
                '<div>' +
                    '<strong>Service Snapshot</strong>' +
                    '<span>' + escapeHTML(decision.result || guide.mainAction || "") + "</span>" +
                "</div>" +
            "</div>" +
            '<div class="special-service-snapshot-grid">' +
                renderSnapshotItem("Cut-off", guide.cutOff, "clock") +
                renderSnapshotItem("Charge", guide.charge, "credit-card") +
                renderSnapshotItem("Approval", guide.approval, "shield-check") +
                renderSnapshotItem("Agent Action", guide.mainAction, "list-checks") +
            "</div>" +
            (guide.warning ? '<div class="special-agent-warning"><i data-lucide="triangle-alert"></i><span>' + escapeHTML(guide.warning) + "</span></div>" : "") +
            (service.customerScript ? '<div class="special-customer-script"><strong>Tell Customer</strong><span>' + escapeHTML(service.customerScript) + "</span></div>" : "") +
        "</div>"
    );
}

function renderSnapshotItem(label, value, icon) {
    if (!value) return "";

    return (
        '<div class="special-service-snapshot-item">' +
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
    const hasForm = !!(service && service.agentForm && Array.isArray(service.agentForm.fields) && service.agentForm.fields.length && hasEmailWorkflow);
    const actionStep = hasEmailWorkflow ? "Open Outlook" : "Apply SSR / Escalate";
    const inputStep = hasForm ? "Fill Form" : "Action Checklist";

    return (
        '<div class="special-workflow-strip" aria-label="Contact centre workflow">' +
            '<span>Request</span>' +
            '<i data-lucide="chevron-right"></i>' +
            '<span>Quick Guide</span>' +
            '<i data-lucide="chevron-right"></i>' +
            '<span>' + escapeHTML(inputStep) + "</span>" +
            '<i data-lucide="chevron-right"></i>' +
            '<span>' + escapeHTML(actionStep) + "</span>" +
            '<i data-lucide="chevron-right"></i>' +
            '<span>Update SF / Sprint</span>' +
        "</div>"
    );
}

function renderSpecialDecisionGuide(service) {
    if (!service || !service.decisionGuide) return "";

    const checks = Array.isArray(service.decisionGuide.checks) ? service.decisionGuide.checks : [];
    const checksHtml = checks.map(function (item) {
        return (
            '<li>' +
                '<i data-lucide="circle-check"></i>' +
                '<span>' + escapeHTML(item) + "</span>" +
            "</li>"
        );
    }).join("");

    return (
        '<div class="special-decision-guide">' +
            '<div class="special-decision-main">' +
                '<strong>' + escapeHTML(service.decisionGuide.title || "Quick Decision") + "</strong>" +
                '<span>' + escapeHTML(service.decisionGuide.result || "") + "</span>" +
            "</div>" +
            (checksHtml ? '<ul>' + checksHtml + "</ul>" : "") +
            (service.customerScript ? '<div class="special-customer-script"><strong>Tell Customer</strong><span>' + escapeHTML(service.customerScript) + "</span></div>" : "") +
        "</div>"
    );
}

function renderSpecialFastAnswers(service) {
    if (!service || !Array.isArray(service.fastAnswers) || !service.fastAnswers.length) return "";

    const answersHtml = service.fastAnswers.map(function (item) {
        return (
            '<div class="special-fast-answer">' +
                '<strong>' + escapeHTML(item.label || "Answer") + "</strong>" +
                '<span>' + escapeHTML(item.answer || "") + "</span>" +
            "</div>"
        );
    }).join("");

    return (
        '<div class="special-fast-answers">' +
            '<div class="special-fast-answers-title">' +
                '<i data-lucide="sparkles"></i>' +
                '<span>Fast Answers</span>' +
            "</div>" +
            '<div class="special-fast-answers-grid">' + answersHtml + "</div>" +
        "</div>"
    );
}

function renderAgentChecklist(service) {
    if (!service || !Array.isArray(service.agentChecklist) || !service.agentChecklist.length) {
        return "";
    }

    const itemsHtml = service.agentChecklist.map(function (item) {
        return (
            '<li>' +
                '<i data-lucide="check-circle-2"></i>' +
                '<span>' + escapeHTML(item) + "</span>" +
            "</li>"
        );
    }).join("");

    return (
        '<div class="special-action-checklist">' +
            '<div class="special-action-checklist-title">' +
                '<i data-lucide="list-checks"></i>' +
                '<span>Agent Action Checklist</span>' +
            "</div>" +
            '<ol>' + itemsHtml + "</ol>" +
        "</div>"
    );
}

function renderAgentForm(service) {
    const servicesWithRequestForm = ["falcon", "cake-on-board"];

    if (!servicesWithRequestForm.includes(service.id)) {
        return "";
    }

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
    const hasAnswerFinderLayout = !!(service && buildSpecialAnswerItems(service).length);

    if (hasAnswerFinderLayout) {
        return renderSpecialConciseDisclosureGroup(service);
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

function renderSpecialConciseDisclosureGroup(service) {
    const serviceId = escapeHTML(service.id || "");
    const blocks = [
        renderSpecialDisclosure(serviceId, "process-method", "Show Process / Method", "route", renderSpecialServiceSection("Process / Method", getSpecialProcessItems(service))),
        renderSpecialDisclosure(serviceId, "conditions", "Show Conditions", "ban", renderSpecialServiceSection("Conditions", getSpecialConditionItems(service))),
        renderSpecialDisclosure(serviceId, "charges", "Show Charges", "circle-dollar-sign", renderSpecialServiceSection("Charges", getSpecialChargeItems(service))),
        renderSpecialDisclosure(serviceId, "send-escalation", "Show Send / Escalation", "send", renderSpecialServiceSection("Send / Escalation", getSpecialSendItems(service)), "special-toggle-supervisor")
    ].filter(Boolean).join("");

    if (!blocks) return "";

    return '<div class="special-disclosure-group">' + blocks + "</div>";
}

function getSpecialProcessItems(service) {
    const items = [];
    const guide = service.agentQuickGuide || {};

    pushSpecialItem(items, guide.mainAction);
    pushSpecialItems(items, service.agentChecklist);
    pushSpecialItems(items, service.agentProcess);

    return compactSpecialItems(items, 8);
}

function getSpecialConditionItems(service) {
    const items = [];
    const guide = service.agentQuickGuide || {};

    pushSpecialItem(items, guide.warning);

    if (service.decisionGuide && Array.isArray(service.decisionGuide.checks)) {
        pushSpecialItems(items, service.decisionGuide.checks);
    }

    if (Array.isArray(service.customerAdvice)) {
        pushSpecialItems(items, service.customerAdvice.filter(function (item) {
            return !isSpecialChargeText(item);
        }));
    }

    pushSpecialHiddenItems(items, service, "restrictions");

    return compactSpecialItems(items, 10);
}

function getSpecialChargeItems(service) {
    const items = [];
    const guide = service.agentQuickGuide || {};

    pushSpecialItem(items, guide.charge);
    pushSpecialHiddenItems(items, service, "charges");

    return compactSpecialItems(items, 8);
}

function getSpecialSendItems(service) {
    const items = [];

    if (service.agentEmail && service.agentEmail.enabled) {
        if (Array.isArray(service.agentEmail.to) && service.agentEmail.to.length) {
            pushSpecialItem(items, "Send request to: " + service.agentEmail.to.join("; "));
        }

        if (Array.isArray(service.agentEmail.cc) && service.agentEmail.cc.length) {
            pushSpecialItem(items, "CC: " + service.agentEmail.cc.join("; "));
        }

        pushSpecialItem(items, "Fill the request form, then use Open in Outlook Web.");
    }

    if (service.supervisorSection && Array.isArray(service.supervisorSection.items)) {
        pushSpecialItems(items, service.supervisorSection.items);
    }

    return compactSpecialItems(items, 8);
}

function pushSpecialHiddenItems(items, service, category) {
    if (!service.hiddenDetails || !Array.isArray(service.hiddenDetails.sections)) return;

    service.hiddenDetails.sections.forEach(function (section) {
        if (getSpecialDetailsCategory(section.title) !== category || !Array.isArray(section.items)) return;

        pushSpecialItems(items, section.items);
    });
}

function pushSpecialItems(target, items) {
    if (!Array.isArray(items)) return;

    items.forEach(function (item) {
        pushSpecialItem(target, item);
    });
}

function pushSpecialItem(target, item) {
    const text = String(item || "").trim();

    if (text) target.push(text);
}

function compactSpecialItems(items, limit) {
    const seen = new Set();
    const compact = [];

    items.forEach(function (item) {
        const normalized = normalizeSpecialServiceText(item)
            .replace(/\b(passenger|customer|agent|advise|inform|retrieve|verify|confirm)\b/g, "")
            .replace(/\s+/g, " ")
            .trim();

        if (!normalized || seen.has(normalized)) return;

        seen.add(normalized);
        compact.push(item);
    });

    return compact.slice(0, limit || compact.length);
}

function isSpecialChargeText(item) {
    const text = normalizeSpecialServiceText(item);

    return /charge|fee|aed|fare|payment|paid|refund|voucher|cost|price/.test(text);
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

function filterSpecialAnswerFinder(input) {
    const finder = input.closest("[data-special-answer-finder]");

    if (!finder) return;

    const query = normalizeSpecialServiceText(input.value || "");
    const terms = query.split(/\s+/).filter(Boolean);
    const items = Array.from(finder.querySelectorAll("[data-special-answer-item]"));
    const meta = finder.querySelector("[data-special-answer-meta]");
    const matchedItems = [];

    items.forEach(function (item) {
        const defaultHidden = item.dataset.defaultHidden === "true";
        const haystack = item.dataset.answerText || "";
        const matches = terms.length ? terms.every(function (term) {
            return haystack.includes(term);
        }) : !defaultHidden;

        item.classList.remove("is-search-match");
        item.hidden = true;

        if (matches) matchedItems.push(item);
    });

    const featuredMatches = terms.length ? matchedItems.filter(function (item) {
        return item.dataset.featured === "true";
    }) : [];
    const visibleItems = terms.length && featuredMatches.length ? featuredMatches.slice(0, 6) : matchedItems.slice(0, terms.length ? 8 : matchedItems.length);

    visibleItems.forEach(function (item) {
        item.hidden = false;
        item.classList.toggle("is-search-match", !!terms.length);
    });

    if (meta) {
        if (!terms.length) {
            meta.textContent = "Showing most used answers.";
        } else if (visibleItems.length) {
            meta.textContent = visibleItems.length + " direct answer" + (visibleItems.length === 1 ? "" : "s") + " found.";
        } else {
            meta.textContent = "No direct answer found. Try another word or open Full Policy.";
        }
    }
}

function handleSpecialServicesClick(event) {
    const searchClear = event.target.closest("[data-special-service-search-clear]");
    const serviceTab = event.target.closest("[data-special-service-tab]");
    const button = event.target.closest("[data-special-action]");

    if (searchClear) {
        const search = document.getElementById("specialServicesSearch");
        activeSpecialServicesSearch = "";
        if (search) search.value = "";
        renderSpecialServices();
        return;
    }

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

function handleSpecialServicesInput(event) {
    const serviceSearch = event.target.closest("[data-special-service-search]");
    const input = event.target.closest("[data-special-answer-search]");

    if (serviceSearch) {
        activeSpecialServicesSearch = serviceSearch.value || "";
        renderSpecialServices();
        return;
    }

    if (input) {
        filterSpecialAnswerFinder(input);
    }
}

function clearSpecialServiceFormValues() {
    const grid = document.getElementById("specialServicesGrid");
    const search = document.getElementById("specialServicesSearch");

    activeSpecialServicesSearch = "";
    if (search) search.value = "";
    renderSpecialServices();

    if (!grid) return;

    grid.querySelectorAll("[data-special-answer-search]").forEach(function (input) {
        input.value = "";
        filterSpecialAnswerFinder(input);
    });

    grid.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (field.matches("[data-special-answer-search]")) return;

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
        id: "travel-insurance",
        title: "Travel Insurance",
        icon: "shield-check",
        quickGuide: {
            channel: "All channels except GDS / OTA; UAE Travel Shop follows D > 4",
            timing: "Can be added before journey commences through eligible channels",
            type: "XCover insurance ancillary",
            action: "Check passenger type, booking type, trip dates, and async status before adding or advising refund.",
            warning: "Insurance is non-refundable and cannot be added to asynchronous bookings."
        },
        classifications: ["INS", "Insurance", "TravelGuard", "Travel Guard", "XCover", "Cover Genius"],
        sections: [
            {
                title: "Eligibility",
                items: [
                    "Applicable for adults and children only; infants are out of scope.",
                    "Available through all channels except GDS and OTA.",
                    "Supported booking types exclude multicity, interline, and codeshare.",
                    "Available when adding passengers or segments if the booking remains eligible.",
                    "Trip coverage must be within 90 days.",
                    "Trip start date must be within 150 days from booking."
                ]
            },
            {
                title: "Modification / Refund Rules",
                items: [
                    "Insurance is non-refundable.",
                    "If booking modification creates an asynchronous booking, insurance drops from the entire PNR and is not refunded.",
                    "Insurance continues to exist with XCover for the original dates after such modification.",
                    "Insurance cannot be added to asynchronous bookings; consult Shift In Charge for guidance.",
                    "Refund of difference is possible if insurance is changed to a lower slab."
                ]
            },
            {
                title: "Policy Email",
                items: [
                    "After successful purchase, policy email is triggered from XCover.com to the passenger who made the booking.",
                    "To resend policy email, Contact Centre escalates through Salesforce with PNR and required action.",
                    "Supervisor / Floor Support handles the resend request."
                ]
            }
        ]
    },
    {
        id: "economy-seating-matrix",
        title: "Economy Seating",
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
        classifications: ["Bid upgrade", "OLCI banner upgrade", "Airport counter upgrade", "Airport upgrade", "UPGJ"],
        sections: [
            {
                title: "Cut-offs",
                items: [
                    "Fare-rule upgrade: Economy passenger can upgrade to Business up to 2 hours before departure by paying applicable fare difference.",
                    "Bidding for upgrades: starts any time.",
                    "Bidding cut-off: 18 hours for outstations.",
                    "Bidding cut-off: 10 hours for Dubai.",
                    "Successful bidding notification is sent around 6 hours before departure.",
                    "OLCI banner upgrade for Dubai departures: from 48 hours down to 3 hours before departure.",
                    "OLCI banner upgrade for outstation departures: from 48 hours down to 12 hours before departure.",
                    "Airport counter upgrade: up to 2 hours prior to departure.",
                    "Airport Business Class upgrade applies to DXB Terminal 2 and Terminal 3 departure flights.",
                    "Airport upgrade is handled at airport only and may be offered to FZ, codeshare, and interline bookings when eligible."
                ]
            },
            {
                title: "OLCI / Bid Restrictions",
                items: [
                    "OLCI upgrade applies to all passengers in the booking; one-passenger-only upgrade is restricted.",
                    "OLCI upgrade payment is by debit or credit card only.",
                    "Bookings paid using miles are not eligible for OLCI upgrade.",
                    "Bookings with infants, balance due, codeshare, interline, connection, circular, GDS, group, staff, or asynchronous status are not eligible for OLCI upgrade.",
                    "If passenger already paid for seat or extra baggage, those amounts are not refunded after upgrade.",
                    "Lounge access is not included for OLCI or bid upgrades unless the passenger is eligible by tier."
                ]
            },
            {
                title: "Bidding Notes",
                items: [
                    "Credit card is authorized during bidding but charged only if the bid is successful.",
                    "If authorization fails, upgrade is not triggered and PNR remains untouched.",
                    "After successful bid, booking is automatically modified to Business Class.",
                    "Fare basis after bid upgrade is ZOFFER in SPRINT.",
                    "History shows SSR PGRD with payment amount.",
                    "Once passenger checks in online, bidding is automatically cancelled.",
                    "All bid upgrades are non-transferable and non-refundable."
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
                    "Airport upgrade bookings may show SSR UPGJ. BUPZ is a baggage upgrade code, not a Business Class upgrade code."
                ]
            }
        ]
    },
    {
        id: "masd-meet-assist",
        title: "MASD (previously MAAS) Meet & Assist",
        icon: "user-check",
        quickGuide: {
            channel: "Business Class team / OLCI / Contact Centre call handling",
            timing: "DXB Terminal 2 Business Class departures; default time D-3h if passenger does not select",
            type: "Meet and Assist Service SSR",
            action: "Check MASD SSR and comments, verify flight eligibility, advise passenger how to opt in or use Business Class check-in.",
            warning: "Not for bid upgrades, OLCI upgrades, airport upgrades, LNGN no-lounge bookings, transit passengers, DXB T3, or outstation departures."
        },
        classifications: ["MASD", "MAAS", "Meet and Assist", "Business Class", "DXB T2", "LNGN"],
        sections: [
            {
                title: "Eligibility",
                items: [
                    "Passenger must be travelling on a commercial Business Class booking.",
                    "Flight must depart from DXB Terminal 2.",
                    "MASD SSR replaced MAAS and is automatically added during booking creation for eligible passengers and flights.",
                    "Business Class team may contact passenger to introduce the service and encourage OLCI opt-in."
                ]
            },
            {
                title: "Contact Centre Handling",
                items: [
                    "Confirm whether passenger is asking about an email received from flydubai regarding MASD / Meet and Assist.",
                    "Retrieve PNR and check SSRs / comments.",
                    "Verify MASD SSR exists and that Business Team comment is present if outbound call was attempted.",
                    "Confirm the MASD SSR is associated with the correct eligible flight and that the flight segment was not changed.",
                    "Advise passenger they can update MASD via OLCI by selecting preferred airport arrival time.",
                    "If no preference is selected, passenger can access the service at Business Class check-in area near Entrance 3 at DXB T2.",
                    "Update SPRINT comments after handling the call."
                ]
            },
            {
                title: "Exclusions",
                items: [
                    "Staff, discounted, or rebate bookings.",
                    "Passengers upgraded through bid upgrade, OLCI upgrade, or airport upgrade.",
                    "Bookings with SSR UPGJ or SSR LNGN.",
                    "Transit passengers at DXB Terminal 2.",
                    "Flights departing from DXB Terminal 3 or any outstation airport."
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
        id: "ok-to-board",
        title: "OKTB / OK to Board",
        icon: "badge-check",
        quickGuide: {
            channel: "Official website for policy; FS / Supervisor for EK* handling",
            timing: "Check latest travel requirements before advising",
            type: "Travel document / OK to Board guidance",
            action: "Direct customer to current OKTB policy; FS/Supervisor handles EK* OKTB service when required.",
            warning: "Travel requirements may change without prior notice; passenger must check relevant authorities before travel."
        },
        classifications: ["OKTB", "OK to Board", "Visa OK to Board", "VIOK", "EK*", "UAE Visit Visa", "Floor Support", "Supervisor"],
        sections: [
            {
                title: "Agent Rules",
                items: [
                    "For the most current OKTB policy, refer to the official flydubai OK to Board page: https://www.flydubai.com/en/flying-with-us/ok-to-board/",
                    "Travel requirements are subject to change without prior notice.",
                    "Passenger must check with the relevant authorities before travel for latest entry and exit requirements.",
                    "Use VIOK only when Visa OK to Board handling is required for the destination or document scenario.",
                    "For UAE Travel Shops, Visa OK to Board VIOK cut-off is more than 4 days before departure."
                ]
            },
            {
                title: "EK* OKTB - FS / Supervisor Only",
                items: [
                    "The EK* OKTB flow is for Floor Support and Supervisors only.",
                    "Take control over the booking.",
                    "Open Add services.",
                    "Select Carrier EK*, Category UAE VISIT VISA, then Services and OKTB, and click Add.",
                    "Update PNR comments with the action taken.",
                    "Release control of the reservation after completing the action."
                ]
            },
            {
                title: "Customer Advice",
                items: [
                    "Advise customer that OKTB or visa document acceptance is not a substitute for meeting immigration requirements.",
                    "Customer remains responsible for valid documents, visa eligibility, entry requirements, and authority approvals.",
                    "If unsure, escalate to Supervisor / FS before confirming the handling path."
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
            timing: "BHFT 50h / 49h, CCOK Travel Shop D>4, ID50 baggage 6h, LRPT/ERPT by DXB T2 timing",
            type: "Operational and airport SSRs",
            action: "Use only for the operational scenario described; escalate unclear cases.",
            warning: "These SSRs are operational controls and should not be treated like normal paid ancillaries."
        },
        classifications: ["BHFT", "CCHK", "ID50 baggage", "LRPT / ERPT"],
        sections: [
            {
                title: "BHFT Hold My Fare",
                items: [
                    "Hold fee is AED 29 per PNR and is non-refundable.",
                    "Economy can be held up to 24h; Business can be held up to 72h depending booking creation time.",
                    "Sale cut-off is 50 hours before departure and hold time limit cut-off is 49 hours before departure.",
                    "Interline and codeshare bookings are not eligible.",
                    "Agent can identify the booking by SSR BHFT in booking history.",
                    "Contact Centre can help complete payment by payment link, miles/voucher, or payment IVR unless Pay by Cash was selected initially.",
                    "Refund is only during IROP."
                ]
            },
            {
                title: "Credit Card / Staff / Reporting SSRs",
                items: [
                    "CCHK means passenger must verify credit card for smooth travel; CCOK means credit card is verified and passenger may travel.",
                    "For UAE Travel Shops, CCOK card verification follows D > 4 cut-off.",
                    "Bookings with CCHK cannot complete online check-in until verification is resolved.",
                    "Staff ID50 Waitlist Baggage: added before the 6-hour cut-off.",
                    "Early / Late Reporting applies to DXB T2 departures only and is handled at airport only.",
                    "LRPT: late reporting after check-in counter closure but before departure; available within 6h of original flight departure.",
                    "ERPT: early reporting for an earlier flight that is not closed; available within 12h of earlier flight departure.",
                    "ERPT charge is AED 100 per passenger; LRPT charge is AED 200 per passenger."
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
        classifications: ["Airport Sales Desk", "UAE Travel Shops", "3% admin fee", "PRNT", "GOSHOW", "IFEE", "Balance payment", "Deira", "Name correction", "Credit card verification"],
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
            ["PETC", "Falcon", "Contact Centre, Salesforce, Supervisor / FS, Reservations Support", "More than 48h before departure", "Approval request", "AED 1500 per falcon per direction airport handling charge + seat block at available fare", "Yes", "Create unpaid booking if more than 48h before departure. Add falcon as First name Falcon and last name as primary passenger last name. RSU adds SSR PETC after approval. Not a confirmation until approved. Prior approval is mandatory. Valid health certificate required. AED 1500 applies per PETC / per falcon / per direction. One seat per falcon must be blocked; max 2 falcons per handler. More than 15 falcons requires higher authority approval. Falcons arriving into DXB/DWC must be in a box. Falcon seat is treated like CBBG with no extra checked baggage allowance."],
            ["CAKE", "Cake on Board", "Contact Centre, email request, Supervisor / FS", "More than 48h before departure", "Catering request", "As per cake option", "Special stations need Shift In Charge", "Add SSR CAKE, collect cake details, send request email, send payment link, update Salesforce / SPRINT."],
            ["FRBS", "Fruit Basket", "Contact Centre / SPRINT", "Up to 48h before departure", "Paid ancillary", "AED 35 or equivalent", "No special approval mentioned", "Use SPRINT flow. Apply service cut-off and payment rules."],
            ["EXST", "Extra Seat for Comfort", "Contact Centre / SPRINT; GDS requires separate PNR handling; airport go-show at DXB T2 subject to approval", "At least 2h before departure", "Seat ancillary", "Available fare + standard seat assignment charges as per booked fare", "Depends booking type", "EXST is available in both Economy and Business Class. FZ prime only, not interline/codeshare. Two seat assignments are mandatory in the same PNR. Add zero-value SSR EXST to requesting passenger, not the extra seat. Passenger and extra seat must be in same fare option. Max 2 EXST per passenger. EXST must not be in emergency exit rows 15/16. Extra seat for comfort gets checked baggage allowance as per booked fare; hand baggage remains per passenger, not per seat. MEDA cases require medical approval. No-show EXST with passenger boarded requires Floor Support guidance."],
            ["CBBG", "Cabin Baggage on Seat", "Contact Centre / SPRINT; GDS requires separate PNR handling; airport go-show at DXB T2 subject to approval", "At least 2h before departure", "Cabin baggage / seat ancillary", "Available fare + standard seat assignment charges as per booked fare", "Depends booking type", "CBBG is available only in Economy Class and is not available in Business Class. FZ prime only, not interline/codeshare. Two seat assignments are mandatory in the same PNR. Add zero-value SSR CBBG to requesting passenger, not the extra seat. Avoid rows 14/15/16/17. Max 1 CBBG seat per passenger. Baggage on blocked seat max 75kg and must be secured by seat belt. CBBG gives no extra checked baggage allowance. No-show CBBG with passenger boarded requires Floor Support guidance."],
            ["SPEQ", "Sporting Equipment 160-189cm", "Contact Centre / SPRINT / Supervisor or FS", "At least 24h before departure; Supervisor / FS may add up to 12h if within max 10 equipment per flight", "Special baggage", "AED 150 per item per flight / sector", "Restricted / capacity controlled", "Free if within hand baggage dimensions or checked baggage dimensions up to 159cm. Add SPEQ per leg for 160-189cm by L+W+H. Max 32kg per item; no sporting equipment over 32kg. Max 10 equipment per flight unless Special Handling approval. Accepted as part of checked baggage allowance; excess baggage applies if allowance is exceeded. Passenger must arrive at least 2h before departure. Handling fee refundable as voucher up to 24h before departure; within 24h non-refundable and non-transferable. Handling fees apply only on flydubai-operated flights; EK mixed metal codeshare and through connections may be NIL unless stopover/separate ticket applies."],
            ["SPEX", "Sporting Equipment 190-350cm", "Contact Centre / SPRINT / Supervisor or FS", "At least 24h before departure; Supervisor / FS may add up to 12h if within max 10 equipment per flight", "Special baggage", "AED 270 per item per flight / sector", "Restricted / capacity controlled", "Free if within hand baggage dimensions or checked baggage dimensions up to 159cm. Add SPEX per leg for 190-350cm by L+W+H. Max 32kg per item; no sporting equipment over 32kg. Beyond 350cm, pole vaults, javelins, and hang gliders require pre-authorization 48h before departure and additional charges. Passenger must arrive at least 2h before departure. Handling fee refundable as voucher up to 24h before departure; within 24h non-refundable and non-transferable. Handling fees apply only on flydubai-operated flights; EK mixed metal codeshare and through connections may be NIL unless stopover/separate ticket applies."],
            ["WEAP / SPEX", "Sporting Weapons / Firearms / Guns", "Contact Centre, letstalk, Supervisor / FS, Security approval", "96h before travel", "Security approval", "WEAP AED 300 per passenger + SPEX AED 270 per passenger per segment", "Yes", "Sporting weapons, firearms, and guns are subject to pre-authorization 96h before departure and Dubai Police approval fee. Customer must email documents first or provide case number. Sporting weapons need WEAP plus SPEX charges where applicable. Add SPEX for each item/passenger/segment in addition to WEAP where applicable. Do not confirm without security approval."],
            ["BAGB / BAGL / BAGX / BUPL / BUPX / BUPZ / BUPD / BUPE", "Baggage / Baggage Upgrade SSR Codes", "Website, Manage Booking, Contact Centre, OLCI, SPRINT; Travel Shop where eligible", "Existing booking: 6h before departure. New booking / modification: Website 2h; Contact Centre up to D-2 via Shift In Charge, subject to availability. UAE Travel Shop D > 4.", "Baggage upgrade", "Dynamic by origin / destination. KRT example: BAGX 40kg included, BUPD 50kg AED 100, BUPE 60kg AED 200.", "Depends eligibility", "BAGB: adds 20kg baggage allowance. BAGL: adds 30kg baggage allowance. BAGX: adds 40kg baggage allowance. BUPL: adds 10kg to existing 20kg. BUPX: adds 20kg to existing 20kg. BUPZ: adds 10kg to existing 30kg. BUPD: total 50kg where available. BUPE: total 60kg where available. FZ Prime direct / non-GDS: Web, Sprint, and OLCI may be available by itinerary and system. GDS 141 FZ Prime: Sprint can add; Contact Centre should not add when matrix says restricted. 169 / 275 / 365 FZ Prime: Sprint and OLCI may be available. 176 EK*, 016 UA*, 014 AC*: OLCI only where supported; no Web / TA / Sprint. Interline baggage upgrades are not permitted prior to departure and must be handled at airport check-in. OLCI baggage upgrade is not available from non-DCS stations. Always upgrade on top of existing baggage SSR; do not cancel/refund existing baggage SSR just to reprice. Example: BAGB + BUPL passenger requesting 40kg should add BUPZ, not cancel BUPL to add BUPX."],
            ["BAGI", "Infant Baggage Allowance", "SPRINT / applicable booking flow", "As per infant/baggage handling rules", "Baggage SSR", "Included only when baggage-inclusive fare applies", "No", "Infants are entitled to 5kg hand carry containing clothes, diapers, and baby food; bag must be smaller than 55 x 38 x 20cm. Infants get 10kg checked baggage allowance and 5kg hand baggage only when booked on baggage-inclusive fare. SSR on SPRINT for 10kg checked baggage allowance is BAGI."],
            ["EXPC", "Extra Piece of Checked-in Baggage", "Sprint DCS users / Airport check-in handling", "At airport / check-in handling", "Extra checked baggage piece SSR", "01 EXPC is approximately AED 200 and subject to change + airport service fee", "Subject to availability", "EXPC charges passengers travelling with more than three pieces of checked-in baggage. If total checked baggage weight is within the baggage allowance but packed in more than three pieces, charge the handling fee for every additional piece plus the airport service fee. Each piece must still comply with baggage rules."],
            ["EXBG", "Excess Baggage Waiver", "SPRINT ENT / authorized waiver", "Pre-approved only", "Waiver / allowance SSR", "Authorized by Chief / SVP", "Yes", "EXBG uses values like EB1.0 extra 10kg, EB1.5 extra 15kg, EB2.0 extra 20kg, or PC concept. If customer wants normal upgrade, follow normal baggage upgrade process."],
            ["SEAT", "Seat Selection", "Website / Manage Booking, Contact Centre, OLCI, Travel Shop, Airport where applicable", "Travel shop cut-off D > 4; online / OLCI availability as per system", "Ancillary service", "As per selected seat", "Usually no", "Lite / Value: paid seat selection. Flex: free seat selection except XLGR requires payment. Business: free seat selection within Business cabin. Group bookings allow free seats and block paid seats during OLCI. Visa check restrictions may block seat selection. IRROP seat change is charged only when moving to a higher priced seat."],
            ["SPML / MLIN", "Meals / Special Meals", "Website / Manage Booking, Contact Centre, Travel Shop, OLCI where available", "Special meal cut-off D > 24", "Meal service", "As per meal / fare product", "Catering exception only", "SPML: special meal must be selected more than 24h before departure. MLIN: meal included where applicable by fare / cabin. Business meal included; special meal selection still follows D > 24 cut-off."],
            ["WCHR / WCHS / WCHC", "Wheelchair Assistance", "All FZ contact points where available", "Recommended at least 48h before departure. System minimum: WCHR 12h; WCHS/WCHC 24h", "Assistance SSR", "Free service", "WCHC requires companion and medical certificate", "WCHR: assistance to ramp; passenger can walk stairs and cabin unassisted. WCHS: assistance to aircraft door; passenger cannot use stairs but can move in cabin unassisted. WCHC: assistance to cabin seat; passenger cannot move or manage needs unassisted and must travel with companion in same cabin on adjoining seat. WCHC requires medical certificate confirming fit to fly. Passenger should arrive 3h before departure and approach flydubai counter; wheelchair will not wait at airport entrance by default. Offer FOC seats rows 29-31 for PRM and one companion subject to availability, excluding FRST/XLGR if unavailable."],
            ["WCBD / WCBW / WCLB", "Battery Wheelchair", "Contact Centre, Airport, Supervisor / FS if unclear", "Request at least 24h before departure; confirm onward carrier acceptance if applicable", "Mobility aid SSR", "Free service", "Battery acceptance criteria apply", "WCBD: dry-cell/non-spillable battery wheelchair. WCBW: wet-cell/spillable battery wheelchair. WCLB: lithium battery wheelchair. Booking must have two SSRs: one mobility equipment SSR (WCBD/WCBW/WCLB) and one assistance SSR (WCHR/WCHS/WCHC). WCLB max power is 300Wh for one battery or 2 x 160Wh for two batteries; no more than two spare lithium batteries accepted. Removed batteries require protective packaging. If onward EK/OAL connection does not accept the electric wheelchair, carriage cannot be accepted."],
            ["INS", "Insurance", "Website / Manage Booking, Contact Centre, Travel Shop where applicable", "Before journey commences through eligible channels; UAE Travel Shop cut-off D > 4", "Ancillary service", "As per insurance product", "Subject to product eligibility", "Insurance is non-refundable. Available for adults and children only; infants are out of scope. Not available for GDS, OTA, multicity, interline, codeshare, or asynchronous bookings. If modification creates an asynchronous booking, insurance drops from the PNR and is not refunded. Policy email is sent by XCover; resend requests are escalated through Salesforce to Supervisor / Floor Support."],
            ["TRBF", "Transfer Baggage Fee", "Airport / transfer handling flow; Contact Centre can advise", "Applies when baggage through-tagging / retagging is required", "Transfer baggage", "As applicable by airport / transfer process", "Depends itinerary and baggage status", "Dubai: applies to transfer passengers whose baggage needs retagging because it was short-tagged from origin. Outstation: applies for two separate tickets when bags need through-tagging to final destination. Not applicable to connections over 24h. If passenger no-shows the onward connected flight, baggage is offloaded / not transferred."],
            ["UPGJ", "Business Class Upgrade at Airport", "Airport check-in desk / Airport Sales Desk", "Offered D-2 hours for DXB T2 and T3 departures", "Airport upgrade", "Dynamic / airport upgrade charge + applicable service fee", "Subject to availability", "Applies to DXB T2 and T3 departure flights when offered. Eligible for passengers travelling on FZ flight, codeshare, and interline bookings. Handled at airport only. Product includes J class seat, priority baggage, priority boarding, free IFE, and J class meal."],
            ["PRNT", "Printing Fee", "Airport Sales Desk / DXB T2 airport handling", "At airport when document printout is required", "Airport service SSR", "AED 25 + VAT", "No", "SSR PRNT: AED 25 + VAT per document, maximum 3 papers. Applies to DXB T2 departures only. Applicable to FZ, codeshare, interline, and staff passengers. Handled at airport only."],
            ["NCFB / NCFE", "Name Correction Fees", "Contact Centre with Supervisor / FS confirmation, Airport Sales Desk, UAE Travel Shops", "Not permitted within 6h before departure; fully active PNR only", "Name correction service", "FOC / AED 0: title, space, gender, or up to 3 characters. Name swap: USD 30 / AED 110. More than 3 characters, full first/middle/last correction, name addition/deletion, or maiden-to-married name: USD 100 / AED 367. NCFB = name swap fee. NCFE = name correction/change fee charges. Airport and shop service fees may also apply.", "Supervisor / FS confirmation required", "Use only for genuine corrections, not different passengers. Only once per passenger. Customer should provide PNR and passport copy; marriage/birth certificate if applicable. SSR should be added on outbound sector only when approved and payable. Not for GDS/codeshare/interline, TA block fare, checked-in/OLCI, utilized, or no-show bookings. No charges for name changes involving extra seat purchase for falcon, EXST, or CBBG."],
            ["VIOK", "Visa OK to Board / OKTB", "UAE Travel Shops / Airport Sales Desk where applicable; FS / Supervisor for EK* OKTB", "Travel shop cut-off D > 4; check latest authority requirements before advising", "Document / visa service", "Airport AED 80 per passenger; UAE shops AED 30 per passenger", "Depends destination/document requirement", "VIOK: use only when Visa OK to Board handling is required for the destination / document scenario. OKTB policy must be checked against the official website/current authority rules. EK* OKTB handling is FS/Supervisor only."],
            ["CCOK / CCHK", "Credit Card Verification", "Airport / Travel Shop / operational verification", "Travel shop cut-off D > 4; airport verification must be completed before travel", "Payment verification", "Airport AED 80 per PNR; UAE shops AED 30 per PNR", "May be required", "CCHK means passenger must verify credit card for smooth travel. CCOK means credit card is verified and passenger may travel. CCHK may be auto-applied for direct-channel credit card bookings, bookings within 24h of departure, bypassed authentication, multi-FOP bookings with credit card, and certain vouchers generated from CCHK/bypassed transactions. For multiple passengers/segments, CCHK applies to first active segment and primary passenger. Bookings with CCHK cannot complete online check-in. If payer is flydubai staff, supervisor may remove CCHK if present and add CCOK at zero cost after verification."],
            ["STPN", "Stopover / Re-accommodation SSR", "Supervisor / FS / Reservations Support", "After reaccommodation where applicable", "Disruption handling SSR", "Override may be AED 100 when system not picking charge", "Senior Manager approval if overridden", "Used after reaccommodation when applicable. Senior Manager approval required only if STPN charge is overridden."],
            ["KEEP", "Keep Booking From Auto Cancellation", "Contact Centre escalation to Supervisor via Salesforce", "Flight within 48h and balance due AED 200 or more", "Balance due protection SSR", "No customer-facing charge", "Supervisor action required", "KEEP is for existing bookings with pending payment / balance due risk. Agent escalates with details in Salesforce. Supervisor verifies balance due and flight within 48h before adding SSR KEEP to avoid auto cancellation."]
        ]
    }
];

const operationsCategoryData = [
    { id: "products", label: "Products", icon: "shopping-bag" },
    { id: "ssr", label: "SSR / Ancillary", icon: "list-checks" },
    { id: "airport", label: "Airport / Ops", icon: "plane-takeoff" }
];

let activeOperationsCategory = "products";
let activeOperationsSearch = "";

function getOperationsTopicCategory(topic) {
    const id = topic && topic.id;

    if (["holidays", "olci-lounge", "dubai-stopover", "upgrade-cutoffs", "auto-split-od", "g-fare-rules"].includes(id)) return "products";
    if (["ssr-guide", "economy-seating-matrix", "travel-shops-cutoffs"].includes(id)) return "ssr";
    if (["operational-airport-ssrs", "airport-shop-fees", "masd-meet-assist", "ok-to-board"].includes(id)) return "airport";

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

    if (Array.isArray(topic.feeRows)) {
        topic.feeRows.forEach(function (row) {
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
    const feeRows = normalizeSpecialServiceText((topic.feeRows || []).map(function (row) {
        return row.join(" ");
    }).join(" "));
    const exactSsrCodeMatch = (topic.ssrRows || []).some(function (row) {
        return normalizeSpecialServiceText(row[0] || "").split(/\s+/).includes(query);
    });
    const exactFeeServiceMatch = (topic.feeRows || []).some(function (row) {
        return normalizeSpecialServiceText(row[0] || "").includes(query);
    });

    if (exactSsrCodeMatch) score += 260;
    if (exactFeeServiceMatch) score += 160;
    if (title.includes(query)) score += 120;
    if (classifications.includes(query)) score += 90;
    if (feeRows.includes(query)) score += 85;
    if (ssrRows.includes(query)) score += 75;
    if (quickGuide.includes(query)) score += 45;
    if (sections.includes(query)) score += 25;

    return score;
}

function getOperationsTopicMatches(topic, query) {
    const matches = [];

    function addMatch(type, text) {
        if (!text || matches.length >= 4) return;
        matches.push({
            type: type,
            text: String(text).replace(/\s+/g, " ").trim()
        });
    }

    if (normalizeSpecialServiceText(topic.title || "").includes(query)) {
        addMatch("Topic", topic.title);
    }

    (topic.classifications || []).forEach(function (item) {
        if (normalizeSpecialServiceText(item).includes(query)) addMatch("Tag", item);
    });

    Object.keys(topic.quickGuide || {}).forEach(function (key) {
        const value = topic.quickGuide[key];
        if (normalizeSpecialServiceText(value).includes(query)) addMatch("Quick Guide", value);
    });

    (topic.sections || []).forEach(function (section) {
        if (normalizeSpecialServiceText(section.title || "").includes(query)) {
            addMatch("Section", section.title);
        }

        (section.items || []).forEach(function (item) {
            if (normalizeSpecialServiceText(item).includes(query)) addMatch(section.title || "Policy", item);
        });
    });

    (topic.ssrRows || []).forEach(function (row) {
        if (normalizeSpecialServiceText(row.join(" ")).includes(query)) {
            addMatch("SSR / Ancillary", [row[0], row[1]].filter(Boolean).join(" - "));
        }
    });

    (topic.feeRows || []).forEach(function (row) {
        if (normalizeSpecialServiceText(row.join(" ")).includes(query)) {
            addMatch("Airport / Shop Fees", row[0] || row.join(" "));
        }
    });

    return matches;
}

function renderOperationsSearchResults(topics, activeId) {
    const query = normalizeSpecialServiceText(activeOperationsSearch);
    if (!query) return "";

    const results = topics.map(function (topic) {
        return {
            topic: topic,
            matches: getOperationsTopicMatches(topic, query)
        };
    }).filter(function (result) {
        return result.matches.length;
    });

    if (!results.length) return "";

    return (
        '<div class="operations-search-results">' +
            '<div class="operations-search-results-title">' +
                '<i data-lucide="search-check"></i>' +
                '<span>' + results.length + ' matching topic' + (results.length === 1 ? '' : 's') + ' for "' + escapeHTML(activeOperationsSearch.trim()) + '"</span>' +
            '</div>' +
            '<div class="operations-search-result-list">' +
                results.map(function (result) {
                    const topic = result.topic;
                    const activeClass = topic.id === activeId ? " active" : "";

                    return (
                        '<button type="button" class="operations-search-result' + activeClass + '" data-operations-id="' + escapeHTML(topic.id) + '">' +
                            '<span class="operations-search-result-topic">' + escapeHTML(topic.title) + '</span>' +
                            '<span class="operations-search-result-snippets">' +
                                result.matches.map(function (match) {
                                    return '<span><strong>' + escapeHTML(match.type) + ':</strong> ' + escapeHTML(match.text) + '</span>';
                                }).join("") +
                            '</span>' +
                        '</button>'
                    );
                }).join("") +
            '</div>' +
        '</div>'
    );
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

    content.innerHTML = renderOperationsSearchResults(visibleTopics, activeTopic.id) + renderOperationsTopic(activeTopic);

    if (activeOperationsSearch) {
        filterOperationsSsrRows(activeOperationsSearch);
        filterOperationsFeeRows(activeOperationsSearch);
    }

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
            '<tr data-fee-row="' + escapeHTML(row.join(" ")) + '">' +
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
        '</div>' +
        '<div id="operationsFeeEmpty" class="operations-ssr-empty hidden">No matching fee row found.</div>'
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
    const body = rows.map(function (row, index) {
        return (
            '<tr data-ssr-row="' + escapeHTML(row.join(" ")) + '" data-ssr-code="' + escapeHTML(row[0] || "") + '" data-ssr-service="' + escapeHTML(row[1] || "") + '" data-ssr-index="' + index + '">' +
                row.map(function (cell, index) { return renderOperationsSsrCell(cell, index); }).join("") +
            '</tr>'
        );
    }).join("");

    return (
        '<div class="operations-ssr-search-wrap">' +
            '<i data-lucide="search"></i>' +
            '<input type="text" id="operationsSsrSearch" value="' + escapeHTML(activeOperationsSearch) + '" placeholder="Search SSR, service, channel, cut-off, or keyword..." autocomplete="off">' +
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
                const codeMatch = line.match(/^(BAGB|BAGL|BAGX|BUPL|BUPX|BUPZ|BUPD|BUPE|NCFB|NCFE|SPEQ|SPEX|WEAP|EXST|CBBG|PETC|BAGI|CCOK|CCHK|UPGJ|VIOK)\b/i);
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
        .replace(/,\s+(BAGB|BAGL|BAGX|BUPL|BUPX|BUPZ|BUPD|BUPE|NCFB|NCFE|SPEQ|SPEX|WEAP|EXST|CBBG|PETC|BAGI|CCOK|CCHK|UPGJ|VIOK)\s+/g, "\n$1 ")
        .replace(/\.\s+(BAGB|BAGL|BAGX|BUPL|BUPX|BUPZ|BUPD|BUPE|NCFB|NCFE|SPEQ|SPEX|WEAP|EXST|CBBG|PETC|BAGI|CCOK|CCHK|UPGJ|VIOK)\s+/g, ".\n$1 ");

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
    const tbody = rows.length ? rows[0].parentNode : null;
    const empty = document.getElementById("operationsSsrEmpty");
    let visible = 0;
    const rankedRows = [];

    rows.forEach(function (row) {
        const text = normalizeSpecialServiceText(row.dataset.ssrRow || row.textContent || "");
        const code = normalizeSpecialServiceText(row.dataset.ssrCode || "");
        const service = normalizeSpecialServiceText(row.dataset.ssrService || "");
        const codes = code.split(/\s*\/\s*|\s+/).filter(Boolean);
        const exactCodeMatch = codes.indexOf(normalized) >= 0;
        let rank = Number(row.dataset.ssrIndex || 0);

        if (normalized) {
            if (exactCodeMatch) rank = 0;
            else if (service.indexOf(normalized) === 0) rank = 1;
            else if (code.includes(normalized)) rank = 2;
            else if (service.includes(normalized)) rank = 3;
            else rank = 4;
        }

        const match = !normalized || text.includes(normalized);

        row.style.display = match ? "" : "none";
        row.classList.toggle("operations-search-selected", !!normalized && match);

        if (match) {
            visible += 1;
            rankedRows.push({
                row: row,
                rank: rank,
                index: Number(row.dataset.ssrIndex || 0)
            });
        }
    });

    if (tbody && normalized) {
        rankedRows.sort(function (a, b) {
            if (a.rank !== b.rank) return a.rank - b.rank;
            return a.index - b.index;
        }).forEach(function (item) {
            tbody.appendChild(item.row);
        });
    } else if (tbody) {
        rankedRows.sort(function (a, b) {
            return a.index - b.index;
        }).forEach(function (item) {
            tbody.appendChild(item.row);
        });
    }

    if (empty) empty.classList.toggle("hidden", visible !== 0);
}

function filterOperationsFeeRows(query) {
    const normalized = normalizeSpecialServiceText(query || "");
    const rows = Array.from(document.querySelectorAll(".operations-fee-table tbody tr"));
    const empty = document.getElementById("operationsFeeEmpty");
    let visible = 0;

    if (!rows.length) return;

    rows.forEach(function (row) {
        const text = normalizeSpecialServiceText(row.dataset.feeRow || row.textContent || "");
        const match = !normalized || text.includes(normalized);

        row.style.display = match ? "" : "none";
        row.classList.toggle("operations-search-selected", !!normalized && match);
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
        panel.addEventListener("input", handleSpecialServicesInput);
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
