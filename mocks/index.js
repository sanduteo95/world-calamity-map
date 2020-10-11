const countries = require('node-countries')

const calamities = {
    'AD': 14,
    'AE': 54,
    'AF': -123,
    'AG': -10,
    'AI': 0,
    'AL': -53,
    'AM': -10,
    'AO': -51,
    'AQ': -20,
    'AR': -40,
    'AS': -19,
    'AT': -43,
    'AU': -80,
    'AW': 63,
    'AX': -16,
    'AZ': -14,
    'BA': -42,
    'BB': 14,
    'BD': -45,
    'BE': -30,
    'BF': -113,
    'BG': -102,
    'BH': -2,
    'BI': -74,
    'BJ': -7,
    'BL': 67,
    'BM': -23,
    'BN': 36,
    'BO': -50,
    'BQ': -12,
    'BR': -49,
    'BS': -6,
    'BT': 14,
    'BV': -11,
    'BW': -56,
    'BY': -108,
    'BZ': 15,
    'CA': 2,
    'CC': -17,
    'CD': -125,
    'CF': -51,
    'CG': -125,
    'CH': -3,
    'CI': -14,
    'CK': -3,
    'CL': -8,
    'CM': -127,
    'CN': -52,
    'CO': -115,
    'CR': 3,
    'CU': 4,
    'CV': -3,
    'CW': -15,
    'CX': -83,
    'CY': -5,
    'CZ': 11,
    'DE': -77,
    'DJ': -14,
    'DK': -19,
    'DM': 60,
    'DO': -31,
    'DZ': -49,
    'EC': -67,
    'EE': -14,
    'EG': -66,
    'EH': -62,
    'ER': -28,
    'ES': -30,
    'ET': -81,
    'FI': 4,
    'FJ': -11,
    'FK': -104,
    'FM': 2,
    'FO': 38,
    'FR': 19,
    'GA': -24,
    'GB': 39,
    'GD': 13,
    'GE': -58,
    'GF': 6,
    'GG': -22,
    'GH': -40,
    'GI': -2,
    'GL': -34,
    'GM': -54,
    'GN': -45,
    'GP': 20,
    'GQ': -6,
    'GR': -54,
    'GS': 36,
    'GT': -109,
    'GU': -15,
    'GW': -24,
    'GY': -44,
    'HK': -108,
    'HM': -23,
    'HN': -31,
    'HR': -2,
    'HT': -81,
    'HU': -3,
    'ID': -40,
    'IE': 38,
    'IL': -17,
    'IM': -62,
    'IN': -64,
    'IO': -32,
    'IQ': -108,
    'IR': -44,
    'IS': -20,
    'IT': -33,
    'JE': 25,
    'JM': -35,
    'JO': 3,
    'JP': -12,
    'KE': -39,
    'KG': -33,
    'KH': -5,
    'KI': 32,
    'KM': -25,
    'KN': 91,
    'KP': -32,
    'KR': -20,
    'KW': -47,
    'KY': -9,
    'KZ': -1,
    'LA': -9,
    'LB': -54,
    'LC': 15,
    'LI': 32,
    'LK': -55,
    'LR': -103,
    'LS': -62,
    'LT': -10,
    'LU': 9,
    'LV': -19,
    'LY': -101,
    'MA': -55,
    'MC': 18,
    'MD': 50,
    'ME': -24,
    'MF': 9,
    'MG': -25,
    'MH': -28,
    'MK': 6,
    'ML': -36,
    'MM': -83,
    'MN': -47,
    'MO': 8,
    'MP': -4,
    'MQ': -22,
    'MR': -15,
    'MS': 37,
    'MT': -1,
    'MU': -63,
    'MV': 45,
    'MW': 0,
    'MX': -109,
    'MY': -65,
    'MZ': -119,
    'NA': -24,
    'NC': -5,
    'NE': -109,
    'NF': -49,
    'NG': -54,
    'NI': -157,
    'NL': 5,
    'NO': -28,
    'NP': -37,
    'NR': -73,
    'NU': -18,
    'NZ': -38,
    'OM': -1,
    'PA': -39,
    'PE': -133,
    'PF': -32,
    'PG': -27,
    'PH': -83,
    'PK': -126,
    'PL': -35,
    'PM': 10,
    'PN': -32,
    'PR': -51,
    'PS': -19,
    'PT': 40,
    'PW': 31,
    'PY': -57,
    'QA': 34,
    'RE': 13,
    'RO': -39,
    'RS': -26,
    'RU': -1,
    'RW': -40,
    'SA': -26,
    'SB': 17,
    'SC': 50,
    'SD': -55,
    'SE': -39,
    'SG': 12,
    'SH': -13,
    'SI': 12,
    'SJ': -13,
    'SK': 1,
    'SL': -42,
    'SM': 55,
    'SN': 8,
    'SO': -98,
    'SR': 6,
    'SS': -62,
    'ST': 33,
    'SV': -75,
    'SX': 8,
    'SY': -73,
    'SZ': -1,
    'TC': 16,
    'TD': -54,
    'TF': -68,
    'TG': 7,
    'TH': -64,
    'TJ': 20,
    'TK': -1,
    'TL': -25,
    'TM': -20,
    'TN': -66,
    'TO': -20,
    'TR': -63,
    'TT': -23,
    'TV': 16,
    'TW': -43,
    'TZ': 56,
    'UA': -73,
    'UG': -73,
    'UM': 14,
    'US': 30,
    'UY': 37,
    'UZ': 45,
    'VA': -7,
    'VC': 39,
    'VE': -58,
    'VG': 8,
    'VI': 27,
    'VN': -27,
    'VU': 8,
    'WF': -40,
    'WS': -46,
    'YE': -144,
    'YT': -65,
    'ZA': -59,
    'ZM': 42,
    'ZW': -63
}
  

module.exports = name => {
    console.log('Getting stored calamity for country: ' + name)
    const countryCode = countries.getCountryByName(name).alpha2
    if (countryCode) {
        console.log('Country code: ' + countryCode)
        return calamities[countryCode]
    } else {
        return 0
    }
}