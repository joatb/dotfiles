const { spawn } = require("child_process");
const prompt = require('prompt');

prompt.start();

const distroId = spawn("cat", ['/etc/*-release']);

distroId.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
});

distroId.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
});

distroId.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

distroId.on("close", code => {
    console.log(`child process exited with code ${code}`);
});

//distroID=$(cat /etc/*-release | grep ^ID | cut -c 4-)

/* function currentDistroPkgManager(){

    case $distroID in
        debian|ubuntu)
            if [[ $1 == "install" ]]
            then
                echo "apt install"
            elif [[ $1 == "delete" ]]
            then
                echo "apt purge"
            elif [[ $1 == "update" ]]
            then
                echo "apt update"
            fi
        ;;
        arch|manjaro)
            if [[ $1 == "install" ]]
            then
                echo "pacman -S"
            elif [[ $1 == "delete" ]]
            then
                echo "pacman -Rs"
            elif [[ $1 == "update" ]]
            then
                echo "pacman -Syu"
            fi
        ;;
    esac

} */

const commands = {
    ohmyzsh: [
        "sudo $(currentDistroPkgManager install) curl zsh",
        "curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh",
	    "rm ~/.zshrc",
	    "ln -svf $folderLocation/.zshrc ~/",
	    "ln -svf $folderLocation/.oh-my-zsh/themes/joatb.zsh-theme ~/.oh-my-zsh/themes/",
    ]
}

let schema = {
    properties: {
        ohmyzsh: {
            description: 'Install vscode?',
            default: 'Y',
            required: true,
            before: function(value) { return (value === 'Y' || value === 'y') ? 1 : 0 }
        },
        ohmyzsh: {
            description: 'Install ohmyzsh?',
            default: 'Y',
            required: true,
            before: function(value) { return (value === 'Y' || value === 'y') ? 1 : 0 }
        },
    }
};

prompt.get(schema, function (err, result) {
    if (err) { return onErr(err); }
    for (const key in result) {
        if(result[key] === 1){
            console.log(commands[key]);
        }
    }
    console.log('Command-line input received:');
    console.log(' ohmyzsh: ' + result.ohmyzsh);
});

function onErr(err) {
    console.log(err);
    return 1;
}

/* const ls = spawn("sudo", ["apt", "update"]);

ls.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
});

ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

ls.on("close", code => {
    console.log(`child process exited with code ${code}`);
}); */