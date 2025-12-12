<script setup lang="ts">
// components & vars
import { ref, onMounted } from 'vue';
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";

// Реактивные переменные для отслеживания текущих значений
const currentLang = ref<string>('ru');
const currentTheme = ref<string>('dark');
const currentHomeTheme = ref<string>('green');

// Инициализация значений при загрузке компонента
onMounted(() => {
  const htmlElement = document.documentElement;
  currentLang.value = localStorage.getItem('lang') || htmlElement.getAttribute('lang') || 'ru';
  currentTheme.value = localStorage.getItem('theme') || htmlElement.getAttribute('data-theme') || 'dark';
  currentHomeTheme.value = localStorage.getItem('homeTheme') || htmlElement.dataset.homeTheme || 'green';
  updateHtmlAttributes();
});

// Обновление атрибутов HTML
function updateHtmlAttributes() {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute("lang", currentLang.value);
  htmlElement.setAttribute("data-theme", currentTheme.value);
  htmlElement.setAttribute("data-home-theme", currentHomeTheme.value);
}

// Сохранение конфига
function saveConfig(field: string, val: string) {
  localStorage.setItem(field, val);
  if (field === "lang") {
    currentLang.value = val;
  } else if (field === "theme") {
    currentTheme.value = val;
  } else if (field === "homeTheme") {
    currentHomeTheme.value = val;
  }
  updateHtmlAttributes();
}
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div class="set">
        <p class="i18n" data-key="lang"></p>
        <div class="options">
          <button @click="saveConfig('lang', 'ru')" :class="`${currentLang === 'ru' ? 'i18n selected' : 'i18n'}`" data-key="ru"></button>
          <button @click="saveConfig('lang', 'en')" :class="`${currentLang === 'en' ? 'i18n selected' : 'i18n'}`" data-key="en"></button>
        </div>
      </div>
      <div class="set">
        <p class="i18n" data-key="common-theme"></p>
        <div class="options">
          <button @click="saveConfig('theme', 'dark')" :class="`${currentTheme === 'dark' ? 'i18n selected' : 'i18n'}`" data-key="dark"></button>
          <button @click="saveConfig('theme', 'light')" :class="`${currentTheme === 'light' ? 'i18n selected' : 'i18n'}`" data-key="light"></button>
        </div>
      </div>
      <div class="set">
        <p class="i18n" data-key="home-screen-theme"></p>
        <div class="options">
          <button @click="saveConfig('homeTheme', 'green')" :class="`${currentHomeTheme === 'green' ? 'i18n selected' : 'i18n'}`" data-key="green"></button>
          <button @click="saveConfig('homeTheme', 'pink')" :class="`${currentHomeTheme === 'pink' ? 'i18n selected' : 'i18n'}`" data-key="pink"></button>
          <button @click="saveConfig('homeTheme', 'blue')" :class="`${currentHomeTheme === 'blue' ? 'i18n selected' : 'i18n'}`" data-key="blue"></button>
          <button @click="saveConfig('homeTheme', 'yellow')" :class="`${currentHomeTheme === 'yellow' ? 'i18n selected' : 'i18n'}`" data-key="yellow"></button>
        </div>
      </div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  display: grid;
  padding: 1rem;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  .set {
    height: fit-content;
    padding: 0.75rem;
    background: var(--bg-c);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .options {
      display: grid;
      gap: 0.5rem;
      grid-template-columns: repeat(4, 1fr);

      button {
        flex: 1;
        padding: 0.2rem 0.5rem;
        border-radius: 0.35rem;
        text-align: center;
        font-size: 0.8rem;
        color: var(--text-a);
        background: var(--bg-d);
      }

      .selected {
        background: var(--accent-a);
      }
    }
  }
}

.i18n {
  color: transparent;
  &[data-key="lang"]::after {
    content: var(--lang);
  } &[data-key="common-theme"]::after {
    content: var(--common-theme);
  } &[data-key="home-screen-theme"]::after {
    content: var(--home-screen-theme);
  } &[data-key="ru"]::after {
    content: var(--ru);
  } &[data-key="en"]::after {
    content: var(--en);
  } &[data-key="dark"]::after {
    content: var(--dark);
  } &[data-key="light"]::after {
    content: var(--light);
  } &[data-key="green"]::after {
    content: var(--green);
  } &[data-key="pink"]::after {
    content: var(--pink);
  } &[data-key="blue"]::after {
    content: var(--blue);
  } &[data-key="yellow"]::after {
    content: var(--yellow);
  } &::after {
    color: var(--text-a);
  }
}

@media (max-width: 1024px) {
  main {
    height: fit-content;
    display: flex;
    flex-direction: column;
  }
}
</style>
