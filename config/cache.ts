import {env} from "../framework/Support/helpers";

export default {
    'default': env('CACHE_DRIVER', 'redis'),

    'stores': {
        'redis': {
            'driver': 'redis',
            'connection': 'cache'
        }
    }
}