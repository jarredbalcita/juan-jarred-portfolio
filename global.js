// Global JavaScript - Shared functionality across all pages

// Initialize all common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
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
}

// Form validation utility
function initFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.style.borderColor = 'var(--success)';
            } else {
                this.style.borderColor = 'var(--alert)';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'var(--alert)' && this.checkValidity()) {
                this.style.borderColor = 'var(--white)';
            }
        });
    });
}

// Contact form submission handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'block';
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Reset form
                this.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            } else {
                // Fallback for pages without success message element
                alert('Thanks for your message! I\'ll get back to you soon.');
                this.reset();
            }
        });
        
        // Initialize form validation
        initFormValidation();
    }
}

// Utility function to set active navigation item
function setActiveNavItem(pageName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page
    document.querySelectorAll(`a[href="${pageName}.html"], a[href="index.html"]`).forEach(link => {
        if ((pageName === 'home' && link.getAttribute('href') === 'index.html') ||
            link.getAttribute('href') === `${pageName}.html`) {
            link.classList.add('active');
        }
    });
}

// Initialize page-specific functionality
function initPage(pageName) {
    setActiveNavItem(pageName);
    
    // Initialize contact form if on contact page or home page
    if (pageName === 'contact' || pageName === 'home') {
        initContactForm();
    }
}

// Export functions for use in individual pages if needed
window.GlobalJS = {
    initNavigation,
    initSmoothScrolling,
    initFormValidation,
    initContactForm,
    setActiveNavItem,
    initPage
};