export const Patterns = {
    // Email:`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`,
    Email: `[a-zA-Z0-9._%+-]{1,}@[a-zA-Z0-9.-]{2,}[.]{1}[a-zA-Z]{2,}$`,
    OnlyArabicLetters: `^[\u0600-\u06FF\s 0-9]+$`,
    OnlyEnglishLetters: `^[A-Za-z\s]+$`,
    OnlyNumbers: `^[0-9]*$`,
    NationalID: `[0-9]{14}`,
    PhoneMobile: `(01)[0-9]{9}`,
    DateMMDDYYYY: `^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$`,
    DateDDMMYYYY: `^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$`,
    Decimal: `^\d*\.\d{1,4}$`,
    NoNumber: '([^0-9]*)',
    FLOATINGNUMBER: "[0-9]?([0-9]*[.])?[0-9]+",
    // PHONE:"(050)[0-9]{7}"
    
}

