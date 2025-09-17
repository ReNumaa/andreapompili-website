// Blog JavaScript - Filter and Search Functionality

class BlogManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentFilters = {
            month: '',
            tag: ''
        };

        this.init();
    }

    async init() {
        await this.loadArticles();
        this.setupEventListeners();
        this.setupTagFilters();
        this.setupURLParams();
        this.renderArticles();
    }

    async loadArticles() {
        try {
            document.getElementById('loading').style.display = 'block';
            console.log('Caricamento articoli...');
            const response = await fetch('data/articles.json');
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.articles = await response.json();
            console.log('Articoli caricati:', this.articles.length);
            this.filteredArticles = [...this.articles];
            document.getElementById('loading').style.display = 'none';
        } catch (error) {
            console.error('Error loading articles:', error);
            document.getElementById('loading').innerHTML = '<i class="fas fa-exclamation-triangle"></i>Errore nel caricamento degli articoli: ' + error.message;

            // Fallback: usa dati hardcoded se il fetch fallisce
            this.articles = [
                {
                    "id": "proxmox-vs-esxi-2025",
                    "title": "Proxmox vs ESXi: quale hypervisor scegliere nel 2025",
                    "date": "2025-09-15",
                    "month": "2025-09",
                    "tags": ["virtualizzazione", "proxmox", "esxi", "infrastructure"],
                    "excerpt": "Confronto approfondito tra le due piattaforme di virtualizzazione più diffuse. Analisi di costi, performance e casi d'uso per aiutarti nella scelta migliore per la tua infrastruttura.",
                    "url": "proxmox-vs-esxi-2025.html",
                    "readTime": "10 min",
                    "featured": true
                },
                {
                    "id": "cloud-migration-strategy",
                    "title": "Migrazione Cloud: strategia e implementazione",
                    "date": "2025-09-08",
                    "month": "2025-09",
                    "tags": ["cloud", "aws", "azure", "migration", "strategy"],
                    "excerpt": "Guida completa per una migrazione cloud sicura e senza interruzioni. Dalla pianificazione all'esecuzione: strategie, tool e best practices per il successo.",
                    "url": "cloud-migration-strategy.html",
                    "readTime": "12 min",
                    "featured": true
                },
                {
                    "id": "sicurezza-pmi-errori",
                    "title": "Sicurezza informatica per PMI: errori da evitare",
                    "date": "2025-09-01",
                    "month": "2025-09",
                    "tags": ["security", "cybersecurity", "pmi", "best-practices"],
                    "excerpt": "I 7 errori più comuni che mettono a rischio i dati aziendali e come evitarli. Consigli pratici e checklist per proteggere la tua attività dai rischi cyber.",
                    "url": "sicurezza-pmi-errori.html",
                    "readTime": "8 min",
                    "featured": false
                }
            ];
            this.filteredArticles = [...this.articles];
            document.getElementById('loading').style.display = 'none';
            console.log('Usando dati fallback, articoli:', this.articles.length);
        }
    }

    setupEventListeners() {

        // Desktop Month filter
        const monthFilter = document.getElementById('monthFilter');
        monthFilter.addEventListener('change', (e) => {
            this.currentFilters.month = e.target.value;
            this.applyFilters();
        });

        // Desktop Tag filter
        const tagFilter = document.getElementById('tagFilter');
        tagFilter.addEventListener('change', (e) => {
            this.currentFilters.tag = e.target.value;
            this.applyFilters();
        });

        // Desktop Clear filters
        const clearFilters = document.getElementById('clearFilters');
        clearFilters.addEventListener('click', () => {
            this.clearAllFilters();
        });

        // Mobile filter popup
        const mobileFilterToggle = document.getElementById('mobileFilterToggle');
        const filterPopupOverlay = document.getElementById('filterPopupOverlay');
        const filterPopupClose = document.getElementById('filterPopupClose');
        const applyFiltersMobile = document.getElementById('applyFiltersMobile');
        const clearFiltersMobile = document.getElementById('clearFiltersMobile');

        mobileFilterToggle.addEventListener('click', () => {
            this.openMobileFilters();
        });

        filterPopupClose.addEventListener('click', () => {
            this.closeMobileFilters();
        });

        filterPopupOverlay.addEventListener('click', (e) => {
            if (e.target === filterPopupOverlay) {
                this.closeMobileFilters();
            }
        });

        applyFiltersMobile.addEventListener('click', () => {
            this.applyMobileFilters();
        });

        clearFiltersMobile.addEventListener('click', () => {
            this.clearMobileFilters();
        });

    }

    setupTagFilters() {
        const allTags = [...new Set(this.articles.flatMap(article => article.tags))].sort();
        const tagSelect = document.getElementById('tagFilter');
        const tagSelectMobile = document.getElementById('tagFilterMobile');

        // Clear existing options except the first one
        tagSelect.innerHTML = '<option value="">Tutti i tag</option>';
        tagSelectMobile.innerHTML = '<option value="">Tutti i tag</option>';

        allTags.forEach(tag => {
            // Desktop option
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);

            // Mobile option
            const optionMobile = document.createElement('option');
            optionMobile.value = tag;
            optionMobile.textContent = tag;
            tagSelectMobile.appendChild(optionMobile);
        });
    }

    setupURLParams() {
        const urlParams = new URLSearchParams(window.location.search);

        // Handle month param
        const monthParam = urlParams.get('month');
        if (monthParam) {
            document.getElementById('monthFilter').value = monthParam;
            this.currentFilters.month = monthParam;
        }

        // Handle tag param
        const tagParam = urlParams.get('tag');
        if (tagParam) {
            this.currentFilters.tag = tagParam;
            document.getElementById('tagFilter').value = tagParam;
        }

        if (monthParam || tagParam) {
            this.applyFilters();
        }
    }


    applyFilters() {
        this.filteredArticles = this.articles.filter(article => {
            // Month filter
            if (this.currentFilters.month && article.month !== this.currentFilters.month) {
                return false;
            }

            // Tag filter
            if (this.currentFilters.tag && !article.tags.includes(this.currentFilters.tag)) {
                return false;
            }

            return true;
        });

        this.renderArticles();
        this.updateURL();
    }


    renderArticles() {
        this.renderFeaturedArticles();
        this.renderAllArticles();

        // Show/hide no results
        const noResults = document.getElementById('noResults');
        noResults.style.display = this.filteredArticles.length === 0 ? 'block' : 'none';

        // Show/hide featured section
        const featuredSection = document.getElementById('featuredSection');
        const hasFeatured = this.filteredArticles.some(article => article.featured);
        featuredSection.style.display = hasFeatured ? 'block' : 'none';
    }

    renderFeaturedArticles() {
        const featuredGrid = document.getElementById('featuredGrid');
        const featuredArticles = this.filteredArticles.filter(article => article.featured);

        featuredGrid.innerHTML = featuredArticles.map(article =>
            this.createArticleCard(article, true)
        ).join('');
    }

    renderAllArticles() {
        const articlesGrid = document.getElementById('articlesGrid');
        const regularArticles = this.filteredArticles.filter(article => !article.featured);

        articlesGrid.innerHTML = regularArticles.map(article =>
            this.createArticleCard(article, false)
        ).join('');
    }

    createArticleCard(article, isFeatured = false) {
        const featuredClass = isFeatured ? 'featured' : '';

        const statusBadge = article.status === 'coming-soon'
            ? '<span class="coming-soon">In preparazione</span>'
            : `<span><i class="fas fa-clock"></i> ${article.readTime}</span>`;

        const readMoreText = article.status === 'coming-soon'
            ? 'Articolo in preparazione <i class="fas fa-clock"></i>'
            : 'Leggi l\'articolo completo <i class="fas fa-arrow-right"></i>';

        const articleUrl = article.status === 'coming-soon'
            ? '#'
            : article.url;

        const clickHandler = article.status === 'coming-soon'
            ? 'onclick="showComingSoon()" style="cursor: not-allowed; opacity: 0.7;"'
            : '';

        return `
            <article class="article-card ${featuredClass}">
                <div class="article-image"></div>
                <div class="article-content">
                    <div class="article-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(article.date)}</span>
                        ${statusBadge}
                    </div>
                    <h3 class="article-title">
                        <a href="${articleUrl}" ${clickHandler}>${article.title}</a>
                    </h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-tags">
                        ${article.tags.map(tag =>
                            `<a href="?tag=${tag}" class="article-tag">${tag}</a>`
                        ).join('')}
                    </div>
                    <a href="${articleUrl}" class="read-more" ${clickHandler}>
                        ${readMoreText}
                    </a>
                </div>
            </article>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('it-IT', options);
    }


    updateURL() {
        if (!this.isFiltered()) {
            // Clear URL params if no filters are active
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        const params = new URLSearchParams();

        if (this.currentFilters.month) {
            params.set('month', this.currentFilters.month);
        }

        if (this.currentFilters.tag) {
            params.set('tag', this.currentFilters.tag);
        }

        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newURL);
    }

    isFiltered() {
        return this.currentFilters.month ||
               this.currentFilters.tag;
    }

    clearAllFilters() {
        // Clear filters
        this.currentFilters = {
            month: '',
            tag: ''
        };

        // Clear form inputs
        document.getElementById('monthFilter').value = '';
        document.getElementById('tagFilter').value = '';

        // Clear URL
        window.history.replaceState({}, '', window.location.pathname);

        // Re-render
        this.applyFilters();
    }

    openMobileFilters() {
        // Sync mobile filters with current filters
        document.getElementById('monthFilterMobile').value = this.currentFilters.month;
        document.getElementById('tagFilterMobile').value = this.currentFilters.tag;

        document.getElementById('filterPopupOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileFilters() {
        document.getElementById('filterPopupOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    applyMobileFilters() {
        // Get values from mobile filters
        const monthValue = document.getElementById('monthFilterMobile').value;
        const tagValue = document.getElementById('tagFilterMobile').value;

        // Update current filters
        this.currentFilters.month = monthValue;
        this.currentFilters.tag = tagValue;

        // Sync desktop filters
        document.getElementById('monthFilter').value = monthValue;
        document.getElementById('tagFilter').value = tagValue;

        // Apply filters and close popup
        this.applyFilters();
        this.closeMobileFilters();
    }

    clearMobileFilters() {
        // Clear mobile form inputs
        document.getElementById('monthFilterMobile').value = '';
        document.getElementById('tagFilterMobile').value = '';

        // Clear current filters
        this.currentFilters = {
            month: '',
            tag: ''
        };

        // Sync desktop filters
        document.getElementById('monthFilter').value = '';
        document.getElementById('tagFilter').value = '';

        // Clear URL
        window.history.replaceState({}, '', window.location.pathname);

        // Re-render and close popup
        this.applyFilters();
        this.closeMobileFilters();
    }
}

// Global functions
window.clearAllFilters = function() {
    if (window.blogManager) {
        window.blogManager.clearAllFilters();
    }
};

window.showComingSoon = function() {
    alert('Questo articolo è ancora in preparazione. Torna presto per leggerlo!');
};

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});

// Handle tag clicks from URL
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('article-tag')) {
        e.preventDefault();
        const tag = e.target.textContent;

        // Clear other filters and set this tag
        if (window.blogManager) {
            window.blogManager.clearAllFilters();
            window.blogManager.currentFilters.tag = tag;

            // Update UI
            document.getElementById('tagFilter').value = tag;

            window.blogManager.applyFilters();
        }
    }
});
