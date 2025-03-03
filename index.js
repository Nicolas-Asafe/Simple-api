import { CRUD, Tags } from './simpleApi/index.js';

const mycrud = new CRUD('Meu crud', 3000);
const [NewTag, accesstag, updateTag] = Tags();




NewTag('Users', [{ Name: 'Nicolas' }]);


mycrud.res({
    router: '/Users',
    type_response: 'json',
    dataToResponse: accesstag('Users'),
});


mycrud.req({
    router: '/Users',
    type_response: 'json',
    dataToResponse: accesstag('Users'),
    process: (body) => {
        
        const currentData = accesstag('Users');
        const newData = Array.isArray(body) ? body : [body];

        
        updateTag('Users', [...currentData, ...newData]);

        
        return accesstag('Users');
    },
});


mycrud.Init();
