# StockMemo Deployment Guide

## Quick Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Get Your API Key
1. Go to https://aistudio.google.com/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### Step 2: Deploy to Vercel
1. Install Vercel CLI (one-time):
   ```bash
   npm install -g vercel
   ```

2. Deploy from your project folder:
   ```bash
   cd d:\Downloads\Projects\StockMemo
   vercel
   ```

3. When prompted:
   - "Set up and deploy": Press ENTER (Yes)
   - "Which scope": Select your account
   - "Link to existing project": N (No)
   - "Project name": Press ENTER (or choose a name)
   - "In which directory": Press ENTER (current directory)
   - "Override settings": N (No)

4. Add your API key as environment variable:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   - When prompted, paste your API key
   - Select "Production, Preview, Development"

5. Deploy again to use the API key:
   ```bash
   vercel --prod
   ```

6. Done! Your URL will be shown (e.g., `stockmemo.vercel.app`)

---

## Alternative: GitHub + Vercel (Auto-Deploy)

### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. In your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/stockmemo.git
   git push -u origin main
   ```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your API key
5. Click "Deploy"

Now every time you push to GitHub, it auto-deploys!

---

## Alternative: Netlify Deploy

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Deploy
```bash
cd d:\Downloads\Projects\StockMemo
netlify deploy
```

### Step 3: Set Environment Variable
1. Go to your Netlify dashboard
2. Site Settings → Environment Variables
3. Add: `GEMINI_API_KEY` = your API key
4. Redeploy:
   ```bash
   netlify deploy --prod
   ```

---

## Testing Locally

1. Install dependencies (none needed for basic testing)
2. Set environment variable:
   ```bash
   # Windows PowerShell
   $env:GEMINI_API_KEY="your_api_key_here"
   
   # Windows CMD
   set GEMINI_API_KEY=your_api_key_here
   ```

3. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

4. Open http://localhost:8000

**Note**: Local testing won't work with API calls because the backend function needs a serverless platform. Just deploy to Vercel for best results.

---

## Troubleshooting

### "API key not configured"
- Make sure you added `GEMINI_API_KEY` as environment variable
- Redeploy after adding the variable

### "Function timeout"
- Research can take 30-60 seconds
- Vercel free tier allows 10s for functions
- Upgrade to Vercel Pro for 60s timeout, or use Netlify (10s free, 26s paid)

### "CORS errors"
- This shouldn't happen with proper deployment
- If it does, the `vercel.json` handles routing

---

## Cost Breakdown

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions (10s timeout)
- ❌ Only 10s timeout (may need Pro for longer research)

**Vercel Pro ($20/month):**
- ✅ 60s function timeout
- ✅ Better for production

**Gemini API:**
- ✅ 15 requests/minute (free)
- ✅ 1M tokens/day (free)
- ✅ More than enough for personal use

---

## Your Website is Now Live!

Users just visit your URL and use it - **NO API KEY SETUP REQUIRED** for them!

You control one API key on the backend.
