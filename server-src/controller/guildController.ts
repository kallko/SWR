import {BRAZZERS} from "../@const/brazzers";
import {LEGEND} from "../@const/legendRequirements";
import {IUnit} from "../@types/IUnit";
import {fetchDataService} from '../service/fetchDataService'
import {ILegendPlayerProgress, ILegendProgress, ILegendReqUnit} from "../@types/IGuild";
import {IMod} from "../@types/IMod";
import {IFrontLegendTable} from "../@types/IFrontEnd";
import {Transformer} from "../helper/transformer";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export const guildController = {
    getLegendProgress: async function (): Promise<any> {
        let guildResult: ILegendPlayerProgress[] = [];

        //todo for testing
        let test: number = 3;
        let players: number = Math.min(test, BRAZZERS.length);

        for (let i: number = 0; i < players; i++) {
            await sleep(1000);
            console.log('Start get info for ', BRAZZERS[i].name);
            let result: ILegendProgress[] = [];
            let units: IUnit[] = (await fetchDataService.getPlayer(BRAZZERS[i].id)).units;
            await sleep(1000);
            const mods: IMod[] = await fetchDataService.getAllMods(BRAZZERS[i].id);
            console.log('Received units ', units.length, ' and mods ', mods.length);
            LEGEND.forEach(legend => {
                if (isExist(legend.name, units)) {
                    result.push({
                        legend_name: legend.name,
                        display_data: {
                            display_status: 'EXIST',
                            sorting_data: 101
                        }
                    })
                } else {
                    let unitProgress: ILegendReqUnit[] = [];
                    legend.req_units.forEach((reqUnit): void => {
                        const playerUnit: IUnit | undefined = units.find(unit => unit.data.base_id === reqUnit.base_id);
                        if (playerUnit) {
                            if (isComplete(playerUnit, reqUnit)) {
                                unitProgress.push({
                                    base_id: reqUnit.base_id,
                                    isComplete: true,
                                    need_power: reqUnit.power,
                                    current_power: reqUnit.power,
                                    previous_power: 0
                                })
                            } else {
                                unitProgress.push({
                                    base_id: reqUnit.base_id,
                                    isComplete: false,
                                    need_power: reqUnit.power,
                                    current_power: playerUnit.data.power,
                                    previous_power: 0
                                })
                            }
                        } else {
                            unitProgress.push({
                                base_id: reqUnit.base_id,
                                isComplete: false,
                                need_power: reqUnit.power,
                                current_power: 0,
                                previous_power: 0
                            })
                        }
                    });
                    let progress: number = unitProgress.reduce((sum: number, unit: ILegendReqUnit) => {
                        return sum + getCorrectedPower(unit, units, mods, legend.req_units);
                    }, 0);
                    let maximum: number = legend.req_units.reduce((sum: number, rUnit) => sum + rUnit.power, 0);
                    let playerLegendProgress: number = Math.round(progress / maximum * 100);
                    result.push({
                        legend_name: legend.name,
                        display_data: {
                            display_status: '' + playerLegendProgress + '%',
                            sorting_data: playerLegendProgress
                        },
                        data: unitProgress
                    })
                }
            })
            guildResult.push({
                player_name: BRAZZERS[i].name,
                legend_progress: result
            })
        }
        return Transformer.transformLegendProgress(guildResult);
    }
}

function isExist(name: string, units: IUnit[]) {
    return units.some((unit: IUnit) => unit.data.base_id === name);
}
function isComplete(playerUnit: IUnit, unit: any){
    return playerUnit.data.relic_tier - 2 === unit.relic || playerUnit.data.rarity === unit.rarity
}

function getCorrectedPower(unit: ILegendReqUnit, playerUnits: IUnit[], mods: IMod[], reqUnits: any[]) {
    if (unit.isComplete || unit.current_power === 0) {
        return unit.current_power;
    }
    let playerUnit = playerUnits.find(pUnit => pUnit.data.base_id === unit.base_id)
    if (!playerUnit) {
        return  0;
    }
    if (playerUnit.data.combat_type === 1) {
        const unitMods = mods.filter((mod) => mod.character === unit.base_id)
            .length;
        const modsPower = 750 * unitMods;
        return Math.min(unit.current_power - modsPower, unit.need_power * 0.99);
    }
    let reqUnit = reqUnits.find(rUnit => rUnit.base_id === unit.base_id);
    return Math.min (unit.current_power * playerUnit.data.rarity/reqUnit.rarity, unit.current_power);
}
