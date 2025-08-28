function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20; // 20px de margen adicional
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}


function openWhatsApp() {
    const mensaje = 'Hola, quiero información sobre Casa Bonita Residencial';
    const whatsappUrl = `https://wa.me/51946552086?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validar campos obligatorios
    if (!data.terminos) {
        showToast('Error: Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    const requiredFields = ['nombre', 'dni', 'telefono', 'grupoFamiliar', 'ingresoMensual'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        showToast('Error: Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Construir mensaje para WhatsApp
    const mensaje = `Hola, soy ${data.nombre}. Estoy interesado en Casa Bonita Residencial.

📋 Mis datos:
- DNI: ${data.dni}
- Teléfono: ${data.telefono}
- Email: ${data.email || 'No proporcionado'}
- Grupo familiar: ${getGroupFamiliarText(data.grupoFamiliar)}
- Ingreso mensual: ${data.ingresoMensual}
- Mensaje: ${data.mensaje || 'Sin mensaje adicional'}

¿Podrían brindarme más información?`;

    // Mostrar feedback al usuario
    showToast('¡Formulario enviado! Redirigiendo a WhatsApp...', 'success');
    
    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/51946552086?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpiar el formulario
    form.reset();
    
    return false;
}

function handleHeroFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validar campos obligatorios
    if (!data.nombre || !data.telefono) {
        showToast('Error: Por favor completa tu nombre y teléfono', 'error');
        return;
    }
    
    // Construir mensaje para WhatsApp
    const mensaje = `Hola, soy ${data.nombre}. Quiero información sobre Casa Bonita Residencial.

📞 Mi teléfono: ${data.telefono}
📧 Email: ${data.email || 'No proporcionado'}
💬 Mensaje: ${data.mensaje || 'Solicito información general sobre el proyecto'}

¿Podrían contactarme para brindarme más detalles?`;

    // Mostrar feedback al usuario
    showToast('¡Formulario enviado! Redirigiendo a WhatsApp...', 'success');
    
    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/51946552086?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpiar el formulario
    form.reset();
    
    return false;
}

function getGroupFamiliarText(value) {
    const options = {
        'soltero': 'Soltero/a',
        'pareja': 'En pareja (sin hijos)',
        'familia-1': 'Familia con 1 hijo',
        'familia-2': 'Familia con 2 hijos',
        'familia-3': 'Familia con 3+ hijos',
        'madre-soltera': 'Madre/Padre soltero'
    };
    return options[value] || value;
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="toast-close">×</button>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (!document.querySelector('#toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.25rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = index * 80;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.feature-card, .modelo-card, .benefit-card, .testimonio-card, .requirement-card, .timeline-content, .stat-card');
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        observer.observe(el);
    });
}

function animateCounters() {
     const counters = document.querySelectorAll('.stat-number:not(.highlight-stats .stat-number)');
    const observerOptions = {
        threshold: 0.4,
        rootMargin: '0px 0px -20px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const originalText = counter.textContent;
                const target = parseInt(originalText.replace(/[^\d]/g, ''));
                const duration = 900;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        const currentValue = Math.floor(current);
                        if (originalText.includes('m²')) {
                            counter.textContent = currentValue + ' m²';
                        } else if (originalText.includes('%')) {
                            counter.textContent = currentValue + '%';
                        } else {
                            counter.textContent = currentValue;
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = originalText;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateHeroElements() {
    const heroElements = [
        { 
            selector: '.hero-badge', 
            delay: 100,
            transform: 'translateY(-40px) scale(0.8)',
            finalTransform: 'translateY(0) scale(1)'
        },
        { 
            selector: '.hero-title', 
            delay: 300,
            transform: 'translateX(-60px) scale(0.9)',
            finalTransform: 'translateX(0) scale(1)'
        },
        { 
            selector: '.hero-subtitle', 
            delay: 500,
            transform: 'translateX(60px) scale(0.9)',
            finalTransform: 'translateX(0) scale(1)'
        },
        { 
            selector: '.hero-description', 
            delay: 700,
            transform: 'translateY(40px) scale(0.95)',
            finalTransform: 'translateY(0) scale(1)'
        },
        { 
            selector: '.hero-location', 
            delay: 900,
            transform: 'translateY(30px) scale(0.7)',
            finalTransform: 'translateY(0) scale(1)'
        },
        { 
            selector: '.hero-buttons', 
            delay: 1100,
            transform: 'translateY(50px) scale(0.8)',
            finalTransform: 'translateY(0) scale(1)'
        },
        { 
            selector: '.scroll-indicator', 
            delay: 1300,
            transform: 'translateY(20px) scale(0.5)',
            finalTransform: 'translateY(0) scale(1)'
        }
    ];
    
    heroElements.forEach(({ selector, transform }) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = transform;
            element.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
    });
    
    const heroForm = document.querySelector('.hero-search');
    if (heroForm) {
        heroForm.style.opacity = '0';
        heroForm.style.transition = 'opacity 1s ease-out';
    }
    
    setTimeout(() => {
        heroElements.forEach(({ selector, delay, finalTransform }) => {
            setTimeout(() => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.opacity = '1';
                    element.style.transform = finalTransform;
                    
                    element.style.filter = 'brightness(1.1)';
                    setTimeout(() => {
                        element.style.filter = 'brightness(1)';
                        element.style.transition = 'filter 0.3s ease';
                    }, 200);
                }
            }, delay);
        });
        
        setTimeout(() => {
            if (heroForm) {
                heroForm.style.opacity = '1';
            }
        }, 400);
        
    }, 200);
}

function initParallax() {
    const parallaxElements = document.querySelectorAll('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (element.classList.contains('scroll-indicator')) {
                element.style.transform = `translateX(-50%) translateY(${rate * 0.1}px)`;
            }
        });
    });
}

function enhanceHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .modelo-card, .benefit-card, .testimonio-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0px) scale(1)';
            card.style.transition = 'all 0.3s ease';
        });
    });
}

function enhanceButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05) translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1) translateY(0px)';
            button.style.boxShadow = '';
        });
        
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.98) translateY(1px)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1.05) translateY(-2px)';
        });
    });
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and effects
    animateOnScroll();
    animateCounters();
    animateHeroElements();
    initParallax();
    enhanceHoverEffects();
    enhanceButtonAnimations();
    lazyLoadImages();
    
    // Add form submission handlers
    const heroForm = document.getElementById('heroContactForm');
    const contactForm = document.getElementById('contactForm');
    
    if (heroForm) {
        heroForm.addEventListener('submit', handleHeroFormSubmit);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

/* Mobile navigation: inject hamburger button and overlay, handle toggle */
document.addEventListener('DOMContentLoaded', function() {
    const headerContent = document.querySelector('.header-content');
    if (!headerContent) return;

    // Create hamburger button
    const mobileBtn = document.createElement('button');
    mobileBtn.className = 'mobile-menu-btn';
    mobileBtn.setAttribute('aria-label', 'Abrir menú');
    mobileBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
    `;

    // Insert button before the CTA button (or at end)
    const cta = headerContent.querySelector('.cta-button');
    if (cta) headerContent.insertBefore(mobileBtn, cta);
    else headerContent.appendChild(mobileBtn);

    // Create mobile nav overlay
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
        <div class="mobile-panel" role="dialog" aria-modal="true">
            <button class="mobile-close" aria-label="Cerrar menú" style="align-self:flex-end;background:none;border:none;font-size:1.6rem;">&times;</button>
            <nav class="desktop-nav" role="navigation"></nav>
            <div class="mobile-logo-container">
                <img src="assets/img/LOGO PNG NEGRO.png" alt="Casa Bonita Logo" class="mobile-logo">
            </div>
        </div>
    `;
    document.body.appendChild(mobileNav);

    // Clone desktop nav links into mobile panel
    const desktopNav = document.querySelector('.desktop-nav');
    const mobilePanelNav = mobileNav.querySelector('.desktop-nav');
    if (desktopNav && mobilePanelNav) {
        mobilePanelNav.innerHTML = desktopNav.innerHTML;
    }

    const openMenu = () => {
        mobileNav.classList.add('open');
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');
        mobileBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        mobileNav.classList.remove('open');
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
        mobileBtn.setAttribute('aria-expanded', 'false');
    };

    mobileBtn.addEventListener('click', openMenu);
    mobileNav.querySelector('.mobile-close').addEventListener('click', closeMenu);

    // Close when clicking outside panel
    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) closeMenu();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
            closeMenu();
        }
    });

    // Close when clicking a link inside mobile nav
    mobileNav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        // If link is anchor to section, let it scroll then close
        setTimeout(closeMenu, 150);
    });
});

// Manejo de errores globales
window.addEventListener('error', function(event) {
    console.error('Error en la aplicación:', event.error);
});

// Script para el carrusel (safe: no-op si no existe en la página)
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return; // no hay carrusel en esta página

    const slides = carousel.querySelectorAll('.carousel-slide');
    if (!slides || slides.length === 0) return; // nada que animar

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Función para actualizar el carrusel
    function updateCarousel() {
        if (!carousel) return;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualizar indicadores si existen
        if (indicators && indicators.length) {
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }

    // Event listeners para los botones (si existen)
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }

    // Event listeners para los indicadores
    if (indicators && indicators.length) {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }

    // Cambio automático cada 5 segundos (solo si hay más de 1 slide)
    if (totalSlides > 1) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }, 5000);
    }
});

    // Mobile menu logic removed

        // Add animation to blog cards on scroll
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.blog-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            observer.observe(card);
        });

// ==========================================
// CARRUSEL DE TESTIMONIOS CON SWIPER
// ==========================================

let testimonialsSwiper;

// Inicializar carrusel de testimonios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsCarousel();
});

function initTestimonialsCarousel() {
    const swiperContainer = document.querySelector('.testimonials-swiper');
    
    if (!swiperContainer) return;
    
    // Configurar Swiper para carrusel infinito
    testimonialsSwiper = new Swiper('.testimonials-swiper', {
        // Configuración básica para loop infinito
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 30,
        
        // Autoplay
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        
        // Velocidad de transición
        speed: 600,
        
        // Configuración responsive
        breakpoints: {
            320: {
                spaceBetween: 200,
                slidesPerView: 2,
                centeredSlides: true,
            },
            768: {
                spaceBetween: 20,
                slidesPerView: 'auto',
                centeredSlides: true,
            },
            1024: {
                spaceBetween: 30,
                slidesPerView: 3,
                centeredSlides: true,
            }
        },
        
        // Eventos
        on: {
            init: function() {
                // Contar slides originales (no duplicadas por loop)
                const originalSlides = document.querySelectorAll('.testimonials-swiper .swiper-slide');
                createTestimonialsIndicators(originalSlides.length);
                updateSlideClasses(this);
            },
            slideChange: function() {
                updateSlideClasses(this);
                updateActiveIndicator(this.realIndex);
            }
        }
    });
}

// Función para crear indicadores personalizados
function createTestimonialsIndicators(totalCards) {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < totalCards; i++) {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => {
            if (testimonialsSwiper) {
                testimonialsSwiper.slideToLoop(i);
            }
        });
        indicatorsContainer.appendChild(indicator);
    }
}

// Función para actualizar el indicador activo
function updateActiveIndicator(activeIndex) {
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === activeIndex);
    });
}

// Función para aplicar las clases de estilo originales
function updateSlideClasses(swiper) {
    const slides = swiper.slides;
    const activeIndex = swiper.realIndex;
    const totalSlides = Math.floor(slides.length / 3); // Slides originales sin duplicados
    
    slides.forEach((slide, index) => {
        const card = slide.querySelector('.testimonio-card');
        if (!card) return;
        
        // Limpiar todas las clases de estado
        card.classList.remove('active', 'prev', 'next', 'far');
        
        // Obtener el índice real de la slide
        const realIndex = parseInt(slide.getAttribute('data-swiper-slide-index') || '0');
        
        // Calcular la distancia desde la slide activa
        const distance = Math.abs(realIndex - activeIndex);
        
        // Aplicar clases basadas en la posición
        if (realIndex === activeIndex) {
            card.classList.add('active');
        } else if (distance === 1 || 
                  (activeIndex === 0 && realIndex === totalSlides - 1) ||
                  (activeIndex === totalSlides - 1 && realIndex === 0)) {
            // Determinar si es prev o next considerando el loop circular
            const isPrev = (realIndex === activeIndex - 1) || 
                          (activeIndex === 0 && realIndex === totalSlides - 1);
            card.classList.add(isPrev ? 'prev' : 'next');
        } else {
            card.classList.add('far');
        }
    });
}

// Mantener funciones existentes para compatibilidad con botones
function moveCarousel(direction) {
    if (testimonialsSwiper) {
        if (direction > 0) {
            testimonialsSwiper.slideNext();
        } else {
            testimonialsSwiper.slidePrev();
        }
    }
}

function startTestimonialsAutoplay() {
    if (testimonialsSwiper && testimonialsSwiper.autoplay) {
        testimonialsSwiper.autoplay.start();
    }
}

function stopTestimonialsAutoplay() {
    if (testimonialsSwiper && testimonialsSwiper.autoplay) {
        testimonialsSwiper.autoplay.stop();
    }
}

// Funcionalidad del header compacto al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    let isScrolling = false;
    let wasScrolled = false; // Rastrear el estado anterior

    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isCurrentlyScrolled = scrollTop > 100;
        
        // Detectar cambio de estado
        const stateChanged = wasScrolled !== isCurrentlyScrolled;
        
        // Agregar o quitar la clase 'scrolled' basado en la posición del scroll
        if (isCurrentlyScrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Recalcular padding solo si hubo cambio de estado o al inicializar
        if (stateChanged || wasScrolled === undefined) {
            // Usar timeout para asegurar que las transiciones CSS se completen
            setTimeout(() => {
                updateBodyPadding();
            }, 100); // Ligeramente más que la transición CSS (0.3s)
        }
        
        wasScrolled = isCurrentlyScrolled;
        lastScrollTop = scrollTop;
        isScrolling = false;
    }

    // Optimizar el rendimiento usando requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(handleHeaderScroll);
            isScrolling = true;
        }
    });

    // Asegurar que el header inicie correctamente
    handleHeaderScroll();
});

// Sistema inteligente de cálculo de padding del body
function updateBodyPadding() {
    const body = document.body;
    const mainHeader = document.querySelector('.main-header');
    
    if (!mainHeader) return;
    
    // Forzar múltiples reflows para obtener medidas precisas
    mainHeader.offsetHeight;
    
    // Usar requestAnimationFrame doble para asegurar que los cambios CSS se apliquen completamente
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const headerHeight = mainHeader.offsetHeight;
            body.style.paddingTop = headerHeight + 'px';
        });
    });
}

// Función para cerrar el anuncio promocional
function closePromoBar() {
    const promoBar = document.querySelector('.top-promo');
    if (promoBar) {
        // Agregar animación de desvanecimiento
        promoBar.style.transition = 'opacity 0.3s ease, max-height 0.3s ease';
        promoBar.style.opacity = '0';
        promoBar.style.maxHeight = '0';
        promoBar.style.overflow = 'hidden';
        
        // Remover el elemento después de la animación
        setTimeout(() => {
            promoBar.remove();
            // Recalcular con delay adicional para manejar transiciones
            setTimeout(() => {
                updateBodyPadding();
            }, 100); // Delay adicional para cambios complejos
        }, 300);
    }
}

// Configurar el padding inicial y observadores
document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.querySelector('.main-header');
    
    if (mainHeader) {
        // Aplicar padding inicial después de que todo se cargue
        setTimeout(() => {
            updateBodyPadding();
        }, 100);
        
        // Observar cambios de tamaño de ventana
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateBodyPadding();
            }, 50);
        });
        
        // Configurar el botón de cerrar promoción
        const closeButton = document.querySelector('.promo-close');
        if (closeButton) {
            closeButton.addEventListener('click', closePromoBar);
        }
        
        // Observador de mutaciones para detectar cambios en el DOM del header
        const headerObserver = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            let hasClassChange = false;
            let hasElementRemoved = false;
            
            mutations.forEach((mutation) => {
                // Detectar cambios en clases (como .scrolled)
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    hasClassChange = true;
                }
                // Detectar eliminación de elementos (como .top-promo)
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    hasElementRemoved = true;
                }
            });
            
            // Manejar diferentes tipos de cambios con delays apropiados
            if (hasClassChange) {
                // Cambio de clase (scroll): esperar a que termine la transición
                setTimeout(updateBodyPadding, 50);
            } else if (hasElementRemoved) {
                // Elemento removido: delay más corto
                setTimeout(updateBodyPadding, 50);
            }
        });
        
        // Observar el header y sus cambios
        headerObserver.observe(mainHeader, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }
});

// Barra de progreso de scroll
document.addEventListener('DOMContentLoaded', function() {
    // Crear la barra de progreso
    const header = document.querySelector('.main-header');
    if (header) {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.id = 'scrollProgress';
        header.appendChild(progressBar);
    }
    
    // Función para actualizar la barra
    function updateScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    // Eventos
    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();
});

// Función para cargar el modelo 3D bajo demanda
function loadModel3D() {
    const placeholder = document.getElementById('model-loading-placeholder');
    const container = document.getElementById('model-viewer-container');
    
    if (!placeholder || !container) return;
    
    // Mostrar cargando
    placeholder.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: #666;">Cargando modelo 3D...</p>
        </div>
    `;
    
    // Cargar model-viewer dinámicamente
    if (!window.modelViewerLoaded) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js';
        script.onload = function() {
            window.modelViewerLoaded = true;
            insertModel3D();
        };
        document.head.appendChild(script);
    } else {
        insertModel3D();
    }
    
    function insertModel3D() {
        container.innerHTML = `
            <model-viewer 
                id="casa-model" 
                src="assets/img/casa.glb"
                alt="Modelo 3D de Casa Bonita Residencial" 
                auto-rotate 
                camera-controls
                shadow-intensity="0.7" 
                camera-orbit="45deg 60deg 100%" 
                field-of-view="45deg"
                min-camera-orbit="auto 30deg auto" 
                max-camera-orbit="auto 75deg auto" 
                exposure="1"
                environment-intensity="0.8" 
                shadow-softness="0.6" 
                reveal="auto"
                style="width: 100%; height: 100%; opacity: 0; transition: opacity 0.5s ease;">
                
                <div slot="poster" class="model-poster">
                    <div class="spinner"></div>
                    <p>Cargando modelo 3D...</p>
                </div>
            </model-viewer>
        `;
        
        const modelViewer = container.querySelector('model-viewer');
        if (modelViewer) {
            modelViewer.addEventListener('load', () => {
                modelViewer.style.opacity = '1';
                placeholder.style.display = 'none';
                container.style.display = 'block';
            });
            
            modelViewer.addEventListener('error', () => {
                console.error('Error al cargar el modelo 3D');
                placeholder.innerHTML = '<p style="color: #666;">No se pudo cargar el modelo 3D</p>';
            });
        }
    }
}

// Lazy loading mejorado del video hero
function initHeroVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;
    
    // Verificar si está en el viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Cargar el video cuando sea visible
                if (!video.src && video.querySelector('source')) {
                    const source = video.querySelector('source');
                    video.src = source.src;
                    video.load();
                }
                observer.unobserve(video);
            }
        });
    });
    
    observer.observe(video);
}

// Inicializar en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initHeroVideo();
});
