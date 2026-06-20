const axios = require('axios');

const getBaseUrl = () => process.env.CRICAPI_BASE_URL || 'https://api.cricapi.com/v1';
const getApiKey = () => process.env.CRICAPI_KEY;

// Simple in-memory cache (replace with Redis in production)
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

const cachedGet = async (key, fetcher) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    try {
        const data = await fetcher();
        cache.set(key, { data, timestamp: Date.now() });
        return data;
    } catch (error) {
        console.error(`[CricAPI] Failed to fetch "${key}":`, error.message);
        // Return cached stale data if available, else empty
        return cached ? cached.data : [];
    }
};

const getLiveMatches = async () => {
    return cachedGet('live-matches', async () => {
        const { data } = await axios.get(`${getBaseUrl()}/currentMatches`, {
            params: { apikey: getApiKey(), offset: 0 },
        });
        return data.data || [];
    });
};

const getMatchById = async (matchId) => {
    return cachedGet(`match-${matchId}`, async () => {
        const { data } = await axios.get(`${getBaseUrl()}/match_info`, {
            params: { apikey: getApiKey(), id: matchId },
        });
        return data.data || null;
    });
};

const getUpcomingMatches = async () => {
    return cachedGet('upcoming-matches', async () => {
        const { data } = await axios.get(`${getBaseUrl()}/matches`, {
            params: { apikey: getApiKey(), offset: 0 },
        });
        return data.data || [];
    });
};

module.exports = { getLiveMatches, getMatchById, getUpcomingMatches };