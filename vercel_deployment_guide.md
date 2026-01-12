# Guia de Implantação na Vercel

Eu configurei o projeto para implantação na Vercel. Aqui está o que eu fiz e quais são os seus próximos passos.

## 1. Arquivo de Configuração `vercel.json`

Eu adicionei um arquivo `vercel.json` ao seu projeto. Este arquivo diz à Vercel como construir e implantar sua aplicação:

-   Ele configura o `server.js` para ser executado como uma função serverless.
-   Ele roteia todas as solicitações para `/api/...` para o seu servidor proxy.
-   Ele serve os arquivos estáticos (HTML, CSS, etc.) do seu projeto.

## 2. Próximos Passos para a Implantação

Agora você precisa seguir estes passos para colocar sua aplicação online:

### Passo 1: Envie seu Código para o GitHub

Se o seu projeto ainda não está em um repositório GitHub, crie um e envie seu código para ele.

### Passo 2: Crie um Projeto na Vercel

1.  **Crie uma conta na Vercel:** Se você não tiver uma, crie uma conta gratuita em [vercel.com](https://vercel.com/signup).
2.  **Importe seu projeto:** No seu painel da Vercel, clique em "Add New..." -> "Project".
3.  **Conecte seu repositório GitHub:** A Vercel pedirá para se conectar à sua conta do GitHub. Autorize e selecione o repositório do seu projeto.

### Passo 3: Configure a Chave da API

Esta é a parte mais importante para que sua aplicação funcione.

1.  **Encontre as Configurações de Variáveis de Ambiente:** Nas configurações do seu projeto na Vercel, vá para a aba "Settings" e depois para a seção "Environment Variables".
2.  **Adicione a `TMDB_API_KEY`:**
    -   **Name:** `TMDB_API_KEY`
    -   **Value:** Cole a sua chave da API do TMDB aqui.

### Passo 4: Implante

Após configurar a variável de ambiente, volte para a aba "Deployments" do seu projeto e acione um novo "Redeploy". A Vercel irá construir e implantar sua aplicação.

Ao final do processo, você receberá uma URL (como `seu-projeto.vercel.app`) onde sua aplicação estará online e funcionando!
