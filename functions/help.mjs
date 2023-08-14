export const helpRESTAPI = {
    method: 'GET',
    path: '/helps',
    onRequest: (request,response)=>{
        response.json({
            content: 'Kwa msaada zaidi wasiliana nasi kwa namba 0764943055. Kwa wasap https://me.wa/255764943055.'
        });
    }
}