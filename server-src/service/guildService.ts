import { Guild, GuildMembers } from './dbModels';

export const guildService = {
	create: async function (options) {
		const { name, guildId } = options;
		const createOptions = {
			name,
			guildId
		};
		return await Guild.create(createOptions);
	},
	getGuildMembers: async function (guildId: number) {
		return await GuildMembers.findAll({
			where: { guildId },
			nest: true,
			raw: true
		});
	},
	addGuildMember: async function (member, guildId) {
		return await GuildMembers.create({
			guildId,
			allyCode: member.id,
			name: member.name
		});
	},
	removeMember: async function (member) {
		const oldMember = await GuildMembers.findOne({
			where: {
				allyCode: member.allyCode
			}
		});
		return await oldMember.destroy();
	},
	updateGuildName: async function (guildId, guildName) {
		const guild = await Guild.findOne({
			where: {
				guildId
			}
		});
		if (guild) {
			await guild.update({
				guildName
			});
		} else {
			await Guild.create({
				guildId,
				name: guildName
			});
		}
	},
	getGuildName: async function (guildId: number) {
		const guild = await Guild.findOne({ where: { guildId } });
		return guild.name;
	},
	getGuildId: async function (allyCode: number) {
		const member = await GuildMembers.findOne({ where: { allyCode } });
		return member?.guildId;
	}
};
