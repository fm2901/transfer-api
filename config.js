import swaggerJsdoc from "swagger-jsdoc";

export const clickhouseConfig = {
    host: 'http://127.0.0.1:8123',
    username: 'default',
    password: '',
    isUseGzip: false,
    format: 'json',
    config: {
        session_timeout: 60,
        output_format_json_quote_64bit_integers: 0,
        enable_http_compression: 0,
    },
};

export const API_KEYS = {
    'key1': ['192.168.1.10'],
    'key2': ['10.0.0.0/8'],           // поддержка диапазонов
    'adminKey': ['0.0.0.0/0', '1'],        // любой IP (не рекомендуется)
};

export const CRON_TIME = '0 3 * * *';

export const externalDB = {
    host: 'remote-host',
    user: 'user',
    password: 'password',
    database: 'remote_db',
};

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Transfer API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
    },
    apis: ['./routes/*.js'],
});