import { Vue } from 'nuxt-property-decorator';
import { BigNumber } from 'ethers'
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { Zombie } from '~/interfaces/zombie'
@Module({
    name: 'zombie',
    stateFactory: true,
    namespaced: true
})

export default class Wallet extends VuexModule {
    public contractAdmin: string = ''
    public isAdmin: boolean = false
    public zombies: Array<Zombie> = []
    public levelUpFee: number = 0.001 * 10 ** 18


    @Mutation
    public setAdmin(isAdmin: boolean) {
        this.isAdmin = isAdmin
    }

    @Mutation
    public setContractAdmin(admin: string) {
        this.contractAdmin = admin
    }

    @Mutation
    public setLevelUpFee(fee: number) {
        this.levelUpFee = fee
    }

    @Mutation
    public setZombies(zombies: Array<Zombie>) {
        this.zombies = zombies.map(zombie => ({
            id: zombie.id,
            name: zombie.name,
            dna: zombie.dna,
            level: zombie.level,
            winCount: zombie.winCount,
            lossCount: zombie.lossCount,
            readyTime: zombie.readyTime
        }))
    }

    @Mutation
    addZombie(zombie: Zombie) {
        this.zombies.push(zombie)
    }

    @Mutation
    updateZombie(update: { id: BigNumber, data: { level: number } }) {
        const zombieIndex = this.zombies.findIndex(zombie => zombie.id === update.id)
        if (zombieIndex !== 1) {
            Vue.set(this.zombies, zombieIndex, { ...this.zombies[zombieIndex], ...update.data })
        }
    }
}