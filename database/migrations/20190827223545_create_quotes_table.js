exports.up = function(knex) {
    return knex.schema.createTable("quotes", function(t) {
        t.increments();
        t.string('guild', 20);
        t.string('creator', 20);
        t.string('name', 50);
        t.text('text');
        t.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("quotes");
};