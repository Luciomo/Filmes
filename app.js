document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.flexbox-container');
  const themeToggleButton = document.getElementById('theme-toggle');
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.getElementById('search');
  const showFavoritesBtn = document.getElementById('show-favorites-btn');
  const header = document.querySelector('.flexbox-header');
  const modal = document.getElementById('movie-modal');

  // Variável de estado para controlar a exibição de favoritos
  let showingOnlyFavorites = false;
  let openerElement; // Armazena o elemento que abriu o modal

  if (!container) return;

  // --- Lógica do tema ---
  const THEME_KEY = 'theme-preference';

  function updateThemeButton(theme) {
    if (themeToggleButton) {
      themeToggleButton.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      themeToggleButton.setAttribute('aria-label', `Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`);
    }
  }

  const initialTheme = document.documentElement.dataset.theme || 'light';
  updateThemeButton(initialTheme);

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem(THEME_KEY, newTheme);
      updateThemeButton(newTheme);
    });
  }

  
  // Recupera a lista de filmes favoritos do localStorage
  function getFavoriteMovies() {
    return JSON.parse(localStorage.getItem('movies') || '[]');
  }

  function isFavorite(movie) {
    const favs = getFavoriteMovies();
    if (movie.id) {
      return favs.some(m => m.id === movie.id);
    }
    return favs.some(m => (m.title || '').toLowerCase() === (movie.title || '').toLowerCase());
  }

  function normalizeForStorage(movie) {
    let finalPosterUrl = movie.poster || null;
    if (!finalPosterUrl && movie.poster_path) {
      finalPosterUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    }
    return {
      id: movie.id,
      title: movie.title,
      poster: finalPosterUrl,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average
    };
  }

  function addFavorite(movie) {
    const favs = getFavoriteMovies();
    if (isFavorite(movie)) return;
    favs.push(normalizeForStorage(movie));
    localStorage.setItem('movies', JSON.stringify(favs));
  }

  function removeFavorite(movie) {
    let favs = getFavoriteMovies();
    if (movie.id) {
      favs = favs.filter(m => m.id !== movie.id);
    } else {
      favs = favs.filter(m => (m.title || '').toLowerCase() !== (movie.title || '').toLowerCase());
    }
    localStorage.setItem('movies', JSON.stringify(favs));
  }

  
  // Renderiza um único filme
  function renderMovie(movie, opts = { index: 0 }) {
    const item = document.createElement('div');
    const baseClass = 'flexbox-item';
    item.className = baseClass + (opts.className ? ' ' + opts.className : '');
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.style.animationDelay = `${opts.index * 50}ms`;

    const h2 = document.createElement('h2');
    h2.textContent = movie.title || 'Untitled';

    const img = document.createElement('img');
    let posterSrc = movie.poster || (movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : '');

    if (posterSrc) {
      img.src = posterSrc;
      img.alt = (movie.title || '') + ' Poster';
      img.width = 200;
      img.loading = 'lazy';
    }

    const favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.className = 'fav-button';
    const favorited = isFavorite(movie);
    if (favorited) favBtn.classList.add('favorited');
    favBtn.setAttribute('aria-pressed', favorited ? 'true' : 'false');
    favBtn.innerHTML = favorited
      ? '<img src="img/Heart.svg" alt="" width="20"> Favorito'
      : '<img src="img/Vector.svg" alt="" width="20"> Favoritar';

    favBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (isFavorite(movie)) {
        removeFavorite(movie);
        favBtn.classList.remove('favorited');
        favBtn.setAttribute('aria-pressed', 'false');
        favBtn.innerHTML = '<img src="img/Vector.svg" alt="" width="20"> Favoritar';
        showToast('Removido dos favoritos', 'info');
        if (showingOnlyFavorites) {
          item.remove();
          if (container.children.length === 0) {
            showMovies([], 'Você ainda não tem filmes favoritos.');
          }
        }
      } else {
        addFavorite(movie);
        favBtn.classList.add('favorited');
        favBtn.setAttribute('aria-pressed', 'true');
        favBtn.innerHTML = '<img src="img/Heart.svg" alt="" width="20"> Favorito';
        showToast('Adicionado aos favoritos', 'success');
      }
    });

    item.addEventListener('click', (e) => {
      if (e.target.closest('.fav-button')) return;
      showMovieDetails(movie);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showMovieDetails(movie);
      }
    });

    item.appendChild(h2);
    if (posterSrc) item.appendChild(img);
    item.appendChild(favBtn);

    container.appendChild(item);
  }

  function showMovieDetails(movie) {
    if (!modal) return;
    openerElement = document.activeElement;
    const body = modal.querySelector('.modal-body');
    body.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = movie.title || 'Untitled';
    title.id = 'modal-title';

    const img = document.createElement('img');
    let posterSrc = movie.poster || (movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : '');
    if (posterSrc) {
      img.src = posterSrc;
      img.alt = (movie.title || '') + ' Poster';
      img.className = 'modal-poster';
      body.appendChild(img);
    }

    body.appendChild(title);

    if (movie.overview) {
      const ov = document.createElement('p');
      ov.textContent = movie.overview;
      body.appendChild(ov);
    }

    if (movie.release_date) {
      const rel = document.createElement('p');
      rel.innerHTML = `<strong>Data de lançamento:</strong> ${movie.release_date}`;
      body.appendChild(rel);
    }

    if (movie.vote_average) {
      const vote = document.createElement('p');
      vote.innerHTML = `<strong>Avaliação:</strong> ⭐ ${movie.vote_average}`;
      body.appendChild(vote);
    }

    if (!movie.overview && !movie.release_date && !movie.vote_average) {
      const info = document.createElement('p');
      info.textContent = 'Detalhes adicionais não disponíveis para este filme.';
      body.appendChild(info);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  function hideModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (openerElement) openerElement.focus();
  }

  function showToast(message, type = 'info', timeout = 2500) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.setAttribute('aria-live', 'assertive');
      toastContainer.setAttribute('role', 'alert');
      document.body.appendChild(toastContainer);
    }

    const t = document.createElement('div');
    t.className = 'toast ' + (type === 'success' ? 'toast-success' : 'toast-info');
    t.textContent = message;
    toastContainer.appendChild(t);

    requestAnimationFrame(() => t.classList.add('show'));

    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, timeout);
  }

  
  // Configura eventos para o modal
  if (modal) {
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideModal();
    });
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }

  
  // Elemento para exibir informações de resultados
  let resultsInfo = document.getElementById('results-info');
  if (!resultsInfo && header) {
    resultsInfo = document.createElement('p');
    resultsInfo.id = 'results-info';
    resultsInfo.className = 'results-info';
    resultsInfo.setAttribute('aria-live', 'polite');
    header.appendChild(resultsInfo);
  }

  async function fetchFromApi(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${endpoint}?${queryString}`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function loadPopularMovies() {
    if (resultsInfo) resultsInfo.textContent = 'Carregando filmes populares...';
    const data = await fetchFromApi('/api/popular-movies', { language: 'pt-BR', page: 1 });
    if (data && data.results) {
      showMovies(data.results, 'Filmes populares');
    } else {
      if (resultsInfo) resultsInfo.textContent = 'Não foi possível carregar filmes populares.';
    }
  }

  function showMovies(movies, infoMessage) {
    container.innerHTML = '';
    if (movies.length === 0) {
      if (resultsInfo) resultsInfo.textContent = infoMessage || 'Nenhum filme encontrado.';
      return;
    }
    if (resultsInfo) resultsInfo.textContent = infoMessage;
    movies.forEach((m, index) => renderMovie(m, { className: 'movie', index }));
  }

  function resetFavoritesView() {
    if (showingOnlyFavorites) {
      showingOnlyFavorites = false;
      if (showFavoritesBtn) {
        showFavoritesBtn.classList.remove('active');
        showFavoritesBtn.textContent = 'Meus Favoritos';
      }
    }
  }

  if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      resetFavoritesView();
      const q = (searchInput.value || '').trim();
      if (!q) {
        loadPopularMovies();
        return;
      }
      if (resultsInfo) resultsInfo.textContent = 'Buscando...';
      const data = await fetchFromApi('/api/search-movies', { query: q, language: 'pt-BR', page: 1 });
      if (data && data.results && data.results.length > 0) {
        showMovies(data.results, `Exibindo ${data.results.length} resultados para "${q}".`);
      } else {
        showMovies([], `Sem resultados para "${q}".`);
      }
    });

    const clearBtn = document.querySelector('.clear-button');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetFavoritesView();
        searchInput.value = '';
        loadPopularMovies();
        searchInput.focus();
      });
    }
  }

  if (showFavoritesBtn) {
    showFavoritesBtn.addEventListener('click', () => {
      showingOnlyFavorites = !showingOnlyFavorites;
      if (showingOnlyFavorites) {
        const favs = getFavoriteMovies();
        showMovies(favs, favs.length > 0 ? `Exibindo ${favs.length} filme(s) favorito(s)` : 'Você ainda não tem filmes favoritos.');
        showFavoritesBtn.textContent = 'Mostrar Todos';
        showFavoritesBtn.classList.add('active');
        if (searchInput) searchInput.value = '';
      } else {
        showFavoritesBtn.textContent = 'Meus Favoritos';
        showFavoritesBtn.classList.remove('active');
        loadPopularMovies();
      }
    });
  }

  
  // Carrega filmes populares ao iniciar
  loadPopularMovies();
});
