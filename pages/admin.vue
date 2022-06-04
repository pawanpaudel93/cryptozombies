<template>
  <v-container class="mt-6" fluid>
    <v-card v-if="isAdmin" elevation="12">
      <v-card-title>Admin Settings</v-card-title>
      <v-card-text>
        <v-card-text>
          <v-row>
            <v-col lg="6">
              <v-form ref="kitty" @submit.prevent="updateKittyContractAddress">
                <v-text-field
                  v-model="kittyContractAddress"
                  label="New Kitty Contract Address"
                  :rules="[rules.required, rules.address]"
                ></v-text-field>
                <div class="text-center">
                  <v-btn
                    color="primary"
                    :loading="loading.kittyContractAddress"
                  >
                    Update
                  </v-btn>
                </div>
              </v-form>
            </v-col>
            <v-col lg="6">
              <v-form ref="level" @submit.prevent="updateLevelUpFee">
                <v-text-field
                  v-model="levelUpFee"
                  type="number"
                  label="New Level Up Fee"
                  :rules="[rules.required]"
                ></v-text-field>
                <div class="text-center">
                  <v-btn color="primary" :loading="loading.levelUpFee">
                    Update
                  </v-btn>
                </div>
              </v-form>
            </v-col>
          </v-row>
          <v-divider class="my-5"></v-divider>

          <div class="text-center">
            <v-btn
              :loading="loading.withdraw"
              color="primary"
              @click="withdraw"
            >
              Withdraw All Balance
            </v-btn>
          </div>
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, namespace, Ref } from 'nuxt-property-decorator'
import { Contract } from 'ethers'
import {
  getProvider,
  getCryptoZombiesContract,
  errorToast,
} from '~/plugins/utils'

const zombie = namespace('zombie')
const wallet = namespace('wallet')

@Component
export default class Home extends Vue {
  cryptoZombieContract!: Contract
  kittyContractAddress: string = ''
  levelUpFee: number = 0
  name: string = ''
  loading = {
    kittyContractAddress: false,
    levelUpFee: false,
    withdraw: false,
  }

  rules: any = {
    required: (v: string) => !!v || 'Required',
    address: (v: string) => /^(0x)?[0-9a-f]{40}$/i.test(v) || 'Invalid address',
  }

  @zombie.State
  contractAdmin!: string

  @wallet.State
  connectedAddress!: string

  @Ref('kitty')
  kittyForm!: HTMLFormElement

  @Ref('level')
  levelForm!: HTMLFormElement

  async updateKittyContractAddress() {
    if (!this.kittyForm.validate()) return
    this.loading.kittyContractAddress = true
    try {
      const updateTx = await this.cryptoZombieContract.setKittyContractAddress(
        this.kittyContractAddress
      )
      this.$toast.success('Kitty contract address updated')
      await updateTx.wait()
    } catch (e) {
      errorToast(e, "Couldn't update kitty contract address")
    }
    this.loading.kittyContractAddress = false
  }

  async updateLevelUpFee() {
    if (!this.levelForm.validate()) return
    this.loading.levelUpFee = true
    try {
      const updateTx = await this.cryptoZombieContract.setLevelUpFee(
        this.levelUpFee
      )
      await updateTx.wait()
      this.$toast.success('Level up fee updated')
    } catch (e) {
      errorToast(e, "Couldn't update level up fee")
    }
    this.loading.levelUpFee = false
  }

  async withdraw() {
    this.loading.withdraw = true
    try {
      const withdrawTx = await this.cryptoZombieContract.withdraw()
      await withdrawTx.wait()
      this.$toast.success('Withdraw completed')
    } catch (e) {
      errorToast(e, 'Withdraw failed')
    }
    this.loading.withdraw = false
  }

  get isAdmin() {
    return this.contractAdmin === this.connectedAddress
  }

  async mounted() {
    try {
      const signer = await getProvider(true).getSigner()
      this.cryptoZombieContract = getCryptoZombiesContract(signer)
    } catch (e) {
      console.error('Create Mounted', e)
    }
  }
}
</script>
