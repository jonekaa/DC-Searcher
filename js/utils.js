// js/utils.js

const parseDurationToMinutes = (durationStr) => {
    if (!durationStr) return Infinity;
    let totalMinutes = 0;
    const dayMatch = durationStr.match(/(\d+)\s*(day|hari)/i);
    const hourMatch = durationStr.match(/(\d+)\s*(hour|jam)/i);
    const minMatch = durationStr.match(/(\d+)\s*(min|menit)/i);

    if (dayMatch) totalMinutes += parseInt(dayMatch[1]) * 24 * 60;
    if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
    if (minMatch) totalMinutes += parseInt(minMatch[1]);
    return totalMinutes;
};

const parseInputTimeToMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(":")) return 0;
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    return hours * 60 + minutes;
};

const toRad = (deg) => deg * (Math.PI / 180);

// const haversineDistance = (lat1, lon1, lat2, lon2) => {
//    const R = 6371;
//    const dLat = toRad(lat2 - lat1);
//    const dLon = toRad(lon2 - lon1);
//    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * //Math.sin(dLon / 2);
//    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//    return R * c;
// };

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const getSuggestions = (query) => {
    const lowercasedQuery = query.toLowerCase();
    if (!lowercasedQuery) return [];
    return allFactories
        .filter(
            (factory) =>
                factory.name.toLowerCase().includes(lowercasedQuery) ||
                factory.loc.toLowerCase().includes(lowercasedQuery)
        )
        .slice(0, 10);
};

/**
 * Creates a debounced function that delays invoking func until after wait
 * milliseconds have elapsed since the last time the debounced function
 * was invoked.
 * @param {function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @returns {function} Returns the new debounced function.
 */
const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const context = this;

        const later = function () {
            timeout = null;
            func.apply(context, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
