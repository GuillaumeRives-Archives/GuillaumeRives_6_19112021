exports.removeFromArray = (array, item) => {
    if (array) {
        const indexToRemove = array.indexOf(item);
        if (indexToRemove > -1) {
            array.splice(indexToRemove, 1);
            return true;
        } else {
            return false;
        }
    }
}