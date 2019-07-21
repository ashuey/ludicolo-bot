import { env } from "../framework/Support/helpers";

export default {
    'default': env('DB_CONNECTION', 'mysql'),
    connections: {
        mysql: {
            driver: 'mysql',
            host: env('DB_HOST', '127.0.0.1'),
            port: env('DB_PORT', '3306'),
            user: env('DB_USERNAME', 'bot'),
            password: env('DB_PASSWORD', ''),
            database: env('DB_DATABASE', 'bot')
        }
    }
}