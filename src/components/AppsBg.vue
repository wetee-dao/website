<template>
  <div class="area">
    <ul class="circles">
      <li class="green">
        <div>GameFi</div>
      </li>
      <li></li>
      <li></li>
      <li class="z">
        <div>DAPP</div>
      </li>
      <li></li>
      <li class="blue">
        <div>Intel<br />TDX</div>
      </li>
      <li class="r">
        <div>AMD<br />SEV</div>
      </li>
      <li></li>
      <li></li>
      <li class="blue2">
        <div>Intel<br />SGX</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
/* 首页动画 */
.area {
  width: 100%;
  height: 100%;
}

.circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circles li {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;
  text-align: center;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    line-height: 1.1;
  }
}

.circles li:nth-child(1) {
  left: 25%;
  width: 80px;
  height: 80px;
  font-size: 16px;
  animation-delay: 0s;
}


.circles li:nth-child(2) {
  left: 10%;
  width: 20px;
  height: 20px;
  font-size: 10px;
  animation-delay: 2s;
  animation-duration: 12s;
}

.circles li:nth-child(3) {
  left: 70%;
  width: 20px;
  height: 20px;
  font-size: 15px;
  animation-delay: 4s;
}

.circles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  font-size: 15px;
  animation-delay: 0s;
  animation-duration: 18s;
}

.circles li:nth-child(5) {
  left: 65%;
  width: 20px;
  height: 20px;
  font-size: 10px;
  animation-delay: 0s;
}

.circles li:nth-child(6) {
  left: 75%;
  width: 110px;
  height: 110px;
  font-size: 34px;
  animation-delay: 3s;
}

.circles li:nth-child(7) {
  left: 35%;
  width: 150px;
  height: 150px;
  font-size: 43px;
  animation-delay: 7s;
}

.circles li:nth-child(8) {
  left: 50%;
  width: 25px;
  height: 25px;
  font-size: 10px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.circles li:nth-child(9) {
  left: 20%;
  width: 15px;
  height: 15px;
  font-size: 9px;
  animation-delay: 2s;
  animation-duration: 35s;
}

.circles li:nth-child(10) {
  left: 85%;
  width: 150px;
  height: 150px;
  font-size: 40px;
  animation-delay: 0s;
  animation-duration: 11s;
}


@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 20%;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}

.circles .green {
  background-color: $primary-text;
  color: #000000;
}

.circles .r {
  background-color: #932930;
  color: #ffffff;
  font-size: 80px;
}

.circles .z {
  background-color: #522993;
  color: #ffffff;
}

.circles .blue {
  background-color: #294793;
  color: #ffffff;
}

.circles .blue2 {
  background-color: #16024d;
  color: #ffffff;
}
</style>