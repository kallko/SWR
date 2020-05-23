"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformer = void 0;
var sorter_1 = require("./sorter");
exports.Transformer = {
    transformColorUpMods: function (mods) {
        return mods.map(function (mod) {
            return {
                col1: mod.character,
                col2: mod.slot
            };
        });
    },
    transformLegendProgress: function (legendPlayerProgresses) {
        console.log('Progress ', legendPlayerProgresses);
        var tableKylo = legendPlayerProgresses.map(function (progress) {
            return {
                player: progress.player_name,
                sort: progress.legend_progress[0].display_data.sorting_data,
                display: progress.legend_progress[0].display_data.display_status
            };
        });
        var tableRey = legendPlayerProgresses.map(function (progress) {
            return {
                player: progress.player_name,
                sort: progress.legend_progress[1].display_data.sorting_data,
                display: progress.legend_progress[1].display_data.display_status
            };
        });
        tableKylo.sort(sorter_1.Sorter.sortByProgress);
        tableRey.sort(sorter_1.Sorter.sortByProgress);
        return [tableKylo, tableRey];
    }
};
