export enum LocaleZodiac {
  Aquarius = 'Водолей',
  Pisces = 'Рыбы',
  Aries = 'Овен',
  Taurus = 'Телец',
  Gemini = 'Близнецы',
  Cancer = 'Рак',
  Leo = 'Лев',
  Virgo = 'Дева',
  Libra = 'Весы',
  Scorpio = 'Скорпион',
  Sagittarius = 'Стрелец',
  Capricorn = 'Козерог',
}

export interface IUserData {
  name: string | null;
  birthDate: string | null;
  zodiac: keyof typeof LocaleZodiac | null;
  birthTime: string | null;
  birthPlace: string | null;
}
