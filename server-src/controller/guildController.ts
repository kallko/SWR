import { IFrontLegendTable } from '../@types/IFrontEnd';
import {
	IGuild,
	ILegendPlayerProgress,
	ILegendProgress
} from '../@types/IGuild';

import { fetchDataService } from '../service/fetchDataService';

import { playerController } from './playerController';

import { Transformer } from '../helper/transformer';
import { guildService } from '../service/guildService';
import { GuildMembers } from '../service/dbModels';

export const guildController = {
	getLegendProgress: async function (
		allyCode: number
	): Promise<IFrontLegendTable[][]> {
		const guildResult: ILegendPlayerProgress[] = [];
		const test: number = process.env.NODE_ENV === 'PRODUCTION' ? 300 : 3;
		const guild: IGuild = await fetchDataService.getGuildPlayersCode(allyCode);
		const players: number = Math.min(test, guild.members.length);

		for (let i: number = 0; i < players; i++) {
			const result: ILegendProgress[] = await playerController.getLegendProgress(
				guild.members[i].id
			);
			guildResult.push({
				player_name: guild.members[i].name,
				legend_progress: result
			});
		}

		return Transformer.transformLegendProgress(guildResult);
	},
	getGuildAll: async function (allyCode: number): Promise<IGuild> {
		const guildId = await guildService.getGuildId(allyCode);
		const guildName = await guildService.getGuildName(guildId);
		const guild = await guildService.getGuildMembers(guildId);
		const members = guild.map((member) => {
			return { id: member.allyCode, name: member.name };
		});
		return {
			members,
			name: guildName
		};

	},
	updateGuild: async function (guildId: number, guild: IGuild) {
		// todo update guild
		// const guildMembers = await fetchDataService.getGuildPlayersCode(allyCode);
		// const member = await fetchDataService.getPlayer(guildMembers.members[0].id);
		// await guildController.updateGuild(guildId, guildMembers);
		const oldGuildMembers = await guildService.getGuildMembers(guildId);
		const joinedMembers = guild.members.filter(
			(member) =>
				!oldGuildMembers.some((oMember) => oMember.allyCode === member.id)
		);
		const deletedMembers = oldGuildMembers.filter(
			(oMember) =>
				!guild.members.some((member) => member.id === oMember.allyCode)
		);
		for (const member of joinedMembers) {
			await guildService.addGuildMember(member, guildId);
		}
		for (const member of deletedMembers) {
			await guildService.removeMember(member);
		}
		await guildService.updateGuildName(guildId, guild.name);
	},
	getGuildId: async function (allyCode: number) {
		const member = await GuildMembers.findOne({
			where: {
				allyCode
			}
		});
		return member.guildId;
	}
};
