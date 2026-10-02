# binQad Business Services LLC - Website

## Overview

A professional, responsive static website for binQad Business Services LLC, a UAE-based business consultancy company. The website features a claret & black brand theme, smooth animations, and comprehensive information about the company's services.

## Features

- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Claret Theme**: Professional claret (#750f3b) and black colour scheme
- **Modern Animations**: Smooth scroll animations, hover effects, and micro-interactions
- **Mobile Navigation**: Responsive hamburger menu for mobile devices
- **Service Showcase**: Comprehensive display of all business services
- **SEO Optimized**: Clean HTML structure with semantic markup
- **Optimised Imagery**: Responsive AVIF/WebP/JPEG variants with lazy loading and placeholders
- **Accessible**: Skip link, keyboard-operable dialogs, visible focus, WCAG AA text contrast

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts (Inter)

## File Structure

```
website/
├── index.html            # Main HTML file
├── css/
│   └── style.css         # Main stylesheet (claret theme, UTF-8)
├── js/
│   └── script.js         # JavaScript for interactivity
├── images/
│   ├── *.jpg / *.png     # Full-resolution source images (not served)
│   └── optimized/        # Generated responsive variants — these are what the site loads
│       ├── <name>-<width>.avif
│       ├── <name>-<width>.webp
│       ├── <name>-<width>.jpg
│       └── manifest.json # Dimensions + average colour used for placeholders
└── README.md             # This file
```

> **Images:** `index.html` references `images/optimized/` only. The originals in
> `images/` are kept as masters. If you add or replace a photo, regenerate the
> variants (see *Image pipeline* below) rather than pointing the HTML at a
> multi-megabyte original.

## Sections

1. **Navigation**: Sticky header with smooth scroll navigation
2. **Hero Section**: Eye-catching banner with animated floating cards
3. **About Section**: Company information, mission, vision, and unique features
4. **Services Section**: Comprehensive list of all business services
5. **Contact Section**: Contact information and form
6. **Footer**: Company details and links

## Services Covered

- UAE Business Setup
- Visa & PRO Services
- Attestation & Legalisation
- Accounting & Bookkeeping
- Tax Registration & Compliance
- HR Consulting & Payroll Services
- Business Strategy & Optimization
- Corporate Support Services

## Responsive Breakpoints

- Desktop: 1200px and above
- Tablet: 768px - 1199px
- Mobile: 320px - 767px

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Installation & Usage

1. Download all files maintaining the folder structure
2. Open `index.html` in a web browser
3. No server setup required - this is a static website

## Customization

### Colors

The claret theme can be customized by modifying the CSS variables in `style.css`:

```css
:root {
  --primary-claret: #750f3b;
  --secondary-claret: #8b1538;
  --light-claret: #a61e4d;
  --dark-claret: #5c0b2e;
}
```

Spacing, radii, shadows and motion are also tokenised at the top of
`style.css`, so most visual tweaks are a one-line change there.

### Content

- Update contact information in the Contact section
- Modify services in the Services section
- Update company information in the About section

## Performance Features

- Responsive `<picture>` images: AVIF with WebP and JPEG fallbacks
- Only the first hero frame is preloaded; every other image is lazy-loaded
- Average-colour placeholders + reserved aspect ratios keep layout shift ~0
- Optimized CSS with efficient animations
- Minimal, dependency-free JavaScript

Initial page load is roughly **0.5 MB** across 8 requests.

## Image pipeline

The served images in `images/optimized/` are generated from the masters in
`images/`. Widths are 1280/1920/2560 for hero frames and 480/800/1200 for cards,
each emitted as AVIF (q64), WebP (q86) and progressive JPEG (q85).

To regenerate after changing a source image, run a script that resizes each
master to those widths in all three formats and refreshes `manifest.json`
(which stores each image's dimensions and average colour for the placeholder).
Any tool works — ImageMagick, `sharp`, or Pillow.

## Contact Information

- **Phone**: +971 542346645
- **Email**: info@binqad.ae
- **Address**: Saheel Tower 1, Office No: 1706, Al Nahda 1, behind Mai Tower, Dubai, UAE

## Notes

- The website uses Font Awesome CDN for icons
- Google Fonts is used for typography
- All animations are CSS-based for better performance
- The design is optimized for UAE business environment
- Service and differentiator cards open a details dialog (hover on desktop, tap on touch)

## Future Enhancements

- Integrate with email service if a contact form is added
- Add Google Analytics
- Implement blog/news section
- Add testimonials section
- Include social media links
