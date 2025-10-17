document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality with improved storage handling
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Initialize theme
    const initTheme = () => {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                body.classList.add('dark-mode');
            }
        } catch (e) {
            console.log('Theme preference not saved');
        }
    };
    
    initTheme();
    
    // Toggle theme with smooth transition
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        try {
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        } catch (e) {
            console.log('Unable to save theme preference');
        }
        
        // Add ripple effect
        createRipple(themeToggle, event);
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    // Function to navigate to a section with smooth animation
    const navigateToSection = (targetId) => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to corresponding nav link
        const correspondingLink = document.querySelector(`nav a[href="#${targetId}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to top smoothly on mobile
            if (window.innerWidth <= 968) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        // Update URL without page reload
        history.pushState(null, '', `#${targetId}`);
    };

    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Add click event listeners to any other links that navigate to sections
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (!link.closest('nav')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                navigateToSection(targetId);
            });
        }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            navigateToSection(hash);
        } else {
            navigateToSection('home');
        }
    });
    
    // Initialize with hash if present
    if (window.location.hash) {
        const initialHash = window.location.hash.substring(1);
        navigateToSection(initialHash);
    }

    // Scroll to top button functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Show success message (you can replace this with actual form submission)
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', formData);
        });
    }

    // Skill badges animation on scroll
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe projects
        document.querySelectorAll('.project').forEach(project => {
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            project.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(project);
        });
    };

    observeElements();

    // Ripple effect function
    function createRipple(element, event) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = element.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        element.appendChild(circle);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#2ecc71' : '#3498db'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
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

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Alt + 1-4 for quick navigation
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    navigateToSection('home');
                    break;
                case '2':
                    navigateToSection('about');
                    break;
                case '3':
                    navigateToSection('projects');
                    break;
                case '4':
                    navigateToSection('contact');
                    break;
            }
        }
    });

    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Your scroll handling code here
        }, 100);
    });

    console.log('Portfolio initialized successfully! 🚀');
});
