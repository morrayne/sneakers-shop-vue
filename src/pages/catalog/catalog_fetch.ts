// supabase
import { supabase } from "../../helper/supabase";

// получение массива цветов
export async function fetchColors(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("sneakers").select("colors");
    if (error) throw error;
    const uniqueColors = new Set<string>();
    data.forEach((item: any) => {
      item.colors.forEach((color: any) => {
        if (color.folder_name) {
          uniqueColors.add(color.folder_name);
        }
      });
    });
    return Array.from(uniqueColors);
  } catch (error) {
    console.error("Error fetching colors:", error);
    return [];
  }
}

// получение массива брендов
export async function fetchBrands(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("sneakers").select("brand");
    if (error) throw error;
    const uniqueBrands = new Set<string>();
    data.forEach((item: any) => {
      if (item.brand) {
        uniqueBrands.add(item.brand);
      }
    });
    return Array.from(uniqueBrands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

// получение массива гендеров
export async function fetchGenders(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("sneakers").select("gender");
    if (error) throw error;
    const uniqueGenders = new Set<string>();
    data.forEach((item: any) => {
      if (item.gender) {
        uniqueGenders.add(item.gender);
      }
    });
    return Array.from(uniqueGenders);
  } catch (error) {
    console.error("Error fetching genders:", error);
    return [];
  }
}