<template>

    <div class="container">
      <div class="wall">
        <div class="surface"></div>
        <div class="surface"></div>
        <div class="left"></div>
        <div class="top"></div>
      </div>
      <div class="wall">
        <div class="surface"></div>
        <div class="surface"></div>
        <div class="left"></div>
        <div class="top"></div>
      </div>
      <div class="wall">
        <div class="surface"></div>
        <div class="surface"></div>
        <div class="left"></div>
        <div class="top"></div>
      </div>
      <div class="wall">
        <div class="surface"></div>
        <div class="surface"></div>
        <div class="left"></div>
        <div class="top"></div>
      </div>
      <div class="wall">
        <div class="surface"></div>
        <div class="surface"></div>
        <div class="left"></div>
        <div class="top"></div>
      </div>
      <div class="wall">
        <div class="surface"></div>
        <div class="surface"></div>
        <div class="left"></div>
        <div class="top"></div>
      </div>
      <div class="ball-container">
        <div class="ball"></div>
      </div>
    </div>

</template>

<style lang="scss" scoped>
@property --angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0deg;
}
@property --circle-diameter {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

.container {
  font-size: 3px;
  position: relative;
  top: 4em;
  left: -8em;
  width: 50em;
  aspect-ratio: 1/1.2;
  --angle: 30deg;
  -webkit-animation: angle var(--animation-duration) linear infinite;
          animation: angle var(--animation-duration) linear infinite;
  transform-style: preserve-3d;
  transform: rotateX(-45deg) rotateY(45deg);

  --color-background: conic-gradient(
    black,
    #192d39,
    #0e1e2e,
    #281133,
    #14293d,
    #16031a,
    black
  );
  --color-on-background: white;
  --c1: #b4ee6e;
  --c2: #00610f;
  --c3: #00bb49;
  --c4: #063400;
  --animation-duration: 2.8s;
  --border-width: 0.6em;
  --glow: drop-shadow(0 0 6em rgba(255, 255, 255, 0.19));
  --hole-pos-y: 20%;
  --hole-radius: 22em;
  --offset-per-surface: calc(360deg / 24);
}

.wall {
  position: absolute;
  inset: 0;
  --wall-gap: 10em;
  filter: var(--glow);
}
.wall:nth-of-type(1) {
  transform: translateZ(calc(var(--wall-gap) * -3));
  --index: 1;
}
.wall:nth-of-type(1) .surface,
.wall:nth-of-type(1) .top {
  --index: 1;
}
.wall:nth-of-type(1) .surface:nth-child(2),
.wall:nth-of-type(1) .top:nth-child(2) {
  --index: 2;
}
.wall:nth-of-type(2) {
  transform: translateZ(calc(var(--wall-gap) * -2));
  --index: 2;
}
.wall:nth-of-type(2) .surface,
.wall:nth-of-type(2) .top {
  --index: 3;
}
.wall:nth-of-type(2) .surface:nth-child(2),
.wall:nth-of-type(2) .top:nth-child(2) {
  --index: 4;
}
.wall:nth-of-type(3) {
  transform: translateZ(calc(var(--wall-gap) * -1));
  --index: 3;
}
.wall:nth-of-type(3) .surface,
.wall:nth-of-type(3) .top {
  --index: 5;
}
.wall:nth-of-type(3) .surface:nth-child(2),
.wall:nth-of-type(3) .top:nth-child(2) {
  --index: 6;
}
.wall:nth-of-type(4) {
  transform: translateZ(calc(var(--wall-gap) * 0));
  --index: 4;
}
.wall:nth-of-type(4) .surface,
.wall:nth-of-type(4) .top {
  --index: 7;
}
.wall:nth-of-type(4) .surface:nth-child(2),
.wall:nth-of-type(4) .top:nth-child(2) {
  --index: 8;
}
.wall:nth-of-type(5) {
  transform: translateZ(calc(var(--wall-gap) * 1));
  --index: 5;
}
.wall:nth-of-type(5) .surface,
.wall:nth-of-type(5) .top {
  --index: 9;
}
.wall:nth-of-type(5) .surface:nth-child(2),
.wall:nth-of-type(5) .top:nth-child(2) {
  --index: 10;
}
.wall:nth-of-type(6) {
  transform: translateZ(calc(var(--wall-gap) * 2));
  --index: 6;
}
.wall:nth-of-type(6) .surface,
.wall:nth-of-type(6) .top {
  --index: 11;
}
.wall:nth-of-type(6) .surface:nth-child(2),
.wall:nth-of-type(6) .top:nth-child(2) {
  --index: 12;
}

.surface {
  position: absolute;
  inset: 0;
  --angle-offset: calc(var(--index) * var(--offset-per-surface));
  --circle-diameter: calc(
    var(--hole-radius) * cos(calc(var(--angle) + var(--angle-offset)))
  );
  -webkit-mask: radial-gradient(circle at 50% var(--hole-pos-y), transparent var(--circle-diameter), black var(--circle-diameter));
  mask: radial-gradient(circle at 50% var(--hole-pos-y), transparent var(--circle-diameter), black var(--circle-diameter));
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
  background: radial-gradient(circle at 50% var(--hole-pos-y), var(--c4) calc(var(--circle-diameter) + var(--border-width)), var(--c4) calc(var(--circle-diameter) + var(--border-width)), transparent var(--circle-diameter)), linear-gradient(black, black), linear-gradient(45deg, var(--c1), var(--c3), var(--c2), var(--c1), var(--c4), var(--c3), var(--c2));
  background-repeat: no-repeat;
  background-size: 100% 100%, calc(100% - var(--border-width) * 2) calc(100% - var(--border-width) * 2), 100%, 100%;
  background-position: 0 0, var(--border-width) var(--border-width), 0 0;
}
.surface:nth-child(2) {
  --circle-diameter: calc(
    var(--hole-radius) * cos(calc(var(--angle) + var(--angle-offset)))
  );
  transform: translate(4em, 5.7em);
}

.left {
  position: absolute;
  transform: skewY(55deg) translateY(2.9em);
  inset: 0;
  width: 4.5em;
  background: linear-gradient(black, black) no-repeat, linear-gradient(to top, var(--c1), var(--c3), var(--c2), var(--c1)) no-repeat;
  background-size: calc(100% - var(--border-width) * 2) calc(100% - var(--border-width) * 2), 100%, 100%;
  background-position: var(--border-width) var(--border-width), 0 0;
}

.top {
  position: absolute;
  transform: skewX(36deg) translateX(2em);
  inset: 0;
  height: 6em;
  background: linear-gradient(black, black) no-repeat, linear-gradient(to right, var(--c1), var(--c3), var(--c2), var(--c1)) no-repeat;
  background-size: calc(100% - var(--border-width) * 2) calc(100% - var(--border-width) * 2), 100%, 100%;
  background-position: var(--border-width) var(--border-width), 0 0;
  --angle-offset: calc(var(--index) * var(--offset-per-surface));
  --circle-diameter: calc(
    var(--hole-radius) * cos(calc(var(--angle) + var(--angle-offset)))
  );
  -webkit-mask: radial-gradient(calc(var(--circle-diameter) * 0.86) at 50% calc(60% / cos(calc(var(--angle) + var(--angle-offset)))), transparent var(--circle-diameter), black var(--circle-diameter));
  mask: radial-gradient(calc(var(--circle-diameter) * 0.86) at 50% calc(60% / cos(calc(var(--angle) + var(--angle-offset)))), transparent var(--circle-diameter), black var(--circle-diameter));
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}

@-webkit-keyframes angle {
  from {
    --angle: 360deg;
  }
  to {
    --angle: 0deg;
  }
}

@keyframes angle {
  from {
    --angle: 360deg;
  }
  to {
    --angle: 0deg;
  }
}
.ball-container {
  display: grid;
  place-items: center;
  position: absolute;
  inset: 0;
  transform: translateZ(-60em);
  -webkit-animation: ball-container var(--animation-duration) linear infinite;
          animation: ball-container var(--animation-duration) linear infinite;
}

.ball {
  width: 42em;
  aspect-ratio: 1;
  border-radius: 50%;
  filter: var(--glow);
  background: radial-gradient(21.5em 21.5em at center, black 20em, transparent 20em), conic-gradient(var(--c1), var(--c3), var(--c2), var(--c4), var(--c3), var(--c1), var(--c2), var(--c1));
  box-shadow: 0 0 10em rgba(255, 255, 255, 0.08);
  transform: rotateX(45deg) rotateY(45deg) translateY(-20em);
}

@-webkit-keyframes ball-container {
  from {
    transform: translateZ(-40em);
    opacity: 0;
  }
  10% {
    transform: translateZ(-25em);
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateZ(70em);
  }
}

@keyframes ball-container {
  from {
    transform: translateZ(-40em);
    opacity: 0;
  }
  10% {
    transform: translateZ(-25em);
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateZ(70em);
  }
}
body {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  background: var(--color-background);
  color: var(--color-on-background);
  overflow: hidden;
  mix-blend-mode: plus-lighter;
}
</style>