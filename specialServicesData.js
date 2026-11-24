const specialServicesData = [
    {
        id: "falcon",
        title: "Falcon",
        icon: "bird",
        category: "Cabin / Live Animal Handling",
        serviceType: "approval-request",
        ssr: ["PETC"],
        searchKeywords: [
            "falcon",
            "falcons",
            "bird",
            "birds",
            "animal",
            "animals",
            "petc",
            "live animal",
            "handler",
            "box",
            "avi box",
            "falcon approval",
            "falcon booking",
            "airport handling",
            "falcon carriage",
            "falcon in cabin",
            "naama",
            "health certificate"
        ],

        agentQuickGuide: {
            cutOff: "More than 48 hours before departure",
            approval: "Prior airline approval required",
            charge: "AED 1500 per falcon per direction",
            mainAction: "Create unpaid booking, collect details, escalate Salesforce case, and update SPRINT comments.",
            warning: "SPX is not accepted. This is not a confirmation until approved. Do not confirm falcon carriage to the customer until approval is received."
        },

        agentForm: {
            title: "Falcon Request Details",
            description: "Fill the below details before escalating the request to Supervisor / Floor Support.",
            fields: [
                {
                    id: "pnr",
                    label: "PNR(s)",
                    type: "text",
                    required: true,
                    placeholder: "Example: ABC123"
                },
                {
                    id: "classOfTravel",
                    label: "Class of Travel",
                    type: "text",
                    required: true,
                    placeholder: "Economy"
                },
                {
                    id: "outboundFlight",
                    label: "Outbound Flight / Date / Sector",
                    type: "text",
                    required: true,
                    placeholder: "Example: FZ123 / 15JAN / DXB-DYU"
                },
                {
                    id: "returnFlight",
                    label: "Return Flight / Date / Sector",
                    type: "text",
                    required: false,
                    placeholder: "If applicable"
                },
                {
                    id: "totalPassengers",
                    label: "Total Number of Passengers",
                    type: "number",
                    required: true,
                    placeholder: "Example: 1"
                },
                {
                    id: "passengerNames",
                    label: "Passenger Names",
                    type: "textarea",
                    required: true,
                    placeholder: "Last Name / First Name / Title"
                },
                {
                    id: "handlerInformed",
                    label: "Handler informed that no airline assistance will be provided for carrying boxes?",
                    type: "select",
                    required: true,
                    options: ["YES", "NO"]
                },
                {
                    id: "contactNumber",
                    label: "Contact Number",
                    type: "text",
                    required: true,
                    placeholder: "Customer contact number"
                },
                {
                    id: "email",
                    label: "Email ID",
                    type: "email",
                    required: true,
                    placeholder: "Customer email address"
                },
                {
                    id: "totalFalcons",
                    label: "Total Number of Falcons",
                    type: "number",
                    required: true,
                    placeholder: "Example: 1"
                },
                {
                    id: "carriageMethod",
                    label: "Falcons to be carried in",
                    type: "select",
                    required: true,
                    options: ["Hand", "Box", "Combination"]
                },
                {
                    id: "falconsPerBox",
                    label: "Number of Falcons per Box",
                    type: "number",
                    required: false,
                    placeholder: "Example: 1"
                },
                {
                    id: "numberOfBoxes",
                    label: "Number of Boxes",
                    type: "number",
                    required: false,
                    placeholder: "Example: 1"
                },
                {
                    id: "dimensions",
                    label: "Dimensions",
                    type: "text",
                    required: true,
                    defaultValue: "55 cm H × 45 cm W × 40 cm D",
                    placeholder: "55 cm H × 45 cm W × 40 cm D"
                },
                {
                    id: "petcCount",
                    label: "Number of SSR PETC to be added for Airport Handling Charge",
                    type: "number",
                    required: true,
                    placeholder: "Example: 1"
                },
                {
                    id: "handlingChargeCollected",
                    label: "Airport Handling Charge Collected?",
                    type: "select",
                    required: true,
                    options: ["YES", "NO"]
                }
            ]
        },

        agentEmail: {
            enabled: true,
            to: [
                "CC.FS@flydubai.com",
                "CC.Sups@flydubai.com"
            ],
            cc: [],
            subjectTemplate: "Falcon Request - PNR {{pnr}}",
            bodyTemplate: ""
        },

        agentProcess: [
            "Create an unpaid booking if the flight is more than 48 hours before departure.",
            "Use falcon name format: First Name = FALCON, Last Name = primary passenger last name.",
            "Collect all required falcon request details from the customer.",
            "Inform the customer that the request is not a confirmation to carry falcons.",
            "Inform the customer that prior airline approval is mandatory.",
            "Inform the customer that flydubai needs to check with the destination airport if falcons are allowed and if any restrictions apply.",
            "Inform the customer that if the itinerary changes after approval, a new approval is required.",
            "Email the completed Falcon request table to CC.FS and CC.Sups.",
            "Create and escalate a Salesforce case to Supervisor / Floor Support.",
            "Update SPRINT comments."
        ],

        customerAdvice: [
            "Request must be submitted more than 48 hours before departure.",
            "Prior airline approval is mandatory.",
            "Customer should contact back within 4 hours from the time of request to check approval status.",
            "A valid health certificate and destination documents must be carried with the falcon.",
            "Every falcon carried is charged one seat.",
            "Airport handling charge is AED 1500 per falcon per direction.",
            "Airport handling charges are non-refundable.",
            "If the itinerary changes after approval, a new approval is required.",
            "Falcons arriving into DXB / DWC must be carried in a box only.",
            "Tickets are non-refundable within 24 hours of departure, after no-show, or if falcons are rejected by authorities."
        ],

        hiddenDetails: {
            title: "Full Conditions / SSR / Restrictions",
            sections: [
                {
                    title: "SSR / Charges",
                    items: [
                        "SSR: PETC.",
                        "Airport handling charge: AED 1500 per falcon per direction.",
                        "Airport handling charge is added on SSR PETC.",
                        "If there is one falcon on a one-way journey, one PETC SSR is added for AED 1500.",
                        "If there is a return journey, PETC must be added per direction.",
                        "If there are two boxes with one falcon in each box, two SSR PETC must be added.",
                        "Airport handling charges are non-refundable.",
                        "Seat block for falcons is charged at the available fare at the time of booking.",
                        "Every falcon carried is charged one seat.",
                        "Falcon seat is considered as CBBG and no additional baggage allowance is allowed."
                    ]
                },
                {
                    title: "Limits",
                    items: [
                        "Maximum 2 falcons per handler.",
                        "Maximum 2 boxes per handler.",
                        "Each box may contain 1 falcon only.",
                        "Only 1 falcon on hand is allowed per handler.",
                        "Allowed combination: 1 falcon on hand and 1 falcon in a box.",
                        "Allowed combination: 2 falcons in 2 boxes.",
                        "For more than 15 falcons, higher authority approval is required.",
                        "No fixed limit on the total number of falcons on a flight, subject to available seats for sale.",
                        "No fixed limit on the total number of boxes on a flight, subject to available seats and approval."
                    ]
                },
                {
                    title: "Dimensions / Box Rules",
                    items: [
                        "Maximum falcon box dimensions: 55 cm H × 45 cm W × 40 cm D.",
                        "The box must fit on the aircraft seat.",
                        "The box must be able to be secured on the seat.",
                        "Boxes must be secured and immobile during flight and emergency.",
                        "Perches are not permitted because they cannot be secured on the seat.",
                        "Boxes are not provided by flydubai."
                    ]
                },
                {
                    title: "Restrictions",
                    items: [
                        "Animals in cabin are generally prohibited, except falcons when approved.",
                        "Falcons must be accompanied by a handler.",
                        "Handler must travel with the falcon in the same cabin.",
                        "Falcons are not allowed in Business Class.",
                        "Falcons cannot be carried on perches.",
                        "Falcons arriving into DXB / DWC must be carried in a box only.",
                        "DMM: Falcons are not allowed.",
                        "ULH / MED: Naama approval is required.",
                        "SPX: Falcon carriage is not available. HBE / DBB: Egypt import approval is required.",
                        "For interline / codeshare journeys, falcons must be booked directly with the operating carrier.",
                        "flydubai cannot accept falcons on behalf of other carriers."
                    ]
                },
                {
                    title: "Go-show Acceptance",
                    items: [
                        "Falcons may be accepted on a go-show basis subject to airport handling and approval.",
                        "For outstations, all go-show falcon bookings must be created through Reservations team.",
                        "For DXB / DWC, all go-show falcon bookings must be created through DXB Sales team.",
                        "Airport representative will advise crew and NCC of falcon carriage.",
                        "Reservations Support will add SSR PETC.",
                        "Passenger must pay for the booking and additional handling charge per falcon."
                    ]
                }
            ]
        },

        supervisorSection: {
            title: "FS / Supervisor Steps",
            hiddenByDefault: true,
            items: [
                "Supervisor / FS should forward the collected Falcon request table to reservationssupport@flydubai.com and allresteamleaders@flydubai.com for approval.",
                "Request payment time limit extension if required.",
                "For flights close to departure, treat the approval request as priority.",
                "Once approval is received from Reservations Support, assign an agent to contact the customer.",
                "Ensure payment is completed after recapping the booking details.",
                "Update Salesforce comments.",
                "Update SPRINT comments."
            ]
        }
    },

    {
        id: "cake-on-board",
        title: "Cake on Board",
        icon: "cake",
        category: "Catering / Special Service",
        serviceType: "paid-catering-request",
        ssr: ["CAKE"],
        searchKeywords: [
            "cake",
            "cake on board",
            "birthday cake",
            "honeymoon cake",
            "anniversary cake",
            "catering",
            "ssr cake",
            "misc leg level",
            "chocolate",
            "vanilla",
            "message on cake",
            "special arrangement"
        ],

        agentQuickGuide: {
            cutOff: "More than 48 hours before departure",
            approval: "Floor Support / Supervisor confirmation required",
            charge: "AED 110",
            mainAction: "Add SSR CAKE, send payment link, email request details, escalate Salesforce case, and update SPRINT comments.",
            warning: "For DAR / ZNZ, EBB, KTM, MLE, WAW, BUD, or TLV, check with Shift In Charge as special arrangement is required."
        },

        agentForm: {
            title: "Cake Request Details",
            description: "Fill the below details before sending the cake request email.",
            fields: [
                {
                    id: "pnr",
                    label: "PNR",
                    type: "text",
                    required: true,
                    placeholder: "Example: ABC123"
                },
                {
                    id: "passengerName",
                    label: "Passenger Name",
                    type: "text",
                    required: true,
                    placeholder: "Passenger name on whose name the cake needs to be ordered"
                },
                {
                    id: "classOfTravel",
                    label: "Class of Travel",
                    type: "text",
                    required: true,
                    placeholder: "Economy / Business"
                },
                {
                    id: "flightDateLeg",
                    label: "Flight Date / Required Leg",
                    type: "text",
                    required: true,
                    placeholder: "Clarify which flight/date/leg the cake is required"
                },
                {
                    id: "flightNumber",
                    label: "Flight Number",
                    type: "text",
                    required: true,
                    placeholder: "Example: FZ123"
                },
                {
                    id: "cakeFlavor",
                    label: "Preferred Cake Flavor",
                    type: "select",
                    required: true,
                    options: ["Chocolate", "Vanilla"]
                },
                {
                    id: "cakeMessage",
                    label: "Message Details on the Cake",
                    type: "textarea",
                    required: true,
                    placeholder: "Example: Happy Honeymoon to M & K from Colleagues"
                }
            ]
        },

        agentEmail: {
            enabled: true,
            to: [
                "CallcenterDXBops@flydubai.com"
            ],
            cc: [],
            subjectTemplate: "Cake on Board Request - PNR {{pnr}}",
            bodyTemplate: ""
        },

        agentProcess: [
            "Retrieve PNR and verify that the request is more than 48 hours before departure.",
            "If flight is from DAR / ZNZ, EBB, KTM, MLE, WAW, BUD, or TLV, check with Shift In Charge as special arrangement is required.",
            "Advise the customer with cake options, policy, and charge.",
            "Gain confirmation from Floor Support or Supervisor.",
            "Add SSR CAKE by going to Category MISC Leg Level, choose SSR CAKE, and add it to the required segment.",
            "Collect payment immediately after adding the service.",
            "Fill the required cake request details.",
            "Send the request details by email to CallcenterDXBops@flydubai.com.",
            "Escalate the case on Salesforce with the same details.",
            "Update SPRINT comments."
        ],

        customerAdvice: [
            "Cake request must be more than 48 hours before departure.",
            "Cake request is subject to policy, charge, payment, and catering arrangement.",
            "Customer must confirm preferred cake flavor and message details (maximum 35 characters). Verify strawberry availability before promising it.",
            "Once the service is booked, accepted, and paid, there will be no refund.",
            "No refund applies even in cases of segment modification or flight delays due to operational reasons."
        ],

        hiddenDetails: {
            title: "Full Conditions / SSR / Special Arrangement",
            sections: [
                {
                    title: "SSR / Timing",
                    items: [
                        "SSR: CAKE. AED 110; 10 cm diameter, five portions, message up to 35 characters.",
                        "Request must be more than 48 hours before departure.",
                        "SSR CAKE is added under Category MISC Leg Level."
                    ]
                },
                {
                    title: "Special Arrangement Stations",
                    items: [
                        "DAR / ZNZ",
                        "EBB",
                        "KTM",
                        "MLE",
                        "WAW",
                        "BUD",
                        "TLV",
                        "For these stations, check with Shift In Charge before proceeding."
                    ]
                },
                {
                    title: "Refund Condition",
                    items: [
                        "Once the service is booked, accepted, and paid, there will be no refund.",
                        "No refund applies in cases of segment modification.",
                        "No refund applies in cases of flight delays due to operational reasons."
                    ]
                }
            ]
        },

        supervisorSection: {
            title: "FS / Supervisor Steps",
            hiddenByDefault: true,
            items: [
                "Verify the PNR to ensure that payment has been completed.",
                "Send the request to catering.flydubai@flydubai.com."
            ]
        }
    },

    {
        "id": "fruit-basket",
        "title": "Fruit Basket",
        "icon": "apple",
        "category": "Catering / Special Service",
        "serviceType": "reference",
        "ssr": [
            "FRBS"
        ],
        "searchKeywords": [
            "fruit",
            "fruit basket",
            "frbs",
            "suspended"
        ],
        "agentQuickGuide": {
            "cutOff": "Unavailable",
            "approval": "Not applicable",
            "charge": "Do not collect payment",
            "mainAction": "Do not add FRBS. Verify current availability with the official service reference.",
            "warning": "Service suspended until further notice."
        },
        "agentProcess": [
            "Do not create new requests or collect payment. Refer existing requests for review."
        ],
        "customerAdvice": [
            "Service currently unavailable; confirm current availability before advising."
        ]
    },

    {
        id: "extra-seat-cbbg",
        title: "Extra Seat / CBBG",
        icon: "armchair",
        category: "Extra Seat / Cabin Baggage on Seat",
        serviceType: "seat-service",
        ssr: ["EXST", "CBBG"],
        searchKeywords: [
            "extra seat",
            "exst",
            "cbbg",
            "comfort",
            "valuable item",
            "valuable goods",
            "fragile item",
            "delicate item",
            "musical instrument",
            "diplomatic bag",
            "gold",
            "seat",
            "additional seat",
            "cabin baggage",
            "oversize passenger",
            "privacy",
            "extra comfort"
        ],

        agentQuickGuide: {
            cutOff: "At least 2 hours before departure",
            approval: "Agent can process eligible direct / TA booking; GDS requires separate handling",
            charge: "Equal fare amount for extra seat + standard seat assignment charges",
            mainAction: "Confirm reason, add extra adult passenger, add SSR EXST/CBBG to requesting passenger, assign adjoining seats, and update remarks.",
            warning: "CBBG is available only in Economy Class. EXST can be booked in Economy or Business Class. Not supported for interline / codeshare and available only on FZ prime booked flights."
        },

        decisionGuide: {
            title: "Quick Decision",
            result: "Proceed if the request is on FZ prime, at least 2 hours before departure, seats are available, and the class/service combination is eligible.",
            checks: [
                "EXST: Economy or Business Class.",
                "CBBG: Economy Class only.",
                "Not allowed as interline / codeshare document.",
                "Passenger and extra seat must be assigned adjoining seats.",
                "If GDS booking, create a separate booking for the extra seat."
            ]
        },

        customerScript: "You can purchase an extra seat subject to availability. EXST is available in Economy and Business, while CBBG is only available in Economy. The extra seat is charged at the applicable fare and seat charges apply.",

        fastAnswers: [
            {
                label: "Business Class",
                answer: "EXST is allowed in Business Class. CBBG is not available for Business Class passengers."
            },
            {
                label: "Charge",
                answer: "Charge the applicable fare for the extra seat plus standard seat assignment charges for both seats."
            },
            {
                label: "SSR Placement",
                answer: "Add SSR EXST or CBBG as zero value to the passenger requesting the service, not to the extra seat."
            },
            {
                label: "GDS",
                answer: "Extra seat cannot be added to the same GDS booking. Create a separate PNR and update both bookings with remarks."
            },
            {
                label: "Baggage",
                answer: "Hand baggage allowance does not increase with extra seat purchase. CBBG passengers are not eligible for extra checked baggage allowance."
            },
            {
                label: "Seat Rule",
                answer: "Assign adjoining seats. EXST must not be in exit rows 15/16. CBBG must not be in rows 14/15/16/17."
            }
        ],

        agentForm: {
            title: "Extra Seat / CBBG Request Details",
            description: "Fill the below details before adding EXST / CBBG or escalating if required.",
            fields: [
                {
                    id: "pnr",
                    label: "PNR",
                    type: "text",
                    required: true,
                    placeholder: "Example: ABC123"
                },
                {
                    id: "passengerName",
                    label: "Passenger Name",
                    type: "text",
                    required: true,
                    placeholder: "Passenger requesting extra seat"
                },
                {
                    id: "serviceType",
                    label: "Request Type",
                    type: "select",
                    required: true,
                    options: ["EXST - Extra Seat for Comfort", "CBBG - Cabin Baggage on Seat"]
                },
                {
                    id: "reason",
                    label: "Reason for Extra Seat",
                    type: "textarea",
                    required: true,
                    placeholder: "Comfort / valuable item / musical instrument / fragile item"
                },
                {
                    id: "bookingChannel",
                    label: "Booking Channel",
                    type: "select",
                    required: true,
                    options: ["Direct / Website", "Travel Agent", "GDS", "Other"]
                },
                {
                    id: "classOfTravel",
                    label: "Class of Travel",
                    type: "select",
                    required: true,
                    options: ["Economy", "Business"]
                },
                {
                    id: "flightDateSector",
                    label: "Flight / Date / Sector",
                    type: "text",
                    required: true,
                    placeholder: "Example: FZ123 / 15JAN / DXB-KWI"
                },
                {
                    id: "itemDescription",
                    label: "Item Description for CBBG",
                    type: "textarea",
                    required: false,
                    placeholder: "If CBBG: musical instrument, fragile item, diplomatic bag, etc."
                },
                {
                    id: "dimensionsWeight",
                    label: "Dimensions / Weight if CBBG",
                    type: "text",
                    required: false,
                    placeholder: "Example: 55 cm H × 45 cm W × 40 cm D / 20 kg"
                },
                {
                    id: "seatsAssigned",
                    label: "Adjoining Seats Assigned?",
                    type: "select",
                    required: true,
                    options: ["YES", "NO"]
                },
                {
                    id: "remarksUpdated",
                    label: "Booking Remarks Updated?",
                    type: "select",
                    required: true,
                    options: ["YES", "NO"]
                }
            ]
        },

        agentEmail: {
            enabled: false,
            to: [],
            cc: [],
            subjectTemplate: "",
            bodyTemplate: ""
        },

        agentChecklist: [
            "Confirm the reason: comfort, privacy, oversize passenger requirement, valuable item, fragile item, or musical instrument.",
            "Confirm service eligibility: FZ prime booked flights only; not interline / codeshare.",
            "For CBBG, confirm Economy Class only. For EXST, Economy and Business Class are allowed.",
            "Add an adult passenger using First Name EXST or CBBG and Last Name as the passenger last name.",
            "Add SSR EXST / CBBG as zero value to the passenger requesting the service, not to the extra seat.",
            "Assign adjoining seats and ensure both seats are charged as applicable.",
            "For GDS bookings, follow separate PNR handling and update remarks on both bookings."
        ],

        agentProcess: [
            "Retrieve the booking.",
            "Confirm the reason for extra seat: comfort or carrying valuable / fragile cabin baggage.",
            "If eligible direct channel or TA booking, add an adult passenger.",
            "For EXST, use First Name EXST and Last Name as passenger last name.",
            "For CBBG, use First Name CBBG and Last Name as passenger last name.",
            "Add SSR EXST or CBBG as zero value to the passenger requesting the service, not to the extra seat.",
            "Pre-assign adjoining seats for passenger and extra seat.",
            "Ensure both seats are chargeable as per standard rates.",
            "Comment the booking with appropriate remarks.",
            "For GDS booking, create a separate booking for the extra seat and update both bookings with correct remarks."
        ],

        customerAdvice: [
            "Extra seat can be purchased for comfort, privacy, oversize passenger requirement, valuable cabin baggage, fragile items, or musical instruments.",
            "CBBG is available only in Economy Class.",
            "EXST can be booked in Economy or Business Class.",
            "Hand baggage allowance does not increase with extra seat purchase.",
            "If flight plans change, change fees and fare rules apply to both seats.",
            "For GDS bookings, extra seat cannot be added to the existing booking; a separate PNR must be created for the extra seat."
        ],

        hiddenDetails: {
            title: "Full Conditions / Seat / Baggage Rules",
            sections: [
                {
                    title: "Use Cases",
                    items: [
                        "EXST: Extra seat for passenger comfort, privacy, or oversize passenger requirement.",
                        "CBBG: Extra seat for valuable, fragile, diplomatic, gold, or musical instrument cabin baggage.",
                        "Musical instruments may require an extra seat if carried in cabin and cannot be checked in."
                    ]
                },
                {
                    title: "Charges / Fare",
                    items: [
                        "Passenger pays an equal amount of fare for the extra seat based on available fare.",
                        "Pre-assigned seats for passenger and extra seat are chargeable as per standard seat rates.",
                        "Standard penalties and change fees apply to both seats if booking is modified.",
                        "Go-show fares apply for additional seat booked at airport for EXST or CBBG. Verify airport eligibility and capacity."
                    ]
                },
                {
                    title: "Limits",
                    items: [
                        "Maximum 2 additional EXST seats can be booked per passenger.",
                        "Only 1 CBBG seat is allowed per passenger.",
                        "No fixed limitation on the number of extra seats on each flight, subject to availability.",
                        "Hand baggage entitlement is per passenger, not per seat. For EXST checked baggage, confirm entitlement under the booked fare.",
                        "Economy passenger may carry one piece of hand baggage up to 7 kg.",
                        "Business passenger hand baggage entitlement remains as per passenger allowance."
                    ]
                },
                {
                    title: "Restrictions",
                    items: [
                        "EXST / CBBG cannot be purchased as interline or codeshare document.",
                        "This service is available only on FZ prime booked flights.",
                        "CBBG is not available for Business Class passengers.",
                        "EXST is available in both Economy and Business Class.",
                        "Two seat assignments are mandatory and must be reserved together.",
                        "Both seats must be booked in the same fare option. Verify the same fare brand before proceeding.",
                        "EXST must not be allocated in emergency exit rows 15 or 16.",
                        "CBBG must not be allocated in rows 14, 15, 16, or 17.",
                        "Passengers with CBBG are not eligible to carry extra checked-in baggage allowance.",
                        "Medical approval is required for MEDA cases.",
                        "If the article cannot be secured properly on the aircraft seat, it may not be accepted."
                    ]
                },
                {
                    title: "Dimensions / Weight",
                    items: [
                        "Maximum weight for baggage on blocked seat: 75 kg.",
                        "Standard cabin article dimensions: 55 cm H × 45 cm W × 40 cm D.",
                        "Article should not exceed the height of the headrest unless musical instrument exception applies.",
                        "Baggage on seat must be of a size and shape that can be secured with seat belt or extension belt.",
                        "Musical instruments taller than 55 cm but less than 140 cm may travel in cabin if a seat is purchased.",
                        "Musical instrument maximum dimensions: 140 cm H from floor × 45 cm W × 40 cm D.",
                        "Musical instrument maximum weight: 75 kg."
                    ]
                },
                {
                    title: "Seat Rules",
                    items: [
                        "Passenger and extra seat must be assigned adjoining seats.",
                        "Recommended seating is middle seat for passenger and window seat for extra seat where possible.",
                        "If window seats are not available, refer to Supervisor in Charge.",
                        "For EXST comfort cases, assign adjoining seats where the armrest can be lifted.",
                        "Seats must be manually assigned again if the segment is modified.",
                        "Pre-assigning seats for both passenger and extra seat is mandatory and chargeable."
                    ]
                }
            ]
        },

        supervisorSection: {
            title: "FS / Supervisor Notes",
            hiddenByDefault: true,
            items: [
                "If window seats are not available, agent should refer to Supervisor in Charge.",
                "For GDS bookings, FS / Supervisor may contact GDS Support if required.",
                "For unclear class, fare brand, seat assignment, MEDA, or CBBG acceptance cases, agent should check with Floor Support / Supervisor."
            ]
        }
    },

    {
        "id": "sporting-equipment",
        "title": "Sporting Equipment",
        "icon": "dumbbell",
        "category": "Special Baggage",
        "serviceType": "reference",
        "ssr": [
            "SPEQ",
            "BIKE"
        ],
        "searchKeywords": [
            "sport",
            "sports",
            "sporting equipment",
            "speq",
            "spex",
            "bike",
            "bicycle",
            "golf",
            "ski",
            "surfboard"
        ],
        "agentQuickGuide": {
            "cutOff": "Check current service availability before departure",
            "approval": "Subject to acceptance and capacity",
            "charge": "Included within checked baggage allowance; excess baggage charges may apply",
            "mainAction": "Check current official sporting equipment policy and booking availability.",
            "warning": "Do not quote legacy SPEX or sporting handling fees."
        },
        "agentProcess": [
            "Verify the allowance and dimensions against the current official sporting equipment policy.",
            "Refer to the current approved booking workflow before adding a service."
        ],
        "customerAdvice": [
            "Sporting equipment is included within checked baggage allowance, subject to acceptance.",
            "Maximum combined dimensions: 300 cm; maximum weight per item: 32 kg."
        ],
        "hiddenDetails": {
            "title": "Official reference",
            "sections": [
                {
                    "title": "Sporting equipment",
                    "items": [
                        "https://www.flydubai.com/en/flying-with-us/baggage/sporting-equipment/"
                    ]
                }
            ]
        }
    },

    {
        "id": "sporting-weapons-firearms",
        "title": "Sporting Weapons / Firearms",
        "icon": "shield-alert",
        "category": "Restricted Baggage",
        "serviceType": "reference",
        "ssr": [
            "WEAP"
        ],
        "searchKeywords": [
            "weapon",
            "firearm",
            "ammunition",
            "weap",
            "spex"
        ],
        "agentQuickGuide": {
            "cutOff": "Refer to current approved policy",
            "approval": "Required",
            "charge": "Verify current official charges",
            "mainAction": "Refer request to the authorized team using the current approved procedure.",
            "warning": "Do not use legacy SPEX instructions or confirm carriage without approval."
        },
        "agentProcess": [
            "Refer to the approved current policy and authorized team."
        ],
        "customerAdvice": [
            "Carriage is subject to approval and applicable restrictions."
        ]
    }
];

window.specialServicesData = specialServicesData;
