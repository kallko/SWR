import { playerController } from './playerController';
import { squadService } from '../service/squadService';

export const squadController = {
	async getModeRulesForArenaSquad(allyCode: number): Promise<any> {
		const arenaUnits = await playerController.getArenaUnits(allyCode);
		const squad = sortUnitsInSquad(arenaUnits);
		const storedSquads = await squadService.getBySquad({ squad }, allyCode);
		return storedSquads?.length > 0
			? await JSON.parse(storedSquads[0]?.modeRules)
			: null;
	}
};

export function sortUnitsInSquad(squadUnits: string[]): string {
	const leader: string[] = squadUnits.splice(0, 1);
	squadUnits.sort();
	return leader.concat(squadUnits).toString();
}
