// WORKING GROQ AI - ORIGINAL ANALYTICAL MEMO FORMAT

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

  const { companyName, exchange } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    const researchData = await conductResearch(companyName, exchange, groqApiKey);

    return res.status(200).json({
      success: true,
      data: researchData
    });

  } catch (error) {
    console.error('Research failed:', error);
    return res.status(500).json({
      error: 'Failed to generate memo',
      details: error.message
    });
  }
}

async function conductResearch(companyName, exchange, apiKey) {
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
    return JSON.parse(jsonText);
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('AI Response:', aiResponse);
    throw new Error('Failed to parse AI response as JSON');
  }
}
