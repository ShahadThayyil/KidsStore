document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Product carousel functionality
  const carousel = document.querySelector('.product-carousel');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  if (carousel && prevBtn && nextBtn) {
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    
    // Show only the current item
    function updateCarousel() {
      items.forEach((item, index) => {
        item.classList.toggle('hidden', index !== currentIndex);
        
        if (index === currentIndex) {
          item.classList.add('animate-float');
        } else {
          item.classList.remove('animate-float');
        }
      });
    }
    
    // Initialize carousel
    updateCarousel();
    
    // Navigation buttons
    prevBtn.addEventListener('click', function() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateCarousel();
    });
    
    nextBtn.addEventListener('click', function() {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
    });
  }
  
  // WhatsApp product sharing functionality
  const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
  
  whatsappButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productName = this.dataset.name;
      const productPrice = this.dataset.price;
      const productUrl = window.location.href;
      const whatsappNumber = this.dataset.whatsapp;
      
      const message = encodeURIComponent(`Hello! I would like to purchase *${productName}* for $${productPrice}. Product link: ${productUrl}`);
      
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    });
  });

  // Product hover effects
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const addToCartBtn = card.querySelector('.add-to-cart');
    
    card.addEventListener('mouseenter', function() {
      if (addToCartBtn) {
        addToCartBtn.classList.remove('opacity-0');
        addToCartBtn.classList.add('opacity-100');
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (addToCartBtn) {
        addToCartBtn.classList.remove('opacity-100');
        addToCartBtn.classList.add('opacity-0');
      }
    });
  });
});