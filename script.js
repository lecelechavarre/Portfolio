document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // DOM Element References
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const contactForm = document.getElementById('contactForm');

    // ============================================
    // Theme Management
    // ============================================
    
    /**
     * Initialize theme from localStorage
     */
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
        }
    };

    /**
     * Toggle between light and dark mode
     */
    const toggleTheme = () => {
        body.classList.toggle('dark-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    };

    // Initialize theme on page load
    initTheme();

    // Add event listener to theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ============================================
    // Navigation Management
    // ============================================
    
    /**
     * Navigate to a specific section
     * @param {string} targetId - The ID of the section to navigate to
     */
    const navigateToSection = (targetId) => {
        // Remove active class from all navigation links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to the corresponding navigation link
        const correspondingLink = document.querySelector(`nav a[href="#${targetId}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }

        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        
        // Show target section with animation
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to top on mobile devices
            if (window.innerWidth <= 968) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        // Update URL without page reload
        history.pushState(null, '', `#${targetId}`);
    };

    /**
     * Set up navigation link event listeners
     */
    const initNavigation = () => {
        // Add click event to main navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                navigateToSection(targetId);
            });
        });

        // Add click event to all internal anchor links (e.g., CTA buttons)
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.closest('nav')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    if (targetId) {
                        navigateToSection(targetId);
                    }
                });
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.substring(1);
            navigateToSection(hash || 'home');
        });

        // Initialize with URL hash if present
        if (window.location.hash) {
            const initialHash = window.location.hash.substring(1);
            navigateToSection(initialHash);
        }
    };

    // Initialize navigation
    initNavigation();

    // ============================================
    // Scroll to Top Button
    // ============================================
    
    /**
     * Show/hide scroll to top button based on scroll position
     */
    const handleScroll = () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    };

    /**
     * Scroll to top of page smoothly
     */
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Add scroll event listener with debouncing
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
    });

    // Add click event to scroll to top button
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', scrollToTop);
    }

    // ============================================
    // Contact Form Handling
    // ============================================
    
    /**
     * Handle contact form submission
     * @param {Event} e - The form submit event
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            subject: document.getElementById('subject')?.value,
            message: document.getElementById('message')?.value
        };
        
        // Validate form data
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Show success notification
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Log form data (In production, send to backend)
        console.log('Form submitted:', formData);
        
        // TODO: Implement actual form submission to backend
        // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
    };

    // Add form submit event listener
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // ============================================
    // Notification System
    // ============================================
    
    /**
     * Display a notification message
     * @param {string} message - The notification message
     * @param {string} type - The notification type ('success', 'error', 'info')
     */
    const showNotification = (message, type = 'info') => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Set notification styles
        const backgroundColor = {
            success: '#10b981',
            error: '#ef4444',
            info: '#2563eb'
        }[type] || '#2563eb';
        
        notification.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 16px 24px;
            background: ${backgroundColor};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-size: 15px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        // Add notification animations to document if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { 
                        transform: translateX(100%); 
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
                        transform: translateX(100%); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add notification to DOM
        document.body.appendChild(notification);

        // Auto-remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    };

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    
    /**
     * Initialize intersection observer for scroll animations
     */
    const initScrollAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe project cards for animation
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Observe other animatable elements
        document.querySelectorAll('.about-list li').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    };

    // Initialize scroll animations
    initScrollAnimations();

    // ============================================
    // Page Load Animation
    // ============================================
    
    /**
     * Animate page on load
     */
    const initPageAnimation = () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    };

    // Initialize page animation
    window.addEventListener('load', initPageAnimation);

    // ============================================
    // Keyboard Navigation
    // ============================================
    
    /**
     * Handle keyboard shortcuts for navigation
     * Alt + 1: Home
     * Alt + 2: About
     * Alt + 3: Projects
     * Alt + 4: Contact
     */
    const handleKeyboardNavigation = (e) => {
        if (e.altKey) {
            const keyMap = {
                '1': 'home',
                '2': 'about',
                '3': 'projects',
                '4': 'contact'
            };
            
            const targetSection = keyMap[e.key];
            if (targetSection) {
                e.preventDefault();
                navigateToSection(targetSection);
            }
        }
    };

    // Add keyboard navigation event listener
    document.addEventListener('keydown', handleKeyboardNavigation);

    // ============================================
    // Performance Optimization
    // ============================================
    
    /**
     * Debounce function for performance optimization
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce delay in milliseconds
     * @returns {Function} - The debounced function
     */
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // ============================================
    // Console Message
    // ============================================
    
    console.log('%c Portfolio Initialized Successfully! 🚀', 'color: #2563eb; font-size: 16px; font-weight: bold;');
    console.log('%c Developed by Lecel Ann Harvey Echavarre', 'color: #10b981; font-size: 12px;');
    
});
