// Info Tooltip Component
// Educational popups for financial terms

class InfoTooltip {
    constructor() {
        this.activeTooltip = null;
        this.definitions = null;
        this.loadDefinitions();
        this.setupEventListeners();
    }

    async loadDefinitions() {
        // Import definitions dynamically for browser compatibility
        try {
            const module = await import('./utils/financial-definitions.js');
            this.definitions = module.financialDefinitions;
        } catch (e) {
            console.warn('Could not load financial definitions:', e);
            this.definitions = {};
        }
    }

    setupEventListeners() {
        // Close tooltip when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activeTooltip &&
                !e.target.closest('.info-tooltip-popup') &&
                !e.target.closest('.info-btn')) {
                this.hideTooltip();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeTooltip) {
                this.hideTooltip();
            }
        });
    }

    /**
     * Create an info button for a metric
     */
    createInfoButton(metricKey, size = 'small') {
        const btn = document.createElement('button');
        btn.className = `info-btn info-btn-${size}`;
        btn.dataset.metric = metricKey;
        btn.innerHTML = 'ℹ️';
        btn.setAttribute('aria-label', `Learn about ${metricKey}`);
        btn.setAttribute('title', 'Click to learn more');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showTooltip(metricKey, btn);
        });

        return btn;
    }

    /**
     * Show tooltip for a metric
     */
    showTooltip(metricKey, anchorElement) {
        // Hide existing tooltip
        this.hideTooltip();

        const definition = this.definitions?.[metricKey];
        if (!definition) {
            console.warn(`No definition found for: ${metricKey}`);
            return;
        }

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'info-tooltip-popup';
        tooltip.innerHTML = this.generateTooltipContent(definition);

        // Position tooltip
        document.body.appendChild(tooltip);
        this.positionTooltip(tooltip, anchorElement);

        // Animate in
        requestAnimationFrame(() => {
            tooltip.classList.add('active');
        });

        this.activeTooltip = tooltip;

        // Close button handler
        tooltip.querySelector('.tooltip-close')?.addEventListener('click', () => {
            this.hideTooltip();
        });
    }

    /**
     * Generate tooltip HTML content
     */
    generateTooltipContent(def) {
        return `
            <div class="tooltip-header">
                <div class="tooltip-title">
                    <span class="tooltip-name">${def.name}</span>
                    <span class="tooltip-category">${def.category}</span>
                </div>
                <button class="tooltip-close" aria-label="Close">×</button>
            </div>
            
            <div class="tooltip-body">
                <div class="tooltip-fullname">${def.fullName}</div>
                
                <p class="tooltip-definition">${def.definition}</p>
                
                <div class="tooltip-formula">
                    <span class="tooltip-label">📐 Formula:</span>
                    <code>${def.formula}</code>
                </div>
                
                <div class="tooltip-interpretation">
                    <div class="interp-item interp-good">
                        <span class="interp-icon">✅</span>
                        <span>${def.interpretation.good}</span>
                    </div>
                    <div class="interp-item interp-warning">
                        <span class="interp-icon">⚠️</span>
                        <span>${def.interpretation.warning}</span>
                    </div>
                    <div class="interp-item interp-context">
                        <span class="interp-icon">💡</span>
                        <span>${def.interpretation.context}</span>
                    </div>
                </div>
                
                ${def.example ? `
                    <div class="tooltip-example">
                        <span class="tooltip-label">📝 Example:</span>
                        <span>${def.example}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Position tooltip relative to anchor
     */
    positionTooltip(tooltip, anchor) {
        const anchorRect = anchor.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const padding = 12;

        // Default position: below and centered
        let top = anchorRect.bottom + padding;
        let left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);

        // Adjust if goes off screen right
        if (left + tooltipRect.width > window.innerWidth - padding) {
            left = window.innerWidth - tooltipRect.width - padding;
        }

        // Adjust if goes off screen left
        if (left < padding) {
            left = padding;
        }

        // If goes below viewport, show above
        if (top + tooltipRect.height > window.innerHeight - padding) {
            top = anchorRect.top - tooltipRect.height - padding;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    /**
     * Hide active tooltip
     */
    hideTooltip() {
        if (this.activeTooltip) {
            this.activeTooltip.classList.remove('active');
            setTimeout(() => {
                this.activeTooltip?.remove();
                this.activeTooltip = null;
            }, 200);
        }
    }

    /**
     * Static method to create inline info button HTML
     */
    static inlineButton(metricKey) {
        return `<button class="info-btn" data-metric="${metricKey}" onclick="window.infoTooltip?.showTooltip('${metricKey}', this)">ℹ️</button>`;
    }
}

// Initialize globally
window.infoTooltip = new InfoTooltip();
