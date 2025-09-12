import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, StatusBar } from 'react-native';
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

  // Business Type Dropdown states
  const [openBusiness, setOpenBusiness] = useState(false);
  const [businessItems, setBusinessItems] = useState([]);
  const [businessType, setBusinessType] = useState(null);

  // State Dropdown states
  const [openState, setOpenState] = useState(false);
  const [stateValue, setStateValue] = useState(null);
const [stateItems, setStateItems] = useState([
  { label: 'Andhra Pradesh', value: 'andhra_pradesh' },
  { label: 'Arunachal Pradesh', value: 'arunachal_pradesh' },
  { label: 'Assam', value: 'assam' },
  { label: 'Bihar', value: 'bihar' },
  { label: 'Chhattisgarh', value: 'chhattisgarh' },
  { label: 'Goa', value: 'goa' },
  { label: 'Gujarat', value: 'gujarat' },
  { label: 'Haryana', value: 'haryana' },
  { label: 'Himachal Pradesh', value: 'himachal_pradesh' },
  { label: 'Jharkhand', value: 'jharkhand' },
  { label: 'Karnataka', value: 'karnataka' },
  { label: 'Kerala', value: 'kerala' },
  { label: 'Madhya Pradesh', value: 'madhya_pradesh' },
  { label: 'Maharashtra', value: 'maharashtra' },
  { label: 'Manipur', value: 'manipur' },
  { label: 'Meghalaya', value: 'meghalaya' },
  { label: 'Mizoram', value: 'mizoram' },
  { label: 'Nagaland', value: 'nagaland' },
  { label: 'Odisha', value: 'odisha' },
  { label: 'Punjab', value: 'punjab' },
  { label: 'Rajasthan', value: 'rajasthan' },
  { label: 'Sikkim', value: 'sikkim' },
  { label: 'Tamil Nadu', value: 'tamil_nadu' },
  { label: 'Telangana', value: 'telangana' },
  { label: 'Tripura', value: 'tripura' },
  { label: 'Uttar Pradesh', value: 'uttar_pradesh' },
  { label: 'Uttarakhand', value: 'uttarakhand' },
  { label: 'West Bengal', value: 'west_bengal' },
  { label: 'Andaman and Nicobar Islands', value: 'andaman_nicobar' },
  { label: 'Chandigarh', value: 'chandigarh' },
  { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'dadra_nagar_haveli_daman_diu' },
  { label: 'Delhi (NCT)', value: 'delhi' },
  { label: 'Jammu and Kashmir', value: 'jammu_kashmir' },
  { label: 'Ladakh', value: 'ladakh' },
  { label: 'Lakshadweep', value: 'lakshadweep' },
  { label: 'Puducherry', value: 'puducherry' },
]);


  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8740472521955564/8164501176';
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Sync stateValue with formData
  useEffect(() => {
    if (stateValue) {
      handleInputChange('state', stateValue);
    }
  }, [stateValue]);

  // Sync businessType with formData
  useEffect(() => {
    if (businessType) {
      handleInputChange('businessType', businessType);
    }
  }, [businessType]);

  // Fetch Business Types from API
  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://rateusbackend.onrender.com/v1/api/business',
      );
      const result = await response.json();
      const formatted = result?.result?.map(panel => ({
        label: panel.name,
        value: panel._id,
      }));
      setBusinessItems(formatted);
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
          businessType: businessType,
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
    <ScrollView>
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
        <StatusBar/>
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
          {/* Business Type Dropdown */}
          <DropDownPicker
            open={openBusiness}
            value={businessType}
            items={businessItems}
            setOpen={setOpenBusiness}
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

          {/* State Picker */}

  <DropDownPicker
    open={openState}
    value={stateValue}
    items={stateItems}
    setOpen={setOpenState}
    setValue={setStateValue}
    setItems={setStateItems}
    placeholder="Select State"
   style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
  />



          {errors.state && (
            <Text style={styles.error}>{errors.state}</Text>
          )}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    marginHorizontal: scale(15),
    zIndex: 1000, // Increased zIndex to handle dropdown overlap
  },
  pickerContainer: {
    zIndex: 900, // Lower than inputContainer but still high
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
  bannerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
});