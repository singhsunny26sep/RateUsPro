import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Install expo vector icons if not installed
import { COLORS } from "../../theme";
import { Instance } from "../../api/Instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export default function CheckSubscription() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true)

  const [subscription, setSubscription] = useState([])

  const getHistory = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token is missing');
      return;
    }
    return await Instance(`/v1/api/subscriptions/history/user/subscription`, { headers: { Authorization: `Bearer ${token}`, }, }).then((response) => {
      console.log("response: ", response?.data);
      setSubscription(response?.data?.result)
      setLoading(false)
    }).catch((error) => {
      console.log("error: ", error);
      setLoading(false)
    })
  }

  useEffect(() => {
    getHistory()
  }, [loading])

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Subscription</Text>
      </View>

      {/* Subscription List */}
      <FlatList
        data={subscription}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
          <View style={styles.subscriptionCard}>
            <Text style={styles.subscriptionName}>{item?.subscriptionId?.name}</Text>
            <Text style={styles.subscriptionName}>₹ {item?.amount}</Text>
            <Text style={styles.subscriptionName}>{item?.duration} Month{item?.duration > 1 && 's'}</Text>
            <Text style={[styles.subscriptionName, { textTransform: 'capitalize' }]}>{item?.status}</Text>
            <Text style={styles.subscriptionDate}>Start Date: {moment(item?.startDate).format("LL")}</Text>
            <Text style={styles.subscriptionDate}>End Date: {moment(item?.endDate).format("LL")}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.primaryColor,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subscriptionCard: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 5,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subscriptionDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});

