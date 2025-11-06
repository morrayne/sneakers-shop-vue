<template>
  <div class="wrapper">
    <div class="background">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--main-bg);

  .background {
    max-width: 2160px;
    max-height: 1080px;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: var(--main-bg);

    .content {
      width: 100%;
      height: 100%;
      position: relative;
      background: var(--sub-bg);
      border: solid 1px var(--extra-bg);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
