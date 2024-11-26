import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Text, Alert} from 'react-native';
import {Button, TextInput, Menu, Divider} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const ReminderForm = ({onSubmit, initialData = {}}) => {
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date ? new Date(initialData?.date) : new Date());
  const [category, setCategory] = useState(initialData?.category || '');
  const [frequency, setFrequency] = useState(initialData?.frequency || 'Daily'); // New state for frequency
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false); // Separate state for category menu
  const [frequencyMenuVisible, setFrequencyMenuVisible] = useState(false); // Separate state for frequency menu
  const [categoryDropIcon, setCategoryDropIcon] = useState('menu-down');
  const [frequencyDropIcon, setFrequencyDropIcon] = useState('menu-down'); // Separate icon for frequency

  const handleSubmit = () => {
    if (!description || !category || !frequency) {
      Alert.alert('Please fill all fields!');
      return;
    }

    onSubmit({description, date: date.toISOString(), category, frequency});
    setDescription('');
    setCategory('');
    setFrequency(''); // Reset frequency on submit
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create a New Reminder</Text>

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        placeholder="Enter reminder details"
      />

      <View style={styles.menuContainer}>
        <Menu
          mode="elevated"
          style={styles.menu}
          visible={categoryMenuVisible}
          onDismiss={() => setCategoryMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              icon={categoryDropIcon}
              onPress={() => setCategoryMenuVisible(true)}
              style={styles.menuButton}
              contentStyle={{flexDirection: 'row-reverse'}}>
              {category ? category : 'Select Category'}
            </Button>
          }>
          <Menu.Item
            leadingIcon="office-building"
            onPress={() => {
              setCategory('Work');
              setCategoryMenuVisible(false);
              setCategoryDropIcon('office-building');
            }}
            title="Work"
          />
          <Menu.Item
            leadingIcon="bag-personal"
            onPress={() => {
              setCategory('Personal');
              setCategoryMenuVisible(false);
              setCategoryDropIcon('bag-personal');
            }}
            title="Personal"
          />
          <Menu.Item
            leadingIcon="pill"
            onPress={() => {
              setCategory('Medicine');
              setCategoryMenuVisible(false);
              setCategoryDropIcon('pill');
            }}
            title="Medicine"
          />
          <Menu.Item
            leadingIcon="calendar-clock"
            onPress={() => {
              setCategory('Subscriptions');
              setCategoryMenuVisible(false);
              setCategoryDropIcon('calendar-clock');
            }}
            title="Subscriptions"
          />
          <Menu.Item
            leadingIcon="notification-clear-all"
            onPress={() => {
              setCategory('Other');
              setCategoryMenuVisible(false);
              setCategoryDropIcon('notification-clear-all');
            }}
            title="Other"
          />
        </Menu>
      </View>

      <View style={styles.menuContainer}>
        <Menu
          mode="elevated"
          style={styles.menu}
          visible={frequencyMenuVisible}
          onDismiss={() => setFrequencyMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              icon={frequencyDropIcon}
              onPress={() => setFrequencyMenuVisible(true)}
              style={styles.menuButton}
              contentStyle={{flexDirection: 'row-reverse'}}>
              {frequency ? frequency : 'Select Frequency'}
            </Button>
          }>
          <Menu.Item
            leadingIcon="clock-time-four"
            onPress={() => {
              setFrequency('Daily');
              setFrequencyMenuVisible(false);
              setFrequencyDropIcon('clock-time-four');
            }}
            title="Daily"
          />
          <Menu.Item
            leadingIcon="calendar-month"
            onPress={() => {
              setFrequency('Monthly');
              setFrequencyMenuVisible(false);
              setFrequencyDropIcon('calendar-month');
            }}
            title="Monthly"
          />
          <Menu.Item
            leadingIcon="calendar-range"
            onPress={() => {
              setFrequency('Quarterly');
              setFrequencyMenuVisible(false);
              setFrequencyDropIcon('calendar-range');
            }}
            title="Quarterly"
          />
          <Menu.Item
            leadingIcon="calendar"
            onPress={() => {
              setFrequency('Yearly');
              setFrequencyMenuVisible(false);
              setFrequencyDropIcon('calendar-year');
            }}
            title="Yearly"
          />
        </Menu>
      </View>

      <View style={styles.datePickerContainer}>
        <Button
          mode="outlined"
          onPress={() => setDatePickerVisible(true)}
          style={styles.dateButton}>
          {date ? `Date: ${date.toLocaleString()}` : 'Set Date and Time'}
        </Button>
        <DatePicker
          modal
          open={isDatePickerVisible}
          date={date}
          onConfirm={selectedDate => {
            setDate(selectedDate);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
          mode="datetime"
        />
      </View>

      <Divider style={styles.divider} />

      <Button
        textColor="white"
        icon="content-save-check"
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}>
        Save Reminder
      </Button>
    </ScrollView>
  );
};

export default ReminderForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 16,
    borderRadius: 8,
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuButton: {
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'center',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateButton: {
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  divider: {
    marginVertical: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  menu: {
    width: '80%',
    marginLeft: -15,
  },
});
