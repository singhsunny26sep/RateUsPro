import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../theme'
import Ionicons from "react-native-vector-icons/Ionicons";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const HelpAndSupport = ({ navigation }) => {
    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8740472521955564~8207548068';
    
    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Admin Contact Details</Text>
            </View>

            {/* Subscription List */}
            <View style={styles.subscriptionCard}>
                <Text style={styles.subscriptionName}>WhatsApp No.: 8600248244</Text>
                <Text style={styles.subscriptionName}>Email: binekar.snehal@gmail.com</Text>
                <Text style={styles.subscriptionDate}>Website: www.rateuspro.in</Text>
            </View>
            <View style={styles.bannerContainer}>
                            <BannerAd
                              unitId={adUnitId}
                              size={BannerAdSize.FULL_BANNER}
                              requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                            />
                          </View>
        </View>
    )
}

export default HelpAndSupport

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
})