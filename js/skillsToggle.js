// Skills layout toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const skillsToggle = document.getElementById('skillsToggle');
    const skillsGridLayout = document.getElementById('skillsGridLayout');
    const skillsScrollingLayout = document.getElementById('skillsScrollingLayout');
    const layoutToggleIcon = document.getElementById('layoutToggleIcon');
    
    // Track elements for each category
    const programmingTrack = document.getElementById('programmingTrack');
    const frameworksTrack = document.getElementById('frameworksTrack');
    const toolsTrack = document.getElementById('toolsTrack');
    
    let isScrollingLayout = false;
    
    // Function to start scrolling animations for all categories
    function startScrollingAnimations() {
        // Reset any existing animations
        programmingTrack.style.animation = 'none';
        frameworksTrack.style.animation = 'none';
        toolsTrack.style.animation = 'none';
        
        // Trigger reflow to restart animations
        void programmingTrack.offsetWidth;
        void frameworksTrack.offsetWidth;
        void toolsTrack.offsetWidth;
        
        // Apply infinite animations with different directions
        // Programming Languages: right to left (scroll-left)
        programmingTrack.style.animation = 'scroll-left 40s linear infinite';
        
        // Frameworks & Libraries: left to right (scroll-right)
        frameworksTrack.style.animation = 'scroll-right 70s linear infinite';
        
        // Tools & Technologies: left to right (scroll-right)
        toolsTrack.style.animation = 'scroll-left 90s linear infinite';
    }
    
    // Function to stop scrolling animations
    function stopScrollingAnimations() {
        programmingTrack.style.animation = 'none';
        frameworksTrack.style.animation = 'none';
        toolsTrack.style.animation = 'none';
    }
    
    // Function to toggle between layouts
    function toggleSkillsLayout() {
        if (isScrollingLayout) {
            // Switch to grid layout
            skillsGridLayout.style.display = 'block';
            skillsScrollingLayout.style.display = 'none';
            stopScrollingAnimations();
            layoutToggleIcon.innerHTML = '<i class="fas fa-exchange-alt"></i>';
            layoutToggleIcon.title = 'Click to switch to scrolling view';
            isScrollingLayout = false;
        } else {
            // Switch to scrolling layout
            skillsGridLayout.style.display = 'none';
            skillsScrollingLayout.style.display = 'block';
            startScrollingAnimations();
            layoutToggleIcon.innerHTML = '<i class="fas fa-th-large"></i>';
            layoutToggleIcon.title = 'Click to switch to grid view';
            isScrollingLayout = true;
        }
        
        // Save preference to localStorage
        localStorage.setItem('skillsLayout', isScrollingLayout ? 'scrolling' : 'grid');
    }
    
    // Always start with grid layout - ignore any saved preferences
    // Grid layout is already visible by default in HTML
    skillsGridLayout.style.display = 'block';
    skillsScrollingLayout.style.display = 'none';
    isScrollingLayout = false;
    layoutToggleIcon.innerHTML = '<i class="fas fa-exchange-alt"></i>';
    layoutToggleIcon.title = 'Click to switch to scrolling view';
    
    // Clear any saved scrolling preference to ensure grid is default
    localStorage.setItem('skillsLayout', 'grid');
    
    // Add click event listener to the title
    skillsToggle.addEventListener('click', toggleSkillsLayout);
    
    // Add click event listener to the icon
    layoutToggleIcon.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the title click
        toggleSkillsLayout();
    });
    
    // Pause animation on hover for better UX (for each category)
    const scrollingCategories = skillsScrollingLayout.querySelectorAll('.scrolling-category');
    scrollingCategories.forEach(category => {
        const track = category.querySelector('.scrolling-track');
        const container = category.querySelector('.scrolling-track-container');
        
        container.addEventListener('mouseenter', function() {
            if (isScrollingLayout) {
                track.style.animationPlayState = 'paused';
            }
        });
        
        container.addEventListener('mouseleave', function() {
            if (isScrollingLayout) {
                track.style.animationPlayState = 'running';
            }
        });
    });
    
    // Handle window resize to restart animation if needed
    window.addEventListener('resize', function() {
        if (isScrollingLayout) {
            // Restart animations to account for layout changes
            stopScrollingAnimations();
            setTimeout(startScrollingAnimations, 10);
        }
    });
});
