<template>
  <v-container fluid>
    <div class="text-center">
      <h3 class="white--text">My Zombies</h3>
    </div>
    <v-row>
      <v-col
        v-for="(zombie, index) in zombies"
        :key="index"
        md="4"
        lg="3"
        sm="6"
      >
        <zombie-character :zombie="zombie"></zombie-character>
        <v-card>
          <div class="text-center">
            <nuxt-link :to="'/zombies/' + zombie.id">
              #{{ zombie.id }} {{ zombie.name }}</nuxt-link
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
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