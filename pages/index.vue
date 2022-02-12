<template>
  <div>
    <v-row>
      <v-col v-for="(zombie, index) in zombies" :key="index" md="3" sm="6">
        <zombie-character :zombie="zombie"></zombie-character>
        <v-card>
          <div class="text-center">
            <nuxt-link :to="'/zombies/' + zombie.id">
              #{{ zombie.id }} {{ zombie.name }}</nuxt-link
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
    <infinite-loading
      v-if="zombies.length > 0"
      spinner="bubbles"
      @infinite="infiniteScroll"
    >
      <template slot="spinner">Loading more CryptoZombies...</template>
      <template slot="no-more">No more CryptoZombies...</template>
      <template slot="no-results">No more CryptoZombies...</template>
    </infinite-loading>
  </div>
</template>

<script lang="ts">
import { Contract } from 'ethers'
import { Vue, Component } from 'nuxt-property-decorator'
import { provider, getCryptoZombiesContract } from '~/plugins/provider'
import ZombieCharacter from '~/components/ZombieCharacter.vue'
import { Zombie } from '~/interfaces/zombie'

@Component({
  components: {
    ZombieCharacter,
  },
})
export default class Home extends Vue {
  cryptoZombieContract: Contract = getCryptoZombiesContract()

  zombies: Array<Zombie> = []
  startIndex: number = 0
  totalSize: number = 10

  async fetch() {
    const signer = await provider.getSigner()
    this.cryptoZombieContract = getCryptoZombiesContract(signer)
    try {
      this.zombies = await this.cryptoZombieContract.getZombies(
        this.startIndex,
        this.totalSize
      )
      this.startIndex += this.zombies.length
    } catch (e) {
      console.log(e)
    }
  }

  async infiniteScroll($state: any) {
    try {
      const zombies = await this.cryptoZombieContract.getZombies(
        this.startIndex,
        this.totalSize
      )
      if (zombies.length > 0) {
        this.zombies = this.zombies.concat(zombies)
        this.startIndex += zombies.length
        $state.loaded()
      } else {
        $state.complete()
      }
    } catch (e) {
      $state.complete()
    }
  }
}
</script>