import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {AppBar} from '../../components/AppBar/AppBar';
import images from '../../assets/images';
import {verticalScale, scale, moderateScale} from '../../utils/Scalling';
import OtpInput from '../../components/OtpInput/OtpInput';
import CustomButton from '../../components/Buttons/CustomButton';

export default function VerifyMail({navigation}) {
  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Verify Email" />
      <View style={styles.imageContainer}>
        <Image
          source={{uri:"https://thumbs.dreamstime.com/b/one-time-password-otp-verification-methods-concept-unique-codes-protection-against-cyber-crime-one-time-password-otp-312847096.jpg"}}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.resendText}>
          Didn't receive the code?{' '}
          <Text style={{fontWeight: 'bold', color: COLORS.black}}>Resend</Text>{' '}
        </Text>
      </View>
      <View style={{marginTop: scale(20)}}>
        <OtpInput />
      </View>
      <CustomButton
        title="Verify email"
        style={styles.button}
        onPress={() => navigation.navigate('New_Password')}
      />
    </Container>
  );
}
const styles = StyleSheet.create({
  image: {
    height: scale(200),
    width: scale(200),
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: moderateScale(20),
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
    fontSize: moderateScale(18),
    marginVertical: verticalScale(10),
  },
  button: {
    marginHorizontal: scale(15),
    marginTop: scale(250),
  },
});
