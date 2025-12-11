<script setup lang="ts">
// vue
import { ref, watch } from "vue";

// imports
import header_home from "../../common/header/header_home.vue";
import wrapper_home from "../../common/wrapper/wrapper_home.vue";

// vars
const active = ref(localStorage.getItem("homeTheme"));
const data = ref([
  { folderName: "green", characterName: "Anaxa", color1: "#b7cfbe", color2: "#94b19d" },
  { folderName: "pink", characterName: "Evernight", color1: "#d9753b", color2: "#87224f" },
  { folderName: "blue", characterName: "Cerydra", color1: "#239dce", color2: "#0c5096" },
  { folderName: "yellow", characterName: "Aglaea", color1: "#facb3f", color2: "#107720" },
]);

// Находим активную тему по folderName
const findActiveThemeIndex = () => {
  return data.value.findIndex((item) => item.folderName === active.value);
};

// Функция для применения темы
const applyTheme = (folderName: string | null) => {
  const htmlElement = document.documentElement;
  if (folderName) {
    htmlElement.setAttribute("data-home-theme", folderName);
  } else {
    htmlElement.setAttribute("data-home-theme", data.value[0]!.folderName);
    active.value = data.value[0]!.folderName;
  }
};

// Функция смены темы
function changeTheme(index: number) {
  const theme = data.value[index];
  if (theme) {
    active.value = theme.folderName;
    localStorage.setItem("homeTheme", theme.folderName);
    applyTheme(theme.folderName);
  }
}

// Следим за изменениями в localStorage
const handleStorageChange = () => {
  const newTheme = localStorage.getItem("homeTheme");
  if (newTheme !== active.value) {
    active.value = newTheme;
    applyTheme(newTheme);
  }
};

// Инициализация при загрузке компонента
window.addEventListener("storage", handleStorageChange);

// Следим за изменениями active
watch(active, (newTheme) => { applyTheme(newTheme) });

// Получаем путь к изображению для текущей темы
const getSneakerImagePath = () => {
  const themeIndex = findActiveThemeIndex();
  if (themeIndex !== -1) {
    return `/home/${data.value[themeIndex]!.folderName}/sneaker.png`;
  }
  return `/home/${data.value[0]!.folderName}/sneaker.png`;
};
</script>

<template>
  <wrapper_home>
    <header_home />
    <main>
      <h1>
        <p class="nike">NIKE</p>
        <div class="just">
          <p>JUST</p>
          <p>DO</p>
          <p>IT</p>
        </div>
        <div class="air-max">Nike Air Max Plus</div>
        <div class="created">
          <p>sneakers shop vue</p>
          <p>created by redmorrayne</p>
        </div>
        <img class="main-sneaker" :src="getSneakerImagePath()" alt="Nike Air Max Plus" />
      </h1>
      <div class="bottom">
        <div class="line"></div>
        <div class="card" v-for="(item, index) in data" :key="index" @click="changeTheme(index)" :style="{ background: `linear-gradient(-45deg, ${item.color1}, ${item.color2})` }" :class="{ active: item.folderName === active }">
          <img :src="`home/${item.folderName}/character.webp`" alt="">
          <p>{{ item.characterName }}</p>
          <span>{{ item.folderName }}</span>
        </div>
      </div>
    </main>
  </wrapper_home>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  color: var(--main-header-text);

  h1 {
    position: relative;

    .nike {
      font-size: 28rem;
      letter-spacing: -2rem;
      color: var(--sub-header-bg);
    }

    .just {
      position: absolute;
      top: 0;
      left: -7rem;
      display: flex;
      flex-direction: column;

      p {
        height: 8rem;
        letter-spacing: -1rem;
        font-size: 8rem;
      }
    }

    .air-max {
      color: var(--sub-header-text);
      position: absolute;
      bottom: 7.5rem;
      left: -6rem;
      font-size: 2rem;
    }

    .created {
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      gap: 2.5rem;

      p {
        color: var(--main-header-text);
        font-size: 1.2rem;
        white-space: nowrap;
        position: relative;
        bottom: 0.75rem;

        &:first-child {
          color: var(--sub-header-text);
        }
      }
    }

    .main-sneaker {
      width: 64rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .bottom {
    width: 100%;
    position: absolute;
    bottom: 1rem;
    padding: 0 1rem;
    display: flex;
    gap: 1.5rem;
    align-items: end;

    .line {
      flex: 1;
      height: 0.25rem;
      background: var(--main-header-text);
    }

    .card {
      width: 10rem;
      aspect-ratio: 1 / 1;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      position: relative;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: end;
      transition: 0.4s;
      cursor: pointer;
      color: var(--main-header-text);
      outline: solid 0.25rem var(--main-header-text);

      &:hover {
        bottom: 1rem;
      }

      img {
        width: 50%;
        aspect-ratio: 1 / 1;
        margin-bottom: auto;
      }

      p {
        font-size: 1.25rem;
      }

      span {
        font-size: 1rem;
        margin-bottom: 0.25rem;
        opacity: 0.5;
      }
    }
  }
}

/* Планшеты */
@media (max-width: 1024px) {
  main h1 {
    .nike {
      font-size: 14rem;
      letter-spacing: -1rem;
    }

    .just {
      left: -3.5rem;

      p {
        height: 4rem;
        font-size: 4rem;
        letter-spacing: -0.5rem;
      }
    }

    .air-max {
      bottom: 3.5rem;
      left: -3rem;
      font-size: 1rem;
    }

    .created {
      gap: 1.5rem;

      p {
        font-size: 0.8rem;
      }
    }

    .main-sneaker {
      width: 32rem;
    }
  }

  main .bottom .card {
    width: 8rem;
    height: 3rem;
    font-size: 0.8rem;
  }
}

/* Маленькие планшеты */
@media (max-width: 768px) {
  main {
    justify-content: center !important;
  }
  main h1 {
    .nike {
      font-size: 10rem;
      letter-spacing: -0.6rem;
    }

    .just {
      left: -2.5rem;

      p {
        height: 3rem;
        font-size: 3rem;
        letter-spacing: -0.3rem;
      }
    }

    .air-max {
      bottom: 2.5rem;
      left: -2rem;
      font-size: 0.8rem;
    }

    .created {
      gap: 1rem;

      p {
        font-size: 0.7rem;
      }
    }

    .main-sneaker {
      width: 24rem;
    }
  }

  main .bottom .card {
    width: 6rem;
    height: 2.5rem;
    font-size: 0.7rem;

    &:hover {
      bottom: 1rem;
    }
  }
}

/* Большие телефоны */
@media (max-width: 640px) {
  main h1 {
    transform: rotate(90deg);
  }
}

/* Телефоны */
@media (max-width: 480px) {
  .nike {
    font-size: 8rem;
    letter-spacing: -0.4rem;
  }

  .just {
    left: -2rem;

    p {
      height: 2.5rem;
      font-size: 2.5rem;
      letter-spacing: -0.25rem;
    }
  }

  .air-max {
    bottom: 2rem;
    left: -1.5rem;
    font-size: 0.7rem;
  }

  .created {
    gap: 0.8rem;

    p {
      font-size: 0.6rem;
    }
  }

  .main-sneaker {
    width: 20rem;
  }

  .bottom {
    flex-direction: column;
  }
}

/* Очень маленькие телефоны */
@media (max-width: 360px) {
  main h1 {
    .nike {
      font-size: 6rem;
      letter-spacing: -0.3rem;
    }

    .just {
      left: -1.5rem;

      p {
        height: 2rem;
        font-size: 2rem;
        letter-spacing: -0.2rem;
      }
    }

    .air-max {
      bottom: 1.5rem;
      left: -1rem;
      font-size: 0.6rem;
    }

    .created {
      gap: 0.6rem;

      p {
        font-size: 0.5rem;
      }
    }

    .main-sneaker {
      width: 16rem;
    }
  }

  main .bottom {
    padding: 0 0.5rem;
    gap: 0.5rem;

    .card {
      width: 4rem;
      height: 1.5rem;
      font-size: 0.5rem;
    }
  }
}
</style>
