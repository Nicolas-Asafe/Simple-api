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
                app.use(express.json());
        
                app.post(`${options.router ? options.router : '/'}`, (req, res) => {
                    console.log(`REQ: ${options.router ? options.router : 'index'} 202`);
                    const body = req.body;
                    const params = req.query; 
        

                    const processedData = options.process(body, params);
        

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


    function loadTags() {
        try {
            const data = fs.readFileSync(FILE_PATH, 'utf8');
            const parsedData = JSON.parse(data);

            if (Array.isArray(parsedData)) {
                return parsedData;
            } else {
                console.error('Erro: Dados inválidos no arquivo tags.json');
                return [];
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
   
                return [];
            }
            console.error('Erro ao carregar o arquivo:', err);
            return [];
        }
    }

    function saveTags(tags) {
        try {
            fs.writeFileSync(FILE_PATH, JSON.stringify(tags, null, 2));
        } catch (err) {
            console.error('Erro ao salvar o arquivo:', err);
        }
    }


    let tags = loadTags();

    export function Tags() {

        const NewTag = (tagname, state) => {

            const existingTag = tags.find(t => t.tagname === tagname);
            if (existingTag) {
                console.log(`Tag "${tagname}" já existe!`);
                return;
            }

            tags.push({ id: tags.length + 1, tagname, state });
            saveTags(tags);
            console.log(`Tag "${tagname}" criada com sucesso!`);
        };

        const accessTag = (tagname) => {
            const tag = tags.find(t => t.tagname === tagname);
            return tag ? tag.state : 'Tag não encontrada';
        };


        const updateTag = (tagname, newState) => {
            const tag = tags.find(t => t.tagname === tagname);
            if (tag) {
         
                if (typeof newState !== 'object') {
                    console.log('Erro: O estado deve ser um objeto.');
                    return;
                }
                tag.state = newState; 
                saveTags(tags); 
                console.log(`Tag "${tagname}" atualizada com sucesso!`);
            } else {
                console.log(`Tag "${tagname}" não encontrada.`);
            }
        };


        const deleteTag = (tagname) => {
            const tagIndex = tags.findIndex(t => t.tagname === tagname);
            if (tagIndex !== -1) {
                tags.splice(tagIndex, 1);
                saveTags(tags); 
                console.log(`Tag "${tagname}" excluída com sucesso!`);
            } else {
                console.log(`Tag "${tagname}" não encontrada.`);
            }
        };


        const listTags = () => {
            return tags.length > 0 ? tags : 'Não há tags disponíveis.';
        };

        return [NewTag, accessTag, updateTag, deleteTag, listTags];
    }
