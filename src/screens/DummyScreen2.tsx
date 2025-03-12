import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import React from 'react';
import notifee, {
  TriggerType,
  TimestampTrigger,
  AndroidImportance,
} from '@notifee/react-native';
import {getReminders} from '../utils/storage'; // Assuming you use AsyncStorage for storing reminders

const DummyScreen2 = () => {
  const scheduleNotificationsForReminders = async () => {
    try {
      // Request permissions (iOS)
      await notifee.requestPermission();

      // Create a notification channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      const reminders = getReminders();
      console.log('Reminders----->>', reminders);

      // Iterate through reminders and schedule notifications
      for (const reminder of reminders) {
        const reminderDate = new Date(reminder.date).getTime();
        const notificationTime = reminderDate - 10 * 60 * 1000; // 10 minutes before the reminder date
        const currentTime = Date.now();

        if (notificationTime > currentTime) {
          // Schedule the notification
          const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: notificationTime,
          };

          await notifee.createTriggerNotification(
            {
              title: 'Reminder from Chronoloom',
              body: `Reminder: ${reminder.description}`,
              android: {
                channelId,
              },
            },
            trigger,
          );
          Alert.alert(
            `Notification scheduled for: ${new Date(notificationTime)}`,
          );
          console.log(
            `Notification scheduled for: ${new Date(notificationTime)}`,
          );
        } else {
          Alert.alert(
            `Skipped scheduling for past reminder: ${reminder.description}`,
          );
          console.log(
            `Skipped scheduling for past reminder: ${reminder.description}`,
          );
        }
      }

    } catch (error) {
      console.error('Error scheduling notifications:', error);
      Alert.alert('Error', 'Failed to schedule notifications.');
    }
  };

  return (
    <View style={styles.dummyScreen}>
      <Text>DummyScreen2</Text>
      <Button
        title="Schedule Reminder Notifications"
        onPress={scheduleNotificationsForReminders}
      />
    </View>
  );
};

export default DummyScreen2;

const styles = StyleSheet.create({
  dummyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
