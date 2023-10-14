import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../config';
import { ref, update } from 'firebase/database';
import { useRoute } from '@react-navigation/native';

const UpdateProduct = ({ navigation }) => {
  const route = useRoute();
  const { productId, productName, quantity, productPrice } = route.params;
  const [newProductName, setNewProductName] = useState(productName);
  const [newQty, setNewQty] = useState(quantity !== undefined ? quantity.toString() : ''); // Initialize with an empty string
  const [newUprice, setNewUprice] = useState(productPrice !== undefined ? productPrice.toString() : ''); // Initialize with an empty string

  const handleUpdateProduct = () => {
    const productRef = ref(db, `products/${productId}`);
    const updates = {
      productName: newProductName,
      qty: parseFloat(newQty), // Convert to a number if needed
      uprice: parseFloat(newUprice), // Convert to a number if needed
    };

    update(productRef, updates)
      .then(() => {
        console.log('Product updated successfully');
        navigation.goBack(); // Go back to the previous screen
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={newProductName}
        onChangeText={(text) => setNewProductName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={newQty}
        onChangeText={(text) => setNewQty(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Unit Price"
        value={newUprice}
        onChangeText={(text) => setNewUprice(text)}
      />
      <Button title="Update Product" onPress={handleUpdateProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default UpdateProduct;
