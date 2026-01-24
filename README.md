# StockMemo

**Analyst-Grade Research Memo Generator**

StockMemo is a web application that automatically generates neutral, institutional-quality research memos for listed companies using publicly available information.

## Features

- **Autonomous Research**: Automatically discovers and analyzes public sources including investor relations pages, annual reports, regulatory filings, and recent news
- **11-Step Analytical Workflow**: Follows a rigorous institutional research process from company resolution to evidence assessment
- **Structured Output**: Generates memos in a strict format with sections for business snapshot, thesis points, risks, valuation context, and validation needs
- **Strict Neutrality**: No buy/sell recommendations, no predictions, no advisory language
- **Evidence Strength Assessment**: Tags each thesis point with evidence quality (Strong/Moderate/Weak)
- **Clean UI**: Professional, white interface inspired by Kite

## Deployment (For Website Owners)

**Quick 5-minute deploy to Vercel** - see [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Start:
1. Get Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Install Vercel CLI: `npm install -g vercel`
3. Deploy: `vercel`
4. Add API key: `vercel env add GEMINI_API_KEY`
5. Redeploy: `vercel --prod`
6. Done! Your users can now use it without any setup.

**Your users will not need API keys** - they just visit your website and use it instantly!

## Usage (For End Users)

**No setup required!** Just visit the website and:

1. **Enter Company Details**
   - Type the company name
   - Select the exchange (NSE or BSE)
   - Click "Generate Memo"

2. **Wait for Research** (30-60 seconds)
   - AI autonomously researches the company
   - Progress shown in real-time

3. **Review Memo**
   - Read structured analysis
   - Check evidence strength tags
   - Review judgment metrics

4. **Export** (optional)
   - Download as text file for offline use

## Memo Structure

Each generated memo includes:

1. **Market & Price Context** - Historical price behavior
2. **Financial Structure** - Revenue mix and margins
3. **Business Snapshot** - 4-6 factual bullets
4. **Why This Could Work** - 3 management-supported thesis points
5. **Key Risks** - 5 company-disclosed risks
6. **Valuation Sanity Check** - Qualitative assessment only
7. **Judgment Support** - Business quality, evidence strength, uncertainty
8. **What Needs Validation Next** - 3 forward-looking items
9. **News & Narrative Context** - Recent company news

## Important Disclaimers

⚠️ **This is NOT investment advice**

- StockMemo is an analytical research tool, not a recommendation engine
- It does not provide buy/sell/hold advice
- It does not predict prices or returns
- All analysis is based on publicly available information
- Users must conduct their own due diligence

## Privacy & Security

- API key is securely stored on the server (environment variables)
- Users never see or enter API keys
- All research conducted via secure backend
- No persistent user data storage
- All analysis is ephemeral (not saved)

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Serverless Functions (Vercel/Netlify compatible)
- **AI Engine**: Google Gemini API (gemini-2.0-flash-exp)
- **Deployment**: Vercel (recommended) or Netlify
- **Design**: Clean white theme inspired by Kite

## Limitations

- Depends on availability of public information
- May show "Not disclosed" for companies with limited public data
- Historical price charts require integration with market data APIs
- Best suited for well-known, publicly traded companies

## License

This is a demonstration project. Use at your own risk.

---

**Built with AntiGravity (AG)** - Senior equity research analyst + research systems design
