export class PackageManager{
    installCommand
    updateCommand
    deleteCommand

    constructor(installCommand, updateCommand, deleteCommand){
        this.installCommand = installCommand;
        this.updateCommand = updateCommand;
        this.deleteCommand = deleteCommand;
    }
}