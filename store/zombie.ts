import { BigNumber } from 'ethers';
import { Vue } from 'nuxt-property-decorator';
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
    public allZombies: Array<Zombie> = []
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
            readyTime: zombie.readyTime,
        }))
    }

    @Mutation
    public setAllZombies(zombies: Array<Zombie>) {
        this.allZombies.push(...zombies.map(zombie => ({
            id: zombie.id,
            name: zombie.name,
            dna: zombie.dna,
            level: zombie.level,
            winCount: zombie.winCount,
            lossCount: zombie.lossCount,
            readyTime: zombie.readyTime,
        })))
    }

    @Mutation
    addZombie(zombie: Zombie) {
        this.zombies.push(zombie)
    }

    @Mutation
    updateZombie(update: { id: BigNumber, data: Object & { win?: boolean, loss?: boolean } }) {
        const zombieIndex = this.zombies.findIndex(zombie => zombie.id.eq(update.id))
        if (zombieIndex !== 1) {
            const zombie = this.zombies[zombieIndex];
            if (update.data.win) {
                zombie.winCount.add(1)
                delete update.data.win;
            } else if (update.data.loss) {
                zombie.lossCount.add(1)
                delete update.data.loss;
            }
            Vue.set(this.zombies, zombieIndex, { ...zombie, ...update.data })
        }
    }

    @Mutation
    removeZombie(id: number) {
        const zombieIndex = this.zombies.findIndex(zombie => zombie.id.eq(id))
        if (zombieIndex !== 1) {
            this.zombies.splice(zombieIndex, 1)
        }
    }
}