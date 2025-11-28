<script setup lang="ts">
// vue
import { ref, watch } from "vue";

//
import header_home from "../../common/header/header_home.vue";
import wrapper_home from "../../common/wrapper/wrapper_home.vue";

// data
const active = ref(localStorage.getItem('homeTheme'));
const data = ref([
  {
    folderName: 'green',
    characterName: 'Anaxa',
    color1: '#b7cfbe',
    color2: '#94b19d',
  },
  {
    folderName: 'pink', 
    characterName: 'Evernight',
    color1: '#d9753b',
    color2: '#87224f',
  },
  {
    folderName: 'blue',
    characterName: 'Cerydra', 
    color1: '#239dce',
    color2: '#0c5096',
  },
  {
    folderName: 'yellow',
    characterName: 'Aglaea',
    color1: '#facb3f',
    color2: '#107720',
  }
]);

// Находим активную тему по folderName
const findActiveThemeIndex = () => {
  return data.value.findIndex(item => item.folderName === active.value);
};

// Функция для применения темы
const applyTheme = (folderName: string | null) => {
  const htmlElement = document.documentElement;
  if (folderName) {
    htmlElement.setAttribute('data-home-theme', folderName);
  } else {
    // Если тема не установлена, применяем первую по умолчанию
    htmlElement.setAttribute('data-home-theme', data.value[0]!.folderName);
    active.value = data.value[0]!.folderName;
  }
};

// Функция смены темы
function changeTheme(index: number) {
  const theme = data.value[index];
  if (theme) {
    active.value = theme.folderName;
    localStorage.setItem('homeTheme', theme.folderName);
    applyTheme(theme.folderName);
  }
}

// Следим за изменениями в localStorage
const handleStorageChange = () => {
  const newTheme = localStorage.getItem('homeTheme');
  if (newTheme !== active.value) {
    active.value = newTheme;
    applyTheme(newTheme);
  }
};

// Инициализация при загрузке компонента

  window.addEventListener('storage', handleStorageChange);


// Следим за изменениями active
watch(active, (newTheme) => {
  applyTheme(newTheme);
});

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
        <div class="air-max">
          Nike Air Max Plus
        </div>
        <div class="created">
          <p>sneakers shop vue</p>
          <p>created by 4lyne</p>
        </div>
        <img class="main-sneaker" :src="getSneakerImagePath()" alt="Nike Air Max Plus">
      </h1>
      <div class="bottom">
        <div class="line"></div>
        <div 
          class="card" 
          v-for="(item, index) in data" 
          :key="index" 
          @click="changeTheme(index)" 
          :style="{ background: `linear-gradient(-45deg, ${item.color1}, ${item.color2})` }"
          :class="{ active: item.folderName === active }"
        >
          {{ item.characterName }}
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
      width: 12rem;
      height: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      bottom: 0;
      transition: 0.4s;
      cursor: pointer;
      color: var(--main-header-text);
      outline: solid 2px var(--main-header-text);
      font-weight: bold;

      &:hover {
        bottom: 2rem;
      }
    }
  }
}
</style>
