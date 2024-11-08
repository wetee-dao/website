<template>
  <div>
    <SectionHead />
    <div class="container section flex">
      <div class="flex flex-col items-center md:flex-row md:justify-center md:items-center">
        <div class="flex-1">
          <div class="title">The world’s most secure and decentralized container deployment network</div>
          <div class="desc">All WEB2 applications, once deployed, possess the characteristics of smart contracts.</div>
          <div class="btns mt-10">
            <a target="_blank" href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fxiaobai.asyou.me%3A30001#/explorer"
              class="btn  btn--nephrite"><span>Build container</span>
            </a>
            <a target="_blank" href="https://dapp.wetee.app/" class="btn btn__primary "><span>Deploy container</span>
            </a>
          </div>
        </div>
        <div class="flex justify-center mt-10 md:mt-0">
          <Chip>
            <div class="p-3">
              <Shadow bg="#000">
                <img src="/imgs/dc.svg" alt="" />
              </Shadow>
            </div>
          </Chip>
        </div>
      </div>
    </div>
    <div class="container section-first">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-6">
        <div class="confidentials confidentials--first">
          <h3 class="confidentials__title">100% compatible with Docker</h3>
          <p class="confidentials__text">Can directly deploy using existing Docker images without needing to change any
            code.
          </p>
        </div>
        <div class="confidentials confidentials--yellow">
          <h3 class="confidentials__title">0-cost confidential computing</h3>
          <p class="confidentials__text">It completely shields the complexity of privacy-preserving computation.</p>
        </div>
        <div class="confidentials confidentials--nephrite">
          <h3 class="confidentials__title">Supports all main CPUs/GPUs</h3>
          <p class="confidentials__text">Supports SGX/TDX/SEV/CXX confidential computing chips and computing
            technologies.
          </p>
        </div>
        <div class="confidentials confidentials--yellow">
          <h3 class="confidentials__title">Fully cloud-native capabilities</h3>
          <p class="confidentials__text">Fully leveraging the mature technologies of cloud and the core advantages of
            meta-native.
          </p>
        </div>
        <div class="confidentials confidentials--nephrite">
          <h3 class="confidentials__title">Supports all main CPUs/GPUs</h3>
          <p class="confidentials__text">Supports SGX/TDX/SEV/CXX confidential computing chips and computing
            technologies.
          </p>
        </div>
        <div class="confidentials confidentials--first">
          <h3 class="confidentials__title">Devops</h3>
          <p class="confidentials__text">Provides DevOps, enabling developers to continuously integrate and deploy their
            programs.
          </p>
        </div>
      </div>
    </div>
    <div class="features section section--bt">
      <div class="container  ">
        <div class="box flex">
          <div class=" md:w-2/3 flex flex-col justify-center">
            <div class="title">Confidential container feature</div>
            <div class="feature">
              <div class="name">Non-tamperable</div>
              <div class="desc">Confidential containers are built based on blockchain technology. Once uploaded to the
                blockchain, they cannot be tampered with or forged, offering a high level of trustworthiness.</div>
            </div>
            <div class="feature">
              <div class="name">Contract account</div>
              <div class="desc">All deployed confidential containers have a unique contract account, allowing them to
                invoke and be invoked by smart contracts.</div>
            </div>
            <div class="feature">
              <div class="name">Transparent/Auditable</div>
              <div class="desc">Just like smart contracts, it can verify whether container images and code are
                consistent,
                ensuring the security and functionality of containers through rigorous auditing.</div>
            </div>
            <div class="feature">
              <div class="name">Private+Secure</div>
              <div class="desc">Hardware-level memory and data encryption ensures that no one can leak user privacy and
                data.</div>
            </div>
            <div class="feature">
              <div class="name">Decentralized</div>
              <div class="desc">The execution of confidential containers does not require the involvement of banks or
                third-party institutions, it is completely decentralized.</div>
            </div>
          </div>
          <div class="md:w-1/3 flex justify-center items-center p-20">
            <Shadow bg="#151616">
              <Container />
            </Shadow>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SectionHead from '@/components/SectionHead.vue';
import Shadow from '@/components/Shadow.vue';
import Chip from '@/components/Chip.vue';
import Footer from '@/components/Footer.vue';
import Container from '@/components/svg/Container.vue';

</script>

<style lang="scss" scoped>
.title {
  font-size: 45px;
  line-height: 1.1;
  font-weight: bold;
  margin-bottom: 10px;
}

.desc {
  font-size: 20px;
}

.confidentials {
  background-color: #2121215c;
  padding: 30px 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  overflow: hidden;

  .confidentials__title {
    font-size: 24px;
    color: #fff;
    font-weight: 600;
    position: relative;
    z-index: 3;
    padding-top: 19px;
    margin-bottom: 10px;

    &::before {
      content: '';
      position: absolute;
      display: block;
      width: 60px;
      height: 4px;
      border-radius: 4px;
      background-color: $primary-text;
      top: 0;
      left: 0;
      transition: 0.5s ease;
    }
  }

  .confidentials__text {
    position: relative;
    z-index: 3;
    font-size: 16px;
    line-height: 26px;
    color: #dedede;
    margin-bottom: 0;
    word-break: break-all;
  }
}

.confidentials--yellow .confidentials__title::before {
  background-color: #e8d189;
}

.confidentials--nephrite .confidentials__title::before {
  background-color: #5d5d5d;
}

.features {
  border: none;
  background-color: rgb(15, 15, 15);
  margin-top: 60px;

  .box {
    position: relative;
    background: #151616;
    padding: 30px;
    border-radius: 20px;
  }

  .title {
    color: #fff;
    margin-top: 40px;
    margin-bottom: 40px;
    font-size: 45px;
    font-weight: 600;
  }

  .feature {
    .name {
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #fff;
    }

    .desc {
      color: #dedede;
      font-size: 20px;
      line-height: 26px;
      margin-bottom: 30px;
    }
  }
}
</style>