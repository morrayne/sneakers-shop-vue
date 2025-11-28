<script setup lang="ts">
import { computed } from "vue";

// types
interface SneakerColor {
  name: string;
  folder_name: string;
}

interface Sneaker {
  id: number;
  name: string;
  cost: number;
  colors: SneakerColor[];
}

interface OrderItem {
  id: number;
  color: string;
  size: string;
}

interface Order {
  id: number;
  date: string;
  items: OrderItem[];
  total?: number;
  status?: string;
}

// props
const props = defineProps<{
  order: Order;
  sneakers: Sneaker[];
}>();

// Функция для получения переведенного текста
function getTranslatedText(key: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${key}`);
  return value ? value.replace(/^"(.*)"$/, '$1') : key;
}

// Функция для получения переведенной валюты
function getTranslatedRub(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--rub');
  return value ? value.replace(/^"(.*)"$/, '$1') : 'rub';
}

// Находим информацию о товарах в заказе
const orderItems = computed(() => {
  return props.order.items.map((item: OrderItem) => {
    const sneaker = props.sneakers.find((s: Sneaker) => s.id === item.id);
    return { ...item, sneaker: sneaker || null };
  });
});

// Общая стоимость заказа
const totalCost = computed((): number => {
  return orderItems.value.reduce((sum: number, item: any) => {
    return sum + (item.sneaker?.cost || 0);
  }, 0);
});
</script>

<template>
  <div class="order">
    <div class="order-header">
      <p>{{ getTranslatedText('order') }} #{{ order.id }}</p>
      <p>{{ new Date(order.date).toLocaleDateString() }}</p>
      <p>{{ getTranslatedText('totalCost') }}: {{ totalCost }} {{ getTranslatedRub() }}</p>
    </div>
    <div class="order-items">
      <div
        v-for="item in orderItems"
        :key="`${item.id}-${item.color}-${item.size}`"
        class="order-item"
      >
        <div class="item-image">
          <img
            v-if="item.sneaker"
            :src="`/sneakers/${item.sneaker.id}-${
              item.sneaker.colors.find((c: SneakerColor) => c.name === item.color)
                ?.folder_name || item.sneaker.colors[0]?.folder_name
            }/0.jpg`"
            :alt="item.sneaker.name"
          />
          <img v-else src="/public/gif/evernight.gif" alt="No image" />
        </div>
        <div class="item-details">
          <div class="name">{{ item.sneaker?.name || 'Товар' }}</div>
          <div class="color">{{ item.color }}</div>
          <div class="size">{{ item.size }}</div>
          <div class="price">{{ item.sneaker?.cost || 0 }} {{ getTranslatedRub() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .order-header {
    width: fit-content;
    display: flex;
    gap: 0.5rem;

    * {
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-a);
      background: var(--bg-c);
    }
  }

  .order-items {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;

    .order-item {
      background: var(--bg-c);
      border-radius: 0.5rem;
      padding: 1rem;

      .item-image {
        width: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          bottom: 0;
          left: 0;
          position: absolute;
        }
      }

      .item-details {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .name {
          max-width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .name,
        .price {
          width: 100%;
        }

        .color,
        .size {
          width: fit-content;
          padding: 0.2rem 0.5rem;
          border-radius: 0.35rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-a);
          background: var(--bg-d);
        }

        .name {
          font-size: 1.25rem;
        }

        .price {
          background: var(--text-b);
          color: var(--bg-a);
          text-align: center;
          padding: 0.5rem 0;
          border-radius: 0.5rem;
        }
      }
    }
  }
}
</style>
