(function() {
    function initTheme() {
        const savedTheme = localStorage.getItem('jilgm_theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }

    // Run immediately to prevent flash
    initTheme();

    document.addEventListener('DOMContentLoaded', () => {
        // Create Floating Theme Toggle Button
        const fab = document.createElement('button');
        fab.className = 'theme-toggle-fab';
        fab.setAttribute('aria-label', 'Toggle Light/Dark Mode');
        
        // Base styling for the FAB
        Object.assign(fab.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--bg-card, #ffffff)',
            border: '2px solid var(--accent-gold, #d4af37)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            color: 'var(--text-primary, #1e293b)',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '9999',
            transition: 'transform 0.3s ease, background 0.3s ease',
            backdropFilter: 'blur(10px)'
        });
        
        // Add hover effect
        fab.addEventListener('mouseover', () => fab.style.transform = 'scale(1.1)');
        fab.addEventListener('mouseout', () => fab.style.transform = 'scale(1)');

        document.body.appendChild(fab);

        // Function to update all toggles (including the FAB and any navbar toggles)
        function updateAllToggles(isLight) {
            const toggles = document.querySelectorAll('.theme-toggle, .theme-toggle-fab');
            toggles.forEach(btn => {
                if (btn.classList.contains('theme-toggle-fab')) {
                    btn.innerHTML = isLight ? '🌙' : '☀️';
                    btn.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
                    btn.style.background = isLight ? '#f1f5f9' : '#0a172c';
                } else {
                    btn.innerHTML = isLight ? '🌙 Theme' : '☀️ Theme';
                    // Special case for index button which is just an icon
                    if (btn.tagName.toLowerCase() === 'button' && !btn.classList.contains('theme-toggle-fab')) {
                        btn.innerHTML = isLight ? '🌙' : '☀️';
                    }
                }
            });
        }

        // Initial icon update
        const isInitiallyLight = document.body.classList.contains('light-theme');
        updateAllToggles(isInitiallyLight);

        // Click handler for all toggles
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.theme-toggle, .theme-toggle-fab');
            if (btn) {
                e.preventDefault();
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                localStorage.setItem('jilgm_theme', isLight ? 'light' : 'dark');
                updateAllToggles(isLight);
            }
        });
    });
})();
