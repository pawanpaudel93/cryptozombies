<template>
  <v-app>
    <Header />
    <v-main>
      <v-container v-if="isChainSupported && isConnected">
        <Nuxt />
      </v-container>
      <v-container v-else-if="isChainSupported && !isConnected">
        <NotConnected />
      </v-container>
      <v-container v-else>
        <InvalidChain />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { provider } from '~/plugins/provider'
import Header from '@/components/Header.vue'
import NotConnected from '@/components/NotConnected.vue'
import InvalidChain from '@/components/InvalidChain.vue'
declare let window: any

const wallet = namespace('wallet')

@Component({
  components: {
    Header,
    NotConnected,
    InvalidChain,
  },
})
export default class Default extends Vue {
  @wallet.State
  public isConnected!: boolean

  @wallet.State
  public supportedChainIds!: number[]

  @wallet.State
  isChainSupported!: boolean

  @wallet.State
  public connectedAddress!: string

  @wallet.Mutation
  public setConnected!: (isConnected: boolean) => void

  @wallet.Mutation
  public setConnectedAddress!: (address: string) => void

  @wallet.Mutation
  public setChainSupported!: (supported: boolean) => void

  async mounted() {
    window.ethereum.on('accountsChanged', (account: string[]) => {
      if (account) {
        this.setConnectedAddress(account[0])
        // this.$nuxt.$emit('fetchBalance')
      } else {
        this.setConnectedAddress('')
        this.setConnected(false)
      }
    })

    window.ethereum.on('chainChanged', async (chainId: string) => {
      if (this.supportedChainIds.includes(parseInt(chainId, 16))) {
        try {
          const signer = this.connectedAddress
            ? await provider.getSigner(this.connectedAddress)
            : await provider.getSigner()
          this.setConnectedAddress(await signer.getAddress())
          this.setConnected(true)
        } catch (e) {
          this.setConnected(false)
        }
        this.setChainSupported(true)
      } else {
        this.setChainSupported(false)
        this.setConnected(false)
      }
      // this.$nuxt.$emit('fetchBalance')
    })

    try {
      const signer = this.connectedAddress
        ? await provider.getSigner(this.connectedAddress)
        : await provider.getSigner()
      const { chainId } = await provider.getNetwork()
      if (chainId && signer && this.supportedChainIds.includes(chainId)) {
        this.setConnectedAddress(await signer.getAddress())
        this.setConnected(true)
      } else {
        this.setChainSupported(false)
        this.setConnected(false)
      }
    } catch (e) {
      this.setConnected(false)
    }
  }
}
</script>

<style>
.v-application,
.v-toolbar__content,
.v-card {
  background: linear-gradient(
    135deg,
    hsl(227, 61%, 13%),
    hsl(227, 61%, 26%),
    hsl(227, 61%, 39%)
  ) !important;
}
</style>