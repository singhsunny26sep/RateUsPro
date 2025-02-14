import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { scale,verticalScale,moderateScale } from '../../utils/Scalling';
import { COLORS } from '../../theme';

const OtpInput = ({ otp, setOtp }) => {
  const otpArray = Array.isArray(otp) ? otp : Array(6).fill(''); 
  
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otpArray.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => (inputRefs.current[index] = ref)}
          style={styles.otpInput}
          value={digit}
          onChangeText={value => handleOtpChange(value, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(30),
    width: '100%',
  },
  otpInput: {
    width: scale(45),
    height: scale(45),
    borderRadius: moderateScale(8),
    borderWidth: 1.5,
    borderColor: COLORS.darkblue,
    fontSize: moderateScale(18),
    color: COLORS.darkblue,
    marginHorizontal: scale(5),
    backgroundColor: '#F5F6FA',
    textAlign: 'center',
  },
});

export default OtpInput;
