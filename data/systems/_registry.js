// ============ SYSTEM REGISTRY ============
// Each system file calls registerSystem(id, data) to register itself.
// After all files load, app.js reads SYSTEMS_REGISTRY and builds groups.

const SYSTEMS_REGISTRY = {};
const SYSTEM_GROUPS_ALL = {}; // { "default": { "osr": [{id, order},...] }, "family": {...}, "genre": {...} }

function registerSystem(id, data) {
    SYSTEMS_REGISTRY[id] = data;
    var groups = data.groups || {};
    for (var scheme in groups) {
        if (!SYSTEM_GROUPS_ALL[scheme]) SYSTEM_GROUPS_ALL[scheme] = {};
        var key = groups[scheme].key;
        var order = groups[scheme].order != null ? groups[scheme].order : 999;
        if (!SYSTEM_GROUPS_ALL[scheme][key]) SYSTEM_GROUPS_ALL[scheme][key] = [];
        SYSTEM_GROUPS_ALL[scheme][key].push({ id: id, order: order });
    }
}
