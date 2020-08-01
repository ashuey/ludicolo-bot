import CommunityEvent from "../CommunityEvent";
import {Message, Snowflake, TextChannel, User, MessageReaction} from "discord.js";
import EventCard from "../EventCard";
import Attendee from "../Attendee";
import CardType from "./CardType";

const card_react_filter = (reaction: MessageReaction, user: User) => user.bot !== true && (reaction.emoji.name === '✅' || reaction.emoji.name === '❌');

export default class CommunityEventsManager {
    protected hasBeenBootstrapped: boolean = false;

    public beginTracking(message: Message, event: CommunityEvent) {
        const collector = message.createReactionCollector(card_react_filter);
        collector.on('collect', async (reaction, user) => {
            await reaction.remove();
            await this.rsvp(event, user);
        })
    }

    public async rsvp(event: CommunityEvent, user: User, party: number = 1) {
        const attendee = await Attendee.query().findOne({
            event_id: event.id,
            user: user.id
        });

        if (attendee) {
            await attendee.$query().patch({
                party_size: party
            });
        } else {
            await Attendee.query().insert({
                event_id: event.id,
                user: user.id,
                party_size: party
            });
        }

        const event_channel = await event.$getChannel();
        await event_channel.overwritePermissions([{
            id: user,
            allow: ['VIEW_CHANNEL']
        }]);
        await event_channel.send(user.toString());

        await this.updateCards(event);
    }

    public async updateCards(event: CommunityEvent){
        if (!event.event_cards) {
            await event.$relatedQuery<EventCard>('event_cards')
        }

        const event_embed = await event.$cardContent();
        const event_embed_interior = await event.$cardContent(true);

        await Promise.all(event.event_cards.map(async event_card => {
            const message = await event_card.$getMessage();
            const this_embed = event_card.type == CardType.EVENT_CHANNEL ? event_embed_interior : event_embed;
            await message.edit(this_embed);
        }));
    }

    public async bootstrap() {
        this.hasBeenBootstrapped = true;
        const event_cards = await EventCard
            .query()
            .eager('event');

        for (const event_card of event_cards) {
            const event = event_card.event;
            const message = await event_card.$getMessage();
            this.beginTracking(message, event);
        }
    }

    public async createCard(event: CommunityEvent, channel: TextChannel, interior: boolean = false) {
        const event_embed = await event.$cardContent(interior);

        let message = await channel.send(event_embed);

        if (Array.isArray(message)) {
            message = message[0];
        }

        await event
            .$relatedQuery<EventCard>('event_cards')
            .insert({
                event_id: event.id,
                channel: channel.id,
                message: message.id,
                type: interior ? CardType.EVENT_CHANNEL : CardType.DEFAULT
            });

        this.beginTracking(message, event);

        if (interior) {
            await message.react('❌');
        } else {
            await message.react('✅');
        }
    }

    public async getEventByChannel(channel_id: Snowflake): Promise<CommunityEvent> {
        return await CommunityEvent.query()
            .where('channel', channel_id)
            .first();
    }
}