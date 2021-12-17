let Validator = require('validatorjs');
const tequilaClient = require("../flightClient/tequilaClient");
const {Flight} = require("../database/models/create_flight_table");


async function searchFlightController(req, res) {
    let rules = {
        fly_from: 'required|string|size:3',
        fly_to: 'string|size:3',
        date_from: ['required', 'string', 'regex:/(0[1-9]|1[0-9]|2[0-9]|3[0-1])\\/(0[1-9]|1[0-2])\\/(20[0-9][0-9])/g'],
        date_to: ['required','string', 'regex:/(0[1-9]|1[0-9]|2[0-9]|3[0-1])\\/(0[1-9]|1[0-2])\\/(20[0-9][0-9])/g'],
        return_from: ['string', 'regex:/(0[1-9]|1[0-9]|2[0-9]|3[0-1])\\/(0[1-9]|1[0-2])\\/(20[0-9][0-9])/g'],
        return_to: ['string', 'regex:/(0[1-9]|1[0-9]|2[0-9]|3[0-1])\\/(0[1-9]|1[0-2])\\/(20[0-9][0-9])/g'],
        nights_in_dst_from: 'integer|min:0',
        nights_in_dst_to: 'integer|min:0',
        max_fly_duration: 'integer|min:0',
        flight_type: ['string', {'in':['round','oneway']}],
        one_for_city: 'integer|min:0',
        one_per_date: 'integer|min:0',
        adults: 'integer|min:0',
        children: 'integer|min:0',
        infants: 'integer|min:0',
        selected_cabins: ['string', {'in':['M','W','C','F']}],
        mix_with_cabins: ['string', {'in':['M','W','C','F']}],
        adult_hold_bag: ['string', 'regex:/([0-9],)*[0-9]/g'],
        adult_hand_bag: ['string', 'regex:/([0-9],)*[0-9]/g'],
        child_hold_bag: ['string', 'regex:/([0-9],)*[0-9]/g'],
        child_hand_bag: ['string', 'regex:/([0-9],)*[0-9]/g'],
        fly_days: 'string',
        ret_fly_days: 'string',
        ret_fly_days_type: ['string', {'in':['departure','arrival']}],
        only_working_days: 'boolean',
        only_weekends: 'boolean',
        partner_market: ['string', {'in':['en']}],
        curr: ['string', {'in':['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD',
                'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTC', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD',
                'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD',
                'EEK', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ',
                'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD',
                'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD',
                'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MTL', 'MUR', 'MVR',
                'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP',
                'PKR', 'PLN', 'PYG', 'QAR', 'QUN', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD',
                'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD',
                'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XOF', 'XPF',
                'YER', 'ZAR', 'ZMK', 'ZMW', 'ZWL']}
        ],
        locale: ['string', {'in': ['en-US']}],
        price_from: 'integer|min:0',
        price_to: 'integer|min:0',
        dtime_from: ['string', 'regex:/([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g'],
        dtime_to: ['string', 'regex:/([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g'],
        atime_from: ['string', 'regex:/([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g'],
        atime_to: ['string', 'regex:/([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g'],
        ret_dtime_from: ['string', 'regex:/([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g'],
        ret_dtime_to: ['string', 'regex:/([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g'],
        ret_atime_from: ['string', 'regex:/([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g'],
        ret_atime_to: ['string', 'regex:/([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g'],
        stopover_from: ['string', 'regex:/([0-9]*):[0-5][0-9]/g'],
        stopover_to: ['string', 'regex:/([0-9]*):[0-5][0-9]/g'],
        max_stopovers: 'integer|min:0',
        max_sector_stopovers: 'integer|min:0',
        conn_on_diff_airport: ['integer', {'in':[0,1]}],
        ret_from_diff_airport: ['integer', {'in':[0,1]}],
        ret_to_diff_airport: ['integer', {'in':[0,1]}],
        select_airlines: 'string',
        select_airlines_exclude: 'boolean',
        select_stop_airport: 'string',
        select_stop_airport_exclude: 'boolean',
        vehicle_type: ['string', {'in': ['aircraft', 'bus', 'train']}],
        sort: ['string', {'in': ['price', 'duration', 'quality', 'date']}],
        asc: ['integer', {'in': [0,1]}],
        limit: 'integer|min:200|max:1000'
    };
    const path = '/v2/search';
    const today = new Date();
    let validation = await new Validator(req.query, rules);
    if (validation.passes()) {

        // CONVERT DATE STRING IN DATE OBJECT
        let newDate = req.query.date_from.replace(/(\d+[/])(\d+[/])/, '$2$1');
        let dataFrom = new Date(newDate);
        let newDateTo = req.query.date_to.replace(/(\d+[/])(\d+[/])/, '$2$1');
        let dataTo = new Date(newDateTo);

        // CHECK DATA VALUE FROM DEPARTURE DATE AND RETURN DATE
        if (dataTo < dataFrom || dataFrom < today) {
            return res.sendStatus(400);
        } else {

            // CALL THE API CLIENT
            return tequilaClient(req.query, path).then(async resp => {
                if (resp.status === 200) {
                    let flightList = [];

                    // STORE ALL DATA IN places ARRAY
                    await resp.data.data.forEach(flight => {
                        flightList.push(new Flight(flight));
                    });

                    // SEND DATA TO FRONTEND
                    return res.json(flightList);
                } else {
                    return await res.sendStatus(500);
                }
            });
        }
    } else {
        return await res.sendStatus(400);
    }
}

module.exports = searchFlightController;