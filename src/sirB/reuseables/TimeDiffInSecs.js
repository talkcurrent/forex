/**
 * Return Time difference between two dates.
 * @param {Object} before - a date object e.g new Date("Tue Oct 18 2022 05:18 PM") 
 * @param {Object} now - a date object e.g new Date()
 * 
 */
const TimeDiffInSecs = (before, now = new Date()) => {
    let beforeDate = before
    if( typeof beforeDate === "string"){
        beforeDate = new Date(before)
    }
    return Math.floor((now - beforeDate) / 1000)
}

export default TimeDiffInSecs
