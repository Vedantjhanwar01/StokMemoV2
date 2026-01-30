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

        // Try multiple endpoint formats (FMP API has changed endpoints over time)
        const endpoints = [
            '/historical-price-eod/full',
            '/historical-price-eod',
            '/historical-price-full/full'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`FMP: Trying historical prices endpoint: ${endpoint}`);
                const data = await this.fetch(endpoint, params);

                let prices = [];

                // Handle different response formats
                if (Array.isArray(data)) {
                    prices = data;
                } else if (data?.historical && Array.isArray(data.historical)) {
                    prices = data.historical;
                } else if (data && typeof data === 'object') {
                    // Try to find an array in the response
                    for (const key of Object.keys(data)) {
                        if (Array.isArray(data[key]) && data[key].length > 0) {
                            console.log(`FMP prices: found array in key '${key}'`);
                            prices = data[key];
                            break;
                        }
                    }
                }

                if (prices.length > 0) {
                    console.log(`FMP prices: SUCCESS - got ${prices.length} items from ${endpoint}`);
                    return prices;
                }

                console.log(`FMP prices: ${endpoint} returned empty, trying next...`);
            } catch (error) {
                console.warn(`FMP: ${endpoint} failed:`, error.message);
            }
        }

        console.warn('FMP prices: All endpoints returned empty or failed');
        return [];
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
    /**
     * Search companies by name/symbol - LIVE SEARCH
     * Returns up to 15 matching companies from any exchange
     */
    async searchCompanies(query, preferredExchange = null) {
        try {
            // Use v3 API for search (search endpoint most reliable)
            const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=30&apikey=${this.apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error('FMP Search Error:', response.status);
                return [];
            }

            let results = await response.json();

            if (!results || results.length === 0) {
                return [];
            }

            // Filter and prioritize results by exchange if specified
            if (preferredExchange && preferredExchange !== 'ANY') {
                const exchangeSuffixes = {
                    'NSE': '.NS',
                    'BSE': '.BO',
                    'NYSE': ['', null],
                    'NASDAQ': ['', null],
                    'LSE': '.L',
                    'TSX': '.TO',
                    'ASX': '.AX',
                    'HKEX': '.HK'
                };

                const suffix = exchangeSuffixes[preferredExchange];

                if (suffix) {
                    const matchingExchange = results.filter(r => {
                        if (Array.isArray(suffix)) {
                            return r.exchangeShortName === preferredExchange ||
                                r.exchangeShortName === 'NYSE' ||
                                r.exchangeShortName === 'NASDAQ';
                        }
                        return r.symbol.endsWith(suffix) || r.exchangeShortName === preferredExchange;
                    });

                    const others = results.filter(r => {
                        if (Array.isArray(suffix)) {
                            return r.exchangeShortName !== preferredExchange &&
                                r.exchangeShortName !== 'NYSE' &&
                                r.exchangeShortName !== 'NASDAQ';
                        }
                        return !r.symbol.endsWith(suffix) && r.exchangeShortName !== preferredExchange;
                    });

                    results = [...matchingExchange, ...others];
                }
            }

            // Return top 15 results with normalized format
            return results.slice(0, 15).map(r => ({
                name: r.name,
                symbol: r.symbol,
                exchange: r.exchangeShortName || r.stockExchange || 'Unknown',
                currency: this.getCurrencyByExchange(r.exchangeShortName || r.stockExchange)
            }));
        } catch (error) {
            console.error('FMP Search Error:', error);
            return [];
        }
    }

    /**
     * Resolve company name to exact symbol dynamically
     */
    async resolveSymbolDynamic(companyName, preferredExchange = null) {
        try {
            const results = await this.searchCompanies(companyName, preferredExchange);

            if (!results || results.length === 0) {
                return companyName.toUpperCase();
            }

            // Try exact name match first
            const normalized = companyName.toLowerCase().trim();
            const exactMatch = results.find(r =>
                r.name.toLowerCase().trim() === normalized ||
                r.symbol.toLowerCase().trim() === normalized
            );

            if (exactMatch) {
                return exactMatch.symbol;
            }

            return results[0].symbol;
        } catch (error) {
            console.error('Symbol Resolution Error:', error);
            return companyName.toUpperCase();
        }
    }

    /**
     * Get currency symbol based on exchange
     */
    getCurrencyByExchange(exchange) {
        const currencyMap = {
            // India
            'NSE': '₹', 'BSE': '₹', 'NSI': '₹',
            // US
            'NYSE': '$', 'NASDAQ': '$', 'AMEX': '$', 'NYSE ARCA': '$', 'BATS': '$',
            // UK
            'LSE': '£', 'LON': '£',
            // Europe
            'XETRA': '€', 'FRA': '€', 'PAR': '€', 'AMS': '€',
            // Canada
            'TSX': 'C$', 'TSXV': 'C$',
            // Australia
            'ASX': 'A$',
            // Asia
            'HKEX': 'HK$', 'HKG': 'HK$', 'SGX': 'S$', 'JPX': '¥', 'TSE': '¥'
        };
        return currencyMap[exchange] || '$';
    }
}

export default FMPClient;
