export interface IDiscordMessage {
	mentions?: IDiscordUser[];
	channel?: IDiscordChannel;
	content?: string;
	author?: {
		allyCode?: number;
		id: string;
		username: string;
		bot: boolean;
		greeting?: string;
		guildName?: string;
	};
}

export interface IDiscordUser {
	id: number;
}

export interface IDiscordChannel {
	id?: number;
	type: number;
	createMessage?: (msg: string, channel?: any) => void;
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
