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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z" />
                    </svg>
                </span>
                <span class="contact__text">@WeTEE</span>
            </a>

            <a href="https://t.me/wetee_bai" class="contact">
                <span class="contact__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24">
                        <path
                            d="M22.26465,2.42773a2.04837,2.04837,0,0,0-2.07813-.32421L2.26562,9.33887a2.043,2.043,0,0,0,.1045,3.81836l3.625,1.26074,2.0205,6.68164A.998.998,0,0,0,8.134,21.352c.00775.012.01868.02093.02692.03259a.98844.98844,0,0,0,.21143.21576c.02307.01758.04516.03406.06982.04968a.98592.98592,0,0,0,.31073.13611l.01184.001.00671.00287a1.02183,1.02183,0,0,0,.20215.02051c.00653,0,.01233-.00312.0188-.00324a.99255.99255,0,0,0,.30109-.05231c.02258-.00769.04193-.02056.06384-.02984a.9931.9931,0,0,0,.20429-.11456,250.75993,250.75993,0,0,1,.15222-.12818L12.416,18.499l4.03027,3.12207a2.02322,2.02322,0,0,0,1.24121.42676A2.05413,2.05413,0,0,0,19.69531,20.415L22.958,4.39844A2.02966,2.02966,0,0,0,22.26465,2.42773ZM9.37012,14.73633a.99357.99357,0,0,0-.27246.50586l-.30951,1.504-.78406-2.59307,4.06525-2.11695ZM17.67188,22.04l-4.7627-3.68945a1.00134,1.00134,0,0,0-1.35352.11914l-.86541.9552.30584-1.48645,7.083-7.083a.99975.99975,0,0,0-1.16894-1.59375L6.74487,12.55432,3.02051,11.19141,20.999,3.999Z" />
                    </svg>
                </span>
                <span class="contact__text">@WeTEE BaiL</span>
            </a>

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
    padding-top: 30px;
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
    // border-radius: 14px;
    background-color: rgba(69, 69, 69, 0.3);
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
    padding-left: 10px;
    color: $secondary-text;
    font-size: 18px;
    font-weight: 600;
    transition: color 0.5s ease;
}
</style>