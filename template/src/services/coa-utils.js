/**
 * Sorts arrays of objects, alphabetically
 * Useful for sorting ienumerable returns from API
 * @param {array} arr Array of objects
 * @param {string} field Fieldname to sort by, defaults to 'name'
 */
 export function sortByName(arr, field, desc) {
    field = field ?? 'name';
    let sort = desc ? -1 : 1;
    return arr.sort((a, b) => a[field] < b[field] ? -sort: sort);
}
  
/**
 * Replaces an item in an array of objects, matches by attribute 'id'
 * Useful for pushing changes to a list of objects when one was updated
 * @param {array} arr Array of objects
 * @param {object} replacementItem Updated item, same id as item in array
 */
export function replaceById(arr, replacementItem) {
    let i = arr.findIndex((item) => item.id === replacementItem.id);
    arr.splice(i, 1, replacementItem);
    return [...arr];
}

/**
 * Removes an item in an array of objects, matched by attribute 'id'
 * Useful for when an item from a list is deleted
 * @param {array} arr Array of objects
 * @param {int} id id of object to remove
 */
export function removeById(arr, id) {
  let i = arr.findIndex((item) => item.id === id);
  arr.splice(i, 1);
  return [...arr];
}

/**
 * Takes string and formats it as a user-friendly date
 * @param {string} date Usually comes from database '2002-01-01T12:00:00'
 * @returns 
 */
export function dateToString(date) {
    if (!date) return;
    return (new Date(date)).toLocaleDateString().substring(0, 10)
}

/**
 * Takes date and returns database/sortable/iso date string
 * @param {Date} date Date object from new Date()
 * @returns 
 */
export function dateToISO(date) {
    if (!date) return;
    return (new Date(date)).toISOString().substring(0,10)
}

/**
 * Takes a date (optional) and returns object with {year, month, date}
 *
 * @export
 * @param {Date} date
 * @returns {year, month, date}
 */
export function datePieces(date) {
    if (!date) date = new Date();
    return { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() };
}

/**
 * Returns first and last day of month previous to current month
 *
 * @export
 * @returns [Date, Date]
 */
export function lastMonthStartEnd() {
    let d = new Date();
    let {year, month } = datePieces(d);
    return [new Date(year, month-1, 1), new Date(year, month, 0)];
}