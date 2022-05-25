export type Users = {
    [userId: string]: string;
};

export type Config = {
    [guildId: string]: Users;
};
