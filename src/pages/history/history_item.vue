<script setup lang="ts">
import { computed } from "vue";

// props
const props = defineProps<{
  order: any;
  sneakers: any[];
}>();

// Находим информацию о товарах в заказе
const orderItems = computed(() => {
  return props.order.items.map((item) => {
    const sneaker = props.sneakers.find((s) => s.id === item.id);
    return { ...item, sneaker: sneaker || null };
  });
});

// Общая стоимость заказа
const totalCost = computed(() => {
  return orderItems.value.reduce((sum, item) => {
    return sum + (item.sneaker?.cost || 0);
  }, 0);
});
</script>

<template>
  <div class="order">
    <div class="order-header">
      <p>Order #{{ order.id }}</p>
      <p>{{ new Date(order.date).toLocaleDateString() }}</p>
      <p>Total cost: {{ totalCost }} rub</p>
    </div>
    <div class="order-items">
      <div v-for="item in orderItems" :key="`${item.id}-${item.color}-${item.size}`" class="order-item">
        <div class="item-image">
          <img :src="`/sneakers/${item.sneaker.id}-${item.sneaker.colors.find(c => c.name === item.color)?.folder_name || item.sneaker.colors[0]?.folder_name}/0.jpg`" :alt="item.sneaker.name" />
        </div>
        <div class="item-details">
          <div class="name">{{ item.sneaker?.name || "Товар" }}</div>
          <div class="color">{{ item.color }}</div>
          <div class="size">{{ item.size }}</div>
          <div class="price">{{ item.sneaker?.cost || 0 }} rub</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order {
  width: 100%;
  height: 100%;
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
    grid-template-columns: repeat(6, 1fr);
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
