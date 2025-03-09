import { randomUUID } from 'crypto';
import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Classe CRUD
class CRUD {
    #NAME_CRUD;
    #PORT;
    #Routers;

    constructor(NAME_CRUD, PORT) {
        this.#NAME_CRUD = NAME_CRUD;
        this.#PORT = PORT; 
        this.#Routers = [];
    }

    Init() {
        app.listen(this.#PORT, () => {
            console.log(`${this.#NAME_CRUD} listening on port ${this.#PORT}`);
        });
    }

    res(options = { type_response: 'send', router: '', dataToResponse: 'My data' }) {
        const route = options.router || '/';
        app.get(route, (req, res) => {
            console.log(`RES: ${route} 202`);
            if (options.type_response === 'json') {
                res.json(options.dataToResponse);
            } else {
                res.send(options.dataToResponse);
            }
        });
        this.#Routers.push({ Name_Router: options.router, Method: 'GET', Type_Response: options.type_response, ID: randomUUID() });
    }

    req(options = { router: '', process: (body, params) => ({ body, params }) }) {
        const route = options.router || '/';
        app.post(route, (req, res) => {
            console.log(`REQ: ${route} 202`);
            const processedData = options.process(req.body, req.query);
            res.json(processedData);
        });
        this.#Routers.push({ Name_Router: route, Method: 'POST', ID: randomUUID() });
    }

    ListRouters() {
        console.log(this.#Routers);
    }
}

// Manipulação de tags
const FILE_PATH = './DTF/tags.json';
function loadTags() {
    try {
        if (fs.existsSync(FILE_PATH)) {
            return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8')) || [];
        }
    } catch (err) {
        console.error('Erro ao carregar o arquivo:', err);
    }
    return [];
}

function saveTags(tags) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(tags, null, 2));
    } catch (err) {
        console.error('Erro ao salvar o arquivo:', err);
    }
}

let tags = loadTags();

function Tags() {
    return {
        newTag: (tagname, state) => {
            if (!tags.find(t => t.tagname === tagname)) {
                tags.push({ id: tags.length + 1, tagname, state });
                saveTags(tags);
                console.log(`Tag "${tagname}" criada com sucesso!`);
            }
        },
        accessTag: (tagname = '') => {
            const tag = tags.find(t => t.tagname.toLowerCase() === tagname.toLowerCase());
            return tag ? tag.state : 'Tag não encontrada';
        },
        updateTag: (tagname, newState) => {
            const tag = tags.find(t => t.tagname === tagname);
            if (tag && typeof newState === 'object') {
                tag.state = newState;
                saveTags(tags);
                console.log(`Tag "${tagname}" atualizada com sucesso!`);
            }
        },
        deleteTag: (tagname) => {
            tags = tags.filter(t => t.tagname !== tagname);
            saveTags(tags);
            console.log(`Tag "${tagname}" excluída com sucesso!`);
        },
        listTags: () => tags
    };
}

// Criador de páginas estáticas
class WebCreatorStaticPages {
    #NameSite;
    #LANG;

    constructor(NameSite = '', LANG = '') {
        this.#NameSite = NameSite.replace(/\s/g, '');
        this.#LANG = LANG;
    }

    WebKitCreator() {
        return {
            Button: (value = 'my button', style) => `<button style=${style}>${value}</button>`,
            Text: (value = 'text', style) => `<p style=${style}>${value}</p>`,
            Div: (childrens = [], style) => `<div style=${style}>${childrens.join('')}</div>`,
            Input: (placeholder, style) => `<input style="${style}" placeholder=${placeholder}></input>`,
            Connect: (htmlfilename) => {
                try {
                    const data = fs.readFileSync(htmlfilename, 'utf-8');
                    if (!data) {
                        throw new Error(`O arquivo ${htmlfilename} está vazio ou não pode ser lido.`);
                    }
                    return data; 
                } catch (err) {
                    console.error('Erro ao ler conteúdo do arquivo:', err);
                    return ''; 
                }
            }
        };
    }

    build({ fileMain = 'index', content = [], port = 3000 }) {
        // Caminho onde os arquivos do site serão armazenados
        const sitePath = path.join(__dirname, this.#NameSite);
        
        // Verifica se a pasta existe antes de prosseguir
        if (!fs.existsSync(sitePath)) {
            console.error(`A pasta para o site não foi encontrada: ${sitePath}`);
            return;
        }

        // Caminho do arquivo index.html
        const indexPath = path.join(sitePath, 'index.html');

        // Geração do conteúdo do arquivo HTML
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="${this.#LANG}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.#NameSite}</title>
            </head>
            <body>
            ${content.join('')}
            <script src='./${fileMain}.js'></script>
            </body>
            </html>`;

        // Criação do arquivo index.html
        try {
            fs.writeFileSync(indexPath, htmlContent);
            console.log('Arquivo index.html gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar o arquivo index.html:', error);
        }

        // Inicia o servidor Express
        const app = express();

        // Serve a pasta onde o index.html foi gerado
        app.use(express.static(sitePath));  // Serve os arquivos da pasta correta

        // Rota para acessar o index.html gerado
        app.get('/', (req, res) => {
            res.sendFile(indexPath);  // Serve o arquivo index.html
        });

        // Inicia o servidor na porta especificada
        app.listen(port, () => {
            console.log(`${this.#NameSite} rodando em: http://localhost:${port}`);
        });
    }
}   
    // Exportação
const DTF = { Tags, CRUD, WebCreatorStaticPages };
export default DTF;
