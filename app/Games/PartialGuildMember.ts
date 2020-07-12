import PartialUser from "./PartialUser";

export default interface PartialGuildMember {
    displayName: string;
    user: PartialUser;
}