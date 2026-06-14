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
            warning: "This is not a confirmation until approved. Do not confirm falcon carriage to the customer until approval is received."
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
                "\"CC.FS\" <CC.FS@flydubai.com>",
                "\"CC.Sups\" <CC.Sups@flydubai.com>"
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
                        "SPX / HBE / DBB: Egypt import approval is required.",
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
            charge: "As per cake option / applicable charge",
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
            "Send the payment link.",
            "Fill the required cake request details.",
            "Send the request details by email to CallcenterDXBops@flydubai.com.",
            "Escalate the case on Salesforce with the same details.",
            "Update SPRINT comments."
        ],

        customerAdvice: [
            "Cake request must be more than 48 hours before departure.",
            "Cake request is subject to policy, charge, payment, and catering arrangement.",
            "Customer must confirm preferred cake flavor and message details.",
            "Once the service is booked, accepted, and paid, there will be no refund.",
            "No refund applies even in cases of segment modification or flight delays due to operational reasons."
        ],

        hiddenDetails: {
            title: "Full Conditions / SSR / Special Arrangement",
            sections: [
                {
                    title: "SSR / Timing",
                    items: [
                        "SSR: CAKE.",
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
        id: "fruit-basket",
        title: "Fruit Basket",
        icon: "apple",
        category: "Catering / Special Service",
        serviceType: "paid-catering-request",
        ssr: ["FRBS"],
        searchKeywords: [
            "fruit",
            "fruit basket",
            "frbs",
            "basket",
            "catering",
            "special service",
            "apple",
            "banana",
            "grapes",
            "pear",
            "orange"
        ],

        agentQuickGuide: {
            cutOff: "Up to 48 hours before departure",
            approval: "No special approval mentioned",
            charge: "AED 35 or equivalent",
            mainAction: "Add SSR FRBS, collect payment, and update SPRINT comments.",
            warning: "Once booked, accepted, and paid, the service is non-refundable."
        },

        agentChecklist: [
            "Verify the request is up to 48 hours before departure.",
            "Add SSR FRBS for the required flight / leg.",
            "Collect AED 35 or equivalent.",
            "Advise the customer that the service is non-refundable once booked, accepted, and paid.",
            "Update SPRINT comments."
        ],

        agentEmail: {
            enabled: false,
            to: [],
            cc: [],
            subjectTemplate: "",
            bodyTemplate: ""
        },

        agentProcess: [
            "Retrieve PNR and verify request timing.",
            "Advise customer that Fruit Basket can be pre-ordered up to 48 hours prior to departure.",
            "Advise customer about the charge: AED 35 or equivalent.",
            "Add SSR FRBS as applicable.",
            "Collect payment.",
            "Update SPRINT comments."
        ],

        customerAdvice: [
            "Fruit Basket can be pre-ordered up to 48 hours prior to departure.",
            "Charge is AED 35 or equivalent.",
            "Once the service is booked, accepted, and paid, there will be no refund.",
            "No refund applies even in case of segment modification or operational flight delays."
        ],

        hiddenDetails: {
            title: "Full Conditions / SSR / Contents",
            sections: [
                {
                    title: "SSR / Charge",
                    items: [
                        "SSR: FRBS.",
                        "Charge: AED 35 or equivalent in other currencies.",
                        "Service can be pre-ordered up to 48 hours prior to departure."
                    ]
                },
                {
                    title: "Fruit Basket Contents",
                    items: [
                        "Black sanitized grapes",
                        "White sanitized grapes",
                        "Red sanitized apple",
                        "Tangerine / orange",
                        "Pear",
                        "Banana"
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
                "No specific FS / Supervisor email process mentioned for standard Fruit Basket request.",
                "If payment, SSR, or operational acceptance is unclear, agent should check with Floor Support / Supervisor."
            ]
        }
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
                        "Go-show fares apply for additional seat booked at airport for EXST or CBBG."
                    ]
                },
                {
                    title: "Limits",
                    items: [
                        "Maximum 2 additional EXST seats can be booked per passenger.",
                        "Only 1 CBBG seat is allowed per passenger.",
                        "No fixed limitation on the number of extra seats on each flight, subject to availability.",
                        "Hand baggage entitlement is per passenger, not per seat.",
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
                        "Both seats must be booked in the same fare option.",
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
        id: "sporting-equipment",
        title: "Sporting Equipment",
        icon: "dumbbell",
        category: "Special Baggage / Airport Handling Fee",
        serviceType: "special-baggage",
        ssr: ["SPEQ", "SPEX"],
        searchKeywords: [
            "sport",
            "sports",
            "sporting",
            "sporting equipment",
            "speq",
            "spex",
            "sporting ssr",
            "golf",
            "bicycle",
            "bike",
            "surfboard",
            "ski",
            "snowboard",
            "diving",
            "fishing",
            "equipment",
            "special baggage",
            "oversize",
            "pole vault",
            "javelin",
            "hang glider",
            "sports bag"
        ],

        agentQuickGuide: {
            cutOff: "At least 24 hours before departure",
            approval: "Required for restricted / oversized cases or requests beyond limits",
            charge: "SPEQ AED 150 / SPEX AED 270 per item per flight",
            mainAction: "Check dimensions, add SPEQ/SPEX when eligible, collect payment, and update SPRINT comments.",
            warning: "No sports equipment over 32 kg will be accepted. Go-show is subject to space and payload availability."
        },

        agentForm: {
            title: "Sporting Equipment Request Details",
            description: "Fill the below details before adding SPEQ / SPEX or escalating to Supervisor.",
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
                    placeholder: "Passenger name"
                },
                {
                    id: "flightDateSector",
                    label: "Flight / Date / Sector",
                    type: "text",
                    required: true,
                    placeholder: "Example: FZ123 / 15JAN / DXB-KTM"
                },
                {
                    id: "itineraryType",
                    label: "Itinerary Type",
                    type: "select",
                    required: true,
                    options: ["Point-to-point FZ", "Connecting FZ", "Interline", "Codeshare", "Separate Ticket", "Stopover in DXB"]
                },
                {
                    id: "equipmentType",
                    label: "Equipment Type",
                    type: "text",
                    required: true,
                    placeholder: "Example: Golf bag / bicycle / ski equipment"
                },
                {
                    id: "dimensions",
                    label: "Total Dimensions L + W + H",
                    type: "text",
                    required: true,
                    placeholder: "Example: 175 cm"
                },
                {
                    id: "weight",
                    label: "Weight",
                    type: "text",
                    required: true,
                    placeholder: "Example: 20 kg"
                },
                {
                    id: "ssrRequired",
                    label: "SSR Required",
                    type: "select",
                    required: true,
                    options: ["Free - within allowance", "SPEQ", "SPEX", "Supervisor Approval Required"]
                },
                {
                    id: "paymentCollected",
                    label: "Payment Collected?",
                    type: "select",
                    required: true,
                    options: ["YES", "NO", "Not Applicable"]
                },
                {
                    id: "commentsUpdated",
                    label: "SPRINT Comments Updated?",
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
            "Ask the customer for equipment type, total dimensions L + W + H, and weight.",
            "If total dimensions are 160 cm to 189 cm, add SPEQ per applicable flight / sector.",
            "If total dimensions are 190 cm to 350 cm, add SPEX per applicable flight / sector.",
            "Confirm maximum 32 kg per individual item; sports equipment over 32 kg is not accepted.",
            "Collect AED 150 for SPEQ or AED 270 for SPEX per item per flight where applicable.",
            "If within 24 hours, check Supervisor / FS before applying the SSR.",
            "Advise the customer to arrive at least 2 hours before departure and update SPRINT comments."
        ],

        agentProcess: [
            "Retrieve PNR and verify the flight is more than 24 hours before departure.",
            "Advise customer with maximum dimensions, packing requirements, terms, conditions, and charges.",
            "For point-to-point bookings, add SSR based on dimensions mentioned by passenger.",
            "If total dimensions are between 160 cm and 189 cm, add SPEQ per leg.",
            "If total dimensions are between 190 cm and 350 cm, add SPEX per leg.",
            "Collect payment from passenger where applicable.",
            "Update SPRINT comments.",
            "For connecting, interline, or codeshare requests, escalate to Supervisor to add SSR and advise customer to call back for payment completion if applicable."
        ],

        customerAdvice: [
            "Sporting equipment must be pre-booked when applicable.",
            "Passenger travelling with sporting equipment must arrive at least 2 hours before departure because additional handling is required.",
            "Equipment must be securely packed.",
            "No dangerous goods should be packed inside sports equipment unless permitted by IATA DGR.",
            "Go-show sporting equipment is subject to space and payload availability.",
            "No sports equipment over 32 kg will be accepted."
        ],

        hiddenDetails: {
            title: "Full Conditions / Dimensions / Charges",
            sections: [
                {
                    title: "Timing",
                    items: [
                        "Sporting equipment must be pre-booked at least 24 hours prior to departure.",
                        "If flight is less than 24 hours, check with Supervisor in Charge if SSR SPEQ / SPEX can be added.",
                        "Supervisor / Floor Support only can add SSR up to 12 hours prior to departure, subject to limits.",
                        "Passenger travelling with sporting equipment must arrive at least 2 hours before departure.",
                        "Sporting equipment beyond 350 cm requires pre-authorization 48 hours before departure.",
                        "Pole vaults, javelins, and hang gliders require pre-authorization 48 hours before departure."
                    ]
                },
                {
                    title: "Charges",
                    items: [
                        "SPEQ handling fee: AED 150 per item per flight.",
                        "SPEX handling fee: AED 270 per item per flight.",
                        "Charges are applicable per sector.",
                        "For connection flights, charge applies per flight sector when applicable.",
                        "Handling fee is refundable up to 24 hours prior to departure as per flydubai refund policy.",
                        "Within 24 hours, handling fee is non-refundable and non-transferable.",
                        "Within 24 hours, service can only be used by the passenger for the specific flight and sector paid."
                    ]
                },
                {
                    title: "Dimensions",
                    items: [
                        "Within hand baggage dimensions 55 cm H × 38 cm W × 20 cm D: Free.",
                        "Within checked baggage dimensions H + W + D maximum 159 cm: Free.",
                        "160 cm to 189 cm total dimensions: SPEQ / AED 150 per item per flight.",
                        "190 cm to 350 cm total dimensions: SPEX / AED 270 per item per flight.",
                        "Sporting equipment beyond 350 cm requires pre-authorization 48 hours before departure and additional charges.",
                        "No sports equipment over 32 kg will be accepted for health and safety reasons."
                    ]
                },
                {
                    title: "Baggage Rules",
                    items: [
                        "Each passenger is entitled to one sporting equipment per sector booked.",
                        "Additional sporting equipment requests require Airport Services Manager approval at station.",
                        "Any request beyond maximum limit of 10 requires approval from Special Handling team.",
                        "Each passenger can check in one item or one set of sporting equipment.",
                        "All sports equipment will be accepted as part of the passenger's checked baggage allowance.",
                        "If total weight is within checked baggage allowance, no excess baggage charge applies.",
                        "If weight exceeds allowance, excess baggage rates apply as with any checked item.",
                        "Maximum 32 kg per individual item applies.",
                        "If passenger has no baggage allowance, they can pre-purchase baggage or pay excess baggage at airport, subject to availability."
                    ]
                },
                {
                    title: "Restricted Sporting Equipment",
                    items: [
                        "Sporting equipment beyond 350 cm requires pre-authorization 48 hours before departure.",
                        "Pole vaults require pre-authorization 48 hours before departure.",
                        "Javelins require pre-authorization 48 hours before departure.",
                        "Hang gliders require pre-authorization 48 hours before departure.",
                        "Sporting weapons require pre-authorization 96 hours before departure.",
                        "No dangerous goods may be carried in sports equipment unless specifically permitted under IATA DGR."
                    ]
                },
                {
                    title: "Interline / Codeshare Rules",
                    items: [
                        "Sporting equipment handling fees are applicable only on flydubai-operated flights.",
                        "This charge applies to all ticket types including interline, staff travel, and codeshare, except EK mixed metal codeshare itinerary where applicable.",
                        "If passenger travels on FZ with onward codeshare, interline, or OAL connection, acceptance is subject to the other carrier's approval and charges.",
                        "Passengers holding separate tickets must pay handling charge for the flydubai leg.",
                        "At DXB for non-TCI passengers or passengers who made a stopover and approach check-in, applicable handling charge must be applied for the FZ leg.",
                        "Sporting equipment handling charge does not apply to mixed metal Emirates codeshare itineraries where passengers are booked onward between FZ and EK or vice versa.",
                        "If passenger originates from partner airline with bags and connects via DXB, no FZ handling charge is collected unless there is a stopover in DXB or separate tickets."
                    ]
                }
            ]
        },

        supervisorSection: {
            title: "FS / Supervisor Steps",
            hiddenByDefault: true,
            items: [
                "Retrieve PNR and verify the flight is more than 24 hours before departure.",
                "Add SSR SPEQ or SPEX per sector for applicable connecting / interline / codeshare cases.",
                "Update case comments.",
                "Supervisor / Floor Support only can add SSR up to 12 hours prior to departure, subject to maximum equipment limits.",
                "Any request beyond maximum limit of 10 requires approval from Special Handling team.",
                "Cancelling SPEX / SPEQ is permitted up to 24 hours prior to departure; refund is in the form of voucher.",
                "Agents must escalate cancellation request to Supervisor or Floor Support if applicable.",
                "Supervisor or Floor Support will send request to Reservations and voucher will be issued."
            ]
        }
    },

    {
        id: "sporting-weapons-firearms",
        title: "Sporting Weapons / Firearms",
        icon: "shield-alert",
        category: "Restricted Sporting Equipment / Security Approval",
        serviceType: "restricted-baggage",
        ssr: ["WEAP", "SPEX"],
        searchKeywords: [
            "weapon",
            "weapons",
            "firearm",
            "firearms",
            "ammunition",
            "sporting weapon",
            "sporting weapons",
            "weap",
            "spex",
            "security approval",
            "dubai police",
            "hunting",
            "gun",
            "guns",
            "rifle",
            "caliber",
            "calibre",
            "licence",
            "license",
            "serial number"
        ],

        agentQuickGuide: {
            cutOff: "96 hours / 4 working days before travel",
            approval: "Security / Dubai Police approval required",
            charge: "WEAP AED 300 per passenger + SPEX AED 270 per passenger per segment",
            mainAction: "Advise customer to email required documents to letstalk@flydubai.com or retrieve case number if already written, then escalate to Supervisor.",
            warning: "Do not confirm weapon / firearm / ammunition carriage without written documents and security approval."
        },

        agentForm: {
            title: "Sporting Weapon / Firearm Request Details",
            description: "Fill the below details before escalating the request to Supervisor.",
            fields: [
                {
                    id: "caseStatus",
                    label: "Customer Already Wrote to flydubai?",
                    type: "select",
                    required: true,
                    options: ["NO - Advise customer to email letstalk@flydubai.com", "YES - Customer provided case number"]
                },
                {
                    id: "caseNumber",
                    label: "Case Number",
                    type: "text",
                    required: false,
                    placeholder: "If customer already wrote to flydubai"
                },
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
                    placeholder: "Passenger name"
                },
                {
                    id: "nationality",
                    label: "Nationality",
                    type: "text",
                    required: true,
                    placeholder: "Passenger nationality"
                },
                {
                    id: "passportDetails",
                    label: "Passport Details / Copy Available?",
                    type: "select",
                    required: true,
                    options: ["YES", "NO"]
                },
                {
                    id: "flightDetails",
                    label: "Flight Details",
                    type: "text",
                    required: true,
                    placeholder: "Flight / Date / Sector"
                },
                {
                    id: "weaponDetails",
                    label: "Weapon Details",
                    type: "textarea",
                    required: true,
                    placeholder: "Type of weapon / firearm / ammunition"
                },
                {
                    id: "makeCaliberModel",
                    label: "Make, Caliber, and Model",
                    type: "text",
                    required: true,
                    placeholder: "Make / caliber / model"
                },
                {
                    id: "serialNumber",
                    label: "Serial Number",
                    type: "text",
                    required: true,
                    placeholder: "Weapon serial number"
                },
                {
                    id: "licenseCopy",
                    label: "License Copy Available?",
                    type: "select",
                    required: true,
                    options: ["YES", "NO"]
                },
                {
                    id: "numberOfFirearms",
                    label: "Number of Firearms",
                    type: "number",
                    required: true,
                    placeholder: "Example: 1"
                },
                {
                    id: "ammunitionWeight",
                    label: "Quantity of Ammunition / Weight",
                    type: "text",
                    required: true,
                    placeholder: "Maximum gross weight must not exceed 5 kg"
                },
                {
                    id: "purpose",
                    label: "Purpose of Carriage",
                    type: "textarea",
                    required: true,
                    placeholder: "Sports / hunting event / other purpose"
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
            "Ask whether the customer has already emailed flydubai and has a case number.",
            "If not, advise the customer to email letstalk@flydubai.com with all required documents and details.",
            "Do not confirm carriage until security / Dubai Police approval is received.",
            "Advise the 96-hour / 4-working-day pre-authorization requirement.",
            "After approval, apply WEAP AED 300 per passenger and SPEX AED 270 per passenger per segment where applicable.",
            "Escalate the case to Supervisor / FS for security approval handling.",
            "Update Salesforce case and SPRINT comments."
        ],

        agentProcess: [
            "If customer did not write to flydubai or wrote with incomplete information, inform the customer to email letstalk@flydubai.com with all required documents and details.",
            "Advise customer of approval turnaround time: 4 days prior to journey.",
            "Advise cost per passenger: SSR WEAP AED 300 in addition to SSR SPEX AED 270 per passenger per segment.",
            "Advise that unloaded weapons must be declared during check-in.",
            "Advise that ammunition maximum gross weight must not exceed 5 kg.",
            "Advise that ammunition must be packed in a sturdy box.",
            "Inform customer that the request is subject to approval.",
            "If customer already wrote to flydubai, retrieve case number and verify all required details.",
            "Create and escalate case in Salesforce to Supervisor.",
            "Update SPRINT comments."
        ],

        customerAdvice: [
            "Customer must provide complete written documents before processing.",
            "Request is subject to security approval.",
            "Approval is valid only for the approved flight, date, and sector.",
            "New approval and new charges are required if travel date changes.",
            "Weapons must be unloaded and declared at check-in.",
            "Ammunition must not exceed 5 kg gross weight and must be properly packed.",
            "Sporting weapons, firearms, and ammunition can be carried as checked baggage only."
        ],

        hiddenDetails: {
            title: "Full Conditions / Documents / Charges",
            sections: [
                {
                    title: "Timing",
                    items: [
                        "Sporting weapons must be pre-booked and pre-authorized at least 96 hours before departure.",
                        "Required documents must be available at least 4 working days before date of travel.",
                        "Approval turnaround time should be advised as 4 days prior to journey."
                    ]
                },
                {
                    title: "Charges",
                    items: [
                        "WEAP charge: AED 300 per passenger.",
                        "SPEX charge: AED 270 per passenger per segment.",
                        "WEAP charge is for permissions arranged with Dubai Police.",
                        "WEAP charge applies per passenger.",
                        "SPEX charge applies per passenger per segment where applicable.",
                        "Example: 3 passengers travelling with weapons require 3 SSR WEAP charges."
                    ]
                },
                {
                    title: "Restrictions",
                    items: [
                        "Sporting weapons, firearms, and ammunition can be carried as checked-in baggage only.",
                        "Weapons must be unloaded.",
                        "Weapons must be declared during check-in.",
                        "Maximum gross weight of ammunition must not exceed 5 kg.",
                        "Ammunition must be packed in a sturdy box.",
                        "Request is subject to security approval.",
                        "Approval is valid only for the approved flight, date, and sector.",
                        "A new approval is required if passenger changes date of travel.",
                        "New charges apply if new approval is required."
                    ]
                },
                {
                    title: "Required Documents",
                    items: [
                        "Passenger name",
                        "Nationality",
                        "Passport details or copy",
                        "Passenger PNR",
                        "Flight details",
                        "Details of the weapon",
                        "Make, caliber, and model",
                        "Serial number",
                        "License copy",
                        "Number of firearms",
                        "Quantity of ammunition / weight",
                        "Purpose of carriage",
                        "Invitation letter if for sports or hunting event"
                    ]
                },
                {
                    title: "Interline / Codeshare",
                    items: [
                        "For interline or codeshare with EK bookings where origin is on OAL, ideally the OAL carrier handles the request.",
                        "If the request comes to flydubai for approval, charges apply."
                    ]
                }
            ]
        },

        supervisorSection: {
            title: "FS / Supervisor Steps",
            hiddenByDefault: true,
            items: [
                "Retrieve case number from customer.",
                "Verify all required details and documents.",
                "Create a follow-up request to Customer Service Group via Chatter titled firearms/ammunition so the case is picked up on priority.",
                "Update SPRINT comments.",
                "Request with all relevant documents must be forwarded to Security for necessary approval.",
                "Approval from Dubai Police authority must be obtained where required.",
                "Once approval from Security is received, Reservations Support keeps reminder to send advisory to Airports.",
                "Security informs NCC, Airport, and originator of the request after approval."
            ]
        }
    }
];

window.specialServicesData = specialServicesData;
