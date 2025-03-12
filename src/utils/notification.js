import {Alert} from 'react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {getFCMToken, setFCMToken, getReminders} from './storage';

// Define constants and keys
const Config = {
  topicFCM: 'your_topic_name', // Replace with your topic name
};

// Function to request notification permission and FCM token
export const requestPermissionAndGetToken = async () => {
  try {
    // Request notification permission
    const authorizationStatus = await notifee.requestPermission();

    if (authorizationStatus.authorizationStatus == 1) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
      return;
    }

    await batteryOptimizationCheck();
    await powerManagerCheck();

    // Get FCM token
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);

    // Store the token in MMKV if it's not already stored
    if (!getFCMToken()) {
      setFCMToken(fcmToken);
    }

    // Subscribe to FCM topic
    subscribeToTopic();
    return fcmToken;
  } catch (error) {
    console.error('Error requesting permission or getting FCM token:', error);
  }
};

// Function to subscribe to FCM topic
const subscribeToTopic = async () => {
  try {
    await messaging().subscribeToTopic(Config.topicFCM);
    console.log(`Subscribed to topic: ${Config.topicFCM}`);
  } catch (error) {
    console.log('Error subscribing to topic:', error.message || error);
  }
};

// Function to handle background and foreground notifications
export const setupNotificationListeners = () => {
  // Foreground notification listener
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification received:', remoteMessage);
    displayNotification(remoteMessage);
  });

  // Background notification listener
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background notification received:', remoteMessage);
    displayNotification(remoteMessage);
  });
};

// Display notification using Notifee
const displayNotification = async message => {
  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    android: {
      channelId: 'default',
    },
    ios: {
      sound: 'default',
    },
  });
};

// Function to check reminders and send notifications if time left is less than 1 day
export const checkRemindersAndNotify = async () => {
  const reminders = getReminders(); // Get reminders from storage
  const currentTime = new Date().getTime(); // Get current time in milliseconds
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  reminders.forEach(reminder => {
    const reminderTime = new Date(reminder.date).getTime(); // Get reminder time in milliseconds
    const timeLeft = reminderTime - currentTime;

    if (timeLeft < oneDayInMilliseconds && timeLeft > 0) {
      // Send notification if the reminder is less than 1 day away
      notifee.displayNotification({
        title: 'Reminder',
        body: reminder.description,
        android: {
          channelId: 'default',
        },
        ios: {
          sound: 'default',
        },
      });
    }
  });
};

// Function to handle battery optimization check
const batteryOptimizationCheck = async () => {
  const batteryOptimizationEnabled =
    await notifee.isBatteryOptimizationEnabled();
  if (batteryOptimizationEnabled) {
    Alert.alert(
      'Restrictions Detected',
      'To ensure notifications are delivered, please disable battery optimization for the app.',
      [
        {
          text: 'OK, open settings',
          onPress: async () => await notifee.openBatteryOptimizationSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }
};

// Function to check power manager settings
const powerManagerCheck = async () => {
  const powerManagerInfo = await notifee.getPowerManagerInfo();
  if (powerManagerInfo.activity) {
    Alert.alert(
      'Restrictions Detected',
      'To ensure notifications are delivered, please adjust your settings to prevent the app from being killed',
      [
        {
          text: 'OK, open settings',
          onPress: async () => await notifee.openPowerManagerSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }
};

// Example of how to use it
export const initApp = async () => {
  // Request permission and get token
  await requestPermissionAndGetToken();

  // Set up notification listeners
  setupNotificationListeners();

  // Check reminders and send notifications
  checkRemindersAndNotify();
};
