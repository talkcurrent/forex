/**
 * Return a string of rounded value
 * @param {number} value - a number to round
 * @param {number} precision - a decimal point to round value to
 * 
 */
 const RoundTo = (value, precision) => {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: precision,      
        maximumFractionDigits: precision,
     });

     return formatter.format(value)
}

export default RoundTo
