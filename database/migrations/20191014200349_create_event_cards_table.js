exports.up = function(knex) {
    return knex.schema.createTable("event_cards", function(t) {
        t.increments();
        t.integer('event_id').unsigned().notNullable().references('id').inTable('community_events');
        t.string('channel', 20).notNullable();
        t.string('message', 20).notNullable();
        t.integer('type').notNullable().defaultTo(0);
        t.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("event_cards");
};