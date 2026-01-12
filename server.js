// servidor simples node.js para atuar como um proxy seguro para a API TMDB
// Objetivo: evitar expor a chave API TMDB no frontend
// Instalar dependências: npm install express cors node-fetch
// Iniciar servidor: node server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Loja segura da chave API TMDB no backend
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'API_KEY_AQUI';

if (!TMDB_API_KEY) {
  console.error('FATAL ERROR: TMDB_API_KEY environment variable is not set.');
  process.exit(1);
}

// Configurar CORS: em produção, limitar origens; em desenvolvimento permitir todas para facilitar testes
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: ['http://seu-dominio.com', 'https://seu-dominio.com'],
    methods: ['GET', 'POST'],
    credentials: true
  }));
} else {
  // Desenvolvimento: permitir todas as origens para evitar problemas de CORS durante testes locais
  app.use(cors());
} 

// Arquivo estático (HTML, CSS, JS)
app.use(express.static('./'));

// Proxy para buscar filmes populares da TMDB
app.get('/api/popular-movies', async (req, res) => {
  try {
    const language = req.query.language || 'pt-BR';
    const page = req.query.page || 1;

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=${language}&page=${page}`;
    console.log(`[proxy] Requesting TMDB: ${url} (from origin: ${req.get('origin') || 'unknown'})`);

    const response = await fetch(url);

    console.log(`[proxy] TMDB response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const text = await response.text();
      console.error('[proxy] TMDB error body:', text);
      return res.status(response.status).json({ error: 'Failed to fetch popular movies from TMDB' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Proxy para busca de filmes (search)
app.get('/api/search-movies', async (req, res) => {
  try {
    // Permitir `q` ou `query` como nome do parâmetro
    const query = (req.query.query || req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Missing required query parameter `query` or `q`' });
    }

    const language = req.query.language || 'pt-BR';
    const page = req.query.page || 1;
    const include_adult = req.query.include_adult || 'false';

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=${language}&query=${encodeURIComponent(query)}&page=${page}&include_adult=${include_adult}`;
    console.log(`[proxy] Requesting TMDB (search): ${url} (from origin: ${req.get('origin') || 'unknown'})`);

    const response = await fetch(url);

    console.log(`[proxy] TMDB (search) response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const text = await response.text();
      console.error('[proxy] TMDB search error body:', text);
      return res.status(response.status).json({ error: 'Failed to fetch search results from TMDB' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rota de verificação simples
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🎬 TMDB Proxy Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from current directory`);
  console.log(`🔐 API Key stored securely on backend`);
});
