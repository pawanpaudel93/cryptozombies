<template>
  <v-container class="mt-5">
    <v-card>
      <v-card-title> Create a Random Zombie </v-card-title>
      <v-card-text v-if="zombiesCount === 0">
        <v-text-field
          v-model="name"
          label="Zombie Name"
          :rules="[rules.required]"
        ></v-text-field>
        <div class="text-center">
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="create"
            >Create</v-btn
          >
        </div>
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
import { Vue, Component } from 'nuxt-property-decorator'
import { Contract } from 'ethers'
import { provider, getCryptoZombiesContract } from '~/plugins/provider'

@Component({
  components: {},
})
export default class Home extends Vue {
  cryptoZombieContract: Contract = getCryptoZombiesContract()
  name: string = ''
  loading: boolean = false
  snackbar: boolean = false
  snackbarText: string = ''
  zombiesCount: number = 0
  rules: any = {
    required: (v: string) => !!v || 'Required',
  }

  async create() {
    this.loading = true
    try {
      const tx = await this.cryptoZombieContract.createRandomZombie(this.name)
      await tx.wait()
      this.snackbarText = `Congratulations. Zombie ${this.name} is created.`
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