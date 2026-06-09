const specialServicesData = [
    {
        id: "falcon",
        title: "Falcon",
        icon: "bird",
        category: "Special Cabin / Live Animal Handling",
        ssr: ["PETC"],
        keywords: [
            "falcon",
            "falcons",
            "bird",
            "birds",
            "animal",
            "animals",
            "live animal",
            "petc",
            "airport handling",
            "handler",
            "box",
            "avi box",
            "cbbg",
            "falcon booking",
            "falcon request",
            "falcon approval",
            "falcon in cabin",
            "falcon carriage"
        ],
        summary: "Process for handling falcon carriage requests in the cabin, subject to prior airline approval, destination acceptance, documentation, seat availability, and applicable charges.",
        quickFacts: [
            "Animals in cabin are prohibited, except falcons when approved.",
            "Request must be submitted more than 48 hours before departure.",
            "Prior airline approval is mandatory.",
            "A new approval is required if the itinerary changes.",
            "Maximum 2 falcons per handler.",
            "Falcons arriving into DXB or DWC must be carried in a box only.",
            "Falcons are not allowed in Business Class.",
            "Airport handling charge is AED 1500 per falcon per direction."
        ],
        timing: [
            "Falcon booking request must be submitted more than 48 hours before departure.",
            "Falcon hunting season is normally between October and March, where higher booking volume may be expected.",
            "For flights close to departure, Supervisor or Floor Support should treat the approval request as priority.",
            "Customer should be advised to contact back within 4 hours from the time of request to check the approval status."
        ],
        charges: [
            "Airport handling charge: AED 1500 per falcon per direction.",
            "Airport handling charge is added on SSR PETC.",
            "If there is one falcon on a one-way journey, one PETC SSR is added for AED 1500.",
            "If there is a return journey, PETC must be added per direction.",
            "If there are 2 boxes with 1 falcon in each box, 2 SSR PETC must be added.",
            "Airport handling charges are non-refundable.",
            "One seat must be blocked per falcon or per box, as applicable.",
            "Seat block for falcons is charged at the available fare at the time of booking.",
            "Every falcon carried is charged one seat.",
            "Falcon seat is considered as CBBG and does not provide additional baggage allowance."
        ],
        limits: [
            "Maximum 2 falcons per handler.",
            "Maximum 2 boxes per handler.",
            "Each box may contain 1 falcon only.",
            "Only 1 falcon on hand is allowed per handler.",
            "Allowed combination: 1 falcon on hand and 1 falcon in a box.",
            "Allowed combination: 2 falcons in 2 boxes.",
            "For more than 15 falcons, higher authority approval is required.",
            "No fixed limit on total falcons per flight, subject to available seats for sale.",
            "No fixed limit on total boxes per flight, subject to available seats and approval."
        ],
        dimensions: [
            "Maximum falcon box dimensions: 55 cm H × 45 cm W × 40 cm D.",
            "The box must fit on the aircraft seat.",
            "The box must be able to be secured on the seat.",
            "Boxes must be secured and immobile during flight and emergency.",
            "Perches are not permitted because they cannot be secured on the seat.",
            "Boxes are not provided by flydubai."
        ],
        restrictions: [
            "Animals in cabin are generally prohibited, but falcons may be allowed subject to approval.",
            "Falcons must be accompanied by a handler.",
            "Handler must travel with the falcon in the same cabin.",
            "Falcons are not allowed in Business Class.",
            "Falcons cannot be carried on perches.",
            "Falcons arriving into DXB or DWC must be carried in a box only.",
            "DMM: Falcons are not allowed.",
            "ULH and MED: Naama approval is required.",
            "SPX, HBE, and DBB: Prior Egypt import approval is required.",
            "For interline or codeshare journeys, falcons must be booked directly with the operating carrier.",
            "flydubai cannot accept falcons on behalf of other carriers."
        ],
        requiredDetails: [
            "PNR",
            "Class of travel",
            "Outbound flight, date, and sector",
            "Return flight, date, and sector if applicable",
            "Total number of passengers",
            "Passenger names: Last Name / First Name / Title",
            "Confirmation that handler was informed they must carry the boxes or make their own arrangements during boarding and disembarking",
            "Contact number",
            "Email ID",
            "Total number of falcons",
            "Falcons to be carried in hand or box",
            "Number of falcons per box",
            "Number of boxes",
            "Box dimensions",
            "Number of SSR PETC to be added for airport handling charge",
            "Confirmation whether airport handling charge has been collected"
        ],
        agentProcess: [
            "Create an unpaid booking if the flight is more than 48 hours before departure.",
            "Use falcon name format: First Name = FALCON, Last Name = primary passenger last name.",
            "Collect all required passenger, flight, falcon, box, contact, and charge details.",
            "Inform the customer that providing the details is not a confirmation to carry falcons.",
            "Inform the customer that prior airline approval is mandatory.",
            "Inform the customer that the airline needs to check with the destination airport if falcons are allowed and if restrictions apply.",
            "Inform the customer that if the itinerary changes after approval, a new approval is required.",
            "Inform the customer that a valid health certificate and destination documents must be carried with the falcon.",
            "Inform the customer that every falcon carried is charged one seat.",
            "Inform the customer that airport handling charges are non-refundable.",
            "Inform the customer that any falcon arriving into DXB must be carried in a box only.",
            "Create and escalate a Salesforce case to Supervisor.",
            "Update SPRINT comments."
        ],
        supervisorProcess: [
            "Send the collected request details to allresteamleaders@flydubai.com and reservationssupport@flydubai.com for approval.",
            "Request payment time limit extension if required.",
            "Once approval is received from Reservations Support, assign an agent to contact the customer.",
            "Ensure payment is completed after recapping the booking details.",
            "Update Salesforce comments.",
            "Update SPRINT comments."
        ],
        goShowProcess: [
            "Falcons may be accepted on a go-show basis subject to airport handling and approval.",
            "For outstations, all go-show falcon bookings must be created through Reservations team.",
            "For DXB or DWC, all go-show falcon bookings must be created through DXB Sales team.",
            "Airport representative will advise crew and NCC of falcon carriage.",
            "Reservations Support will add SSR PETC.",
            "Passenger must pay for the booking and additional handling charge per falcon."
        ],
        customerAdvice: [
            "Prior airline approval is mandatory.",
            "Request is not confirmed until approval is received.",
            "If itinerary changes, new approval is required.",
            "Valid destination health certificate must be carried with the falcon.",
            "Falcons must be accompanied by a handler.",
            "Every falcon carried is charged one seat.",
            "Airport handling charges are non-refundable.",
            "Tickets are non-refundable within 24 hours of departure, after no-show, or if falcons are rejected by authorities.",
            "If there is a last-minute aircraft change and falcons cannot be carried, rebooking to the next flight subject to seats or refund of the unutilized portion may be offered."
        ],
        emails: [
            "allresteamleaders@flydubai.com",
            "reservationssupport@flydubai.com"
        ],
        note: "Do not confirm falcon carriage until approval is received. Always check destination restrictions, documents, charges, seating, box requirements, and itinerary conditions before advising the passenger."
    },
    {
        id: "cake-on-board",
        title: "Cake on Board",
        icon: "cake",
        category: "Special Service / Catering Request",
        ssr: ["CAKE"],
        keywords: [
            "cake",
            "cake on board",
            "birthday cake",
            "honeymoon cake",
            "anniversary cake",
            "catering",
            "ssr cake",
            "cake request",
            "misc leg level",
            "special arrangement",
            "chocolate",
            "vanilla",
            "message on cake"
        ],
        summary: "Process for requesting cake on board through SSR CAKE, subject to 48-hour timing, payment, supervisor confirmation, and catering arrangement.",
        quickFacts: [
            "Request must be more than 48 hours before departure.",
            "SSR: CAKE.",
            "Add SSR CAKE from Category MISC Leg Level.",
            "Special arrangement stations require Shift In Charge confirmation.",
            "Request details must be emailed to CallcenterDXBops@flydubai.com.",
            "Supervisor sends the request to catering.flydubai@flydubai.com."
        ],
        timing: [
            "Cake on Board request must be more than 48 hours before departure.",
            "Special Services can be pre-ordered 48 hours prior to departure."
        ],
        charges: [
            "Advise the customer with cake options, policy, and applicable charge.",
            "Send payment link after adding the SSR and gaining required confirmation.",
            "Once the service is booked, accepted, and paid, there will be no refund.",
            "No refund applies even in cases of segment modification or flight delays due to operational reasons."
        ],
        restrictions: [
            "For flights from DAR / ZNZ, EBB, KTM, MLE, WAW, BUD, or TLV, check with Shift In Charge because special arrangement is required.",
            "Request is subject to timing, payment, supervisor confirmation, and catering confirmation."
        ],
        requiredDetails: [
            "PNR",
            "Passenger name on whose name the cake needs to be ordered",
            "Class of travel",
            "Flight date and required leg",
            "Flight number",
            "Preferred cake flavor: chocolate or vanilla",
            "Message details on the cake"
        ],
        agentProcess: [
            "Retrieve PNR and verify that the request is more than 48 hours before departure.",
            "If flight is from DAR / ZNZ, EBB, KTM, MLE, WAW, BUD, or TLV, check with Shift In Charge because special arrangement is required.",
            "Advise the customer with cake options, policy, and charge.",
            "Gain confirmation from Floor Support or Supervisor.",
            "Add SSR CAKE from Category MISC Leg Level to the required segment.",
            "Send the payment link.",
            "Fill the required table details.",
            "Send the details by email to CallcenterDXBops@flydubai.com.",
            "Escalate the case on Salesforce with the same details.",
            "Update SPRINT comments."
        ],
        supervisorProcess: [
            "Verify the PNR and ensure payment has been completed.",
            "Send the request to catering.flydubai@flydubai.com."
        ],
        customerAdvice: [
            "Cake request must be made more than 48 hours before departure.",
            "Customer must confirm cake option, flavor, and message details.",
            "Request is subject to payment and catering confirmation.",
            "No refund applies once the service is booked, accepted, and paid."
        ],
        emails: [
            "CallcenterDXBops@flydubai.com",
            "catering.flydubai@flydubai.com"
        ],
        note: "Always confirm timing, payment, required details, and special arrangement station requirement before sending the request."
    },
    {
        id: "fruit-basket",
        title: "Fruit Basket",
        icon: "apple",
        category: "Special Service / Catering Request",
        ssr: ["FRBS"],
        keywords: [
            "fruit basket",
            "frbs",
            "fruit",
            "basket",
            "catering",
            "special service",
            "ssr frbs",
            "pre-order",
            "grapes",
            "apple",
            "orange",
            "pear",
            "banana"
        ],
        summary: "Process for pre-ordering a fruit basket as a paid special service up to 48 hours before departure.",
        quickFacts: [
            "SSR: FRBS.",
            "Fruit Basket can be pre-ordered up to 48 hours prior to departure.",
            "Charge: AED 35 or equivalent.",
            "Once booked, accepted, and paid, it is non-refundable."
        ],
        timing: [
            "Fruit Basket can be pre-ordered up to 48 hours prior to departure.",
            "Special Services can be pre-ordered by calling Contact Centre, flydubai retail offices, or through travel agents for TA bookings."
        ],
        charges: [
            "Charge: AED 35 or equivalent in other currencies.",
            "Once the service is booked, accepted, and paid, there will be no refund.",
            "No refund applies even in cases of segment modification or operational flight delays."
        ],
        contents: [
            "Black sanitized grapes",
            "White sanitized grapes",
            "Red sanitized apple",
            "Tangerine / orange",
            "Pear",
            "Banana"
        ],
        agentProcess: [
            "Retrieve PNR and verify request timing.",
            "Advise customer about Fruit Basket option and charge.",
            "Add SSR FRBS as applicable.",
            "Collect payment.",
            "Update SPRINT comments."
        ],
        customerAdvice: [
            "Fruit Basket must be pre-ordered up to 48 hours prior to departure.",
            "Fruit Basket is subject to payment and acceptance.",
            "No refund applies once booked, accepted, and paid."
        ],
        note: "Use SSR FRBS and ensure the customer understands the non-refundable condition after payment."
    },
    {
        id: "extra-seat-cbbg",
        title: "Extra Seat / CBBG",
        icon: "armchair",
        category: "Extra Seat / Cabin Baggage on Seat",
        ssr: ["EXST", "CBBG"],
        keywords: [
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
        summary: "Process for adding an extra seat either for passenger comfort or for valuable, fragile, diplomatic, or musical instrument cabin baggage that cannot be checked in.",
        quickFacts: [
            "EXST is for passenger comfort.",
            "CBBG is for valuable or fragile cabin baggage.",
            "EXST is available in Economy and Business Class.",
            "CBBG is available only in Economy Class.",
            "Maximum 2 EXST seats per passenger.",
            "Maximum 1 CBBG seat per passenger.",
            "Hand baggage entitlement remains per passenger, not per seat.",
            "EXST / CBBG is not supported for interline or codeshare bookings."
        ],
        useCases: [
            "EXST: Extra seat for passenger comfort, privacy, or oversize passenger requirement.",
            "CBBG: Extra seat for valuable, fragile, diplomatic, gold, or musical instrument cabin baggage.",
            "Musical instruments may require an extra seat if they are carried in cabin and cannot be checked in."
        ],
        timing: [
            "Request must be made at least 2 hours before departure.",
            "Airport go-show handling may be available for DXB T2 departures only, subject to capacity restrictions and approval."
        ],
        charges: [
            "Passenger pays an equal amount of fare for the extra seat based on available fare.",
            "Pre-assigned seats for passenger and extra seat are chargeable as per standard seat rates.",
            "Standard penalties and change fees apply to both seats if booking is modified.",
            "Go-show fares apply for additional seat booked at airport for EXST or CBBG."
        ],
        limits: [
            "Maximum 2 additional EXST seats can be booked per passenger.",
            "Only 1 CBBG seat is allowed per passenger.",
            "There is no fixed limitation on the number of extra seats on each flight, subject to availability.",
            "Hand baggage entitlement is per passenger, not per seat.",
            "Economy passenger may carry one piece of hand baggage up to 7 kg.",
            "Business passenger hand baggage entitlement remains as per passenger allowance."
        ],
        restrictions: [
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
        ],
        dimensions: [
            "Maximum weight for baggage on blocked seat: 75 kg.",
            "Standard cabin article dimensions: 55 cm H × 45 cm W × 40 cm D.",
            "Article should not exceed the height of the headrest unless musical instrument exception applies.",
            "Baggage on seat must be of a size and shape that can be secured with seat belt or extension belt.",
            "Musical instruments taller than 55 cm but less than 140 cm may travel in the cabin if a seat is purchased.",
            "Musical instrument maximum dimensions: 140 cm H from floor × 45 cm W × 40 cm D.",
            "Musical instrument maximum weight: 75 kg."
        ],
        seatRules: [
            "Passenger and extra seat must be assigned adjoining seats.",
            "Recommended seating is middle seat for passenger and window seat for extra seat where possible.",
            "If window seats are not available, refer to Supervisor in Charge.",
            "For EXST comfort cases, assign adjoining seats where the armrest can be lifted.",
            "Seats must be manually assigned again if the segment is modified.",
            "Pre-assigning seats for both passenger and extra seat is mandatory and chargeable."
        ],
        directBookingProcess: [
            "Retrieve the booking.",
            "Confirm the reason for extra seat: comfort or carrying valuable / fragile item.",
            "Add an adult passenger.",
            "For EXST, use First Name EXST and Last Name as passenger last name.",
            "For CBBG, use First Name CBBG and Last Name as passenger last name.",
            "Add SSR EXST or CBBG as zero value to the passenger requesting the service, not to the extra seat.",
            "Pre-assign adjoining seats for passenger and extra seat.",
            "Comment the booking with appropriate remarks."
        ],
        gdsProcess: [
            "Create a new booking for the extra seat.",
            "Confirm the reason for extra seat.",
            "Add adult passenger with First Name EXST or CBBG and Last Name as passenger last name.",
            "Retrieve the GDS booking.",
            "Add SSR EXST or CBBG as zero value to the passenger requesting the service in the GDS booking, not to the extra seat.",
            "Pre-assign adjoining seats together.",
            "Comment both bookings with appropriate remarks."
        ],
        customerAdvice: [
            "Extra seat can be purchased for comfort, privacy, oversize passenger requirement, valuable cabin baggage, fragile items, or musical instruments.",
            "CBBG is available only in Economy Class.",
            "EXST can be booked in Economy or Business Class.",
            "Hand baggage allowance does not increase with extra seat purchase.",
            "If flight plans change, change fees and fare rules apply to both seats.",
            "For GDS bookings, extra seat cannot be added to the existing booking; a separate PNR must be created for the extra seat."
        ],
        note: "Always confirm whether the request is EXST or CBBG before adding the extra seat, and ensure seat assignment, fare brand, baggage, and class restrictions are followed."
    },
    {
        id: "sporting-equipment",
        title: "Sporting Equipment",
        icon: "dumbbell",
        category: "Special Baggage / Airport Handling Fee",
        ssr: ["SPEQ", "SPEX"],
        keywords: [
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
        summary: "Process for carrying sporting equipment, subject to dimensions, handling fees, pre-booking timing, baggage allowance, route conditions, and applicable approval.",
        quickFacts: [
            "Sporting equipment must be pre-booked at least 24 hours before departure.",
            "SPEQ: AED 150 per item per flight.",
            "SPEX: AED 270 per item per flight.",
            "Maximum individual item weight: 32 kg.",
            "Passenger must arrive at least 2 hours before departure.",
            "Maximum 10 equipment per flight unless Special Handling approval is received.",
            "Go-show sporting equipment is subject to space and payload availability."
        ],
        timing: [
            "Sporting equipment must be pre-booked at least 24 hours prior to departure.",
            "If flight is less than 24 hours, check with Supervisor in Charge if SSR SPEQ / SPEX can be added.",
            "Supervisor / Floor Support only can add SSR up to 12 hours prior to departure, subject to limits.",
            "Passenger travelling with sporting equipment must arrive at least 2 hours before departure.",
            "Sporting equipment beyond 350 cm requires pre-authorization 48 hours before departure.",
            "Pole vaults, javelins, and hang gliders require pre-authorization 48 hours before departure."
        ],
        charges: [
            "SPEQ handling fee: AED 150 per item per flight.",
            "SPEX handling fee: AED 270 per item per flight.",
            "Charges are applicable per sector.",
            "For connection flights, charge applies per flight sector when applicable.",
            "Example: SPEQ on KTM-DXB-DXB-VKO connection totals AED 300 if applicable on both sectors.",
            "Example: SPEX on KTM-DXB-DXB-VKO connection totals AED 540 if applicable on both sectors.",
            "Handling fee is refundable up to 24 hours prior to departure as per flydubai refund policy.",
            "Within 24 hours, handling fee is non-refundable and non-transferable.",
            "Within 24 hours, service can only be used by the passenger for the specific flight and sector paid."
        ],
        dimensions: [
            "Within hand baggage dimensions 55 cm H × 38 cm W × 20 cm D: Free.",
            "Within checked baggage dimensions H + W + D maximum 159 cm: Free.",
            "160 cm to 189 cm total dimensions: SPEQ / AED 150 per item per flight.",
            "190 cm to 350 cm total dimensions: SPEX / AED 270 per item per flight.",
            "Sporting equipment beyond 350 cm requires pre-authorization 48 hours before departure and additional charges.",
            "No sports equipment over 32 kg will be accepted for health and safety reasons."
        ],
        baggageRules: [
            "Each passenger is entitled to one sporting equipment per sector booked.",
            "Additional sporting equipment requests require Airport Services Manager approval at station.",
            "Any request beyond maximum limit of 10 requires approval from Special Handling team.",
            "Each passenger can check in one item or one set of sporting equipment.",
            "A set may include items such as one pair of skis and one pair of ski poles.",
            "All sports equipment will be accepted as part of the passenger's checked baggage allowance.",
            "If total weight is within checked baggage allowance, no excess baggage charge applies.",
            "If weight exceeds allowance, excess baggage rates apply as with any checked item.",
            "Maximum 32 kg per individual item applies.",
            "If passenger has no baggage allowance, they can pre-purchase baggage or pay excess baggage at airport, subject to availability."
        ],
        restrictedItems: [
            "Sporting equipment beyond 350 cm requires pre-authorization 48 hours before departure.",
            "Pole vaults require pre-authorization 48 hours before departure.",
            "Javelins require pre-authorization 48 hours before departure.",
            "Hang gliders require pre-authorization 48 hours before departure.",
            "Sporting weapons require pre-authorization 96 hours before departure.",
            "No dangerous goods may be carried in sports equipment unless specifically permitted under IATA DGR."
        ],
        pointToPointProcess: [
            "Retrieve PNR and verify the flight is more than 24 hours before departure.",
            "Advise customer with maximum dimensions, packing requirements, terms, conditions, and charges.",
            "Add SSR based on dimensions mentioned by passenger.",
            "If total dimensions are between 160 cm and 189 cm, add SPEQ per leg.",
            "If total dimensions are between 190 cm and 350 cm, add SPEX per leg.",
            "Collect payment from passenger.",
            "Update SPRINT comments."
        ],
        connectingProcess: [
            "Retrieve PNR and verify the flight is more than 24 hours before departure.",
            "Advise customer with maximum dimensions, packing requirements, terms, conditions, and charges.",
            "Escalate customer request to Supervisor to add the SSR.",
            "Advise customer to call back for payment completion if applicable.",
            "Update SPRINT comments."
        ],
        supervisorProcess: [
            "Retrieve PNR and verify the flight is more than 24 hours before departure.",
            "Add SSR SPEQ or SPEX per sector.",
            "Update case comments."
        ],
        interlineCodeshareRules: [
            "Sporting equipment handling fees are applicable only on flydubai-operated flights.",
            "This charge applies to all ticket types including interline, staff travel, and codeshare, except EK mixed metal codeshare itinerary where applicable.",
            "If passenger travels on FZ with onward codeshare, interline, or OAL connection, acceptance is subject to the other carrier's approval and charges.",
            "Passengers holding separate tickets must pay handling charge for the flydubai leg.",
            "At DXB for non-TCI passengers or passengers who made a stopover and approach check-in, applicable handling charge must be applied for the FZ leg.",
            "Sporting equipment handling charge does not apply to mixed metal Emirates codeshare itineraries where passengers are booked onward between FZ and EK or vice versa.",
            "If passenger originates from partner airline with bags and connects via DXB, no FZ handling charge is collected unless there is a stopover in DXB or separate tickets."
        ],
        cancellationRules: [
            "Cancelling SPEX / SPEQ is permitted up to 24 hours prior to departure.",
            "Refund is in the form of voucher.",
            "Agents must escalate cancellation request to Supervisor or Floor Support if applicable.",
            "Supervisor or Floor Support will send request to Reservations and voucher will be issued.",
            "Supervisors must override SSR for EK point-to-point bookings when required because charges may remain zero on SPRINT for EK connection and interline bookings."
        ],
        customerAdvice: [
            "Sporting equipment must be pre-booked when applicable.",
            "Passenger must arrive at least 2 hours before departure because additional handling is required.",
            "Go-show sporting equipment is subject to space and payload availability.",
            "Equipment must be securely packed.",
            "No dangerous goods should be packed inside sports equipment unless permitted by IATA DGR."
        ],
        note: "Always check dimensions, weight, number of equipment, itinerary type, route, and whether the booking is point-to-point, connecting, interline, or codeshare before collecting charges."
    },
    {
        id: "sporting-weapons-firearms",
        title: "Sporting Weapons / Firearms",
        icon: "shield-alert",
        category: "Restricted Sporting Equipment / Security Approval",
        ssr: ["WEAP", "SPEX"],
        keywords: [
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
            "licence",
            "license",
            "serial number"
        ],
        summary: "Process for carrying sporting weapons, firearms, or ammunition as checked baggage only, subject to documentation, security approval, Dubai Police approval, and applicable charges.",
        quickFacts: [
            "Firearms, sporting weapons, and ammunition can be carried as checked-in baggage only.",
            "Required documents must be provided at least 4 working days before travel.",
            "Sporting weapons require pre-authorization 96 hours before departure.",
            "WEAP charge: AED 300 per passenger.",
            "SPEX charge: AED 270 per passenger per segment.",
            "Ammunition maximum gross weight: 5 kg.",
            "Request is subject to security approval."
        ],
        timing: [
            "Sporting weapons must be pre-booked and pre-authorized at least 96 hours before departure.",
            "Required documents must be available at least 4 working days before date of travel.",
            "Approval turnaround time should be advised as 4 days prior to journey."
        ],
        charges: [
            "WEAP charge: AED 300 per passenger.",
            "SPEX charge: AED 270 per passenger per segment.",
            "WEAP charge is for permissions arranged with Dubai Police.",
            "WEAP charge applies per passenger.",
            "SPEX charge applies per passenger per segment where applicable.",
            "Example: 3 passengers travelling with weapons require 3 SSR WEAP charges.",
            "Example: If 3 passengers travel BSZ-DXB-BSZ with weapons, SPEX applies per passenger per segment."
        ],
        restrictions: [
            "Sporting weapons, firearms, and ammunition can be carried as checked-in baggage only.",
            "Weapons must be unloaded.",
            "Weapons must be declared during check-in.",
            "Maximum gross weight of ammunition must not exceed 5 kg.",
            "Ammunition must be packed in a sturdy box.",
            "Request is subject to security approval.",
            "Approval is valid only for the approved flight, date, and sector.",
            "A new approval is required if passenger changes date of travel.",
            "New charges apply if new approval is required."
        ],
        requiredDocuments: [
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
        ],
        agentProcessIfNotWritten: [
            "Inform the customer to email letstalk@flydubai.com with all required documents and details.",
            "Advise approval turnaround time.",
            "Advise cost per passenger: SSR WEAP AED 300 in addition to SSR SPEX AED 270 per passenger per segment.",
            "Inform customer that unloaded weapons must be declared during check-in.",
            "Inform customer that ammunition maximum gross weight must not exceed 5 kg.",
            "Inform customer that ammunition must be packed in a sturdy box.",
            "Inform customer that the request is subject to approval.",
            "Update SPRINT comments."
        ],
        agentProcessIfWritten: [
            "Retrieve case number from customer.",
            "Verify all required details and documents.",
            "Advise customer with maximum dimensions, packing requirements, and charges.",
            "Create and escalate case in Salesforce to Supervisor.",
            "Update SPRINT comments."
        ],
        supervisorProcess: [
            "Retrieve case number from customer.",
            "Verify all required details and documents.",
            "Create a follow-up request to Customer Service Group via Chatter titled firearms/ammunition so the case is picked up on priority.",
            "Update SPRINT comments."
        ],
        securityProcess: [
            "Request with all relevant documents must be forwarded to Security for necessary approval.",
            "Approval from Dubai Police authority must be obtained where required.",
            "Once approval from Security is received, Reservations Support keeps reminder to send advisory to Airports.",
            "Security informs NCC, Airport, and originator of the request after approval."
        ],
        interlineCodeshareRules: [
            "For interline or codeshare with EK bookings where origin is on OAL, ideally the OAL carrier handles the request.",
            "If the request comes to flydubai for approval, charges apply."
        ],
        customerAdvice: [
            "Customer must provide complete written documents before processing.",
            "Request is subject to security approval.",
            "Approval is valid only for the approved flight, date, and sector.",
            "New approval and new charges are required if travel date changes.",
            "Weapons must be unloaded and declared at check-in.",
            "Ammunition must not exceed 5 kg gross weight and must be properly packed."
        ],
        emails: [
            "letstalk@flydubai.com",
            "Security@flydubai.com"
        ],
        note: "Do not confirm sporting weapon, firearm, or ammunition carriage without written documents and security approval."
    }
];

window.specialServicesData = specialServicesData;
