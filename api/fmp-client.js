// Financial Modeling Prep API Client
// Uses stable endpoints (August 2025+)

export class FMPClient {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('FMP API key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = 'https://financialmodelingprep.com/stable';
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

            const url = `${this.baseUrl}${endpoint}?${queryParams}`;

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`FMP API error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`FMP API call failed for ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Get company profile
     * Returns: Basic company info, sector, industry, market cap
     */
    async getProfile(symbol) {
        const data = await this.fetch('/profile', { symbol });
        return data && data.length > 0 ? data[0] : null;
    }

    /**
     * Get real-time stock quote
     * Returns: Current price, change, volume, 52-week high/low
     */
    async getQuote(symbol) {
        const data = await this.fetch('/quote', { symbol });
        return data && data.length > 0 ? data[0] : null;
    }

    /**
     * Get historical prices (End of Day)
     * Returns: Array of {date, open, high, low, close, volume}
     */
    async getHistoricalPrices(symbol, from = null, to = null) {
        const params = { symbol };
        if (from) params.from = from;
        if (to) params.to = to;

        const data = await this.fetch('/historical-price-eod/full', params);

        // API returns {symbol, historical: [...]}
        return data?.historical || [];
    }

    /**
     * Get income statements (up to 5 years)
     * Returns: Array of annual income statements
     */
    async getIncomeStatement(symbol, limit = 5) {
        const data = await this.fetch('/income-statement', {
            symbol,
            limit: limit.toString()
        });
        return data || [];
    }

    /**
     * Get balance sheet statements
     * Returns: Array of annual balance sheets
     */
    async getBalanceSheet(symbol, limit = 5) {
        const data = await this.fetch('/balance-sheet-statement', {
            symbol,
            limit: limit.toString()
        });
        return data || [];
    }

    /**
     * Get cash flow statements
     * Returns: Array of annual cash flows
     */
    async getCashFlow(symbol, limit = 5) {
        const data = await this.fetch('/cash-flow-statement', {
            symbol,
            limit: limit.toString()
        });
        return data || [];
    }

    /**
     * Get financial ratios
     * Returns: Array of annual ratios (ROE, debt-to-equity, etc.)
     */
    async getRatios(symbol, limit = 5) {
        const data = await this.fetch('/ratios', {
            symbol,
            limit: limit.toString()
        });
        return data || [];
    }

    /**
     * Get key metrics
     * Returns: Array of annual metrics (P/E, EPS, revenue per share, etc.)
     */
    async getKeyMetrics(symbol, limit = 5) {
        const data = await this.fetch('/key-metrics', {
            symbol,
            limit: limit.toString()
        });
        return data || [];
    }

    /**
     * Get all data for a symbol (convenience method)
     * Returns: Object with all financial data
     */
    async getAllData(symbol) {
        try {
            const [
                profile,
                quote,
                prices,
                incomeStatements,
                balanceSheets,
                cashFlows,
                ratios,
                keyMetrics
            ] = await Promise.all([
                this.getProfile(symbol),
                this.getQuote(symbol),
                this.getHistoricalPrices(symbol),
                this.getIncomeStatement(symbol, 5),
                this.getBalanceSheet(symbol, 5),
                this.getCashFlow(symbol, 5),
                this.getRatios(symbol, 5),
                this.getKeyMetrics(symbol, 5)
            ]);

            return {
                profile,
                quote,
                prices,
                statements: {
                    income: incomeStatements,
                    balance: balanceSheets,
                    cashFlow: cashFlows
                },
                ratios,
                keyMetrics
            };
        } catch (error) {
            console.error('FMP getAllData failed:', error);
            throw error;
        }
    }
}

export default FMPClient;
