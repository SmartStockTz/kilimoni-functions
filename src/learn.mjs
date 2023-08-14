import {withPostgresClient} from "./database.mjs";

const learningTableStatement = `
CREATE TABLE IF NOT EXISTS public.articles
(
    id bigserial,
    sku character varying NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title character varying NOT NULL,
    content text NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (sku)
);
`

const createATable = async client => await client.query(learningTableStatement);

export const getArticleBySKU = category_sku => {
    return withPostgresClient(async client => {
        await createATable(client);
        const r = await client.query(`SELECT * FROM articles WHERE sku='${category_sku}'`);
        const nr = r?.rows[0];
        if (nr) {
            return nr;
        }
        throw {message: 'No article for that sku'}
    });
}
