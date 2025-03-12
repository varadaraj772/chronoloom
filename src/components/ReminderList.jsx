import React, {useState} from 'react';
import {StyleSheet, FlatList, View, Alert} from 'react-native';
import {IconButton, Card, Text, MD3Colors, Divider} from 'react-native-paper';
import moment from 'moment';

const ReminderList = ({reminders, onEdit, onDelete, onComplete}) => {
  const [expandedReminderId, setExpandedReminderId] = useState(null); // To track expanded card

  const getTimeLeft = date => {
    const now = moment();
    const reminderDate = moment(date);
    if (reminderDate.isBefore(now)) {
      return 'Past due';
    }
    return reminderDate.fromNow();
  };

  const handleToggleExpand = id => {
    setExpandedReminderId(prevId => (prevId === id ? null : id));
  };

  const confirmDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this reminder?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(id),
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <FlatList
      data={reminders}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        const isExpanded = item.id === expandedReminderId;
        return (
          <Card style={styles.card} onPress={() => handleToggleExpand(item.id)}>
            <Card.Title
              title={item.description}
              subtitle={item.category}
              right={() => (
                <View style={styles.iconContainer}>
                  <IconButton
                    mode="contained"
                    icon="pencil-outline"
                    onPress={() => onEdit(item)}
                    style={styles.iconButton}
                  />
                  <IconButton
                    mode="contained"
                    icon="delete"
                    iconColor={MD3Colors.error50}
                    onPress={() => confirmDelete(item.id)}
                    style={styles.iconButton}
                  />
                </View>
              )}
            />
            {isExpanded && (
              <>
                <Card.Content>
                  <Text style={styles.time}>
                    {`Scheduled on: ${moment(item.date).format(
                      'Do MMMM YYYY',
                    )}`}
                    {'\n'}
                    {`At ${moment(item.date).format('h:mm a')}`}
                  </Text>

                  <Text style={styles.timeLeft}>
                    {`Occurs: ${getTimeLeft(item.date)}`}
                  </Text>
                  <Divider style={styles.divider} />
                  <Text style={styles.frequency}>
                    {`Frequency: ${item.frequency}`}
                  </Text>
                </Card.Content>
              </>
            )}
          </Card>
        );
      }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No reminders added yet.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    elevation: 3,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 4,
  },
  timeLeft: {
    marginVertical: 8,
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  time: {
    marginTop: 8,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  frequency: {
    marginVertical: 8,
    color: '#28a745',

    fontSize: 14,
  },
  divider: {
    marginVertical: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default ReminderList;
