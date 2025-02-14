import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../theme';
import {Container} from '../../components/Container/Container';
import images from '../../assets/images';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import CustomButton from '../../components/Buttons/CustomButton';
import { AppBar } from '../../components/AppBar/AppBar';

export default function ForgotPassword({navigation}) {
  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
          <AppBar back title="Forgot Password" />
      <View style={styles.imageContainer}>
        <Image
          source={{uri:"https://t3.ftcdn.net/jpg/04/92/75/18/360_F_492751838_Ybun2zwpQC8AZv11AwZLdXJk4cUrTt5z.jpg"}}
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
          placeholder="Enter Email"
          leftIcon="mail"
          keyboardType="email-address"
        />
      </View>
      <CustomButton
        title="Verify email"
        style={styles.button}
        onPress={() => navigation.navigate('VerifyMail')}
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
    marginTop: scale(250),
  },
});
