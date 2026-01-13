import { Injectable, Scope } from '@nestjs/common';

export type Superheroe = {
    name : string,
    superpower: string
}


@Injectable({scope: Scope.REQUEST})
export class SuperheroesService {

private readonly superheroes: Superheroe[] = [
    {
        name: "Solaris",
        superpower: "Photokinetic energy manipulation and flight"
    },
    {
        name: "Iron Weaver",
        superpower: "Creation of indestructible metallic webs"
    },
    {
        name: "Nebula Ghost",
        superpower: "Phasing through solid matter and invisibility"
    },
    {
        name: "Chronos Kid",
        superpower: "Briefly pausing time within a 10-meter radius"
    },
    {
        name: "Verdant Queen",
        superpower: "Telepathic communication with plant life"
    },
    {
        name: "Glacier Peak",
        superpower: "Instantaneous freezing of water molecules"
    },
    {
        name: "Sonic Pulse",
        superpower: "Emission of high-frequency concussive waves"
    },
    {
        name: "Mind Maze",
        superpower: "Projection of hyper-realistic mental illusions"
    },
    {
        name: "Volt Runner",
        superpower: "Superhuman speed powered by static electricity"
    },
    {
        name: "Shadow Smith",
        superpower: "Forging physical weapons out of pure darkness"
    }
];

getSuperheroes() : Array<Superheroe>{
    return this.superheroes
}
}
