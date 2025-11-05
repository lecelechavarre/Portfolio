document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    const navigateToSection = (targetId) => {
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to corresponding nav link and section
        const correspondingLink = document.querySelector(`nav a[href="#${targetId}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
        
        document.getElementById(targetId).classList.add('active');
        
        // Scroll to top of section
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // GitHub Repositories Fetch
    async function fetchGitHubRepos() {
        const projectsGrid = document.getElementById('projectsGrid');
        
        try {
            const response = await fetch('https://api.github.com/users/lecelechavarre/repos?sort=updated&per_page=6');
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            
            if (repos.length === 0) {
                projectsGrid.innerHTML = '<div class="loading">No public repositories found.</div>';
                return;
            }
            
            projectsGrid.innerHTML = repos.map(repo => `
                <div class="project-card">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <div class="project-meta">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span><i class="fas fa-eye"></i> ${repo.watchers_count}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        View on GitHub <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            projectsGrid.innerHTML = `
                <div class="loading">
                    <p>Unable to load projects. Please check your internet connection.</p>
                    <a href="https://github.com/lecelechavarre" target="_blank" class="cta-button" style="margin-top: 1rem;">
                        View on GitHub
                    </a>
                </div>
            `;
        }
    }

    // Fetch repositories when projects section is loaded
    const projectsSection = document.getElementById('projects');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fetchGitHubRepos();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(projectsSection);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });

    // Card flip functionality
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
        
        // For accessibility, allow flipping with Enter key
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                this.classList.toggle('flipped');
            }
        });
    });
    
    // Add animation delay for card entrance
    const cardContainers = document.querySelectorAll('.card-container');
    cardContainers.forEach((container, index) => {
        container.style.animationDelay = `${index * 0.1}s`;
    });
});
