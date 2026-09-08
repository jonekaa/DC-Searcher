// js/utils.js

/**
 * Parses duration strings like "2 hours 15 minutes" or "1 day 4 hours" into total minutes.
 */
const parseDurationToMinutes = (durationStr) => {
    if (!durationStr) return Infinity;
    let totalMinutes = 0;
    const dayMatch = durationStr.match(/(\d+)\s*(day|hari)/i);
    const hourMatch = durationStr.match(/(\d+)\s*(hour|jam|h)/i);
    const minMatch = durationStr.match(/(\d+)\s*(min|menit|m)/i);

    if (dayMatch) totalMinutes += parseInt(dayMatch[1], 10) * 24 * 60;
    if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60;
    if (minMatch) totalMinutes += parseInt(minMatch[1], 10);
    return totalMinutes;
};

/**
 * Flexible input parser for human time inputs:
 * Accepts: "04:30", "4:30", "4 jam 30 menit", "4h 30m", "2 jam", "45 menit", "4.5" (hours), "270" (minutes).
 */
const parseInputTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const trimmed = timeStr.trim().toLowerCase();
    if (!trimmed) return 0;

    // 1. Format HH:MM (e.g., 04:30, 4:30)
    if (trimmed.includes(":")) {
        const parts = trimmed.split(":");
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;
        return hours * 60 + minutes;
    }

    // 2. Format with words/letters (e.g., "4 jam 30 menit", "4h 30m", "2 jam", "90 menit")
    const hourMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:jam|hour|h)/i);
    const minMatch = trimmed.match(/(\d+)\s*(?:menit|min|m)/i);

    if (hourMatch || minMatch) {
        let total = 0;
        if (hourMatch) total += Math.round(parseFloat(hourMatch[1]) * 60);
        if (minMatch) total += parseInt(minMatch[1], 10);
        return total;
    }

    // 3. Decimal hours (e.g., "4.5" or "2.25")
    if (trimmed.includes(".") || trimmed.includes(",")) {
        const val = parseFloat(trimmed.replace(",", "."));
        if (!isNaN(val) && val > 0) {
            return Math.round(val * 60);
        }
    }

    // 4. Plain number: if <= 24, assume hours; if > 24, assume minutes
    const num = parseInt(trimmed, 10);
    if (!isNaN(num) && num > 0) {
        return num <= 24 ? num * 60 : num;
    }

    return 0;
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Calculates straight-line distance in kilometers using the Haversine formula.
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in KM
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
};

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
 * Debounce helper for input search.
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
