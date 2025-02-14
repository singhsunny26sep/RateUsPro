import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {COLORS} from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/core';
import {Instance} from '../api/Instance';

export default function ReviewsPage() {
  const navigation = useNavigation();

  // State Variables
  const [profileData, setProfileData] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [qrvalue, setQrvalue] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // State for Menu Modal
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };
  // Fetch Profile First
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token is missing');
        return;
      }

      const response = await Instance.get('/v1/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileData(response.data.result);
      setQrvalue(response.data.result._id);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchData = async () => {
    if (!qrvalue) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://rateus-backend.onrender.com/v1/api/rate/user/${qrvalue}`,
      );
      const result = await response.json();
      setData(result?.result || []);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (qrvalue) {
      fetchData();
    }
  }, [qrvalue]);

  const renderStars = rating => '⭐'.repeat(rating);

  return (
    <View style={styles.container}>
      {/* Header with Profile Image and Menu Icon */}
      <View style={styles.header}>
        <EvilIcons name="user" size={40} color={COLORS.blue} />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Genrate_My_QRCode')}>
            <MaterialIcons name="qr-code-scanner" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>User Reviews</Text>

      {/* Date Picker Buttons */}
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setOpenStart(true)}>
          <Text style={styles.dateButtonText}>{startDate.toDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setOpenEnd(true)}>
          <Text style={styles.dateButtonText}>{endDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={openStart}
        date={startDate}
        mode="date"
        onConfirm={date => {
          setOpenStart(false);
          setStartDate(date);
        }}
        onCancel={() => setOpenStart(false)}
      />

      <DatePicker
        modal
        open={openEnd}
        date={endDate}
        mode="date"
        onConfirm={date => {
          setOpenEnd(false);
          setEndDate(date);
        }}
        onCancel={() => setOpenEnd(false)}
      />

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.blue}
          style={{marginTop: 20}}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {data?.map((panel, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.name}>{panel.username}</Text>
            <Text style={styles.rating}>{renderStars(panel.star)}</Text>
            <Text style={styles.comment}>{panel.comment}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Menu Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ReviewForm');
              }}>
              <Ionicons name="person" size={24} color="black" />
              <Text style={styles.menuText}>FeedBack</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Settings');
              }}>
              <Ionicons name="settings" size={24} color="black" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="black" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
  },
});

