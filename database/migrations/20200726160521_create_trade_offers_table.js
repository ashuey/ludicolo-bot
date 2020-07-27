exports.up = function(knex) {
    return knex.schema.createTable("trade_offers", function(t) {
        t.increments();
        t.string('user', 20).notNullable();
        t.string('pokemon', 32).notNullable();
        t.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("trade_offers");
};