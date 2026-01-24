// Main Application Controller

class StockMemoApp {
    constructor() {
        this.memoGenerator = new MemoGenerator();
        this.chartsManager = new ChartsManager();
        this.currentResearch = null;
        this.searchTimeout = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCompanySearch();
    }

    setupEventListeners() {
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            this.showSearchSection();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportMemo();
        });
    }

    setupCompanySearch() {
        const input = document.getElementById('companyName');
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        resultsDiv.id = 'searchResults';
        input.parentNode.appendChild(resultsDiv);

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            if (query.length < 2) {
                resultsDiv.style.display = 'none';
                return;
            }

            this.searchTimeout = setTimeout(async () => {
                await this.searchCompanies(query);
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
                resultsDiv.style.display = 'none';
            }
        });
    }

    async searchCompanies(query) {
        const resultsDiv = document.getElementById('searchResults');
        const exchange = document.getElementById('exchange').value;

        try {
            resultsDiv.innerHTML = '<div class="search-loading">Searching...</div>';
            resultsDiv.style.display = 'block';

            const response = await fetch(`/api/search-companies?q=${encodeURIComponent(query)}&exchange=${exchange}`);
            const data = await response.json();

            if (data.companies && data.companies.length > 0) {
                resultsDiv.innerHTML = data.companies.map(company => `
                    <div class="search-result-item" data-name="${company.name}">
                        <div class="company-name">${company.name}</div>
                        <div class="company-symbol">${company.symbol} · ${company.exchange}</div>
                    </div>
                `).join('');

                resultsDiv.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        document.getElementById('companyName').value = item.dataset.name;
                        resultsDiv.style.display = 'none';
                    });
                });
            } else {
                resultsDiv.innerHTML = '<div class="search-no-results">No companies found</div>';
            }
        } catch (error) {
            console.error('Search failed:', error);
            resultsDiv.innerHTML = '<div class="search-error">Search failed</div>';
        }
    }

    async handleSearch() {
        const companyName = document.getElementById('companyName').value.trim();
        const exchange = document.getElementById('exchange').value;

        if (!companyName) {
            this.showError('Please enter a company name');
            return;
        }

        this.showLoadingSection(companyName);

        try {
            const response = await fetch('/api/generate-memo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    companyName,
                    exchange
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Research failed');
            }

            const { data } = await response.json();
            this.currentResearch = data;

            this.updateProgress('Research complete!', 100);
            await new Promise(resolve => setTimeout(resolve, 500));

            const memoHTML = this.memoGenerator.generateMemo(
                data.company,
                data.research
            );

            this.displayMemo(memoHTML, data);

        } catch (error) {
            console.error('Research failed:', error);
            this.showError(`Research failed: ${error.message}`);
            this.showSearchSection();
        }
    }

    showLoadingSection(companyName) {
        document.getElementById('searchSection').style.display = 'none';
        document.getElementById('memoSection').style.display = 'none';
        document.getElementById('loadingSection').style.display = 'block';
        document.getElementById('loadingCompany').textContent = companyName;
    }

    updateProgress(status, progress) {
        document.getElementById('loadingStatus').textContent = status;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    displayMemo(memoHTML, researchResult) {
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('memoSection').style.display = 'block';

        document.getElementById('memoContent').innerHTML = memoHTML;

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Charts disabled for template version
        /*
        if (researchResult.research.financialStructure?.segments) {
            const financialSection = document.querySelector('.memo-content .memo-section:nth-child(3)');
            if (financialSection) {
                const chartContainer = document.createElement('div');
                chartContainer.id = 'segmentChart';
                chartContainer.className = 'chart-container';
                financialSection.appendChild(chartContainer);
        
                this.chartsManager.createSegmentChart(
                    'segmentChart',
                    researchResult.research.financialStructure.segments
                );
            }
        }
        */
    }

    showSearchSection() {
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('memoSection').style.display = 'none';
        document.getElementById('searchSection').style.display = 'block';

        document.getElementById('companyName').value = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    exportMemo() {
        if (!this.currentResearch) {
            this.showError('No memo to export');
            return;
        }

        const plainText = this.memoGenerator.generatePlainText(
            this.currentResearch.company,
            this.currentResearch.research
        );

        const blob = new Blob([plainText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentResearch.company.name.replace(/[^a-z0-9]/gi, '_')}_Research_Memo.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showSuccess('Memo exported successfully');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? 'var(--color-error)' : type === 'success' ? 'var(--color-success)' : 'var(--color-primary)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
from {
    transform: translateX(400px);
    opacity: 0;
}
to {
    transform: translateX(0);
    opacity: 1;
}
}
 
@keyframes slideOut {
from {
    transform: translateX(0);
    opacity: 1;
}
to {
    transform: translateX(400px);
    opacity: 0;
}
}
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.stockMemoApp = new StockMemoApp();
});
