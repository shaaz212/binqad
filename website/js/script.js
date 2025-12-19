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
    const width = window.innerWidth;
    if (width >= 1200) return 3;
    if (width >= 768) return 2;
    return 1;
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
    
    // Update buttons
    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.maxIndex;
    
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
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }
  
  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
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
  new UniquenessCarousel();
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