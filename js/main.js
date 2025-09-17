// Main JavaScript for Andrea Pompili Portfolio

// Smooth scrolling for navigation with navbar offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const isMobile = window.innerWidth <= 768;

            let targetPosition;
            if (isMobile) {
                targetPosition = target.offsetTop - navbarHeight + 20; // Mobile: scroll up more
            } else {
                targetPosition = target.offsetTop - navbarHeight + 50; // Desktop: scroll up even more
            }

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 20;
        if (scrollY >= sectionTop) {
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
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    const isActive = mobileMenu.classList.contains('active');

    mobileMenu.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');

    document.body.style.overflow = !isActive ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Services smooth scroll functionality
function initServicesScroll() {
    const servicesScroll = document.getElementById('servicesScroll');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    
    if (!servicesScroll || !scrollDots.length) return;
    
    servicesScroll.addEventListener('scroll', () => {
        const cardWidth = 300 + 24; // updated card width + gap
        const scrollLeft = servicesScroll.scrollLeft;
        const activeIndex = Math.round(scrollLeft / cardWidth);

        // Update dots (now 3 cards)
        scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    });
    
    // Enhanced touch handling for smooth scrolling
    let startX = 0;
    let scrollStart = 0;
    
    servicesScroll.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        scrollStart = servicesScroll.scrollLeft;
    });
    
    servicesScroll.addEventListener('touchmove', (e) => {
        if (!startX) return;
        
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        servicesScroll.scrollLeft = scrollStart + diff;
    });
    
    servicesScroll.addEventListener('touchend', () => {
        startX = 0;
        scrollStart = 0;
    });
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


// Make functions available globally
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleAdmin = toggleAdmin;
window.publishArticle = publishArticle;
window.showComingSoon = showComingSoon;
window.initServicesScroll = initServicesScroll;
