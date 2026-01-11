# Guia de Configuração do Proxy TMDB Seguro

## 📋 Visão Geral
Este projeto usa um servidor Node.js como proxy para proteger a chave da API TMDB, evitando exposição no código do cliente.

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 12+ instalado ([Download](https://nodejs.org))
- npm (incluído com Node.js)

### Passos

1. **Instale as dependências do backend**
   ```bash
   cd "Filmes"
   npm install express cors node-fetch
   ```

2. **Configure a chave TMDB (opcional)**
   - Abra `server.js`
   - Você pode definir a chave via variável de ambiente:
     ```bash
     set TMDB_API_KEY=sua_chave_aqui
     node server.js
     ```
   - Ou edite a linha no `server.js`:
     ```javascript
     const TMDB_API_KEY = process.env.TMDB_API_KEY || 'sua_chave_aqui';
     ```

3. **Inicie o servidor proxy**
   ```bash
   node server.js
   ```
   Você verá:
   ```
   🎬 TMDB Proxy Server running on http://localhost:3000
   ```

4. **Abra o navegador**
   - Vá para `http://localhost:3000`
   - Os filmes populares serão carregados de forma segura

## 🔒 Segurança

- ✅ Chave da API armazenada **apenas no servidor**
- ✅ Cliente (navegador) faz requisições ao `/api/popular-movies`
- ✅ Nenhuma chave exposta no HTML, CSS ou JS do cliente
- ✅ Suporta CORS para requisições do frontend

## 📁 Arquivos

- `server.js` → Servidor proxy Node.js
- `index.html` → Frontend (sem chave exposta)
- `adicionar.html` → Página de adicionar filmes
- `adicionar.js` → Lógica de formulário
- `styles.css` → Estilos

## 🧪 Teste a Conexão

```bash
curl http://localhost:3000/health
# Resposta esperada: {"status":"OK","message":"Proxy server is running"}
```

### Testar a busca de filmes
Você pode testar o endpoint de busca com `curl` ou pelo próprio frontend (campo de pesquisa na página):

```bash
curl "http://localhost:3000/api/search-movies?query=batman&language=pt-BR&page=1"
# Retorna JSON com o campo `results` contendo os filmes correspondentes
```

Dica: o endpoint aceita `query` ou `q` como parâmetro de consulta; se o campo estiver vazio, o frontend recarrega os filmes populares.

## 🐛 Solução de Problemas

| Problema | Solução |
|----------|---------|
| Porta 3000 já está em uso | Use: `node server.js --port 3001` |
| CORS error no navegador | Verifique que o servidor está rodando |
| Filmes populares não carregam | Verifique a chave da API TMDB |
| "Cannot find module 'express'" | Execute: `npm install express cors node-fetch` |

## 🌐 Deploy em Produção

Para usar em produção (ex: Vercel, Heroku):

1. Use variáveis de ambiente para a chave TMDB
2. Configure CORS corretamente com seu domínio
3. Exemplo no Vercel (`vercel.json`):
   ```json
   {
     "env": {
       "TMDB_API_KEY": "@tmdb_api_key"
     }
   }
   ```

## 📚 Referências
- [TMDB API Docs](https://developer.themoviedb.org/3)
- [Express.js Docs](https://expressjs.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
