document.addEventListener('DOMContentLoaded', function() {
    // // Mobile Menu Toggle
    // const menuToggle = document.querySelector('.menu-toggle');
    // const navLinks = document.querySelector('.nav-links');
    
    // // Initialize menu state
    // function initMenu() {
    //     if (window.innerWidth < 769) {
    //         navLinks.style.display = 'none';
    //         navLinks.classList.remove('active', 'show');
    //     } else {
    //         navLinks.style.display = 'flex';
    //         navLinks.classList.remove('active', 'show');
    //     }
    // }
    
    // // Toggle menu function
    // function toggleMenu() {
    //     menuToggle.classList.toggle('active');
        
    //     if (navLinks.classList.contains('active')) {
    //         // Close menu with animation
    //         navLinks.classList.remove('show');
    //         setTimeout(() => {
    //             navLinks.style.display = 'none';
    //             navLinks.classList.remove('active');
    //         }, 300);
    //     } else {
    //         // Open menu with animation
    //         navLinks.style.display = 'flex';
    //         // Add index to each link for staggered animation
    //         document.querySelectorAll('.nav-links a').forEach((link, index) => {
    //             link.style.setProperty('--i', index);
    //         });
    //         // Force reflow to enable animation
    //         void navLinks.offsetWidth;
    //         navLinks.classList.add('active', 'show');
    //     }
    // }
    
    // // Initialize menu
    // initMenu();
    
    // // Menu toggle click event
    // menuToggle.addEventListener('click', toggleMenu);
    
    // // Close menu when clicking on a link (mobile only)
    // document.querySelectorAll('.nav-links a').forEach(link => {
    //     link.addEventListener('click', function() {
    //         if (window.innerWidth < 769) {
    //             toggleMenu();
    //         }
    //     });
    // });
    
    // Handle window resize
    window.addEventListener('resize', initMenu);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add shadow to navbar on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 10) {
            nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
    
    // Animation on scroll for cards
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .pricing-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.feature-card, .pricing-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});
// document.addEventListener('DOMContentLoaded', function() {
//   const themeToggle = document.getElementById('theme-toggle');
//   const html = document.documentElement;
  
//   // Check for saved theme preference or use system preference
//   const savedTheme = localStorage.getItem('theme');
//   const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
//   // Set initial theme
//   if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
//     html.setAttribute('data-theme', 'dark');
//     updateIcon();
//   }
  
//   // Toggle theme on button click
//   themeToggle.addEventListener('click', () => {
//     const currentTheme = html.getAttribute('data-theme');
//     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
//     html.setAttribute('data-theme', newTheme);
//     localStorage.setItem('theme', newTheme);
//     updateIcon();
//   });
  
//   // Update the icon based on current theme
//   function updateIcon() {
//     const currentTheme = html.getAttribute('data-theme');
//     const icon = themeToggle.querySelector('i');
    
//     if (currentTheme === 'dark') {
//       icon.classList.remove('fa-moon');
//       icon.classList.add('fa-sun');
//     } else {
//       icon.classList.remove('fa-sun');
//       icon.classList.add('fa-moon');
//     }
//   }
  
//   // Listen for system theme changes
//   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
//     if (!localStorage.getItem('theme')) {
//       const newTheme = e.matches ? 'dark' : 'light';
//       html.setAttribute('data-theme', newTheme);
//       updateIcon();
//     }
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const toggleBtn = document.getElementById("theme-toggle");
//     const icon = toggleBtn.querySelector("i"); // Get the icon element

//     // Check for saved theme preference or system preference
//     const savedTheme = localStorage.getItem("theme");
//     const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//     // Set initial theme
//     if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
//         document.documentElement.classList.add("dark-mode");
//         icon.classList.replace("fa-moon", "fa-sun");
//     } else {
//         document.documentElement.classList.remove("dark-mode");
//         icon.classList.replace("fa-sun", "fa-moon");
//     }

//     toggleBtn.addEventListener("click", function () {
//         // Toggle dark mode class on html element
//         document.documentElement.classList.toggle("dark-mode");

//         // Check current mode and update icon + localStorage
//         if (document.documentElement.classList.contains("dark-mode")) {
//             localStorage.setItem("theme", "dark");
//             icon.classList.replace("fa-sun", "fa-moon");
//         } else {
//             localStorage.setItem("theme", "light");
//             icon.classList.replace("fa-moon", "fa-sun");
//         }
//     });
// });

// document.addEventListener('DOMContentLoaded', function() {
//   const themeToggle = document.querySelector('.theme-toggle');
//   const icon = themeToggle.querySelector('i');
  
//   // Check for saved theme preference or use system preference
//   const savedTheme = localStorage.getItem('theme');
//   const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
//   // Set initial theme
//   if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
//     document.documentElement.classList.add('dark-mode');
//     icon.classList.replace('fa-moon', 'fa-sun');
//   }
  
//   // Toggle theme on button click
//   themeToggle.addEventListener('click', function() {
//     document.documentElement.classList.toggle('dark-mode');
    
//     if (document.documentElement.classList.contains('dark-mode')) {
//       icon.classList.replace('fa-moon', ' fa-sun');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       icon.classList.replace('fa-sun', 'fa-moon');
//       localStorage.setItem('theme', 'light');
//     }
//   });
  
//   // Listen for system theme changes (optional)
//   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
//     if (!localStorage.getItem('theme')) {
//       if (e.matches) {
//         document.documentElement.classList.add('dark-mode');
//         icon.classList.replace('fa-moon', 'fa-sun');
//       } else {
//         document.documentElement.classList.remove('dark-mode');
//         icon.classList.replace('fa-sun', 'fa-moon');
//       }
//     }
//   });
// });


// // Theme switching functionality
// function applyTheme(theme) {
//     const html = document.documentElement;
//     const themeToggle = document.getElementById('theme-toggle');
    
//     if (theme === 'system') {
//         const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//         html.classList.toggle('dark-theme', prefersDark);
//         html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
//     } else {
//         html.classList.toggle('dark-theme', theme === 'dark');
//         html.setAttribute('data-theme', theme);
//     }
    
//     // Update the icon
//     if (themeToggle) {
//         const icon = themeToggle.querySelector('i');
//         const currentTheme = html.getAttribute('data-theme');
        
//         if (currentTheme === 'dark') {
//             icon.classList.remove('fa-moon');
//             icon.classList.add('fa-sun');
//         } else {
//             icon.classList.remove('fa-sun');
//             icon.classList.add('fa-moon');
//         }
//     }
// }

// // Apply theme immediately
// const savedTheme = localStorage.getItem('theme') || 'system';
// applyTheme(savedTheme);

// // Set up theme switching after DOM loads
// document.addEventListener('DOMContentLoaded', () => {
//     const themeToggle = document.getElementById('theme-toggle');
    
//     // Toggle theme on button click
//     if (themeToggle) {
//         themeToggle.addEventListener('click', () => {
//             const currentTheme = document.documentElement.getAttribute('data-theme');
//             let newTheme;
            
//             if (currentTheme === 'dark') {
//                 newTheme = 'light';
//             } else {
//                 newTheme = 'dark';
//             }
            
//             localStorage.setItem('theme', newTheme);
//             applyTheme(newTheme);
//         });
//     }

//     // Watch for system theme changes
//     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
//         if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
//             applyTheme('system');
//         }
//     });
// });


        // Sidebar functionality
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebarClose = document.getElementById('sidebarClose');
        
        function openSidebar() {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeSidebar() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        menuToggle.addEventListener('click', openSidebar);
        sidebarClose.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
        
        // Close sidebar when clicking on links (optional)
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', () => {
                closeSidebar();
            });
        });
        
        // Close sidebar when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSidebar();
            }
        });