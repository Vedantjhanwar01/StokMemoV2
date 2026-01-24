// Research Engine - Autonomous information gathering and extraction

class ResearchEngine {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Main research workflow
     * Returns structured research data for memo generation
     */
    async conductResearch(companyName, exchange, progressCallback) {
        try {
            // Step 1: Company Resolution
            progressCallback('Resolving company information...', 10);
            const companyInfo = await this.resolveCompany(companyName, exchange);

            // Step 2: Source Discovery
            progressCallback('Discovering authoritative sources...', 25);
            const sources = await this.discoverSources(companyInfo);

            // Step 3: Information Extraction
            progressCallback('Extracting information from public sources...', 40);
            const rawData = await this.extractInformation(companyInfo, sources);

            // Step 4: Classification
            progressCallback('Classifying extracted information...', 60);
            const classifiedData = await this.classifyInformation(rawData);

            // Step 5: Evidence Assessment
            progressCallback('Assessing evidence strength...', 80);
            const assessedData = await this.assessEvidence(classifiedData);

            progressCallback('Finalizing research...', 95);

            return {
                company: companyInfo,
                research: assessedData,
                sources: sources
            };

        } catch (error) {
            console.error('Research error:', error);
            throw new Error(`Research failed: ${error.message}`);
        }
    }

    /**
     * Step 1: Resolve company identity, sector, exchange
     */
    async resolveCompany(companyName, exchange) {
        const prompt = `You are a financial research assistant. Provide basic information about the company in JSON format.

Company Name: ${companyName}
Exchange: ${exchange}

Respond with ONLY a JSON object (no markdown, no explanation) with this structure:
{
    "name": "Official company name",
    "ticker": "Stock ticker symbol if known, or 'Unknown'",
    "exchange": "${exchange}",
    "sector": "Primary sector",
    "industry": "Specific industry",
    "country": "Country of operation",
    "disclosureLevel": "High/Medium/Limited based on how well-known the company is"
}

If you cannot find information, use "Not disclosed" for that field.`;

        const response = await this.callGeminiAPI(prompt);
        return JSON.parse(this.extractJSON(response));
    }

    /**
     * Step 2: Discover authoritative public sources
     */
    async discoverSources(companyInfo) {
        const prompt = `You are a financial research assistant. Find authoritative public sources for this company.

Company: ${companyInfo.name}
Exchange: ${companyInfo.exchange}
Sector: ${companyInfo.sector}

Search the web and provide a list of authoritative sources in JSON format (no markdown):
{
    "investorRelations": "URL or 'Not found'",
    "annualReports": ["URL1", "URL2"] or [],
    "earningsTranscripts": ["URL1"] or [],
    "regulatoryFilings": ["URL1"] or [],
    "recentNews": ["URL1", "URL2", "URL3"] or []
}

Only include actual URLs you find. Use 'Not found' or empty arrays if unavailable.`;

        const response = await this.callGeminiAPI(prompt);
        return JSON.parse(this.extractJSON(response));
    }

    /**
     * Step 3: Extract information from sources
     */
    async extractInformation(companyInfo, sources) {
        const prompt = `You are a senior equity research analyst extracting information about a company.

Company: ${companyInfo.name}
Sector: ${companyInfo.sector}

Using web search and publicly available information, extract the following data. Tag each item appropriately.

Extract and provide in JSON format (no markdown):
{
    "businessFacts": [
        "Fact 1 about operations, products, services",
        "Fact 2", "Fact 3", "Fact 4"
    ],
    "managementClaims": [
        "Management claim 1 about strategy or outlook",
        "Claim 2", "Claim 3"
    ],
    "companyDisclosedRisks": [
        "Risk 1 mentioned in company disclosures",
        "Risk 2", "Risk 3", "Risk 4", "Risk 5"
    ],
    "narrativeContext": [
        "Recent news item 1",
        "Recent news item 2",
        "Recent news item 3"
    ],
    "financialStructure": {
        "revenueSegments": ["Segment 1: X%", "Segment 2: Y%"] or [],
        "marginTrends": "Description of margin trends or 'Not disclosed'",
        "costStructure": "Description or 'Not disclosed'"
    },
    "priceContext": {
        "trend": "Description of recent price behavior",
        "volatility": "High/Medium/Low or 'Not disclosed'"
    }
}

CRITICAL RULES:
- Extract ONLY explicitly stated information
- Do NOT infer or speculate
- If information is unavailable, use "Not disclosed" or empty arrays
- Tag information appropriately (business fact vs management claim vs risk)
- Maintain complete neutrality - no opinions`;

        const response = await this.callGeminiAPI(prompt);
        return JSON.parse(this.extractJSON(response));
    }

    /**
     * Step 4: Classify information into memo sections
     */
    async classifyInformation(rawData) {
        const prompt = `You are organizing research data for an institutional equity research memo.

Raw Data:
${JSON.stringify(rawData, null, 2)}

Reorganize this into memo-ready sections. Respond with JSON (no markdown):
{
    "businessSnapshot": [
        "4-6 one-line factual bullets about the business"
    ],
    "whyThisCOULDWork": [
        {
            "claim": "Management-supported thesis point 1",
            "basis": "Evidence from management"
        },
        {
            "claim": "Thesis point 2",
            "basis": "Evidence"
        },
        {
            "claim": "Thesis point 3",
            "basis": "Evidence"
        }
    ],
    "keyRisks": [
        "Exactly 5 company-disclosed risks (use 'Not disclosed' if fewer available)"
    ],
    "financialStructure": {
        "description": "Analytical description of revenue mix and margins",
        "segments": rawData.financialStructure.revenueSegments
    },
    "priceContext": rawData.priceContext,
    "narrativeContext": rawData.narrativeContext
}

Rules:
- Business snapshot: 4-6 bullets, purely factual, one line each
- Why this could work: EXACTLY 3 management-supported points
- Key risks: EXACTLY 5 items (fill with "Not disclosed" if needed)
- Maintain neutrality`;

        const response = await this.callGeminiAPI(prompt);
        return JSON.parse(this.extractJSON(response));
    }

    /**
     * Step 5: Assess evidence strength and generate validation needs
     */
    async assessEvidence(classifiedData) {
        const prompt = `You are an investment committee member assessing evidence quality.

Classified Data:
${JSON.stringify(classifiedData, null, 2)}

For each "Why This Could Work" thesis point, assess evidence strength and identify assumptions.

Also generate:
1. Valuation sanity assessment (qualitative only: Cheap/Premium/Inline)
2. Judgment support metrics (Business Quality, Evidence Strength, Uncertainty - each Low/Medium/High)
3. What needs validation next (3 specific items based on assumptions)

Respond with JSON (no markdown):
{
    "whyThisCOULDWork": [
        {
            "claim": "Same as input",
            "basis": "Same as input",
            "evidenceStrength": "Strong/Moderate/Weak",
            "implicitAssumptions": ["Assumption 1", "Assumption 2"]
        }
    ],
    "valuationSanity": {
        "assessment": "Cheap/Premium/Inline/Not disclosed",
        "reasoning": "Brief qualitative explanation"
    },
    "judgmentSupport": {
        "businessQuality": {
            "level": "Low/Medium/High",
            "reasoning": "One neutral line"
        },
        "evidenceStrength": {
            "level": "Low/Medium/High",
            "reasoning": "One neutral line"
        },
        "uncertaintyLevel": {
            "level": "Low/Medium/High",
            "reasoning": "One neutral line"
        }
    },
    "validationNeeds": [
        "Validation item 1 (forward-looking but grounded)",
        "Validation item 2",
        "Validation item 3"
    ],
    "businessSnapshot": classifiedData.businessSnapshot,
    "keyRisks": classifiedData.keyRisks,
    "financialStructure": classifiedData.financialStructure,
    "priceContext": classifiedData.priceContext,
    "narrativeContext": classifiedData.narrativeContext
}

Assessment criteria for evidence strength:
- Strong: Explicitly disclosed, frequently mentioned, clear source
- Moderate: Mentioned but not detailed, some ambiguity
- Weak: Vague, single mention, unclear source

NO predictions, NO recommendations, NO targets.`;

        const response = await this.callGeminiAPI(prompt);
        return JSON.parse(this.extractJSON(response));
    }

    /**
     * Call Gemini API
     */
    async callGeminiAPI(prompt) {
        const url = `${CONFIG.GEMINI_API_BASE}/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${this.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Extract JSON from response (handles markdown code blocks)
     */
    extractJSON(text) {
        // Remove markdown code blocks if present
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            return jsonMatch[1].trim();
        }
        return text.trim();
    }
}
