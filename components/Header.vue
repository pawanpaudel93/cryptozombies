<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        <nuxt-link class="blue--text" to="/" tag="span" style="cursor: pointer">
          <b>{{ appTitle }}</b>
        </nuxt-link>
      </v-toolbar-title>

      <v-toolbar-items v-if="isConnected" class="hidden-sm-and-down ml-3">
        <v-btn to="/zombies" text>My Zombies</v-btn>
        <v-btn to="/create" text>Create a Random Zombie</v-btn>
        <v-btn v-if="isAdmin" to="/admin" text>Admin</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <div class="hidden-sm-and-down">
        <v-btn v-if="!isConnected" color="primary" @click="connect"
          >Sign In</v-btn
        >
        <v-btn v-if="isConnected" class="mr-2" color="warning" outlined>{{
          address
        }}</v-btn>
        <v-btn v-if="isConnected" color="red" @click="disconnect"
          >Sign Out</v-btn
        >
      </div>
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-app-bar-nav-icon
            class="hidden-md-and-up"
            v-bind="attrs"
            v-on="on"
          ></v-app-bar-nav-icon>
        </template>
        <v-list>
          <v-list-item v-if="isConnected">
            <v-list-item-title>
              <v-btn block class="my-2" text>{{ address }}</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isConnected">
            <v-list-item-title>
              <v-btn color="primary" to="/create" outlined block
                >Create a Random Zombie</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isConnected">
            <v-list-item-title>
              <v-btn
                v-if="isConnected"
                to="/zombies"
                color="success"
                outlined
                block
                >My Zombies</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isConnected && isAdmin">
            <v-list-item-title>
              <v-btn to="/admin" outlined block>Admin</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn
                v-if="!isConnected"
                color="primary"
                outlined
                block
                @click="connect"
                >Sign In</v-btn
              >
              <v-btn
                v-if="isConnected"
                color="red"
                outlined
                block
                @click="disconnect"
                >Sign Out</v-btn
              >
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <InvalidChain v-if="!isChainSupported && !isConnected" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import InvalidChain from './InvalidChain.vue'
import { getProvider, errorToast } from '~/plugins/utils'
const wallet = namespace('wallet')
const zombie = namespace('zombie')
declare let window: any

@Component({
  components: {
    InvalidChain,
  },
})
export default class Header extends Vue {
  appTitle: string = 'CryptoZombies'
  @wallet.State
  public isConnected!: boolean

  @wallet.State
  public isChainSupported!: boolean

  @wallet.State
  public supportedChainIds!: number[]

  @wallet.State
  public connectedAddress!: string

  @zombie.State
  contractAdmin!: string

  @wallet.Mutation
  public setConnected!: (isConnected: boolean) => void

  @wallet.Mutation
  public setConnectedAddress!: (address: string) => void

  async connect(): Promise<void> {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new TypeError('Please install Metamask.')
      }
      await window.ethereum.send('eth_requestAccounts', [])
      this.setConnectedAddress(await getProvider(true).getSigner().getAddress())
      this.setConnected(true)
      this.$nuxt.$emit('loadZombies')
      localStorage.setItem('isConnected', 'true')
    } catch (e) {
      this.$toast.error(errorToast(e, 'Please install Metamask.'))
    }
  }

  get address(): string {
    if (this.connectedAddress) {
      return (
        this.connectedAddress.slice(0, 6) +
        '...' +
        this.connectedAddress.slice(-4)
      )
    }
    return ''
  }

  get isAdmin() {
    return this.contractAdmin === this.connectedAddress
  }

  disconnect(): void {
    this.setConnected(false)
    localStorage.setItem('isConnected', 'false')
  }
}
</script>
