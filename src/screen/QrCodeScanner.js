import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544~1458002511';

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const permission =
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
    } else {
      const requestResult = await request(permission);
      setHasPermission(requestResult === RESULTS.GRANTED);
    }
  };

  if (!hasPermission) {
    return <Text>Requesting camera permission...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
          padding: 10,
          backgroundColor: 'red',
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Close Camera</Text>
      </TouchableOpacity>
            <View style={styles.bannerContainer}>
                      <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.FULL_BANNER}
                        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                      />
                    </View>
    </View>
  );
}
