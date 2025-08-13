import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Alert} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {AppBar} from '../../components/AppBar/AppBar';
import images from '../../assets/images';
import {verticalScale, scale, moderateScale} from '../../utils/Scalling';
import OtpInput from '../../components/OtpInput/OtpInput';
import CustomButton from '../../components/Buttons/CustomButton';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import { Instance } from '../../api/Instance';
import { FORGOT_PASSWORD_ENDPOINTS } from '../../api/Api_End_Point';

export default function New_Password({navigation, route}) {
  const {email, otp} = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await Instance.put("/v1/api/users/sendForgotPasswordOtp", {
        email: email,
        otp: otp,
        password: password,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Password reset successfully', [
          {text: 'OK', onPress: () => navigation.popToTop()},
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Password reset failed');
      }
    } catch (error) {
      console.log('API Error:', error.response?.data);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="New Password" />
      <View style={styles.imageContainer}>
        <Image
          source={{uri:"https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7896.jpg?semt=ais_hybrid"}}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.resendText}>
          The password must be different than before. Please ensure the new
          password is secure and not similar to the old one.
        </Text>
      </View>
      <View style={{marginTop: scale(10), marginHorizontal: scale(15)}}>
        <CustomTextInput
          placeholder="New password"
          leftIcon="lock-closed"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <CustomTextInput
          placeholder="Confirm password"
          leftIcon="lock-closed"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{marginTop: scale(10)}}
        />
      </View>
      <CustomButton 
        title="Reset Password" 
        style={styles.button} 
        onPress={handleResetPassword}
        loading={loading}
      />
    </Container>
  );
}
const styles = StyleSheet.create({
  image: {
    height: scale(180),
    width: scale(180),
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: moderateScale(20),
    marginTop:scale(20)
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  resendText: {
    textAlign: 'center',
    color: COLORS.grey,
    fontWeight: '400',
    fontSize: moderateScale(12),
    marginVertical: verticalScale(10),
  },
  button: {
    marginHorizontal: scale(15),
    marginTop: scale(200),
  },
});
