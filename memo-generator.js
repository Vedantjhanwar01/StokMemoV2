// Professional Memo Generator - Analytics Dashboard Edition
// Generates investor-grade research reports with charts and educational tooltips

class MemoGenerator {
    generateMemo(company, researchData) {
        const sections = [];

        // Title
        sections.push(this.generateTitle(company));

        // NEW: Professional Analytics Dashboard (if FMP data available)
        if (researchData.fmpData) {
            sections.push(this.generateAnalyticsDashboard(researchData.fmpData, company));
        }

        // AI Analysis Sections (keep existing)
        sections.push(this.generateBusinessSnapshot(researchData.research?.businessSnapshot));
        sections.push(this.generateWhyThisCOULDWork(researchData.research?.whyThisCOULDWork));
        sections.push(this.generateKeyRisks(researchData.research?.keyRisks));
        sections.push(this.generateJudgmentSupport(researchData.research?.judgmentSupport));
        sections.push(this.generateValidationNeeds(researchData.research?.validationNeeds));
        sections.push(this.generateNarrativeContext(researchData.research?.narrativeContext));

        // Disclaimer
        sections.push(this.generateDisclaimer());

        return sections.join('\n\n');
    }

    /**
     * Generate the professional analytics dashboard
     */
    generateAnalyticsDashboard(fmpData, company) {
        const { quote, profile, prices, statements, ratios, keyMetrics } = fmpData;

        let html = `<div class="analytics-dashboard">`;

        // ============================================
        // SECTION 1: Price Hero with Chart
        // ============================================
        if (quote) {
            const priceChange = quote.change || 0;
            const changePercent = quote.changesPercentage || 0;
            const isPositive = priceChange >= 0;

            html += `
                <div class="dashboard-header">
                    <div class="stock-price-hero">
                        <span class="current-price">$${quote.price?.toFixed(2) || 'N/A'}</span>
                        <span class="price-change ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive ? '+' : ''}${priceChange.toFixed(2)} (${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)
                        </span>
                    </div>
                    <div class="chart-timeframe-buttons" id="priceTimeframeButtons">
                        <button class="timeframe-btn" data-tf="1M">1M</button>
                        <button class="timeframe-btn" data-tf="3M">3M</button>
                        <button class="timeframe-btn" data-tf="6M">6M</button>
                        <button class="timeframe-btn active" data-tf="1Y">1Y</button>
                        <button class="timeframe-btn" data-tf="5Y">5Y</button>
                    </div>
                </div>
                
                <div class="chart-section">
                    <div class="chart-container" id="priceChartContainer" style="height: 350px;"></div>
                </div>
            `;
        }

        // ============================================
        // SECTION 2: Key Metrics Grid
        // ============================================
        html += `
            <div class="chart-section">
                <h3 class="chart-section-title">📊 Key Metrics</h3>
                <div id="keyMetricsGrid"></div>
            </div>
        `;

        // ============================================
        // SECTION 3: Revenue & Earnings Chart
        // ============================================
        if (statements?.income && statements.income.length > 0) {
            html += `
                <div class="chart-section">
                    <h3 class="chart-section-title">📈 Revenue & Earnings Trend (5 Years)</h3>
                    <div class="chart-container" id="revenueChartContainer" style="height: 320px;"></div>
                </div>
            `;
        }

        // ============================================
        // SECTION 4: Profitability Ratios with Info Buttons
        // ============================================
        html += `
            <div class="analytics-category">
                <div class="category-header">
                    <span class="category-icon">💰</span>
                    <span class="category-title">Profitability Ratios</span>
                    <span class="category-description">How efficiently is the company generating profits?</span>
                </div>
                <div id="profitabilityBars"></div>
            </div>
        `;

        // ============================================
        // SECTION 5: Margin Trend Chart
        // ============================================
        if (statements?.income && statements.income.length > 0) {
            html += `
                <div class="chart-section">
                    <h3 class="chart-section-title">📉 Margin Analysis (5 Years)</h3>
                    <div class="chart-container" id="marginChartContainer" style="height: 280px;"></div>
                </div>
            `;
        }

        // ============================================
        // SECTION 6: Financial Health Gauges
        // ============================================
        html += `
            <div class="analytics-category">
                <div class="category-header">
                    <span class="category-icon">🏦</span>
                    <span class="category-title">Financial Health</span>
                    <span class="category-description">Liquidity and solvency indicators</span>
                </div>
                <div class="gauges-grid">
                    <div id="gauge-current-ratio"></div>
                    <div id="gauge-debt-equity"></div>
                    <div id="gauge-interest-coverage"></div>
                    <div id="gauge-quick-ratio"></div>
                </div>
            </div>
        `;

        // ============================================
        // SECTION 7: Valuation Metrics
        // ============================================
        html += `
            <div class="analytics-category">
                <div class="category-header">
                    <span class="category-icon">💎</span>
                    <span class="category-title">Valuation Metrics</span>
                    <span class="category-description">Is the stock cheap or expensive?</span>
                </div>
                <div id="valuationMetrics"></div>
            </div>
        `;

        html += `</div>`;

        return html;
    }

    generateTitle(company) {
        return `<div class="memo-title">
            ${company.name} | ${company.exchange} | ${company.sector}
            <div class="memo-subtitle">StockMemo — Professional Analytics Report</div>
        </div>`;
    }

    generateBusinessSnapshot(snapshot) {
        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">BUSINESS SNAPSHOT</h2>
            <ul>`;

        if (snapshot && snapshot.length > 0) {
            snapshot.forEach(item => {
                content += `<li>${item}</li>`;
            });
        } else {
            for (let i = 0; i < 4; i++) {
                content += `<li>Not disclosed</li>`;
            }
        }

        content += '</ul></div>';
        return content;
    }

    generateWhyThisCOULDWork(thesisPoints) {
        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">WHY THIS COULD WORK (MANAGEMENT-SUPPORTED)</h2>
            <ul>`;

        if (thesisPoints && thesisPoints.length > 0) {
            thesisPoints.slice(0, 3).forEach(point => {
                const evidenceClass = `evidence-${point.evidenceStrength.toLowerCase()}`;
                content += `<li>${point.claim} <span class="evidence-tag ${evidenceClass}">${point.evidenceStrength}</span></li>`;
            });

            for (let i = thesisPoints.length; i < 3; i++) {
                content += `<li>Not disclosed <span class="evidence-tag evidence-weak">Weak</span></li>`;
            }
        } else {
            for (let i = 0; i < 3; i++) {
                content += `<li>Not disclosed <span class="evidence-tag evidence-weak">Weak</span></li>`;
            }
        }

        content += '</ul></div>';
        return content;
    }

    generateKeyRisks(risks) {
        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">KEY RISKS (COMPANY-DISCLOSED)</h2>
            <ul>`;

        if (risks && risks.length > 0) {
            risks.slice(0, 5).forEach(risk => {
                content += `<li>${risk}</li>`;
            });

            for (let i = risks.length; i < 5; i++) {
                content += `<li>Not disclosed</li>`;
            }
        } else {
            for (let i = 0; i < 5; i++) {
                content += `<li>Not disclosed</li>`;
            }
        }

        content += '</ul></div>';
        return content;
    }

    generateJudgmentSupport(judgment) {
        const bq = judgment?.businessQuality || { level: 'Medium', reasoning: 'Not disclosed' };
        const es = judgment?.evidenceStrength || { level: 'Medium', reasoning: 'Not disclosed' };
        const ul = judgment?.uncertaintyLevel || { level: 'Medium', reasoning: 'Not disclosed' };

        return `<div class="memo-section">
            <h2 class="memo-section-heading">JUDGMENT SUPPORT (NON-ADVISORY)</h2>
            <div class="judgment-grid">
                <div class="judgment-item">
                    <div class="judgment-label">Business Quality</div>
                    <div class="judgment-value">${bq.level}</div>
                    <div class="judgment-description">${bq.reasoning}</div>
                </div>
                <div class="judgment-item">
                    <div class="judgment-label">Evidence Strength</div>
                    <div class="judgment-value">${es.level}</div>
                    <div class="judgment-description">${es.reasoning}</div>
                </div>
                <div class="judgment-item">
                    <div class="judgment-label">Uncertainty Level</div>
                    <div class="judgment-value">${ul.level}</div>
                    <div class="judgment-description">${ul.reasoning}</div>
                </div>
            </div>
        </div>`;
    }

    generateValidationNeeds(validationNeeds) {
        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">WHAT NEEDS VALIDATION NEXT</h2>
            <ul>`;

        if (validationNeeds && validationNeeds.length > 0) {
            validationNeeds.slice(0, 3).forEach(item => {
                content += `<li>${item}</li>`;
            });

            for (let i = validationNeeds.length; i < 3; i++) {
                content += `<li>Not disclosed</li>`;
            }
        } else {
            for (let i = 0; i < 3; i++) {
                content += `<li>Not disclosed</li>`;
            }
        }

        content += '</ul></div>';
        return content;
    }

    generateNarrativeContext(narrative) {
        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">NEWS & RECENT EVENTS</h2>`;

        if (narrative && narrative.length > 0) {
            content += '<ul>';
            narrative.forEach(item => {
                content += `<li>${item}</li>`;
            });
            content += '</ul>';
        } else {
            content += '<p>Not disclosed</p>';
        }

        content += '</div>';
        return content;
    }

    generateDisclaimer() {
        return `<div class="disclaimer">
            <strong>DISCLAIMER:</strong> This report is an analytical research aid generated using publicly available information. It does not constitute investment advice. The financial metrics shown are based on data from Financial Modeling Prep API and may contain delays or inaccuracies. Always verify data before making investment decisions.
        </div>`;
    }

    // Utility: Format large numbers
    formatLargeNumber(value) {
        if (value === null || value === undefined || value === 'Not disclosed') {
            return 'Not disclosed';
        }

        const num = parseFloat(value);
        if (isNaN(num)) return 'Not disclosed';

        if (Math.abs(num) >= 1e12) {
            return `$${(num / 1e12).toFixed(2)}T`;
        } else if (Math.abs(num) >= 1e9) {
            return `$${(num / 1e9).toFixed(2)}B`;
        } else if (Math.abs(num) >= 1e6) {
            return `$${(num / 1e6).toFixed(2)}M`;
        } else {
            return `$${num.toFixed(2)}`;
        }
    }

    // Plain text export
    generatePlainText(company, researchData) {
        let text = `${company.name} | ${company.exchange} | ${company.sector}\n`;
        text += `StockMemo — Professional Analytics Report\n`;
        text += `${'='.repeat(60)}\n\n`;
        text += `DISCLAIMER: This report is analytical research aid. Not investment advice.\n`;
        return text;
    }
}

// ============================================
// Dashboard Initialization Function
// ============================================
function initializeDashboard(fmpData) {
    console.log('=== Dashboard Initialization Started ===');
    console.log('fmpData received:', fmpData);
    console.log('window.chartsManager exists:', !!window.chartsManager);

    if (!fmpData) {
        console.error('No fmpData provided to initializeDashboard');
        return;
    }

    const { quote, profile, prices, statements, ratios, keyMetrics } = fmpData;

    console.log('Data breakdown:');
    console.log('- quote:', quote ? 'exists' : 'missing', quote);
    console.log('- prices:', prices ? `${prices.length} items` : 'missing');
    console.log('- statements:', statements);
    console.log('- ratios:', ratios ? `${ratios.length} items` : 'missing');
    console.log('- keyMetrics:', keyMetrics ? `${keyMetrics.length} items` : 'missing');

    // Detailed logging of ratios and keyMetrics for debugging
    if (ratios && ratios.length > 0) {
        console.log('=== RATIOS[0] ALL PROPERTIES ===');
        console.log('Keys:', Object.keys(ratios[0]));
        console.log('Full object:', JSON.stringify(ratios[0], null, 2));
    }
    if (keyMetrics && keyMetrics.length > 0) {
        console.log('=== KEYMETRICS[0] ALL PROPERTIES ===');
        console.log('Keys:', Object.keys(keyMetrics[0]));
        console.log('Full object:', JSON.stringify(keyMetrics[0], null, 2));
    }

    // 1. Initialize Price Chart
    if (prices && prices.length > 0 && window.chartsManager) {
        console.log('Creating price chart...');
        window.chartsManager.createPriceChart('priceChartContainer', prices, '1Y');

        // Timeframe button handlers
        document.querySelectorAll('#priceTimeframeButtons .timeframe-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('#priceTimeframeButtons .timeframe-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                window.chartsManager.createPriceChart('priceChartContainer', prices, this.dataset.tf);
            });
        });
    } else {
        console.warn('Price chart skipped - prices:', !!prices, 'chartsManager:', !!window.chartsManager);
        const chartContainer = document.getElementById('priceChartContainer');
        if (chartContainer) {
            chartContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:300px;color:var(--color-text-tertiary);"><p>Historical price data not available</p></div>';
        }
    }

    // 2. Key Metrics Grid
    if (quote && window.chartsManager) {
        console.log('Creating key metrics grid...');
        const latestMetrics = keyMetrics?.[0] || {};
        const latestRatios = ratios?.[0] || {};

        // DEBUG: Log all available properties as plain text (not expandable objects)
        console.log('=== DEBUG: Quote Object Keys ===', Object.keys(quote).join(', '));

        console.log('=== DEBUG: KeyMetrics[0] FULL DATA ===');
        console.log(JSON.stringify(latestMetrics, null, 2));

        console.log('=== DEBUG: Ratios[0] FULL DATA ===');
        console.log(JSON.stringify(latestRatios, null, 2));

        console.log('=== DEBUG: Ratios Object Properties ===');
        console.log('ratios[0] keys:', Object.keys(latestRatios));
        console.log('ROE related:', latestRatios.returnOnEquity, latestRatios.roe);
        console.log('ROA related:', latestRatios.returnOnAssets, latestRatios.roa);

        // Get P/E and EPS - try multiple property names from keyMetrics since quote doesn't have them
        // FMP stable API uses different property names than legacy API
        const peRatio = latestMetrics.peRatioTTM ?? latestMetrics.peRatio ?? latestMetrics.priceEarningsRatio ??
            latestMetrics.priceToEarningsRatio ?? quote.pe ?? quote.peRatio;

        const epsValue = latestMetrics.netIncomePerShareTTM ?? latestMetrics.netIncomePerShare ??
            latestMetrics.eps ?? latestMetrics.earningsPerShare ??
            quote.eps ?? quote.earningsPerShare;

        // Also log what we found
        console.log('Trying to find P/E from:', {
            'km.peRatioTTM': latestMetrics.peRatioTTM,
            'km.peRatio': latestMetrics.peRatio,
            'km.priceEarningsRatio': latestMetrics.priceEarningsRatio,
            'quote.pe': quote.pe
        });
        console.log('Trying to find EPS from:', {
            'km.netIncomePerShareTTM': latestMetrics.netIncomePerShareTTM,
            'km.netIncomePerShare': latestMetrics.netIncomePerShare,
            'km.eps': latestMetrics.eps,
            'quote.eps': quote.eps
        });

        console.log('Resolved P/E:', peRatio, '| Resolved EPS:', epsValue);

        const metrics = [
            {
                label: 'Market Cap',
                metricKey: 'market_cap',
                value: formatLargeNum(quote.marketCap),
                subtext: getMarketCapCategory(quote.marketCap)
            },
            {
                label: 'P/E Ratio',
                metricKey: 'pe_ratio',
                value: peRatio != null ? peRatio.toFixed(2) : 'N/A',
                subtext: getPEAssessment(peRatio)
            },
            {
                label: 'EPS',
                metricKey: 'eps',
                value: epsValue != null ? `$${epsValue.toFixed(2)}` : '$N/A',
                subtext: 'Earnings per share'
            },
            {
                label: '52W High',
                metricKey: '52_week_high',
                value: `$${quote.yearHigh?.toFixed(2) || 'N/A'}`,
                subtext: getDistanceFromHigh(quote.price, quote.yearHigh)
            },
            {
                label: '52W Low',
                metricKey: '52_week_low',
                value: `$${quote.yearLow?.toFixed(2) || 'N/A'}`,
                subtext: getDistanceFromLow(quote.price, quote.yearLow)
            },
            {
                label: 'Volume',
                metricKey: 'volume',
                value: formatLargeNum(quote.volume),
                subtext: `Avg: ${formatLargeNum(quote.avgVolume)}`
            }
        ];

        window.chartsManager.createMetricsGrid('keyMetricsGrid', metrics);
    }

    // 3. Revenue Chart
    if (statements?.income && window.chartsManager) {
        window.chartsManager.createRevenueChart('revenueChartContainer', statements.income);
    }

    // 4. Profitability Bars
    if (ratios && Array.isArray(ratios) && ratios.length > 0 && window.chartsManager) {
        const r = ratios[0];

        // Helper to get value from multiple possible property names
        const getValue = (obj, ...keys) => {
            for (const key of keys) {
                if (obj[key] !== undefined && obj[key] !== null) return obj[key];
            }
            return 0;
        };

        // Try multiple property name variations (FMP uses different names in stable vs legacy API)
        const roe = getValue(r, 'returnOnEquityTTM', 'returnOnEquity', 'roe', 'roeTTM');
        const roa = getValue(r, 'returnOnAssetsTTM', 'returnOnAssets', 'roa', 'roaTTM');
        const grossMargin = getValue(r, 'grossProfitMarginTTM', 'grossProfitMargin', 'grossMargin');
        const opMargin = getValue(r, 'operatingProfitMarginTTM', 'operatingProfitMargin', 'operatingMargin');
        const netMargin = getValue(r, 'netProfitMarginTTM', 'netProfitMargin', 'netMargin');

        console.log('Profitability values found:', { roe, roa, grossMargin, opMargin, netMargin });

        const profitMetrics = [
            {
                label: 'Return on Equity (ROE)',
                metricKey: 'roe',
                value: roe,
                displayValue: `${(roe * 100).toFixed(1)}%`,
                maxValue: 0.5,
                status: getRatioStatus(roe, 0.15, 0.10, false)
            },
            {
                label: 'Return on Assets (ROA)',
                metricKey: 'roa',
                value: roa,
                displayValue: `${(roa * 100).toFixed(1)}%`,
                maxValue: 0.3,
                status: getRatioStatus(roa, 0.10, 0.05, false)
            },
            {
                label: 'Gross Margin',
                metricKey: 'gross_margin',
                value: grossMargin,
                displayValue: `${(grossMargin * 100).toFixed(1)}%`,
                maxValue: 1,
                status: getRatioStatus(grossMargin, 0.40, 0.25, false)
            },
            {
                label: 'Operating Margin',
                metricKey: 'operating_margin',
                value: opMargin,
                displayValue: `${(opMargin * 100).toFixed(1)}%`,
                maxValue: 0.5,
                status: getRatioStatus(opMargin, 0.15, 0.08, false)
            },
            {
                label: 'Net Margin',
                metricKey: 'net_margin',
                value: netMargin,
                displayValue: `${(netMargin * 100).toFixed(1)}%`,
                maxValue: 0.4,
                status: getRatioStatus(netMargin, 0.10, 0.05, false)
            }
        ];

        window.chartsManager.createRatioBar('profitabilityBars', profitMetrics);
    } else {
        // Show message when profitability data is unavailable
        const profitContainer = document.getElementById('profitabilityBars');
        if (profitContainer) {
            profitContainer.innerHTML = '<p style="color:var(--color-text-tertiary); text-align:center; padding: 1rem;">Profitability ratios not available for this stock.</p>';
        }
    }

    // 5. Margin Chart
    if (statements?.income && window.chartsManager) {
        window.chartsManager.createMarginChart('marginChartContainer', statements.income);
    }

    // 6. Financial Health Gauges
    if (ratios && ratios.length > 0 && window.chartsManager) {
        const r = ratios[0];

        // Helper to get value from multiple possible property names
        const getVal = (obj, ...keys) => {
            for (const key of keys) {
                if (obj[key] !== undefined && obj[key] !== null) return obj[key];
            }
            return 0;
        };

        const currentRatio = getVal(r, 'currentRatioTTM', 'currentRatio');
        const debtEquity = getVal(r, 'debtEquityRatioTTM', 'debtEquityRatio', 'debtToEquityTTM', 'debtToEquity');
        const interestCov = getVal(r, 'interestCoverageTTM', 'interestCoverage');
        const quickRatio = getVal(r, 'quickRatioTTM', 'quickRatio');

        console.log('Financial Health values:', { currentRatio, debtEquity, interestCov, quickRatio });

        window.chartsManager.createGauge('gauge-current-ratio', currentRatio, {
            label: 'Current Ratio',
            metricKey: 'current_ratio',
            thresholds: { good: 1.5, warning: 1.0 },
            maxValue: 3,
            invert: false
        });

        window.chartsManager.createGauge('gauge-debt-equity', debtEquity, {
            label: 'Debt/Equity',
            metricKey: 'debt_equity',
            thresholds: { good: 0.5, warning: 1.0 },
            maxValue: 2,
            invert: true
        });

        window.chartsManager.createGauge('gauge-interest-coverage', interestCov, {
            label: 'Interest Coverage',
            metricKey: 'interest_coverage',
            thresholds: { good: 5, warning: 2 },
            maxValue: 15,
            invert: false
        });

        window.chartsManager.createGauge('gauge-quick-ratio', quickRatio, {
            label: 'Quick Ratio',
            metricKey: 'quick_ratio',
            thresholds: { good: 1.0, warning: 0.5 },
            maxValue: 2.5,
            invert: false
        });
    } else {
        // Show message when financial health data is unavailable
        const gaugeContainers = ['gauge-current-ratio', 'gauge-debt-equity', 'gauge-interest-coverage', 'gauge-quick-ratio'];
        gaugeContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '<p style="color:var(--color-text-tertiary); font-size: 0.875rem; text-align:center;">N/A</p>';
            }
        });
    }

    // 7. Valuation Metrics
    if (quote && keyMetrics && Array.isArray(keyMetrics) && keyMetrics.length > 0 && window.chartsManager) {
        const km = keyMetrics[0] || {};

        // DEBUG: Log keyMetrics properties
        console.log('=== DEBUG: Valuation KeyMetrics Properties ===');
        console.log('keyMetrics[0] all keys:', Object.keys(km));
        console.log('Full keyMetrics[0]:', JSON.stringify(km, null, 2));

        // Try multiple property name variations (TTM = Trailing Twelve Months)
        const valPE = km.peRatioTTM ?? km.peRatio ?? km.priceEarningsRatio ?? km.priceToEarningsRatioTTM ?? quote.pe ?? quote.peRatio;
        const valPB = km.priceToBookRatioTTM ?? km.priceToBookRatio ?? km.pbRatioTTM ?? km.pbRatio ?? km.priceBookRatio;
        const valPS = km.priceToSalesRatioTTM ?? km.priceToSalesRatio ?? km.psRatioTTM ?? km.psRatio;
        const valEVEBITDA = km.enterpriseValueOverEBITDATTM ?? km.enterpriseValueOverEBITDA ?? km.evToEbitda ?? km.evEbitda;
        const valDivYield = km.dividendYieldTTM ?? km.dividendYield ?? km.dividendYieldPercentageTTM;
        const valFCFYield = km.freeCashFlowYieldTTM ?? km.freeCashFlowYield ?? km.fcfYield;

        console.log('Resolved valuation: PE=', valPE, 'PB=', valPB, 'PS=', valPS, 'EV/EBITDA=', valEVEBITDA);

        const valuationItems = [
            {
                label: 'P/E Ratio',
                metricKey: 'pe_ratio',
                value: valPE != null ? Number(valPE).toFixed(2) : 'N/A',
                subtext: 'Price to Earnings'
            },
            {
                label: 'P/B Ratio',
                metricKey: 'pb_ratio',
                value: valPB != null ? Number(valPB).toFixed(2) : 'N/A',
                subtext: 'Price to Book'
            },
            {
                label: 'P/S Ratio',
                metricKey: 'ps_ratio',
                value: valPS != null ? Number(valPS).toFixed(2) : 'N/A',
                subtext: 'Price to Sales'
            },
            {
                label: 'EV/EBITDA',
                metricKey: 'ev_ebitda',
                value: valEVEBITDA != null ? Number(valEVEBITDA).toFixed(2) : 'N/A',
                subtext: 'Enterprise Value'
            },
            {
                label: 'Dividend Yield',
                metricKey: 'dividend_yield',
                value: valDivYield != null ? `${(Number(valDivYield) * 100).toFixed(2)}%` : 'N/A',
                subtext: 'Annual dividend'
            },
            {
                label: 'FCF Yield',
                metricKey: 'fcf_yield',
                value: valFCFYield != null ? `${(Number(valFCFYield) * 100).toFixed(2)}%` : 'N/A',
                subtext: 'Free cash flow yield'
            }
        ];

        window.chartsManager.createMetricsGrid('valuationMetrics', valuationItems);
    } else {
        // Show message when valuation data is unavailable
        const valuationContainer = document.getElementById('valuationMetrics');
        if (valuationContainer) {
            valuationContainer.innerHTML = '<p style="color:var(--color-text-tertiary); text-align:center; padding: 1rem;">Valuation metrics not available for this stock.</p>';
        }
    }
}

// ============================================
// Helper Functions
// ============================================
function formatLargeNum(value) {
    if (!value) return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';

    if (Math.abs(num) >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (Math.abs(num) >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
}

function getMarketCapCategory(marketCap) {
    if (!marketCap) return '';
    if (marketCap >= 200e9) return 'Mega Cap';
    if (marketCap >= 10e9) return 'Large Cap';
    if (marketCap >= 2e9) return 'Mid Cap';
    return 'Small Cap';
}

function getPEAssessment(pe) {
    if (!pe) return '';
    if (pe < 0) return 'Negative (Loss)';
    if (pe < 15) return 'Below average';
    if (pe < 25) return 'Fair valuation';
    if (pe < 40) return 'Growth premium';
    return 'Very high';
}

function getDistanceFromHigh(price, high) {
    if (!price || !high) return '';
    const pct = ((high - price) / high * 100).toFixed(1);
    return `${pct}% below high`;
}

function getDistanceFromLow(price, low) {
    if (!price || !low) return '';
    const pct = ((price - low) / low * 100).toFixed(1);
    return `${pct}% above low`;
}

function getRatioStatus(value, goodThreshold, warningThreshold, invert = false) {
    if (value === null || value === undefined) return 'warning';

    if (invert) {
        if (value <= warningThreshold) return 'excellent';
        if (value <= goodThreshold) return 'good';
        return 'danger';
    } else {
        if (value >= goodThreshold) return 'excellent';
        if (value >= warningThreshold) return 'good';
        return 'danger';
    }
}
