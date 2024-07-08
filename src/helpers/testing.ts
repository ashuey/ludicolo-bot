import PocketBase from "pocketbase/cjs";

export interface PocketBaseMockParams {
    getListItems?: unknown[];
}

export function mockFetch(code: number, body?: unknown) {
    return jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.resolve(
            new Response(
                body === undefined ? null : (typeof body === "string" ? body : JSON.stringify(body)),
                {status: code}
            )
        ))
}

export function mockPocketBase(pb: PocketBase, params: PocketBaseMockParams = {}) {
    const getListMock = jest.fn((page?: number, perPage?: number) => Promise.resolve({
        page,
        perPage,
        totalItems: -1,
        totalPages: -1,
        items: params.getListItems ?? [],
    }));
    const getFullListMock = jest.fn(() =>
        Promise.resolve(params.getListItems ?? []));
    const createMock = jest.fn(() => Promise.resolve());
    const updateMock = jest.fn(() => Promise.resolve());

    jest.spyOn(pb, 'collection').mockImplementation(() => ({
        getList: getListMock,
        getFullList: getFullListMock,
        create: createMock,
        update: updateMock,
    }) as never);

    return {
        getListMock,
        getFullListMock,
        createMock,
        updateMock,
    };
}
