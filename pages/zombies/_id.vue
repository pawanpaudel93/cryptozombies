<template>
  <v-container fluid>
    <v-btn text @click="$router.go(-1)">
      <v-icon large>mdi-arrow-left-bold</v-icon>
    </v-btn>
    <div class="text-center">
      <h3>#{{ zombie.id }} {{ zombie.name }}</h3>
    </div>
    <v-row class="mb-5">
      <v-col cols="12" md="4">
        <zombie-character :zombie="zombie"></zombie-character>
      </v-col>
      <v-col cols="12" md="8">
        <v-card
          shaped
          outlined
          elevation="24"
          :style="{ marginTop: $vuetify.breakpoint.mdAndUp ? '130px' : '' }"
          align="center"
        >
          <v-card-text>
            <v-row>
              <v-col cols="6" class="font-weight-medium">ID: </v-col>
              <v-col cols="6" class="font-weight-bold">{{
                zombie.id.toString()
              }}</v-col>
              <v-col cols="6" class="font-weight-medium">Name: </v-col>
              <v-col cols="6" class="font-weight-bold">{{ zombie.name }}</v-col>
              <v-col cols="6" class="font-weight-medium">DNA: </v-col>
              <v-col cols="6" class="font-weight-bold">{{
                zombie.dna.toString()
              }}</v-col>
              <v-col cols="6" class="font-weight-medium">Level: </v-col>
              <v-col cols="6" class="font-weight-bold">{{
                zombie.level.toString()
              }}</v-col>
              <v-col cols="6" class="font-weight-medium">Win Count: </v-col>
              <v-col cols="6" class="font-weight-bold">{{
                zombie.winCount.toString()
              }}</v-col>
              <v-col cols="6" class="font-weight-medium">Loss Count: </v-col>
              <v-col cols="6" class="font-weight-bold">{{
                zombie.lossCount.toString()
              }}</v-col>
              <v-col cols="6">Ready Time: </v-col>
              <v-col cols="6" class="font-weight-bold">{{
                formattedReadyTime
              }}</v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card v-if="isOwner">
      <v-card-title class="justify-center"> Zombie Settings </v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="4" cols="12" class="text-center px-12 py-6">
            <h4>Level up your Zombie Level</h4>
            <v-btn
              class="mt-3"
              color="blue"
              :loading="levelLoading"
              :disabled="levelLoading"
              @click="levelUp"
              >Level Up
            </v-btn>
          </v-col>
          <v-col md="4" cols="12" class="text-center px-12 py-6">
            <v-form ref="feed" @submit.prevent="feed">
              <h4>Feed on Crypto Kitties</h4>
              <v-text-field
                v-model="kittyId"
                label="Kitty ID"
                :rules="[(v) => !!v || 'Kitty ID is required']"
              >
              </v-text-field>

              <v-btn
                color="blue"
                :loading="feedLoading"
                :disabled="feedLoading || !isReady"
                type="submit"
                >{{ isReady ? 'Feed' : 'Not Ready to Feed' }}</v-btn
              >
            </v-form>
          </v-col>

          <v-col md="4" cols="12" class="text-center px-12 py-6">
            <v-form ref="attack" @submit.prevent="attack">
              <h4>Attack another Crypto Zombie</h4>
              <v-text-field
                v-model="zombieId"
                label="Zombie ID"
                :rules="[(v) => !!v || 'Zombie ID is required']"
              >
              </v-text-field>
              <v-btn
                color="blue"
                :loading="attackLoading"
                :disabled="attackLoading || !isReady"
                type="submit"
                >{{ isReady ? 'Attack' : 'Not Ready to Attack' }}</v-btn
              >
            </v-form>
          </v-col>
          <v-col md="6" cols="12" class="text-center px-12 py-6">
            <v-form ref="name" @submit.prevent="changeName">
              <h4>Change your Zombie Name</h4>
              <v-text-field
                v-model="name"
                label="New Zombie Name"
                :rules="[(v) => !!v || 'Zombie Name is required']"
              >
              </v-text-field>
              <v-btn
                color="blue"
                :loading="nameLoading"
                :disabled="nameLoading || zombie.level < 2"
                type="submit"
                >{{
                  zombie.level >= 2 ? 'Change' : 'Level must be >= 2'
                }}</v-btn
              >
            </v-form>
          </v-col>
          <v-col md="6" cols="12" class="text-center px-12 py-6">
            <v-form ref="dna" @submit.prevent="changeDNA">
              <h4>Change your Zombie DNA</h4>
              <v-text-field
                v-model="dna"
                maxlength="16"
                minlength="16"
                label="New Zombie DNA"
                :rules="[
                  (v) => !!v || 'Zombie DNA is required',
                  (v) =>
                    (!!v && v.length === 16) || 'Zombie DNA must be 16 numbers',
                  (v) =>
                    (!!v && /^[0-9]+$/.test(v)) || 'Zombie DNA must be numbers',
                ]"
              >
              </v-text-field>
              <v-btn
                color="blue"
                :loading="dnaLoading"
                :disabled="dnaLoading || zombie.level < 20"
                type="submit"
                >{{
                  zombie.level >= 20 ? 'Change' : 'Level must be >= 20'
                }}</v-btn
              >
            </v-form>
          </v-col>
        </v-row>
        <v-container :fluid="!$vuetify.breakpoint.mdAndUp">
          <div class="text-center mt-3">
            <v-alert color="primary" dense outlined>
              <span class="white--text">Zombie Transfer</span>
            </v-alert>
          </div>
          <v-form ref="transfer">
            <v-text-field
              v-model="transferAddress"
              label="Transfer Address"
              :rules="[
                (v) => !!v || 'Transfer Address is required',
                (v) =>
                  /^0x[0-9a-fA-F]{40}$/.test(v) ||
                  'Transfer Address must be a valid Ethereum address',
              ]"
            >
            </v-text-field>
            <div class="text-center">
              <v-btn
                color="blue"
                :loading="transferLoading"
                :disabled="transferLoading"
                @click="transfer"
                >Transfer
              </v-btn>
            </div>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { BigNumber, Contract } from 'ethers'
import { Vue, Component, Ref, namespace } from 'nuxt-property-decorator'
import { getProvider, getCryptoZombiesContract } from '~/plugins/utils'
import ZombieCharacter from '~/components/ZombieCharacter.vue'
import { Zombie } from '~/interfaces/zombie'

const zombie = namespace('zombie')
const wallet = namespace('wallet')

@Component({
  components: {
    ZombieCharacter,
  },
})
export default class Home extends Vue {
  feedLoading: boolean = false
  attackLoading: boolean = false
  nameLoading: boolean = false
  dnaLoading: boolean = false
  levelLoading: boolean = false
  transferLoading: boolean = false

  kittyId: number = 0
  zombieId: number = 0
  name: string = ''
  dna: string = ''
  isOwner: boolean = false
  transferAddress: string = ''
  cryptoZombieContract!: Contract
  zombie: Zombie = {
    id: BigNumber.from('-1'),
    name: 'Zombie is not available with this ID',
    dna: BigNumber.from('0'),
    level: BigNumber.from('0'),
    winCount: BigNumber.from('0'),
    lossCount: BigNumber.from('0'),
    readyTime: BigNumber.from('0'),
  }

  @Ref('feed')
  feedForm!: HTMLFormElement

  @Ref('attack')
  attackForm!: HTMLFormElement

  @Ref('name')
  nameForm!: HTMLFormElement

  @Ref('dna')
  dnaForm!: HTMLFormElement

  @Ref('transfer')
  transferForm!: HTMLFormElement

  @wallet.State
  isConnected!: boolean

  @wallet.State
  connectedAddress!: string

  @zombie.State
  zombies!: Array<Zombie>

  @zombie.State
  levelUpFee!: number

  @zombie.Mutation
  updateZombie!: (update: { id: BigNumber; data: object }) => void

  @zombie.Mutation
  removeZombie!: (id: BigNumber) => void

  @zombie.Mutation
  addZombie!: (zombie: Zombie) => void

  async feed() {
    if (!this.feedForm.validate()) return
    try {
      this.feedLoading = true
      const feedTx = await this.cryptoZombieContract.feedOnKitty(
        this.zombie.id,
        this.kittyId
      )
      await feedTx.wait()
      this.$toast.success(
        "You've successfully fed on the Crypto Kitty #" + this.kittyId
      )
      this.feedForm.reset()
    } catch (e) {
      this.$toast.error(
        "You've failed to feed on the Crypto Kitty #" + this.kittyId
      )
    }
    this.feedLoading = false
  }

  async attack() {
    if (!this.attackForm.validate()) return
    try {
      this.attackLoading = true
      const attackTx = await this.cryptoZombieContract.attack(
        this.zombie.id,
        this.zombieId
      )
      await attackTx.wait()
      this.updateZombie({
        id: this.zombie.id,
        data: {
          readyTime: parseInt((Date.now() / 1000 + 86400).toString()),
        },
      })
      this.$toast.success(
        "You've successfully attacked the Zombie #" + this.zombieId
      )
      this.attackForm.reset()
    } catch (e) {
      this.$toast.error(
        "You've failed to attack the Crypto Zombie #" + this.zombieId
      )
    }
    this.attackLoading = false
  }

  async changeName() {
    if (!this.nameForm.validate()) return
    try {
      this.nameLoading = true
      const nameTx = await this.cryptoZombieContract.changeName(
        this.zombie.id,
        this.name
      )
      await nameTx.wait()
      this.updateZombie({
        id: this.zombie.id,
        data: { name: this.name },
      })
      this.zombie.name = this.name
      this.nameForm.reset()
      this.$toast.success(
        "You've successfully changed the name of the Crypto Zombie #" +
          this.zombie.id
      )
    } catch (e) {
      this.$toast.error(
        "You've failed to change the name of the Crypto Zombie #" +
          this.zombie.id
      )
    }
    this.nameLoading = false
  }

  async changeDNA() {
    if (!this.dnaForm.validate()) return
    try {
      this.dnaLoading = true
      const nameTx = await this.cryptoZombieContract.changeDna(
        this.zombie.id,
        this.dna
      )
      await nameTx.wait()
      this.updateZombie({
        id: this.zombie.id,
        data: { dna: BigNumber.from(this.dna) },
      })
      this.zombie.dna = BigNumber.from(this.dna)
      this.dna = ''
      this.dnaForm.reset()
      this.$toast.success(
        "You've successfully changed the DNA of the Crypto Zombie #" +
          this.zombie.id
      )
    } catch (e) {
      this.$toast.error(
        "You've failed to change the DNA of the Crypto Zombie #" +
          this.zombie.id
      )
    }
    this.dnaLoading = false
  }

  async levelUp() {
    try {
      this.levelLoading = true
      const levelUpTx = await this.cryptoZombieContract.levelUp(
        this.zombie.id,
        {
          value: this.levelUpFee,
        }
      )
      await levelUpTx.wait()
      this.updateZombie({
        id: this.zombie.id,
        data: { level: this.zombie.level.add(1) },
      })
      this.zombie.level = this.zombie.level.add(1)
      this.$toast.success(
        "You've successfully leveled up the Crypto Zombie #" + this.zombieId
      )
    } catch (e) {
      this.$toast.error(
        "You've failed to level up the Crypto Zombie #" + this.zombieId
      )
      console.log(e)
    }
    this.levelLoading = false
  }

  async transfer() {
    if (!this.transferForm.validate()) return
    try {
      this.transferLoading = true
      const transferTx = await this.cryptoZombieContract.transferFrom(
        this.connectedAddress,
        this.transferAddress,
        this.zombie.id
      )
      await transferTx.wait()
      this.transferForm.reset()
      this.isOwner = false
      this.removeZombie(this.zombie.id)
      this.$toast.success(
        "You've successfully transferred the Crypto Zombie #" + this.zombieId
      )
    } catch (e) {
      this.$toast.error(
        "You've failed to transfer the Crypto Zombie #" + this.zombieId
      )
    }
    this.transferLoading = false
  }

  get isReady() {
    return this.zombie.readyTime.toNumber() < new Date().getTime() / 1000
  }

  get formattedReadyTime() {
    return new Date(this.zombie.readyTime.toNumber() * 1000).toLocaleString()
  }

  async fetchZombie() {
    try {
      const zombie = await this.cryptoZombieContract.zombies(
        this.$route.params.id
      )
      this.zombie = {
        id: zombie.id,
        name: zombie.name,
        dna: zombie.dna,
        level: zombie.level,
        winCount: zombie.winCount,
        lossCount: zombie.lossCount,
        readyTime: zombie.readyTime,
      }
    } catch (e) {
      console.log(e)
    }
  }

  async mounted() {
    try {
      this.cryptoZombieContract = getCryptoZombiesContract(
        getProvider(true).getSigner()
      )
      const zombieIndex = this.zombies.findIndex(
        (zombie) => String(zombie.id) === this.$route.params.id
      )
      if (zombieIndex !== -1) {
        this.isOwner = true
        this.zombie = { ...this.zombies[zombieIndex] }
      } else {
        this.isOwner =
          (await this.cryptoZombieContract.ownerOf(this.$route.params.id)) ===
          this.connectedAddress
        await this.fetchZombie()
      }
    } catch (e) {
      this.cryptoZombieContract = getCryptoZombiesContract(getProvider(true))
      await this.fetchZombie()
    }
  }
}
</script>
