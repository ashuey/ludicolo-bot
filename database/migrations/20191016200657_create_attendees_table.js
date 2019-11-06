exports.up = function(knex) {
    
    return knex.schema.createTable("attendees", function(t) {
        t.increments();
        t.integer('event_id').unsigned().notNullable().references('id').inTable('community_events');
        t.string('user', 20).notNullable();
        t.integer('party_size').notNullable().defaultTo(1);
        t.timestamps();

        t.unique(['event_id', 'user'])
    });
    
};

exports.down = function(knex) {
    return knex.schema.dropTable("attendees");
};