import { join } from 'path';
import { readFileSync } from 'fs';
export class ConfigService{
    CONFIG_DIR_PATH = 'config';
    DOTFILES_FOLDER_PATH = '../../dotfiles';
    config
    constructor(){
        if(this.isConfigValid('dotfiles-config.json')){
            this.config = this.initConfig();
        }
        else{
            throw new Error('Error configuration files');
        }
    }
    initConfig(){
        return {
            dotfilesFolderPath: this.DOTFILES_FOLDER_PATH,
            dotfilesConfig: this.getConfigJSON('dotfiles-config.json')
        }
    }
    getConfigJSON(configName){
        const rawData = readFileSync(join(this.CONFIG_DIR_PATH, configName), 'utf-8');
        return JSON.parse(rawData);
    }
    isConfigValid(configName){
        try {
            readFileSync(join(this.CONFIG_DIR_PATH, configName), 'utf-8');
            return true;
        } catch {
            return false;
        }
    }
}