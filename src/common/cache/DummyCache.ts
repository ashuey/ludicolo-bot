import {Cache} from "@/common/cache/Cache";
import {BaseCache} from "@/common/cache/BaseCache";

export class DummyCache extends BaseCache implements Cache {
    get(): undefined {
        return undefined;
    }

    set(): void {}

    delete(): void {}

    clear(): void {}

    has(): boolean {
        return false;
    }
}
