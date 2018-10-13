export declare function getChannels(): Promise<Voo.http.Channel[]>;
export declare const getChannelsCached: () => Promise<Voo.http.Channel[]>;
export declare function findChannel(name: string): Promise<Voo.http.Channel | undefined>;
