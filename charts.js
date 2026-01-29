// Professional Charts Manager - Chart.js Implementations
// Interactive charts for investor analytics

class ChartsManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#4B8BF5',
            primaryDark: '#2E6FDB',
            success: '#10b981',
            danger: '#ef4444',
            warning: '#f59e0b',
            gray: '#94a3b8',
            gridLine: 'rgba(0, 0, 0, 0.05)',
            text: '#64748b'
        };
    }

    /**
     * Format large numbers for chart labels
     */
    formatNumber(value) {
        if (value === null || value === undefined) return 'N/A';
        const num = parseFloat(value);
        if (isNaN(num)) return 'N/A';

        if (Math.abs(num) >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
        if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
        if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
        if (Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
        return `$${num.toFixed(2)}`;
    }

    /**
     * Create stock price line chart
     */
    createPriceChart(containerId, priceData, timeframe = '1Y') {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Destroy existing chart
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        // Filter data based on timeframe
        const filteredData = this.filterByTimeframe(priceData, timeframe);

        if (!filteredData || filteredData.length === 0) {
            container.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:300px;color:var(--color-text-tertiary);">
                    <p>Historical price data not available</p>
                </div>
            `;
            return;
        }

        // Prepare chart data
        const labels = filteredData.map(d => this.formatDate(d.date, timeframe));
        const prices = filteredData.map(d => d.close);

        // Determine if positive or negative trend
        const startPrice = prices[0];
        const endPrice = prices[prices.length - 1];
        const isPositive = endPrice >= startPrice;
        const lineColor = isPositive ? this.colors.success : this.colors.danger;
        const gradientColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

        // Create canvas
        container.innerHTML = '<canvas></canvas>';
        const ctx = container.querySelector('canvas').getContext('2d');

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, gradientColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.charts[containerId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Price',
                    data: prices,
                    borderColor: lineColor,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: lineColor,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { size: 12 },
                        bodyFont: { size: 14, weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => `$${context.parsed.y.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: this.colors.text,
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        grid: {
                            color: this.colors.gridLine,
                            drawBorder: false
                        },
                        ticks: {
                            color: this.colors.text,
                            callback: (value) => `$${value.toFixed(0)}`
                        }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Create revenue and earnings bar chart
     */
    createRevenueChart(containerId, incomeStatements) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        if (!incomeStatements || incomeStatements.length === 0) {
            container.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:300px;color:var(--color-text-tertiary);">
                    <p>Financial data not available</p>
                </div>
            `;
            return;
        }

        // Reverse to show chronologically (oldest to newest)
        const data = [...incomeStatements].reverse().slice(-5);

        const labels = data.map(d => d.calendarYear || (d.date ? d.date.substring(0, 4) : 'N/A'));
        const revenues = data.map(d => d.revenue || 0);
        const netIncomes = data.map(d => d.netIncome || 0);

        container.innerHTML = '<canvas></canvas>';
        const ctx = container.querySelector('canvas').getContext('2d');

        this.charts[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: revenues,
                        backgroundColor: 'rgba(75, 139, 245, 0.8)',
                        borderRadius: 6,
                        barThickness: 30
                    },
                    {
                        label: 'Net Income',
                        data: netIncomes,
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderRadius: 6,
                        barThickness: 30
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${this.formatNumber(context.parsed.y)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: this.colors.text }
                    },
                    y: {
                        grid: {
                            color: this.colors.gridLine,
                            drawBorder: false
                        },
                        ticks: {
                            color: this.colors.text,
                            callback: (value) => this.formatNumber(value)
                        }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Create margin trend line chart
     */
    createMarginChart(containerId, incomeStatements) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        if (!incomeStatements || incomeStatements.length === 0) {
            container.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:250px;color:var(--color-text-tertiary);">
                    <p>Margin data not available</p>
                </div>
            `;
            return;
        }

        const data = [...incomeStatements].reverse().slice(-5);

        const labels = data.map(d => d.calendarYear || (d.date ? d.date.substring(0, 4) : 'N/A'));

        // Calculate margins
        const grossMargins = data.map(d => {
            if (!d.revenue || !d.grossProfit) return null;
            return ((d.grossProfit / d.revenue) * 100).toFixed(1);
        });

        const operatingMargins = data.map(d => {
            if (!d.revenue || !d.operatingIncome) return null;
            return ((d.operatingIncome / d.revenue) * 100).toFixed(1);
        });

        const netMargins = data.map(d => {
            if (!d.revenue || !d.netIncome) return null;
            return ((d.netIncome / d.revenue) * 100).toFixed(1);
        });

        container.innerHTML = '<canvas></canvas>';
        const ctx = container.querySelector('canvas').getContext('2d');

        this.charts[containerId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Gross Margin',
                        data: grossMargins,
                        borderColor: this.colors.primary,
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: this.colors.primary
                    },
                    {
                        label: 'Operating Margin',
                        data: operatingMargins,
                        borderColor: this.colors.warning,
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: this.colors.warning
                    },
                    {
                        label: 'Net Margin',
                        data: netMargins,
                        borderColor: this.colors.success,
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: this.colors.success
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: this.colors.text }
                    },
                    y: {
                        grid: {
                            color: this.colors.gridLine,
                            drawBorder: false
                        },
                        ticks: {
                            color: this.colors.text,
                            callback: (value) => `${value}%`
                        }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Create ratio gauge visualization
     */
    createGauge(containerId, value, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const {
            label = 'Ratio',
            metricKey = '',
            thresholds = { good: 1.5, warning: 1.0 },
            maxValue = 3,
            suffix = '',
            invert = false // true means lower is better
        } = config;

        // Determine status
        let status = 'good';
        let statusText = 'Healthy';

        if (invert) {
            if (value > thresholds.good) { status = 'danger'; statusText = 'High'; }
            else if (value > thresholds.warning) { status = 'warning'; statusText = 'Moderate'; }
        } else {
            if (value < thresholds.warning) { status = 'danger'; statusText = 'Low'; }
            else if (value < thresholds.good) { status = 'warning'; statusText = 'Fair'; }
        }

        // Calculate fill percentage (capped at 100%)
        const fillPercent = Math.min((value / maxValue) * 100, 100);

        // Color based on status
        const colors = {
            good: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444'
        };

        const infoBtn = metricKey ?
            `<button class="info-btn" data-metric="${metricKey}" onclick="window.infoTooltip?.showTooltip('${metricKey}', this)">ℹ️</button>` : '';

        container.innerHTML = `
            <div class="gauge-card">
                <div class="gauge-visual">
                    <div class="gauge-arc"></div>
                    <div class="gauge-fill" style="transform: rotate(${-45 + (fillPercent * 1.8)}deg); border-top-color: ${colors[status]}; border-right-color: ${colors[status]};"></div>
                    <div class="gauge-value-display">${value !== null ? value.toFixed(2) : 'N/A'}${suffix}</div>
                </div>
                <div class="gauge-label">${label} ${infoBtn}</div>
                <div class="gauge-status ${status}">${statusText}</div>
            </div>
        `;
    }

    /**
     * Create ratio progress bar
     */
    createRatioBar(containerId, metrics) {
        console.log('=== createRatioBar called ===');
        console.log('containerId:', containerId);
        console.log('metrics received:', metrics);

        const container = document.getElementById(containerId);
        if (!container) {
            console.error('createRatioBar: Container not found:', containerId);
            return;
        }

        if (!metrics || metrics.length === 0) {
            console.warn('createRatioBar: No metrics provided');
            container.innerHTML = '<p style="color:var(--color-text-tertiary);">Ratio data not available</p>';
            return;
        }

        console.log('createRatioBar: Rendering', metrics.length, 'metrics');

        const bars = metrics.map(m => {
            // Calculate fill percentage based on value range
            const fillPercent = Math.min(Math.max((m.value / m.maxValue) * 100, 0), 100);

            // Determine color class
            let colorClass = 'good';
            if (m.status === 'excellent') colorClass = 'excellent';
            else if (m.status === 'warning') colorClass = 'warning';
            else if (m.status === 'danger') colorClass = 'danger';

            const infoBtn = m.metricKey ?
                `<button class="info-btn" data-metric="${m.metricKey}" onclick="window.infoTooltip?.showTooltip('${m.metricKey}', this)">ℹ️</button>` : '';

            return `
                <div class="ratio-bar-item">
                    <div class="ratio-bar-header">
                        <span class="ratio-bar-label">${m.label} ${infoBtn}</span>
                        <span class="ratio-bar-value">${m.displayValue}</span>
                    </div>
                    <div class="ratio-bar-track">
                        <div class="ratio-bar-fill ${colorClass}" style="width: ${fillPercent}%;"></div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="ratio-bars">${bars}</div>`;
    }

    /**
     * Create metrics grid
     */
    createMetricsGrid(containerId, metrics) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cards = metrics.map(m => {
            const valueClass = m.isPositive === true ? 'positive' : (m.isPositive === false ? 'negative' : '');
            const infoBtn = m.metricKey ?
                `<button class="info-btn" data-metric="${m.metricKey}" onclick="window.infoTooltip?.showTooltip('${m.metricKey}', this)">ℹ️</button>` : '';

            return `
                <div class="metric-card">
                    <div class="metric-card-header">
                        <span class="metric-label">${m.label} ${infoBtn}</span>
                    </div>
                    <div class="metric-value ${valueClass}">${m.value}</div>
                    ${m.subtext ? `<div class="metric-subtext">${m.subtext}</div>` : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="metrics-grid">${cards}</div>`;
    }

    /**
     * Filter price data by timeframe
     */
    filterByTimeframe(priceData, timeframe) {
        if (!priceData || priceData.length === 0) return [];

        const now = new Date();
        let cutoffDate = new Date();

        switch (timeframe) {
            case '1M': cutoffDate.setMonth(now.getMonth() - 1); break;
            case '3M': cutoffDate.setMonth(now.getMonth() - 3); break;
            case '6M': cutoffDate.setMonth(now.getMonth() - 6); break;
            case '1Y': cutoffDate.setFullYear(now.getFullYear() - 1); break;
            case '5Y': cutoffDate.setFullYear(now.getFullYear() - 5); break;
            default: cutoffDate.setFullYear(now.getFullYear() - 1);
        }

        return priceData.filter(d => new Date(d.date) >= cutoffDate);
    }

    /**
     * Format date for chart labels
     */
    formatDate(dateStr, timeframe) {
        const date = new Date(dateStr);

        if (timeframe === '1M') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else if (timeframe === '3M' || timeframe === '6M') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }
    }

    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Global instance
window.chartsManager = new ChartsManager();
