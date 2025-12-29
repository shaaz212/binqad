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
    // prepare content for modal; if modal already visible, update smoothly
    if (!overlay) return;
    clearRevealTimers();

    const img = card.querySelector('.service-image img');
    const titleEl = card.querySelector('h3');
    const listItems = Array.from(card.querySelectorAll('ul li')).map(li => li.textContent);
    const newSrc = img ? img.src : '';
    const newAlt = titleEl ? titleEl.textContent : '';
    const newTitle = titleEl ? titleEl.textContent : '';

    function applyContent() {
      modalTitle.textContent = newTitle;
      modalImage.alt = newAlt;
      // replace list items
      modalPoints.innerHTML = '';
      listItems.forEach(text => {
        const newLi = document.createElement('li');
        newLi.textContent = text;
        modalPoints.appendChild(newLi);
      });
      // reveal list items via small stagger using CSS class
      Array.from(modalPoints.children).forEach((li, idx) => {
        const t = setTimeout(() => li.classList.add('visible'), 120 + idx * 120);
        revealTimers.push(t);
      });
    }

    // If overlay isn't visible, show it and set content immediately
    if (!overlay.classList.contains('show')) {
      // set image opacity 0 then set src then fade in when loaded
      modalImage.classList.remove('fade-out');
      modalImage.classList.add('fade-in');
      modalImage.style.opacity = '0';
      applyContent();
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
      // set image src after showing to allow transition
      if (newSrc) {
        modalImage.src = newSrc;
        modalImage.onload = () => { modalImage.style.opacity = '1'; };
      } else {
        modalImage.style.opacity = '1';
      }
      isModalOpen = true;
      return;
    }

    // If overlay already visible, smoothly replace content without hiding overlay
    const infoEl = modal.querySelector('.modal-info');
    // add fade-out classes
    modalImage.classList.add('fade-out');
    infoEl.classList.add('fade-out');
    // after transition, swap content and fade-in
    setTimeout(() => {
      // update image src with temporary opacity handling
      if (newSrc && modalImage.src !== newSrc) {
        modalImage.classList.remove('fade-out');
        modalImage.style.opacity = '0';
        modalImage.src = newSrc;
        modalImage.onload = () => {
          modalImage.style.opacity = '1';
        };
      }
      // apply new text and list
      applyContent();
      // fade-in info
      infoEl.classList.remove('fade-out');
      infoEl.classList.add('fade-in');
      // cleanup fade-in class after short delay
      setTimeout(() => infoEl.classList.remove('fade-in'), 300);
    }, 200);
    isModalOpen = true;
  }

    if (serviceCards && overlay && modal) {
    // Detect hover capability and add robust hover handling to avoid flicker
    const isHoverCapable = window.matchMedia('(hover: hover)').matches;
    let closeTimeout;
    let openTimeout;
    let lastOpenedCard = null;
    let lastHoveredCard = null;
    let blockedCard = null;
    let blockedUntil = 0;
    const openDelay = 140; // ms before opening on hover (prevents accidental opens)
    const reopenBlockDuration = 600; // ms to block immediate reopen after manual close

    serviceCards.forEach(card => {
      if (isHoverCapable) {
        card.addEventListener('mouseenter', () => {
          clearTimeout(closeTimeout);
          clearTimeout(openTimeout);
          lastHoveredCard = card;
          // If this card was recently closed by the user, don't reopen immediately
          if (blockedCard === card && Date.now() < blockedUntil) return;
          openTimeout = setTimeout(() => {
            // If modal already open for this card, do nothing
            if (lastOpenedCard === card && isModalOpen) return;
            openModalFromCard(card);
            lastOpenedCard = card;
          }, openDelay);
        });

        // DO NOT auto-close on mouseleave — modal should stay open until user clicks close
        card.addEventListener('mouseleave', () => {
          clearTimeout(openTimeout);
        });
      } else {
        // Touch devices: open on click
        card.addEventListener('click', () => {
          openModalFromCard(card);
          lastOpenedCard = card;
        });
      }
    });

    // Keep modal open: do not close on modal mouseleave or overlay click.
    if (isHoverCapable && modal) {
      modal.addEventListener('mouseenter', () => {
        clearTimeout(openTimeout);
      });
      // Intentionally no mouseleave close handler — user must click close button.
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

      const newSrc = img ? img.src : '';
      const newAlt = titleEl ? titleEl.textContent : '';
      const newTitle = titleEl ? titleEl.textContent : '';
      const txt = para ? para.textContent : '';

      // reuse openModalFromCard style update to smoothly replace content
      if (!overlay.classList.contains('show')) {
        modalTitle.textContent = newTitle;
        modalPoints.innerHTML = '';
        if (txt) {
          const newLi = document.createElement('li');
          newLi.textContent = txt;
          modalPoints.appendChild(newLi);
        }
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
        if (newSrc) {
          modalImage.style.opacity = '0';
          modalImage.src = newSrc;
          modalImage.onload = () => modalImage.style.opacity = '1';
        }
      } else {
        // animate replace
        const infoEl = modal.querySelector('.modal-info');
        modalImage.classList.add('fade-out');
        infoEl.classList.add('fade-out');
        setTimeout(() => {
          modalTitle.textContent = newTitle;
          modalPoints.innerHTML = '';
          if (txt) {
            const newLi = document.createElement('li');
            newLi.textContent = txt;
            modalPoints.appendChild(newLi);
          }
          if (newSrc && modalImage.src !== newSrc) {
            modalImage.style.opacity = '0';
            modalImage.src = newSrc;
            modalImage.onload = () => modalImage.style.opacity = '1';
          }
          infoEl.classList.remove('fade-out');
          infoEl.classList.add('fade-in');
          setTimeout(() => infoEl.classList.remove('fade-in'), 300);
        }, 200);
      }
      // reveal points
      Array.from(modalPoints.children).forEach((li, idx) => {
        const t = setTimeout(() => li.classList.add('visible'), 140 + idx * 140);
        revealTimers.push(t);
      });
      isModalOpen = true;
    }

    uniqueItems.forEach(u => {
      if (isHoverCapable) {
        u.addEventListener('mouseenter', () => {
          clearTimeout(closeTimeout);
          clearTimeout(openTimeout);
          lastHoveredCard = u;
          if (blockedCard === u && Date.now() < blockedUntil) return;
          openTimeout = setTimeout(() => {
            if (lastOpenedCard === u && isModalOpen) return;
            openModalFromUnique(u);
            lastOpenedCard = u;
          }, openDelay);
        });
        u.addEventListener('mouseleave', () => {
          clearTimeout(openTimeout);
          // Intentionally do not auto-close on mouseleave
        });
      } else {
        u.addEventListener('click', () => {
          openModalFromUnique(u);
          lastOpenedCard = u;
        });
      }
    });
    // Allow clicking outside the modal (on the overlay) to close the modal.
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
        blockedCard = lastOpenedCard || lastHoveredCard;
        blockedUntil = Date.now() + reopenBlockDuration;
      }
    });

    modalClose.addEventListener('click', () => {
      closeModal();
      blockedCard = lastOpenedCard || lastHoveredCard;
      blockedUntil = Date.now() + reopenBlockDuration;
    });

    // Keep Escape disabled per previous requirement; explicit close via button or overlay only.
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