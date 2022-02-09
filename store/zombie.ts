import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { Zombie } from '~/interfaces/zombie'
@Module({
    name: 'zombie',
    stateFactory: true,
    namespaced: true
})

export default class Wallet extends VuexModule {
    public zombies: Zombie[] = []

    @Mutation
    public setZombies(zombies: Zombie[]) {
        this.zombies = zombies
    }
}