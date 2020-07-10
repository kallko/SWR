import { readWriteService } from '../service/readWriteService';
import { userService } from '../service/UserService';
import { LEGEND } from '../@const/legendRequirements';
import { LegendRequirementsService } from '../service/LegendRequirementsService';
import {
	LegendRequirementsCreationAttributes,
	LegendProgressCreationAttributes
} from '../service/dbModels';
import { LegendService } from '../service/LegendService';

export async function fillUsers(): Promise<void> {
	const usersResp = await readWriteService.readJson(
		'registration/registr.json'
	);
	const users = await JSON.parse(usersResp);
	for (let i: number = 0; i < users.length; i++) {
		await userService.createUser(users[i]);
	}
}

export async function fillLegendReq(): Promise<void> {
	const Requirements = LEGEND;
	Requirements.forEach((req) => {
		req.req_units.forEach((unit) => {
			console.log(
				req.name,
				unit.baseId,
				unit.power,
				unit.relic,
				unit.ship,
				unit.rarity
			);
			const options: LegendRequirementsCreationAttributes = {
				name: req.name,
				baseId: unit.baseId,
				power: unit.power,
				relic: unit.relic,
				ship: unit.ship,
				rarity: unit.rarity
			};
			LegendRequirementsService.create(options);
		});
	});
}

export async function fillLegendHistory(): Promise<void> {
	const files: string[] = await readWriteService.readDirAsync(
		'./files/arch/players/lp'
	);
	for (let i: number = 0; i < files.length; i++) {
		const dataResp = await readWriteService.readJson(
			`arch/players/lp/${files[i]}`
		);
		const archData = await JSON.parse(dataResp);
		const allyCode = files[i].split('.')[0];
		if (parseInt(allyCode)) {
			for (let j: number = 0; j < archData.length; j++) {
				for (let k: number = 0; k < 2; k++) {
					if (archData[j].legend_progress[k].data) {
						for (
							let m: number = 0;
							m < archData[j].legend_progress[k].data.length;
							m++
						) {
							const createdAt: Date = new Date(
								archData[j].year,
								archData[j].month - 1,
								archData[j].day
							);
							const data = archData[j].legend_progress[k].data[m];
							const result = await LegendService.findUnitsByOptions({
								where: {
									allyCode,
									baseId: data.base_id,
									createdAt
								}
							});
							if (!result || result.length === 0) {
								const options: LegendProgressCreationAttributes = {
									baseId: data.base_id,
									power: data.current_power,
									relic: data.relic || null,
									ship: data.ship || null,
									rarity: data.rarity || null,
									createdAt: createdAt,
									allyCode: Number(allyCode),
									isComplete: data.isComplete
								};
								const unit = await LegendService.create(options);
								console.info('Unit ', unit.baseId, 'for ', allyCode, 'created');
							}
						}
					}
				}
			}
		}
	}
}
