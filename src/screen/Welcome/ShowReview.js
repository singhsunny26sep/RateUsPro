import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import {COLORS} from '../../theme';
import {Container} from '../../components/Container/Container';
import {scale, verticalScale, moderateScale} from '../../utils/Scalling';
import AntDesign from 'react-native-vector-icons/AntDesign';

const reviews = [
  {
    id: '1',
    name: 'John Doe',
    rating: 4,
    comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-01-22',
  },
  {
    id: '2',
    name: 'Jane Smith',
    rating: 5,
    comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-01-21',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    rating: 3,
    comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '24 Jan 2025',
  },
  {
    id: '4',
    name: 'Alice Johnson',
    rating: 3,
    comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '24 Jan 2025',
  },
  {
    id: '5',
    name: 'Alice Johnson',
    rating: 3,
    comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '24 Jan 2025',
  },
  {
    id: '6',
    name: 'Alice Johnson',
    rating: 3,
    comment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '24 Jan 2025',
  },
];

const RatingStars = ({rating}) => {
  let stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <AntDesign
        key={i}
        name={i < rating ? 'star' : 'staro'}
        size={moderateScale(20)}
        color={i < rating ? COLORS.orange : COLORS.grey}
      />,
    );
  }
  return <View style={{flexDirection: 'row',marginTop:scale(5)}}>{stars}</View>;
};

export default function ShowReview({navigation}) {
  return (
    <Container
      statusBarStyle="light-content"
      statusBarBackgroundColor={COLORS.primaryColor}
      backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}onPress={()=>navigation.goBack('')}>
          <AntDesign name="left" size={24} color={COLORS.white} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Show All Reviews</Text>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.reviewCard}>
            <Text style={styles.overalltxt}>Over all</Text>
            <RatingStars rating={item.rating} />
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.reviewDate}>{item.date}{'  '}by{'  '}{item.name}</Text>
          </View>
        )}
        ListHeaderComponent={
          <Text style={styles.reviewsHeader}>
            Total {reviews.length} Reviews
          </Text>
        }
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: COLORS.primaryColor,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: COLORS.white,
    fontSize: moderateScale(15),
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: scale(50),
  },
  reviewsHeader: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    marginHorizontal: scale(15),
    marginVertical: verticalScale(5),
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    marginVertical: verticalScale(5),
    padding: scale(10),
    borderRadius: moderateScale(5),
    marginHorizontal: scale(15),
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  overalltxt: {
    fontWeight: '500',
    fontSize: moderateScale(13),
    color: COLORS.black,
  },
  comment: {
    fontSize: moderateScale(15),
    color: COLORS.black,
    marginVertical: verticalScale(8),
  },
  reviewDate: {
    fontSize: moderateScale(12),
    color: COLORS.gray,
    marginTop: verticalScale(5),
  },
});
