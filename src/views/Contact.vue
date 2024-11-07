<template>
    <div>
        <SectionHead />
        <div class="contacts__list container section">
            <a href="mailto:contact@asyou.me" class="contact">
                <span class="contact__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24">
                        <path
                            d="M19,4H5A3,3,0,0,0,2,7V17a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm-.41,2-5.88,5.88a1,1,0,0,1-1.42,0L5.41,6ZM20,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V7.41l5.88,5.88a3,3,0,0,0,4.24,0L20,7.41Z" />
                    </svg>
                </span>
                <span class="contact__text">contact@asyou.me</span>
            </a>

            <a href="https://twitter.com/Wetee_DAO" class="contact">
                <span class="contact__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24">
                        <path
                            d="M22.26465,2.42773a2.04837,2.04837,0,0,0-2.07813-.32421L2.26562,9.33887a2.043,2.043,0,0,0,.1045,3.81836l3.625,1.26074,2.0205,6.68164A.998.998,0,0,0,8.134,21.352c.00775.012.01868.02093.02692.03259a.98844.98844,0,0,0,.21143.21576c.02307.01758.04516.03406.06982.04968a.98592.98592,0,0,0,.31073.13611l.01184.001.00671.00287a1.02183,1.02183,0,0,0,.20215.02051c.00653,0,.01233-.00312.0188-.00324a.99255.99255,0,0,0,.30109-.05231c.02258-.00769.04193-.02056.06384-.02984a.9931.9931,0,0,0,.20429-.11456,250.75993,250.75993,0,0,1,.15222-.12818L12.416,18.499l4.03027,3.12207a2.02322,2.02322,0,0,0,1.24121.42676A2.05413,2.05413,0,0,0,19.69531,20.415L22.958,4.39844A2.02966,2.02966,0,0,0,22.26465,2.42773ZM9.37012,14.73633a.99357.99357,0,0,0-.27246.50586l-.30951,1.504-.78406-2.59307,4.06525-2.11695ZM17.67188,22.04l-4.7627-3.68945a1.00134,1.00134,0,0,0-1.35352.11914l-.86541.9552.30584-1.48645,7.083-7.083a.99975.99975,0,0,0-1.16894-1.59375L6.74487,12.55432,3.02051,11.19141,20.999,3.999Z" />
                    </svg>
                </span>
                <span class="contact__text">@WeTEE</span>
            </a>

            <!-- <a href="https://discord.gg/F6uPQAvj3q" class="contact">
                <span class="contact__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        data-v-inspector="src/components/Footer.vue:68:15" data-v-4896eafd="">
                        <path
                            d="M10.13831,10.62982h-.00013a1.05288,1.05288,0,1,0,.00013,0Zm3.75427,0a1.14582,1.14582,0,1,0,1.04907,1.14166A1.09586,1.09586,0,0,0,13.89258,10.62982Zm4.99878-8.6297H5.10864A2.11364,2.11364,0,0,0,3,4.119V18.02527A2.11368,2.11368,0,0,0,5.10864,20.1441H16.77258l-.54516-1.90289,1.31653,1.224,1.24462,1.152L21,22.57153V4.119A2.11364,2.11364,0,0,0,18.89136,2.00012ZM14.92114,15.43323v.00006s-.37036-.44232-.67895-.83319a3.2459,3.2459,0,0,0,1.86181-1.224,5.87837,5.87837,0,0,1-1.18286.60681,6.76974,6.76974,0,0,1-1.49145.44232,7.206,7.206,0,0,1-2.66394-.01025,8.64456,8.64456,0,0,1-1.51209-.44226,6.03735,6.03735,0,0,1-.75085-.34973c-.03089-.02063-.06165-.03089-.09253-.05146a.14171.14171,0,0,1-.04114-.03082c-.18506-.10284-.28809-.17487-.28809-.17487A3.19975,3.19975,0,0,0,9.8811,14.57953c-.30847.39093-.68908.8537-.68908.8537a3.72892,3.72892,0,0,1-3.13709-1.56342A13.775,13.775,0,0,1,7.536,7.87323a5.08641,5.08641,0,0,1,2.89026-1.08l.10278.12348A6.93762,6.93762,0,0,0,7.824,8.2641s.22632-.12341.60682-.29828a7.722,7.722,0,0,1,2.335-.64795,1.00465,1.00465,0,0,1,.17492-.02063,8.702,8.702,0,0,1,2.07764-.02051,8.384,8.384,0,0,1,3.096.98737,6.84576,6.84576,0,0,0-2.561-1.30628l.14392-.16449a5.08575,5.08575,0,0,1,2.89026,1.08,13.77368,13.77368,0,0,1,1.4812,5.99652A3.75972,3.75972,0,0,1,14.92114,15.43323Z"
                            data-v-inspector="src/components/Footer.vue:69:17" data-v-4896eafd=""></path>
                    </svg>
                </span>
                <span class="contact__text">@WeTEE</span>
            </a> -->
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import SectionHead from '@/components/SectionHead.vue';
import Footer from '@/components/Footer.vue';

</script>

<style lang="scss" scoped>
.contacts__list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 0;
    min-height: calc(100vh - 430px);
}

.contact {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: 40px;
    margin-top: 20px;
}

.contact__icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 14px;
    background-color: rgba(69, 69, 69, 0.12);
    position: relative;
    overflow: hidden;
    transition: 0.5s ease;
}

.contact__icon svg {
    width: 24px;
    height: 24px;
    fill: #50fa82;
    position: relative;
}

.contact__text {
    padding-left: 20px;
    color: #dedede;
    font-size: 18px;
    font-weight: 600;
    transition: color 0.5s ease;
}
</style>