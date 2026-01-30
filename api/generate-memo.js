// ENHANCED: GROQ AI + FMP REAL FINANCIAL DATA
import FMPClient from './fmp-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { companyName, exchange, symbol: providedSymbol } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  const fmpApiKey = process.env.FMP_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    // Create FMP client first for dynamic symbol resolution
    const fmpClient = fmpApiKey ? new FMPClient(fmpApiKey) : null;

    // Use provided symbol from search, or resolve dynamically
    const symbol = providedSymbol || await resolveSymbol(companyName, exchange, fmpClient);
    console.log(`Symbol resolved: "${companyName}" -> ${symbol}`);

    // Step 2: Fetch FMP financial data (if FMP client available)
    let fmpData = null;
    if (fmpClient && symbol) {
      try {
        console.log(`Fetching FMP data for symbol: ${symbol}`);
        fmpData = await fmpClient.getAllData(symbol);
        console.log('FMP data fetched successfully');
        console.log('FMP ratios received:', fmpData.ratios ? `${fmpData.ratios.length} items` : 'null/undefined');
        console.log('FMP keyMetrics received:', fmpData.keyMetrics ? `${fmpData.keyMetrics.length} items` : 'null/undefined');
        if (fmpData.ratios && fmpData.ratios[0]) {
          console.log('FMP ratios[0] keys:', Object.keys(fmpData.ratios[0]));
          console.log('Sample ratio values:', JSON.stringify(fmpData.ratios[0]).substring(0, 500));
        }
      } catch (fmpError) {
        console.warn('FMP data fetch failed, continuing with AI-only:', fmpError.message);
        // Continue without FMP data - AI will generate analysis
      }
    } else {
      console.log('FMP API key not configured or symbol not resolved - using AI-only mode');
    }

    // Step 3: Get AI analysis (with or without FMP context)
    const researchData = await conductResearch(companyName, exchange, groqApiKey, fmpData);

    return res.status(200).json({
      success: true,
      data: researchData,
      dataSource: fmpData ? 'FMP + AI Analysis' : 'AI Analysis Only'
    });

  } catch (error) {
    console.error('Research failed:', error);
    return res.status(500).json({
      error: 'Failed to generate memo',
      details: error.message
    });
  }
}

// Symbol resolver - now uses FMP API for dynamic resolution
// Falls back to local mapping for common stocks (faster)
async function resolveSymbol(companyName, exchange, fmpClient = null) {
  // Quick lookup for most common stocks (performance optimization)
  const quickLookup = {
    // US Stocks
    'apple': 'AAPL',
    'microsoft': 'MSFT',
    'google': 'GOOGL',
    'alphabet': 'GOOGL',
    'amazon': 'AMZN',
    'meta': 'META',
    'facebook': 'META',
    'tesla': 'TSLA',
    'nvidia': 'NVDA',
    'netflix': 'NFLX',
    'amd': 'AMD',
    'intel': 'INTC',
    'salesforce': 'CRM',
    'adobe': 'ADBE',
    'paypal': 'PYPL',
    'uber': 'UBER',
    'spotify': 'SPOT',
    'airbnb': 'ABNB',
    'coca-cola': 'KO',
    'coca cola': 'KO',
    'pepsi': 'PEP',
    'pepsico': 'PEP',
    'walmart': 'WMT',
    'disney': 'DIS',
    'nike': 'NKE',
    'mcdonalds': 'MCD',
    'starbucks': 'SBUX',
    'boeing': 'BA',
    'jpmorgan': 'JPM',
    'jp morgan': 'JPM',
    'visa': 'V',
    'mastercard': 'MA',
    'johnson & johnson': 'JNJ',
    'johnson and johnson': 'JNJ',
    'pfizer': 'PFE',
    'berkshire': 'BRK-B',
    'berkshire hathaway': 'BRK-B',
    'exxon': 'XOM',
    'chevron': 'CVX',

    // Indian Stocks (NSE)
    'reliance': 'RELIANCE.NS',
    'reliance industries': 'RELIANCE.NS',
    'tcs': 'TCS.NS',
    'tata consultancy': 'TCS.NS',
    'infosys': 'INFY.NS',
    'hdfc bank': 'HDFCBANK.NS',
    'icici bank': 'ICICIBANK.NS',
    'bharti airtel': 'BHARTIARTL.NS',
    'airtel': 'BHARTIARTL.NS',
    'itc': 'ITC.NS',
    'wipro': 'WIPRO.NS',
    'hcl tech': 'HCLTECH.NS',
    'hcl technologies': 'HCLTECH.NS',
    'asian paints': 'ASIANPAINT.NS',
    'maruti': 'MARUTI.NS',
    'maruti suzuki': 'MARUTI.NS',
    'sun pharma': 'SUNPHARMA.NS',
    'sun pharmaceutical': 'SUNPHARMA.NS',
    'kotak': 'KOTAKBANK.NS',
    'kotak mahindra': 'KOTAKBANK.NS',
    'axis bank': 'AXISBANK.NS',
    'l&t': 'LT.NS',
    'larsen': 'LT.NS',
    'larsen & toubro': 'LT.NS',
    'bajaj finance': 'BAJFINANCE.NS',
    'titan': 'TITAN.NS',
    'tata motors': 'TATAMOTORS.NS',
    'tata steel': 'TATASTEEL.NS',
    'adani': 'ADANIENT.NS',
    'adani enterprises': 'ADANIENT.NS',
    'sbi': 'SBIN.NS',
    'state bank': 'SBIN.NS',
    'state bank of india': 'SBIN.NS',
    'hindustan unilever': 'HINDUNILVR.NS',
    'hul': 'HINDUNILVR.NS',
    'ntpc': 'NTPC.NS',
    'power grid': 'POWERGRID.NS',
    'ongc': 'ONGC.NS',
    'coal india': 'COALINDIA.NS',
    'ultratech': 'ULTRACEMCO.NS',
    'ultratech cement': 'ULTRACEMCO.NS',
    'nestle': 'NESTLEIND.NS',
    'nestle india': 'NESTLEIND.NS',
    'britannia': 'BRITANNIA.NS',
    'dr reddy': 'DRREDDY.NS',
    "dr reddy's": 'DRREDDY.NS',
    'cipla': 'CIPLA.NS',
    'divis': 'DIVISLAB.NS',
    'divis lab': 'DIVISLAB.NS'
  };

  const key = companyName.toLowerCase().trim();

  // Check quick lookup first
  if (quickLookup[key]) {
    console.log(`Quick lookup: "${companyName}" -> ${quickLookup[key]}`);
    return quickLookup[key];
  }

  // If FMP client available, use dynamic resolution
  if (fmpClient) {
    try {
      console.log(`Dynamic resolution for: "${companyName}" (exchange: ${exchange})`);
      const resolved = await fmpClient.resolveSymbolDynamic(companyName, exchange);
      console.log(`Dynamic resolution result: ${resolved}`);
      return resolved;
    } catch (error) {
      console.warn('Dynamic resolution failed, using company name as symbol:', error.message);
    }
  }

  // Fallback: return uppercase company name (may work for simple cases)
  return companyName.toUpperCase().replace(/\s+/g, '');
}

async function conductResearch(companyName, exchange, apiKey, fmpData = null) {
  const prompt = `You are a senior equity research analyst. Generate a structured analytical research memo for ${companyName} (${exchange}).

Return ONLY valid JSON (no markdown, no backticks, no explanation) with this EXACT structure:

{
  "company": {
    "name": "${companyName}",
    "symbol": "TICKER",
    "exchange": "${exchange}",
    "sector": "Sector name",
    "industry": "Industry name"
  },
  "research": {
    "priceContext": {
      "trend": "Neutral description of historical price behavior (1Y/3Y/5Y trends, volatility, drawdowns). NO predictions or judgments.",
      "volatility": "High/Medium/Low"
    },
    "financialStructure": {
      "description": "Analytical description of revenue mix, segment exposure, margin trends, cost structure. Historical perspective only. NO judgments.",
      "segments": ["Segment 1: X%", "Segment 2: Y%"]
    },
    "businessSnapshot": [
      "Factual bullet 1 - what company does",
      "Factual bullet 2 - how it makes money",
      "Factual bullet 3 - where it operates",
      "Factual bullet 4"
    ],
    "whyThisCOULDWork": [
      {
        "claim": "Management-stated claim or strategy point 1",
        "evidenceStrength": "Strong"
      },
      {
        "claim": "Management-stated claim or strategy point 2",
        "evidenceStrength": "Moderate"
      },
      {
        "claim": "Management-stated claim or strategy point 3",
        "evidenceStrength": "Weak"
      }
    ],
    "keyRisks": [
      "Company-disclosed risk 1",
      "Company-disclosed risk 2",
      "Company-disclosed risk 3",
      "Company-disclosed risk 4",
      "Company-disclosed risk 5"
    ],
    "valuationSanity": {
      "assessment": "Cheap/Premium/Inline/Not disclosed",
      "reasoning": "Brief qualitative explanation of valuation context"
    },
    "judgmentSupport": {
      "businessQuality": {
        "level": "High/Medium/Low",
        "reasoning": "One neutral descriptive line"
      },
      "evidenceStrength": {
        "level": "High/Medium/Low",
        "reasoning": "One neutral descriptive line"
      },
      "uncertaintyLevel": {
        "level": "High/Medium/Low",
        "reasoning": "One neutral descriptive line"
      }
    },
    "validationNeeds": [
      "Specific validation item 1 based on assumptions",
      "Specific validation item 2",
      "Specific validation item 3"
    ],
    "narrativeContext": [
      "Recent news or development 1",
      "Recent news or development 2",
      "Recent news or development 3"
    ]
  }
}

CRITICAL RULES:
1. EXACTLY 4-6 bullets in businessSnapshot
2. EXACTLY 3 items in whyThisCOULDWork with evidenceStrength tags (Strong/Moderate/Weak)
3. EXACTLY 5 items in keyRisks (use "Not disclosed" if fewer available)
4. EXACTLY 3 items in validationNeeds
5. EXACTLY 3 items in narrativeContext
6. NO predictions, NO recommendations, NO price targets
7. ALL descriptions must be neutral and analytical
8. ALL claims must be management-stated or company-disclosed
9. Maintain complete objectivity throughout

Return ONLY the JSON object. NO markdown, NO backticks, NO explanation.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a senior equity research analyst. You ONLY return valid JSON. Never use markdown. Always be factual and neutral.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 6000,
      top_p: 1,
      stream: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  // Extract JSON from response
  let jsonText = aiResponse.trim();

  // Remove markdown code blocks if present
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  }

  // Parse and return
  try {
    const aiAnalysis = JSON.parse(jsonText);

    // Combine AI analysis with FMP real data
    const result = {
      ...aiAnalysis,
      // Add FMP data if available
      fmpData: fmpData ? {
        quote: fmpData.quote,
        prices: fmpData.prices ? fmpData.prices.slice(0, 252) : null, // Last year of daily prices
        statements: fmpData.statements,
        ratios: fmpData.ratios,
        keyMetrics: fmpData.keyMetrics
      } : null
    };

    return result;
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('AI Response:', aiResponse);
    throw new Error('Failed to parse AI response as JSON');
  }
}
