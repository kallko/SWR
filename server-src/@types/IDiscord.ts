export interface IDiscordMessage {
	mentions?: IDiscordUser[];
	channel?: IDiscordChannel;
	content?: string;
	embeds?: IDiscordEmbed[];
	author?: {
		allyCode?: number;
		id: string;
		username: string;
		bot: boolean;
		greeting?: string;
		guildName?: string;
	};
	addReaction?(s: string): void;
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
export interface IDiscordEmbed {
	title: string;
	description: string;
	author: {
		name: string;
		icon_url?: string;
	};
	color: string;
	fields: IDiscordEmbedField[];
	footer: {
		text: string;
	};
}

export interface IDiscordEmbedField {
	name: string;
	value: string;
	inline: boolean;
}
