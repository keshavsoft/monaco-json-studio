export function requireObject(value, location) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new TypeError(`${location} must be an object.`);
    }
    return value;
}

export function requireText(value, location, fallback) {
    const result = value === undefined ? fallback : value;
    if (typeof result !== 'string' || result.trim() === '') {
        throw new TypeError(`${location} must be a non-empty string.`);
    }
    return result.trim();
}

export function jsonText(value, location) {
    try {
        const result = JSON.stringify(value, null, 2);
        if (result === undefined) throw new TypeError('value is not JSON serializable');
        return result;
    } catch (error) {
        throw new TypeError(`${location} must be JSON serializable: ${error.message}`);
    }
}

export function requireFetchUrl(value, location, fallback) {
    return requireText(value, location, fallback);
}

export function isGeneratedDataFetchUrl(fetchUrl) {
    return /^\.\/data\/[A-Za-z0-9][A-Za-z0-9._-]*\.json$/i.test(fetchUrl);
}
