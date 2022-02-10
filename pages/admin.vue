<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Admin Settings</v-card-title>
      <v-card-text>
        <v-card-text>
          <v-row>
            <v-col lg="6">
              <v-text-field
                v-model="kittyContractAddress"
                label="New Kitty Contract Address"
                :rules="[rules.required, rules.address]"
              ></v-text-field>
              <div class="text-center">
                <v-btn color="primary" @click="updateKittyContractAddress">
                  Update
                </v-btn>
              </div>
            </v-col>
            <v-col lg="6">
              <v-text-field
                v-model="levelUpFee"
                type="number"
                label="New Level Up Fee"
                :rules="[rules.required]"
              ></v-text-field>
              <div class="text-center">
                <v-btn color="primary" @click="updateLevelUpFee">
                  Update
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-5"></v-divider>
          <div class="text-center">
            <v-btn color="primary" @click="withdraw">
              Withdraw All Balance
            </v-btn>
          </div>
        </v-card-text>
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
  cryptoZombieContract?: Contract
  kittyContractAddress: string = ''
  levelUpFee: number = 0
  name: string = ''
  loading: boolean = false
  snackbar: boolean = false
  snackbarText: string = ''
  rules: any = {
    required: (v: string) => !!v || 'Required',
    address: (v: string) => /^(0x)?[0-9a-f]{40}$/i.test(v) || 'Invalid address',
  }

  updateKittyContractAddress() {}

  updateLevelUpFee() {}

  withdraw() {}

  async mounted() {
    try {
      const signer = await provider.getSigner()
      this.cryptoZombieContract = getCryptoZombiesContract(signer)
    } catch (e) {
      console.error('Create Mounted', e)
    }
  }
}
</script>