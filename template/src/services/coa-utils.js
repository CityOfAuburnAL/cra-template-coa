/**
 * Sorts arrays of objects, alphabetically
 * Useful for sorting ienumerable returns from API
 * @param {array} arr Array of objects
 * @param {string} field Fieldname to sort by, defaults to 'name'
 */
export function sortByName(arr, field) {
    field = field ?? 'name';
    return arr.sort((a, b) => a[field] < b[field] ? -1: 1);
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