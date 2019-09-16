exports.up = function(knex) {
    return knex.schema.createTable("settings", function(t) {
        t.increments();
        t.string('guild').index();
        t.string('key').index();
        t.text('value');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("settings");
};