<template>
  <footer class="footer">
    <div class="container">
      <div class="flex">
        <div class="flex flex-col justify-center w-1/3 md:w-1/4">
          <div class="footer__logo">
            <img src="/imgs/TTE.svg" alt="">
          </div>
          <p class="footer__tagline pr-6">Trusted Trustless Computing Network</p>
        </div>
        <div class="flex-1 grid grid-cols-2 md:grid-cols-4 grid-flow-row gap-6">
          <div class="">
            <h6 class="footer__title">Open Gov</h6>
            <div class="footer__nav">
              <a href="/#economics">Tokenomics</a>
              <a href="/#roadmap">Roadmap</a>
            </div>
          </div>

          <div class="">
            <h6 class="footer__title">Docs</h6>
            <div class="footer__nav">
              <a target="_blank" href="https://wetee.gitbook.io/docment">Docs</a>
              <a target="_blank" href="https://github.com/wetee-dao">Github</a>
              <a href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpaseo.asyou.me%2Fws#/explorer">Explore</a>
            </div>
          </div>

          <div class="">
            <h6 class="footer__title">Use Cases</h6>
            <div class="footer__nav">
              <RouterLink to="/tee-store">TEE store</RouterLink>
            </div>
          </div>

          <div class="">
            <h6 class="footer__title">Support</h6>
            <div class="footer__nav">
              <a href="/contacts">Contacts</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer__content flex items-center">
      <div class="container">
        <div class="flex items-center">
          <small class="footer__copyright flex-1">© WeTEE DAO, 2025.</small>
          <div class="footer__social">
            <a href="https://twitter.com/Wetee_DAO" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z" />
              </svg>
            </a>

            <a href="https://t.me/wetee_bai" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M22.26465,2.42773a2.04837,2.04837,0,0,0-2.07813-.32421L2.26562,9.33887a2.043,2.043,0,0,0,.1045,3.81836l3.625,1.26074,2.0205,6.68164A.998.998,0,0,0,8.134,21.352c.00775.012.01868.02093.02692.03259a.98844.98844,0,0,0,.21143.21576c.02307.01758.04516.03406.06982.04968a.98592.98592,0,0,0,.31073.13611l.01184.001.00671.00287a1.02183,1.02183,0,0,0,.20215.02051c.00653,0,.01233-.00312.0188-.00324a.99255.99255,0,0,0,.30109-.05231c.02258-.00769.04193-.02056.06384-.02984a.9931.9931,0,0,0,.20429-.11456,250.75993,250.75993,0,0,1,.15222-.12818L12.416,18.499l4.03027,3.12207a2.02322,2.02322,0,0,0,1.24121.42676A2.05413,2.05413,0,0,0,19.69531,20.415L22.958,4.39844A2.02966,2.02966,0,0,0,22.26465,2.42773ZM9.37012,14.73633a.99357.99357,0,0,0-.27246.50586l-.30951,1.504-.78406-2.59307,4.06525-2.11695ZM17.67188,22.04l-4.7627-3.68945a1.00134,1.00134,0,0,0-1.35352.11914l-.86541.9552.30584-1.48645,7.083-7.083a.99975.99975,0,0,0-1.16894-1.59375L6.74487,12.55432,3.02051,11.19141,20.999,3.999Z" />
              </svg>
            </a>

            <!-- <a href="222222" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M10.13831,10.62982h-.00013a1.05288,1.05288,0,1,0,.00013,0Zm3.75427,0a1.14582,1.14582,0,1,0,1.04907,1.14166A1.09586,1.09586,0,0,0,13.89258,10.62982Zm4.99878-8.6297H5.10864A2.11364,2.11364,0,0,0,3,4.119V18.02527A2.11368,2.11368,0,0,0,5.10864,20.1441H16.77258l-.54516-1.90289,1.31653,1.224,1.24462,1.152L21,22.57153V4.119A2.11364,2.11364,0,0,0,18.89136,2.00012ZM14.92114,15.43323v.00006s-.37036-.44232-.67895-.83319a3.2459,3.2459,0,0,0,1.86181-1.224,5.87837,5.87837,0,0,1-1.18286.60681,6.76974,6.76974,0,0,1-1.49145.44232,7.206,7.206,0,0,1-2.66394-.01025,8.64456,8.64456,0,0,1-1.51209-.44226,6.03735,6.03735,0,0,1-.75085-.34973c-.03089-.02063-.06165-.03089-.09253-.05146a.14171.14171,0,0,1-.04114-.03082c-.18506-.10284-.28809-.17487-.28809-.17487A3.19975,3.19975,0,0,0,9.8811,14.57953c-.30847.39093-.68908.8537-.68908.8537a3.72892,3.72892,0,0,1-3.13709-1.56342A13.775,13.775,0,0,1,7.536,7.87323a5.08641,5.08641,0,0,1,2.89026-1.08l.10278.12348A6.93762,6.93762,0,0,0,7.824,8.2641s.22632-.12341.60682-.29828a7.722,7.722,0,0,1,2.335-.64795,1.00465,1.00465,0,0,1,.17492-.02063,8.702,8.702,0,0,1,2.07764-.02051,8.384,8.384,0,0,1,3.096.98737,6.84576,6.84576,0,0,0-2.561-1.30628l.14392-.16449a5.08575,5.08575,0,0,1,2.89026,1.08,13.77368,13.77368,0,0,1,1.4812,5.99652A3.75972,3.75972,0,0,1,14.92114,15.43323Z" />
              </svg>
            </a> -->
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: $primary-bg;
  padding-top: 30px;
}

.footer__logo {
  img {
    width: auto;
    height: 26px;
    display: block;
    filter: grayscale(100%);
  }
}

.footer__title {
  display: block;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 5px;
}

.footer__nav a {
  display: block;
  color: #b9b9b9;
}

.footer__tagline {
  margin-top: 8px;
  display: block;
  font-size: 14px;
  line-height: 18px;
  color: #b9b9b9;
  margin-bottom: 0;
  font-weight: bold;
  word-break: break-all;
}

.footer__content {
  margin-top: 50px;
  padding: 0;
  height: 80px;
  width: 100%;
  border-top: 1px solid rgba(158, 158, 158, 0.15);

  .footer__social {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;

    a {
      margin-left: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      position: relative;

      svg {
        width: 100%;
        height: auto;
        fill: $secondary-text;
        transition: fill 0.5s ease;
      }
    }
  }

  .footer__copyright {
    display: block;
    font-size: 20px;
    color: $secondary-text;
    font-weight: 400;
    font-family: "letter-font";
  }
}
</style>