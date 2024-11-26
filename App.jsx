import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {
  Drawer as PaperDrawer,
  Menu,
  FAB,
  Searchbar,
  Provider,
  IconButton,
} from 'react-native-paper';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import moment from 'moment';
import {getReminders, saveReminders} from './src/utils/storage';
import ReminderList from './src/components/ReminderList';
import ReminderModal from './src/components/ReminderModal';

const Drawer = createDrawerNavigator();

const HomeScreen = ({sortBy, sortOrder, onSort, frequencyFilter}) => {
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load reminders on mount
    const loadReminders = async () => {
      const savedReminders = await getReminders();
      setReminders(savedReminders || []);
      setFilteredReminders(savedReminders || []);
    };
    loadReminders();
  }, []);

  useEffect(() => {
    // Reapply filters whenever reminders change
    handleSearch(searchQuery);
  }, [reminders]);

  useEffect(() => {
    // Sort reminders when sorting options change
    handleSort(sortBy, sortOrder);
  }, [sortBy, sortOrder]);

  useEffect(() => {
    // Apply frequency filter when it changes
    handleFrequencyFilter(frequencyFilter);
  }, [frequencyFilter, reminders]);

  const handleAddOrUpdateReminder = reminder => {
    let updatedReminders;
    if (currentReminder) {
      // Update existing reminder
      updatedReminders = reminders.map(r =>
        r.id === currentReminder.id ? {...currentReminder, ...reminder} : r,
      );
    } else {
      // Add new reminder
      updatedReminders = [
        ...reminders,
        {
          id: Date.now().toString(),
          createdAt: moment().toISOString(),
          ...reminder,
        },
      ];
    }
    setReminders(updatedReminders);
    saveReminders(updatedReminders); // Persist changes
    setModalVisible(false);
    setCurrentReminder(null);
  };

  const handleDeleteReminder = id => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    setReminders(updatedReminders);
    saveReminders(updatedReminders); // Persist changes
  };

  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = reminders.filter(
      reminder =>
        reminder.description.toLowerCase().includes(query.toLowerCase()) ||
        moment(reminder.date)
          .format('MMMM Do YYYY')
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        reminder.category.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredReminders(filtered);
  };

  const handleSort = (by, order) => {
    const sortedReminders = [...reminders].sort((a, b) => {
      const dateA = moment(a[by]);
      const dateB = moment(b[by]);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredReminders(sortedReminders);
  };

  const handleFrequencyFilter = frequency => {
    console.log(frequency);
    if (!frequency) {
      setFilteredReminders(reminders);
      return;
    }
    if (frequency === 'all') {
      setFilteredReminders(reminders);
      return;
    }
    const filtered = reminders.filter(
      reminder => reminder.frequency === frequency,
    );
    setFilteredReminders(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search Reminders"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ReminderList
        reminders={filteredReminders}
        onEdit={reminder => {
          setCurrentReminder(reminder);
          setModalVisible(true);
        }}
        onDelete={handleDeleteReminder}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <ReminderModal
        visible={isModalVisible}
        onDismiss={() => {
          setCurrentReminder(null);
          setModalVisible(false);
        }}
        onSubmit={handleAddOrUpdateReminder}
        initialData={currentReminder}
      />
    </SafeAreaView>
  );
};

const DummyScreen1 = () => (
  <View style={styles.dummyScreen}>
    <Text>Dummy Screen 1</Text>
  </View>
);

const DummyScreen2 = () => (
  <View style={styles.dummyScreen}>
    <Text>Dummy Screen 2</Text>
  </View>
);

const CustomDrawerContent = ({navigation, setFrequencyFilter}) => {
  return (
    <DrawerContentScrollView>
      <PaperDrawer.Section>
        <PaperDrawer.Item
          label="Home"
          icon="home"
          onPress={() => {
            setFrequencyFilter('all');
            navigation.closeDrawer();
          }}
        />
        <PaperDrawer.Item
          label="Dummy Screen 1"
          icon="account"
          onPress={() => navigation.navigate('Dummy Screen 1')}
        />
        <PaperDrawer.Item
          label="Dummy Screen 2"
          icon="account-outline"
          onPress={() => navigation.navigate('Dummy Screen 2')}
        />
      </PaperDrawer.Section>

      <PaperDrawer.Section title="Frequency">
        <PaperDrawer.Item
          label="Daily"
          icon="clock-time-four"
          onPress={() => {
            setFrequencyFilter('Daily');
            navigation.closeDrawer();
          }}
        />
        <PaperDrawer.Item
          label="Monthly"
          icon="calendar-month"
          onPress={() => {
            setFrequencyFilter('Monthly');
            navigation.closeDrawer();
          }}
        />
        <PaperDrawer.Item
          label="Quarterly"
          icon="calendar-range"
          onPress={() => {
            setFrequencyFilter('Quarterly');
            navigation.closeDrawer();
          }}
        />
        <PaperDrawer.Item
          label="Yearly"
          icon="calendar"
          onPress={() => {
            setFrequencyFilter('Yearly');
            navigation.closeDrawer();
          }}
        />
      </PaperDrawer.Section>
    </DrawerContentScrollView>
  );
};

const App = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const [frequencyFilter, setFrequencyFilter] = useState('');

  const handleSort = (by, order) => {
    setSortBy(by);
    setSortOrder(order);
    setMenuVisible(false);
  };

  return (
    <Provider>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={props => (
            <CustomDrawerContent
              {...props}
              setFrequencyFilter={setFrequencyFilter}
            />
          )}
          screenOptions={{
            headerRight: () => (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="sort"
                    size={20}
                    onPress={() => setMenuVisible(true)}
                  />
                }>
                <Menu.Item
                  leadingIcon="sort-descending"
                  onPress={() => handleSort('createdAt', 'asc')}
                  title="Creation Date"
                />
                <Menu.Item
                  leadingIcon="sort-descending"
                  onPress={() => handleSort('completedAt', 'asc')}
                  title="Completion Date"
                />
                <Menu.Item
                  leadingIcon="sort-ascending"
                  onPress={() => handleSort('createdAt', 'desc')}
                  title="Creation Date"
                />
                <Menu.Item
                  leadingIcon="sort-ascending"
                  onPress={() => handleSort('completedAt', 'desc')}
                  title="Completion Date"
                />
              </Menu>
            ),
          }}>
          <Drawer.Screen name="Chronoloom">
            {props => (
              <HomeScreen
                {...props}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                frequencyFilter={frequencyFilter}
              />
            )}
          </Drawer.Screen>
          <Drawer.Screen name="Dummy Screen 1" component={DummyScreen1} />
          <Drawer.Screen name="Dummy Screen 2" component={DummyScreen2} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 5,
  },
  searchContainer: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  dummyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
