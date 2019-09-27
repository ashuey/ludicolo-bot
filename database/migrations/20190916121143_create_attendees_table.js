exports.up = function(knex) {
    return knex.schema.createTable("attendees", function(t) {
        t.increments();
        t.integer('community_event_id').unsigned();
        t.string('user', 20);
        t.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("attendees");
};