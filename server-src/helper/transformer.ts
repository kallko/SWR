import {IColorUpModFrontEnd, IMod} from "../@types/IMod";

export const Transformer = {
    transformColorupMods(mods: IMod[]): IColorUpModFrontEnd[] {
        return mods.map((mod: IMod) => { return {
            col1: mod.character,
            col2: mod.slot
        }})
    }
}
