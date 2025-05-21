import swaggerJsdoc from "swagger-jsdoc";

export const clickhouseConfig = {
    host: 'http://clickhouse:8123',
    username: 'default',
    password: '',
    isUseGzip: false,
    format: 'json'
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