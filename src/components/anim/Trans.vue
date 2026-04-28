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

  --color-background: black;
  --color-on-background: white;
  --c1: #b4ee6e;
  --c2: #00610f;
  --c3: #00bb49;
  --c4: #063400;
  --animation-duration: 2.8s;
  --border-width: 0.6em;
  --glow: none;
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
  -webkit-mask: none;
  mask: none;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
  background: black;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: 0 0;
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
  background: black;
}

.top {
  position: absolute;
  transform: skewX(36deg) translateX(2em);
  inset: 0;
  height: 6em;
  background: black;
  --angle-offset: calc(var(--index) * var(--offset-per-surface));
  --circle-diameter: calc(
    var(--hole-radius) * cos(calc(var(--angle) + var(--angle-offset)))
  );
  -webkit-mask: none;
  mask: none;
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
  background: rgba(255, 255, 255, 0.04);
  box-shadow: none;
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