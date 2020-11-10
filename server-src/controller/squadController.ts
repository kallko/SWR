import { playerController } from './playerController';
import { squadService } from '../service/squadService';

export const squadController = {
	async getModeRulesForArenaSquad(allyCode: number): Promise<any> {
		const arenaUnits = await playerController.getArenaUnits(allyCode);
		const squad = sortUnitsInSquad(arenaUnits);
		const storedSquads = await squadService.getBySquad({ squad }, allyCode);
		const squadOptions =
			storedSquads?.length > 0
				? await JSON.parse(storedSquads[0]?.modeRules)
				: null;
		if (!squadOptions) {
			throw new Error(
				'No such arena squad config exists.\nTo create config for Your squad, You should become a patron for project,\nor wait until this squad became more popular.'
			);
		}
		if (!isCorrectSquadOptions(arenaUnits, squadOptions)) {
			throw new Error('Incorrect Squad options.\n');
		}
		return squadOptions;
	}
};

export function sortUnitsInSquad(squadUnits: string[]): string {
	const leader: string[] = squadUnits.splice(0, 1);
	squadUnits.sort();
	return leader.concat(squadUnits).toString();
}

function isCorrectSquadOptions(arenaUnits, squadOptions): boolean {
	return arenaUnits.every((unit) =>
		squadOptions.some((hero) => hero.name === unit)
	);
}
