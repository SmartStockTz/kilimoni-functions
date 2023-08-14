import {getPosts, savePost} from "../src/posts.mjs";

export const savePostRESTAPI = {
    method: 'POST',
    path: '/posts',
    onRequest: (request, response) => {
        const {results} = request?.body;
        savePost({
            name: results?.sale_crop_name?.value,
            unit: results?.crop_unit?.value,
            quantity: results?.crop_quantity?.value,
            price: results?.crop_price?.value,
            contact: results?.crop_contact?.value,
            data: request?.body ?? {}
        })
            .then(value => {
                response.json(value);
            })
            .catch(_ => response.status(400).send(_));
    }
}


const postSessions = {
    'abc': {
        more: 1245
    }
}

export const getPostsInTextRESTAPI = {
    method: 'GET',
    path: '/posts.txt',
    onRequest: (request, response) => {
        const {answer, uuid, more} = request?.query;
        const session = postSessions[uuid];
        const isNext = `${answer}` === '99';
        if (!isNext && answer && postSessions[uuid]) {
            response.json({
                content: postSessions[uuid][answer]?.contact??'-2'
            });
            return;
        }
        getPosts(isNext ? session?.more ?? 0 : 0, 10)
            .then(value => {
                if (Array.isArray(value) && value.length === 0) {
                    response.json({
                        content: '-1'
                    });
                } else {
                    const _value = [...value ?? []];
                    const last = _value.pop();
                    postSessions[uuid] = {
                        ...value?.reduce((a, b, index) => {
                            return {
                                ...a,
                                [index + 1]: b
                            }
                        }, {}),
                        more: last?.id,
                    };
                    response.json({
                        content: value?.map(
                            (x, index) =>
                                `${index + 1}). ${x?.name}, ${x?.unit} ${x?.quantity}  TZS ${x?.price} kwa ${x?.unit} 1.`
                        )?.join('\n')?.concat('\nKuona zaidi tuma 99.\nKupata namba ya muuzaji tuma namba ya tangazo.')
                    })
                }
            })
            .catch(_ => {
                response.status(400).send(_);
                console.log(_);
            });
    }
}

export const getPostsInJsonRESTAPI = {
    method: 'GET',
    path: '/posts.json',
    onRequest: (request, response) => {
        const {start_at, size} = request?.query;
        getPosts(start_at ?? 0, size ?? 10)
            .then(value => response.json(value))
            .catch(_ => response.status(400).send(_));
    }
}