<template>
  <div>
    <SectionHead />
    <div class="container section flex">
      <div class="flex flex-col items-center md:flex-row md:justify-center md:items-center w-full">
        <div class="flex-1 flex flex-col justify-center md:pr-20">
          <div class="top__title">Confidential computing, calculate trustworthy future</div>
          <div class="top__desc">Any web2 application can be directly deployed as a confidential container contract,
            and can interact with ink! and EVM smart contracts, bringing security and trust to households and
            factories everywhere.
          </div>
        </div>
        <div class="hidden icon md:block">
          <Lego/>
        </div>
      </div>
    </div>
    <div class="container section-first">
      <div>
        <div class="case case--first">
          <h3 class="case__title">Move to decentralized and confidential computing from cloud</h3>
          <p class="case__text">Fully inheriting the advantages of cloud computing while maintaining unparalleled levels
            of data security. By utilizing decentralized TEE solutions, it ensures the optimal security of data, making
            it impossible for anyone to obtain user privacy.
          </p>
        </div>
        <div class="case case--yellow">
          <h3 class="case__title">Multi-party computation (MPC)
          </h3>
          <p class="case__text">Confidential computing can make it simple to build MPC applications that use
            always-encrypted data, and using blockchain can provide an MPC solution that requires no trust in any third
            party.</p>
        </div>
        <div class="case case--nephrite">
          <h3 class="case__title">Use AI with always-encrypted data</h3>
          <p class="case__text">Using models similar to ChatGPT, while protecting your data from attacks by all parties
            at all times. By using confidential computing orchestrated by smart contracts, you can technically ensure
            that data is always encrypted.
          </p>
        </div>
        <div class="case case--yellow">
          <h3 class="case__title">Connecting enterprises to the blockchain
          </h3>
          <p class="case__text">Enterprise-grade Oracle infrastructure enables organizations to securely and easily
            connect their existing systems to all major blockchain networks.
          </p>

        </div>
        <div class="case case--nephrite">
          <h3 class="case__title">Convert WEB2 applications into smart contracts</h3>
          <p class="case__text">Migrate the current WEB2 software to WEB3 so that the application can seamlessly
            accommodate WEB3 users, and the software can possess decentralization and trustworthiness similar to smart
            contracts.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import SectionHead from '@/components/SectionHead.vue';
import Lego from '@/components/Lego.vue';
import Footer from '@/components/Footer.vue';

</script>

<style lang="scss" scoped>
.icon {
  width: 300px;
  height: 300px;
  transform:scale(1.5, 1.5);
  padding: 75px;
}

.chip-text {
  color: #abdeba;
  text-shadow: 0 2px 2px rgba(196, 196, 196, 0.87);
  font-size: 20px;
  text-align: center;
  font-family: "letter-font";
  font-weight: bold;
  margin-left: -10px;
}

.case {
  background-color: #2121215c;
  padding: 30px 20px;
  // border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;

  .arrow {
    position: absolute;
    height: 40px;
    width: 40px;
    right: 20px;
    top: calc(50% - 20px);
    font-family: "iconfont";
    font-size: 25px;
    line-height: 40px;
    text-align: center;
    color: #abdeba;
  }

  .case__title {
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

  .case__text {
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

.case--yellow .case__title::before {
  background-color: #e8d189;
}

.case--nephrite .case__title::before {
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
      color: $secondary-text;
      font-size: 20px;
      line-height: 26px;
      margin-bottom: 30px;
    }
  }
}
</style>