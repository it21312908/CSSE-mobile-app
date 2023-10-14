import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { ref, push } from 'firebase/database';
import { db } from '../config';
import { useNavigation } from '@react-navigation/native';

const AddProduct = ({ route, navigation }) => {
  const { supplierData } = route.params; // Get the supplier data from navigation params
  const [products, setProducts] = useState([{ name: '', quantity: '' }]);
  
  const handleProductNameChange = (text, index) => {
    const updatedProducts = [...products];
    updatedProducts[index].name = text;
    setProducts(updatedProducts);
  };

  const handleProductPriceChange = (text, index) => {
    const updatedProducts = [...products];
    updatedProducts[index].unitPrice = text;
    setProducts(updatedProducts);
  };

  const handleQuantityChange = (text, index) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = text;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    const productsRef = ref(db, 'products');
    
    // Iterate over the products array and push each product to the database
    products.forEach((product) => {
      if (product.name && product.quantity && product.unitPrice) {
        const newProduct = {
          supplierId: supplierData.id,
          productName: product.name,
          productPrice: product.unitPrice,
          quantity: parseInt(product.quantity),
        };

        push(productsRef, newProduct)
          .then(() => {
            console.log('Product added successfully');
          })
          .catch((error) => {
            console.error('Error adding product:', error);
          });
      }
    });

    // Navigate back to the supplier details page
    navigation.goBack();
  };

  const handleAddRow = () => {
    setProducts([...products, { name: '', unitPrice: '', quantity: '' }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Products</Text>
      <ScrollView>
        {products.map((product, index) => (
          <View key={index}>
            <TextInput
              placeholder={`Product Name ${index + 1}`}
              style={styles.input}
              value={product.name}
              onChangeText={(text) => handleProductNameChange(text, index)}
            />

            <TextInput
              placeholder={`Unit Price ${index + 1}`}
              style={styles.input}
              value={product.unitPrice}
              onChangeText={(text) => handleProductPriceChange(text, index)}
              keyboardType="numeric"
            />

            <TextInput
              placeholder={`Quantity ${index + 1}`}
              style={styles.input}
              value={product.quantity}
              onChangeText={(text) => handleQuantityChange(text, index)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </ScrollView>
      <Button title="Add Product" onPress={handleAddProduct} />
      <Button title="Add Another Product" onPress={handleAddRow} />
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
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
  },
});

export default AddProduct;
