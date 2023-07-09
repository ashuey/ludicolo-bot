export interface AtomFeed {
    feed: {
        entry: Entry[];
    };
}

export interface Entry {
    published: {
        $t: string;
    };
    title:     Content;
    content:   Content;
}

export interface Content {
    type: string;
    $t:   string;
}
