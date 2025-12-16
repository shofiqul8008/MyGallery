
    // ===== CONFIGURATION =====
    const CONFIG = {
      images: [
        { src: 'picture/image_1.jpg', alt: 'Beautiful Landscape', title: 'Mountain View', desc: 'Scenic mountain landscape' },
        { src: 'picture/image_2.jpg', alt: 'City Skyline', title: 'Urban City', desc: 'Modern city architecture' },
        { src: 'picture/image_3.jpg', alt: 'Ocean Waves', title: 'Beach Sunset', desc: 'Peaceful beach scene' },
        { src: 'picture/image_4.jpg', alt: 'Forest Path', title: 'Nature Trail', desc: 'Sunlight through trees' },
        { src: 'picture/image_5.jpg', alt: 'Night Sky', title: 'Starry Night', desc: 'Galaxy and stars' },
        { src: 'picture/image_6.jpg', alt: 'Winter Wonderland', title: 'Snowy Mountains', desc: 'Frozen landscape' },
        { src: 'picture/image_7.jpg', alt: 'Desert Dunes', title: 'Sand Desert', desc: 'Golden sand dunes' },
        { src: 'picture/image_8.jpg', alt: 'Waterfall', title: 'Forest Waterfall', desc: 'Cascading waterfall' },
        { src: 'picture/image_9.jpg', alt: 'Northern Lights', title: 'Aurora Borealis', desc: 'Colorful night sky' },
        { src: 'picture/image_10.jpg', alt: 'Wildlife', title: 'Animal Kingdom', desc: 'Wild animals in nature' },
        { src: 'picture/image_11.jpg', alt: 'Garden Flowers', title: 'Flower Garden', desc: 'Colorful flower field' }
      ],
      contactUrl: "https://shofiqul8008.github.io/abid/",
      aboutUrl: "#"
    };

    // ===== DOM ELEMENTS =====
    const dom = {
      body: document.body,
      gallery: document.getElementById('gallery'),
      darkModeToggle: document.getElementById('darkModeToggle'),
      mobileMenuBtn: document.getElementById('mobileMenuBtn'),
      mobileSlideout: document.getElementById('mobileSlideout'),
      mobileCloseBtn: document.getElementById('mobileCloseBtn'),
      mobileDarkToggle: document.getElementById('mobileDarkToggle'),
      mainNav: document.getElementById('mainNav'),
      navLinks: document.querySelectorAll('.nav-link'),
      mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
      scrollProgress: document.getElementById('scrollProgress'),
      imageModal: document.getElementById('imageModal'),
      modalImage: document.getElementById('modalImage'),
      modalClose: document.getElementById('modalClose'),
      prevBtn: document.getElementById('prevBtn'),
      nextBtn: document.getElementById('nextBtn'),
      currentYear: document.getElementById('currentYear')
    };

    // ===== STATE MANAGEMENT =====
    const state = {
      darkMode: localStorage.getItem('darkMode') === 'enabled',
      currentImageIndex: 0,
      imagesLoaded: 0,
      totalImages: CONFIG.images.length,
      mobileMenuOpen: false
    };

    // ===== INITIALIZATION =====
    function init() {
      setCurrentYear();
      setupDarkMode();
      loadImages();
      setupEventListeners();
      setupIntersectionObserver();
      updateMobileDarkToggle();
    }

    // ===== UTILITY FUNCTIONS =====
    function setCurrentYear() {
      dom.currentYear.textContent = new Date().getFullYear();
    }

    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // ===== DARK MODE =====
    function setupDarkMode() {
      if (state.darkMode) {
        dom.body.classList.add('dark-mode');
        dom.mobileDarkToggle.classList.add('active');
      }
      
      dom.darkModeToggle.addEventListener('click', toggleDarkMode);
      dom.mobileDarkToggle.addEventListener('click', toggleDarkMode);
    }

    function toggleDarkMode() {
      state.darkMode = !state.darkMode;
      dom.body.classList.toggle('dark-mode');
      dom.mobileDarkToggle.classList.toggle('dark-mode-active');
      
      localStorage.setItem('darkMode', state.darkMode ? 'enabled' : 'disabled');
      
      // Add toggle animation
      const toggleSwitch = dom.darkModeToggle.querySelector('.toggle-switch');
      if (toggleSwitch) {
        toggleSwitch.style.transform = 'scale(0.9)';
        setTimeout(() => {
          toggleSwitch.style.transform = '';
        }, 300);
      }
    }

    function updateMobileDarkToggle() {
      if (state.darkMode) {
        dom.mobileDarkToggle.classList.add('active');
      }
    }

    // ===== MOBILE MENU FUNCTIONS =====
    function toggleMobileMenu() {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      dom.mobileSlideout.classList.toggle('active');
      dom.mobileMenuBtn.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (state.mobileMenuOpen) {
        dom.body.style.overflow = 'hidden';
      } else {
        dom.body.style.overflow = 'auto';
      }
    }

    function closeMobileMenu() {
      state.mobileMenuOpen = false;
      dom.mobileSlideout.classList.remove('active');
      dom.mobileMenuBtn.classList.remove('active');
      dom.body.style.overflow = 'auto';
    }

    // ===== IMAGE LOADING =====
    function loadImages() {
      const gallery = dom.gallery;
      gallery.innerHTML = '';
      
      CONFIG.images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.style.setProperty('--item-index', index);
        item.dataset.index = index;
        
        item.innerHTML = `
          <img 
            src="${image.src}" 
            alt="${image.alt}"
            loading="lazy"
            data-src="${image.src}"
            data-index="${index}"
          >
          <button class="image-view-btn" aria-label="View image">
            $
          </button>
          <div class="image-overlay">
            <div class="image-title">${image.title}</div>
            <div class="image-desc">${image.desc}</div>
          </div>
        `;
        
        gallery.appendChild(item);
      });
      
      setupImageClickHandlers();
    }

    function setupImageClickHandlers() {
      const images = document.querySelectorAll('.image-item');
      const viewButtons = document.querySelectorAll('.image-view-btn');
      
      images.forEach(item => {
        item.addEventListener('click', (e) => {
          if (!e.target.classList.contains('image-view-btn')) {
            openModal(parseInt(item.dataset.index));
          }
        });
      });
      
      viewButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(index);
        });
      });
    }

    // ===== MODAL FUNCTIONS =====
    function openModal(index) {
      state.currentImageIndex = index;
      updateModalImage();
      dom.imageModal.classList.add('active');
      dom.body.style.overflow = 'hidden';
    }

    function closeModal() {
      dom.imageModal.classList.remove('active');
      dom.body.style.overflow = 'auto';
    }

    function updateModalImage() {
      const image = CONFIG.images[state.currentImageIndex];
      dom.modalImage.src = image.src;
      dom.modalImage.alt = image.alt;
    }

    function navigateModal(direction) {
      state.currentImageIndex += direction;
      
      if (state.currentImageIndex < 0) {
        state.currentImageIndex = CONFIG.images.length - 1;
      } else if (state.currentImageIndex >= CONFIG.images.length) {
        state.currentImageIndex = 0;
      }
      
      updateModalImage();
    }

    // ===== NAVIGATION FUNCTIONS =====
    function handleNavClick(e, isMobile = false) {
      e.preventDefault();
      const link = e.currentTarget;
      const page = link.dataset.page;
      
      // Update active state
      if (isMobile) {
        dom.mobileNavLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      } else {
        dom.navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      }
      
      // Handle page actions
      switch(page) {
        case 'home':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'contact':
          window.open(CONFIG.contactUrl, '_blank');
          break;
        case 'about':
          alert('My Gallery Project\nA beautiful image gallery with masonry layout and smooth animations.');
          break;
      }
      
      // Close mobile menu if open
      if (state.mobileMenuOpen) {
        closeMobileMenu();
      }
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
      // Desktop Navigation
      dom.navLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, false));
      });
      
      // Mobile Navigation
      dom.mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, true));
      });
      
      // Mobile menu controls
      dom.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
      dom.mobileCloseBtn.addEventListener('click', closeMobileMenu);
      
      // Close mobile menu on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-slideout') && 
            !e.target.closest('.mobile-menu-btn') && 
            state.mobileMenuOpen) {
          closeMobileMenu();
        }
      });
      
      // Close mobile menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.mobileMenuOpen) {
          closeMobileMenu();
        }
      });
      
      // Modal controls
      dom.modalClose.addEventListener('click', closeModal);
      dom.prevBtn.addEventListener('click', () => navigateModal(-1));
      dom.nextBtn.addEventListener('click', () => navigateModal(1));
      dom.imageModal.addEventListener('click', (e) => {
        if (e.target === dom.imageModal) closeModal();
      });
      
      // Keyboard navigation for modal
      document.addEventListener('keydown', (e) => {
        if (dom.imageModal.classList.contains('active')) {
          switch(e.key) {
            case 'Escape':
              closeModal();
              break;
            case 'ArrowLeft':
              navigateModal(-1);
              break;
            case 'ArrowRight':
              navigateModal(1);
              break;
          }
        }
      });
      
      // Scroll progress
      window.addEventListener('scroll', debounce(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        dom.scrollProgress.style.width = scrolled + "%";
      }, 10));
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    function setupIntersectionObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img && img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              
              // Add fade in animation for loaded images
              entry.target.style.animation = 'dropIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
            }
          }
        });
      }, {
        rootMargin: '100px'
      });
      
      document.querySelectorAll('.image-item').forEach(item => {
        observer.observe(item);
      });
    }

    // ===== INITIALIZE APP =====
    document.addEventListener('DOMContentLoaded', init);