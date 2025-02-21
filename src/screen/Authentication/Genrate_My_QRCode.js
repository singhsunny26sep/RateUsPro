import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {AppBar} from '../../components/AppBar/AppBar';
import {Instance} from '../../api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import {captureRef} from 'react-native-view-shot';
import RNPrint from 'react-native-print';

const GenerateMyQRCode = () => {
  const [profileData, setProfileData] = useState(null);
  const [isApproved, setIsApproved] = useState(false); // Track approval status
  const [showModal, setShowModal] = useState(false); // Show purchase popup
  const [data, setData] = useState(null);
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

      const response = await Instance.get('/v1/api/users/profile', {
        headers: {Authorization: `Bearer ${token}`},
      });

      const userData = response.data.result;
      setProfileData(userData._id);
      setData(userData);
      console.log(userData, 'Full Profile Data'); // Debugging Log

      if (userData.isSubscribed === true) {
        setIsApproved(true);
        setShowModal(false);
      } else {
        setIsApproved(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    const interval = setInterval(fetchProfile, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const printQRCode = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
  
      // Save the QR Code to the device (optional)
      const shareOptions = {
        title: 'Download QR Code',
        url: uri,
        saveToFiles: true, // This will allow the user to save the file
      };
      await Share.open(shareOptions);
  
      // Print the QR Code
      await RNPrint.print({filePath: uri});
    } catch (error) {
      console.error('Print Error:', error);
    }
  };
  

  const goToSubscription = () => {
    setShowModal(false);
    navigation.navigate('SubscriptionScreen');
  };
  useFocusEffect(
    React.useCallback(() => {
      setShowModal(false);
    }, []),
  );
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
        {data ? (
          <>
            <Text
              style={{
                color: COLORS.black,
                fontWeight: '800',
                fontSize: 24,
                textTransform: 'capitalize',
                textAlign: 'center',
              }}>
              {data.businessName}
            </Text>
          </>
        ) : null}
        <Text></Text>
        {isApproved ? (
          <>
            <View ref={qrRef} style={styles.qrContainer}>
              <QRCode
                value={`https://rateus-backend.onrender.com/review/${profileData}`}
                size={250}
                color="black"
                logoSize={50}
                logoMargin={5}
                logoBorderRadius={15}
                logoBackgroundColor="#FFEB3B"
              />
            </View>
            <TouchableOpacity
              style={[styles.button, styles.shareButton]}
              onPress={shareQRCode}>
              <Text style={styles.buttonText}>Share QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.printButton]}
              onPress={printQRCode}>
              <Text style={styles.buttonText}>Print QR Code</Text>
            </TouchableOpacity>
          </>
        ) : null}
        <Modal visible={showModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                You need an active subscription to generate a QR code.
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.purchaseButton]}
                onPress={goToSubscription}>
                <Text style={styles.buttonText}>Purchase Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  purchaseButton: {
    backgroundColor: COLORS.secondaryColor, // Change this color if needed
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  purchaseButton: {
    backgroundColor: COLORS.darkblue,
  },
  printButton: {
    backgroundColor: COLORS.darkblue, // Change this to your desired color
  },
});
