import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme';
import {moderateScale, scale} from '../../utils/Scalling';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import images from '../../assets/images';
import FastImage from 'react-native-fast-image';

export default function Four_to_FiveStarPage({route}) {
  const {rating} = route.params;

  let gifSource = images.fourStar;
  if (rating === 5) gifSource = images.fiveStar;

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
      backgroundColor={COLORS.white}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <FastImage
            source={gifSource}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.gifImage}
          />
          <View style={styles.starContainer}>{renderStars(rating)}</View>
          <Text style={styles.message}>
            You rated us {rating} {rating === 1 ? 'star' : 'stars'}
          </Text>
          <Text style={styles.feedbackMessage}>
            Thank you for your amazing feedback! We’re so glad you had a great
            experience.
          </Text>
          <Text style={styles.subMessage}>
            If you’d like to support us, please share your review on social
            media—it really helps us grow.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconWrapper}>
              <FontAwesome name="whatsapp" size={30} color={'#25D366'} />
              <Text style={[styles.iconText, {color: '#25D366'}]}>
                Whatsapp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <AntDesign name="instagram" size={30} color={'#E4405F'} />
              <Text style={[styles.iconText, {color: '#E4405F'}]}>
                Instagram
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <AntDesign name="facebook-square" size={30} color={'#1877F2'} />
              <Text style={[styles.iconText, {color: '#1877F2'}]}>
                Facebook
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <AntDesign name="twitter" size={30} color={'#1DA1F2'} />
              <Text style={[styles.iconText, {color: '#1DA1F2'}]}>Twitter</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerText}>
            <FontAwesome
              name="thumbs-up"
              size={15}
              color={COLORS.primaryColor}
            />
            Your review means a lot to us!
          </Text>
        </View>
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
  contentContainer: {
    alignItems: 'center',
  },
  feedbackMessage: {
    fontSize: moderateScale(17),
    textAlign: 'center',
    color: COLORS.grey,
    marginBottom: scale(10),
    lineHeight: scale(24),
    paddingHorizontal: scale(10),
    fontStyle: 'italic',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.darkGray,
    marginBottom: scale(10),
    marginHorizontal: 15,
  },
  subMessage: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: COLORS.primaryColor,
    marginBottom: scale(20),
    lineHeight: scale(24),
    fontWeight: '500',
    paddingHorizontal: scale(15),
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: scale(20),
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: COLORS.white,
    elevation: 8,
    borderRadius:moderateScale (10),
    alignItems: 'center',
    justifyContent: 'center',
    width:scale (75),
    height:scale (75),
    marginRight:scale(8),
    left:4
  },
  iconText: {
    marginTop: scale(5),
    color: COLORS.primaryColor,
    fontSize: 14,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryColor,
    textAlign: 'center',
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
  bottomSection: {
    marginTop:scale(100)
    
  },
  star: {
    marginRight: scale(8),
  },
});
