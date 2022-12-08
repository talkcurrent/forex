/**
 * Return a string of rounded value
 * @param {number} value - a number to round
 * @param {number} precision - a decimal point to round value to
 * @param {string} format - comma (,) to format thousand value 
 * or empty string or ignore to return string of numbers 
 * 
 */
 const RoundTo = (value, precision, format = "") => {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: precision,      
        maximumFractionDigits: precision,
     });

     return formatter.format(value).replace(',', format)
}

export default RoundTo
