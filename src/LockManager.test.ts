import AsyncLock from "async-lock";
import {LockManager} from "@/LockManager";

describe('LockManager', () => {
    it('returns an instance of AsyncLock', () => {
        const mgr = new LockManager();

        expect(mgr.for('resource')).toBeInstanceOf(AsyncLock);
    });

    it('returns the same instance when called twice', () => {
        const mgr = new LockManager();

        const lock1 = mgr.for('carrot');
        const lock2 = mgr.for('carrot');

        expect(lock1).toBe(lock2);
    });
})
