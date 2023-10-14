import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Modal } from 'react-native';
import { db } from '../config';
import { ref, onValue, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';


const FetchSuppliers = ({}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products
  const navigation = useNavigation();

  useEffect(() => {
    const supplierRef = ref(db, 'suppliers');
    onValue(supplierRef, (snapshot) => {
      const dataFromDB = snapshot.val();
      if (dataFromDB) {
        const supplierArray = Object.keys(dataFromDB).map((key) => ({
          id: key,
          ...dataFromDB[key],
        }));
        setSuppliers(supplierArray);
        // console.log('Fetched suppliers:', supplierArray)
      }
    });
  }, []);

  const fetchRelatedProducts = (supplierId) => {
    const productsRef = ref(db, 'products');
    console.log('fetchRelatedProducts called with supplierId:', supplierId);
    onValue(productsRef, (snapshot) => {
      const dataFromDB = snapshot.val();
      if (dataFromDB) {
        const productsArray = Object.keys(dataFromDB).map((key) => ({
          id: key,
          ...dataFromDB[key],
        }));
        const relatedProductsArray = productsArray.filter((product) => product.supplierId === supplierId);
        setRelatedProducts(relatedProductsArray);
        
      } else {
        // If no related products are found, set an empty array
        setRelatedProducts([]);
      }
    });
  };


  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    fetchRelatedProducts(supplier.id); // Fetch related products when a supplier is clicked
    setModalVisible(true);
  };
  

  const handleDelete = () => {
    if (selectedSupplier) {
      const supplierRef = ref(db, 'suppliers/' + selectedSupplier.id);
      remove(supplierRef)
        .then(() => {
          console.log('Supplier deleted successfully');
          setModalVisible(false);
          setSelectedSupplier(null);
        })
        .catch((error) => {
          console.error('Error deleting supplier:', error);
        });
    }
  };

  const handleUpdate = () => {
    if (selectedSupplier) {
      navigation.navigate('UpdateData', { item: selectedSupplier }); // Pass selectedSupplier as item
      setModalVisible(false);
      setSelectedSupplier(null);

    }
  };

  const handleSendOrder = (supplier) => {
    if (supplier) {
      // Pass both supplierId and supplierEmail as route parameters
      navigation.navigate('AddOrder', { supplierId: supplier.id, supplierEmail: supplier.email });
      setModalVisible(false);
      setSelectedSupplier(null);
      // No need to fetch related products here since it's done in the AddOrder component
    }
  };
  

  const handleAddProducts = () => {
    if (selectedSupplier) {
      // Send the supplier data to the AddProduct page
      navigation.navigate('AddProducts', { supplierData: selectedSupplier });
      setModalVisible(false);
      setSelectedSupplier(null);
      
    }
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Suppliers</Text>
     
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSupplierClick(item)}>
            <Card style={styles.card}>
            <Text style={styles.supplierName}>{item.supplierName}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
      <Button title='Go to Add Supplier Page' onPress={() => navigation.navigate('AddSupplier')} />
      
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Supplier Details</Text>
          {selectedSupplier && (
            <View>
              <Text>ID: {selectedSupplier.id}</Text>
              <Text>Name: {selectedSupplier.supplierName}</Text>
              <Text>Email: {selectedSupplier.email}</Text>
              <Text>Company Name: {selectedSupplier.companyName}</Text>
              <Text>Address: {selectedSupplier.address}</Text>
              <Text>Telephone: {selectedSupplier.telephone}</Text>
              <Button title='Update' onPress={handleUpdate} />
              <Button title='Delete' onPress={handleDelete} />
              <Button title='Send Order' onPress={() => handleSendOrder(selectedSupplier)} />

              <Button title='Add Product' onPress={handleAddProducts} />
            </View>
          )}

          {/* Display related products */}
          <Text style={styles.modalHeader}>Related Products</Text>
          <FlatList
            data={relatedProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <Text>Product Name: {item.productName}</Text>
                <Text>Quantity: {item.quantity}</Text>
                {/* Add any other product details you want to display */}
              </View>
            )}
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  supplierName: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default FetchSuppliers;