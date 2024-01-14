import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';

const YourComponent = ({title}) => {
  return (
    <View style={styles.cardContainer}>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80' }}
          style={styles.cardImage}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>UI/UX Review Check</Text>
        <Text style={styles.descriptionText}>
          The place is close to Barceloneta Beach and bus stop just 2 min by walk
          and near to "Naviglio" where you can enjoy the main night life in
          Barcelona.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.buttonText}>Read More</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  descriptionText: {
    fontSize: 16,
    color: '#4b5563',
  },
  buttonContainer: {
    padding: 20,
  },
  readMoreButton: {
    backgroundColor: '#ff5f66',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  footerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
  },
  linkText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default YourComponent;
