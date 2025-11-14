// imports
import { supabase } from "./supabase";
import { useGlobalState } from "./pinia";
import type { user_type, product_item } from "./types";

//  🔐  ДЕЙСТВИЯ С АККАУНТОМ
// регистрация нового пользователя
export async function registerUser(form: Pick<user_type, "email" | "password" | "name" | "icon">) {
  const global = useGlobalState();
  const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password });
  if (authError) throw authError;
  if (!authData.user) throw new Error("Ошибка регистрации: пользователь не создан");
  const { error: insertError } = await supabase.from("profiles").insert([
    {
      id: authData.user.id,
      name: form.name,
      icon: form.icon,
      favourite: [],
      basket: [],
      history: [],
    },
  ]);
  if (insertError) throw insertError;
  await syncPiniaAndSupabase(authData.user.id);
  console.log("✅ Зарегистрирован:", global.user);
  return authData.user.id;
}

// авторизация
export async function loginUser(email: string, password: string) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) throw authError;
  if (!authData.user) throw new Error("Ошибка авторизации: пользователь не найден");
  await syncPiniaAndSupabase(authData.user.id);
  console.log("✅ Вход выполнен");
}

// выход из профиля
export async function logoutUser() {
  const global = useGlobalState();
  const { error } = await supabase.auth.signOut();
  global.clearUser();
  if (error) console.warn("Ошибка при выходе:", error.message);
  else console.log("✅ Выход выполнен");
}

//  🔄  СИНХРОНИЗАЦИЯ
// перезапись профиля из Supabase в global.user (pinia)
export async function syncPiniaAndSupabase(user_id: string) {
  const global = useGlobalState();
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user_id).single();
  if (error) throw error;
  if (!profile) throw new Error("Профиль не найден");
  global.setUser({
    id: profile.id,
    email: profile.email ?? "",
    password: "",
    name: profile.name,
    icon: profile.icon,
    favourite: profile.favourite ?? [],
    basket: profile.basket ?? [],
    history: profile.history ?? [],
  });
}

//  🛒  ДЕЙСТВИЯ С ТОВАРАМИ
// добавление товара в корзину
export async function addToBasket(item: product_item) {
  const global = useGlobalState();
  if (global.user.id === "filler") throw new Error("Неавторизованный пользователь");
  const newBasket = [...global.user.basket, item];
  await updateUserField("basket", newBasket);
  global.user.basket = newBasket;
}

// удаление товара из корзины
export async function removeFromBasket(item: product_item) {
  const global = useGlobalState();
  const newBasket = global.user.basket.filter((b) => !(b.id === item.id && b.color === item.color && b.size === item.size));
  await updateUserField("basket", newBasket);
  global.user.basket = newBasket;
}

// добавление товара в избранное
export async function addToFavourites(item: product_item) {
  const global = useGlobalState();
  if (global.user.id === "filler") throw new Error("Неавторизованный пользователь");
  const newFavs = [...global.user.favourite, item];
  console.log(newFavs);
  await updateUserField("favourite", newFavs);
  global.user.favourite = newFavs;
}

// удаление из избранного
export async function removeFromFavourites(item: product_item) {
  const global = useGlobalState();
  const newFavs = global.user.favourite.filter((f) => !(f.id === item.id && f.color === item.color && f.size === item.size));
  await updateUserField("favourite", newFavs);
  global.user.favourite = newFavs;
}

//  🧱  СЛУЖЕБНЫЕ
// обновление данных профиля
type UpdatableFields = "favourite" | "basket" | "history";
export async function updateUserField(field: UpdatableFields, value: any[]) {
  const global = useGlobalState();
  if (!global.user.id || global.user.id === "filler") return;
  try {
    console.log("📤 Обновление профиля:", { id: global.user.id, field, value });
    const { data, error } = await supabase.from("profiles").update({ [field]: value }).eq("id", global.user.id).select();
    if (error) throw error;
    if (!data?.length) throw new Error("Запрос выполнен, но строка не найдена (надо проверить supabase RLS или id)");
    (global.user as any)[field] = [...value];
    console.log(`✅ Поле "${field}" обновлено`, data[0]);
    return data[0];
  } catch (err: any) {
    console.error(`Ошибка обновления поля "${field}":`, err.message ?? err);
    throw err;
  }
}
