export function mockFetch(code: number, body?: unknown) {
    return jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.resolve(
            new Response(
                body === undefined ? null : (typeof body === "string" ? body : JSON.stringify(body)),
                {status: code}
            )
        ))
}
