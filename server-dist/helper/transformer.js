"use strict";
exports.__esModule = true;
exports.Transformer = {
    transformColorupMods: function (mods) {
        return mods.map(function (mod) {
            return {
                col1: mod.character,
                col2: mod.slot
            };
        });
    }
};
