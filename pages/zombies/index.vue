<template>
  <v-container fluid>
    <div class="text-center">
      <h3 class="white--text">My Crypto Zombies</h3>
    </div>
    <v-row v-if="zombies.length > 0">
      <v-col
        v-for="(zombie, index) in zombies"
        :key="index"
        md="4"
        lg="3"
        sm="6"
      >
        <zombie-character :zombie="zombie"></zombie-character>
        <v-card elevation="12">
          <div class="text-center">
            <nuxt-link :to="'/zombies/' + zombie.id">
              #{{ zombie.id }} {{ zombie.name }}</nuxt-link
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-alert v-else outlined type="info" color="primary" class="mt-6">
      You have 0 zombies.
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import ZombieCharacter from '~/components/ZombieCharacter.vue'
import { Zombie } from '~/interfaces/zombie'

const zombie = namespace('zombie')

@Component({
  components: {
    ZombieCharacter,
  },
})
export default class Home extends Vue {
  @zombie.State
  zombies!: Array<Zombie>
}
</script>
