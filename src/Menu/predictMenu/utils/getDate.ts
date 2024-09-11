export const getCurrentDay = () => {
  return new Date().toISOString().split('T')[0];
};

export const getNextDay = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  return currentDate.toISOString().split('T')[0];
};

export const getCurrentMonth = () => {
  const currentDate = new Date();
  return `${currentDate.toLocaleString('ru-RU', { month: 'long' })} ${currentDate.getFullYear().toString()} год`;
};

export const getNextMonth = () => {
  const currentDate = new Date();
  const nextMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
  );
  return `${nextMonthDate.toLocaleString('ru-RU', { month: 'long' })} ${nextMonthDate.getFullYear().toString()} год`;
};

export const getCurrentWeek = () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  const endOfWeek = new Date(currentDate);

  const dayOfWeek = startOfWeek.getDay();

  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const startWeek = new Date(
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday),
  )
    .toISOString()
    .split('T')[0];
  const endWeek = new Date(endOfWeek.setDate(startOfWeek.getDate() + 6))
    .toISOString()
    .split('T')[0];

  return { startWeek, endWeek };
};

export const getNextWeek = () => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();

  const startOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfNextWeek = new Date(currentDate);
  startOfNextWeek.setDate(currentDate.getDate() + startOffset + 7);
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
  const startNextWeek = startOfNextWeek.toISOString().split('T')[0];
  const endNextWeek = endOfNextWeek.toISOString().split('T')[0];
  return {
    startNextWeek,
    endNextWeek,
  };
};

export const getCurrentYear = () => {
  return new Date().getFullYear().toString();
};

export const getNextYear = () => {
  return (new Date().getFullYear() + 1).toString();
};
