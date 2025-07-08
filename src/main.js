import { Router } from './utils/router.js';
import Navbar from './views/components/navbar.js';
import Footer from './views/components/footer.js';
import { LoginView } from './views/auth/login.js';
import RegisterView from './views/auth/register.js';
import StoryListView from './views/stories/list.js';
import StoryDetailView from './views/stories/detail.js';
import AddStoryView from './views/stories/add.js';

// Inisialisasi router
const router = new Router({
    '/login': LoginView,
    '/register': RegisterView,
    '/stories': StoryListView,
    '/stories/:id': StoryDetailView,
    '/add-story': AddStoryView
});

// Set default route
router.setDefaultRoute('/stories');

// Enhanced skip link functionality
function setupSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');

    if (skipLink && mainContent) {
        // Show skip link when focused via keyboard
        skipLink.addEventListener('focus', () => {
            skipLink.classList.add('visible');
        });

        // Hide when loses focus (for better UX)
        skipLink.addEventListener('blur', () => {
            skipLink.classList.remove('visible');
        });

        // Handle click event
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            mainContent.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        // Handle direct hash access
        const handleHashChange = () => {
            if (window.location.hash === '#main-content') {
                skipLink.classList.add('visible');
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        };

        // Initial check
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
    }
}

// Render navbar dan footer
async function renderLayout() {
    const navbar = await Navbar();
    const footer = await Footer();

    // Masukkan navbar dan footer ke container yang sesuai
    const navbarContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');

    // Clear existing content to avoid duplicates
    navbarContainer.innerHTML = '';
    footerContainer.innerHTML = '';

    navbarContainer.appendChild(navbar);
    footerContainer.appendChild(footer);

    // Setup skip link setelah layout dirender
    setupSkipLink();
}

// Jalankan aplikasi
document.addEventListener('DOMContentLoaded', async () => {
    // Initial render
    await renderLayout();

    // Initialize router
    router.init();

    // Cek auth status
    const token = localStorage.getItem('token');
    const currentRoute = window.location.hash.substr(1);

    if (!token && !['/login', '/register'].includes(currentRoute)) {
        window.location.hash = '#/login';
    }

    // Focus management for accessibility
    setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
        }
    }, 300);
});