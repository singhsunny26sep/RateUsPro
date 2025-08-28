import React, { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

import NavigationScreen from './src/routes/NavigationScreen';

export default function App() {
  useEffect(() => {
    checkAppVersion();
  }, []);

  const checkAppVersion = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion(); // Play Store se
      const currentVersion = await VersionCheck.getCurrentVersion(); // app ke andar wali versionName
      if (latestVersion !== currentVersion) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Please update to continue.",
          [
            {
              text: "Update Now",
              onPress: () => {
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=com.userRateus&hl=en_IN"
                );
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log("Version check error:", error);
    }
  };

  return <NavigationScreen />;
}
