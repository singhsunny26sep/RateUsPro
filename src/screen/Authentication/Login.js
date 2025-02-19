import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import axios from 'axios';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import CustomButton from '../../components/Buttons/CustomButton';
import FastImage from 'react-native-fast-image';
import {COLORS} from '../../theme';
import {moderateScale, scale} from '../../utils/Scalling';
import {Instance} from '../../api/Instance';
import {Container} from '../../components/Container/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 5) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await Instance.post('/v1/api/users/login', {
        email,
        password,
      });
      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.token);
        console.log('Token saved:', response.data.token);
        Alert.alert('Success', response.data.msg);
        navigation.navigate('showReview');
      } else {
        Alert.alert('Error', 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <Text style={styles.Logintxt}>Login</Text>
      <ScrollView>
        <View style={styles.logoContainer}>
          <FastImage
            source={{
              uri: 'https://cdn.dribbble.com/users/939581/screenshots/8455399/media/8d666597ca4d60f1804a41737fa4a372.gif',
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.Img}
          />
        </View>

        <View style={styles.inputContainer}>
          <CustomTextInput
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={emailError}
          />
          <CustomTextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={passwordError}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Login"
            style={styles.button}
            onPress={handleLogin}
            loading={loading}
          />
    
        </View>
        <Text style={styles.alreadytxt}>
          Don't have an account?
          <Text
            style={styles.SignUptxt}
            onPress={() => navigation.navigate('SignUp')}>
            SignUp
          </Text>
        </Text>
        
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  Img: {
    height: scale(120),
    width: '100%',
  },
  Logintxt: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginTop: scale(5),
    fontWeight: '600',
  },
  inputContainer: {
    marginHorizontal: scale(15),
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginRight: scale(18),
  },
  forgotPasswordText: {
    color: COLORS.primaryColor,
    fontWeight: 'bold',
    bottom: scale(12),
    fontSize: moderateScale(15),
  },
  buttonContainer: {
    marginTop: scale(20),
    marginHorizontal: scale(15),
  },
  alreadytxt: {
    textAlign: 'right',
    marginRight: scale(15),
    fontSize: moderateScale(15),
  },
  SignUptxt: {
    color: COLORS.primaryColor,
    fontWeight: 'bold',
  },
  buttons:{
    backgroundColor:COLORS.blue
  }
});
