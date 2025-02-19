import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Image, Animated} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {moderateScale, scale} from '../../utils/Scalling';
import AsyncStorage from '@react-native-async-storage/async-storage'; // import AsyncStorage

export default function SplashScreen({navigation}) {
  const imageAnim = useRef(new Animated.Value(-200)).current;
  const textAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      const checkUserAuth = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          console.log('token:', userToken);
          if (userToken) {
            navigation.replace('showReview');
          } else {
            navigation.replace('Login');
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          navigation.replace('Login');
        }
      };
      Animated.parallel([
        Animated.timing(imageAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      checkUserAuth();
    }, 1000);
    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, [imageAnim, textAnim, navigation]);

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <View style={styles.imageContainer}>
        <Animated.View
          style={[styles.imageWrapper, {transform: [{translateY: imageAnim}]}]}>
          <Image
            source={{
              uri: 'https://cdni.iconscout.com/illustration/premium/thumb/people-giving-online-rating-illustration-download-in-svg-png-gif-file-formats--customer-feedback-star-pack-business-illustrations-4642814.png',
            }}
            style={styles.gifImage}
          />
        </Animated.View>
        <Animated.Text
          style={[styles.ratingText, {transform: [{translateY: textAnim}]}]}>
          RateUs Pro
        </Animated.Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: scale(50),
  },
  gifImage: {
    height: scale(200),
    width: scale(200),
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontWeight: '800',
    fontSize: moderateScale(25),
    color: COLORS.primaryColor,
    marginTop: scale(20),
  },
});
