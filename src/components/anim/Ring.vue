<template>
    <div class="pulse">
        <div class="pring"></div>
        <div class="pring"></div>
        <div class="pring"></div>
        <div class="pring"></div>
        <div class="iconfont">
            &#xe62b;
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pulse {
    background-color: rgba( $primary-text-rgb, 0.3) ;
    height: 130px;
    width: 130px;
    border-radius: 100%;
    position: relative;
    margin: 25px;

    .iconfont {
        position: absolute;
        font-size: 50px;
        line-height: 50px;
        color: #fff;
        text-align: center;
        width: 50px;
        height: 50px;
        top: calc(50% - 25px);
        left: calc(50% - 25px);
    }
}

.pring {
    position: absolute;
    background-color: inherit;
    height: 100%;
    width: 100%;
    border-radius: 100%;
    opacity: .8;
    -webkit-animation: pulsing 3s ease-out infinite;
    animation: pulsing 3s ease-out infinite
}

.pring:nth-of-type(1) {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s
}

.pring:nth-of-type(2) {
    -webkit-animation-delay: -1s;
    animation-delay: -1s
}

.pring:nth-of-type(3) {
    -webkit-animation-delay: -1.5s;
    animation-delay: -1.5s
}

@-webkit-keyframes pulsing {
    100% {
        transform: scale(1.75);
        opacity: 0
    }
}

@keyframes pulsing {
    100% {
        transform: scale(1.75);
        opacity: 0
    }
}
</style>