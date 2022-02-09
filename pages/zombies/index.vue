<template>
  <v-container>
    <div class="text-center">
      <h3 class="white--text">My Zombies</h3>
    </div>
    <v-row>
      <v-col v-for="(zombie, index) in zombies" :key="index" md="4" sm="6">
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
  </v-container>
</template>

<script lang="ts">
import { Contract } from 'ethers'
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { provider, getCryptoZombiesContract } from '~/plugins/provider'
import ZombieCharacter from '~/components/ZombieCharacter.vue'
import { Zombie } from '~/interfaces/zombie'

const zombie = namespace('zombie')

@Component({
  components: {
    ZombieCharacter,
  },
})
export default class Home extends Vue {
  cryptoZombieContract: Contract = getCryptoZombiesContract()

  @zombie.State
  zombies!: Zombie[]

  @zombie.Mutation
  setZombies!: (zombies: Zombie[]) => void

  async mounted() {
    try {
      const signer = await provider.getSigner()
      this.cryptoZombieContract = getCryptoZombiesContract(signer)
      const zombies = await this.cryptoZombieContract.getZombiesByOwner(
        await signer.getAddress()
      )
      this.setZombies(zombies)
    } catch (e) {
      console.error('Home', e)
    }
  }
}
</script>