import {env} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default {
    'default': env('CACHE_DRIVER', 'redis'),

    'stores': {
        'redis': {
            'driver': 'redis',
            'connection': 'cache'
        }
    }
}