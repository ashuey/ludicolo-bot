exports.up = function(knex) {
    return knex.schema.createTable("screening_reminders", function(t) {
        t.increments();
        t.string('user', 20);
        t.datetime('completed_at').nullable()
        t.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("screening_reminders");
};