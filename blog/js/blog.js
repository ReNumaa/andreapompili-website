// Blog JavaScript - Filter and Search Functionality

class BlogManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentFilters = {
            month: '',
            tag: ''
        };
        this.currentPage = 1;
        this.articlesPerPage = this.getArticlesPerPage();

        this.init();
    }

    getArticlesPerPage() {
        return window.innerWidth <= 768 ? 3 : 6;
    }

    async init() {
        await this.loadArticles();
        this.setupEventListeners();
        this.setupTagFilters();
        this.setupMonthFilters();
        this.setupURLParams();
        this.renderArticles();
        this.setupResponsive();
    }

    setupResponsive() {
        window.addEventListener('resize', () => {
            const newArticlesPerPage = this.getArticlesPerPage();
            if (newArticlesPerPage !== this.articlesPerPage) {
                this.articlesPerPage = newArticlesPerPage;
                this.currentPage = 1; // Reset to first page when changing articles per page
                this.renderArticles();
            }
        });
    }

    async loadArticles() {
        try {
            document.getElementById('loading').style.display = 'block';
            console.log('Caricamento articoli...');
            const response = await fetch(`data/articles.json?t=${Date.now()}`);
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.articles = await response.json();
            // Sort articles by date (newest first)
            this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            console.log('Articoli caricati:', this.articles.length);
            this.filteredArticles = [...this.articles];
            document.getElementById('loading').style.display = 'none';
        } catch (error) {
            console.error('Error loading articles:', error);
            document.getElementById('loading').innerHTML = '<i class="fas fa-exclamation-triangle"></i>Errore nel caricamento degli articoli: ' + error.message;

            // Fallback: usa dati hardcoded se il fetch fallisce
            this.articles = [
                {
                    "id": "interrail-via-degli-dei",
                    "title": "Zaino in Spalla",
                    "date": "2025-04-14",
                    "month": "2025-04",
                    "tags": ["Viaggi"],
                    "excerpt": "Le mie vacanze zaino in spalla stanno per iniziare e la mia mente è già proiettata verso l'avventura che mi aspetta. Quest'anno ho deciso di combinare due esperienze completamente diverse: un viaggio in Interrail attraverso l'Europa e il Cammino degli Dei.",
                    "url": "interrail-via-degli-dei.html",
                    "readTime": "4 min",
                    "featured": true,
                    "image": "../assets/images/blog_images/ZainoInSpalla.png"
                },
                {
                    "id": "rilevazione-dati-finanziari",
                    "title": "Dati Finanziari",
                    "date": "2025-02-25",
                    "month": "2025-02",
                    "tags": ["Finanza Personale"],
                    "excerpt": "Gestire le proprie finanze personali è fondamentale per mantenere un equilibrio economico e pianificare il futuro con sicurezza. Rilevare con precisione entrate e uscite permette di avere una visione chiara della propria situazione economica.",
                    "url": "rilevazione-dati-finanziari.html",
                    "readTime": "6 min",
                    "featured": true,
                    "image": "../assets/images/blog_images/Budgeting.png"
                },
                {
                    "id": "benvenuti-blog-personale",
                    "title": "Il Mio Blog",
                    "date": "2025-02-17",
                    "month": "2025-02",
                    "tags": ["Personale"],
                    "excerpt": "Mi chiamo Andrea Pompili e sono una persona appassionata di crescita personale, tecnologia, finanza, sport e viaggi. Ho deciso di creare questo blog per condividere con voi ciò che sto imparando, i miei interessi e le mie esperienze.",
                    "url": "benvenuti-blog-personale.html",
                    "readTime": "8 min",
                    "featured": true,
                    "image": "../assets/images/blog_images/Why.png"
                }
            ];
            // Sort fallback articles by date (newest first)
            this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.filteredArticles = [...this.articles];
            document.getElementById('loading').style.display = 'none';
            console.log('Usando dati fallback, articoli:', this.articles.length);
        }
    }

    setupEventListeners() {

        // Desktop and Mobile filter popup
        const desktopFilterToggle = document.getElementById('desktopFilterToggle');
        const filterPopupOverlay = document.getElementById('filterPopupOverlay');
        const filterPopupClose = document.getElementById('filterPopupClose');
        const applyFiltersMobile = document.getElementById('applyFiltersMobile');
        const clearFiltersMobile = document.getElementById('clearFiltersMobile');

        desktopFilterToggle.addEventListener('click', () => {
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
        const tagSelectMobile = document.getElementById('tagFilterMobile');

        // Clear existing options except the first one
        tagSelectMobile.innerHTML = '<option value="">Tutti i tag</option>';

        allTags.forEach(tag => {
            // Mobile option
            const optionMobile = document.createElement('option');
            optionMobile.value = tag;
            optionMobile.textContent = tag;
            tagSelectMobile.appendChild(optionMobile);
        });
    }

    setupMonthFilters() {
        const allMonths = [...new Set(this.articles.map(article => article.month))].sort().reverse();
        const monthSelectMobile = document.getElementById('monthFilterMobile');

        // Clear existing options except the first one
        monthSelectMobile.innerHTML = '<option value="">Tutti i mesi</option>';

        allMonths.forEach(month => {
            const [year, monthNum] = month.split('-');
            const monthNames = [
                'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
            ];
            const monthName = monthNames[parseInt(monthNum) - 1];
            const displayText = `${monthName} ${year}`;

            const optionMobile = document.createElement('option');
            optionMobile.value = month;
            optionMobile.textContent = displayText;
            monthSelectMobile.appendChild(optionMobile);
        });
    }

    setupURLParams() {
        const urlParams = new URLSearchParams(window.location.search);

        // Handle month param
        const monthParam = urlParams.get('month');
        if (monthParam) {
            this.currentFilters.month = monthParam;
        }

        // Handle tag param
        const tagParam = urlParams.get('tag');
        if (tagParam) {
            this.currentFilters.tag = tagParam;
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

        // Reset to first page when filters change
        this.currentPage = 1;
        this.renderArticles();
        this.updateURL();
    }


    renderArticles() {
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const currentPageArticles = this.filteredArticles.slice(startIndex, endIndex);

        // Render current page articles
        const articlesGrid = document.getElementById('articlesGrid');
        articlesGrid.innerHTML = currentPageArticles.map(article =>
            this.createArticleCard(article, false)
        ).join('');

        // Show/hide no results
        const noResults = document.getElementById('noResults');
        noResults.style.display = this.filteredArticles.length === 0 ? 'block' : 'none';

        // Update pagination
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        const paginationContainer = document.getElementById('paginationContainer');

        // Hide pagination if only one page or no articles
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'block';

        // Update pagination info
        const startIndex = (this.currentPage - 1) * this.articlesPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.articlesPerPage, this.filteredArticles.length);
        const paginationInfo = document.getElementById('paginationInfo');
        paginationInfo.textContent = `Mostrando ${startIndex}-${endIndex} di ${this.filteredArticles.length} articoli`;

        // Update previous/next buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        // Update page numbers
        this.renderPageNumbers(totalPages);
    }

    renderPageNumbers(totalPages) {
        const paginationNumbers = document.getElementById('paginationNumbers');
        const currentPage = this.currentPage;
        let pages = [];

        if (totalPages <= 7) {
            // Show all pages if total is 7 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show smart pagination with ellipsis
            if (currentPage <= 4) {
                pages = [1, 2, 3, 4, 5, '...', totalPages];
            } else if (currentPage >= totalPages - 3) {
                pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
            }
        }

        paginationNumbers.innerHTML = pages.map(page => {
            if (page === '...') {
                return '<span class="pagination-ellipsis">...</span>';
            }

            const isActive = page === currentPage;
            return `<button class="pagination-number ${isActive ? 'active' : ''}"
                           onclick="blogManager.goToPage(${page})">${page}</button>`;
        }).join('');
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderArticles();
        // Scroll to top of articles section
        document.getElementById('articlesGrid').scrollIntoView({ behavior: 'smooth' });
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        if (this.currentPage < totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
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

        const imageStyle = article.image
            ? `style="background-image: url('${article.image}'); background-size: cover; background-position: center;"`
            : '';

        return `
            <article class="article-card ${featuredClass}">
                <div class="article-image" ${imageStyle}></div>
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

        // Clear URL
        window.history.replaceState({}, '', window.location.pathname);

        // Reset to first page
        this.currentPage = 1;

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

            window.blogManager.applyFilters();
        }
    }
});