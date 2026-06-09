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
            "petc",
            "live animal",
            "handler",
            "box",
            "avi box",
            "falcon approval",
            "falcon booking",
            "airport handling"
        ],

        agentQuickGuide: {
            cutOff: "More than 48 hours before departure",
            approval: "Prior airline approval required",
            charge: "AED 1500 per falcon per direction",
            mainAction: "Create unpaid booking, collect details, escalate Salesforce case, and update SPRINT comments.",
            warning: "Do not confirm falcon carriage to the customer until approval is received."
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
                "reservationssupport@flydubai.com",
                "allresteamleaders@flydubai.com"
            ],
            cc: [],
            subjectTemplate: "Falcon Request - PNR {{pnr}}",
            bodyTemplate:
                "Dear Team,\n\n" +
                "Kindly assist with the below Falcon request approval.\n\n" +
                "PNR(s): {{pnr}}\n" +
                "Class of Travel: {{classOfTravel}}\n" +
                "Outbound Flight / Date / Sector: {{outboundFlight}}\n" +
                "Return Flight / Date / Sector: {{returnFlight}}\n" +
                "Total Number of Passengers: {{totalPassengers}}\n" +
                "Passenger Names: {{passengerNames}}\n" +
                "Handler informed no airline assistance will be provided for carrying boxes: {{handlerInformed}}\n" +
                "Contact Number: {{contactNumber}}\n" +
                "Email ID: {{email}}\n" +
                "Total Number of Falcons: {{totalFalcons}}\n" +
                "Falcons to be carried in: {{carriageMethod}}\n" +
                "Number of Falcons per Box: {{falconsPerBox}}\n" +
                "Number of Boxes: {{numberOfBoxes}}\n" +
                "Dimensions: {{dimensions}}\n" +
                "Number of SSR PETC to be added: {{petcCount}}\n" +
                "Airport Handling Charge Collected: {{handlingChargeCollected}}\n\n" +
                "Customer has been advised that this request is subject to approval and is not a confirmation to carry the falcon(s).\n\n" +
                "Regards"
        },

        agentProcess: [
            "Create an unpaid booking if the flight is more than 48 hours before departure.",
            "Use falcon name format: First Name = FALCON, Last Name = primary passenger last name.",
            "Collect all required falcon request details from the customer.",
            "Inform the customer that the request is not a confirmation to carry falcons.",
            "Inform the customer that prior airline approval is mandatory.",
            "Inform the customer that if the itinerary changes after approval, a new approval is required.",
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
            "Falcons arriving into DXB / DWC must be carried in a box only."
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
                        "If return journey applies, PETC must be added per direction.",
                        "Seat block for falcons is charged at the available fare at the time of booking.",
                        "Airport handling charges are non-refundable."
                    ]
                },
                {
                    title: "Limits",
                    items: [
                        "Maximum 2 falcons per handler.",
                        "Maximum 2 boxes per handler.",
                        "Each box may contain 1 falcon only.",
                        "Only 1 falcon on hand is allowed per handler.",
                        "Combination allowed: 1 falcon on hand and 1 falcon in a box, or 2 falcons in 2 boxes.",
                        "For more than 15 falcons, higher authority approval is required."
                    ]
                },
                {
                    title: "Dimensions / Box Rules",
                    items: [
                        "Maximum falcon box dimensions: 55 cm H × 45 cm W × 40 cm D.",
                        "The box must fit on the aircraft seat.",
                        "The box must be secured on the seat.",
                        "Perches are not permitted.",
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
                        "Falcons arriving into DXB / DWC must be carried in a box only.",
                        "DMM: Falcons are not allowed.",
                        "ULH / MED: Naama approval is required.",
                        "SPX / HBE / DBB: Egypt import approval is required.",
                        "For interline / codeshare journeys, falcons must be booked directly with the operating carrier."
                    ]
                }
            ]
        },

        supervisorSection: {
            title: "FS / Supervisor Steps",
            hiddenByDefault: true,
            items: [
                "Send the collected request details to reservationssupport@flydubai.com and allresteamleaders@flydubai.com for approval.",
                "Request payment time limit extension if required.",
                "Once approval is received, assign an agent to contact the customer.",
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
            bodyTemplate:
                "Dear Team,\n\n" +
                "Kindly assist with the below Cake on Board request.\n\n" +
                "PNR: {{pnr}}\n" +
                "Passenger Name: {{passengerName}}\n" +
                "Class of Travel: {{classOfTravel}}\n" +
                "Flight Date / Required Leg: {{flightDateLeg}}\n" +
                "Flight Number: {{flightNumber}}\n" +
                "Preferred Cake Flavor: {{cakeFlavor}}\n" +
                "Message Details on the Cake: {{cakeMessage}}\n\n" +
                "Payment link has been sent / payment status to be verified as per process.\n\n" +
                "Regards"
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
                        "No refund applies even in cases of segment modification.",
                        "No refund applies in case of flight delays due to operational reasons."
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
    }
];

window.specialServicesData = specialServicesData;
