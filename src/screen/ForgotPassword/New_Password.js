import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {AppBar} from '../../components/AppBar/AppBar';
import images from '../../assets/images';
import {verticalScale, scale, moderateScale} from '../../utils/Scalling';
import OtpInput from '../../components/OtpInput/OtpInput';
import CustomButton from '../../components/Buttons/CustomButton';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';

export default function New_Password({}) {
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
        />
        <CustomTextInput
          placeholder="Confrim password"
          leftIcon="lock-closed"
          secureTextEntry={true}
        />
      </View>
      <CustomButton title="Verify email" style={styles.button} />
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
