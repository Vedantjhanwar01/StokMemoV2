// Data formatting utilities for financial data

/**
 * Format currency values with proper symbol and thousands separator
 */
export function formatCurrency(value, currency = 'USD') {
    if (value === null || value === undefined) return 'Not disclosed';

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    // Format large numbers with B/M/K suffix
    if (absValue >= 1e9) {
        return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
        return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
    } else if (absValue >= 1e3) {
        return `${sign}$${(absValue / 1e3).toFixed(2)}K`;
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage values
 */
export function formatPercent(value, decimals = 2) {
    if (value === null || value === undefined) return 'Not disclosed';
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K/M/B suffix
 */
export function formatNumber(value) {
    if (value === null || value === undefined) return 'Not disclosed';

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1e9) {
        return `${sign}${(absValue / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
        return `${sign}${(absValue / 1e6).toFixed(2)}M`;
    } else if (absValue >= 1e3) {
        return `${sign}${(absValue / 1e3).toFixed(2)}K`;
    }

    return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format date strings
 */
export function formatDate(dateString) {
    if (!dateString) return 'Not disclosed';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format ratio values (e.g., P/E ratio)
 */
export function formatRatio(value, decimals = 2) {
    if (value === null || value === undefined) return 'Not disclosed';
    if (!isFinite(value)) return 'N/A';
    return value.toFixed(decimals);
}
