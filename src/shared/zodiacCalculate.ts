import { LocaleZodiac } from '../users/interfaces/userData';

const zodiacSigns: { sign: keyof typeof LocaleZodiac; start: string; end: string }[] = [
  { sign: 'Capricorn', start: '01-01', end: '01-19' },
  { sign: 'Capricorn', start: '12-22', end: '12-31' },
  { sign: 'Aquarius', start: '01-20', end: '02-18' },
  { sign: 'Pisces', start: '02-19', end: '03-20' },
  { sign: 'Aries', start: '03-21', end: '04-19' },
  { sign: 'Taurus', start: '04-20', end: '05-20' },
  { sign: 'Gemini', start: '05-21', end: '06-20' },
  { sign: 'Cancer', start: '06-21', end: '07-22' },
  { sign: 'Leo', start: '07-23', end: '08-22' },
  { sign: 'Virgo', start: '08-23', end: '09-22' },
  { sign: 'Libra', start: '09-23', end: '10-22' },
  { sign: 'Scorpio', start: '10-23', end: '11-21' },
  { sign: 'Sagittarius', start: '11-22', end: '12-21' },
];

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export const getZodiacSign = (dateStr: string) => {
  const [day, month, year] = dateStr.split('-').map(Number);

  const leapYearAdjustment = isLeapYear(year) ? 1 : 0;
  const adjustedZodiacSigns = zodiacSigns.map((zodiac) => {
    if (zodiac.sign === 'Pisces' && zodiac.end === '02-20') {
      return {
        ...zodiac,
        end: leapYearAdjustment ? '02-29' : '02-28',
      };
    }
    return zodiac;
  });

  const formattedDate = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  for (const zodiac of adjustedZodiacSigns) {
    if ((formattedDate >= zodiac.start && formattedDate <= zodiac.end) || (zodiac.start > zodiac.end && (formattedDate >= zodiac.start || formattedDate <= zodiac.end))) {
      return zodiac.sign;
    }
  }
  throw new Error('Unknown zodiac sign');
};
