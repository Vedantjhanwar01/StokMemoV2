// ENHANCED DEBUG - Test FMP API with detailed error logging

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const apiKey = process.env.FMP_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'FMP_API_KEY not configured',
            envKeys: Object.keys(process.env).filter(k => k.includes('FMP'))
        });
    }

    // Test with AAPL
    const testSymbol = 'AAPL';
    const testUrl = `https://financialmodelingprep.com/api/v3/profile/${testSymbol}?apikey=${apiKey}`;

    try {
        console.log('Testing FMP with URL:', testUrl.replace(apiKey, 'API_KEY_HIDDEN'));

        const response = await fetch(testUrl);
        const status = response.status;
        const contentType = response.headers.get('content-type');

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            const text = await response.text();
            return res.status(500).json({
                error: 'Failed to parse JSON',
                status,
                contentType,
                responseText: text.substring(0, 500)
            });
        }

        return res.status(200).json({
            success: response.ok,
            status,
            contentType,
            dataReceived: data,
            apiKeyPresent: !!apiKey,
            apiKeyLength: apiKey?.length,
            apiKeyPrefix: apiKey?.substring(0, 4) + '...'
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            stack: error.stack,
            apiKeyPresent: !!apiKey
        });
    }
}
