// Financial Modeling Prep API Client
// Uses standard v3 endpoints for maximum reliability

export class FMPClient {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('FMP API key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = 'https://financialmodelingprep.com/api/v3';
    }

    /**
     * Generic fetch method with error handling
     */
    async fetch(endpoint, params = {}) {
        try {
            // Add API key to params
            const queryParams = new URLSearchParams({
                ...params,
                apikey: this.apiKey
            });

            // Handle path parameters vs query parameters
            const url = endpoint.includes('?')
                ? `${this.baseUrl}${endpoint}&${queryParams}`
                : `${this.baseUrl}${endpoint}?${queryParams}`;

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`FMP API warning (${response.status}) for ${endpoint}: ${errorText}`);
                return null;
            }

            const data = await response.json();

            // FMP sometimes returns error message in a success response
            if (data && data['Error Message']) {
                console.warn(`FMP API error message for ${endpoint}: ${data['Error Message']}`);
                return null;
            }

            return data;
        } catch (error) {
            console.error(`FMP API call failed for ${endpoint}:`, error);
            return null;
        }
    }

    /**
     * Get company profile
     */
    async getProfile(symbol) {
        const data = await this.fetch(`/profile/${symbol}`);
        return data && data.length > 0 ? data[0] : null;
    }

    /**
     * Get real-time stock quote
     */
    async getQuote(symbol) {
        const data = await this.fetch(`/quote/${symbol}`);
        return data && data.length > 0 ? data[0] : null;
    }

    /**
     * Get historical prices
     */
    async getHistoricalPrices(symbol, from = null, to = null) {
        const params = {};
        if (from) params.from = from;
        if (to) params.to = to;

        const data = await this.fetch(`/historical-price-full/${symbol}`, params);
        return data && data.historical ? data.historical : [];
    }

    /**
     * Financial statements
     */
    async getIncomeStatement(symbol, limit = 5) {
        const data = await this.fetch(`/income-statement/${symbol}`, { limit });
        return data || [];
    }

    async getBalanceSheet(symbol, limit = 5) {
        const data = await this.fetch(`/balance-sheet-statement/${symbol}`, { limit });
        return data || [];
    }

    async getCashFlow(symbol, limit = 5) {
        const data = await this.fetch(`/cash-flow-statement/${symbol}`, { limit });
        return data || [];
    }

    /**
     * Ratios and Metrics
     */
    async getRatios(symbol, limit = 5) {
        const data = await this.fetch(`/ratios/${symbol}`, { limit });
        return data || [];
    }

    async getKeyMetrics(symbol, limit = 5) {
        const data = await this.fetch(`/key-metrics/${symbol}`, { limit });
        return data || [];
    }

    /**
     * Get all data for a symbol (RESILIENT VERSION)
     */
    async getAllData(symbol) {
        try {
            console.log(`FMP: Starting data fetch for ${symbol}`);

            // Profile and Quote are base data
            const [profile, quote] = await Promise.all([
                this.getProfile(symbol),
                this.getQuote(symbol)
            ]);

            // Optional data points - failure in one shouldn't kill the dashboard
            const [
                prices,
                incomeStatements,
                balanceSheets,
                cashFlows,
                ratios,
                keyMetrics
            ] = await Promise.all([
                this.getHistoricalPrices(symbol).catch(() => []),
                this.getIncomeStatement(symbol, 5).catch(() => []),
                this.getBalanceSheet(symbol, 5).catch(() => []),
                this.getCashFlow(symbol, 5).catch(() => []),
                this.getRatios(symbol, 5).catch(() => []),
                this.getKeyMetrics(symbol, 5).catch(() => [])
            ]);

            return {
                profile: profile || {},
                quote: quote || { symbol, price: 0 },
                prices: prices || [],
                statements: {
                    income: incomeStatements || [],
                    balance: balanceSheets || [],
                    cashFlow: cashFlows || []
                },
                ratios: ratios || [],
                keyMetrics: keyMetrics || []
            };
        } catch (error) {
            console.error('FMP: Detailed fetch failed:', error);
            // Fallback object to prevent frontend crash
            return {
                profile: {},
                quote: { symbol, price: 0 },
                prices: [],
                statements: { income: [], balance: [], cashFlow: [] },
                ratios: [],
                keyMetrics: []
            };
        }
    }

    /**
     * Search and Resolve
     */
    async searchCompanies(query, preferredExchange = null) {
        try {
            const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=30&apikey=${this.apiKey}`;
            const response = await fetch(url);
            if (!response.ok) return [];
            let results = await response.json();
            if (!results || results.length === 0) return [];

            return results.slice(0, 15).map(r => ({
                name: r.name,
                symbol: r.symbol,
                exchange: r.exchangeShortName || r.stockExchange || 'Unknown',
                currency: this.getCurrencyByExchange(r.exchangeShortName || r.stockExchange)
            }));
        } catch (error) {
            return [];
        }
    }

    async resolveSymbolDynamic(companyName, preferredExchange = null) {
        try {
            const results = await this.searchCompanies(companyName, preferredExchange);
            if (!results || results.length === 0) return companyName.toUpperCase();

            const normalized = companyName.toLowerCase().trim();
            const exactMatch = results.find(r =>
                r.name.toLowerCase().trim() === normalized ||
                r.symbol.toLowerCase().trim() === normalized
            );

            if (exactMatch) return exactMatch.symbol;
            return results[0].symbol;
        } catch (error) {
            return companyName.toUpperCase();
        }
    }

    getCurrencyByExchange(exchange) {
        const currencyMap = {
            'NSE': '₹', 'BSE': '₹', 'NSI': '₹',
            'NYSE': '$', 'NASDAQ': '$', 'AMEX': '$',
            'LSE': '£', 'LON': '£',
            'XETRA': '€', 'FRA': '€', 'PAR': '€',
            'TSX': 'C$', 'ASX': 'A$',
            'HKEX': 'HK$', 'JPX': '¥'
        };
        return currencyMap[exchange] || '$';
    }
}

export default FMPClient;
