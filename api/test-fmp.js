// Debug endpoint to test FMP API
import FMPClient from './fmp-client.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const apiKey = process.env.FMP_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'FMP_API_KEY not configured in environment variables'
        });
    }

    try {
        const symbol = req.query.symbol || 'AAPL';
        const client = new FMPClient(apiKey);

        console.log(`Testing FMP API with symbol: ${symbol}`);

        // Test individual endpoints
        const profile = await client.getProfile(symbol);
        const quote = await client.getQuote(symbol);

        return res.status(200).json({
            success: true,
            symbol,
            apiKeyConfigured: true,
            data: {
                profile: profile || 'No data',
                quote: quote || 'No data'
            },
            message: 'FMP API is working correctly!'
        });

    } catch (error) {
        console.error('FMP test failed:', error);
        return res.status(500).json({
            error: 'FMP API test failed',
            details: error.message,
            apiKeyConfigured: !!apiKey
        });
    }
}
