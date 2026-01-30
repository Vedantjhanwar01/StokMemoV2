import FMPClient from './api/fmp-client.js';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.FMP_API_KEY;
if (!apiKey) {
    console.error('FMP_API_KEY not found in environment');
    process.exit(1);
}

const client = new FMPClient(apiKey);
const symbol = 'AAPL';

console.log(`Testing FMP for ${symbol}...`);
try {
    const data = await client.getAllData(symbol);
    console.log('SUCCESS!');
    console.log('Quote:', data.quote ? 'Found' : 'Missing');
    console.log('Profile:', data.profile ? 'Found' : 'Missing');
    console.log('Prices:', data.prices?.length || 0);
} catch (err) {
    console.error('FAILED:', err.message);
}
