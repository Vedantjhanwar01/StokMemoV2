// Data formatting utilities for financial data display

function formatCurrency(value, currency = '₹', scale = 'Cr') {
    if (value === null || value === undefined) return 'Not disclosed';

    let num = parseFloat(value);
    if (isNaN(num)) return 'Not disclosed';

    // Convert to Crores (Indian) or Millions (US)
    if (scale === 'Cr') {
        num = num / 10000000; // Convert to Crores
    } else if (scale === 'M') {
        num = num / 1000000; // Convert to Millions
    }

    return `${currency}${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ${scale}`;
}

function formatPercent(value, decimals = 2) {
    if (value === null || value === undefined) return 'Not disclosed';

    const num = parseFloat(value);
    if (isNaN(num)) return 'Not disclosed';

    return `${num.toFixed(decimals)}%`;
}

function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined) return 'Not disclosed';

    const num = parseFloat(value);
    if (isNaN(num)) return 'Not disclosed';

    return num.toLocaleString('en-IN', { maximumFractionDigits: decimals });
}

function formatRatio(value, decimals = 2) {
    if (value === null || value === undefined) return 'Not disclosed';

    const num = parseFloat(value);
    if (isNaN(num)) return 'Not disclosed';

    return num.toFixed(decimals);
}

function formatDate(dateString) {
    if (!dateString) return 'Not disclosed';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
}

function formatYear(dateString) {
    if (!dateString) return 'Not disclosed';

    try {
        const date = new Date(dateString);
        return date.getFullYear().toString();
    } catch {
        return dateString;
    }
}

function safeValue(value, fallback = 'Not disclosed') {
    return (value !== null && value !== undefined && value !== '') ? value : fallback;
}

// Export for both browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatPercent,
        formatNumber,
        formatRatio,
        formatDate,
        formatYear,
        safeValue
    };
}
