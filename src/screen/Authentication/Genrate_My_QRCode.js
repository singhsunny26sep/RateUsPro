import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {useNavigation} from '@react-navigation/native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {AppBar} from '../../components/AppBar/AppBar';
import {Instance} from '../../api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';

const GenerateMyQRCode = () => {
  const [profileData, setProfileData] = useState(null);
  const qrRef = useRef();
  const navigation = useNavigation();

  // Fetch Profile Data
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      console.log('gettoken', token);
      const response = await Instance.get('/v1/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Profile Data:', response.data);
      setProfileData(response.data.result._id);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Share QR Code Function
  const shareQRCode = async () => {
    try {
      const qrURL = `https://rating-tau-nine.vercel.app/screens/ReviewForm?scanned=${profileData}`;
      const shareOptions = {
        title: 'Share QR Code',
        message: `Scan this QR Code: ${qrURL}`,
        url: qrURL,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar
        back
        title="QR Code Generator"
        rightIcon="sign-out"
        onRightIconPress={handleLogout}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View ref={qrRef} style={styles.qrContainer}>
          {profileData && (
           <QRCode
           value={`myapp://ReviewForm?scanned=${profileData}`} // Custom Deep Link
           size={250}
           color="black"
           logoSize={50}
           logoMargin={5}
           logoBorderRadius={15}
           logoBackgroundColor="#FFEB3B"
         />
         
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={shareQRCode}>
          <Text style={styles.buttonText}>Share QR Code</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default GenerateMyQRCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  qrContainer: {
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  shareButton: {
    backgroundColor: COLORS.primaryColor,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
