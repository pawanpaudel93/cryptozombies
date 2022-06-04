<template>
  <v-container class="mt-5">
    <v-card elevation="12">
      <v-card-title> Create a Random Zombie </v-card-title>
      <v-card-text v-if="!zombieRequested">
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
          You have already created a zombie. If you want to own more zombies,
          you can feed on CryptoKitties to create new mixed zombies, attack
          other zombies to create new zombies by winning or buying zombies with
          others.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Ref, namespace } from 'nuxt-property-decorator'
import { Contract, Signer } from 'ethers'
import { getProvider, getCryptoZombiesContract } from '~/plugins/utils'
import { Zombie } from '~/interfaces/zombie'

const zombie = namespace('zombie')

@Component
export default class Home extends Vue {
  cryptoZombieContract!: Contract
  name: string = ''
  loading: boolean = false
  zombieRequested = true

  @Ref('form') readonly form!: HTMLFormElement

  @zombie.State
  zombies!: Zombie[]

  async create() {
    if (!this.form.validate()) return
    this.loading = true
    try {
      const tx = await this.cryptoZombieContract.createRandomZombie(this.name)
      await tx.wait()
      this.$toast.success(
        `Congratulations. Zombie ${this.name} will be ready in a few minutes.`
      )
    } catch (e) {
      console.error('Create', e)
      this.$toast.error(`Failed to create zombie ${this.name}.`)
    }
    this.loading = false
  }

  async randomZombieRequested(signer: Signer) {
    try {
      this.zombieRequested =
        await this.cryptoZombieContract.randomZombieRequested(
          await signer.getAddress()
        )
    } catch (e) {
      console.error('RandomZombieRequested', e)
    }
  }

  async mounted() {
    try {
      const signer = await getProvider(true).getSigner()
      this.cryptoZombieContract = getCryptoZombiesContract(signer)
      await this.randomZombieRequested(signer)
    } catch (e) {
      console.error('Create Mounted', e)
    }
  }
}
</script>
