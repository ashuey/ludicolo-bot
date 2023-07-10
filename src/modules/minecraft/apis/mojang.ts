import axios from "axios";
import { Result } from "@/common/Result";

export class Mojang {
    static readonly ENDPOINT = "https://api.mojang.com/users/profiles/minecraft";

    protected readonly http;

    constructor() {
        this.http = axios.create({
            timeout: 2000,
            validateStatus: () => true,
        });
    }

    public async validateUsername(username: string): Promise<Result<boolean>> {
        const result = await this.http.get<unknown>(`${Mojang.ENDPOINT}/${username}`);

        if (result.status === 200) {
            return [true, true];
        }

        if (result.status === 404) {
            return [true, false];
        }

        return [false, new Error(`HTTP Error ${result.status}`)];
    }
}

export const mojang = new Mojang();
