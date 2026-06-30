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
        const toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(toggle => {
            // Update icon on load
            updateToggleIcon(toggle, document.body.classList.contains('light-theme'));
            
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                localStorage.setItem('jilgm_theme', isLight ? 'light' : 'dark');
                
                // Update all toggles on page
                toggles.forEach(t => updateToggleIcon(t, isLight));
            });
        });
    });

    function updateToggleIcon(btn, isLight) {
        if (isLight) {
            btn.innerHTML = '🌙'; // switch to dark mode
            btn.title = "Switch to Dark Mode";
        } else {
            btn.innerHTML = '☀️'; // switch to light mode
            btn.title = "Switch to Light Mode";
        }
    }
})();
