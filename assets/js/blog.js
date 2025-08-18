document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const blogGrid = document.querySelector('.blog-grid');
    const blogCards = document.querySelectorAll('.blog-card');
    const categoryLinks = document.querySelectorAll('#categories-list a');
    const tagLinks = document.querySelectorAll('#tags-cloud a');
    const searchInput = document.querySelector('.search-form input[type="text"]');
    const searchForm = document.querySelector('.search-form');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const activeFiltersContainer = document.getElementById('active-filters');
    
    // Filtros activos
    let activeFilters = {
        category: 'all',
        tags: []
    };

    // Mostrar filtros activos
    function updateActiveFiltersDisplay() {
        activeFiltersContainer.innerHTML = '';
        
        // Mostrar categoría activa
        if (activeFilters.category !== 'all') {
            const categoryTag = document.createElement('span');
            categoryTag.className = 'active-filter-tag';
            categoryTag.innerHTML = `
                Categoría: ${activeFilters.category}
                <button type="button" data-type="category" data-value="${activeFilters.category}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(categoryTag);
        }
        
        // Mostrar etiquetas activas
        activeFilters.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'active-filter-tag';
            tagElement.innerHTML = `
                ${tag}
                <button type="button" data-type="tag" data-value="${tag}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(tagElement);
        });
        
        // Mostrar u ocultar el contenedor de filtros activos
        if (activeFilters.category === 'all' && activeFilters.tags.length === 0) {
            document.querySelector('.filters-container').style.display = 'none';
        } else {
            document.querySelector('.filters-container').style.display = 'flex';
        }
    }
    
    // Limpiar todos los filtros
    function clearAllFilters() {
        // Restablecer filtros
        activeFilters = {
            category: 'all',
            tags: []
        };
        
        // Actualizar UI
        updateActiveFiltersDisplay();
        
        // Restablecer categoría activa
        const allCategories = document.querySelectorAll('#categories-list a');
        allCategories.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-filter') === 'all') {
                link.classList.add('active');
            }
        });
        
        // Restablecer etiquetas activas
        document.querySelectorAll('#tags-cloud a').forEach(tag => {
            tag.classList.remove('active');
        });
        
        // Restablecer búsqueda
        searchInput.value = '';
        
        // Aplicar filtros (sin ninguna categoría o etiqueta)
        applyFilters();
    }
    
    // Inicializar el blog
    function initBlog() {
        // Ocultar contenedor de filtros al inicio
        document.querySelector('.filters-container').style.display = 'none';
        
        // Event listeners para categorías
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const filterValue = this.getAttribute('data-filter');
                activeFilters.category = filterValue;
                updateActiveCategory(this);
                updateActiveFiltersDisplay();
                applyFilters();
            });
        });

        // Event listeners para etiquetas
        tagLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tag = this.getAttribute('data-tag');
                toggleTagFilter(tag, this);
                updateActiveFiltersDisplay();
            });
        });
        
        // Event listener para el botón de limpiar filtros
        clearFiltersBtn.addEventListener('click', clearAllFilters);
        
        // Event delegation para eliminar filtros individuales
        document.addEventListener('click', function(e) {
            const removeBtn = e.target.closest('.active-filter-tag button');
            if (!removeBtn) return;
            
            const type = removeBtn.getAttribute('data-type');
            const value = removeBtn.getAttribute('data-value');
            
            if (type === 'category') {
                activeFilters.category = 'all';
                document.querySelectorAll('#categories-list a').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelector('#categories-list a[data-filter="all"]').classList.add('active');
            } else if (type === 'tag') {
                const tagIndex = activeFilters.tags.indexOf(value);
                if (tagIndex > -1) {
                    activeFilters.tags.splice(tagIndex, 1);
                    document.querySelectorAll('#tags-cloud a').forEach(tag => {
                        if (tag.getAttribute('data-tag') === value) {
                            tag.classList.remove('active');
                        }
                    });
                }
            }
            
            updateActiveFiltersDisplay();
            applyFilters();
        });

        // Event listener para búsqueda
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim().toLowerCase();
            filterBySearch(searchTerm);
        });

        // Event listener para limpiar búsqueda
        searchInput.addEventListener('input', function() {
            if (this.value === '') {
                resetSearch();
            }
        });
    }

    // Actualizar categoría activa
    function updateActiveCategory(activeLink) {
        categoryLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // Alternar filtro de etiqueta
    function toggleTagFilter(tag, element) {
        const index = activeFilters.tags.indexOf(tag);
        if (index === -1) {
            // Añadir etiqueta
            activeFilters.tags.push(tag);
            element.classList.add('active');
        } else {
            // Quitar etiqueta
            activeFilters.tags.splice(index, 1);
            element.classList.remove('active');
        }
        // Actualizar la visualización de filtros activos
        updateActiveFiltersDisplay();
        // Aplicar los filtros
        applyFilters();
    }

    // Filtrar por búsqueda
    function filterBySearch(term) {
        if (term === '') {
            resetSearch();
            return;
        }

        blogCards.forEach(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.blog-category').textContent.toLowerCase();
            const matchesSearch = title.includes(term) || excerpt.includes(term) || category.includes(term);
            
            card.style.display = matchesSearch ? 'block' : 'none';
        });
        
        // Mostrar el contenedor de filtros para la búsqueda
        document.querySelector('.filters-container').style.display = 'flex';
    }

    // Restablecer búsqueda
    function resetSearch() {
        searchInput.value = '';
        applyFilters();
    }

    // Aplicar todos los filtros
    function applyFilters() {
        blogCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTags = card.getAttribute('data-tags').split(',');
            
            // Filtrar por categoría
            const categoryMatch = activeFilters.category === 'all' || cardCategory === activeFilters.category;
            
            // Filtrar por etiquetas
            let tagsMatch = true;
            if (activeFilters.tags.length > 0) {
                tagsMatch = activeFilters.tags.some(tag => cardTags.includes(tag));
            }
            
            // Mostrar u ocultar tarjeta según los filtros
            if (categoryMatch && tagsMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Actualizar categoría activa
    function updateActiveCategory(activeLink) {
        categoryLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // Inicializar el blog
    initBlog();
});


// Este script actualiza dinámicamente los enlaces "Leer más" en blog.html
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los artículos del blog
    const articles = document.querySelectorAll('.blog-card');
    
    // Recorrer cada artículo y actualizar el enlace "Leer más"
    articles.forEach((article, index) => {
        // El ID del artículo es el índice + 1 (para que empiece en 1)
        const articleId = index + 1;
        
        // Encontrar el enlace "Leer más" dentro de este artículo
        const readMoreLink = article.querySelector('.read-more');
        
        if (readMoreLink) {
            // Actualizar el href con el ID del artículo
            readMoreLink.href = `blog-article.html?id=${articleId}`;
        }
    });
});


