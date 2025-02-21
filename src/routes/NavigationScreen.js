import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../screen/Home/Home';
import SplashScreen from '../screen/SplashScreen/SplashScreen';
import SignUp from '../screen/Authentication/SignUp';
import ForgotPassword from '../screen/ForgotPassword/ForgotPassword';
import VerifyMail from '../screen/ForgotPassword/VerifyMail';
import New_Password from '../screen/ForgotPassword/New_Password';
import Genrate_My_QRCode from '../screen/Authentication/Genrate_My_QRCode';
import Login from '../screen/Authentication/Login';
import ReviewForm from '../screen/QR_Code/ReviewForm';
import One_to_ThreeStarPage from '../screen/QR_Code/One_to_ThreeStarPage';
import Four_to_FiveStarPage from '../screen/QR_Code/Four_to_FiveStarPage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ReviewsPage from '../screen/ReviewsPage';
import ShowReview from '../screen/Welcome/ShowReview';
import SubscriptionScreen from '../screen/Subscription/subscription';
import CheckSubscription from '../screen/Subscription/CheckSubscription';
import PromotionalMessage from '../screen/Message/Message';

const Stack = createNativeStackNavigator();
export default function NavigationScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Genrate_My_QRCode" component={Genrate_My_QRCode} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyMail" component={VerifyMail} />
        <Stack.Screen name="New_Password" component={New_Password} />
        <Stack.Screen name="ReviewForm" component={ReviewForm} />
        <Stack.Screen name="ReviewsPage" component={ReviewsPage} />
        <Stack.Screen name="showReview" component={ShowReview} />
        <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
        <Stack.Screen name="CheckSubscription" component={CheckSubscription} />
        <Stack.Screen name="PromotionalMessage" component={PromotionalMessage} />


        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
        <Stack.Screen name="One_to_ThreeStarPage" component={One_to_ThreeStarPage} />
        <Stack.Screen name="Four_to_FiveStarPage" component={Four_to_FiveStarPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
