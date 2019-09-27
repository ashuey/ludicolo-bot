import { env } from "../framework/Support/helpers";

export default {
    'default': env('DB_CONNECTION', 'mysql'),

    'connections': {
        'mysql': {
            'driver': 'mysql',
            'host': env('DB_HOST', '127.0.0.1'),
            'port': env('DB_PORT', '3306'),
            'user': env('DB_USERNAME', 'bot'),
            'password': env('DB_PASSWORD', ''),
            'database': env('DB_DATABASE', 'bot')
        }
    },

    'migrations': 'migrations',

    'redis': {
        'default': {
            'url': env('REDIS_URL'),
            'host': env('REDIS_HOST', '127.0.0.1'),
            'password': env('REDIS_PASSWORD', null),
            'post': env('REDIS_PORT', 6379),
            'database': env('REDIS_DB', 0)
        },

        'ceche': {
            'url': env('REDIS_URL'),
            'host': env('REDIS_HOST', '127.0.0.1'),
            'password': env('REDIS_PASSWORD', null),
            'post': env('REDIS_PORT', 6379),
            'database': env('REDIS_CACHE_DB', 1)
        }
    }
}