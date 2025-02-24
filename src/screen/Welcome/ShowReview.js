import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ScrollView, Image, } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { COLORS } from '../../theme';
import { Container } from '../../components/Container/Container';
import { scale, verticalScale, moderateScale } from '../../utils/Scalling';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Instance } from '../../api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SplashScreen from '../SplashScreen/SplashScreen';
import moment from 'moment';
const RatingStars = ({ rating }) => {

  let stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <AntDesign
        key={i}
        name={i < rating ? 'star' : 'staro'}
        size={moderateScale(16)}
        color={i < rating ? COLORS.orange : COLORS.grey}
      />,
    );
  }
  return (
    <View style={{ flexDirection: 'row', marginTop: scale(5) }}>{stars}</View>
  );
};

export default function ShowReview({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [qrvalue, setQrvalue] = useState('');
  const [hasFetched, setHasFetched] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [data, setData] = useState(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const response = await Instance.get('/v1/api/users/profile', { headers: { Authorization: `Bearer ${token}`, }, });
      console.log(response, 'this is response data');
      setQrvalue(response.data.result._id);
      setData(response.data.result);
      console.log(data, 'thsn is data ');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchData = async () => {
    if (!qrvalue || hasFetched) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token, 'this is token data');
      const response = await fetch(`https://rateus-backend.onrender.com/v1/api/rate/user/${qrvalue}`, { method: 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }, },);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log('API Response:', result);
      setReviews(result?.result || []);
      setFilteredReviews(result?.result || []); // Initially, all reviews are shown
      setHasFetched(true);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviewsByDate = () => {
    if (!startDate || !endDate) return;
    const filtered = reviews.filter(review => {
      const reviewDate = new Date(review.createdAt);
      return reviewDate >= startDate && reviewDate <= endDate;
    });
    setFilteredReviews(filtered);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (qrvalue && qrvalue.length > 1 && !hasFetched) {
      fetchData();
    }
  }, [qrvalue]);

  const modalOpen = () => {
    setMenuVisible(true);
  };

  return (
    <Container statusBarStyle="light-content" statusBarBackgroundColor={COLORS.primaryColor} backgroundColor={COLORS.white}>
      <ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primaryColor, padding: 10, }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image style={styles.imageLogo} resizeMode="contain" source={require('../../assets/images/logo.jpg')} />
            {data ? (
              <>
                <Text style={{ fontWeight: '800', textTransform: 'capitalize', fontSize: 20, color: COLORS.white, }}>{data.name}</Text>
              </>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Genrate_My_QRCode')}>
              <MaterialIcons name="qr-code-scanner" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={modalOpen}>
              <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Selection Buttons */}
        <View style={styles.datePickerContainer}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setOpenStartDatePicker(true)}>
            <Text style={styles.dateText}>{startDate ? startDate.toDateString() : 'Select Start Date'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateButton} onPress={() => setOpenEndDatePicker(true)}>
            <Text style={styles.dateText}>{endDate ? endDate.toDateString() : 'Select End Date'}</Text>
          </TouchableOpacity>
        </View>

        <Modal animationType="fade" transparent={true} visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Menu</Text>

              <TouchableOpacity onPress={(() => { navigation.navigate("CheckSubscription") })} style={styles.menuItem}>
                <Text style={styles.menuText}>Subscription</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={(() => { navigation.navigate("PromotionalMessage") })} style={styles.menuItem}>
                <Text style={styles.menuText}>Message</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Report</Text>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("HelpAndSupport")}>
                <Text style={styles.menuText}>Help & Support</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
                <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date Pickers */}
        <DatePicker
          modal
          open={openStartDatePicker}
          date={startDate || new Date()}
          onConfirm={date => {
            setStartDate(date);
            setOpenStartDatePicker(false);
          }}
          onCancel={() => setOpenStartDatePicker(false)}
        />

        <DatePicker
          modal
          open={openEndDatePicker}
          date={endDate || new Date()}
          onConfirm={date => {
            setEndDate(date);
            setOpenEndDatePicker(false);
            filterReviewsByDate();
          }}
          onCancel={() => setOpenEndDatePicker(false)}
        />
        <FlatList
          data={filteredReviews}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.reviewCard}>
                <Text style={{ color: COLORS.black, fontWeight: '800', textTransform: 'capitalize', }}>{item.username}</Text>
                <RatingStars rating={item.star} />
                <Text style={styles.comment}>{item.comment}</Text>
                <Text style={styles.reviewDate}>{moment(item.createdAt).format('hh:mm A')}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: verticalScale(10),
  },
  dateButton: {
    padding: scale(10),
    backgroundColor: COLORS.primaryColor,
    borderRadius: moderateScale(5),
  },
  dateText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    marginVertical: verticalScale(5),
    padding: scale(10),
    borderRadius: moderateScale(5),
    marginHorizontal: scale(15),
    elevation: 5,
    borderWidth: 1,
    borderStyle: 'dotted',
    color: COLORS.blue,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.primaryColor,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    marginVertical: 5,
    color: COLORS.red,
  },
  imageLogo: {
    height: 40,
    width: 40,
    borderRadius: 24,
  },
  comment: {
    color: COLORS.grey,
    textTransform: 'capitalize',
    marginVertical: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    elevation: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  menuItem: {
    width: "100%",
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
