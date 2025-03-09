import DTF from './DTF/index.js';

const Tags = DTF.Tags(); // Manipulação de tags
const WebCreator = new DTF.WebCreatorStaticPages('Meu site','pt-br'); // Criação de páginas estáticas
const Kit = WebCreator.WebKitCreator()  


WebCreator.build({
  fileMain: 'index', 
  content: [
    Kit.Div([
    ]),
    Kit.Connect('./handler.html')
  ]
});

