<template>
  <div class="lego-box">
    <div class="lego red">
      <div class="left"></div>
      <div class="right"></div>
      <div class="container-top">
        <div class="top">
          <div class="dot d-n1"></div>
          <div class="dot d-n2"></div>
          <div class="dot d-n3"></div>
          <div class="dot d-n4"></div>
        </div>
      </div>
    </div>
    <div class="lego blue">
      <div class="left"></div>
      <div class="right"></div>
      <div class="container-top">
        <div class="top">
          <div class="dot d-n1"></div>
          <div class="dot d-n2"></div>
          <div class="dot d-n3"></div>
          <div class="dot d-n4"></div>
        </div>
      </div>
    </div>
    <div class="lego yellow">
      <div class="left"></div>
      <div class="right"></div>
      <div class="container-top">
        <div class="top">
          <div class="dot d-n1"></div>
          <div class="dot d-n2"></div>
          <div class="dot d-n3"></div>
          <div class="dot d-n4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.lego-box{
  width: 150px;
  height: 150px;
  position: relative;
  top: -80px;
  opacity: 0.7;
}

.red.lego {
  animation-delay: 0s;
}

.red.lego>.left {
  background: #f55a4e;
}

.red.lego>.right {
  background: #f32c1e;
}

.red.lego>.container-top>.top {
  background: #F44336;
}

.red.lego>.container-top>.top>.dot {
  background: #f55a4e;
  filter: drop-shadow(5px 5px 0px #ea1c0d);
}

.blue.lego {
  animation-delay: 1.4s;
}

.blue.lego>.left {
  background: #3594e8;
}

.blue.lego>.right {
  background: #187bd1;
}

.blue.lego>.container-top>.top {
  background: #1E88E5;
}

.blue.lego>.container-top>.top>.dot {
  background: #3594e8;
  filter: drop-shadow(5px 5px 0px #166dba);
}

.yellow.lego {
  animation-delay: 2.8s;
}

.yellow.lego>.left {
  background: #fddd4e;
}

.yellow.lego>.right {
  background: #fdd31c;
}

.yellow.lego>.container-top>.top {
  background: #FDD835;
}

.yellow.lego>.container-top>.top>.dot {
  background: #fddd4e;
  filter: drop-shadow(5px 5px 0px #fdce03);
}

.lego {
  width: 150px;
  height: 150px;
  position: absolute;
  animation: loading 4.2s infinite ease;
  opacity: 0;
}

.lego>.left {
  width: 102px;
  height: 35px;
  position: absolute;
  transform: rotateY(60deg) rotate(10deg) rotateX(6deg);
  bottom: 15px;
  border-radius: 5px 0 5px 5px;
}

.lego>.right {
  width: 102px;
  height: 35px;
  position: absolute;
  transform: rotateY(-60deg) rotate(-10deg) rotateX(5deg);
  bottom: 15px;
  right: 0;
  border-radius: 0 5px 5px 5px;
}

.lego .container-top {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 75px;
  height: 75px;
  transform: rotateZ(45deg);
  bottom: 16px;
}

.lego .container-top .top {
  width: 68px;
  height: 69px;
  position: absolute;
  transform: rotateY(42deg) rotateZ(-17deg) rotateX(-43deg);
  border-radius: 5px 0 0 0;
}

.lego .container-top .top>.dot {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 100%;
}

.lego .container-top .top>.dot.d-n1 {
  left: 7px;
  top: 7px;
}

.lego .container-top .top>.dot.d-n2 {
  right: 10px;
  top: 7px;
}

.lego .container-top .top>.dot.d-n3 {
  right: 10px;
  bottom: 10px;
}

.lego .container-top .top>.dot.d-n4 {
  left: 7px;
  bottom: 10px;
}

@keyframes loading {
  0% {
    transform: translate(0, -50px);
    opacity: 0;
    z-index: 10;
  }

  10% {
    opacity: 1;
  }

  40% {
    transform: translate(0, 0);
    z-index: 1;
  }

  75% {
    opacity: 1;
  }

  100% {
    transform: translate(0, 100px);
    opacity: 0;
  }
}

@-webkit-keyframes loading {
  0% {
    transform: translate(0, -50px);
    opacity: 0;
    z-index: 10;
  }

  10% {
    opacity: 1;
  }

  40% {
    transform: translate(0, 0);
    z-index: 1;
  }

  75% {
    opacity: 1;
  }

  100% {
    transform: translate(0, 100px);
    opacity: 0;
  }
}

@-moz-keyframes loading {
  0% {
    transform: translate(0, -50px);
    opacity: 0;
    z-index: 10;
  }

  40% {
    transform: translate(0, 0);
    opacity: 1;
    z-index: 1;
  }

  75% {
    opacity: 1;
  }

  100% {
    transform: translate(0, 100px);
    opacity: 0;
  }
}
</style>