import { BigNumber } from "ethers"

export interface Zombie {
    id: BigNumber
    name: string
    dna: BigNumber
    level: BigNumber
    winCount: BigNumber
    lossCount: BigNumber
    readyTime: BigNumber
}