<template>
  <client-only>
    <div v-images-loaded="zombieLoaded" class="zombie-char">
      <div class="zombie-preview mx-auto">
        <v-badge
          overlap
          bordered
          color="red"
          :content="'Level: ' + zombie.level"
        >
          <div
            v-show="!isZombieLoaded"
            class="zombie-loading zombie-loading-parts"
          ></div>

          <div
            v-show="isZombieLoaded"
            class="zombie-parts"
            :class="partsVisible"
          >
            <img
              v-show="!catMode"
              :style="clothesColor"
              class="left-feet"
              src="@/assets/images/zombieparts/left-feet-1@2x.png"
            />
            <img
              v-show="!catMode"
              :style="clothesColor"
              class="right-feet"
              src="@/assets/images/zombieparts/right-feet-1@2x.png"
            />

            <img
              v-show="!catMode"
              :style="clothesColor"
              class="left-leg"
              src="@/assets/images/zombieparts/left-leg-1@2x.png"
            />
            <img
              v-show="!catMode"
              :style="clothesColor"
              class="right-leg"
              src="@/assets/images/zombieparts/right-leg-1@2x.png"
            />

            <img
              v-show="!catMode"
              :style="clothesColor"
              class="left-thigh"
              src="@/assets/images/zombieparts/left-thigh-1@2x.png"
            />
            <img
              v-show="!catMode"
              :style="clothesColor"
              class="right-thigh"
              src="@/assets/images/zombieparts/right-thigh-1@2x.png"
            />

            <img
              :style="headColor"
              class="left-forearm"
              src="@/assets/images/zombieparts/left-forearm-1@2x.png"
            />
            <img
              :style="headColor"
              class="right-forearm"
              src="@/assets/images/zombieparts/right-forearm-1@2x.png"
            />

            <img
              :style="headColor"
              class="right-upper-arm"
              src="@/assets/images/zombieparts/right-upper-arm-1@2x.png"
            />

            <img
              :style="clothesColor"
              class="torso"
              src="@/assets/images/zombieparts/torso-1@2x.png"
            />

            <img
              v-show="catMode"
              :style="clothesColor"
              class="cat-legs"
              src="@/assets/images/zombieparts/catlegs.png"
            />
            <img :style="clothesColor" :class="shirtClass" :src="shirtSrc" />

            <img
              :style="headColor"
              class="left-upper-arm"
              src="@/assets/images/zombieparts/left-upper-arm-1@2x.png"
            />

            <img
              :style="headColor"
              class="left-forearm"
              src="@/assets/images/zombieparts/left-forearm-1@2x.png"
            />
            <img
              :style="headColor"
              class="right-forearm"
              src="@/assets/images/zombieparts/right-forearm-1@2x.png"
            />

            <img
              :style="headColor"
              class="left-hand"
              src="@/assets/images/zombieparts/hand1-1@2x.png"
            />
            <img
              :style="headColor"
              class="right-hand"
              src="@/assets/images/zombieparts/hand-2-1@2x.png"
            />

            <img :style="headColor" :class="headClass" :src="headSrc" />
            <img :style="eyeColor" :class="eyeClass" :src="eyeSrc" />
            <img
              class="mouth"
              src="@/assets/images/zombieparts/mouth-1@2x.png"
            />
          </div>
        </v-badge>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'nuxt-property-decorator'
import { Zombie } from '@/interfaces/zombie'

@Component({})
export default class ZombieCharacter extends Vue {
  isZombieLoaded: boolean = false

  @Prop({ required: true })
  zombie!: Zombie

  @Prop({ default: true })
  hideNameField!: boolean

  get catMode() {
    return this.currentDna.slice(-2) === '99'
  }

  get headSrc() {
    return require('@/assets/images/zombieparts/head-' +
      this.currentHeadChoice +
      '@2x.png')
  }

  get eyeSrc() {
    return require('@/assets/images/zombieparts/eyes-' +
      this.currentEyeChoice +
      '@2x.png')
  }

  get shirtSrc() {
    return require('@/assets/images/zombieparts/shirt-' +
      this.currentShirtChoice +
      '@2x.png')
  }

  get headClass() {
    return `head head-part-${this.currentHeadChoice}`
  }

  get eyeClass() {
    return `eye eye-part-${this.currentEyeChoice}`
  }

  get shirtClass() {
    return `shirt shirt-part-${this.currentShirtChoice}`
  }

  zombieLoaded() {
    setTimeout(() => {
      this.isZombieLoaded = true
    }, 1000)
  }

  getColor(deg: number) {
    return `filter: hue-rotate(${deg}deg);`
  }

  get currentDna(): string {
    let dnaStr = this.zombie.dna.toString()
    dnaStr = '0'.repeat(16 - dnaStr.length) + dnaStr
    return dnaStr
  }

  get currentHeadChoice(): number {
    return (parseInt(this.currentDna.substring(0, 2)) % 7) + 1
  }

  get currentEyeChoice(): number {
    return (parseInt(this.currentDna.substring(2, 4)) % 11) + 1
  }

  get currentShirtChoice(): number {
    return (parseInt(this.currentDna.substring(4, 6)) % 6) + 1
  }

  get currentSkinColorChoice(): number {
    return (parseInt(this.currentDna.substring(6, 8)) / 100) * 360
  }

  get currentEyeColorChoice(): number {
    return (parseInt(this.currentDna.substring(8, 10)) / 100) * 360
  }

  get currentClothesColorChoice(): number {
    return (parseInt(this.currentDna.substring(10, 12)) / 100) * 360
  }

  get headColor() {
    return this.getColor(this.currentSkinColorChoice)
  }

  get eyeColor() {
    return this.getColor(this.currentEyeColorChoice)
  }

  get clothesColor() {
    return this.getColor(this.currentClothesColorChoice)
  }

  get partsVisible() {
    const headVisible = `head-visible-${this.currentHeadChoice}`
    const eyeVisible = `eye-visible-${this.currentEyeChoice}`
    const shirtVisible = `shirt-visible-${this.currentShirtChoice}`

    return `${headVisible} ${eyeVisible} ${shirtVisible}`
  }
}
</script>

<style lang="scss" scoped>
.zombie-loading {
  background: url('@/assets/images/zombiebg/zombierun.png') left center;
  background-size: cover;
  height: 287px;
  width: 192px;
  position: absolute;
  left: 16vh;
  animation: play 0.7s steps(24) infinite;
}

@keyframes play {
  100% {
    background-position: -4608px;
  }
}

.zombie-parts-bin-component {
  background-image: url('@/assets/images/zombiebg/walls.jpg');
  background-size: cover;
}

.zombie-preview {
  height: 530px;
  width: 300px;
  position: relative;
  background-size: cover;
  background-image: url('~@/assets/images/zombiebg/tester-bg@2x.png');
}

.zombie-char {
  position: relative;
}

.share-page .zombie-parts {
  margin-left: 4vh;
}

.zombie-battle-component .zombie-parts {
  margin-left: -1vh;
}

.zombie-loading-parts {
  position: absolute;
  top: 180px;
  left: 80px;

  .head {
    width: 28vh;
    position: absolute;
    left: 13vh;
    top: -4vh;
  }

  .eye {
    width: 13vh;
    position: absolute;
    left: 23vh;
    top: 8vh;
  }

  .shirt {
    width: 13vh;
    position: absolute;
    left: 15.6vh;
    top: 13vh;
  }
}

.zombie-parts {
  position: absolute;
  top: 200px;
  left: -25px;

  .head {
    width: 28vh;
    position: absolute;
    left: 13vh;
    top: -4vh;
  }

  .eye {
    width: 13vh;
    position: absolute;
    left: 23vh;
    top: 8vh;
  }

  .shirt {
    width: 13vh;
    position: absolute;
    left: 15.6vh;
    top: 13vh;
  }
}

.mouth {
  width: 6vh;
  position: absolute;
  left: 26.6vh;
  top: 15vh;
}

.torso {
  width: 13vh;
  position: absolute;
  left: 15.6vh;
  top: 13vh;
}

.left-thigh {
  width: 6vh;
  position: absolute;
  left: 17.3vh;
  top: 22vh;
}

.right-thigh {
  width: 6vh;
  position: absolute;
  left: 20.4vh;
  top: 22vh;
}

.cat-legs {
  width: 10vh;
  position: absolute;
  left: 15.4vh;
  top: 18vh;
}

.left-hand {
  width: 4vh;
  position: absolute;
  left: 24.3vh;
  top: 19vh;
}

.right-hand {
  width: 4vh;
  position: absolute;
  left: 28.4vh;
  top: 19vh;
}

.left-forearm {
  width: 4vh;
  position: absolute;
  left: 22.3vh;
  top: 20vh;
}

.right-forearm {
  width: 4vh;
  position: absolute;
  left: 26.4vh;
  top: 20vh;
}

.left-upper-arm {
  width: 6vh;
  position: absolute;
  left: 19.3vh;
  top: 16vh;
}

.right-upper-arm {
  width: 6vh;
  position: absolute;
  left: 23.4vh;
  top: 16vh;
}

.left-leg {
  width: 4vh;
  position: absolute;
  left: 18.3vh;
  top: 27vh;
}

.right-leg {
  width: 3.3vh;
  position: absolute;
  left: 22.3vh;
  top: 27.6vh;
}

.left-feet {
  width: 4vh;
  position: absolute;
  left: 18.3vh;
  top: 30vh;
}

.right-feet {
  width: 3.3vh;
  position: absolute;
  left: 22.3vh;
  top: 30.3vh;
}

.zombie-name {
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
}

.zombie-details {
  position: absolute;
  bottom: 5%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  text-align: center;
  font-size: 24px;
  color: white;
  font-weight: bold;
}

.zombie-name {
  font-weight: bold;
}
</style>

<style>
.v-badge__badge {
  top: 100px !important;
  left: 30px !important;
  height: 25px !important;
  min-width: 25px !important;
  font-size: 16px !important;
}
</style>