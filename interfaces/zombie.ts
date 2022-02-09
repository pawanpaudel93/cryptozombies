import { BigNumber } from "ethers"

export type Zombie = {
    id: BigNumber
    name: string
    dna: BigNumber
    level: number
    winCount: number
    lossCount: number
    readyTime: number
}