import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const PromotionalMessage = () => {
  const [instagramLink, setInstagramLink] = useState('');
  const [offerText, setOfferText] = useState('');

  const sendPromotion = () => {
    if (!instagramLink || !offerText) {
      alert('Please enter both Instagram link and offer text.');
      return;
    }
    alert(
      `Promotional message sent!\nInstagram: ${instagramLink}\nOffer: ${offerText}`,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Send Promotional Message</Text>

        <Text style={styles.label}>Instagram Link</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Instagram link"
          value={instagramLink}
          onChangeText={setInstagramLink}
        />
        <Text style={styles.label}>Google Link</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Instagram link"
          value={instagramLink}
          onChangeText={setInstagramLink}
        />
        <Text style={styles.label}>Facebook Link</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Instagram link"
          value={instagramLink}
          onChangeText={setInstagramLink}
        />
        <Text style={styles.label}>Offer Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter offer details"
          value={offerText}
          onChangeText={setOfferText}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={sendPromotion}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PromotionalMessage;
