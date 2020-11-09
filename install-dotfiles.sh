#!/bin/bash
# dotfiles folder location
    folderLocation=$(pwd)

# distro id: debian, arch, ubuntu, ... 
	distroID=$(cat /etc/*-release | grep ^ID | cut -c 4-)

# change color of echo output text: $1=text $2=color
	function echoColor (){
		text=$1
		color=$2

		case $color in
			green)
				echo -e "\033[32m$text\033[m"
			;;
			yellow)
				echo -e "\033[33m$text\033[m"
			;;
			blue)
				echo -e "\033[34m$text\033[m"
			;;
		esac
	}
 
 # pkg manager depending on the distro	
 	function currentDistroPkgManager(){
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

	}
# print distro info
	echoColor "Distro based on: $distroID" blue

# install vscode
    read -p "Install vscode: default[YySs]"$'\n' -n 1 -r
    if [[ $REPLY =~ ^[YySs]$ || $REPLY = "" ]]
    then
    	if [[ distroID == "arch" || distroID == "manjaro" ]]
    	then
			sudo $(currentDistroPkgManager install) code
			sudo -k
		else
			sudo $(currentDistroPkgManager install) curl
			curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
			sudo install -o root -g root -m 644 microsoft.gpg /usr/share/keyrings/microsoft-archive-keyring.gpg
			sudo sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list'
			sudo apt-get install apt-transport-https
			sudo apt-get update
			sudo apt-get install code
			sudo rm microsoft.gpg
			sudo -k
		fi
        #DotFiles
        cat $folderLocation/vscode/vscode_extensions.list | xargs -L 1 code --install-extension
	    ln -svf $folderLocation/vscode/settings.json ~/.config/Code/User/settings.json
		rm -r ~/.config/Code/User/snippets
		ln -svf $folderLocation/vscode/snippets/ ~/.config/Code/User/
	    echoColor "\n[Ok] Visual Studio Code" green  
    elif [[ $REPLY =~ ^[Nn]$ ]]
	then
        echoColor "\n[Not] Visual Studio Code" yellow 
    fi

# install zsh
    read -p "Install ohmyzsh: default[YySs]"$'\n' -n 1 -r
    if [[ $REPLY =~ ^[YySs]$ || $REPLY = "" ]]
    then
    	sudo $(currentDistroPkgManager install) curl zsh
        sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

        #DotFiles
	    rm ~/.zshrc
	    ln -svf $folderLocation/.zshrc ~/
	    ln -svf $folderLocation/.oh-my-zsh/themes/joatb.zsh-theme ~/.oh-my-zsh/themes/
	    echoColor "\n[Ok] zsh" green  
    else
        echoColor "\n[Not] zsh" yellow 
    fi