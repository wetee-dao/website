<template>
  <section class="section section--first">
    <SectionHead />
    <!-- filter -->
    <!--div class="filter">
      <div class="container">
        <div class="row">
            <div class="col-12">
            <div class="filter__content">
                <form action="#" class="filter__search">
                <input type="text" placeholder="Search..." />
                <button type="button" aria-label="Search">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z" />
                    </svg>
                </button>
                </form>
                <div class="filter__wrap">
                <select class="filter__select" name="blockchain" id="filter__blockchain">
                    <option value="0">GPU + CPU application</option>
                    <option value="1">CPU application</option>
                    <option value="1">GPU application</option>
                </select>

                <select class="filter__select" name="devices" id="filter__devices">
                    <option value="0">All app type</option>
                    <option value="1">AI</option>
                    <option value="2">app</option>
                    <option value="3">Social</option>
                    <option value="4">Tools</option>
                </select>
                </div>
            </div>
            </div>
          </div>
        </div>
      </div-->
    <!-- end filter -->

    <!-- apps -->
    <div class="container" style="display: flex;flex-direction: row;">
      <div class="app_type">
        <div @click="goType(t.value)" :class="ctype == t.value ? 'active' : ''" v-for="t in types">{{ t.name }}</div>
      </div>
      <div class="grid grid-cols-4 gap-4 flex-1">
        <div v-for="app in apps">
          <div class="app">
            <div class="app__head">
              <div class="app__cover">
                <img style="border-radius: 10px;" :src="app.icon" alt="" />
              </div>

              <div class="app__title">
                <h3 class="app__name">
                  <a href="#">{{ app.name }}</a>
                </h3>
                <span class="app__blockchain">
                  Type: {{ app.type }}
                </span>
              </div>
            </div>

            <p class="app__description">
              {{ app.desc }}
            </p>

            <ul class="app__list">
              <li>Docker <span>
                  <a target="_blank" :href="'https://hub.docker.com/r/' + app.containers[0].image">
                    {{ app.containers[0].image.split(':')[0] }}
                  </a>
                </span>
              </li>
              <li>App Code <span class="required"><a target="_blank" :href="app.github">Link</a></span></li>
              <li>Home Page<span class="required"><a target="_blank" :href="app.home">Link</a></span></li>
              <li>Deploy Status <span class="process">Come soon</span></li>
            </ul>

            <a href="#" class="app__more">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- paginator -->
      <!-- <div class="row">
        <div class="col-12">
          <div class="paginator">
            <ul class="paginator__list-mobile"></ul>
            <ul class="paginator__list">
                  <li>
                      <a href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,11H9.41l3.3-3.29a1,1,0,1,0-1.42-1.42l-5,5a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H17a1,1,0,0,0,0-2Z"/></svg></a>
                  </li>
                  <li class="active"><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><span>...</span></li>
                  <li><a href="#">18</a></li>
                  <li><a href="#">19</a></li>
                  <li>
                      <a href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/></svg></a>
                  </li>
              </ul>
          </div>
        </div>
      </div> -->
      <!-- end paginator -->
    </div>
    <!-- end apps -->
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SectionHead from '@/components/SectionHead.vue';
const types = ref<any[]>([
  {
    name: "All applications",
    value: ""
  },
  {
    name: "AI / LLM apps",
    value: "AI"
  },
  {
    name: "Enterprise apps",
    value: "Tools"
  },
  {
    name: "Block chains",
    value: "Chain"
  },
  {
    name: "game servers",
    value: "app"
  },
  {
    name: "Social apps",
    value: "Social"
  },
  {
    name: "Languages",
    value: "Language Template"
  }
]);
const ctype = ref("");
const apps = ref<any[]>([]);

onMounted(() => {
  renderTemps("")
})

const goType = (e: string) => {
  renderTemps(e)
}

const renderTemps = (t: string) => {
  let data = t ? (window as any).extTemps().filter((v: any) => v.type == t) : (window as any).extTemps()
  ctype.value = t;
  apps.value = data;
}
</script>

<style lang="scss" scoped>
.app_type {
  min-width: 220px;
  border-right: 1px solid rgba(170, 114, 206, 0.12);
  margin-right: 20px;
  color: #fff;
  padding-top: 25px;
  padding-right: 10px;
  font-size: 17px;
}

#apps {
  width: calc(100% - 220px);
}

@media (max-width: 992px) {
  .app_type {
    display: none;
  }

  #apps {
    width: 100%;
  }
}

.app_type>div {
  margin: 5px 10px 5px 0px;
  padding: 8px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.app_type .active {
  background-color: #5555557d;
}

.app {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 20px;
  border-radius: 20px;
  background-color: #5555552e;
  padding: 20px;
  width: 100%;


  .app__head {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
  }

  .app__cover {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 70px;
    border-radius: 16px;
    overflow: hidden;
    padding: 5px;

    img {
      width: 100%;
      height: auto;
    }
  }

  .app__title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-left: 10px;
    height: 70px;

    .app__name {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      font-size: 19px;
      color: #fff;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .app__blockchain {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      font-size: 16px;
      color: #dedede;
      height: 20px;
      line-height: 20px;
    }
  }

  .app__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: 100%;
    font-size: 14px;
    line-height: 26px;
    color: #fff;
    margin-top: 20px;
    margin-bottom: 0;
    height: 52px;
  }

  .app__list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    margin: 0;
    margin-top: 5px;
    border-top: 1px solid rgba(170, 114, 206, 0.12);
    padding-top: 5px;

    li {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-size: 15px;
      line-height: 24px;
      color: #dedede;
      margin-bottom: 4px;
      width: 100%;

      span {
        color: #fff;
        margin-left: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

      }

      a {

        color: #007bff;
        text-decoration: none;
        background-color: transparent;

      }
    }
  }
}
</style>