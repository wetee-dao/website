<template>
  <div class="gradient-body">
    <SectionHead />
    <div class="container section flex">
      <div class="flex flex-col items-center md:flex-row md:justify-center md:items-center w-full">
        <div class="flex-1 md:pr-20">
          <div class="top__title">Channel between WEB3 smart contracts and WEB2 applications</div>
          <div class="top__text">Smart contracts and TEE applications can invoke each other</div>
          <div class="btns mt-10">
            <a href="javascript:void(0)" class="btn btn__primary "><span>Deploy</span></a>
          </div>
        </div>
        <div class="hidden icon md:block">
          <Trans/>
        </div>
      </div>
    </div>
    <div class="container section-first">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-6">
        <div class="confidentials confidentials--first">
          <h3 class="confidentials__title">Enterprise oracle</h3>
          <p class="confidentials__text">Decentralized node clusters and TEE ensure Oracle efficiency and security.
          </p>
        </div>
        <div class="confidentials confidentials--yellow">
          <h3 class="confidentials__title">WEB2 proxy contract</h3>
          <p class="confidentials__text">Smart contracts directly invoke WEB2 application APIs through proxy contract.</p>
        </div>
        <div class="confidentials confidentials--nephrite">
          <h3 class="confidentials__title">Simple usage</h3>
          <p class="confidentials__text">No need for extra TOKEN, you can call it using the chain's native token.
          </p>
        </div>
      </div>
    </div>
    <div class="features section section--bt">
      <!-- <div class="container  ">
        <div class="box flex">
          <div class=" md:w-2/3 flex flex-col justify-center">
            <div class="title">Contract-like confidential container</div>
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
      </div> -->
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import SectionHead from '@/components/SectionHead.vue';
import Trans from '@/components/anim/Trans.vue';
import Footer from '@/components/Footer.vue';

</script>

<style lang="scss" scoped>
.icon {
  width: 200px;
  height: 200px;
}

.confidentials {
  background-color: #2121215c;
  padding: 30px 20px;
  // border-radius: 20px;
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
    color: $secondary-text;
    ;
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
    // border-radius: 20px;
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
      color: $secondary-text;
      font-size: 20px;
      line-height: 26px;
      margin-bottom: 30px;
    }
  }
}
</style>