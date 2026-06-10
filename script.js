
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
