const fs = require('fs');
const baseSaveUrl = './files/';

export const readWriteService = {
    saveLegendProgressForGuild(results: any, name = 'last.json') {
        const fileName = join(baseSaveUrl, name);
        fs.writeFile(fileName, JSON.stringify(results), 'utf8', (err: any) => {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    },
    async readJson (name = 'brazzers.json') {
        const fileName = join(baseSaveUrl, name);
        return fs.readFileSync(fileName, 'utf8', function (err: any, data: any) {
            if (err) throw err;
            return JSON.parse(data);
        });
    }
};


function join(...args: any[]) {
    return args.reduce((sum, arg) => sum + arg, '');
}
