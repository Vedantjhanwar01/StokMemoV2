// Dynamic company search using FMP API
// Searches ALL stocks globally (like Kite/Groww)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { q } = req.query;

    if (!q || q.length < 2) {
        return res.status(200).json({ companies: [] });
    }

    const apiKey = process.env.FMP_API_KEY;

    // Use FMP search if API key exists, else fallback to static list
    if (apiKey) {
        try {
            const searchUrl = `https://financialmodelingprep.com/stable/search?query=${encodeURIComponent(q)}&apikey=${apiKey}`;

            const response = await fetch(searchUrl);

            if (!response.ok) {
                throw new Error('FMP search failed');
            }

            const results = await response.json();

            // Map FMP results to our format
            const companies = results.slice(0, 15).map(item => ({
                name: item.name,
                symbol: item.symbol,
                exchange: item.exchangeShortName || item.stockExchange || 'Unknown'
            }));

            return res.status(200).json({ companies });

        } catch (error) {
            console.error('FMP search error:', error);
            // Fall through to static list
        }
    }

    // Fallback: Static list for common companies
    const staticCompanies = [
        { name: "Apple", symbol: "AAPL", exchange: "NASDAQ" },
        { name: "Microsoft", symbol: "MSFT", exchange: "NASDAQ" },
        { name: "Google", symbol: "GOOGL", exchange: "NASDAQ" },
        { name: "Amazon", symbol: "AMZN", exchange: "NASDAQ" },
        { name: "Tesla", symbol: "TSLA", exchange: "NASDAQ" },
        { name: "NVIDIA", symbol: "NVDA", exchange: "NASDAQ" },
        { name: "Meta", symbol: "META", exchange: "NASDAQ" },
        { name: "Netflix", symbol: "NFLX", exchange: "NASDAQ" },
        { name: "Reliance Industries", symbol: "RELIANCE.NS", exchange: "NSE" },
        { name: "Tata Consultancy", symbol: "TCS.NS", exchange: "NSE" },
        { name: "HDFC Bank", symbol: "HDFCBANK.NS", exchange: "NSE" },
        { name: "Infosys", symbol: "INFY.NS", exchange: "NSE" },
        { name: "ICICI Bank", symbol: "ICICIBANK.NS", exchange: "NSE" },
        { name: "Bharti Airtel", symbol: "BHARTIARTL.NS", exchange: "NSE" },
        { name: "ITC Limited", symbol: "ITC.NS", exchange: "NSE" }
    ];

    const searchQuery = q.toLowerCase();
    const filtered = staticCompanies.filter(c =>
        c.name.toLowerCase().includes(searchQuery) ||
        c.symbol.toLowerCase().includes(searchQuery)
    );

    return res.status(200).json({ companies: filtered.slice(0, 10) });
}
