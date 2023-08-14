import {withPostgresClient} from "./database.mjs";

const postTableStatement = `
CREATE TABLE IF NOT EXISTS public.posts
(
    id bigserial NOT NULL,
    name character varying NOT NULL,
    unit character varying NOT NULL,
    quantity double precision NOT NULL,
    price double precision NOT NULL,
    contact character varying NOT NULL,
    data jsonb NOT NULL DEFAULT '{}',
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
`

const createATable = async client => await client.query(postTableStatement);

export const savePost = ({name, unit, quantity, price, contact, data = {}}) => {
    return withPostgresClient(async client => {
        await createATable(client);
        const r = await client.query(`
            INSERT INTO posts(name,unit,quantity,price,contact,data)
            VALUES(
                '${`${name}`.replace(/'+/ig,"''")}',
                '${unit}',
                '${quantity}',
                '${price}',
                '${contact}',
                '${JSON.stringify(data)}'
            );
        `);
        return r?.rows[0];
    });
}

export const getPosts = (start_at = 0, size=10) => {
    return withPostgresClient(async client => {
        await createATable(client);
        const r = await client.query(`
            SELECT id,name,unit,quantity,price,contact,created_at,updated_at FROM posts WHERE id>${start_at} ORDER BY id asc LIMIT ${size};
        `);
        return r?.rows ?? [];
    });
}
