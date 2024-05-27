function sortAggregatedData(data) {
    const entries = Object.entries(data);

    entries.sort((a, b) => {
        if (a[1] === 0 && b[1] !== 0) {
            return 1;
        }
        if (a[1] !== 0 && b[1] === 0) {
            return -1;
        }
        if (a[1] === 0 && b[1] === 0) {
            return 0;
        }
        return a[1] - b[1];
    });


    return Object.fromEntries(entries);
}

module.exports = { sortAggregatedData };