export function fmtError(msg: string): string {
    return `❌ ${msg}`;
}

export function fmtWarning(msg: string): string {
    return `⚠️ ${msg}`;
}

export function fmtSuccess(msg: string): string {
    return `✅ ${msg}`;
}

export function fmtAi(msg: string): string {
    return `🤖 __**This content is AI-Generated**__ 🤖\n\n${msg}`;
}

export function truncate(msg: string): string {
    return msg.length > 2000 ? msg.substring(0, 2000) : msg;
}
