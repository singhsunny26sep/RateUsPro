import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
} from 'react-native';
import { Instance } from '../../api/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import showToast from '../../utils/showToast';

const SubscriptionScreen = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [qrvalue, setQrvalue] = useState('');
  const fetchPlans = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      setUserToken(token)

      const response = await Instance.get('/v1/api/subscriptions/users/subscriptionList', { headers: { Authorization: `Bearer ${token}` }, },);
      // console.log(response.data.result, 'this is subscription');
      setPlans(response.data.result); // Store the fetched plans in state
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };
  const fetchProfiles = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token is missing');
        return;
      }

      const response = await Instance.get('/v1/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileData(response.data.result);
      setQrvalue(response.data.result._id);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  const fetchData = async () => {
    if (!qrvalue) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://rateus-backend.onrender.com/v1/api/subscriptions/apply/subscrition/${qrvalue}`,
      );
      const result = await response.json();
      setData(result?.result || []);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlans();
    fetchProfiles();
  }, []);

  const openDialer = () => {
    Linking.openURL('tel:8600248244');
  };

  const handleSubscribed = async (id, plan) => {
    console.log("clicked");
    const token = await AsyncStorage.getItem('userToken');
    console.log("token: " + token);

    setLoading(true)
    return await Instance.post(`/v1/api/subscriptions/apply/subscrition/${id}`, {}, { headers: { Authorization: `Bearer ${token}`, }, }).then((response) => {
      console.log("alsdkjflskdj");

      showToast(response?.data?.msg || "Subscribed successfully.")
      fetchData();
      setSelectedPlan(plan);
      setModalVisible(true)
      setLoading(false)
    }).catch((error) => {
      console.log("alsdkjflskdj");
      console.error("Error: ", error);
      setLoading(false)
      showToast(error?.response?.data?.msg || "Failed to subscribe.")
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Subscription Plan</Text>
      {plans.length > 0 ? (
        plans.map(plan => (
          // <TouchableOpacity key={plan._id} style={[styles.planCard, selectedPlan?._id === plan._id && styles.selectedPlan,]} onPress={() => { fetchData(); setSelectedPlan(plan); setModalVisible(true); }}>
          <TouchableOpacity key={plan._id} style={[styles.planCard, selectedPlan?._id === plan._id && styles.selectedPlan,]} onPress={() => handleSubscribed(plan?._id, plan)}>
            <Text style={styles.planText}>{plan.name}</Text>
            <Text>{`$${plan.amount}`}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Loading plans...</Text>
      )}

      {/* Popup Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact Admin</Text>
            <Text style={styles.modalText}>Please contact the admin to purchase this plan.</Text>
            <Text style={styles.subscriptionName}>WhatsApp No.: 8600248244</Text>
            <Text style={styles.subscriptionName}>Email: binekar.snehal@gmail.com</Text>
            <Text style={styles.subscriptionDate}>Website: www.rateuspro.in</Text>
            <Text></Text>

            <TouchableOpacity style={styles.callButton} onPress={openDialer}>
              <Text style={styles.buttonText}>Call Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  planCard: {
    width: '80%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedPlan: { borderColor: 'green', borderWidth: 2 },
  planText: { fontSize: 18, fontWeight: 'bold' },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  callButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: { color: 'white', fontSize: 16 },
  buttonText: { color: 'white', fontSize: 16 },
});

export default SubscriptionScreen;
