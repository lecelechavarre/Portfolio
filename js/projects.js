// PROJECTS SECTION FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.getElementById('projectsGrid');
    const viewAllContainer = document.getElementById('viewAllContainer');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Statistics elements
    const totalProjectsEl = document.getElementById('totalProjects');
    const totalStarsEl = document.getElementById('totalStars');
    const pinnedProjectsEl = document.getElementById('pinnedProjects');
    
    let allRepos = [];
    let showingAllRepos = false;
    let currentFilter = 'all';

    // Function to create project card HTML
    function createProjectCard(repo) {
        // Determine language and icon
        const language = repo.language ? repo.language.toLowerCase() : 'code';
        const icon = getLanguageIcon(language);
        const techTags = generateTechTags(repo);
        
        return `
            <div class="project-card" data-languages="${language}" data-pinned="${repo.pinned || false}">
                <div class="project-image">
                    <i class="${icon}"></i>
                </div>
                <div class="project-content">
                    <div class="project-title">
                        <span>${repo.name}</span>
                        ${repo.pinned ? '<i class="fas fa-thumbtack" title="Pinned on GitHub"></i>' : ''}
                    </div>
                    <p class="project-description">${repo.description || 'No description available.'}</p>
                    <div class="project-tech">
                        ${techTags}
                    </div>
                    <div class="project-footer">
                        <div class="project-stats">
                            <div class="project-stat">
                                <i class="fas fa-star"></i>
                                <span>${repo.stargazers_count}</span>
                            </div>
                            <div class="project-stat">
                                <i class="fas fa-code-branch"></i>
                                <span>${repo.forks_count}</span>
                            </div>
                            <div class="project-stat">
                                <i class="fas fa-eye"></i>
                                <span>${repo.watchers_count}</span>
                            </div>
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            View Code <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to get appropriate icon for language
    function getLanguageIcon(language) {
        const iconMap = {
            'python': 'fab fa-python',
            'javascript': 'fab fa-js',
            'java': 'fab fa-java',
            'php': 'fab fa-php',
            'html': 'fab fa-html5',
            'css': 'fab fa-css3-alt',
            'react': 'fab fa-react',
            'vue': 'fab fa-vuejs',
            'django': 'fab fa-python',
            'flask': 'fas fa-flask'
        };
        
        return iconMap[language] || 'fas fa-code';
    }

    // Function to generate technology tags based on repo data
    function generateTechTags(repo) {
        const language = repo.language;
        let tags = '';
        
        if (language) {
            tags += `<span class="tech-tag ${language.toLowerCase()}">${language}</span>`;
        }
        
        // Add additional tags based on project name or description
        if (repo.name.toLowerCase().includes('web') || 
            repo.description && repo.description.toLowerCase().includes('web')) {
            tags += `<span class="tech-tag html">HTML/CSS</span>`;
        }
        
        if (repo.name.toLowerCase().includes('api') || 
            repo.description && repo.description.toLowerCase().includes('api')) {
            tags += `<span class="tech-tag javascript">API</span>`;
        }
        
        return tags;
    }

    // Function to update project statistics
    function updateProjectStats(repos) {
        const totalProjects = repos.length;
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const pinnedProjects = repos.filter(repo => repo.pinned).length;
        
        totalProjectsEl.textContent = totalProjects;
        totalStarsEl.textContent = totalStars;
        pinnedProjectsEl.textContent = pinnedProjects;
    }

    // Function to display projects in the grid
    function displayProjects(repos, filter = 'all') {
        if (repos.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-folder-open"></i>
                    <p>No projects found.</p>
                </div>
            `;
            return;
        }
        
        // Filter projects based on selected filter
        let filteredRepos = repos;
        
        if (filter === 'pinned') {
            filteredRepos = repos.filter(repo => repo.pinned);
        } else if (filter === 'web') {
            filteredRepos = repos.filter(repo => 
                repo.language === 'HTML' || 
                repo.language === 'CSS' || 
                repo.language === 'JavaScript' ||
                (repo.description && repo.description.toLowerCase().includes('web'))
            );
        } else if (filter === 'python') {
            filteredRepos = repos.filter(repo => 
                repo.language === 'Python' ||
                (repo.description && repo.description.toLowerCase().includes('python'))
            );
        }
        
        projectsGrid.innerHTML = filteredRepos.map(repo => createProjectCard(repo)).join('');
        
        // Show the "View All" button if we're not already showing all repos
        if (!showingAllRepos && allRepos.length > 6) {
            viewAllContainer.style.display = 'block';
        } else {
            viewAllContainer.style.display = 'none';
        }
    }

    // Function to fetch pinned repositories
    async function fetchPinnedRepos() {
        try {
            // Using GitHub API to fetch user's repositories
            const response = await fetch('https://api.github.com/users/lecelechavarre/repos?sort=updated&per_page=20');
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            
            // Mark first 6 repos as pinned (since GitHub API doesn't directly provide pinned status)
            const pinnedRepos = repos.slice(0, 6).map(repo => ({...repo, pinned: true}));
            
            // Store all repos for the "View All" functionality
            allRepos = repos.map(repo => ({...repo, pinned: pinnedRepos.some(p => p.id === repo.id)}));
            
            // Update project statistics
            updateProjectStats(allRepos);
            
            if (pinnedRepos.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="no-projects">
                        <i class="fas fa-folder-open"></i>
                        <p>No pinned repositories found.</p>
                    </div>
                `;
                return;
            }
            
            displayProjects(pinnedRepos, currentFilter);
            
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            projectsGrid.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to load projects. Please check your internet connection.</p>
                    <a href="https://github.com/lecelechavarre" target="_blank" class="view-all-btn" style="margin-top: 1rem;">
                        View on GitHub
                    </a>
                </div>
            `;
        }
    }

    // Function to fetch all repositories
    async function fetchAllRepos() {
        try {
            const response = await fetch('https://api.github.com/users/lecelechavarre/repos?sort=updated&per_page=100');
            
            if (!response.ok) {
                throw new Error('Failed to fetch all repositories');
            }
            
            const repos = await response.json();
            
            // Mark first 6 repos as pinned
            const pinnedIds = repos.slice(0, 6).map(repo => repo.id);
            allRepos = repos.map(repo => ({...repo, pinned: pinnedIds.includes(repo.id)}));
            
            // Update project statistics
            updateProjectStats(allRepos);
            
            if (repos.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="no-projects">
                        <i class="fas fa-folder-open"></i>
                        <p>No public repositories found.</p>
                    </div>
                `;
                return;
            }
            
            displayProjects(allRepos, currentFilter);
            showingAllRepos = true;
            
        } catch (error) {
            console.error('Error fetching all GitHub repositories:', error);
            projectsGrid.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to load all projects. Please check your internet connection.</p>
                    <a href="https://github.com/lecelechavarre" target="_blank" class="view-all-btn" style="margin-top: 1rem;">
                        View on GitHub
                    </a>
                </div>
            `;
        }
    }

    // Event listener for the "View All" button
    viewAllBtn.addEventListener('click', () => {
        fetchAllRepos();
    });

    // Event listeners for filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current filter
            currentFilter = btn.getAttribute('data-filter');
            
            // Display filtered projects
            const reposToDisplay = showingAllRepos ? allRepos : allRepos.slice(0, 6);
            displayProjects(reposToDisplay, currentFilter);
        });
    });

    // Fetch pinned repositories when projects section is loaded
    const projectsSection = document.getElementById('projects');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && allRepos.length === 0) {
                fetchPinnedRepos();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(projectsSection);
});