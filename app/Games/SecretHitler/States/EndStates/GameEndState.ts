import State from "../State";
import SecretHitlerParty from "../../Enums/SecretHitlerParty";
import {Message, MessageEmbed} from "discord.js";
import SecretHitler from "../../index";
import Describer from "../../Describer";

export default abstract class GameEndState extends State {
    protected abstract getWinReason(): string;
    protected abstract getWinningParty(): SecretHitlerParty;

    async init(): Promise<Message> {
        return this.game.send(new MessageEmbed()
            .setColor(SecretHitler.colors.get(this.getWinningParty()))
            .setTitle(`${this.getWinReason()}\n\n${Describer.describeParty(this.getWinningParty())} win the game.`));
    }
}