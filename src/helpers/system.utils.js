import { spawn } from 'child_process';
import { PackageManager } from '../model/package-manager.js';
export class SystemUtils {
    static async currentOS() {
        const os = (await this.cmd('cat /etc/os-release | grep ^ID= | cut -c 4-')).data;
        return os.replace(/\s/g, '');
    }
    static currentDistroPkgManager(distro) {
        let packageManager;
        switch (distro) {
            case "debian":
            case "ubuntu":
                packageManager = new PackageManager("apt install -y", "apt update", "apt purge -y");
                break;
            case 'arch':
            case 'manjaro':
                packageManager = new PackageManager("pacman -S --noconfirm", "pacman -Syu", "pacman -Rs --noconfirm");
                break;
            default:
                throw Error('Unknown Distro');
        }
        return packageManager;

    }
    static async cmd(command) {

        const result = spawn('sh', ['-c', command]);
        const ret = new Promise(async (resolve, reject) => {

            let res = {
                data: '',
                code: 0
            }

            result.stdout.on("data", data => {
                res.data += Buffer.from(data).toString();
            });

            result.stderr.on("data", data => {
                res.data = Buffer.from(data).toString();
            });

            result.on('error', (error) => {
                console.log(error);
            });

            result.on("close", code => {
                res.code = code;
                resolve(res);
            });
        });
        return ret;
    }
}