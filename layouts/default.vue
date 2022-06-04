<template>
  <v-app>
    <Header />
    <v-main>
      <v-container fluid class="px-10">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { BigNumber, Contract } from 'ethers'
import { getProvider, getCryptoZombiesContract } from '~/plugins/utils'
import Header from '@/components/Header.vue'
import { Zombie } from '~/interfaces/zombie'
declare let window: any

const wallet = namespace('wallet')
const zombie = namespace('zombie')

@Component({
  components: {
    Header,
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
      const owner = await getCryptoZombiesContract(getProvider()).owner()
      this.setContractAdmin(owner)
    } catch (e) {
      console.log(e)
    }
  }

  async startListeners() {
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      const provider = getProvider(true)
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        try {
          if (accounts.length > 0) {
            const provider = getProvider(true)
            await provider.send('eth_requestAccounts', [])
            this.setConnectedAddress(await provider.getSigner().getAddress())
            this.setConnected(true)
            this.loadZombies()
          } else {
            this.setConnected(false)
          }
        } catch (e) {
          console.error('Header', e)
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
      const cryptoZombieContract = getCryptoZombiesContract(provider)
      cryptoZombieContract.on(
        'Attacked',
        (attackerId, targetId, target, win, event) => {
          if (event.blockNumber <= startBlockNumber) return
          if (target === this.connectedAddress) {
            this.$toast.info(
              `You have been attacked by #${attackerId.toString()} and you ${
                win ? 'won' : 'lose'
              } the attack!`
            )

            if (win) {
              this.updateZombie({
                id: attackerId,
                data: { win: true },
              })
            } else {
              this.updateZombie({
                id: targetId,
                data: { loss: true },
              })
            }
          }
        }
      )
      cryptoZombieContract.on(
        'NewZombie',
        (creator, zombieId, name, dna, event) => {
          if (event.blockNumber <= startBlockNumber) return
          if (creator === this.connectedAddress) {
            this.$toast.info(
              `You have created a new zombie #${zombieId.toString()}!`
            )
            this.addZombie({
              id: zombieId,
              name,
              dna,
              level: BigNumber.from('0'),
              winCount: BigNumber.from('0'),
              lossCount: BigNumber.from('0'),
              readyTime: BigNumber.from(
                Math.floor(new Date().getTime() / 1000 + 86400).toString()
              ),
            })
            this.$router.push('/zombies')
          }
        }
      )
    }
  }

  async autoConnect() {
    if (localStorage.getItem('isConnected') === 'true') {
      try {
        const provider = getProvider(true)
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

  beforeDestroy() {
    this.$nuxt.$off('loadZombies')
    try {
      window.ethereum.removeAllListeners()
    } catch (e) {}
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
