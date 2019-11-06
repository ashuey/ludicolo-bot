exports.up = function (knex) {
    return knex.schema.createTable("community_events", function (t) {
        t.increments();
        t.string('name');
        t.string('guild', 20).notNullable();
        t.string('channel', 20);
        t.timestamps();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("community_events");
};