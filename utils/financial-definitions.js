// Financial Definitions Database
// Educational tooltips for every financial term

export const financialDefinitions = {
    // ============================================
    // VALUATION METRICS
    // ============================================
    'pe_ratio': {
        name: 'P/E Ratio',
        fullName: 'Price-to-Earnings Ratio',
        category: 'Valuation',
        definition: 'Shows how much investors pay for each dollar of earnings. A higher P/E suggests investors expect higher growth.',
        formula: 'Stock Price ÷ Earnings Per Share',
        interpretation: {
            good: 'Below industry average may indicate undervaluation',
            warning: 'Very high P/E (>50) may signal overvaluation or high growth expectations',
            context: 'Compare within same industry; tech typically has higher P/E than utilities'
        },
        example: 'If stock is $100 and EPS is $5, P/E = 20x'
    },

    'pb_ratio': {
        name: 'P/B Ratio',
        fullName: 'Price-to-Book Ratio',
        category: 'Valuation',
        definition: 'Compares stock price to the company\'s net asset value. Shows if you\'re paying more than the company\'s "worth" on paper.',
        formula: 'Stock Price ÷ Book Value Per Share',
        interpretation: {
            good: 'P/B < 1 may indicate stock is undervalued',
            warning: 'Very high P/B (>5) suggests premium pricing or intangible value',
            context: 'Banks and insurers typically trade close to book value'
        },
        example: 'If stock is $50 and book value is $25, P/B = 2x'
    },

    'ps_ratio': {
        name: 'P/S Ratio',
        fullName: 'Price-to-Sales Ratio',
        category: 'Valuation',
        definition: 'Measures how much investors pay for each dollar of revenue. Useful for companies not yet profitable.',
        formula: 'Market Cap ÷ Total Revenue',
        interpretation: {
            good: 'P/S < 1 may indicate undervaluation',
            warning: 'P/S > 10 is very aggressive pricing',
            context: 'Useful for comparing high-growth, unprofitable companies'
        },
        example: 'If market cap is $1B and revenue is $500M, P/S = 2x'
    },

    'ev_ebitda': {
        name: 'EV/EBITDA',
        fullName: 'Enterprise Value to EBITDA',
        category: 'Valuation',
        definition: 'Values the entire company (including debt) relative to operating earnings. Better for comparing companies with different debt levels.',
        formula: '(Market Cap + Debt - Cash) ÷ EBITDA',
        interpretation: {
            good: 'EV/EBITDA 8-12x is typical for mature companies',
            warning: 'EV/EBITDA > 20x suggests premium valuation',
            context: 'Removes effects of interest, taxes, and depreciation'
        },
        example: 'If EV is $10B and EBITDA is $1B, EV/EBITDA = 10x'
    },

    'market_cap': {
        name: 'Market Cap',
        fullName: 'Market Capitalization',
        category: 'Valuation',
        definition: 'Total market value of all outstanding shares. Represents "size" of a company in market terms.',
        formula: 'Stock Price × Total Shares Outstanding',
        interpretation: {
            good: 'Large cap (>$10B) = more stable; Small cap (<$2B) = more volatile',
            warning: 'Market cap can be inflated during bubbles',
            context: 'Mega cap: >$200B, Large: $10-200B, Mid: $2-10B, Small: <$2B'
        },
        example: 'Apple at $3T market cap = largest public company'
    },

    // ============================================
    // PROFITABILITY METRICS
    // ============================================
    'roe': {
        name: 'ROE',
        fullName: 'Return on Equity',
        category: 'Profitability',
        definition: 'Shows how efficiently a company generates profits from shareholders\' money. Higher = better use of equity.',
        formula: '(Net Income ÷ Shareholders\' Equity) × 100%',
        interpretation: {
            good: 'ROE > 15% is generally considered strong',
            warning: 'ROE > 40% — verify if debt is inflating returns',
            context: 'Can be artificially high if company has lots of debt'
        },
        example: 'If net income is $10M and equity is $50M, ROE = 20%'
    },

    'roa': {
        name: 'ROA',
        fullName: 'Return on Assets',
        category: 'Profitability',
        definition: 'Measures how efficiently a company uses ALL its assets to generate profit. Independent of capital structure.',
        formula: '(Net Income ÷ Total Assets) × 100%',
        interpretation: {
            good: 'ROA > 5% is decent; > 10% is excellent',
            warning: 'Very low ROA (<2%) suggests poor asset utilization',
            context: 'Asset-heavy industries (utilities) have lower ROA than tech'
        },
        example: 'If net income is $5M and assets are $100M, ROA = 5%'
    },

    'roic': {
        name: 'ROIC',
        fullName: 'Return on Invested Capital',
        category: 'Profitability',
        definition: 'Shows return generated by all capital invested (debt + equity). Best measure of true business efficiency.',
        formula: 'NOPAT ÷ (Debt + Equity - Cash)',
        interpretation: {
            good: 'ROIC > 10% indicates value creation',
            warning: 'ROIC < cost of capital = destroying value',
            context: 'Compare to WACC (cost of capital) for true picture'
        },
        example: 'If NOPAT is $20M and invested capital is $100M, ROIC = 20%'
    },

    'gross_margin': {
        name: 'Gross Margin',
        fullName: 'Gross Profit Margin',
        category: 'Profitability',
        definition: 'Percentage of revenue left after direct production costs. Shows basic profitability of products/services.',
        formula: '((Revenue - COGS) ÷ Revenue) × 100%',
        interpretation: {
            good: '> 40% is strong for most industries',
            warning: '< 20% indicates commodity-like business',
            context: 'Software: 70-90%, Retail: 20-40%, Manufacturing: 30-50%'
        },
        example: 'If revenue is $1M and COGS is $600K, gross margin = 40%'
    },

    'operating_margin': {
        name: 'Operating Margin',
        fullName: 'Operating Profit Margin',
        category: 'Profitability',
        definition: 'Percentage of revenue remaining after ALL operating expenses. Shows efficiency of core business operations.',
        formula: '(Operating Income ÷ Revenue) × 100%',
        interpretation: {
            good: '> 15% is strong for most industries',
            warning: '< 5% indicates thin margins, less room for error',
            context: 'Excludes interest and taxes, focuses on operations'
        },
        example: 'If operating income is $200K on $1M revenue = 20%'
    },

    'net_margin': {
        name: 'Net Margin',
        fullName: 'Net Profit Margin',
        category: 'Profitability',
        definition: 'Percentage of revenue that becomes actual profit. The "bottom line" profitability measure.',
        formula: '(Net Income ÷ Revenue) × 100%',
        interpretation: {
            good: '> 10% is generally healthy',
            warning: '< 3% leaves little room for adverse events',
            context: 'After ALL costs including taxes and interest'
        },
        example: 'If net income is $100K on $1M revenue = 10%'
    },

    'ebitda': {
        name: 'EBITDA',
        fullName: 'Earnings Before Interest, Taxes, Depreciation & Amortization',
        category: 'Profitability',
        definition: 'Operating profit before non-cash charges. Shows cash-generating ability of core business.',
        formula: 'Net Income + Interest + Taxes + Depreciation + Amortization',
        interpretation: {
            good: 'Positive and growing EBITDA is healthy sign',
            warning: 'Can mask capital-intensive nature of business',
            context: 'Useful for comparing companies with different structures'
        },
        example: 'Removes accounting tweaks to show raw earning power'
    },

    'eps': {
        name: 'EPS',
        fullName: 'Earnings Per Share',
        category: 'Profitability',
        definition: 'Profit attributable to each share of stock. Fundamental measure of per-share profitability.',
        formula: 'Net Income ÷ Outstanding Shares',
        interpretation: {
            good: 'Growing EPS year-over-year is positive',
            warning: 'Can be manipulated via buybacks',
            context: 'Use diluted EPS for conservative view'
        },
        example: 'If profit is $100M and 50M shares, EPS = $2.00'
    },

    // ============================================
    // LIQUIDITY METRICS
    // ============================================
    'current_ratio': {
        name: 'Current Ratio',
        fullName: 'Current Ratio',
        category: 'Liquidity',
        definition: 'Measures ability to pay short-term debts with short-term assets. Can the company pay its bills?',
        formula: 'Current Assets ÷ Current Liabilities',
        interpretation: {
            good: '1.5 to 2.5 is ideal for most companies',
            warning: '< 1.0 may signal liquidity problems',
            context: '> 3.0 might mean inefficient use of assets'
        },
        example: 'If current assets = $2M and liabilities = $1M, ratio = 2.0'
    },

    'quick_ratio': {
        name: 'Quick Ratio',
        fullName: 'Quick Ratio (Acid Test)',
        category: 'Liquidity',
        definition: 'Stricter liquidity test — excludes inventory (which may be hard to sell quickly).',
        formula: '(Current Assets - Inventory) ÷ Current Liabilities',
        interpretation: {
            good: '> 1.0 means company can cover debts without selling inventory',
            warning: '< 0.5 signals potential cash crunch',
            context: 'More stringent than current ratio'
        },
        example: 'Excludes slow-moving inventory from calculation'
    },

    'cash_ratio': {
        name: 'Cash Ratio',
        fullName: 'Cash Ratio',
        category: 'Liquidity',
        definition: 'Most conservative liquidity measure — only cash and equivalents vs short-term debts.',
        formula: '(Cash + Cash Equivalents) ÷ Current Liabilities',
        interpretation: {
            good: '> 0.5 shows strong cash position',
            warning: '< 0.2 may indicate cash management issues',
            context: 'Too high might mean missed investment opportunities'
        },
        example: 'Shows immediate ability to pay without selling anything'
    },

    // ============================================
    // SOLVENCY / LEVERAGE METRICS
    // ============================================
    'debt_equity': {
        name: 'D/E Ratio',
        fullName: 'Debt-to-Equity Ratio',
        category: 'Solvency',
        definition: 'Shows how much debt a company uses relative to shareholder equity. Higher = more leverage.',
        formula: 'Total Debt ÷ Shareholders\' Equity',
        interpretation: {
            good: '< 1.0 generally indicates conservative financing',
            warning: '> 2.0 signals high financial risk',
            context: 'Capital-intensive industries typically have higher D/E'
        },
        example: 'If debt is $50M and equity is $100M, D/E = 0.5'
    },

    'debt_assets': {
        name: 'Debt/Assets',
        fullName: 'Debt-to-Assets Ratio',
        category: 'Solvency',
        definition: 'Percentage of assets financed by debt. Shows overall leverage on the balance sheet.',
        formula: 'Total Debt ÷ Total Assets',
        interpretation: {
            good: '< 50% is generally conservative',
            warning: '> 70% indicates aggressive debt usage',
            context: 'Real estate and utilities often have higher ratios'
        },
        example: 'If debt is $60M and assets are $100M, ratio = 60%'
    },

    'interest_coverage': {
        name: 'Interest Coverage',
        fullName: 'Interest Coverage Ratio',
        category: 'Solvency',
        definition: 'How many times earnings can cover interest payments. Can the company afford its debt?',
        formula: 'EBIT ÷ Interest Expense',
        interpretation: {
            good: '> 5x provides comfortable margin',
            warning: '< 2x signals potential payment issues',
            context: 'Below 1.5x is often concerning to lenders'
        },
        example: 'If EBIT is $10M and interest is $2M, coverage = 5x'
    },

    // ============================================
    // EFFICIENCY METRICS
    // ============================================
    'asset_turnover': {
        name: 'Asset Turnover',
        fullName: 'Total Asset Turnover',
        category: 'Efficiency',
        definition: 'How efficiently a company uses its assets to generate revenue.',
        formula: 'Revenue ÷ Average Total Assets',
        interpretation: {
            good: 'Higher = more efficient use of assets',
            warning: 'Very low (<0.5) may indicate underutilized assets',
            context: 'Retailers have high turnover; utilities have low'
        },
        example: 'If revenue is $100M and assets are $50M, turnover = 2x'
    },

    'inventory_turnover': {
        name: 'Inventory Turnover',
        fullName: 'Inventory Turnover Ratio',
        category: 'Efficiency',
        definition: 'How many times inventory is sold and replaced in a period. Shows inventory management efficiency.',
        formula: 'Cost of Goods Sold ÷ Average Inventory',
        interpretation: {
            good: 'Higher = faster-moving inventory',
            warning: 'Too high might mean stockouts; too low = excess',
            context: 'Grocery: 12-15x; Auto: 4-6x; Luxury: 2-4x'
        },
        example: 'If COGS is $1M and inventory is $100K, turnover = 10x'
    },

    'receivables_turnover': {
        name: 'Receivables Turnover',
        fullName: 'Accounts Receivable Turnover',
        category: 'Efficiency',
        definition: 'How quickly a company collects cash from customers. Higher = faster collection.',
        formula: 'Net Credit Sales ÷ Average Accounts Receivable',
        interpretation: {
            good: 'Higher indicates effective collection',
            warning: 'Declining turnover may signal collection issues',
            context: 'B2B typically lower than B2C'
        },
        example: 'Turnover of 12 = collecting every 30 days on average'
    },

    // ============================================
    // GROWTH METRICS
    // ============================================
    'revenue_growth': {
        name: 'Revenue Growth',
        fullName: 'Year-over-Year Revenue Growth',
        category: 'Growth',
        definition: 'Percentage increase in revenue compared to prior year. Shows top-line growth.',
        formula: '((Current Revenue - Prior Revenue) ÷ Prior Revenue) × 100%',
        interpretation: {
            good: '> 10% is strong for mature companies',
            warning: 'Negative growth may signal market share loss',
            context: 'High-growth startups may show 50-100%+ growth'
        },
        example: 'If revenue grew from $80M to $100M, growth = 25%'
    },

    'earnings_growth': {
        name: 'EPS Growth',
        fullName: 'Earnings Per Share Growth',
        category: 'Growth',
        definition: 'Percentage increase in EPS compared to prior year. Shows profit growth.',
        formula: '((Current EPS - Prior EPS) ÷ Prior EPS) × 100%',
        interpretation: {
            good: 'Consistent double-digit growth is excellent',
            warning: 'Declining EPS may concern investors',
            context: 'More sustainable if driven by revenue, not buybacks'
        },
        example: 'If EPS grew from $2 to $2.40, growth = 20%'
    },

    'book_value_growth': {
        name: 'Book Value Growth',
        fullName: 'Book Value Per Share Growth',
        category: 'Growth',
        definition: 'How fast intrinsic value per share is growing. Warren Buffett\'s favorite metric.',
        formula: '((Current BVPS - Prior BVPS) ÷ Prior BVPS) × 100%',
        interpretation: {
            good: 'Consistent growth shows wealth accumulation',
            warning: 'Declining book value may signal problems',
            context: 'Should ideally outpace inflation'
        },
        example: 'If BVPS grew from $20 to $24, growth = 20%'
    },

    // ============================================
    // DIVIDEND METRICS
    // ============================================
    'dividend_yield': {
        name: 'Dividend Yield',
        fullName: 'Dividend Yield',
        category: 'Dividends',
        definition: 'Annual dividend as a percentage of stock price. Return from dividends alone.',
        formula: '(Annual Dividend Per Share ÷ Stock Price) × 100%',
        interpretation: {
            good: '2-4% is healthy for income investors',
            warning: '> 8% may be unsustainable (check payout ratio)',
            context: 'Growth stocks often have 0% yield'
        },
        example: 'If annual dividend is $2 and price is $50, yield = 4%'
    },

    'payout_ratio': {
        name: 'Payout Ratio',
        fullName: 'Dividend Payout Ratio',
        category: 'Dividends',
        definition: 'Percentage of earnings paid as dividends. Shows dividend sustainability.',
        formula: '(Dividends Per Share ÷ EPS) × 100%',
        interpretation: {
            good: '30-60% is typically sustainable',
            warning: '> 80% leaves little room for earnings dips',
            context: '> 100% means paying more than earned (unsustainable)'
        },
        example: 'If dividend is $1 and EPS is $2, payout = 50%'
    },

    // ============================================
    // PRICE/MARKET METRICS
    // ============================================
    'price': {
        name: 'Stock Price',
        fullName: 'Current Stock Price',
        category: 'Market',
        definition: 'Current trading price of one share. Determined by supply and demand in the market.',
        formula: 'Last traded price on exchange',
        interpretation: {
            good: 'Price alone means nothing — look at valuation ratios',
            warning: '$1 stock isn\'t "cheaper" than $1000 stock',
            context: 'Compare market cap, not price, for relative value'
        },
        example: 'A $500 stock can be cheaper than a $5 stock (Berkshire vs penny stock)'
    },

    'volume': {
        name: 'Volume',
        fullName: 'Trading Volume',
        category: 'Market',
        definition: 'Number of shares traded in a period. Shows liquidity and investor interest.',
        formula: 'Total shares bought/sold during period',
        interpretation: {
            good: 'Higher volume = easier to buy/sell without price impact',
            warning: 'Low volume stocks may have wide bid-ask spreads',
            context: 'Unusual volume can signal upcoming news'
        },
        example: '50M daily volume = very liquid; 10K = very illiquid'
    },

    '52_week_high': {
        name: '52-Week High',
        fullName: '52-Week High Price',
        category: 'Market',
        definition: 'Highest price the stock traded at in the past year.',
        formula: 'Maximum closing price over past 252 trading days',
        interpretation: {
            good: 'Trading near highs may indicate momentum',
            warning: 'Buying at highs carries more risk of pullback',
            context: 'Breaking to new highs can be bullish signal'
        },
        example: 'Helps visualize where stock has been'
    },

    '52_week_low': {
        name: '52-Week Low',
        fullName: '52-Week Low Price',
        category: 'Market',
        definition: 'Lowest price the stock traded at in the past year.',
        formula: 'Minimum closing price over past 252 trading days',
        interpretation: {
            good: 'May represent value opportunity if fundamentals strong',
            warning: 'Falling knife — could go lower',
            context: 'Stocks near lows often have negat sentiment'
        },
        example: 'Helps visualize downside experienced'
    },

    // ============================================
    // CASH FLOW METRICS
    // ============================================
    'free_cash_flow': {
        name: 'FCF',
        fullName: 'Free Cash Flow',
        category: 'Cash Flow',
        definition: 'Cash left after maintaining/expanding assets. Real cash available for dividends, buybacks, or acquisitions.',
        formula: 'Operating Cash Flow − Capital Expenditures',
        interpretation: {
            good: 'Positive and growing FCF is excellent',
            warning: 'Negative FCF means company is burning cash',
            context: 'More reliable than net income (harder to manipulate)'
        },
        example: 'If OpCF is $50M and CapEx is $20M, FCF = $30M'
    },

    'operating_cash_flow': {
        name: 'Operating Cash Flow',
        fullName: 'Cash Flow from Operations',
        category: 'Cash Flow',
        definition: 'Cash generated from core business operations. Shows if business actually generates cash.',
        formula: 'Net Income + Non-cash charges + Working Capital Changes',
        interpretation: {
            good: 'Should be positive and exceed net income',
            warning: 'Consistently below net income = earnings quality issue',
            context: 'More reliable than accounting earnings'
        },
        example: 'The real cash coming in from selling products/services'
    },

    'fcf_yield': {
        name: 'FCF Yield',
        fullName: 'Free Cash Flow Yield',
        category: 'Cash Flow',
        definition: 'Free cash flow as percentage of market cap. Value investors love this metric.',
        formula: '(Free Cash Flow ÷ Market Cap) × 100%',
        interpretation: {
            good: '> 5% is attractive for value investors',
            warning: '< 1% means paying premium for cash generation',
            context: 'Compare to bond yields for perspective'
        },
        example: 'If FCF is $5B and market cap is $100B, yield = 5%'
    }
};

// Category groupings for organized display
export const metricCategories = {
    'Valuation': {
        icon: '💰',
        description: 'Is the stock cheap or expensive?',
        metrics: ['pe_ratio', 'pb_ratio', 'ps_ratio', 'ev_ebitda', 'market_cap']
    },
    'Profitability': {
        icon: '📈',
        description: 'How profitable is the company?',
        metrics: ['roe', 'roa', 'roic', 'gross_margin', 'operating_margin', 'net_margin', 'ebitda', 'eps']
    },
    'Liquidity': {
        icon: '💧',
        description: 'Can it pay short-term bills?',
        metrics: ['current_ratio', 'quick_ratio', 'cash_ratio']
    },
    'Solvency': {
        icon: '🏦',
        description: 'Is it over-leveraged with debt?',
        metrics: ['debt_equity', 'debt_assets', 'interest_coverage']
    },
    'Efficiency': {
        icon: '⚡',
        description: 'How well are assets used?',
        metrics: ['asset_turnover', 'inventory_turnover', 'receivables_turnover']
    },
    'Growth': {
        icon: '🚀',
        description: 'Is the company growing?',
        metrics: ['revenue_growth', 'earnings_growth', 'book_value_growth']
    },
    'Cash Flow': {
        icon: '💵',
        description: 'Is real cash being generated?',
        metrics: ['free_cash_flow', 'operating_cash_flow', 'fcf_yield']
    },
    'Dividends': {
        icon: '🎁',
        description: 'What\'s the dividend situation?',
        metrics: ['dividend_yield', 'payout_ratio']
    }
};

/**
 * Get definition for a metric
 */
export function getDefinition(metricKey) {
    return financialDefinitions[metricKey] || null;
}

/**
 * Get all metrics in a category
 */
export function getCategoryMetrics(categoryName) {
    const category = metricCategories[categoryName];
    if (!category) return [];

    return category.metrics.map(key => ({
        key,
        ...financialDefinitions[key]
    }));
}

export default financialDefinitions;
