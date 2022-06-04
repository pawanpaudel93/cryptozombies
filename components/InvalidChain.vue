<template>
  <v-card style="margin-top: 0">
    <v-alert outlined type="warning">
      <v-row align="center">
        <v-col class="grow">
          Invalid Chain. Please switch to Rinkeby Chain.
        </v-col>
        <v-col class="shrink">
          <v-btn color="blue" @click="switchChain">Switch Chain</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
declare let window: any
@Component
export default class InvalidChain extends Vue {
  switchChain() {
    try {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x4',
          },
        ],
      })
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
