import {getUsers, saveUser} from "../src/users.mjs";

export const saveUserRESTAPI = {
    method: 'POST',
    path: '/users',
    onRequest: (request, response) => {
        const {results} = request?.body;
        saveUser({
            full_name: results?.jina_kamili?.value,
            age: results?.age?.value,
            address: results?.district_region?.value,
            mobile: results?.namba_ya_simu?.value,
            raw: request?.body
        })
            .then(value => response.json(value))
            .catch(_ => response.status(400).send(_));
    }
}

export const getAllUsersRESTAPI = {
    method: 'GET',
    path: '/users',
    onRequest: (request, response) => {
        const {start_at} = request?.query;
        getUsers(start_at ?? 0)
            .then(value => response.json(value))
            .catch(_ => response.status(400).send(_));
    }
}
