// settings.js - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userWelcomeName = document.getElementById('userWelcomeName');
    const currentDateTime = document.getElementById('currentDateTime');
    const themeSelect = document.getElementById('themeSelect');
    const newNameInput = document.getElementById('newName');
    const changeNameButton = document.getElementById('changeNameButton');
    const userFullNameDisplay = document.getElementById('userFullNameDisplay');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const appContainer = document.getElementById('appContainer');

    // Safely check if elements exist before using them
    if (!userWelcomeName || !userFullNameDisplay || !newNameInput || !changeNameButton) {
        console.error('Critical elements not found!');
        return;
    }

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    currentDateTime.textContent = now.toLocaleDateString('en-US', options);
}
    // Load saved name
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        
        const firstName = savedName.split(' ')[0];
        userWelcomeName.textContent = firstName;
        userFullNameDisplay.textContent = savedName; // Show full name
        newNameInput.value = savedName;
    }
        // Change name handler
    changeNameButton.addEventListener('click', function() {
        const newName = newNameInput.value.trim();
        if (newName) {
            localStorage.setItem('userName', newName);
            const firstName = newName.split(' ')[0];
            userWelcomeName.textContent = firstName;
            userFullNameDisplay.textContent = newName;
            alert('Name updated successfully!');
        }
    });

    // Rest of your existing code (theme handling, sidebar functionality, etc.)
    // ... [keep all your existing theme and sidebar code] ...
});
// In the name loading section
// const savedName = localStorage.getItem('userName');
// if (savedName) {
//     welcomeScreen.style.display = 'none';
//     appContainer.style.display = 'block';
//     const firstName = localStorage.getItem('userFirstName') || savedName.split(' ')[0];
//     userWelcomeName.textContent = firstName;
//     userNameDisplay.textContent = firstName; // This will update the display in content card
//         // userFullName.textContent = savedName;   // Show full name in content card
//     newNameInput.value = savedName;
// }



// In the name change handler
// changeNameButton.addEventListener('click', () => {
//     const newName = newNameInput.value.trim();
//     if (newName) {
//         localStorage.setItem('userName', newName);
//         localStorage.setItem('userFirstName', );
//         localStorage.setItem('userFirstName', newName.split(' ')[0]);
//         const firstName = newName.split(' ')[0];
//         userWelcomeName.textContent = firstName;
//         userNameDisplay.textContent = firstName; // Update content card display
//         alert('Name updated successfully!');
//     }
// });

// In the name change handler
// changeNameButton.addEventListener('click', () => {
//     const newName = newNameInput.value.trim();
//     if (newName) {
//         localStorage.setItem('userName', newName);
//         localStorage.setItem('userFirstName', newName.split(' ')[0]);
//         const firstName = newName.split(' ')[0];
//         userWelcomeName.textContent = firstName; // Update first name in navigation
//         userFullName.textContent = newName;     // Update full name in content card
//         alert('Name updated successfully!');
//     }
// });

// Apply theme
function applyTheme(theme) {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);
    } else {
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'system';
themeSelect.value = savedTheme;
applyTheme(savedTheme);

// Theme selection
themeSelect.addEventListener('change', () => {
    const theme = themeSelect.value;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
});

// Change name
changeNameButton.addEventListener('click', () => {
    const newName = newNameInput.value.trim();
    if (newName) {
        localStorage.setItem('userName', newName);
        localStorage.setItem('userFirstName', newName.split(' ')[0]); // Store first name
        const firstName = newName.split(' ')[0];
        userWelcomeName.textContent = firstName; // Update welcome name
        userNameDisplay.textContent = firstName; // Update display under input
        alert('Name updated successfully!');
    }
});

// System theme listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (themeSelect.value === 'system') {
        applyTheme('system');
    }
});

// Sidebar functionality remains unchanged
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleCollapse = document.querySelector('.toggle-collapse');
    const mainContent = document.querySelector('.main-content');
    
    // Load sidebar state from localStorage
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    
    if (isSidebarCollapsed && !isMobile) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Hamburger button (mobile)
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    
    // Close button (mobile)
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Toggle collapse (desktop)
    toggleCollapse.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Save state to localStorage
        if (window.matchMedia('(min-width: 993px)').matches) {
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobileNow = window.matchMedia('(max-width: 992px)').matches;
        
        if (isMobileNow) {
            sidebar.classList.remove('collapsed', 'open');
            mainContent.classList.remove('expanded');
        } else {
            // Restore desktop state
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            }
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 992px)').matches) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});