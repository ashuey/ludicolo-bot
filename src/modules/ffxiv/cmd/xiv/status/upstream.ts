import {StatusInformation} from "@/modules/ffxiv/cmd/xiv/status/StatusInformation";

export async function getStatusData(): Promise<StatusInformation> {
    const result = await fetch("https://is.xivup.com/v2indexdata");

    if (!result.ok) {
        throw new Error(result.statusText);
    }

    return result.json();
}
