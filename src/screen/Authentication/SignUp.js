import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import axios from 'axios';
import { Container } from '../../components/Container/Container';
import { COLORS } from '../../theme';
import { moderateScale, scale } from '../../utils/Scalling';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import { AppBar } from '../../components/AppBar/AppBar';
import CustomButton from '../../components/Buttons/CustomButton';
import FastImage from 'react-native-fast-image';
import { Instance } from '../../api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

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
  console.log(formData, '++++++++++++++++++++++++');
  const [errors, setErrors] = useState({});
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  const [data, setData] = useState([]);
  console.log(data, 'this is data ');
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://rateus-backend.onrender.com/v1/api/business',
      );
      const result = await response.json();
      console.log(result, 'this is result@@@@@@@@@@@@@@@@@@@@@@@');
      setData(result?.result);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchStates = async () => {
    try {
      const response = await fetch(
        'https://api.countrystatecity.in/v1/countries/IN/states',
        {
          headers: {
            'X-CSCAPI-KEY': 'YOUR_API_KEY', // 👈 Replace with your actual API key
          },
        },
      );
      const result = await response.json();
      setStates(result);
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    fetchStates();
  }, []);
  const validate = () => {
    const newErrors = {};
    if (!formData.businessType)
      newErrors.businessType = 'Business type is required';
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
          businessType: formData.businessType,
          mobile: formData.ownerMobileNo,
          whatsappNumber: formData.whatsappNo,
          city: formData.city,
          state: formData.state,
        });
        if (response.data.success) {
          Alert.alert('Success', response.data.msg);
          console.log('Response:', response.data);
          console.log('Token:', response.data.token);
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
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.businessType}
              onValueChange={itemValue =>
                handleInputChange('businessType', itemValue)
              }
              style={styles.picker}>
              <Picker.Item label="Select Business Type" value="" />
              {data.map(panel => (
                <Picker.Item
                  key={panel._id}
                  label={panel.name}
                  value={panel._id}
                />
              ))}
            </Picker>
          </View>
          {/* {error ? <Text style={styles.error}>{error}</Text> : null} */}
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
          {/* <CustomTextInput
            placeholder="State"
            leftIcon="location"
            value={formData.state}
            onChangeText={text => handleInputChange('state', text)}
            error={errors.state}
          /> */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.state}
              onValueChange={itemValue => handleInputChange('state', itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select State" value="" />
              <Picker.Item label="Andhra Pradesh" value="andhra_pradesh" />
              <Picker.Item
                label="Arunachal Pradesh"
                value="arunachal_pradesh"
              />
              <Picker.Item label="Assam" value="assam" />
              <Picker.Item label="Bihar" value="bihar" />
              <Picker.Item label="Chhattisgarh" value="chhattisgarh" />
              <Picker.Item label="Goa" value="goa" />
              <Picker.Item label="Delhi (Ncr)" value="delhi" />
              <Picker.Item label="Gujarat" value="gujarat" />
              <Picker.Item label="Haryana" value="haryana" />
              <Picker.Item label="Himachal Pradesh" value="himachal_pradesh" />
              <Picker.Item label="Jharkhand" value="jharkhand" />
              <Picker.Item label="Karnataka" value="karnataka" />
              <Picker.Item label="Kerala" value="kerala" />
              <Picker.Item label="Madhya Pradesh" value="madhya_pradesh" />
              <Picker.Item label="Maharashtra" value="maharashtra" />
              <Picker.Item label="Manipur" value="manipur" />
              <Picker.Item label="Meghalaya" value="meghalaya" />
              <Picker.Item label="Mizoram" value="mizoram" />
              <Picker.Item label="Nagaland" value="nagaland" />
              <Picker.Item label="Odisha" value="odisha" />
              <Picker.Item label="Punjab" value="punjab" />
              <Picker.Item label="Rajasthan" value="rajasthan" />
              <Picker.Item label="Sikkim" value="sikkim" />
              <Picker.Item label="Tamil Nadu" value="tamil_nadu" />
              <Picker.Item label="Telangana" value="telangana" />
              <Picker.Item label="Tripura" value="tripura" />
              <Picker.Item label="Uttar Pradesh" value="uttar_pradesh" />
              <Picker.Item label="Uttarakhand" value="uttarakhand" />
              <Picker.Item label="West Bengal" value="west_bengal" />
            </Picker>
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
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    height: scale(200),
    width: scale(200),
  },
  inputContainer: {
    marginHorizontal: scale(15),
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
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  picker: {
    height: 50,
    width: '100%',
    color: COLORS.black,
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
