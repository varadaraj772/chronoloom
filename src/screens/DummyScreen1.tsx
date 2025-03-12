import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import notifee, {
  IntervalTrigger,
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
  TimeUnit,
} from '@notifee/react-native';

const DummyScreen1 = () => {
  async function scheduleNotification() {
    try {
      // Request notification permissions
      await notifee.requestPermission();

      // Create a notification channel (Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      // Set up the trigger for 30 seconds later
      const trigger: IntervalTrigger = {
        type: TriggerType.INTERVAL,
        interval: 15,
        timeUnit: TimeUnit.MINUTES,
      };

      // Schedule the notification
      await notifee.createTriggerNotification(
        {
          title: 'Reminder',
          body: 'This is a repeated notification every 10 seconds.',
          android: {
            channelId,
          },
        },
        trigger,
      );

      console.log('Notification scheduled successfully.');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  return (
    <View style={styles.dummyScreen}>
      <Text>Dummy Screen 1</Text>
      <Button
        title="Schedule Notification"
        onPress={() => scheduleNotification()}
      />
    </View>
  );
};

export default DummyScreen1;

const styles = StyleSheet.create({
  dummyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
