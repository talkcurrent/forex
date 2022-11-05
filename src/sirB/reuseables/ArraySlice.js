/**
 * Return a shallow copy of a portion of an array .
 * @param {string[]} array - a array containing items to slice 
 * @param {number} start - a positive or negative index
 * @param {number} [end] - a positive or negative index
 * 
 */
const ArraySlice = (array, start, end) => {
    if(typeof end !== 'undefined'){
        return array.slice(start, end);
    }else{
        return array.slice(start);
    }
}

export default ArraySlice
