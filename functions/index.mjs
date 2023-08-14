import bfast from "bfast";
//
export const helloWorld = bfast.functions().onHttpRequest('/hello', (request, response) => {
    // your logic
    response.send("Hello from Kilimoni!");
});