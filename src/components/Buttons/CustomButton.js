import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../../theme';
import {scale} from '../../utils/Scalling';

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled ? styles.disabledButton : styles.enabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: scale(42),
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginVertical: scale(10),
  },
  enabledButton: {
    backgroundColor: COLORS.primaryColor,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: scale(14),
    fontWeight: 'bold',
  },
});

export default CustomButton;
