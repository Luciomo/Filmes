document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adicionarFilmeForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('titulo').value.trim();
    const poster = document.getElementById('poster').value.trim();

    if (!title) return;

    
    const movie = { title, poster };

    const movies = JSON.parse(localStorage.getItem('movies') || '[]');
    // Evitar duplicatas por título
    const exists = movies.some(m => (m.title || '').toLowerCase() === (movie.title || '').toLowerCase());
    if (!exists) {
      movies.push(movie);
      localStorage.setItem('movies', JSON.stringify(movies));
    }

    // Redirecionar para a página principal após adicionar o filme
    window.location.href = 'index.html';
  });
}); 

