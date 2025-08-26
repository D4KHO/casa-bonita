function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
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
// CARRUSEL DE TESTIMONIOS
// ==========================================

let testimonialsCurrentIndex = 0;
let testimonialsInterval;
let isTestimonialsTransitioning = false;
let totalOriginalCards = 0;

// Inicializar carrusel de testimonios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsCarousel();
});

function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    const originalCards = carousel?.querySelectorAll('.testimonio-card');
    
    if (!carousel || !originalCards.length) return;
    
    totalOriginalCards = originalCards.length;
    
    // No duplicar cards - usar las originales solamente
    
    // Crear indicadores
    createTestimonialsIndicators(totalOriginalCards);
    
    // Comenzar en la primera card (índice 0)
    testimonialsCurrentIndex = 0;
    
    // Configurar posiciones iniciales
    updateTestimonialsCarousel();
    
    // Iniciar autoplay
    startTestimonialsAutoplay();
    
    // Pausar en hover
    carousel.addEventListener('mouseenter', stopTestimonialsAutoplay);
    carousel.addEventListener('mouseleave', startTestimonialsAutoplay);
    
    // Eventos táctiles para móviles
    addTestimonialsSwipeEvents();
    
    // Recalcular al cambiar tamaño de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateTestimonialsCarousel();
        }, 100);
    });
}

function createInfiniteCards(carousel, originalCards) {
    // Clonar las primeras 3 cards al final para el efecto infinito hacia adelante
    for (let i = 0; i < 3; i++) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add('cloned');
        carousel.appendChild(clone);
    }
    
    // Clonar las últimas 3 cards al inicio para el efecto infinito hacia atrás
    for (let i = totalOriginalCards - 3; i < totalOriginalCards; i++) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add('cloned');
        carousel.insertBefore(clone, carousel.firstChild);
    }
    
    // Ajustar el índice inicial para compensar las cards clonadas del inicio
    testimonialsCurrentIndex = 3;
}

function createTestimonialsIndicators(totalCards) {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < totalCards; i++) {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToTestimonialsSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

function updateTestimonialsCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    const allCards = carousel?.querySelectorAll('.testimonio-card');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    if (!carousel || !allCards.length) return;

    // Detectar si estamos en móvil
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    // Calcular desplazamiento
    const cardWidth = allCards[0].offsetWidth;
    const cardMargin = isMobile ? (isSmallMobile ? 16 : 20) : 30; // márgenes según dispositivo
    const totalCardWidth = cardWidth + cardMargin;
    
    // En móvil, usar solo el desplazamiento por card sin centrado adicional
    // ya que el CSS se encarga del centrado inicial
    const translateX = isMobile ? 
        -testimonialsCurrentIndex * totalCardWidth :
        -testimonialsCurrentIndex * totalCardWidth + (carousel.parentElement.offsetWidth - cardWidth) / 2;
    
    // Aplicar transformación
    carousel.style.transform = `translateX(${translateX}px)`;
    
    // Actualizar clases de las tarjetas - SOLO la del centro está activa
    allCards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next', 'far');
        
        const distance = Math.abs(index - testimonialsCurrentIndex);
        
        if (index === testimonialsCurrentIndex) {
            // Card central - completamente visible
            card.classList.add('active');
        } else if (distance === 1) {
            // Cards adyacentes - un poco desvanecidas
            card.classList.add(index < testimonialsCurrentIndex ? 'prev' : 'next');
        } else {
            // Cards lejanas - muy desvanecidas
            card.classList.add('far');
        }
    });
    
    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === testimonialsCurrentIndex);
    });
}

function getRealIndex(currentIndex) {
    // Convertir el índice actual (que incluye clones) al índice real de las cards originales
    const adjustedIndex = currentIndex - 3; // Restar las 3 cards clonadas del inicio
    
    if (adjustedIndex < 0) {
        return totalOriginalCards + adjustedIndex;
    } else if (adjustedIndex >= totalOriginalCards) {
        return adjustedIndex % totalOriginalCards;
    }
    
    return adjustedIndex;
}

function moveCarousel(direction) {
    if (isTestimonialsTransitioning) return;
    
    const carousel = document.getElementById('testimonialsCarousel');
    const allCards = carousel?.querySelectorAll('.testimonio-card');
    
    if (!allCards || !allCards.length) return;
    
    isTestimonialsTransitioning = true;
    
    testimonialsCurrentIndex += direction;
    
    // Manejar los límites del carrusel
    if (testimonialsCurrentIndex >= allCards.length) {
        testimonialsCurrentIndex = allCards.length - 1; // Quedarse en la última
    } else if (testimonialsCurrentIndex < 0) {
        testimonialsCurrentIndex = 0; // Quedarse en la primera
    }
    
    // Aplicar la transición
    carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    updateTestimonialsCarousel();
    
    setTimeout(() => {
        isTestimonialsTransitioning = false;
    }, 600);
    
    // Resetear autoplay
    stopTestimonialsAutoplay();
    startTestimonialsAutoplay();
}

function goToTestimonialsSlide(index) {
    if (isTestimonialsTransitioning) return;
    
    isTestimonialsTransitioning = true;
    
    // Convertir el índice del indicador al índice real del carrusel (incluyendo clones)
    testimonialsCurrentIndex = index + 3; // Sumar 3 por las cards clonadas del inicio
    
    const carousel = document.getElementById('testimonialsCarousel');
    carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    updateTestimonialsCarousel();
    
    setTimeout(() => {
        isTestimonialsTransitioning = false;
    }, 600);
    
    // Resetear autoplay
    stopTestimonialsAutoplay();
    startTestimonialsAutoplay();
}

function startTestimonialsAutoplay() {
    stopTestimonialsAutoplay();
    testimonialsInterval = setInterval(() => {
        moveCarousel(1);
    }, 4000); // Cambio cada 4 segundos
}

function stopTestimonialsAutoplay() {
    if (testimonialsInterval) {
        clearInterval(testimonialsInterval);
        testimonialsInterval = null;
    }
}

function addTestimonialsSwipeEvents() {
    const carousel = document.getElementById('testimonialsCarousel');
    if (!carousel) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevenir scroll mientras se hace swipe
    });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Solo procesar si el movimiento horizontal es mayor que el vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                moveCarousel(-1); // Swipe derecha - slide anterior
            } else {
                moveCarousel(1);  // Swipe izquierda - slide siguiente
            }
        }
    });
}

// Redimensionar carrusel en cambio de ventana
window.addEventListener('resize', () => {
    if (document.getElementById('testimonialsCarousel')) {
        updateTestimonialsCarousel();
    }
});

// Intersection Observer para animar testimonios al entrar en vista
const testimonialsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.testimonio-card:not(.cloned)');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, { threshold: 0.1 });

// Observar la sección de testimonios
document.addEventListener('DOMContentLoaded', () => {
    const testimonialsSection = document.querySelector('.testimonios-section');
    if (testimonialsSection) {
        testimonialsObserver.observe(testimonialsSection);
    }
});
