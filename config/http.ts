import {env} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default {
    'url': env('HTTP_URL', 'http://localhost'),
    'port': 27166
}