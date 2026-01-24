// Financial Modeling Prep (FMP) API Client
// Fetches real financial data for StockMemo

class FMPClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://financialmodelingprep.com/stable';
    }

    /**
     * Fetch company profile
     */
    async getCompanyProfile(symbol) {
        try {
            const data = await this.fetch(`/profile/${symbol}`);
            return data && data[0] ? data[0] : null;
        } catch (error) {
            console.error('FMP Profile Error:', error);
            return null;
        }
    }

    /**
     * Fetch historical prices for 1Y, 3Y, 5Y
     */
    async getHistoricalPrices(symbol) {
        try {
            const data = await this.fetch(`/historical-price-full/${symbol}`);
            if (!data || !data.historical) return null;

            const prices = data.historical;
            const now = new Date();

            return {
                oneYear: this.filterPricesByPeriod(prices, 365),
                threeYear: this.filterPricesByPeriod(prices, 1095),
                fiveYear: this.filterPricesByPeriod(prices, 1825)
            };
        } catch (error) {
            console.error('FMP Historical Prices Error:', error);
            return null;
        }
    }

    /**
     * Fetch income statement (5 years)
     */
    async getIncomeStatement(symbol, limit = 5) {
        try {
            const data = await this.fetch(`/income-statement/${symbol}?limit=${limit}`);
            return data || [];
        } catch (error) {
            console.error('FMP Income Statement Error:', error);
            return [];
        }
    }

    /**
     * Fetch balance sheet (5 years)
     */
    async getBalanceSheet(symbol, limit = 5) {
        try {
            const data = await this.fetch(`/balance-sheet-statement/${symbol}?limit=${limit}`);
            return data || [];
        } catch (error) {
            console.error('FMP Balance Sheet Error:', error);
            return [];
        }
    }

    /**
     * Fetch cash flow (5 years)
     */
    async getCashFlow(symbol, limit = 5) {
        try {
            const data = await this.fetch(`/cash-flow-statement/${symbol}?limit=${limit}`);
            return data || [];
        } catch (error) {
            console.error('FMP Cash Flow Error:', error);
            return [];
        }
    }

    /**
     * Fetch financial ratios
     */
    async getFinancialRatios(symbol, limit = 5) {
        try {
            const data = await this.fetch(`/ratios/${symbol}?limit=${limit}`);
            return data || [];
        } catch (error) {
            console.error('FMP Ratios Error:', error);
            return [];
        }
    }

    /**
     * Fetch key metrics (P/E, etc.)
     */
    async getKeyMetrics(symbol, limit = 5) {
        try {
            const data = await this.fetch(`/key-metrics/${symbol}?limit=${limit}`);
            return data || [];
        } catch (error) {
            console.error('FMP Key Metrics Error:', error);
            return [];
        }
    }

    /**
     * Fetch enterprise value
     */
    async getEnterpriseValue(symbol, limit = 5) {
        try {
            const data = await this.fetch(`/enterprise-values/${symbol}?limit=${limit}`);
            return data || [];
        } catch (error) {
            console.error('FMP Enterprise Value Error:', error);
            return [];
        }
    }

    /**
     * Get all financial data for a company
     */
    async getAllFinancialData(symbol) {
        try {
            const [
                profile,
                prices,
                incomeStatement,
                balanceSheet,
                cashFlow,
                ratios,
                keyMetrics,
                enterpriseValue
            ] = await Promise.all([
                this.getCompanyProfile(symbol),
                this.getHistoricalPrices(symbol),
                this.getIncomeStatement(symbol),
                this.getBalanceSheet(symbol),
                this.getCashFlow(symbol),
                this.getFinancialRatios(symbol),
                this.getKeyMetrics(symbol),
                this.getEnterpriseValue(symbol)
            ]);

            return {
                profile,
                prices,
                incomeStatement,
                balanceSheet,
                cashFlow,
                ratios,
                keyMetrics,
                enterpriseValue
            };
        } catch (error) {
            console.error('FMP Get All Data Error:', error);
            return null;
        }
    }

    /**
     * Helper: Filter prices by period
     */
    filterPricesByPeriod(prices, days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const filtered = prices.filter(p => new Date(p.date) >= cutoffDate);
        if (filtered.length === 0) return null;

        const startPrice = filtered[filtered.length - 1].close;
        const endPrice = filtered[0].close;
        const change = ((endPrice - startPrice) / startPrice) * 100;

        // Calculate max drawdown
        let maxDrawdown = 0;
        let peak = filtered[0].close;

        for (const p of filtered) {
            if (p.close > peak) peak = p.close;
            const drawdown = ((p.close - peak) / peak) * 100;
            if (drawdown < maxDrawdown) maxDrawdown = drawdown;
        }

        // Calculate volatility (simplified)
        const returns = [];
        for (let i = 0; i < filtered.length - 1; i++) {
            const dailyReturn = (filtered[i].close - filtered[i + 1].close) / filtered[i + 1].close;
            returns.push(dailyReturn);
        }
        const volatility = this.calculateStdDev(returns) * Math.sqrt(252) * 100; // Annualized

        return {
            startPrice: startPrice.toFixed(2),
            endPrice: endPrice.toFixed(2),
            change: change.toFixed(2),
            maxDrawdown: maxDrawdown.toFixed(2),
            volatility: volatility.toFixed(2),
            dataPoints: filtered.length
        };
    }

    /**
     * Calculate standard deviation
     */
    calculateStdDev(values) {
        if (values.length === 0) return 0;
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }

    /**
     * Generic fetch with error handling
     */
    async fetch(endpoint) {
        const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${this.apiKey}`;

        let retries = 3;
        while (retries > 0) {
            try {
                const response = await fetch(url);

                if (response.status === 429) {
                    console.warn('FMP Rate limit hit, retrying...');
                    await this.sleep(1000);
                    retries--;
                    continue;
                }

                if (!response.ok) {
                    if (response.status === 404) return null;
                    throw new Error(`FMP API error: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                await this.sleep(500);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for serverless
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FMPClient;
}
