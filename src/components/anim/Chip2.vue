<template>
  <div class="wrap">
    <svg class="microchip" viewBox="0 0 128 128" role="img"
        aria-label="A square pops in emitting waves and lines, and sparks run through the lines">
        <symbol id="dot-1">
            <circle r="3" cx="3" cy="38"></circle>
        </symbol>
        <symbol id="dot-2">
            <circle r="3" cx="3" cy="54"></circle>
        </symbol>
        <symbol id="dot-3">
            <circle r="3" cx="3" cy="70"></circle>
        </symbol>
        <symbol id="dot-4">
            <circle r="3" cx="3" cy="3"></circle>
        </symbol>
        <symbol id="dot-5">
            <circle r="3" cx="20" cy="3"></circle>
        </symbol>
        <symbol id="dot-6">
            <circle r="3" cx="3" cy="30"></circle>
        </symbol>
        <symbol id="dot-7">
            <circle r="3" cx="37" cy="3"></circle>
        </symbol>
        <symbol id="dot-8">
            <circle r="3" cx="54" cy="3"></circle>
        </symbol>
        <symbol id="dot-9">
            <circle r="3" cx="71" cy="3"></circle>
        </symbol>
        <symbol id="line-1">
            <polyline points="12 54,12 46,3 46,3 38" stroke-dasharray="42 42"></polyline>
        </symbol>
        <symbol id="line-2">
            <polyline points="29 54,3 54" stroke-dasharray="42 42"></polyline>
        </symbol>
        <symbol id="line-3">
            <polyline points="12 54,12 62,3 62,3 70" stroke-dasharray="42 42"></polyline>
        </symbol>
        <symbol id="line-4">
            <polyline points="28 20,28 12,20 12,20 3" stroke-dasharray="60 60"></polyline>
        </symbol>
        <symbol id="line-5">
            <polyline points="37 29,37 20,3 20,3 3" stroke-dasharray="60 60"></polyline>
        </symbol>
        <symbol id="line-6">
            <polyline points="15 20,15 30,3 30" stroke-dasharray="60 60"></polyline>
        </symbol>
        <symbol id="line-7">
            <polyline points="54 12,37 12,37 3" stroke-dasharray="43 43"></polyline>
        </symbol>
        <symbol id="line-8">
            <polyline points="54 29,54 3" stroke-dasharray="43 43"></polyline>
        </symbol>
        <symbol id="line-9">
            <polyline points="54 12,71 12,71 3" stroke-dasharray="43 43"></polyline>
        </symbol>
        <symbol id="spark-1">
            <polyline points="12 54,12 46,3 46,3 38" stroke-dasharray="15 69"></polyline>
        </symbol>
        <symbol id="spark-2">
            <polyline points="29 54,3 54" stroke-dasharray="15 69"></polyline>
        </symbol>
        <symbol id="spark-3">
            <polyline points="12 54,12 62,3 62,3 70" stroke-dasharray="15 69"></polyline>
        </symbol>
        <symbol id="spark-4">
            <polyline points="28 20,28 12,20 12,20 3" stroke-dasharray="15 105"></polyline>
        </symbol>
        <symbol id="spark-5">
            <polyline points="37 29,37 20,3 20,3 3" stroke-dasharray="15 105"></polyline>
        </symbol>
        <symbol id="spark-6">
            <polyline points="15 20,15 30,3 30" stroke-dasharray="15 105"></polyline>
        </symbol>
        <symbol id="spark-7">
            <polyline points="54 12,37 12,37 3" stroke-dasharray="15 71"></polyline>
        </symbol>
        <symbol id="spark-8">
            <polyline points="54 29,54 3" stroke-dasharray="15 71"></polyline>
        </symbol>
        <symbol id="spark-9">
            <polyline points="54 12,71 12,71 3" stroke-dasharray="15 71"></polyline>
        </symbol>
        <symbol id="wave">
            <rect x="3" y="3" rx="2.5" ry="2.5" width="44" height="44"></rect>
        </symbol>
        <g transform="translate(10,10)">
            <g class="microchip__lines" stroke-linecap="round" stroke-linejoin="round">
                <g>
                    <g fill="none" stroke="currentcolor">
                        <use class="microchip__line microchip__line--1" href="#line-1"></use>
                        <use class="microchip__spark microchip__spark--1" href="#spark-1"></use>
                        <use class="microchip__line microchip__line--2" href="#line-2"></use>
                        <use class="microchip__spark microchip__spark--2" href="#spark-2"></use>
                        <use class="microchip__line microchip__line--3" href="#line-3"></use>
                        <use class="microchip__spark microchip__spark--3" href="#spark-3"></use>
                    </g>
                    <g fill="currentcolor">
                        <use class="microchip__dot microchip__dot--1" href="#dot-1"></use>
                        <use class="microchip__dot microchip__dot--2" href="#dot-2"></use>
                        <use class="microchip__dot microchip__dot--3" href="#dot-3"></use>
                    </g>
                </g>
                <g>
                    <g fill="none" stroke="currentcolor">
                        <use class="microchip__line microchip__line--4" href="#line-4"></use>
                        <use class="microchip__spark microchip__spark--4" href="#spark-4"></use>
                        <use class="microchip__line microchip__line--5" href="#line-5"></use>
                        <use class="microchip__spark microchip__spark--5" href="#spark-5"></use>
                        <use class="microchip__line microchip__line--6" href="#line-6"></use>
                        <use class="microchip__spark microchip__spark--6" href="#spark-6"></use>
                    </g>
                    <g fill="currentcolor">
                        <use class="microchip__dot microchip__dot--4" href="#dot-4"></use>
                        <use class="microchip__dot microchip__dot--5" href="#dot-5"></use>
                        <use class="microchip__dot microchip__dot--6" href="#dot-6"></use>
                    </g>
                </g>
                <g>
                    <g fill="none" stroke="currentcolor">
                        <use class="microchip__line microchip__line--7" href="#line-7"></use>
                        <use class="microchip__spark microchip__spark--7" href="#spark-7"></use>
                        <use class="microchip__line microchip__line--8" href="#line-8"></use>
                        <use class="microchip__spark microchip__spark--8" href="#spark-8"></use>
                        <use class="microchip__line microchip__line--9" href="#line-9"></use>
                        <use class="microchip__spark microchip__spark--9" href="#spark-9"></use>
                    </g>
                    <g fill="currentcolor">
                        <use class="microchip__dot microchip__dot--7" href="#dot-7"></use>
                        <use class="microchip__dot microchip__dot--8" href="#dot-8"></use>
                        <use class="microchip__dot microchip__dot--9" href="#dot-9"></use>
                    </g>
                </g>
                <g transform="translate(108,0) scale(-1,1)">
                    <g fill="none" stroke="currentcolor">
                        <use class="microchip__line microchip__line--4" href="#line-4"></use>
                        <use class="microchip__spark microchip__spark--4" href="#spark-4"></use>
                        <use class="microchip__line microchip__line--5" href="#line-5"></use>
                        <use class="microchip__spark microchip__spark--5" href="#spark-5"></use>
                        <use class="microchip__line microchip__line--6" href="#line-6"></use>
                        <use class="microchip__spark microchip__spark--6" href="#spark-6"></use>
                    </g>
                    <g fill="currentcolor">
                        <use class="microchip__dot microchip__dot--4" href="#dot-4"></use>
                        <use class="microchip__dot microchip__dot--5" href="#dot-5"></use>
                        <use class="microchip__dot microchip__dot--6" href="#dot-6"></use>
                    </g>
                </g>
                <g transform="translate(108,0) scale(-1,1)">
                    <g fill="none" stroke="currentcolor">
                        <use class="microchip__line microchip__line--1" href="#line-1"></use>
                        <use class="microchip__spark microchip__spark--1" href="#spark-1"></use>
                        <use class="microchip__line microchip__line--2" href="#line-2"></use>
                        <use class="microchip__spark microchip__spark--2" href="#spark-2"></use>
                        <use class="microchip__line microchip__line--3" href="#line-3"></use>
                        <use class="microchip__spark microchip__spark--3" href="#spark-3"></use>
                    </g>
                    <g fill="currentcolor">
                        <use class="microchip__dot microchip__dot--1" href="#dot-1"></use>
                        <use class="microchip__dot microchip__dot--2" href="#dot-2"></use>
                        <use class="microchip__dot microchip__dot--3" href="#dot-3"></use>
                    </g>
                </g>
                <g transform="translate(108,108) scale(-1,-1)">
                    <g fill="none" stroke="currentcolor">
                        <use class="microchip__line microchip__line--4" href="#line-4"></use>
                        <use class="microchip__spark microchip__spark--4" href="#spark-4"></use>
                        <use class="microchip__line microchip__line--5" href="#line-5"></use>
                        <use class="microchip__spark microchip__spark--5" href="#spark-5"></use>
                        <use class="microchip__line microchip__line--6" href="#line-6"></use>
                        <use class="microchip__spark microchip__spark--6" href="#spark-6"></use>
                    </g>
                    <g fill="currentcolor">
                        <use class="microchip__dot microchip__dot--4" href="#dot-4"></use>
                        <use class="microchip__dot microchip__dot--5" href="#dot-5"></use>
                        <use class="microchip__dot microchip__dot--6" href="#dot-6"></use>
                    </g>
                </g>
                <g transform="translate(0,108) scale(1,-1)">
                    <g fill="none" stroke="currentcolor">
                        <use class="microchip__line microchip__line--7" href="#line-7"></use>
                        <use class="microchip__spark microchip__spark--7" href="#spark-7"></use>
                        <use class="microchip__line microchip__line--8" href="#line-8"></use>
                        <use class="microchip__spark microchip__spark--8" href="#spark-8"></use>
                        <use class="microchip__line microchip__line--9" href="#line-9"></use>
                        <use class="microchip__spark microchip__spark--9" href="#spark-9"></use>
                    </g>
                    <g fill="currentcolor">
                        <use class="microchip__dot microchip__dot--7" href="#dot-7"></use>
                        <use class="microchip__dot microchip__dot--8" href="#dot-8"></use>
                        <use class="microchip__dot microchip__dot--9" href="#dot-9"></use>
                    </g>
                </g>
                <g transform="translate(0,108) scale(1,-1)">
                    <g fill="none" stroke="currentcolor">
                        <use class="microchip__line microchip__line--4" href="#line-4"></use>
                        <use class="microchip__spark microchip__spark--4" href="#spark-4"></use>
                        <use class="microchip__line microchip__line--5" href="#line-5"></use>
                        <use class="microchip__spark microchip__spark--5" href="#spark-5"></use>
                        <use class="microchip__line microchip__line--6" href="#line-6"></use>
                        <use class="microchip__spark microchip__spark--6" href="#spark-6"></use>
                    </g>
                    <g fill="currentcolor">
                        <use class="microchip__dot microchip__dot--4" href="#dot-4"></use>
                        <use class="microchip__dot microchip__dot--5" href="#dot-5"></use>
                        <use class="microchip__dot microchip__dot--6" href="#dot-6"></use>
                    </g>
                </g>
            </g>
            <g transform="translate(29,29)">
                <g class="microchip__center">
                    <g fill="none" stroke="currentcolor" stroke-width="6">
                        <use class="microchip__wave microchip__wave--1" href="#wave"></use>
                        <use class="microchip__wave microchip__wave--2" href="#wave"></use>
                    </g>
                    <rect class="microchip__core" fill="currentcolor" rx="5" ry="5" width="50" height="50"></rect>
                </g>
            </g>
        </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
$primary3: #4bd073;
$primary7: #123b1e;

.wrap{
  font-size: 20px;
}

.microchip {
  display: block;
  margin: auto;
  width: 12em;
  height: auto;
  position: relative;
  left: -1em;
  top: -1em;
}
.microchip__center, .microchip__dot, .microchip__line, .microchip__lines, .microchip__spark, .microchip__wave {
  animation-duration: 5s;
  animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
  animation-iteration-count: infinite;
}
.microchip__core, .microchip__dot {
  fill: $primary7;
  transition: fill 0.3s;
}
.microchip__center, .microchip__wave {
  transform-origin: 25px 25px;
}
.microchip__center {
  animation-name: center-scale;
}
.microchip__dot--1 {
  animation-name: dot-scale1;
  transform-origin: 3px 38px;
}
.microchip__dot--2 {
  animation-name: dot-scale2;
  transform-origin: 3px 54px;
}
.microchip__dot--3 {
  animation-name: dot-scale3;
  transform-origin: 3px 70px;
}
.microchip__dot--4 {
  animation-name: dot-scale4;
  transform-origin: 3px 3px;
}
.microchip__dot--5 {
  animation-name: dot-scale5;
  transform-origin: 20px 3px;
}
.microchip__dot--6 {
  animation-name: dot-scale6;
  transform-origin: 3px 30px;
}
.microchip__dot--7 {
  animation-name: dot-scale7;
  transform-origin: 37px 3px;
}
.microchip__dot--8 {
  animation-name: dot-scale8;
  transform-origin: 54px 3px;
}
.microchip__dot--9 {
  animation-name: dot-scale9;
  transform-origin: 71px 3px;
}
.microchip__line, .microchip__spark, .microchip__wave {
  transition: stroke 0.3s;
}
.microchip__line {
  stroke: $primary7;
}
.microchip__line--1 {
  animation-name: line-draw1;
}
.microchip__line--2 {
  animation-name: line-draw2;
}
.microchip__line--3 {
  animation-name: line-draw3;
}
.microchip__line--4 {
  animation-name: line-draw4;
}
.microchip__line--5 {
  animation-name: line-draw5;
}
.microchip__line--6 {
  animation-name: line-draw6;
}
.microchip__line--7 {
  animation-name: line-draw7;
}
.microchip__line--8 {
  animation-name: line-draw8;
}
.microchip__line--9 {
  animation-name: line-draw9;
}
.microchip__lines {
  animation-name: lines-scale;
  transform-origin: 54px 54px;
}
.microchip__spark, .microchip__wave {
  animation-timing-function: linear;
  stroke: $primary3;
}
.microchip__spark--1 {
  animation-name: spark1;
}
.microchip__spark--2 {
  animation-name: spark2;
}
.microchip__spark--3 {
  animation-name: spark3;
}
.microchip__spark--4 {
  animation-name: spark4;
}
.microchip__spark--5 {
  animation-name: spark5;
}
.microchip__spark--6 {
  animation-name: spark6;
}
.microchip__spark--7 {
  animation-name: spark7;
}
.microchip__spark--8 {
  animation-name: spark8;
}
.microchip__spark--9 {
  animation-name: spark9;
}
.microchip__wave--1 {
  animation-name: wave-scale1;
}
.microchip__wave--2 {
  animation-name: wave-scale2;
}

/* Animations */
@keyframes center-scale {
  from, to {
    transform: scale(0);
  }
  12.5%, 75% {
    transform: scale(1);
  }
}
@keyframes dot-scale1 {
  from, 20%, 81.25%, to {
    transform: scale(0);
  }
  32.5%, 68.75% {
    transform: scale(1);
  }
}
@keyframes dot-scale2 {
  from, 10.5%, 87.5%, to {
    transform: scale(0);
  }
  23%, 75% {
    transform: scale(1);
  }
}
@keyframes dot-scale3 {
  from, 20%, 81.25%, to {
    transform: scale(0);
  }
  32.5%, 68.75% {
    transform: scale(1);
  }
}
@keyframes dot-scale4 {
  from, 20%, 81.25%, to {
    transform: scale(0);
  }
  32.5%, 68.75% {
    transform: scale(1);
  }
}
@keyframes dot-scale5 {
  from, 11.5%, 87.5%, to {
    transform: scale(0);
  }
  24%, 75% {
    transform: scale(1);
  }
}
@keyframes dot-scale6 {
  from, 14.5%, 85%, to {
    transform: scale(0);
  }
  27%, 72.5% {
    transform: scale(1);
  }
}
@keyframes dot-scale7 {
  from, 20%, 81.25%, to {
    transform: scale(0);
  }
  32.5%, 68.75% {
    transform: scale(1);
  }
}
@keyframes dot-scale8 {
  from, 11%, 87.5%, to {
    transform: scale(0);
  }
  23.5%, 75% {
    transform: scale(1);
  }
}
@keyframes dot-scale9 {
  from, 20%, 81.25%, to {
    transform: scale(0);
  }
  32.5%, 68.75% {
    transform: scale(1);
  }
}
@keyframes line-draw1 {
  from, 93.75%, to {
    stroke-dashoffset: 59;
  }
  25%, 68.75% {
    stroke-dashoffset: 17;
  }
}
@keyframes line-draw2 {
  from, 93.75%, to {
    stroke-dashoffset: 42;
  }
  25%, 68.75% {
    stroke-dashoffset: 0;
  }
}
@keyframes line-draw3 {
  from, 93.75%, to {
    stroke-dashoffset: 59;
  }
  25%, 68.75% {
    stroke-dashoffset: 17;
  }
}
@keyframes line-draw4 {
  from, 93.75%, to {
    stroke-dashoffset: 78;
  }
  25%, 68.75% {
    stroke-dashoffset: 18;
  }
}
@keyframes line-draw5 {
  from, 93.75%, to {
    stroke-dashoffset: 60;
  }
  25%, 68.75% {
    stroke-dashoffset: 0;
  }
}
@keyframes line-draw6 {
  from, 93.75%, to {
    stroke-dashoffset: 91;
  }
  25%, 68.75% {
    stroke-dashoffset: 31;
  }
}
@keyframes line-draw7 {
  from, 93.75%, to {
    stroke-dashoffset: 60;
  }
  25%, 68.75% {
    stroke-dashoffset: 17;
  }
}
@keyframes line-draw8 {
  from, 93.75%, to {
    stroke-dashoffset: 43;
  }
  25%, 68.75% {
    stroke-dashoffset: 0;
  }
}
@keyframes line-draw9 {
  from, 93.75%, to {
    stroke-dashoffset: 60;
  }
  25%, 68.75% {
    stroke-dashoffset: 17;
  }
}
@keyframes lines-scale {
  from {
    opacity: 1;
    transform: scale(0);
  }
  12.5%, 75% {
    opacity: 1;
    transform: scale(1);
  }
  93.75%, to {
    opacity: 0;
    transform: scale(0.5);
  }
}
@keyframes spark1 {
  from, 27.5% {
    stroke-dashoffset: 59;
  }
  50%, 52.5% {
    stroke-dashoffset: -25;
  }
  75%, to {
    stroke-dashoffset: -109;
  }
}
@keyframes spark2 {
  from, 27.5% {
    stroke-dashoffset: 42;
  }
  50%, 52.5% {
    stroke-dashoffset: -42;
  }
  75%, to {
    stroke-dashoffset: -126;
  }
}
@keyframes spark3 {
  from, 27.5% {
    stroke-dashoffset: 59;
  }
  50%, 52.5% {
    stroke-dashoffset: -25;
  }
  75%, to {
    stroke-dashoffset: -109;
  }
}
@keyframes spark4 {
  from, 27.5% {
    stroke-dashoffset: 78;
  }
  50%, 52.5% {
    stroke-dashoffset: -42;
  }
  75%, to {
    stroke-dashoffset: -162;
  }
}
@keyframes spark5 {
  from, 27.5% {
    stroke-dashoffset: 60;
  }
  50%, 52.5% {
    stroke-dashoffset: -60;
  }
  75%, to {
    stroke-dashoffset: -180;
  }
}
@keyframes spark6 {
  from, 27.5% {
    stroke-dashoffset: 91;
  }
  50%, 52.5% {
    stroke-dashoffset: -29;
  }
  75%, to {
    stroke-dashoffset: -149;
  }
}
@keyframes spark7 {
  from, 27.5% {
    stroke-dashoffset: 60;
  }
  50%, 52.5% {
    stroke-dashoffset: -26;
  }
  75%, to {
    stroke-dashoffset: -112;
  }
}
@keyframes spark8 {
  from, 27.5% {
    stroke-dashoffset: 43;
  }
  50%, 52.5% {
    stroke-dashoffset: -43;
  }
  75%, to {
    stroke-dashoffset: -129;
  }
}
@keyframes spark9 {
  from, 27.5% {
    stroke-dashoffset: 60;
  }
  50%, 52.5% {
    stroke-dashoffset: -26;
  }
  75%, to {
    stroke-dashoffset: -112;
  }
}
@keyframes wave-scale1 {
  from, 0%, 25%, 50%, 75% {
    stroke-width: 6px;
    transform: scale(1);
  }
  10%, 35%, 60%, 85%, to {
    animation-timing-function: steps(1);
    stroke-width: 0;
    transform: scale(2);
  }
}
@keyframes wave-scale2 {
  from, 5%, 30%, 55%, 80% {
    stroke-width: 6px;
    transform: scale(1);
  }
  15%, 40%, 65%, 90%, to {
    animation-timing-function: steps(1);
    stroke-width: 0;
    transform: scale(2);
  }
}
</style>