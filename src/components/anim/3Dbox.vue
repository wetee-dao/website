<template>
  <div class="cube">
    <div class="sides">
      <div class="top"></div>
      <div class="right"></div>
      <div class="bottom"></div>
      <div class="left"></div>
      <div class="front"></div>
      <div class="back"></div>
      <div class="text">TEE</div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.cube,
.cube * {
  width: 151px;
  height: 151px;
}

.cube * {
  position: absolute;
}

.sides {
  -webkit-animation: rotate 3s ease infinite;
  animation: rotate 3s ease infinite;
  -webkit-animation-delay: .8s;
  animation-delay: .8s;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotateX(-37.5deg) rotateY(45deg);
  transform: rotateX(-37.5deg) rotateY(45deg);
}

.text{
  font-size: 50px;
  text-align: center;
  line-height: 150px;
  border: none !important;
  background: none !important;
  color: #ffffffd5;
}

.cube .sides * {
  box-sizing: border-box;
  background-color: rgba(5, 90, 31, 0.709);
  border: 8px solid #ffffff54;
}

.cube .sides .top {
  -webkit-animation: top-animation 3s ease infinite;
  animation: top-animation 3s ease infinite;
  -webkit-animation-delay: 0ms;
  animation-delay: 0ms;
  -webkit-transform: rotateX(90deg) translateZ(150px);
  transform: rotateX(90deg) translateZ(150px);
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotateX(-37.5deg) rotateY(45deg);
    transform: rotateX(-37.5deg) rotateY(45deg);
  }

  50% {
    -webkit-transform: rotateX(-37.5deg) rotateY(405deg);
    transform: rotateX(-37.5deg) rotateY(405deg);
  }

  100% {
    -webkit-transform: rotateX(-37.5deg) rotateY(405deg);
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
}

@keyframes rotate {
  0% {
    -webkit-transform: rotateX(-37.5deg) rotateY(45deg);
    transform: rotateX(-37.5deg) rotateY(45deg);
  }

  50% {
    -webkit-transform: rotateX(-37.5deg) rotateY(405deg);
    transform: rotateX(-37.5deg) rotateY(405deg);
  }

  100% {
    -webkit-transform: rotateX(-37.5deg) rotateY(405deg);
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
}

@-webkit-keyframes top-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(150px);
    transform: rotateX(90deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(75px);
    transform: rotateX(90deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(75px);
    transform: rotateX(90deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(150px);
    transform: rotateX(90deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(150px);
    transform: rotateX(90deg) translateZ(150px);
  }
}

@keyframes top-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(150px);
    transform: rotateX(90deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(75px);
    transform: rotateX(90deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(75px);
    transform: rotateX(90deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(150px);
    transform: rotateX(90deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateX(90deg) translateZ(150px);
    transform: rotateX(90deg) translateZ(150px);
  }
}

.cube .sides .bottom {
  -webkit-animation: bottom-animation 3s ease infinite;
  animation: bottom-animation 3s ease infinite;
  -webkit-animation-delay: 0ms;
  animation-delay: 0ms;
  -webkit-transform: rotateX(-90deg) translateZ(150px);
  transform: rotateX(-90deg) translateZ(150px);
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

@-webkit-keyframes bottom-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(150px);
    transform: rotateX(-90deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(75px);
    transform: rotateX(-90deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(75px);
    transform: rotateX(-90deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(150px);
    transform: rotateX(-90deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(150px);
    transform: rotateX(-90deg) translateZ(150px);
  }
}

@keyframes bottom-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(150px);
    transform: rotateX(-90deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(75px);
    transform: rotateX(-90deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(75px);
    transform: rotateX(-90deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(150px);
    transform: rotateX(-90deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateX(-90deg) translateZ(150px);
    transform: rotateX(-90deg) translateZ(150px);
  }
}

.cube .sides .front {
  -webkit-animation: front-animation 3s ease infinite;
  animation: front-animation 3s ease infinite;
  -webkit-animation-delay: 100ms;
  animation-delay: 100ms;
  -webkit-transform: rotateY(0deg) translateZ(150px);
  transform: rotateY(0deg) translateZ(150px);
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

@-webkit-keyframes front-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(150px);
    transform: rotateY(0deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(75px);
    transform: rotateY(0deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(75px);
    transform: rotateY(0deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(150px);
    transform: rotateY(0deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(150px);
    transform: rotateY(0deg) translateZ(150px);
  }
}

@keyframes front-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(150px);
    transform: rotateY(0deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(75px);
    transform: rotateY(0deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(75px);
    transform: rotateY(0deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(150px);
    transform: rotateY(0deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateY(0deg) translateZ(150px);
    transform: rotateY(0deg) translateZ(150px);
  }
}

.cube .sides .back {
  -webkit-animation: back-animation 3s ease infinite;
  animation: back-animation 3s ease infinite;
  -webkit-animation-delay: 100ms;
  animation-delay: 100ms;
  -webkit-transform: rotateY(-180deg) translateZ(150px);
  transform: rotateY(-180deg) translateZ(150px);
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

@-webkit-keyframes back-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(150px);
    transform: rotateY(-180deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(75px);
    transform: rotateY(-180deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(75px);
    transform: rotateY(-180deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(150px);
    transform: rotateY(-180deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(150px);
    transform: rotateY(-180deg) translateZ(150px);
  }
}

@keyframes back-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(150px);
    transform: rotateY(-180deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(75px);
    transform: rotateY(-180deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(75px);
    transform: rotateY(-180deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(150px);
    transform: rotateY(-180deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateY(-180deg) translateZ(150px);
    transform: rotateY(-180deg) translateZ(150px);
  }
}

.cube .sides .left {
  -webkit-animation: left-animation 3s ease infinite;
  animation: left-animation 3s ease infinite;
  -webkit-animation-delay: 100ms;
  animation-delay: 100ms;
  -webkit-transform: rotateY(-90deg) translateZ(150px);
  transform: rotateY(-90deg) translateZ(150px);
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

@-webkit-keyframes left-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(150px);
    transform: rotateY(-90deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(75px);
    transform: rotateY(-90deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(75px);
    transform: rotateY(-90deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(150px);
    transform: rotateY(-90deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(150px);
    transform: rotateY(-90deg) translateZ(150px);
  }
}

@keyframes left-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(150px);
    transform: rotateY(-90deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(75px);
    transform: rotateY(-90deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(75px);
    transform: rotateY(-90deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(150px);
    transform: rotateY(-90deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateY(-90deg) translateZ(150px);
    transform: rotateY(-90deg) translateZ(150px);
  }
}

.cube .sides .right {
  -webkit-animation: right-animation 3s ease infinite;
  animation: right-animation 3s ease infinite;
  -webkit-animation-delay: 100ms;
  animation-delay: 100ms;
  -webkit-transform: rotateY(90deg) translateZ(150px);
  transform: rotateY(90deg) translateZ(150px);
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

@-webkit-keyframes right-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(150px);
    transform: rotateY(90deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(75px);
    transform: rotateY(90deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(75px);
    transform: rotateY(90deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(150px);
    transform: rotateY(90deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(150px);
    transform: rotateY(90deg) translateZ(150px);
  }
}

@keyframes right-animation {
  0% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(150px);
    transform: rotateY(90deg) translateZ(150px);
  }

  20% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(75px);
    transform: rotateY(90deg) translateZ(75px);
  }

  70% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(75px);
    transform: rotateY(90deg) translateZ(75px);
  }

  90% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(150px);
    transform: rotateY(90deg) translateZ(150px);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateY(90deg) translateZ(150px);
    transform: rotateY(90deg) translateZ(150px);
  }
}
</style>