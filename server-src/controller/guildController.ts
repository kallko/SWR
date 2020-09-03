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
import { userService } from '../service/UserService';
import { GuildMembers, User } from '../service/dbModels';
import { UnitService } from '../service/UnitService';

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
		let guildId = await guildService.getGuildId(allyCode);
		let player;
		if (!guildId) {
			player = await fetchDataService.getPlayer(allyCode);
			guildId = player.data.guild_id;
		}
		let guildName =
			(await guildService.getGuildName(guildId)) || player.data.guild_name;
		let guild = await guildService.getGuildMembers(guildId);
		let members;
		if (guild?.length === 0) {
			const fetchedGuild = await fetchDataService.getGuildPlayersCode(allyCode);
			members = fetchedGuild
				? fetchedGuild.members.map((member) => {
						return { id: member.id, name: member.name };
				  })
				: [];
		} else {
			members = guild.map((member) => {
				return { id: member.allyCode, name: member.name };
			});
		}
		return {
			members,
			name: guildName
		};
	},
	updateData: async function () {
		const guildMembers: Partial<GuildMembers[]> = await guildService.getAll();
		const players: Partial<User[]> = await userService.getUsersAllyCode();
		players.forEach((player) => {
			if (!guildMembers.some((member) => member.allyCode === player.allyCode)) {
				guildMembers.push(player as any);
			}
		});
		for (const member of guildMembers) {
			const player = await fetchDataService.getPlayer(member.allyCode);
			if (player.units) {
				await guildService.updateGuildMember(
					member.allyCode,
					player.data.guild_id,
					player.data.name
				);
				await guildService.updateGuildName(
					player.data.guild_id,
					player.data.guild_name
				);
				for (const unit of player.units) {
					await UnitService.createOrUpdate(member.allyCode, unit);
				}
			}
		}
		const guildIds = await guildService.getGuildIds();
		const memberGuildIds = await guildService.getMemberGuildIds();
		memberGuildIds.forEach((guild) => {
			if (
				!guildIds.some((existGuild) => existGuild.guildId === guild.guildId)
			) {
				guildIds.push(guild);
			}
		});
		for (const guild of guildIds) {
			const members: GuildMembers[] = await guildService.getGuildMembers(
				guild.guildId
			);
			let updatedMembers = [];
			for (const member of members) {
				if (
					!updatedMembers.some(
						(updatedMember) => updatedMember.allyCode === member.allyCode
					)
				) {
					const freshGuild = await fetchDataService.getGuildPlayersCode(
						member.allyCode
					);
					const freshMember = await fetchDataService.getPlayer(member.allyCode);
					const freshGuildId = freshMember.data.guild_id;
					for (const fMember of freshGuild.members) {
						updatedMembers.push({ allyCode: fMember.id });
						await guildService.updateGuildMember(
							fMember.id,
							freshGuildId,
							fMember.name
						);
					}
				}
			}
		}
	}
};
