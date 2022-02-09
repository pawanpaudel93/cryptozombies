<template>
  <v-container>
    <div>
      <v-btn text to="/zombies"
        ><v-icon large>mdi-arrow-left-bold</v-icon></v-btn
      >
    </div>
    <div class="text-center">
      <h3>#{{ zombie.id }} {{ zombie.name }}</h3>
    </div>
    <v-row class="mb-5">
      <v-col cols="12" sm="6">
        <zombie-character :zombie="zombie"></zombie-character>
      </v-col>
      <v-col cols="12" sm="6">
        <div
          :style="
            $vuetify.breakpoint.smAndUp
              ? 'margin-top: 150px'
              : 'margin-top: 10px'
          "
          class="text-center"
        >
          <h4>Feed on Crypto Kitties</h4>
          <v-text-field
            v-model="kittyId"
            label="Kitty ID"
            :rules="[(v) => !!v || 'Kitty ID is required']"
          >
          </v-text-field>

          <v-btn
            color="blue"
            :loading="isLoading"
            :disabled="isLoading || !isReady"
            @click="feed"
            >{{ isReady ? 'Feed' : 'Not Ready to Feed' }}</v-btn
          >
        </div>

        <div class="text-center mt-6">
          <h4>Attack another Crypto Zombie</h4>
          <v-text-field
            v-model="zombieId"
            label="Zombie ID"
            :rules="[(v) => !!v || 'Zombie ID is required']"
          >
          </v-text-field>
          <v-btn
            color="blue"
            :loading="isLoading"
            :disabled="isLoading || !isReady"
            @click="attack"
            >{{ isReady ? 'Attack' : 'Not Ready to Attack' }}</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-card outlined shaped elevation="24" class="mt-3" align="center">
      <v-card-text>
        <v-row>
          <v-col cols="6">ID: </v-col>
          <v-col cols="6">{{ zombie.id }}</v-col>
          <v-col cols="6">Name: </v-col>
          <v-col cols="6">{{ zombie.name }}</v-col>
          <v-col cols="6">DNA: </v-col>
          <v-col cols="6">{{ zombie.dna }}</v-col>
          <v-col cols="6">Level: </v-col>
          <v-col cols="6">{{ zombie.level }}</v-col>
          <v-col cols="6">Win Count: </v-col>
          <v-col cols="6">{{ zombie.winCount }}</v-col>
          <v-col cols="6">Loss Count: </v-col>
          <v-col cols="6">{{ zombie.lossCount }}</v-col>
          <v-col cols="6">Ready Time: </v-col>
          <v-col cols="6">{{ new Date(zombie.readyTime * 1000) }}</v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" timeout="5000" color="success" outlined>
      {{ snackbarText }}

      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { BigNumber } from '@ethersproject/bignumber'
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
  kittyId: number = 0
  zombieId: number = 0
  isLoading: boolean = false
  snackbar: boolean = false
  snackbarText: string = ''
  cryptoZombieContract: Contract = getCryptoZombiesContract()
  zombie: Zombie = {
    id: BigNumber.from(-1),
    name: 'Zombie is not available with this ID',
    dna: BigNumber.from(0),
    level: 0,
    winCount: 0,
    lossCount: 0,
    readyTime: Date.now() / 1000,
  }

  @zombie.State
  zombies!: Zombie[]

  async feed() {
    try {
      this.isLoading = true
      const feedTx = await this.cryptoZombieContract.feedOnKitty(
        this.zombie.id,
        this.kittyId
      )
      feedTx.wait()
      this.snackbarText =
        "You've successfully fed on the Crypto Kitty #" + this.kittyId
    } catch (e) {
      this.snackbarText =
        "You've failed to feed on the Crypto Kitty #" + this.kittyId
      console.log('feed', e)
    }
    this.isLoading = false
  }

  async attack() {
    try {
      this.isLoading = true
      const feedTx = await this.cryptoZombieContract.attack(
        this.zombie.id,
        this.zombieId
      )
      feedTx.wait()
      this.snackbarText =
        "You've successfully attacked the Crypto Zombie #" + this.zombieId
    } catch (e) {
      this.snackbarText =
        "You've failed to attack the Crypto Zombie #" + this.zombieId
      console.log('feed', e)
    }
    this.isLoading = false
  }

  get isReady() {
    return this.zombie.readyTime < Date.now() / 1000
  }

  async mounted() {
    const signer = provider.getSigner()
    this.cryptoZombieContract = getCryptoZombiesContract(signer)
    const zombieIndex = this.zombies.findIndex(
      (zombie) => String(zombie.id) === this.$route.params.id
    )
    if (zombieIndex !== -1) {
      this.zombie = this.zombies[zombieIndex]
    } else {
      try {
        this.zombie = await this.cryptoZombieContract.zombies(
          this.$route.params.id
        )
      } catch (e) {
        console.log('Id', e)
      }
    }
  }
}
</script>