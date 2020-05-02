import envConfig from './config.json';


const env: string = process.env["NODE_ENV"].toString();
let customEnv: any;
if (env === 'production') {
    customEnv = envConfig.production;
} else {
    customEnv = envConfig.development;
}

export const config = {
    get(field: string): string {
        if (!field) {
            throw new Error('field for config not specified');
        }
        console.log('Get function ', env);
        return customEnv[field];
    },
};

