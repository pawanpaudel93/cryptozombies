<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular :size="50" color="primary" indeterminate>
      </v-progress-circular>
      <p>Loading zombies...</p>
    </div>
    <div v-else>
      <v-row v-if="allZombies.length > 0">
        <v-col v-for="(zombie, index) in allZombies" :key="index" md="3" sm="6">
          <zombie-character :zombie="zombie"></zombie-character>
          <v-card elevation="12">
            <div class="text-center">
              <nuxt-link :to="'/zombies/' + zombie.id">
                #{{ zombie.id }} {{ zombie.name }}</nuxt-link
              >
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-alert
        v-else
        color="primary"
        icon="mdi-alert-circle-outline"
        class="mt-6"
        outlined
      >
        <span class="white--text">No CryptoZombies found.</span>
      </v-alert>
    </div>
    <infinite-loading
      v-if="allZombies.length > 0"
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
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { getProvider, getCryptoZombiesContract } from '~/plugins/utils'
import ZombieCharacter from '~/components/ZombieCharacter.vue'
import { Zombie } from '~/interfaces/zombie'

const zombie = namespace('zombie')

@Component({
  components: {
    ZombieCharacter,
  },
})
export default class Home extends Vue {
  cryptoZombieContract!: Contract
  totalSize: number = 10
  isLoading: boolean = true

  @zombie.State
  allZombies!: Array<Zombie>

  @zombie.Mutation
  setAllZombies!: (zombies: Array<Zombie>) => void

  async created() {
    try {
      this.cryptoZombieContract = getCryptoZombiesContract(getProvider())
      if (this.allZombies.length === 0) {
        const zombies = await this.cryptoZombieContract.getZombies(
          this.allZombies.length,
          this.totalSize
        )
        this.setAllZombies(zombies)
      }
    } catch (e) {
      console.log(e, 'error')
    }
    this.isLoading = false
  }

  async infiniteScroll($state: any) {
    try {
      const zombies = await this.cryptoZombieContract.getZombies(
        this.allZombies.length,
        this.totalSize
      )
      if (zombies.length > 0) {
        this.setAllZombies(zombies)
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
