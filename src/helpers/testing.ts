export function mockFetch(code: number, body?: unknown) {
    return jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.resolve(
            new Response(
                body === undefined ? null : JSON.stringify(body),
                {status: code}
            )
        ))
}
