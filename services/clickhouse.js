import { createClient } from '@clickhouse/client';

const clickhouse = createClient({
    host: 'http://localhost:8123',
    username: 'default',
    password: '',
});

// ✅ Вставка данных
export async function insertTransfers(data) {
    const values = data
        .map(d => `('${d.name}', '${d.date}', ${d.amount})`)
        .join(', ');

    const query = `INSERT INTO transfers (name, date, amount) VALUES ${values}`;

    await clickhouse.command({ query }).exec();
}

// ✅ Выборка по диапазону с опциональной агрегацией
export async function queryTransfers({ name, from, to, summary = false }) {
    const query = `
    SELECT ${summary ? 'count(*) AS count, sum(amount) AS total' : '*'}
    FROM transfers
    WHERE name = {name:String}
      AND date BETWEEN {from:Date} AND {to:Date}
  `;

    const resultSet = await clickhouse.query({
        query,
        format: 'JSON',
        query_params: { name, from, to },
    });

    const result = await resultSet.json();
    return result.data;
}

// ✅ Выборка за последний год
export async function getTransfersForUser(name) {
    const query = `
    SELECT date, amount
    FROM transfers
    WHERE name = {name:String}
      AND date >= today() - INTERVAL 1 YEAR
    ORDER BY date
  `;

    const resultSet = await clickhouse.query({
        query,
        format: 'JSON',
        query_params: { name },
    });

    const result = await resultSet.json();
    return result.data;
}

// ✅ Получение IP-доступа по ключу
export async function getApiKeyAccess(key) {
    const query = `
    SELECT allowed_ips
    FROM api_keys
    WHERE key = {key:String}
    LIMIT 1
  `;

    const resultSet = await clickhouse.query({
        query,
        format: 'JSON',
        query_params: { key },
    });

    const result = await resultSet.json();
    if (!result.data.length) return null;

    return result.data[0].allowed_ips;
}
