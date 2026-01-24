// Static company search - NO AI needed
// Returns matching companies from hardcoded list

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { q, exchange } = req.query;

    if (!q || q.length < 2) {
        return res.status(200).json({ companies: [] });
    }

    // Static list of top NSE/BSE companies
    const allCompanies = [
        { name: "Reliance Industries", symbol: "RELIANCE", exchange: "NSE" },
        { name: "Tata Consultancy Services", symbol: "TCS", exchange: "NSE" },
        { name: "HDFC Bank", symbol: "HDFCBANK", exchange: "NSE" },
        { name: "Infosys", symbol: "INFY", exchange: "NSE" },
        { name: "ICICI Bank", symbol: "ICICIBANK", exchange: "NSE" },
        { name: "Hindustan Unilever", symbol: "HINDUNILVR", exchange: "NSE" },
        { name: "State Bank of India", symbol: "SBIN", exchange: "NSE" },
        { name: "Bharti Airtel", symbol: "BHARTIARTL", exchange: "NSE" },
        { name: "ITC Limited", symbol: "ITC", exchange: "NSE" },
        { name: "Kotak Mahindra Bank", symbol: "KOTAKBANK", exchange: "NSE" },
        { name: "Larsen & Toubro", symbol: "LT", exchange: "NSE" },
        { name: "Axis Bank", symbol: "AXISBANK", exchange: "NSE" },
        { name: "Bajaj Finance", symbol: "BAJFINANCE", exchange: "NSE" },
        { name: "Asian Paints", symbol: "ASIANPAINT", exchange: "NSE" },
        { name: "Maruti Suzuki", symbol: "MARUTI", exchange: "NSE" },
        { name: "HCL Technologies", symbol: "HCLTECH", exchange: "NSE" },
        { name: "Wipro", symbol: "WIPRO", exchange: "NSE" },
        { name: "Titan Company", symbol: "TITAN", exchange: "NSE" },
        { name: "Mahindra & Mahindra", symbol: "M&M", exchange: "NSE" },
        { name: "Sun Pharmaceutical", symbol: "SUNPHARMA", exchange: "NSE" },
        { name: "UltraTech Cement", symbol: "ULTRACEMCO", exchange: "NSE" },
        { name: "Nestle India", symbol: "NESTLEIND", exchange: "NSE" },
        { name: "Power Grid Corporation", symbol: "POWERGRID", exchange: "NSE" },
        { name: "NTPC Limited", symbol: "NTPC", exchange: "NSE" },
        { name: "Bajaj Auto", symbol: "BAJAJ-AUTO", exchange: "NSE" },
        { name: "Adani Enterprises", symbol: "ADANIENT", exchange: "NSE" },
        { name: "Tata Motors", symbol: "TATAMOTORS", exchange: "NSE" },
        { name: "Tata Steel", symbol: "TATASTEEL", exchange: "NSE" },
        { name: "JSW Steel", symbol: "JSWSTEEL", exchange: "NSE" },
        { name: "Tech Mahindra", symbol: "TECHM", exchange: "NSE" },
        { name: "Coal India", symbol: "COALINDIA", exchange: "NSE" },
        { name: "Bharat Petroleum", symbol: "BPCL", exchange: "NSE" },
        { name: "Indian Oil Corporation", symbol: "IOC", exchange: "NSE" },
        { name: "Grasim Industries", symbol: "GRASIM", exchange: "NSE" },
        { name: "Cipla", symbol: "CIPLA", exchange: "NSE" },
        { name: "Dr Reddy's Laboratories", symbol: "DRREDDY", exchange: "NSE" },
        { name: "Hero MotoCorp", symbol: "HEROMOTOCO", exchange: "NSE" },
        { name: "Eicher Motors", symbol: "EICHERMOT", exchange: "NSE" },
        { name: "Tata Consumer Products", symbol: "TATACONSUM", exchange: "NSE" },
        { name: "Britannia Industries", symbol: "BRITANNIA", exchange: "NSE" }
    ];

    try {
        const searchQuery = q.toLowerCase();
        const filtered = allCompanies.filter(company =>
            company.name.toLowerCase().includes(searchQuery) ||
            company.symbol.toLowerCase().includes(searchQuery)
        );

        return res.status(200).json({
            companies: filtered.slice(0, 10) // Max 10 results
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(200).json({ companies: [] });
    }
}
