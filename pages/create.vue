<template>
  <v-container fluid class="mt-5">
    <v-card>
      <v-card-title> Create a Random Zombie </v-card-title>
      <v-card-text v-if="zombiesCount == 0">
        <v-form ref="form" @submit.prevent="create">
          <v-text-field
            v-model="name"
            label="Zombie Name"
            :rules="[(v) => !!v || 'Name is required']"
          ></v-text-field>
          <div class="text-center">
            <v-btn
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="loading"
              >Create</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
      <v-card-text v-else>
        <v-alert type="warning" outlined dense>
          You already have a zombie.
        </v-alert>
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
import { Vue, Component, Ref, namespace } from 'nuxt-property-decorator'
import { Contract } from 'ethers'
import { provider, getCryptoZombiesContract } from '~/plugins/provider'
import { Zombie } from '~/interfaces/zombie'

const zombie = namespace('zombie')

@Component
export default class Home extends Vue {
  cryptoZombieContract: Contract = getCryptoZombiesContract()
  name: string = ''
  loading: boolean = false
  snackbar: boolean = false
  snackbarText: string = ''
  zombiesCount: number = 0

  @Ref('form') readonly form!: HTMLFormElement

  @zombie.Mutation
  public addZombie!: (zombie: Zombie) => void

  async create() {
    if (!this.form.validate()) return
    this.loading = true
    try {
      const tx = await this.cryptoZombieContract.createRandomZombie(this.name)
      const receipt = await tx.wait()
      this.snackbarText = `Congratulations. Zombie ${this.name} is created.`
      const events = receipt.events
      if (events.length > 0) {
        const event = events[0]
        if (event.event === 'NewZombie') {
          this.addZombie({
            id: event.args.zombieId,
            name: event.args.name,
            dna: event.args.dna,
            level: 0,
            winCount: 0,
            lossCount: 0,
            readyTime: Date.now() / 1000 + 86400,
          })
        }
      }
      this.$router.push('/zombies')
    } catch (e) {
      console.error('Create', e)
      this.snackbarText = `Failed to create zombie ${this.name}.`
    }
    this.loading = false
    this.snackbar = true
  }

  async mounted() {
    try {
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      this.cryptoZombieContract = getCryptoZombiesContract(signer)
      this.zombiesCount = parseInt(
        await this.cryptoZombieContract.ownerZombieCount(address)
      )
    } catch (e) {
      console.error('Create Mounted', e)
    }
  }
}
</script>