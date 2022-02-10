<template>
  <v-app>
    <Header />
    <v-main>
      <v-container v-if="isChainSupported && isConnected" fluid class="px-10">
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
import { provider, getCryptoZombiesContract } from '~/plugins/provider'
import Header from '@/components/Header.vue'
import NotConnected from '@/components/NotConnected.vue'
import InvalidChain from '@/components/InvalidChain.vue'
import { Zombie } from '~/interfaces/zombie'
declare let window: any

const wallet = namespace('wallet')
const zombie = namespace('zombie')

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

  @zombie.Mutation
  setZombies!: (zombies: Array<Zombie>) => void

  async loadZombies() {
    try {
      const signer = await provider.getSigner()
      const cryptoZombieContract = getCryptoZombiesContract(signer)
      const zombies = await cryptoZombieContract.getZombiesByOwner(
        this.connectedAddress
      )
      this.setZombies(zombies)
    } catch (e) {
      this.setZombies([])
    }
  }

  startListeners() {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length > 0) {
        this.setConnectedAddress(accounts[0])
        this.setConnected(true)
        this.loadZombies()
      } else {
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
      this.loadZombies()
    })
  }

  async autoConnect() {
    try {
      const signer = this.connectedAddress
        ? await provider.getSigner(this.connectedAddress)
        : await provider.getSigner()
      const { chainId } = await provider.getNetwork()
      if (chainId && signer && this.supportedChainIds.includes(chainId)) {
        this.setConnectedAddress(await signer.getAddress())
        this.setConnected(true)
        this.loadZombies()
      } else {
        this.setChainSupported(false)
        this.setConnected(false)
      }
    } catch (e) {
      this.setConnected(false)
    }
  }

  mounted() {
    this.startListeners()
    this.autoConnect()

    this.$nuxt.$on('loadZombies', () => {
      this.loadZombies()
    })
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