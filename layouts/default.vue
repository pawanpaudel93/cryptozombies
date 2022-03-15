<template>
  <v-app>
    <Header />
    <v-main>
      <v-container v-if="$route.name === 'index'" fluid class="px-10">
        <Nuxt />
      </v-container>
      <v-container
        v-else-if="isChainSupported && isConnected"
        fluid
        class="px-10"
      >
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
import { Contract } from 'ethers'
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
  cryptoZombieContract!: Contract

  @wallet.State
  public isConnected!: boolean

  @wallet.State
  public supportedChainIds!: number[]

  @wallet.State
  isChainSupported!: boolean

  @wallet.State
  public connectedAddress!: string

  @wallet.State
  zombies!: Zombie[]

  @zombie.Mutation
  public setLevelUpFee!: (fee: number) => void

  @wallet.Mutation
  public setConnected!: (isConnected: boolean) => void

  @wallet.Mutation
  public setConnectedAddress!: (address: string) => void

  @wallet.Mutation
  public setChainSupported!: (supported: boolean) => void

  @zombie.Mutation
  setZombies!: (zombies: Array<Zombie>) => void

  @zombie.Mutation
  setContractAdmin!: (admin: string) => void

  @zombie.Mutation
  public addZombie!: (zombie: Zombie) => void

  @zombie.Mutation
  updateZombie!: (update: { id: number; data: object }) => void

  async loadZombies() {
    try {
      const zombies = await this.cryptoZombieContract.getZombiesByOwner(
        this.connectedAddress
      )
      this.setZombies(zombies)
    } catch (e) {
      this.setZombies([])
    }
  }

  async fetchLevelUpFee() {
    try {
      const fee = await this.cryptoZombieContract.levelUpFee()
      this.setLevelUpFee(parseInt(fee))
    } catch (e) {}
  }

  async fetchContractOwner() {
    try {
      const owner = await getCryptoZombiesContract(provider).owner()
      this.setContractAdmin(owner)
    } catch (e) {
      console.log(e)
    }
  }

  async startListeners() {
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

    const startBlockNumber = await provider.getBlockNumber()
    this.cryptoZombieContract.on(
      'Attacked',
      (attackerId, targetId, target, win, event) => {
        if (event.blockNumber <= startBlockNumber) return
        if (target === this.connectedAddress) {
          this.$toast.info(
            `You have been attacked by #${attackerId} and you ${
              win ? 'won' : 'lose'
            } the attack!`
          )

          if (win) {
            this.updateZombie({
              id: attackerId,
              data: { winCount: true },
            })
          } else {
            this.updateZombie({
              id: targetId,
              data: { lossCount: true },
            })
          }
        }
      }
    )
    this.cryptoZombieContract.on(
      'NewZombie',
      (creator, zombieId, name, dna, event) => {
        if (event.blockNumber <= startBlockNumber) return
        if (creator === this.connectedAddress) {
          this.$toast.info(`You have created a new zombie #${zombieId}!`)
          this.addZombie({
            id: zombieId,
            name,
            dna,
            level: 0,
            winCount: 0,
            lossCount: 0,
            readyTime: parseInt((Date.now() / 1000 + 86400).toString()),
          })
          this.$router.push('/zombies')
        }
      }
    )
  }

  async autoConnect() {
    try {
      const signer = this.connectedAddress
        ? await provider.getSigner(this.connectedAddress)
        : await provider.getSigner()
      this.cryptoZombieContract = getCryptoZombiesContract(signer)
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
    this.autoConnect()
    this.startListeners()
    this.fetchLevelUpFee()
    this.fetchContractOwner()

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