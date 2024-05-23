import AsyncLock from "async-lock";

export class LockManager {
    protected locks = new Map<string, AsyncLock>();

    for(resource: string): AsyncLock {
        const existing = this.locks.get(resource);

        if (existing) {
            return existing;
        }

        const newLock = new AsyncLock();

        this.locks.set(resource, newLock);

        return newLock;
    }
}
