export interface IDiscordMessage {
	mentions?: IDiscordUser[];
	channel?: IDiscordChannel;
	content?: string;
	author?: {
		id: string;
		username: string;
	};
}

export interface IDiscordUser {
	id: number;
}

export interface IDiscordChannel {
	id?: number;
	createMessage?: (msg: string) => {};
	lastMessageID?: string;
	message?: any;
	messages?: {
		msgId: {
			id: string;
			author: {
				id: string;
				username: string;
			};
		};
	}[];
}
