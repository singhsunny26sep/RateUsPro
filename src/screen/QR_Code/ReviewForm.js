import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {moderateScale, scale} from '../../utils/Scalling';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import {AirbnbRating} from 'react-native-ratings';
import FastImage from 'react-native-fast-image';

export default function ReviewForm({navigation}) {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (rating >= 1 && rating <= 3) {
      navigation.navigate('One_to_ThreeStarPage', {rating});
    } else if (rating >= 4 && rating <= 5) {
      navigation.navigate('Four_to_FiveStarPage', {rating});
    }
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <ScrollView>
        {/* <Image
          source={{
            uri: 'https://img.freepik.com/premium-photo/feedback-reviews-visual-representation_1195984-13800.jpg?semt=ais_hybrid',
          }}
          resizeMode="contain"
          style={{ height: scale(180), width: '100%' }}
        /> */}
        <FastImage
          source={{uri:'https://cdn.dribbble.com/users/939581/screenshots/8455399/media/8d666597ca4d60f1804a41737fa4a372.gif'}}
          resizeMode={FastImage.resizeMode.contain}
          style={{ height: scale(180), width: '100%' }}
        />
        <View style={{marginHorizontal: scale(15)}}>
          <CustomTextInput placeholder="User Name" leftIcon="person" />
          <CustomTextInput
            placeholder="Mobile No."
            keyboardType="phone-pad"
            leftIcon="call"
          />
          <CustomTextInput
            placeholder="Email"
            keyboardType="email-address"
            leftIcon="mail"
          />
        </View>
        <Text
          style={{
            fontSize: moderateScale(20),
            marginHorizontal: scale(15),
            fontWeight: '600',
          }}>
          Rating
        </Text>
        <AirbnbRating
          count={5}
          defaultRating={rating}
          size={35}
          showRating={false}
          starStyle={styles.starStyle}
          emptyStarColor={COLORS.black}
          onFinishRating={newRating => setRating(newRating)} 
        />
        <View style={styles.textInputbox}>
          <TextInput
            placeholder="Type your review here"
            multiline
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Your Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  starStyle: {
    marginHorizontal: scale(18),
    marginTop: scale(20),
  },
  textInputbox: {
    marginHorizontal: scale(15),
    marginTop: scale(20),
  },
  textInput: {
    height: scale(100),
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: moderateScale(5),
    padding: scale(10),
    fontSize: 18,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginHorizontal: scale(15),
    marginTop: scale(100),
    backgroundColor: COLORS.primaryColor,
    paddingVertical: scale(10),
    borderRadius: moderateScale(5),
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: moderateScale(15),
    color: COLORS.white,
    fontWeight: '600',
  },
});
