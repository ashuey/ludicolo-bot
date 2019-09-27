exports.up = function (knex) {
    return knex.schema.createTable("community_events", function (t) {
        t.increments();
        t.string('name');
        t.string('channel', 20);
        t.string('card', 20);
        t.string('detail_card', 20);
        t.timestamps();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("community_events");
};