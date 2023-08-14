import {withPostgresClient} from "./database.mjs";

const userTableStatement = `
CREATE TABLE IF NOT EXISTS public.users
(
    id bigserial NOT NULL,
    full_name character varying NOT NULL,
    mobile character varying NOT NULL,
    address character varying NOT NULL,
    age integer NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data jsonb NOT NULL DEFAULT '{}',
    PRIMARY KEY (id)
);`

const createATable = async client => await client.query(userTableStatement);

export const saveUser = ({full_name, mobile, address, age, raw}) => {
    return withPostgresClient(async client => {
        await createATable(client);
        const r = await client.query(`
            INSERT INTO 
                users(full_name,mobile,address,age,data)
                VALUES(
                    '${`${full_name}`?.replace(/'+/ig,"''")}',
                    '${mobile}',
                    '${address}',
                    '${age}',
                    '${JSON.stringify(raw)}'
                )
        `);
        return r?.rows[0];
    });
}

export const getUsers = (start_at = 0) => {
    return withPostgresClient(async client => {
        await createATable(client);
        const r = await client.query(`SELECT * FROM users WHERE id>${start_at} ORDER BY id asc LIMIT 1000`);
        return r?.rows ?? [];
    })
}
