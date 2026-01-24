// UPDATED Memo Generator - Real Financial Data + AI Analysis

class MemoGenerator {
    generateMemo(company, researchData) {
        const sections = [];

        // Title
        sections.push(this.generateTitle(company));

        // NEW: Section 1 - Price & Market Data (with numbers)
        sections.push(this.generatePriceData(researchData.priceData));

        // NEW: Section 2 - Financial Snapshot (table)
        sections.push(this.generateFinancialSnapshot(researchData.financialSnapshot));

        // NEW: Section 3 - Segment Breakdown
        sections.push(this.generateSegmentBreakdown(researchData.segmentBreakdown));

        //NEW: Section 4 - Financial Ratios (table)
        sections.push(this.generateFinancialRatiosTable(researchData.financialRatios));

        // Section 5: Business Snapshot (AI)
        sections.push(this.generateBusinessSnapshot(researchData.businessSnapshot));

        // Section 6: Why This Could Work (AI)
        sections.push(this.generateWhyThisCOULDWork(researchData.whyThisCOULDWork));

        // Section 7: Key Risks (AI)
        sections.push(this.generateKeyRisks(researchData.keyRisks));

        // NEW: Section 8 - Valuation Context (with PE ratios)
        sections.push(this.generateValuationContext(researchData.valuationMetrics, researchData.valuationSanity));

        // Section 9: Judgment Support (AI)
        sections.push(this.generateJudgmentSupport(researchData.judgmentSupport));

        // Section 10: Validation Needs (AI)
        sections.push(this.generateValidationNeeds(researchData.validationNeeds));

        // Section 11: News & Events (AI)
        sections.push(this.generateNarrativeContext(researchData.narrativeContext));

        // Disclaimer
        sections.push(this.generateDisclaimer());

        return sections.join('\\n\\n');
    }

    generateTitle(company) {
        return `<div class="memo-title">
            ${company.name} | ${company.exchange} | ${company.sector}
            <div class="memo-subtitle">StockMemo — Analytical Research Report</div>
        </div>`;
    }

    generatePriceData(priceData) {
        if (!priceData) {
            return `<div class="memo-section">
                <h2 class="memo-section-heading">SECTION 1: PRICE & MARKET DATA</h2>
                <p>Not disclosed</p>
            </div>`;
        }

        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">SECTION 1: PRICE & MARKET DATA</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Start Price</th>
                        <th>End Price</th>
                        <th>Change %</th>
                        <th>Max Drawdown %</th>
                        <th>Volatility %</th>
                    </tr>
                </thead>
                <tbody>`;

        if (priceData.oneYear) {
            content += `<tr>
                <td>1 Year</td>
                <td>$${priceData.oneYear.startPrice}</td>
                <td>$${priceData.oneYear.endPrice}</td>
                <td class="${parseFloat(priceData.oneYear.change) >= 0 ? 'positive' : 'negative'}">${priceData.oneYear.change}%</td>
                <td class="negative">${priceData.oneYear.maxDrawdown}%</td>
                <td>${priceData.oneYear.volatility}%</td>
            </tr>`;
        }

        if (priceData.threeYear) {
            content += `<tr>
                <td>3 Year</td>
                <td>$${priceData.threeYear.startPrice}</td>
                <td>$${priceData.threeYear.endPrice}</td>
                <td class="${parseFloat(priceData.threeYear.change) >= 0 ? 'positive' : 'negative'}">${priceData.threeYear.change}%</td>
                <td class="negative">${priceData.threeYear.maxDrawdown}%</td>
                <td>${priceData.threeYear.volatility}%</td>
            </tr>`;
        }

        if (priceData.fiveYear) {
            content += `<tr>
                <td>5 Year</td>
                <td>$${priceData.fiveYear.startPrice}</td>
                <td>$${priceData.fiveYear.endPrice}</td>
                <td class="${parseFloat(priceData.fiveYear.change) >= 0 ? 'positive' : 'negative'}">${priceData.fiveYear.change}%</td>
                <td class="negative">${priceData.fiveYear.maxDrawdown}%</td>
                <td>${priceData.fiveYear.volatility}%</td>
            </tr>`;
        }

        content += `</tbody></table></div>`;
        return content;
    }

    generateFinancialSnapshot(snapshot) {
        if (!snapshot || !snapshot.data || snapshot.data.length === 0) {
            return `<div class="memo-section">
                <h2 class="memo-section-heading">SECTION 2: FINANCIAL SNAPSHOT</h2>
                <p>Not disclosed</p>
            </div>`;
        }

        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">SECTION 2: FINANCIAL SNAPSHOT (5 YEARS)</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Revenue</th>
                        <th>EBITDA</th>
                        <th>Net Profit</th>
                        <th>Op Margin %</th>
                        <th>Net Margin %</th>
                    </tr>
                </thead>
                <tbody>`;

        snapshot.data.forEach((year, i) => {
            const yearLabel = snapshot.years[i] ? new Date(snapshot.years[i]).getFullYear() : `Year ${i + 1}`;
            content += `<tr>
                <td>${yearLabel}</td>
                <td>${this.formatLargeNumber(year.revenue)}</td>
                <td>${this.formatLargeNumber(year.ebitda)}</td>
                <td>${this.formatLargeNumber(year.netIncome)}</td>
                <td>${year.operatingMargin}%</td>
                <td>${year.netMargin}%</td>
            </tr>`;
        });

        content += `</tbody></table></div>`;
        return content;
    }

    generateSegmentBreakdown(segmentData) {
        if (!segmentData || !segmentData.available) {
            return `<div class="memo-section">
                <h2 class="memo-section-heading">SECTION 3: SEGMENT & REVENUE BREAKDOWN</h2>
                <p>${segmentData?.message || 'Not disclosed'}</p>
            </div>`;
        }

        return `<div class="memo-section">
            <h2 class="memo-section-heading">SECTION 3: SEGMENT & REVENUE BREAKDOWN</h2>
            <p>Segment data will be displayed here once available</p>
        </div>`;
    }

    generateFinancialRatiosTable(ratios) {
        if (!ratios || !ratios.data || ratios.data.length === 0) {
            return `<div class="memo-section">
                <h2 class="memo-section-heading">SECTION 4: KEY FINANCIAL RATIOS</h2>
                <p>Not disclosed</p>
            </div>`;
        }

        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">SECTION 4: KEY FINANCIAL RATIOS</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>ROE %</th>
                        <th>ROCE %</th>
                        <th>Debt/Equity</th>
                        <th>Int. Coverage</th>
                        <th>Free Cash Flow</th>
                    </tr>
                </thead>
                <tbody>`;

        ratios.data.forEach((year, i) => {
            const yearLabel = ratios.years[i] ? new Date(ratios.years[i]).getFullYear() : `Year ${i + 1}`;
            content += `<tr>
                <td>${yearLabel}</td>
                <td>${year.roe}%</td>
                <td>${year.roce}</td>
                <td>${year.debtToEquity}</td>
                <td>${year.interestCoverage}</td>
                <td>${this.formatLargeNumber(year.freeCashFlow)}</td>
            </tr>`;
        });

        content += `</tbody></table></div>`;
        return content;
    }

    generateBusinessSnapshot(snapshot) {
        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">SECTION 5: BUSINESS SNAPSHOT</h2>
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
            <h2 class="memo-section-heading">SECTION 6: WHY THIS COULD WORK (MANAGEMENT-SUPPORTED)</h2>
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
            <h2 class="memo-section-heading">SECTION 7: KEY RISKS (COMPANY-DISCLOSED)</h2>
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

    generateValuationContext(metrics, sanity) {
        let content = `<div class="memo-section">
            <h2 class="memo-section-heading">SECTION 8: VALUATION CONTEXT</h2>`;

        if (metrics) {
            content += `<table class="data-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Current P/E</td>
                        <td>${metrics.currentPE}</td>
                    </tr>
                    <tr>
                        <td>Historical Avg P/E</td>
                        <td>${metrics.historicalAvgPE}</td>
                    </tr>
                    <tr>
                        <td>Sector Avg P/E</td>
                        <td>${metrics.sectorAvgPE}</td>
                    </tr>
                </tbody>
            </table>`;
        }

        if (sanity) {
            content += `<p><strong>Assessment:</strong> ${sanity.assessment || 'Not disclosed'}</p>`;
            content += `<p>${sanity.reasoning || ''}</p>`;
        }

        content += '</div>';
        return content;
    }

    generateJudgmentSupport(judgment) {
        const bq = judgment?.businessQuality || { level: 'Medium', reasoning: 'Not disclosed' };
        const es = judgment?.evidenceStrength || { level: 'Medium', reasoning: 'Not disclosed' };
        const ul = judgment?.uncertaintyLevel || { level: 'Medium', reasoning: 'Not disclosed' };

        return `<div class="memo-section">
            <h2 class="memo-section-heading">SECTION 9: JUDGMENT SUPPORT (NON-ADVISORY)</h2>
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
            <h2 class="memo-section-heading">SECTION 10: WHAT NEEDS VALIDATION NEXT</h2>
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
            <h2 class="memo-section-heading">SECTION 11: NEWS & RECENT EVENTS</h2>`;

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
            <strong>DISCLAIMER:</strong> This report is an analytical research aid generated using publicly available information. It does not constitute investment advice.
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
        let text = `${company.name} | ${company.exchange} | ${company.sector}\\n`;
        text += `StockMemo — Analytical Research Report\\n`;
        text += `${'='.repeat(60)}\\n\\n`;

        // Add sections in order...
        text += `DISCLAIMER: This report is analytical research aid. Not investment advice.\\n`;

        return text;
    }
}
