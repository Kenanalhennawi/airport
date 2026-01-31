const airportsData = [
    // === HUB ===
    {
        iata: "DXB",
        city: "Dubai",
        country: "UAE",
        terminal: "Terminal 2 (Main Hub) & T3 (Select Flights)",
        timezone: "Asia/Dubai",
        distanceCenter: "5 km to Downtown / Burj Khalifa",
        nearbyAirports: "DWC (Al Maktoum): 60 km approx",
        phone: "+971 4 224 5555",
        website: "https://www.dubaiairports.ae",
        locationUrl: "https://goo.gl/maps/8Q3Q5"
    },

    // === EGYPT (UPDATED: SPX) ===
    {
        iata: "SPX",
        city: "Giza / Cairo West",
        country: "Egypt",
        terminal: "Main Terminal",
        timezone: "Africa/Cairo",
        distanceCenter: "45 km to Downtown Cairo (But only 10 km to Pyramids)",
        nearbyAirports: "CAI (Cairo Intl): 65 km away (East side)",
        phone: "+20 2 3344 5555", // رقم تقريبي للعمليات
        website: "http://www.civilaviation.gov.eg",
        locationUrl: "https://goo.gl/maps/sphinxiata" 
    },
    {
        iata: "HBE",
        city: "Alexandria",
        country: "Egypt",
        terminal: "Borg El Arab Airport",
        timezone: "Africa/Cairo",
        distanceCenter: "40 km to Alexandria City Center",
        nearbyAirports: "No other major commercial airport nearby",
        phone: "+20 3 463 10 10",
        website: "http://eac-airports.com",
        locationUrl: "https://goo.gl/maps/alexandria"
    },

    // === RUSSIA (UPDATED: VKO) ===
    {
        iata: "VKO",
        city: "Moscow",
        country: "Russia",
        terminal: "Terminal A",
        timezone: "Europe/Moscow",
        distanceCenter: "28 km to Red Square (South-West)",
        nearbyAirports: "SVO: 55 km | DME: 65 km | ZIA: 70 km",
        phone: "+7 495 937 55 55",
        website: "http://www.vnukovo.ru",
        locationUrl: "https://goo.gl/maps/vko"
    },
    {
        iata: "LED",
        city: "St. Petersburg",
        country: "Russia",
        terminal: "Pulkovo Terminal 1",
        timezone: "Europe/Moscow",
        distanceCenter: "23 km to City Center (Hermitage)",
        nearbyAirports: "No other major airport",
        phone: "+7 812 337 38 22",
        website: "https://pulkovoairport.ru",
        locationUrl: "https://goo.gl/maps/led"
    },
    {
        iata: "OVB",
        city: "Novosibirsk",
        country: "Russia",
        terminal: "Terminal B (International)",
        timezone: "Asia/Novosibirsk",
        distanceCenter: "16 km to City Center",
        nearbyAirports: "None",
        phone: "+7 383 216 99 99",
        website: "https://tolmachevo.ru",
        locationUrl: "https://goo.gl/maps/ovb"
    },

    // === TURKEY ===
    {
        iata: "SAW",
        city: "Istanbul",
        country: "Turkey",
        terminal: "International Terminal",
        timezone: "Europe/Istanbul",
        distanceCenter: "40 km to Kadikoy (Asian Side) | 50 km to Taksim",
        nearbyAirports: "IST (New Airport): 85 km (European Side)",
        phone: "+90 216 588 88 88",
        website: "https://www.sabihagokcen.aero",
        locationUrl: "https://goo.gl/maps/saw"
    },
    {
        iata: "ESB",
        city: "Ankara",
        country: "Turkey",
        terminal: "International Terminal",
        timezone: "Europe/Istanbul",
        distanceCenter: "28 km to Kizilay (City Center)",
        nearbyAirports: "None",
        phone: "+90 312 398 00 00",
        website: "https://www.esenbogaairport.com",
        locationUrl: "https://goo.gl/maps/esb"
    },

    // === LEVANT & MIDDLE EAST ===
    {
        iata: "BEY",
        city: "Beirut",
        country: "Lebanon",
        terminal: "Rafic Hariri Intl",
        timezone: "Asia/Beirut",
        distanceCenter: "9 km to Hamra/Downtown",
        nearbyAirports: "None",
        phone: "+961 1 628 000",
        website: "http://www.beirutairport.gov.lb",
        locationUrl: "https://goo.gl/maps/bey"
    },
    {
        iata: "AMM",
        city: "Amman",
        country: "Jordan",
        terminal: "Queen Alia - Terminal 1",
        timezone: "Asia/Amman",
        distanceCenter: "35 km to Downtown (Al-Balad)",
        nearbyAirports: "Marka (ADJ): Civil/Military only",
        phone: "+962 6 401 0250",
        website: "https://qaiairport.com",
        locationUrl: "https://goo.gl/maps/amm"
    },
    {
        iata: "KWI",
        city: "Kuwait City",
        country: "Kuwait",
        terminal: "Sheikh Saad (T3) or T1 (Check Ticket)",
        timezone: "Asia/Kuwait",
        distanceCenter: "15 km to Kuwait Towers",
        nearbyAirports: "None",
        phone: "+965 2433 6699",
        website: "https://www.kuwaitairport.gov.kw",
        locationUrl: "https://goo.gl/maps/kwi"
    },
    {
        iata: "RUH",
        city: "Riyadh",
        country: "Saudi Arabia",
        terminal: "Terminal 2 (International)",
        timezone: "Asia/Riyadh",
        distanceCenter: "35 km to Kingdom Centre",
        nearbyAirports: "None",
        phone: "+966 9200 20090",
        website: "https://kkia.sa",
        locationUrl: "https://goo.gl/maps/ruh"
    },
    {
        iata: "JED",
        city: "Jeddah",
        country: "Saudi Arabia",
        terminal: "Terminal 1 (New) or North",
        timezone: "Asia/Riyadh",
        distanceCenter: "19 km to Corniche",
        nearbyAirports: "None",
        phone: "+966 9200 11233",
        website: "https://jeddahairports.com",
        locationUrl: "https://goo.gl/maps/jed"
    },
    {
        iata: "MCT",
        city: "Muscat",
        country: "Oman",
        terminal: "New Terminal (T1)",
        timezone: "Asia/Muscat",
        distanceCenter: "32 km to Old Muscat / Muttrah",
        nearbyAirports: "None",
        phone: "+968 24 351234",
        website: "https://www.muscatairport.co.om",
        locationUrl: "https://goo.gl/maps/mct"
    },

    // === CENTRAL ASIA ===
    {
        iata: "ALA",
        city: "Almaty",
        country: "Kazakhstan",
        terminal: "International Terminal",
        timezone: "Asia/Almaty",
        distanceCenter: "15 km to City Center",
        nearbyAirports: "None within 200km",
        phone: "+7 727 270 3333",
        website: "https://alaport.com",
        locationUrl: "https://goo.gl/maps/ala"
    },
    {
        iata: "TBS",
        city: "Tbilisi",
        country: "Georgia",
        terminal: "Main Terminal",
        timezone: "Asia/Tbilisi",
        distanceCenter: "17 km to Freedom Square",
        nearbyAirports: "None",
        phone: "+995 32 231 04 21",
        website: "https://www.tbilisiairport.com",
        locationUrl: "https://goo.gl/maps/tbs"
    },
    {
        iata: "GYD",
        city: "Baku",
        country: "Azerbaijan",
        terminal: "Terminal 1",
        timezone: "Asia/Baku",
        distanceCenter: "25 km to Baku Boulevard",
        nearbyAirports: "None",
        phone: "+994 12 497 27 27",
        website: "https://airport.az",
        locationUrl: "https://goo.gl/maps/gyd"
    },
    {
        iata: "EVN",
        city: "Yerevan",
        country: "Armenia",
        terminal: "Zvartnots Intl",
        timezone: "Asia/Yerevan",
        distanceCenter: "12 km to Republic Square",
        nearbyAirports: "None",
        phone: "+374 10 493 000",
        website: "http://www.zvartnots.aero",
        locationUrl: "https://goo.gl/maps/evn"
    },

    // === EUROPE ===
    {
        iata: "BEG",
        city: "Belgrade",
        country: "Serbia",
        terminal: "Terminal 2",
        timezone: "Europe/Belgrade",
        distanceCenter: "18 km to Republic Square",
        nearbyAirports: "None",
        phone: "+381 11 209 4000",
        website: "https://beg.aero",
        locationUrl: "https://goo.gl/maps/beg"
    },
    {
        iata: "OTP",
        city: "Bucharest",
        country: "Romania",
        terminal: "Departures Terminal",
        timezone: "Europe/Bucharest",
        distanceCenter: "16 km to Old Town",
        nearbyAirports: "BBU (Baneasa): 8km (Business only)",
        phone: "+40 21 204 1000",
        website: "https://www.bucharestairports.ro",
        locationUrl: "https://goo.gl/maps/otp"
    },
    {
        iata: "PRG",
        city: "Prague",
        country: "Czech Republic",
        terminal: "Terminal 1 (Non-Schengen)",
        timezone: "Europe/Prague",
        distanceCenter: "17 km to Old Town Square",
        nearbyAirports: "None",
        phone: "+420 220 111 888",
        website: "https://www.prg.aero",
        locationUrl: "https://goo.gl/maps/prg"
    },

    // === ASIA & AFRICA ===
    {
        iata: "ZNZ",
        city: "Zanzibar",
        country: "Tanzania",
        terminal: "Terminal 3 (New Intl)",
        timezone: "Africa/Dar_es_Salaam",
        distanceCenter: "7 km to Stone Town",
        nearbyAirports: "DAR: By ferry or flight only",
        phone: "+255 24 223 3979",
        website: "https://www.zaa.go.tz",
        locationUrl: "https://goo.gl/maps/znz"
    },
    {
        iata: "MLE",
        city: "Malé",
        country: "Maldives",
        terminal: "Velana Intl",
        timezone: "Indian/Maldives",
        distanceCenter: "Island Airport (Boat/Seaplane required)",
        nearbyAirports: "None",
        phone: "+960 332 3211",
        website: "https://macl.aero",
        locationUrl: "https://goo.gl/maps/mle"
    },
    {
        iata: "UTP",
        city: "Pattaya / Rayong",
        country: "Thailand",
        terminal: "U-Tapao Intl",
        timezone: "Asia/Bangkok",
        distanceCenter: "40 km to Pattaya Beach",
        nearbyAirports: "BKK: 140 km | DMK: 170 km",
        phone: "+66 38 245 595",
        website: "http://www.utapao.com",
        locationUrl: "https://goo.gl/maps/utp"
    }
];
