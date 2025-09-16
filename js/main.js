// Main JavaScript for Andrea Pompili Portfolio

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Services page-like scroll functionality
function initServicesScroll() {
    const servicesScroll = document.getElementById('servicesScroll');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const cards = document.querySelectorAll('.service-card-mobile');
    
    if (!servicesScroll || !scrollDots.length || !cards.length) return;
    
    totalCards = cards.length;
    currentCardIndex = 0;
    
    function updateCards() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'previous', 'next');
            
            if (index === currentCardIndex) {
                card.classList.add('active');
            } else if (index < currentCardIndex) {
                card.classList.add('previous');
            } else {
                card.classList.add('next');
            }
        });
        
        // Update dots
        scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentCardIndex);
        });
    }
    
    function goToCard(index) {
        if (index >= 0 && index < cards.length) {
            currentCardIndex = index;
            updateCards();
        }
    }
    
    // Touch swipe handling
    let startX = 0;
    let startY = 0;
    let isSwipe = false;
    
    servicesScroll.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwipe = false;
    });
    
    servicesScroll.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(startX - currentX);
        const diffY = Math.abs(startY - currentY);
        
        // Detect horizontal swipe
        if (diffX > diffY && diffX > 30) {
            isSwipe = true;
            e.preventDefault();
        }
    });
    
    servicesScroll.addEventListener('touchend', (e) => {
        if (!startX || !isSwipe) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - next card
                goToCard(currentIndex + 1);
            } else {
                // Swipe right - previous card
                goToCard(currentIndex - 1);
            }
        }
        
        startX = 0;
        startY = 0;
        isSwipe = false;
    });
    
    // Dot navigation
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToCard(index);
        });
    });
    
    // Initialize first card as active
    updateCards();
}

// Initialize on load
window.addEventListener('load', () => {
    initServicesScroll();
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Admin panel toggle
function toggleAdmin() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('active');
}

// Publish article
function publishArticle() {
    const title = document.getElementById('articleTitle').value.trim();
    const content = document.getElementById('articleContent').value.trim();
    
    if (!title || !content) {
        alert('⚠️ Inserisci titolo e contenuto dell\'articolo');
        return;
    }
    
    // Create new blog card
    const blogContainer = document.getElementById('blogContainer');
    const article = document.createElement('article');
    article.className = 'blog-card loading';
    
    const readTime = Math.max(1, Math.ceil(content.split(' ').length / 200));
    const today = new Date().toLocaleDateString('it-IT');
    
    article.innerHTML = `
        <div class="blog-image"></div>
        <div class="blog-content">
            <div class="blog-meta">
                <span><i class="fas fa-calendar"></i> ${today}</span>
                <span><i class="fas fa-clock"></i> ${readTime} min</span>
            </div>
            <h3 class="blog-title">${title}</h3>
            <p class="blog-excerpt">
                ${content.substring(0, 120)}...
            </p>
            <a href="#" class="read-more">
                Leggi l'articolo <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    blogContainer.insertBefore(article, blogContainer.firstChild);
    
    // Clear form
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleContent').value = '';
    
    // Close admin panel
    document.getElementById('adminPanel').classList.remove('active');
    
    // Show success notification
    showNotification('✅ Articolo pubblicato con successo!', 'success');
    
    // Scroll to blog section
    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('slide-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Loading animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .blog-card, .feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
});

// Coming soon notification for blog articles
function showComingSoon() {
    showNotification('📝 Articolo in preparazione! Sarà disponibile presto.', 'info');
}

// Global navigation function for cards
let currentCardIndex = 0;
let totalCards = 0;

function navigateCard(direction) {
    const cards = document.querySelectorAll('.service-card-mobile');
    if (!cards.length) return;
    
    totalCards = cards.length;
    currentCardIndex = Math.max(0, Math.min(totalCards - 1, currentCardIndex + direction));
    
    // Update cards
    cards.forEach((card, index) => {
        card.classList.remove('active', 'previous', 'next');
        
        if (index === currentCardIndex) {
            card.classList.add('active');
        } else if (index < currentCardIndex) {
            card.classList.add('previous');
        } else {
            card.classList.add('next');
        }
    });
    
    // Update dots
    const scrollDots = document.querySelectorAll('.scroll-dot');
    scrollDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCardIndex);
    });
}

// Make functions available globally
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleAdmin = toggleAdmin;
window.publishArticle = publishArticle;
window.showComingSoon = showComingSoon;
window.initServicesScroll = initServicesScroll;
window.navigateCard = navigateCard;