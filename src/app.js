import { ConfigService } from './services/config.service.js';
import { SystemUtils } from './helpers/system.utils.js';
import prompt from 'prompt';
import 'colors';

export class App {

    gitRepoFullPath
    os
    currentDistroPkgManager
    configService

    constructor() {
        this.configService = new ConfigService();
    }
    async main() {
        try {
            const promptSchema = {
                properties: {
                    gitRepoFullPath: {
                        message: 'Git repository full path',
                        required: true
                    }
                }
            };

            prompt.start();

            prompt.get([promptSchema], async (err, result) => {
                if (err) throw new Error(err);
                console.log(' gitRepoFullPath: ' + result.gitRepoFullPath);

                this.gitRepoFullPath = result.gitRepoFullPath;

                this.os = await SystemUtils.currentOS();
                this.currentDistroPkgManager = SystemUtils.currentDistroPkgManager(this.os);
                await this.installDotfiles();
            });
        }
        catch (e) {
            console.log('=== ERROR === '.red + e);
            process.exit(1);
        }
    }
    async installDotfiles() {
        const config = this.configService.config;
        const replaceArgs = {
            '{install}': this.currentDistroPkgManager.installCommand,
            '{update}': this.currentDistroPkgManager.updateCommand,
            '{delete}': this.currentDistroPkgManager.deleteCommand,
            '{gitRepoFullPath}': this.gitRepoFullPath
        }
        let commandsModules = Object.keys(config.dotfilesConfig);
        for (const key in config.dotfilesConfig) {
            let indexOfCurrentCommandModule = commandsModules.indexOf(key) + 1;
            let commands = config.dotfilesConfig[key].commands;
            console.log(`[${key}] [${indexOfCurrentCommandModule} - ${commandsModules.length}]`.blue);
            try {
                if (!config.dotfilesConfig[key].os.includes(this.os)) throw new Error('Unsupported Distro');
                for (let command of commands) {
                    command = this.replacePlaceholders(command, replaceArgs);
                    console.log(key, ' - ', command);
                    await this.cmd(command);
                }
                console.log(`[${key}] installed. [${indexOfCurrentCommandModule} - ${commandsModules.length}]`.green);
            }
            catch (e) {
                console.log(`[${key}] not installed: ${e} [${indexOfCurrentCommandModule} - ${commandsModules.length}]`.red);
            }
        }
    }
    async cmd(command) {
        let result = await SystemUtils.cmd(command);
        if (result.code != 0) throw new Error(`[${command}] ${result.data}`);
        console.log(result.data);
    }
    replacePlaceholders(str, args) {
        for (const key in args) {
            str = str.replace(key, args[key]);
        }

        return str;
    }
}

(new App).main();