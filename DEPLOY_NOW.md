# Quick Deployment Instructions

## ✅ Code is Ready!

All files updated in `StockMemoV2`:
- ✅ `api/fmp-client.js` - FMP API wrapper
- ✅ `api/test-fmp.js` - Debug endpoint
- ✅ `utils/data-formatter.js` - Formatting utilities
- ✅ `api/generate-memo.js` - Backend with FMP integration
- ✅ `memo-generator.js` - Frontend with real data display

---

## 🚀 Deploy Now (5 minutes):

### Step 1: Add FMP API Key to Vercel

1. Go to: https://vercel.com/dashboard
2. Click on **"stok-memo-v2"** project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. **Key:** `FMP_API_KEY`
6. **Value:** `KUkP2SwvoiDkif6mrcUXEnN0ta5jXRvO`
7. Check all 3 boxes (Production, Preview, Development)
8. Click **"Save"**

---

### Step 2: Push Code to GitHub

Open PowerShell:

```powershell
cd d:\Downloads\Projects\StockMemoV2

git add .

git commit -m "Add FMP real financial data integration"

git push origin main
```

---

### Step 3: Wait for Deployment (60 seconds)

Vercel will auto-deploy when you push to GitHub.

Watch: https://vercel.com/dashboard

---

### Step 4: Test the Live Site

1. Go to: https://stok-memo-v2.vercel.app/
2. Search: **"Apple"**
3. Click **"Generate Memo"**
4. Should show:
   - ✅ Real stock price ($XXX)
   - ✅ 5-year revenue table
   - ✅ Financial ratios
   - ✅ AI analysis

---

## 🎯 Done!

Original site still safe at: https://stock-memopro.vercel.app/
New V2 with financial data: https://stok-memo-v2.vercel.app/

---

**Start with Step 1 - add FMP key to Vercel!**
