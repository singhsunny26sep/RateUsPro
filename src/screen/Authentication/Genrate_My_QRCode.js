import React, { useState, useEffect, useRef,useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Container } from '../../components/Container/Container';
import { COLORS } from '../../theme';
import { AppBar } from '../../components/AppBar/AppBar';
import { Instance } from '../../api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';

const GenerateMyQRCode = () => {
  const [profileData, setProfileData] = useState(null);
  const [isApproved, setIsApproved] = useState(false); // Track approval status
  const [showModal, setShowModal] = useState(false); // Show purchase popup
  const qrRef = useRef();
  const navigation = useNavigation();

  // Fetch Profile Data
// Fetch Profile Data
const fetchProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    const response = await Instance.get('/v1/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = response.data.result;
    setProfileData(userData._id);
    
    console.log(userData, 'Full Profile Data'); // Debugging Log

    // Check if isApproved is true
    if (userData.isApproved === true) {
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

    // Poll API every 5 seconds to check approval status
    const interval = setInterval(fetchProfile, 5000);
    return () => clearInterval(interval);
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

  // Navigate to Subscription Page
  const goToSubscription = () => {
    setShowModal(false); // Close modal
    navigation.navigate('SubscriptionScreen');
  };
  useFocusEffect(
    React.useCallback(() => {
      setShowModal(false); 
    }, [])
  );
  

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
          </>
        ) : null} 

        {/* Purchase Plan Popup */}
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
    shadowOffset: { width: 0, height: 4 },
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
    shadowOffset: { width: 0, height: 4 },
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
  purchaseButton:{
    backgroundColor:COLORS.darkblue
  }
});
