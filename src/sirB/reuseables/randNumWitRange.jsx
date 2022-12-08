/**
 * Return a random number or float
 * @param {number} range - a maximum limit to shuffle between
 * @param {number} integer - number or float
 * 
 */
export const randNumWitRange = (range, integer) => {
    if (integer == "number") {
        return Math.floor(Math.random() * Math.floor(range));
    } else {
        return (Math.random() * range) + Math.floor(Math.random());
    }
};
