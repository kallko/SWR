import { IDiscordChannel, IDiscordMessage } from '../../@types/IDiscord';
import { config } from '../../config/config';
import { discordDispatcher } from './discordDispatcher';
let masterChannel: IDiscordChannel;
const eris = require('eris');

const bot = new eris.Client(config.discordToken);

bot.on('ready', async () => {
	masterChannel = await bot.getDMChannel(config.discordMasterId);
	masterChannel.createMessage(
		process.env.NODE_ENV + ' Server started: ' + new Date().toLocaleString()
	);
	await bot.editStatus('online', { name: 'swr -h', type: 0 });
});

bot.on('messageCreate', async (msg: IDiscordMessage) => {
	const botWasMentioned = msg.mentions.find(
		(mentionedUser) => mentionedUser.id === bot.user.id
	);

	if (botWasMentioned) {
		try {
			return await msg.channel.createMessage('swr -h for help');
		} catch (err) {
			console.warn('Failed to respond to mention.');
			return console.warn(err);
		}
	}
	return await discordDispatcher.dispatch(msg, msg.channel);
});

bot.on('error', (err) => {
	console.warn(err);
});

bot.connect();

export const discordMain = {
	sendToMaster: function (msg: string): void {
		if (masterChannel) {
			masterChannel.createMessage(msg);
		}
	},
	sendToChannel: async function (channel: string = '', msg: string) {
		await bot.createMessage(channel, msg);
	},
	logger: function (req, res, next): void {
		if (process.env.NODE_ENV === 'PRODUCTION') {
			const msg =
				new Date().toLocaleString() +
				' ' +
				req.method +
				': ' +
				req.url +
				' params: ' +
				JSON.stringify(req.params) +
				' query: ' +
				JSON.stringify(req.query);
			discordMain.sendToMaster(msg);
		}
		next();
	}
};
