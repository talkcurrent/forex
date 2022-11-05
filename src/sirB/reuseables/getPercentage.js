/**
 * return an array of votes percentage .
 * @param {Object[]} arr - List individual vote count 
 * 
 */
const getPercentage = (arr = []) => {
    //sum of all element in the array
    let elemSum = arr.reduce((a, b) => a + b, 0);

    if (!arr.length) return [];

    const allPercentages = arr.map((elem) =>{
        const percentage = (elem / elemSum) * 100;
        return Math.round(percentage);
    })
    
    return [...allPercentages];
}

export default getPercentage
