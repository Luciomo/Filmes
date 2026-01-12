# Projeto Filmes Favoritos

`Projeto Filmes Favoritos` é uma aplicação web interativa que permite aos usuários descobrir filmes populares, pesquisar por títulos específicos e manter uma lista pessoal de filmes favoritos. A aplicação foi desenvolvida com foco em segurança e boas práticas, utilizando um servidor proxy em Node.js para proteger a chave da API do The Movie Database (TMDB).

## ✨ Funcionalidades

- **Visualização de Filmes Populares:** Exibe os filmes mais populares do momento ao carregar a página.
- **Busca de Filmes:** Campo de busca para encontrar filmes por palavra-chave.
- **Sistema de Favoritos:** Adicione ou remova filmes da sua lista de favoritos, que fica salva no seu navegador (`localStorage`).
- **Adição Manual:** Uma página dedicada para adicionar filmes à sua lista que não estão no TMDB.
- **Detalhes do Filme:** Clique em um card para abrir um modal com mais informações, como sinopse e data de lançamento.
- **Tema Claro e Escuro:** Suporte completo para tema claro e escuro, com detecção automática da preferência do sistema e um botão para alternância manual.
- **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.
- **Experiência de Usuário Aprimorada:** Animações sutis nos cards e feedback visual em botões para uma navegação mais fluida e agradável.
- **Acessibilidade (a11y):** Implementação de práticas de acessibilidade, como atributos ARIA, navegação por teclado e gerenciamento de foco.

## 🚀 Tecnologias Utilizadas

A aplicação é dividida em duas partes principais: o frontend, que é renderizado no navegador, e um backend leve que atua como um proxy seguro.

### Frontend

- **HTML5:** Estrutura semântica e acessível.
- **CSS3:** Estilização moderna com:
  - **Flexbox** para layouts flexíveis.
  - **Variáveis CSS (Design Tokens)** para um sistema de temas e fácil manutenção.
  - **Animações (`@keyframes`)** para uma interface mais dinâmica.
- **JavaScript (ES6+):**
  - Manipulação dinâmica do DOM para renderizar os filmes e atualizar a interface.
  - Consumo de APIs com `fetch`.
  - Gerenciamento de estado local com `localStorage` para o sistema de favoritos e preferência de tema.

### Backend (Proxy Seguro)

- **Node.js:** Ambiente de execução para o servidor.
- **Express.js:** Framework para criar o servidor proxy e as rotas da API (`/api/popular-movies`, `/api/search-movies`).
- **CORS:** Habilita o compartilhamento de recursos entre o frontend e o backend de forma segura.
- **node-fetch:** Para realizar as chamadas do servidor para a API externa do TMDB, mantendo a chave da API segura.

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para executar a aplicação localmente.

### 1. Pré-requisitos

- **Node.js:** Versão 12 ou superior.

### 2. Instalação

```bash
# Clone o repositório (ou navegue até a pasta do projeto)
https://github.com/Luciomo/Filmes.git
# Instale as dependências do Node.js
npm install
```

### 3. Configuração da Chave da API

Por padrão, o projeto utiliza uma chave de API de exemplo (`'sua_chave_aqui'`) que permite iniciar o servidor. No entanto, para que a busca de filmes e a exibição dos filmes populares funcionem, é **essencial** que você configure sua própria chave da API do TMDB.

Você pode obter uma chave de API gratuita no [site do TMDB](https://www.themoviedb.org/signup).

Após obter sua chave, você pode configurá-la de duas maneiras:

**Método 1: Variável de Ambiente (Recomendado)**

Crie um arquivo `.env` na raiz do projeto e adicione a seguinte linha:

```
TMDB_API_KEY=sua_chave_aqui
```

O servidor irá carregar a variável automaticamente.

**Método 2: Edição do Código-fonte**

Você pode editar diretamente o arquivo `server.js` e substituir `'sua_chave_aqui'` pela sua chave:

```javascript
// Em server.js
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'sua_chave_aqui';
```

### 4. Execução

```bash
# Inicie o servidor proxy
npm start
```

O servidor estará rodando em `http://localhost:3000`. Abra este endereço no seu navegador para usar a aplicação.

## 📄 Licença

Este projeto está sob a licença MIT.
