import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { db } from '../config';
import { ref, onValue, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const FetchProducts = () => {
  const [productGroups, setProductGroups] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const productsRef = ref(db, 'products');
    const supplierRef = ref(db, 'suppliers');

    onValue(productsRef, (productSnapshot) => {
      const productData = productSnapshot.val();

      onValue(supplierRef, (supplierSnapshot) => {
        const supplierData = supplierSnapshot.val();

        if (productData && supplierData) {
          const productGroupsArray = Object.keys(supplierData).map((supplierId) => ({
            supplier: supplierData[supplierId],
            products: Object.keys(productData)
              .filter((productId) => productData[productId].supplierId === supplierId)
              .map((productId) => ({ id: productId, ...productData[productId] })),
          }));
          setProductGroups(productGroupsArray);
        }
      });
    });
  }, []);

  const handleDeleteProduct = (productId) => {
    const productRef = ref(db, `products/${productId}`);
    remove(productRef);
  };

  const handleUpdateClick = (product) => {
    const { id: productId, productName, quantity, productPrice } = product;
    navigation.navigate('UpdateProduct', { productId, productName, quantity, productPrice });
  };

  const handleRefresh = () => {
    // Implement the same logic as the useEffect block above
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Products and Suppliers</Text>
      <Button title="Refresh" onPress={handleRefresh} />
      {productGroups.map((productGroup) => (
        <View key={productGroup.supplier.id} style={styles.section}>
          <Text style={styles.sectionHeader}>Supplier: {productGroup.supplier.supplierName}</Text>
          {productGroup.products.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Text>Product Name: {item.productName}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Unit Price: {item.productPrice}</Text>

              {/* <Text>Supplier ID: {item.supplierId}</Text> */}
              <TouchableOpacity
                onPress={() => handleDeleteProduct(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleUpdateClick(item)}>
              <Text>Edit</Text>
            </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
      <Button title="Add Supplier" onPress={() => navigation.navigate('AddSupplier')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productItem: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default FetchProducts;
