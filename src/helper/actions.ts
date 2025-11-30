// imports
import { supabase } from "./imp/supabase";
import { useGlobalState } from "./pinia";
import type { user_type, product_item } from "./types";

// 🔧 Проверка гостя
function isGuest(user: user_type | null): boolean { return !user || user.id === "Guest" }

// 🔐 ИНИЦИАЛИЗАЦИЯ (гость или восстановление сессии)
export async function initAuth() {
  const global = useGlobalState();
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if (user) {
    await syncPiniaAndSupabase(user.id);
  } else {
    global.setUser({
      id: "Guest",
      email: "",
      password: "",
      name: "Guest",
      icon: 0,
      favourite: [],
      basket: [],
      history: [],
    });
  }
}

// 🔐 РЕГИСТРАЦИЯ
export async function registerUser(form: Pick<user_type, "email" | "password" | "name" | "icon">) {
  const global = useGlobalState();
  const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password });
  if (authError) throw authError;
  if (!authData.user) throw new Error("Ошибка регистрации: пользователь не создан");
  const { error: insertError } = await supabase.from("profiles").insert([{
    id: authData.user.id,
    name: form.name,
    icon: form.icon,
    favourite: [],
    basket: [],
    history: []
  }]);
  if (insertError) throw insertError;
  await syncPiniaAndSupabase(authData.user.id);
  console.log("✅ Зарегистрирован:", global.user);
  return authData.user.id;
}

// 🔐 ВХОД
export async function loginUser(email: string, password: string) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) throw authError;
  if (!authData.user) throw new Error("Ошибка авторизации: пользователь не найден");
  await syncPiniaAndSupabase(authData.user.id);
  console.log("✅ Вход выполнен");
}

// 🔐 ВЫХОД
export async function logoutUser() {
  const global = useGlobalState();
  const { error } = await supabase.auth.signOut();
  global.setUser({
    id: "Guest",
    email: "",
    password: "",
    name: "Guest",
    icon: 0,
    favourite: [],
    basket: [],
    history: [],
  });
  if (error) console.warn("Ошибка при выходе:", error.message);
  else console.log("✅ Выход выполнен");
}

// 🔄 СИНХРОНИЗАЦИЯ SUPABASE → PINIA
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

// 🛒 КОРЗИНА
export async function addToBasket(item: product_item) {
  const global = useGlobalState();
  const user = global.user;
  if (!user) return;
  const newBasket = [...user.basket, item];
  if (isGuest(user)) {
    global.updateUserField("basket", newBasket);
  } else {
    await updateUserField("basket", newBasket);
  }
}

export async function removeFromBasket(item: product_item) {
  const global = useGlobalState();
  const user = global.user;
  if (!user) return;
  const newBasket = user.basket.filter((b) => !(b.id === item.id && b.color === item.color && b.size === item.size));
  if (isGuest(user)) {
    global.updateUserField("basket", newBasket);
  } else {
    await updateUserField("basket", newBasket);
  }
}

// ⭐ ИЗБРАННОЕ
export async function addToFavourites(item: product_item) {
  const global = useGlobalState();
  const user = global.user;
  if (!user) return;
  const newFavs = [...user.favourite, item];
  if (isGuest(user)) {
    global.updateUserField("favourite", newFavs);
  } else {
    await updateUserField("favourite", newFavs);
  }
}

export async function removeFromFavourites(item: product_item) {
  const global = useGlobalState();
  const user = global.user;
  if (!user) return;
  const newFavs = user.favourite.filter((f) => !(f.id === item.id && f.color === item.color && f.size === item.size));
  if (isGuest(user)) {
    global.updateUserField("favourite", newFavs);
  } else {
    await updateUserField("favourite", newFavs);
  }
}

// 🧱 Обновление полей профиля в Supabase
type UpdatableFields = "favourite" | "basket" | "history";
export async function updateUserField(field: UpdatableFields, value: any[]) {
  const global = useGlobalState();
  const user = global.user;
  if (!user || isGuest(user)) return;
  try {
    const { data, error } = await supabase.from("profiles").update({ [field]: value }).eq("id", user.id).select();
    if (error) throw error;
    if (!data?.length) throw new Error("Запрос выполнен, но профиль не найден");
    global.updateUserField(field, [...value]);
    return data[0];
  } catch (err: any) {
    console.error(`Ошибка обновления поля "${field}":`, err.message ?? err);
    throw err;
  }
}
