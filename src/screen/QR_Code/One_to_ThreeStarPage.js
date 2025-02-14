import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {moderateScale, scale} from '../../utils/Scalling';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';

export default function One_to_ThreeStarPage({route}) {
  const {rating} = route.params;
  let gifSource = images.fristStar;
  if (rating === 2) gifSource = images.twoStar;
  else if (rating === 3) gifSource = images.threeStar;
  const renderStars = rating => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FontAwesome
            key={i}
            name="star"
            size={35}
            color={COLORS.orange}
            style={styles.star}
          />,
        );
      } else {
        stars.push(
          <FontAwesome
            key={i}
            name="star-o"
            size={35}
            color={COLORS.grey}
            style={styles.star}
          />,
        );
      }
    }
    return stars;
  };
  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.lightGray}>
      <View style={styles.container}>
        <FastImage
          source={gifSource}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.gifImage}
        />
        <View style={styles.starContainer}>{renderStars(rating)}</View>
        <Text style={styles.message}>
          You rated us {rating} {rating === 1 ? 'star' : 'stars'}.
        </Text>
        <Text style={styles.feedbackMessage}>
          We’re sorry your experience wasn’t perfect. Your feedback helps us
          improve, and we truly appreciate it
        </Text>
        <Text style={styles.subMessage}>
          Please accept a small token of our gratitude—scratch the card to claim
          your free gift!
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(20),
    paddingHorizontal: scale(20),
    paddingVertical: scale(25),
  },
  message: {
    fontSize: moderateScale(22),
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.black,
    marginBottom: scale(20),
    lineHeight: scale(28),
    letterSpacing: 0.5,
  },
  feedbackMessage: {
    fontSize: moderateScale(17),
    textAlign: 'center',
    color: COLORS.grey,
    marginBottom: scale(25),
    lineHeight: scale(24),
    paddingHorizontal: scale(10),
    fontStyle: 'italic',
  },
  subMessage: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: COLORS.primaryColor,
    marginBottom: scale(30),
    lineHeight: scale(24),
    fontWeight: '500',
    paddingHorizontal: scale(15),
  },
  gifImage: {
    height: scale(150),
    width: scale(150),
    alignSelf: 'center',
    marginBottom: scale(25),
    borderRadius: scale(8),
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    backgroundColor: COLORS.white,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    marginRight: scale(8), 
  },
});
