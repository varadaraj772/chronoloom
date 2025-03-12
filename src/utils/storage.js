import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const KEY_APP_TOKEN = 'fcmToken';
const KEY_REMINDERS = 'reminders';


export const getFCMToken = () => {
  return storage.getString(KEY_APP_TOKEN);
};

export const setFCMToken = (token) => {
  storage.set(KEY_APP_TOKEN, token);
};

export const getReminders = () => {
  const reminders = storage.getString(KEY_REMINDERS);
  return reminders ? JSON.parse(reminders) : [];
};

export const saveReminders = (reminders) => {
  storage.set(KEY_REMINDERS, JSON.stringify(reminders));
};
