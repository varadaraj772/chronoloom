import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const getReminders = () => {
  const reminders = storage.getString('reminders');
  return reminders ? JSON.parse(reminders) : [];
};

export const saveReminders = (reminders) => {
  storage.set('reminders', JSON.stringify(reminders));
};
