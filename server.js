// servidor simples node.js para atuar como um proxy seguro para a API TMDB
// Objetivo: evitar expor a chave API TMDB no frontend
// Instalar dependências: npm install express cors node-fetch
// Iniciar servidor: node server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const serverless = require('serverless-http'); // Importar serverless-http

const app = express();
const PORT = process.env.PORT || 3000;

// Loja segura da chave API TMDB no backend
const TMDB_API_KEY = process.env.TMDB_API_KEY; // Remover fallback hardcoded para produção

if (!TMDB_API_KEY) {
  console.error('FATAL ERROR: TMDB_API_KEY environment variable is not set.');
  // Em ambiente serverless, não é possível fazer exit, então logamos e deixamos a requisição falhar.
  // Em desenvolvimento local, podemos sair.
  if (!process.env.IS_SERVERLESS) {
    process.exit(1);
  }
}

// Configurar CORS: em produção, limitar origens; em desenvolvimento permitir todas para facilitar testes
// Para serverless, o CORS pode ser configurado no API Gateway ou aqui, mas é bom ter uma camada de segurança.
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://seu-dominio.com'] : '*', // Ajustar para seus domínios
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// Servir arquivos estáticos apenas no ambiente de desenvolvimento local, não no Lambda.
// No Lambda, o frontend será servido separadamente (ex: S3 + CloudFront ou Vercel/Netlify).
if (!process.env.IS_SERVERLESS) {
  app.use(express.static('./'));
}

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

// Para desenvolvimento local, inicie o servidor express
if (!process.env.IS_SERVERLESS) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Para deploy serverless, exporte a aplicação como um handler
module.exports.handler = serverless(app);

app.listen(PORT, () => {
  console.log(`🎬 TMDB Proxy Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from current directory`);
  console.log(`🔐 API Key stored securely on backend`);
});
