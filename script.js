// ===================================
// Performance & Browser Detection
// ===================================
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===================================
// Custom Cursor - Desktop Only
// ===================================
const initCustomCursor = () => {
    const cursor = document.getElementById('customCursor');
    
    if (!cursor || isTouchDevice()) {
        if (cursor) cursor.style.display = 'none';
        return;
    }

    // Mouse move handler - direct positioning, no delay
    const handleMouseMove = (e) => {
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    };

    // Click effects
    const handleDown = () => cursor.classList.add('clicked');
    const handleUp = () => cursor.classList.remove('clicked');

    // Hide/show cursor when leaving/entering viewport
    const handleMouseLeave = () => cursor.style.opacity = '0';
    const handleMouseEnter = () => cursor.style.opacity = '1';

    // Ensure cursor comes back after switching tabs
    const handleVisibilityChange = () => {
        if (!document.hidden) {
            cursor.style.opacity = '1';
        }
    };
    const handleFocus = () => cursor.style.opacity = '1';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleDown);
        document.removeEventListener('mouseup', handleUp);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseenter', handleMouseEnter);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
    };
};

// ===================================
// Navigation
// ===================================
const initNavigation = () => {
    const nav = document.querySelector('nav');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    
    // Scroll effect
    let lastScroll = 0;
    const handleScroll = () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };
    
    // Throttle scroll event
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) return;
        scrollTimer = setTimeout(() => {
            handleScroll();
            scrollTimer = null;
        }, 100);
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('active');
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
            
            // Animate hamburger
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (!isOpen) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Active link highlighting
    const updateActiveLink = () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
};

// ===================================
// Smooth Scrolling
// ===================================
const initSmoothScrolling = () => {
    if (prefersReducedMotion) return;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ===================================
// Intersection Observer for Animations
// ===================================
const initScrollAnimations = () => {
    if (prefersReducedMotion) {
        // Show all content immediately if user prefers reduced motion
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            el.classList.add('visible');
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.skill-tag, .tech-tag');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0) scale(1)';
                    }, index * 50);
                });
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .project-card, .skill-category'
    );
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Initialize skill and tech tags
    document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px) scale(0.9)';
        tag.style.transition = 'all 0.5s ease';
    });
};

// ===================================
// Form Handling with Validation
// ===================================
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Form validation rules
    const validators = {
        name: (value) => {
            if (!value || value.length < 2) return 'Name must be at least 2 characters';
            if (value.length > 100) return 'Name must be less than 100 characters';
            return '';
        },
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return 'Email is required';
            if (!emailRegex.test(value)) return 'Please enter a valid email';
            return '';
        },
        subject: (value) => {
            if (!value || value.length < 3) return 'Subject must be at least 3 characters';
            if (value.length > 200) return 'Subject must be less than 200 characters';
            return '';
        },
        message: (value) => {
            if (!value || value.length < 10) return 'Message must be at least 10 characters';
            if (value.length > 1000) return 'Message must be less than 1000 characters';
            return '';
        }
    };
    
    // Real-time validation
    const validateField = (field) => {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        const fieldName = field.name;
        const value = field.value.trim();
        
        const error = validators[fieldName] ? validators[fieldName](value) : '';
        
        if (error) {
            formGroup.classList.add('error');
            errorElement.textContent = error;
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `${fieldName}-error`);
            errorElement.id = `${fieldName}-error`;
        } else {
            formGroup.classList.remove('error');
            errorElement.textContent = '';
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        }
        
        return !error;
    };
    
    // Add blur validation to all fields
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            // Clear error on input if field was previously invalid
            if (field.closest('.form-group').classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Check honeypot (spam protection)
        const honeypot = form.querySelector('input[name="honey"]');
        if (honeypot && honeypot.value) {
            console.log('Spam detected');
            return;
        }
        
        // Validate all fields
        const fields = form.querySelectorAll('input:not([name="honey"]), textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Focus first error field
            const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
            if (firstError) firstError.focus();
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        delete data.honey; // Remove honeypot from data
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Simulate API call (replace with actual endpoint)
            await simulateFormSubmission(data);
            
            // Success
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            // Show success message
            const statusElement = form.querySelector('.form-status');
            statusElement.className = 'form-status success';
            statusElement.textContent = 'Thank you for your message! I\'ll get back to you soon.';
            
            // Reset form
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                statusElement.className = 'form-status';
                statusElement.textContent = '';
            }, 3000);
            
        } catch (error) {
            // Error handling
            console.error('Form submission error:', error);
            
            const statusElement = form.querySelector('.form-status');
            statusElement.className = 'form-status error';
            statusElement.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly.';
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
};

// Simulate form submission (replace with actual API call)
const simulateFormSubmission = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (80% of the time)
            if (Math.random() > 0.2) {
                console.log('Form data submitted:', data);
                resolve();
            } else {
                reject(new Error('Network error'));
            }
        }, 1500);
    });
};

// ===================================
// Lazy Loading for Images
// ===================================
const initLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for older browsers
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => imageObserver.observe(img));
    }
};

// ===================================
// Performance Monitoring
// ===================================
const initPerformanceMonitoring = () => {
    // Log performance metrics
    if (window.performance && performance.getEntriesByType) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Performance:', {
                    'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
                    'Page Load Complete': Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms',
                    'Total Load Time': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms'
                });
            }
        });
    }
    
    // Monitor for slow animations
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            const slowDevice = navigator.hardwareConcurrency < 4 || window.devicePixelRatio < 2;
            if (slowDevice && !prefersReducedMotion) {
                // Reduce animations on slow devices
                document.querySelectorAll('.gradient-orb, .parallax-particle').forEach(el => {
                    el.style.animation = 'none';
                });
                console.log('Animations reduced for performance');
            }
        });
    }
};

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    initNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initLazyLoading();
    
    // Enhancement features
    const cursorCleanup = initCustomCursor();
    
    // Performance monitoring (non-blocking)
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            initPerformanceMonitoring();
        });
    } else {
        setTimeout(initPerformanceMonitoring, 1);
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (cursorCleanup) cursorCleanup();
    });
});

// Add loaded class for CSS animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate navigation items on load
    if (!prefersReducedMotion) {
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
});

// Handle visibility change (pause animations when tab is hidden)
document.addEventListener('visibilitychange', () => {
    const animations = document.querySelectorAll('.gradient-orb, .parallax-particle, .floating-element');
    if (document.hidden) {
        animations.forEach(el => el.style.animationPlayState = 'paused');
    } else {
        animations.forEach(el => el.style.animationPlayState = 'running');
    }
});

// Handle resize events efficiently
let resizeTimer;
window.addEventListener('resize', () => {
    // Add resizing class to body to disable transitions during resize
    document.body.classList.add('resizing');
    
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resizing');
    }, 250);
});

// Add ripple effect to buttons
document.querySelectorAll('.btn, .project-card').forEach(element => {
    element.addEventListener('click', function(e) {
        if (prefersReducedMotion) return;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Console Easter Egg
console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold; color: #4A9EFF;');
console.log('%cThanks for checking out my portfolio!', 'font-size: 16px; color: #E0E0E0;');
console.log('%cIf you\'re interested in working together, feel free to reach out!', 'font-size: 14px; color: #B0B0B0;');
console.log('%c📧 jarredbalcita@gmail.com', 'font-size: 14px; color: #4A9EFF;');