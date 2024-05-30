/**
 * Maps debts to entities and sorts them.
 * @param {Array} entities - The list of entities (friends or groups).
 * @param {Object} debts - The corresponding debts for the entities.
 * @return {Array} - The sorted list of entities with their debts.
 * 
 */
function mapAndSortEntitiesWithDebts(entities, debts) {
    const entitiesWithDebts = entities.map(entity => ({
        ...entity,
        debt: debts[entity._id.toString()] || 0
    }));

    entitiesWithDebts.sort((a, b) => {
        if (a.debt === 0 && b.debt !== 0) {
            return 1;
        }
        if (a.debt !== 0 && b.debt === 0) {
            return -1;
        }
        return a.debt - b.debt;
    });

    return entitiesWithDebts;
}

module.exports = {
    mapAndSortEntitiesWithDebts
};
