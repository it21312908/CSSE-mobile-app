import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../config';
import { ref, onValue, set } from 'firebase/database';
import { StatusBar } from 'expo-status-bar';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const UpdateOrder = ({ route }) => {
  const { orderId, supplierEmail, supplierId } = route.params;
  const navigation = useNavigation();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(supplierEmail);
  const [subject, setSubject] = useState('Order Details');

  // Initialize an array to store order details for multiple products
  const [orderDetails, setOrderDetails] = useState([]);
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    async function checkAvailability() {
      const isMailAvailable = await MailComposer.isAvailableAsync();
      setIsAvailable(isMailAvailable);
    }

    checkAvailability();

    fetchRelatedProducts(supplierId);
    fetchOrderDetails(orderId);
  }, [supplierId, orderId]);

  const fetchRelatedProducts = (supplierId) => {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const dataFromDB = snapshot.val();
      if (dataFromDB) {
        const productsArray = Object.keys(dataFromDB).map((key) => ({
          id: key,
          ...dataFromDB[key],
        }));
        const relatedProductsArray = productsArray.filter(
          (product) => product.supplierId === supplierId
        );
        setRelatedProducts(relatedProductsArray);
      } else {
        setRelatedProducts([]);
      }
    });
  };

  const fetchOrderDetails = (orderId) => {
    const orderRef = ref(db, `orders/${orderId}`);
    onValue(orderRef, (snapshot) => {
      const orderData = snapshot.val();
      if (orderData && orderData.products) {
        setOrderDetails(orderData.products);
      } else {
        setOrderDetails([]);
      }
    });
  };

  const updateOrderDetails = () => {
    // if (!recipientEmail || orderDetails.length === 0) {
    //   alert('Please fill in recipient email and add at least one product to the order.');
    //   return;
    // }

    // Create HTML for the order
    let pdfHtml = `<h1>Order Details</h1><p>Order Date: ${currentDate}</p>`;
    
    for (const product of orderDetails) {
      pdfHtml += `
        <p>Product: ${product.product}</p>
        <p>Quantity: ${product.quantity}</p>
        <p>Notes: ${product.notes}</p>
      `;
    }

    // Generate the PDF with the HTML content
    Print.printToFileAsync({
      html: pdfHtml,
    }).then(({ uri }) => {
      // Create a reference to the 'orders' collection and update the order document
      const orderRef = ref(db, `orders/${orderId}`);
      const orderData = {
        supplierId: supplierId,
        date: currentDate,
        products: orderDetails, // Save the entire array of products
      };

      // Set the order data in the existing order document
      set(orderRef, orderData)
        .then(() => {
          console.log('Order updated successfully');
        })
        .catch((error) => {
          console.error('Error updating order:', error);
        });

      // Compose email with multiple attachments
      MailComposer.composeAsync({
        subject: subject,
        recipients: [recipientEmail],
        attachments: [uri],
      });
    });
  };

  const addProductToOrder = (product, quantity, notes) => {
    // if (!product || !quantity) {
    //   alert('Please fill in product and quantity fields.');
    //   return;
    // }

    // Add the product details to the order details array
    setOrderDetails([...orderDetails, { product, quantity, notes }]);
  };

  const deleteProductFromOrder = (index) => {
    const updatedOrderDetails = [...orderDetails];
    updatedOrderDetails.splice(index, 1);
    setOrderDetails(updatedOrderDetails);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Date: {currentDate}</Text>
      <TextInput
        value={recipientEmail}
        onChangeText={setRecipientEmail}
        placeholder="Recipient Email"
        keyboardType="email-address"
      />

      {/* Add a component for adding products to the order */}
      <AddProductToOrder addProductToOrder={addProductToOrder} relatedProducts={relatedProducts} />

      <Text style={styles.relatedProductsHeader}>Products in Order</Text>
      <FlatList
        data={orderDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.orderItem}>
            <Text>Product: {item.product}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Notes: {item.notes}</Text>
            <TouchableOpacity onPress={() => deleteProductFromOrder(index)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {isAvailable ? (
        <Button title="Update Order" onPress={updateOrderDetails} />
      ) : (
        <Text>Email not available</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

// AddProductToOrder component (same as in AddOrder.js)
// AddProductToOrder component
const AddProductToOrder = ({ addProductToOrder, relatedProducts }) => {
  const [currentProduct, setCurrentProduct] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');

  return (
    <View>
      <Text>Add Product to Order:</Text>
      <Picker
        selectedValue={currentProduct}
        onValueChange={(itemValue) => {
          setCurrentProduct(itemValue);
        }}
      >
        <Picker.Item label="Select a Product" value="" />
        {relatedProducts.map((product) => (
          <Picker.Item
            key={product.id}
            label={product.productName}
            value={product.productName}
          />
        ))}
      </Picker>
      <TextInput
        placeholder='Quantity'
        value={currentQuantity}
        onChangeText={(text) => setCurrentQuantity(text)}
        style={styles.input}
      />
      <TextInput
        placeholder='Notes'
        value={currentNotes}
        onChangeText={(text) => setCurrentNotes(text)}
        style={styles.input}
      />
      <Button
        title="Add Product"
        onPress={() => {
          addProductToOrder(currentProduct, currentQuantity, currentNotes);
          setCurrentProduct('');
          setCurrentQuantity('');
          setCurrentNotes('');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ...
  orderItem: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 5,
  },
  deleteButton: {
    color: 'red',
    marginTop: 5,
  },
});

export default UpdateOrder;
