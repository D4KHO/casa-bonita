document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const blogGrid = document.querySelector('.blog-grid');
    let blogCards = document.querySelectorAll('.blog-card');
    const categoryLinks = document.querySelectorAll('#categories-list a');
    const tagLinks = document.querySelectorAll('#tags-cloud a');
    const searchInput = document.querySelector('.search-form input[type="text"]');
    const searchForm = document.querySelector('.search-form');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const activeFiltersContainer = document.getElementById('active-filters');
    const paginationContainer = document.querySelector('.pagination .page-numbers');
    
    // Variables de paginación
    const postsPerPage = 6;
    let currentPage = 1;
    let filteredBlogCards = Array.from(blogCards);
    
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
    
    // Inicializar la paginación
    function initPagination() {
        updatePagination();
        
        // Event delegation para los botones de paginación
        paginationContainer.addEventListener('click', function(e) {
            e.preventDefault();
            const target = e.target.closest('a');
            if (!target) return;
            
            if (target.classList.contains('next')) {
                if (currentPage < Math.ceil(filteredBlogCards.length / postsPerPage)) {
                    currentPage++;
                    updateDisplayedPosts();
                    updatePagination();
                }
            } else if (target.classList.contains('prev')) {
                if (currentPage > 1) {
                    currentPage--;
                    updateDisplayedPosts();
                    updatePagination();
                }
            } else if (target.textContent && !isNaN(target.textContent)) {
                currentPage = parseInt(target.textContent);
                updateDisplayedPosts();
                updatePagination();
            }
            
            // Desplazarse suavemente hacia arriba
            window.scrollTo({
                top: blogGrid.offsetTop + 500,
                behavior: 'smooth'
            });
        });
    }
    
    // Actualizar la visualización de la paginación
    function updatePagination() {
        const totalPages = Math.ceil(filteredBlogCards.length / postsPerPage);
        let paginationHTML = '';
        
        // Botón Anterior
        if (currentPage > 1) {
            paginationHTML += `
                <li><a href="#" class="prev"><i class="fas fa-chevron-left"></i></a></li>
            `;
        }
        
        // Páginas
        const maxVisiblePages = 3;
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Primera página y puntos suspensivos si es necesario
        if (startPage > 1) {
            paginationHTML += `
                <li><a href="#" data-page="1">1</a></li>
                ${startPage > 2 ? '<li><span class="dots">...</span></li>' : ''}
            `;
        }
        
        // Páginas visibles
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHTML += `<li><span class="current">${i}</span></li>`;
            } else {
                paginationHTML += `<li><a href="#" data-page="${i}">${i}</a></li>`;
            }
        }
        
        // Última página y puntos suspensivos si es necesario
        if (endPage < totalPages) {
            paginationHTML += `
                ${endPage < totalPages - 1 ? '<li><span class="dots">...</span></li>' : ''}
                <li><a href="#" data-page="${totalPages}">${totalPages}</a></li>
            `;
        }
        
        // Botón Siguiente
        if (currentPage < totalPages) {
            paginationHTML += `
                <li><a href="#" class="next"><i class="fas fa-chevron-right"></i></a></li>
            `;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    // Actualizar las publicaciones mostradas según la página actual
    function updateDisplayedPosts() {
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const visiblePosts = filteredBlogCards.slice(startIndex, endIndex);
        
        // Ocultar todas las publicaciones
        blogCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Mostrar solo las publicaciones de la página actual
        visiblePosts.forEach(card => {
            if (card) card.style.display = 'block';
        });
    }
    
    // Inicializar el blog
    function initBlog() {
        // Ocultar contenedor de filtros al inicio
        document.querySelector('.filters-container').style.display = 'none';
        
        // Inicializar paginación
        initPagination();
        updateDisplayedPosts();
        
        // Event listeners para categorías
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = 1; // Resetear a la primera página
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

        filteredBlogCards = Array.from(blogCards).filter(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.blog-category').textContent.toLowerCase();
            return title.includes(term) || excerpt.includes(term) || category.includes(term);
        });
        
        // Actualizar la paginación y mostrar resultados
        currentPage = 1;
        updatePagination();
        updateDisplayedPosts();
        
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
        filteredBlogCards = Array.from(blogCards).filter(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTags = card.getAttribute('data-tags').split(',');
            
            // Filtrar por categoría
            const categoryMatch = activeFilters.category === 'all' || cardCategory === activeFilters.category;
            
            // Filtrar por etiquetas
            let tagsMatch = true;
            if (activeFilters.tags.length > 0) {
                tagsMatch = activeFilters.tags.some(tag => cardTags.includes(tag));
            }
            
            return categoryMatch && tagsMatch;
        });
        
        // Actualizar la paginación y mostrar las publicaciones
        currentPage = 1; // Volver a la primera página al aplicar nuevos filtros
        updatePagination();
        updateDisplayedPosts();
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


