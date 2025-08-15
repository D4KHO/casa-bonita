let isMenuOpen = false;

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        mobileNav.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        mobileNav.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    
    isMenuOpen = false;
    mobileNav.classList.add('hidden');  
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
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
                const duration = 1800;
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

// Manejo de errores globales
window.addEventListener('error', function(event) {
    console.error('Error en la aplicación:', event.error);
});