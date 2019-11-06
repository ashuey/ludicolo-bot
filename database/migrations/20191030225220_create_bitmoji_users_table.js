exports.up = function(knex) {
    return knex.schema.createTable("bitmoji_users", function(t) {
        t.string('user', 20).primary().notNullable();
        t.text('access_token').notNullable();
        t.text('refresh_token').notNullable();
        t.string('display_name', 255);
        t.string('snapchat_id', 255);
        t.string('bitmoji_id', 255);
        t.text('bitmoji_avatar');
        t.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("bitmoji_users");
};