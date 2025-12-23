// Hero Background Carousel
class HeroCarousel {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    
    if (this.slides.length > 0) {
      this.init();
    }
  }
  
  init() {
    this.startAutoPlay();
  }
  
  nextSlide() {
    this.slides[this.currentSlide].classList.remove('active');
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.slides[this.currentSlide].classList.add('active');
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Change slide every 4 seconds
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Uniqueness Carousel Functionality  
class UniquenessCarousel {
  constructor() {
    this.track = document.getElementById('uniqueness-carousel-track');
    this.prevBtn = document.getElementById('uniqueness-carousel-prev');
    this.nextBtn = document.getElementById('uniqueness-carousel-next');
    this.indicatorsContainer = document.getElementById('uniqueness-carousel-indicators');
    
    if (!this.track || !this.prevBtn || !this.nextBtn) {
      console.error('Uniqueness carousel elements not found');
      return;
    }
    
    this.slides = Array.from(this.track.children);
    this.currentIndex = 0;
    this.slidesPerView = this.getSlidesPerView();
    this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
    this.autoPlayInterval = null;
    
    this.init();
  }
  
  getSlidesPerView() {
    // Dynamically calculate how many slides actually fit based on container and card width
    if (!this.track || this.slides.length === 0) return 1;
    
    const container = this.track.parentElement;
    if (!container) return 1;
    
    const containerWidth = container.offsetWidth;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = 32; // 2rem gap between slides
    
    // Calculate how many complete slides fit
    const slidesPerView = Math.floor((containerWidth + gap) / (slideWidth + gap));
    return Math.max(1, slidesPerView);
  }
  
  init() {
    this.createIndicators();
    this.updateCarousel();
    this.bindEvents();
    this.startAutoPlay();
  }
  
  createIndicators() {
    if (!this.indicatorsContainer) return;
    this.indicatorsContainer.innerHTML = '';
    const indicatorCount = this.maxIndex + 1;
    
    for (let i = 0; i < indicatorCount; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('carousel-indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => this.goToSlide(i));
      this.indicatorsContainer.appendChild(indicator);
    }
  }
  
  updateCarousel() {
    if (!this.track || this.slides.length === 0) return;
    const slideWidth = this.slides[0].offsetWidth + 32; // 32px for gap
    const translateX = -this.currentIndex * slideWidth;
    this.track.style.transform = `translateX(${translateX}px)`;
    
    // Infinite loop - buttons always enabled
    
    // Update indicators
    document.querySelectorAll('#uniqueness-carousel-indicators .carousel-indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateCarousel();
    this.resetAutoPlay();
  }
  
  nextSlide() {
    // Infinite loop: wrap to start when reaching end
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateCarousel();
  }
  
  prevSlide() {
    // Infinite loop: wrap to end when at start
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.maxIndex;
    }
    this.updateCarousel();
  }
  
  bindEvents() {
    // Previous button
    this.prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.prevSlide();
      this.resetAutoPlay();
    });
    
    // Next button
    this.nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.nextSlide();
      this.resetAutoPlay();
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newSlidesPerView = this.getSlidesPerView();
        if (newSlidesPerView !== this.slidesPerView) {
          this.slidesPerView = newSlidesPerView;
          this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
          this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
          this.createIndicators();
          this.updateCarousel();
        }
      }, 250);
    });
    
    // Pause autoplay on hover
    this.track.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.track.addEventListener('mouseleave', () => this.startAutoPlay());
  }
  
  startAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.autoPlayInterval = setInterval(() => {
      if (this.currentIndex === this.maxIndex) {
        this.goToSlide(0);
      } else {
        this.nextSlide();
      }
    }, 5000); // 5 seconds for uniqueness carousel
  }
  
  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resetAutoPlay() {
    this.pauseAutoPlay();
    this.startAutoPlay();
  }
}

// Mobile Navigation Toggle
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.querySelector(".nav-menu");

if (mobileMenu && navMenu) {
  mobileMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Active Navigation Link
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveNav() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveNav);

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements with fadeInUp animation
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".unique-item, .service-card, .contact-item-pro");
  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Initialize carousels
  new HeroCarousel();
  // uniqueness carousel removed per design; items will be static and clickable
});

// Service card modal: open popup and reveal points one by one
document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = document.querySelectorAll('.service-card');
  const overlay = document.getElementById('service-modal-overlay');
  const modal = document.getElementById('service-modal');
  const modalImage = document.getElementById('service-modal-image');
  const modalTitle = document.getElementById('service-modal-title');
  const modalPoints = document.getElementById('service-modal-points');
  const modalClose = document.getElementById('service-modal-close');
  let revealTimers = [];
  let isModalOpen = false;

  function clearRevealTimers() {
    revealTimers.forEach(t => clearTimeout(t));
    revealTimers = [];
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    modalPoints.innerHTML = '';
    modalImage.src = '';
    modalTitle.textContent = '';
    clearRevealTimers();
    isModalOpen = false;
  }

  function openModalFromCard(card) {
    // prevent duplicate opens and clear any pending reveals
    clearRevealTimers();
    if (!overlay) return;
    if (isModalOpen) {
      closeModal();
    }
    const img = card.querySelector('.service-image img');
    const titleEl = card.querySelector('h3');
    const listItems = card.querySelectorAll('ul li');

    modalImage.src = img ? img.src : '';
    modalImage.alt = titleEl ? titleEl.textContent : '';
    modalTitle.textContent = titleEl ? titleEl.textContent : '';

    modalPoints.innerHTML = '';
    listItems.forEach(li => {
      const newLi = document.createElement('li');
      newLi.textContent = li.textContent;
      modalPoints.appendChild(newLi);
    });

    // show overlay
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    // reveal points one-by-one
    const items = Array.from(modalPoints.children);
    items.forEach((item, idx) => {
      const t = setTimeout(() => {
        item.classList.add('visible');
      }, 250 * idx + 200); // cascade delay
      revealTimers.push(t);
    });
    isModalOpen = true;
  }

    if (serviceCards && overlay && modal) {
    // Detect if device supports hover (desktop/laptop) vs primarily touch (mobile/tablet)
    const isHoverCapable = window.matchMedia('(hover: hover)').matches;
    let closeTimeout;

    serviceCards.forEach(card => {
      if (isHoverCapable) {
        card.addEventListener('mouseenter', () => {
          clearTimeout(closeTimeout);
          openModalFromCard(card);
        });
        card.addEventListener('mouseleave', () => {
          closeTimeout = setTimeout(() => {
            closeModal();
          }, 300);
        });
      } else {
        // Touch devices: open on click
        card.addEventListener('click', () => openModalFromCard(card));
      }
    });

    // Keep modal open when hovering over it
    if (isHoverCapable && modal) {
      modal.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
      });
      modal.addEventListener('mouseleave', () => {
        closeTimeout = setTimeout(() => {
          closeModal();
        }, 300);
      });
    }

    // Make uniqueness items open the same modal with paragraph content
    const uniqueItems = document.querySelectorAll('.unique-item');
    function openModalFromUnique(item) {
      const img = item.querySelector('.unique-image img');
      const titleEl = item.querySelector('.unique-content h3');
      const para = item.querySelector('.unique-content p');

      modalImage.src = img ? img.src : '';
      modalImage.alt = titleEl ? titleEl.textContent : '';
      modalTitle.textContent = titleEl ? titleEl.textContent : '';

      modalPoints.innerHTML = '';
      if (para) {
        const newLi = document.createElement('li');
        newLi.textContent = para.textContent;
        modalPoints.appendChild(newLi);
      }

      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');

      // reveal the single paragraph
      const items = Array.from(modalPoints.children);
      items.forEach((itemEl, idx) => {
        const t = setTimeout(() => { itemEl.classList.add('visible'); }, 200 + idx * 250);
        revealTimers.push(t);
      });
      isModalOpen = true;
    }

    uniqueItems.forEach(u => {
      if (isHoverCapable) {
        u.addEventListener('mouseenter', () => {
          clearTimeout(closeTimeout);
          openModalFromUnique(u);
        });
        u.addEventListener('mouseleave', () => {
          closeTimeout = setTimeout(() => {
            closeModal();
          }, 300);
        });
      } else {
        u.addEventListener('click', () => openModalFromUnique(u));
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === modalClose) closeModal();
    });

    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }
});

// Handle floating cards animation
window.addEventListener('load', () => {
  const floatingCards = document.querySelectorAll('.floating-card');
  floatingCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 500 + (index * 200));
  });
});

// Contact form enhancement (if you add a form later)

// Back-to-top button: show on scroll and smooth-scroll to top
document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  const toggleBackBtn = () => {
    if (window.scrollY > 320) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  };

  // initial state
  toggleBackBtn();

  window.addEventListener('scroll', toggleBackBtn, { passive: true });

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // allow keyboard activation
  backBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') backBtn.click();
  });
});
function handleContactForm() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Add your form submission logic here
      console.log('Form submitted');
    });
  }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', handleContactForm);