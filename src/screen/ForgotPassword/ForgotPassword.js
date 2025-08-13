import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, Alert, Keyboard} from 'react-native';
import {COLORS} from '../../theme';
import {Container} from '../../components/Container/Container';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import CustomButton from '../../components/Buttons/CustomButton';
import {AppBar} from '../../components/AppBar/AppBar';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import { Instance } from '../../api/Instance';
import { FORGOT_PASSWORD_ENDPOINTS } from '../../api/Api_End_Point';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await Instance.post("/v1/api/users/sendForgotPasswordOtp", {
        email: email,
      });

      if (response.data.success) {
        Alert.alert('Success', 'OTP sent successfully to your email', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VerifyMail', {email}),
          },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
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
    <Container backgroundColor={COLORS.white}>
      <AppBar back title="Forgot Password" />
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://t3.ftcdn.net/jpg/04/92/75/18/360_F_492751838_Ybun2zwpQC8AZv11AwZLdXJk4cUrTt5z.jpg',
          }}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email account to reset password
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <CustomTextInput
          placeholder="Email"
          leftIcon="mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <CustomButton
        title="Send OTP"
        style={styles.button}
        onPress={handleSendOTP}
        loading={loading}
      />
    </Container>
  );
};

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
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.grey,
    fontWeight: '400',
    fontSize: moderateScale(15),
    marginVertical: verticalScale(15),
  },
  inputContainer: {
    marginHorizontal: scale(15),
    marginTop: scale(25),
  },
  button: {
    marginHorizontal: scale(15),
    marginTop: scale(50),
  },
});

export default ForgotPassword;
