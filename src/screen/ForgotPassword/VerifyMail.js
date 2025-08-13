import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, Alert, TextInput} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {AppBar} from '../../components/AppBar/AppBar';
import {verticalScale, scale, moderateScale} from '../../utils/Scalling';
import OtpInput from '../../components/OtpInput/OtpInput';
import CustomButton from '../../components/Buttons/CustomButton';
import {Instance} from '../../api/Instance';

export default function VerifyMail({navigation, route}) {
  const {email} = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // 🔹 Just validate OTP length, don't call API
  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    // Just show password fields
    setIsOtpVerified(true);
  };

  // 🔹 Actual API call happens here
  const handleSubmitPassword = async () => {
    const otpString = otp.join('');
  
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
  
    setLoading(true);
    console.log('📩 Email:', email);
    console.log('🔍 OTP as string:', otpString);
    console.log('🔐 New Password:', newPassword);
  
    try {
      const response = await Instance.put('/v1/api/users/verifyEmailOtpAndResetPassword', {
        email: email,
        otp: otpString,       
        password: newPassword 
      });
  
      console.log('✅ API Response:', response.data);
  
      if (response.data.success) {
        Alert.alert('Success', 'Password reset successfully', [
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Password reset failed');
      }
    } catch (error) {
      console.log('🔴 Full Error:', error);
  
      if (error.response) {
        console.log('🔴 Error Response Data:', error.response.data);
        console.log('🔴 Error Status:', error.response.status);
      } else if (error.request) {
        console.log('🔴 No response received:', error.request);
      } else {
        console.log('🔴 Error Message:', error.message);
      }
  
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container backgroundColor={COLORS.white}>
      <AppBar back title="Verify OTP" />
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://thumbs.dreamstime.com/b/one-time-password-otp-verification-methods-concept-unique-codes-protection-against-cyber-crime-one-time-password-otp-312847096.jpg',
          }}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          {isOtpVerified
            ? 'Enter your new password below'
            : `Enter the 6-digit OTP sent to ${email}`}
        </Text>
      </View>

      <View style={{marginTop: scale(10), marginHorizontal: scale(15)}}>
        {!isOtpVerified ? (
          <OtpInput otp={otp} setOtp={setOtp} />
        ) : (
          <>
            <TextInput
              secureTextEntry
              placeholder="New Password"
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
           
          </>
        )}
      </View>

      <CustomButton
        title={isOtpVerified ? 'Submit' : 'Verify OTP'}
        style={styles.button}
        onPress={isOtpVerified ? handleSubmitPassword : handleVerifyOtp}
        loading={loading}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    height: scale(200),
    width: scale(200),
  },
  title: {
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: moderateScale(20),
    marginVertical: verticalScale(15),
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.grey,
    fontWeight: '400',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(15),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 8,
    padding: scale(10),
    marginBottom: verticalScale(15),
    fontSize: moderateScale(14),
  },
  button: {
    marginHorizontal: scale(15),
    marginTop: scale(50),
  },
});
