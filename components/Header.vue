<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        <nuxt-link
          class="white--text"
          to="/"
          tag="span"
          style="cursor: pointer"
        >
          {{ appTitle }}
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="hidden-sm-and-down">
        <v-btn class="mr-2" color="primary" to="/create"
          >Create a Random Zombie</v-btn
        >

        <v-btn v-if="!isConnected" color="primary" @click="connect"
          >Connect</v-btn
        >
        <v-btn v-if="isConnected" class="mr-2" color="info">{{
          address
        }}</v-btn>
        <v-btn v-if="isConnected" color="warning" @click="disconnect"
          >Disconnect</v-btn
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
          <v-list-item>
            <v-list-item-title>
              <v-btn class="mr-2" color="primary" to="/create" outlined block
                >Create a Random Zombie</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isConnected">
            <v-list-item-title>
              <v-btn outlined block class="mr-2">{{ address }}</v-btn>
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
                >Connect</v-btn
              >
              <v-btn
                v-if="isConnected"
                color="warning"
                outlined
                block
                @click="disconnect"
                >Disconnect</v-btn
              >
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { provider } from '~/plugins/provider'

const wallet = namespace('wallet')

@Component
export default class Header extends Vue {
  appTitle: string = 'CryptoZombies'
  @wallet.State
  public isConnected!: boolean

  @wallet.State
  public supportedChainIds!: number[]

  @wallet.State
  public connectedAddress!: string

  @wallet.Mutation
  public setConnected!: (isConnected: boolean) => void

  @wallet.Mutation
  public setConnectedAddress!: (address: string) => void

  async connect(): Promise<void> {
    try {
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      this.setConnectedAddress(await signer.getAddress())
      this.setConnected(true)
      //   this.$nuxt.$emit('fetchBalance')
    } catch (e) {
      console.error('Header', e)
    }
  }

  get address(): string {
    if (this.connectedAddress) {
      const address =
        this.connectedAddress.slice(0, 4) +
        '...' +
        this.connectedAddress.slice(-3)
      return address
    }
    return ''
  }

  disconnect(): void {
    this.setConnected(false)
  }
}
</script>