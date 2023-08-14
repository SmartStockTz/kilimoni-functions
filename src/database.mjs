import pg from 'pg'
const pool = new pg.Pool({connectionString: process?.env?.DATABASE_URI});

/***
 *
 * @param fn {Function}
 * @returns {Promise<*>}
 */
export const withPostgresClient = async fn => {
    const client = await pool.connect()
    try {
        return await fn(client);
    } catch (err) {
        throw err;
    } finally {
        await client.release();
    }
}

/***
 *
 * @param fn {Function}
 * @returns {Promise<*>}
 */
export const withPostgresTransactionClient = async fn => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');
        const re = await fn(client);
        await client.query('COMMIT');
        return re;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        await client.release();
    }
}