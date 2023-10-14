import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ImageBackground } from 'react-native'; // Import ImageBackground
import { db } from '../config';
import { ref, push, onValue } from 'firebase/database';
import { StatusBar } from 'expo-status-bar';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const AddOrder = ({ route }) => {
  const { supplierEmail, supplierId } = route.params;
  const navigation = useNavigation();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(supplierEmail);
  const [subject, setSubject] = useState('Order Details');

  // Initialize an array to store order details for multiple products
  const [orderDetails, setOrderDetails] = useState([]);
  const currentDate = new Date().toLocaleDateString();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    async function checkAvailability() {
      const isMailAvailable = await MailComposer.isAvailableAsync();
      setIsAvailable(isMailAvailable);
    }

    checkAvailability();
  }, []);

  useEffect(() => {
    // Fetch related products when the component mounts
    fetchRelatedProducts(supplierId);
  }, [supplierId]);

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

  const addProductToOrder = (product, quantity) => {
    if (!product || !quantity) {
      alert('Please fill in product and quantity fields.');
      return;
    }

    // Find the selected product
    const selectedProduct = relatedProducts.find((p) => p.productName === product);

    if (!selectedProduct) {
      alert('Invalid product selected.');
      return;
    }

    const productPrice = selectedProduct.productPrice;

    // Calculate the total amount for this product
    const totalAmountForProduct = productPrice * quantity;

    // Add the product details to the order details array
    setOrderDetails([...orderDetails, { product, quantity, totalAmountForProduct }]);

    // Update the totalAmount
    setTotalAmount(totalAmount + totalAmountForProduct);
  };

  const calculateTotalPrice = () => {
    return totalAmount;
  };

  const sendOrderAndPlaceOrder = async () => {
    if (!recipientEmail || orderDetails.length === 0) {
      alert('Please fill in recipient email and add at least one product to the order.');
      return;
    }

    // Create HTML for the order
    let pdfHtml = `<h1>Order Details</h1><p>Order Date: ${currentDate}</p>`;

    for (const product of orderDetails) {
      pdfHtml += `
        <p>Product: ${product.product}</p>
        <p>Quantity: ${product.quantity}</p>
        <p>Total Amount: $${product.totalAmountForProduct.toFixed(2)}</p>
      `;
    }

    // Generate the PDF with the HTML content
    const { uri } = await Print.printToFileAsync({
      html: pdfHtml,
    });

    // Create a reference to the 'orders' collection and push a new order document
    const orderRef = ref(db, 'orders');

    // Save the order data
    const orderData = {
      supplierId: supplierId,
      date: currentDate,
      products: orderDetails, // Save the entire array of products
      totalAmount: totalAmount, // Add the totalAmount to the order data
    };

    // Set the order data in the new order document
    push(orderRef, orderData)
      .then(() => {
        console.log('Order placed successfully');
      })
      .catch((error) => {
        console.error('Error placing order:', error);
      });

    // Clear the order details and reset totalAmount
    setOrderDetails([]);
    setTotalAmount(0);

    // Compose email with multiple attachments
    MailComposer.composeAsync({
      subject: subject,
      recipients: [recipientEmail],
      attachments: [uri],
    });
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
          renderItem={({ item }) => (
            <View>
              <Text>Product: {item.product}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Total Amount: ${item.totalAmountForProduct.toFixed(2)}</Text>
            </View>
          )}
        />

        <Text style={styles.relatedProductsHeader}>Total Price</Text>
        <Text>Total Price: ${calculateTotalPrice().toFixed(2)}</Text>

        {isAvailable ? (
          <Button title="Send Order and Place Order" onPress={sendOrderAndPlaceOrder} />
        ) : (
          <Text>Email not available</Text>
        )}
        <StatusBar style="auto" />
      </View>
  );
};

// AddProductToOrder component
const AddProductToOrder = ({ addProductToOrder, relatedProducts }) => {
  const [currentProduct, setCurrentProduct] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');

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

      <Button
        title="Add Product"
        onPress={() => {
          addProductToOrder(currentProduct, currentQuantity);
          setCurrentProduct('');
          setCurrentQuantity('');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Set the background to be transparent
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    backgroundColor: 'white', // Add a white background to input fields
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black', // Change text color to white
  },
  relatedProductsHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 60,
    color: 'black', // Change text color to white
  },
});

export default AddOrder;
