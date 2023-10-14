import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { db } from '../config';
import { ref, onValue, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const orderRef = ref(db, 'orders');
    onValue(orderRef, (snapshot) => {
      const dataFromDB = snapshot.val();
      if (dataFromDB) {
        const orderArray = Object.keys(dataFromDB).map((key) => ({
          id: key,
          ...dataFromDB[key],
        }));
        setOrders(orderArray);
      }
    });
  }, []);

  const handleOrderClick = (order) => {
    const { id: orderId, supplierEmail, supplierId, products, quantities } = order;
    navigation.navigate('UpdateOrder', { orderId, supplierEmail, supplierId, products, quantities });
  };

  const deleteOrder = (orderId) => {
    const orderRef = ref(db, `orders/${orderId}`);
    remove(orderRef)
      .then(() => {
        // Order deleted successfully, you can update the UI accordingly
        const updatedOrders = orders.filter((order) => order.id !== orderId);
        setOrders(updatedOrders);
      })
      .catch((error) => {
        console.error('Error deleting order:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={styles.orderHeader}>
              <Text>Date: {item.date}</Text>
              <Button
                title="Delete"
                onPress={() => deleteOrder(item.id)}
              />
            </View>
            <Text>Products:</Text>
            <FlatList
              data={item.products}
              keyExtractor={(product, index) => index.toString()}
              renderItem={({ item: product }) => (
                <View style={styles.productItem}>
                  <Text>Product: {product.product}</Text>
                  <Text>Quantity: {product.quantity}</Text>
                </View>
              )}
            />
            <TouchableOpacity onPress={() => handleOrderClick(item)}>
              <Text>Edit Order</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productItem: {
    marginLeft: 16,
    marginTop: 8,
  },
});

export default OrderHistory;
