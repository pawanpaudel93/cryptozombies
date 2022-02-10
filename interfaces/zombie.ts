import { BigNumber } from "ethers"

export interface Zombie {
    id: BigNumber
    name: string
    dna: BigNumber
    level: number
    winCount: number
    lossCount: number
    readyTime: number
}