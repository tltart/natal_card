export const isValidTime = (timeString: string): boolean => {
  const [hour, minutes] = timeString.split(':').map(Number);
  if (Number.isNaN(Number(hour)) || Number.isNaN(Number(minutes))) return false;
  return !Number.isNaN(Number(hour)) && !Number.isNaN(Number(minutes)) && Number(hour) >= 0 && Number(hour) <= 23 && Number(minutes) >= 0 && Number(minutes) <= 59;
};
