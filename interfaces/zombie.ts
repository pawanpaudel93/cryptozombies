import { BigNumber } from "ethers"

export interface ZombieInput {
    id: BigNumber
    name: string
    dna: BigNumber
    level: number
    winCount: number
    lossCount: number
    readyTime: number
}

export interface Zombie {
    id: number
    name: string
    dna: number
    level: number
    winCount: number
    lossCount: number
    readyTime: number
}