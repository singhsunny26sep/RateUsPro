import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import  Ionicons  from "react-native-vector-icons/Ionicons"; // Install expo vector icons if not installed
import { COLORS } from "../../theme";

export default function CheckSubscription() {
  const navigation = useNavigation();

  // Dummy subscription data (Replace with API response)
  const subscriptions = [
    {
      id: "1",
      name: "Premium Plan",
      startDate: "2024-07-01",
      endDate: "2025-07-01",
    },
    {
      id: "2",
      name: "Basic Plan",
      startDate: "2023-06-10",
      endDate: "2024-06-10",
    },
  ];

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
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.subscriptionCard}>
            <Text style={styles.subscriptionName}>{item.name}</Text>
            <Text style={styles.subscriptionDate}>Start Date: {item.startDate}</Text>
            <Text style={styles.subscriptionDate}>End Date: {item.endDate}</Text>
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
    backgroundColor:COLORS.primaryColor,
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

