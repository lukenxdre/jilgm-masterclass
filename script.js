document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scrolled State
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        // Toggle hamburger to X animation could be added here
    }

    mobileToggle.addEventListener('click', toggleMenu);

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links (fallback/enhancement to CSS scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Removed mock form logic as enrollment is now closed.

    // 5. Render curriculum dynamically from AuthAPI if available
    const timelineContainer = document.querySelector('.curriculum-timeline');
    if (timelineContainer && typeof AuthAPI !== 'undefined') {
        const modules = AuthAPI.getModulesContent();
        const moduleIds = Object.keys(modules);
        if (moduleIds.length > 0) {
            timelineContainer.innerHTML = '';
            moduleIds.forEach((id, idx) => {
                const mod = modules[id];
                const card = document.createElement('div');
                card.className = 'module-card glass-card reveal-up';
                
                // Add index animation delay
                if (idx > 0) {
                    card.classList.add(`delay-${idx % 3}`);
                }
                
                // Create zero-padded index (e.g. 01, 02)
                const numStr = String(idx + 1).padStart(2, '0');
                
                const title = mod.title || 'Untitled Module';
                const subtitle = mod.subtitle || '';
                
                // Build tag list if components exist or default tags based on module index
                let tagHTML = '';
                const tags = [];
                if (idx === 0) tags.push('Character', 'Identity');
                else if (idx === 1) tags.push('Vision', 'Planning');
                else if (idx === 2) tags.push('Mediation', 'Unity');
                else if (idx === 3) tags.push('Mentorship', 'Legacy');
                else tags.push('Leadership', `Module ${idx + 1}`);

                tags.forEach(tag => {
                    tagHTML += `<span>${tag}</span>`;
                });
                
                card.innerHTML = `
                    <div class="module-number">${numStr}</div>
                    <div class="module-content">
                        <h3>${title}</h3>
                        <p>${subtitle}</p>
                        <div class="module-tags">
                            ${tagHTML}
                        </div>
                    </div>
                `;
                timelineContainer.appendChild(card);
            });
            
            // Re-register new dynamic elements for observer
            const newRevealElements = timelineContainer.querySelectorAll('.reveal-up');
            newRevealElements.forEach(el => {
                revealObserver.observe(el);
            });
        }
    }
});
