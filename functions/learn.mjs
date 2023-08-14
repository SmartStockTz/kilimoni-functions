import {getArticleBySKU} from "../src/learn.mjs";

export const LearnRESTAPI = {
    method: 'GET',
    path: '/articles/:category_id',
    onRequest: (request, response) => {
        const {category_id} = request?.params;
        const category_sku = category_id === '1' ? 'kilimo' : 'kufuga_kuku';
        getArticleBySKU(category_sku).then(value => {
            response.json(value);
        }).catch(_ => response.json({content: 'Imeshindwa kupata masomo kwa sasa jaribu baadae.'}));
    }
}