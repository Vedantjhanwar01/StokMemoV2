// Configuration
const CONFIG = {
    // Gemini API
    GEMINI_API_BASE: 'https://generativelanguage.googleapis.com/v1beta',
    GEMINI_MODEL: 'gemini-2.0-flash-exp',
    
    // Default settings
    DEFAULT_EXCHANGE: 'NSE',
    
    // Exchange mappings
    EXCHANGES: {
        NSE: 'National Stock Exchange of India',
        BSE: 'Bombay Stock Exchange'
    },
    
    // Common investor relations URL patterns
    IR_URL_PATTERNS: [
        'investor',
        'investors',
        'investor-relations',
        'ir',
        'annual-report',
        'financials'
    ],
    
    // Regulatory sources
    REGULATORY_SOURCES: {
        NSE: 'https://www.nseindia.com',
        BSE: 'https://www.bseindia.com'
    }
};
