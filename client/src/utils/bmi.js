// فقط توابع و ثابت‌ها — بدون کامپوننت
export const BMI_CATEGORIES = ['کم‌وزن', 'طبیعی', 'اضافه‌وزن', 'چاق'];

export const calculateBMI = (weight, height) => {
  return parseFloat((weight / ((height / 100) ** 2)).toFixed(2));
};