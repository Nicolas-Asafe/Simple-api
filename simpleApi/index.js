    import { randomUUID } from 'crypto';
    import express from 'express';
    const app = express();
    app.use(express.json());
    export class CRUD {
        constructor(NAME_CRUD, PORT) {
            this._NAME_CRUD = NAME_CRUD;
            this._PORT = PORT;
            this._Routers = [];
        }

        Init() {
            app.listen(this._PORT, () => {
                console.log(`${this._NAME_CRUD} listening on port ${this._PORT}`);
            });
        }

        res(options = { type_response: 'send', router: '', dataToResponse: 'My data'}) {
            try {
                app.get(`${options.router?options.router:'/'}`,(req, res) => {
                    console.log(`RES: ${options.router?options.router:'index'} 202`)
                    
                    options.type_response === 'send' ? res.send(options.dataToResponse) :
                        options.type_response === 'json' ? res.json(options.dataToResponse) : res.send('Dados não conferem');
                });
                this._Routers.push({ Name_Router: options.name_router, Method: 'GET',Type_Response: options.type_response, ID: randomUUID() });
            } catch (err) {
                console.log(err);
            }
        }
        req(options = { 
            type_response: 'send', 
            router: '', 
            dataToResponse: 'Mydata', 
            process: (body, params) => { 
                return { body, params }; 
            } 
        }) {
            try {
                app.use(express.json()); // Para interpretar JSON no body da requisição
        
                app.post(`${options.router ? options.router : '/'}`, (req, res) => {
                    console.log(`REQ: ${options.router ? options.router : 'index'} 202`);
                    const body = req.body;
                    const params = req.query; // Pega parâmetros da URL (?nome=Nicolau)
        
                    // Processar o body com a função fornecida
                    const processedData = options.process(body, params);
        
                    // Enviar a resposta com base no tipo definido
                    if (options.type_response === 'send') {
                        res.send(options.dataToResponse);
                    } else if (options.type_response === 'json') {
                        res.json(options.dataToResponse);
                    } else {
                        res.status(400).send('Tipo de resposta inválido');
                    }
                });
        
                this._Routers.push({ Name_Router: options.router, Method: 'POST', ID: randomUUID() });
            } catch (err) {
                console.log(err);
            }
        }
        
        

        ListRouters() {
            console.log(this._Routers);
        }

        RouterAccess(Name_Router){
            const Route = this._Routers.filter(r=>r.Name_Router===Name_Router)
            Route.forEach(d=>{})
        }
    }

    import fs from 'fs';

    const FILE_PATH = './simpleApi/tags.json';

    // Função para carregar as tags do arquivo
    function loadTags() {
        try {
            const data = fs.readFileSync(FILE_PATH, 'utf8');
            const parsedData = JSON.parse(data);
            // Verifica se o formato carregado é válido
            if (Array.isArray(parsedData)) {
                return parsedData;
            } else {
                console.error('Erro: Dados inválidos no arquivo tags.json');
                return [];
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Se o arquivo não existir, retorna um array vazio
                return [];
            }
            console.error('Erro ao carregar o arquivo:', err);
            return [];
        }
    }

    // Função para salvar as tags no arquivo
    function saveTags(tags) {
        try {
            fs.writeFileSync(FILE_PATH, JSON.stringify(tags, null, 2));
        } catch (err) {
            console.error('Erro ao salvar o arquivo:', err);
        }
    }

    // Inicializa as tags com os dados salvos (ou vazio se o arquivo não existir)
    let tags = loadTags();

    export function Tags() {
        // Função para criar uma nova tag
        const NewTag = (tagname, state) => {
            // Verifica se a tag já existe
            const existingTag = tags.find(t => t.tagname === tagname);
            if (existingTag) {
                console.log(`Tag "${tagname}" já existe!`);
                return;
            }
            // Se não existir, cria a tag
            tags.push({ id: tags.length + 1, tagname, state });
            saveTags(tags); // Salva as tags sempre que cria uma nova
            console.log(`Tag "${tagname}" criada com sucesso!`);
        };

        // Função para acessar o estado de uma tag
        const accessTag = (tagname) => {
            const tag = tags.find(t => t.tagname === tagname);
            return tag ? tag.state : 'Tag não encontrada';
        };

        // Função para atualizar o estado de uma tag existente
        const updateTag = (tagname, newState) => {
            const tag = tags.find(t => t.tagname === tagname);
            if (tag) {
                // Validar o formato do estado antes de atualizar
                if (typeof newState !== 'object') {
                    console.log('Erro: O estado deve ser um objeto.');
                    return;
                }
                tag.state = newState; // Atualiza o estado da tag
                saveTags(tags); // Salva as tags após a atualização
                console.log(`Tag "${tagname}" atualizada com sucesso!`);
            } else {
                console.log(`Tag "${tagname}" não encontrada.`);
            }
        };

        // Função para excluir uma tag
        const deleteTag = (tagname) => {
            const tagIndex = tags.findIndex(t => t.tagname === tagname);
            if (tagIndex !== -1) {
                tags.splice(tagIndex, 1); // Remove a tag do array
                saveTags(tags); // Salva as tags após a exclusão
                console.log(`Tag "${tagname}" excluída com sucesso!`);
            } else {
                console.log(`Tag "${tagname}" não encontrada.`);
            }
        };

        // Função para listar todas as tags
        const listTags = () => {
            return tags.length > 0 ? tags : 'Não há tags disponíveis.';
        };

        return [NewTag, accessTag, updateTag, deleteTag, listTags];
    }
