import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList,Modal, ScrollView} from 'react-native';
import {COLORS} from '../../theme';
import {Container} from '../../components/Container/Container';
import {scale, verticalScale, moderateScale} from '../../utils/Scalling';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Instance} from '../../api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// const reviews = [
//   {
//     id: '1',
//     name: 'John Doe',
//     rating: 4,
//     comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//     date: '2025-01-22',
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     rating: 5,
//     comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//     date: '2025-01-21',
//   },
//   {
//     id: '3',
//     name: 'Alice Johnson',
//     rating: 3,
//     comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//     date: '24 Jan 2025',
//   },
//   {
//     id: '4',
//     name: 'Alice Johnson',
//     rating: 3,
//     comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//     date: '24 Jan 2025',
//   },
//   {
//     id: '5',
//     name: 'Alice Johnson',
//     rating: 3,
//     comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//     date: '24 Jan 2025',
//   },
//   {
//     id: '6',
//     name: 'Alice Johnson',
//     rating: 3,
//     comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//     date: '24 Jan 2025',
//   },
// ];

const RatingStars = ({rating}) => {
  let stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <AntDesign
        key={i}
        name={i < rating ? 'star' : 'staro'}
        size={moderateScale(20)}
        color={i < rating ? COLORS.orange : COLORS.grey}
      />,
    );
  }
  return (
    <View style={{flexDirection: 'row', marginTop: scale(5)}}>{stars}</View>
  );
};

export default function ShowReview({navigation}) {
  const [menuVisible, setMenuVisible] = useState(false); // State for Menu Modal
  const [qrvalue, setQrvalue] = useState('');
  const [hasFetched, setHasFetched] = useState(false); // Track fetch status
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
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

      const response = await Instance.get('/v1/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response, 'this is response data');
      setQrvalue(response.data.result._id);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchData = async () => {
    if (!qrvalue || hasFetched) return; // Prevent unnecessary calls
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token, 'this is token data');

      const response = await fetch(
        `https://rateus-backend.onrender.com/v1/api/rate/user/${qrvalue}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      setReviews(result?.result || []);
      setHasFetched(true); // Mark data as fetched
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
    if (qrvalue && qrvalue.length > 1 && !hasFetched) {
      fetchData();
    }
  }, [qrvalue]); 
  return (
    <Container
      statusBarStyle="light-content"
      statusBarBackgroundColor={COLORS.primaryColor}
      backgroundColor={COLORS.white}>
      <View style={styles.header}>
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
      <ScrollView>

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
      </ScrollView>
      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.reviewCard}>
            <Text style={styles.overalltxt}>Over all</Text>
            <RatingStars rating={item.star} />
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.reviewDate}>
              {item.createdAt}
              {'  '}by{'  '}
              {item.username}
            </Text>
          </View>
        )}
        ListHeaderComponent={
          <Text style={styles.reviewsHeader}>
            Total {reviews.length} Reviews
          </Text>
        }

      />
        
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: COLORS.primaryColor,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: COLORS.white,
    fontSize: moderateScale(15),
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: scale(50),
  },
  reviewsHeader: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    marginHorizontal: scale(15),
    marginVertical: verticalScale(5),
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    marginVertical: verticalScale(5),
    padding: scale(10),
    borderRadius: moderateScale(5),
    marginHorizontal: scale(15),
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  overalltxt: {
    fontWeight: '500',
    fontSize: moderateScale(13),
    color: COLORS.black,
  },
  comment: {
    fontSize: moderateScale(15),
    color: COLORS.black,
    marginVertical: verticalScale(8),
  },
  reviewDate: {
    fontSize: moderateScale(12),
    color: COLORS.gray,
    marginTop: verticalScale(5),
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(20),
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap:10,
    marginHorizontal:10
  },
  
});
