import { Region } from "./region";

export class Cliente {
    cliId: number = 0;
    cliNombre: string = '';
    cliApellido: string = '';
    cliEmail: string = '';
    region: Region = new Region();
    fecCrea: string = '';
    usuCrea: string = '';
    fecModi: string = '';
    usuModi: string = '';
    regActivo: number = 1;
}