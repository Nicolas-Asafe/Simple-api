# CRUD e Gerenciamento de Tags com Node.js

Este projeto é uma implementação simples de um sistema CRUD usando Node.js e Express, com gerenciamento de tags persistentes em um arquivo JSON. Ideal para quem quer entender como manipular dados de maneira fácil e escalável!

## 🚀 **Instalação**

Primeiro, clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

Instale as dependências:

```bash
npm install
```

## 🛠️ **Estrutura do Projeto**

```
├── simpleApi
│   └── tags.json          # Armazena as tags criadas
├── index.js              # Arquivo principal
└── package.json
```

## 🏁 **Iniciando o Servidor**

No arquivo principal, configure a inicialização do CRUD:

```javascript
import { CRUD } from './index.js';

const mycrud = new CRUD('Meu CRUD', 3000);
mycrud.Init();
```

Inicie o servidor:

```bash
node index.js
```

O servidor estará rodando em: [http://localhost:3000](http://localhost:3000)

## 🛠️ **Rotas CRUD**

### **Criar uma Rota GET**

```javascript
mycrud.res({
    router: '/Users',
    type_response: 'json',
    dataToResponse: 'Minha lista de usuários'
});
```

**Testar com:**
```bash
curl http://localhost:3000/Users
```

### **Criar uma Rota POST com Processamento**

```javascript
mycrud.req({
    router: '/Users',
    type_response: 'json',
    dataToResponse: 'Usuário criado',
    process: (body) => {
        return { mensagem: 'Usuário recebido', dados: body };
    }
});
```

**Testar com:**
```bash
curl -X POST http://localhost:3000/Users -H "Content-Type: application/json" -d '{"nome": "João"}'
```

## 🏷️ **Gerenciamento de Tags**

Você também pode criar, acessar, atualizar e excluir tags!

```javascript
import { Tags } from './index.js';
const [NewTag, accessTag, updateTag, deleteTag, listTags] = Tags();

NewTag('Users', []);                 // Cria uma nova tag
updateTag('Users', [{ id: 1, nome: 'Maria' }]); // Atualiza a tag
console.log(accessTag('Users'));     // Acessa a tag
```

## 🧠 **Listar Rotas Registradas**

```javascript
mycrud.ListRouters();
```

Isso vai exibir todas as rotas criadas no console! 🔥

## 📘 **Conclusão**

Agora você tem um CRUD funcional com persistência de tags! Dá para usar isso como base para APIs mais robustas. Se quiser mais recursos, só pedir! ✌️

---

Se curtiu, deixa uma estrela ⭐ no repositório e bora codar juntos! 🚀

---

_Criado com ❤️ por Nicolau_

