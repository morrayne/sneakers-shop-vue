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
  background: var(--bg-a);

  .background {
    max-width: 2160px;
    max-height: 1080px;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: var(--bg-a);

    .content {
      width: 100%;
      height: 100%;
      position: relative;
      background: var(--bg-b);
      border: solid 1px var(--bg-c);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
    }
  }
}

/* Планшеты */
@media (max-width: 1024px) {
  .wrapper .background {
    padding: 0.8rem;
  }
}

/* Телефоны */
@media (max-width: 768px) {
  .wrapper .background {
    padding: 0.6rem;

    .content {
      border-radius: 0.8rem;
    }
  }
}

/* Маленькие телефоны */
@media (max-width: 480px) {
  .wrapper .background {
    padding: 0.4rem;

    .content {
      border-radius: 0.6rem;
    }
  }
}
</style>
