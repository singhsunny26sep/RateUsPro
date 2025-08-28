import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { Container } from '../../components/Container/Container';
import { COLORS } from '../../theme';
import { moderateScale, scale } from '../../utils/Scalling';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import CustomButton from '../../components/Buttons/CustomButton';
import { Instance } from '../../api/Instance';

export default function SignUp({ navigation }) {
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    ownerMobileNo: '',
    email: '',
    whatsappNo: '',
    city: '',
    state: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔽 Business Type Dropdown states
  const [open, setOpen] = useState(false);
  const [businessItems, setBusinessItems] = useState([]);
  const [businessType, setBusinessType] = useState(null);

  const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-8740472521955564~8207548068';

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 🔽 Fetch Business Types from API
  const fetchData = async () => {
    console.log()
    try {
      const response = await fetch(
        'https://rateus-backend.onrender.com/v1/api/business',
      );
      const result = await response.json();
      const formatted = result?.result?.map(panel => ({
        label: panel.name,
        value: panel._id,
      }));
      setBusinessItems(formatted);
      console.log(businessItems,"this is bussinuess type")
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!businessType) newErrors.businessType = 'Business type is required';
    if (!formData.businessName)
      newErrors.businessName = 'Business name is required';
    if (!formData.ownerMobileNo)
      newErrors.ownerMobileNo = 'Mobile number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.whatsappNo)
      newErrors.whatsappNo = 'Whatsapp number is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password should be at least 6 characters long';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validate()) {
      setLoading(true);
      try {
        const response = await Instance.post('/v1/api/users/register', {
          name: formData.businessName,
          email: formData.email,
          password: formData.password,
          role: 'vendor',
          businessName: formData.businessName,
          businessType: businessType, // ✅ selected value
          mobile: formData.ownerMobileNo,
          whatsappNumber: formData.whatsappNo,
          city: formData.city,
          state: formData.state,
        });

        if (response.data.success) {
          Alert.alert('Success', response.data.msg);
          await AsyncStorage.setItem('userToken', response.data.token);
          navigation.navigate('Genrate_My_QRCode');
        } else {
          console.error('Registration failed:', response.data.msg);
        }
      } catch (error) {
        console.error(
          'Error during registration:',
          error.response ? error.response.data : error.message,
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <View>
        <Text style={styles.Headertxt}>SignUp</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <FastImage
            source={{
              uri: 'https://cdn.dribbble.com/users/939581/screenshots/8455399/media/8d666597ca4d60f1804a41737fa4a372.gif',
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.Img}
          />
        </View>

        <View style={styles.inputContainer}>
          {/* 🔽 Business Type Dropdown */}
          <DropDownPicker
            open={open}
            value={businessType}
            items={businessItems}
            setOpen={setOpen}
            setValue={setBusinessType}
            setItems={setBusinessItems}
            placeholder="Select Business Type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          {errors.businessType && (
            <Text style={styles.error}>{errors.businessType}</Text>
          )}

          <CustomTextInput
            placeholder="Name of business"
            leftIcon="business"
            value={formData.businessName}
            onChangeText={text => handleInputChange('businessName', text)}
            error={errors.businessName}
          />
          <CustomTextInput
            placeholder="Owner Mobile No"
            leftIcon="call"
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.ownerMobileNo}
            onChangeText={text => handleInputChange('ownerMobileNo', text)}
            error={errors.ownerMobileNo}
          />
          <CustomTextInput
            placeholder="Email"
            leftIcon="mail"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
            error={errors.email}
          />
          <CustomTextInput
            placeholder="Whatsapp No"
            leftIcon="logo-whatsapp"
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.whatsappNo}
            onChangeText={text => handleInputChange('whatsappNo', text)}
            error={errors.whatsappNo}
          />
          <CustomTextInput
            placeholder="City"
            leftIcon="location"
            value={formData.city}
            onChangeText={text => handleInputChange('city', text)}
            error={errors.city}
          />

          {/* State Picker (Static for Now) */}
          <View style={styles.pickerContainer}>
            <DropDownPicker
              open={formData.openState || false}
              value={formData.state}
              items={[
                { label: 'Delhi (NCR)', value: 'delhi' },
                { label: 'Maharashtra', value: 'maharashtra' },
                { label: 'Uttar Pradesh', value: 'uttar_pradesh' },
                { label: 'Bihar', value: 'bihar' },
                { label: 'Punjab', value: 'punjab' },
              ]}
              setOpen={val => handleInputChange('openState', val)}
              setValue={val => handleInputChange('state', val())}
              setItems={() => {}}
              placeholder="Select State"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
          {errors.state ? (
            <Text style={styles.error}>{errors.state}</Text>
          ) : null}

          <CustomTextInput
            placeholder="Password"
            secureTextEntry
            leftIcon="lock-closed"
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
            error={errors.password}
          />
        </View>

        <Text style={styles.alreadytxt}>
          Already have an account?
          <Text
            style={styles.logintx}
            onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>

        <CustomButton
          title="CREATE ACCOUNT"
          style={styles.button}
          onPress={handleSignUp}
          loading={loading}
        />

        <View style={styles.bannerContainer}>
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    marginHorizontal: scale(15),
    zIndex: 10, // 👈 important for dropdown overlap
  },
  button: {
    marginTop: scale(10),
    marginHorizontal: scale(15),
  },
  Headertxt: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginTop: scale(5),
    fontWeight: '600',
  },
  Img: {
    height: scale(120),
    width: '100%',
  },
  alreadytxt: {
    textAlign: 'right',
    marginRight: scale(15),
    fontSize: moderateScale(15),
  },
  logintx: {
    color: COLORS.primaryColor,
    fontWeight: 'bold',
  },
  dropdown: {
    borderColor: COLORS.grey,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: COLORS.grey,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
