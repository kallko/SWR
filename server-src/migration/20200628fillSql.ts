import { readWriteService } from '../service/readWriteService';
import { userService } from '../service/userService';
import { LEGEND } from '../@const/legendRequirements';
import { LegendRequirementsService } from '../service/LegendRequirementsService';
import { LegendRequirementsCreationAttributes } from '../service/dbModels';

export async function fillUsers() {
	const usersResp = await readWriteService.readJson(
		'registration/registr.json'
	);
	const users = await JSON.parse(usersResp);
	for (let i: number = 0; i < users.length; i++) {
		await userService.createUser(users[i]);
	}
}

export async function fillLegendReq() {
	const Requirements = LEGEND;
	Requirements.forEach((req) => {
		req.req_units.forEach((unit) => {
			console.log(
				req.name,
				unit.base_id,
				unit.power,
				unit.relic,
				unit.ship,
				unit.rarity
			);
			const options: LegendRequirementsCreationAttributes = {
				name: req.name,
				base_id: unit.base_id,
				power: unit.power,
				relic: unit.relic,
				ship: unit.ship,
				rarity: unit.rarity
			};
			LegendRequirementsService.create(options);
		});
	});
}
