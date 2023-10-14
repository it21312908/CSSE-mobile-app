
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const HelloPage = () => {
//   const navigation = useNavigation();

//   const navigateToFetchSuppliers = () => {
//     navigation.navigate('FetchSuppliers'); // Replace 'FetchSuppliers' with your actual screen name
//   };

//   const navigateToOrderHistory = () => {
//     navigation.navigate('OrderHistory');
//   };

//   const navigateToRegistration = () => {
//     navigation.navigate('Registration'); // Replace 'Registration' with your actual registration screen name
//   };

//   const navigateToFetchProducts = () => {
//     navigation.navigate('FetchProducts'); // Replace 'Registration' with your actual registration screen name
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Hello</Text>
//       <TouchableOpacity onPress={navigateToFetchSuppliers} style={styles.button}>
//         <Text style={styles.buttonText}>Go to Fetch Suppliers</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={navigateToOrderHistory} style={styles.button}>
//         <Text style={styles.buttonText}>Go to OrderHistory</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={navigateToRegistration} style={styles.button}>
//         <Text style={styles.buttonText}>Go to Registration</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={navigateToFetchProducts} style={styles.button}>
//         <Text style={styles.buttonText}>Go to Fetch Products</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 30,
//     fontWeight: 'bold',
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//   },
// });

// export default HelloPage;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HelloPage = () => {
  const navigation = useNavigation();

  // Sample supplier data (replace with your actual data)
  const supplierData = { id: 'supplier123', name: 'Sample Supplier' };

  const navigateToFetchSuppliers = () => {
    navigation.navigate('FetchSuppliers'); // Replace 'FetchSuppliers' with your actual screen name
  };

  const navigateToOrderHistory = () => {
    navigation.navigate('OrderHistory');
  };

  const navigateToRegistration = () => {
    navigation.navigate('Registration'); // Replace 'Registration' with your actual registration screen name
  };

  const navigateToFetchProducts = () => {
    navigation.navigate('FetchProducts', { supplierData: supplierData }); // Pass supplierData
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
      <TouchableOpacity onPress={navigateToFetchSuppliers} style={styles.button}>
        <Text style={styles.buttonText}>Go to Fetch Suppliers</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToOrderHistory} style={styles.button}>
        <Text style={styles.buttonText}>Go to OrderHistory</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToRegistration} style={styles.button}>
        <Text style={styles.buttonText}>Go to Registration</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToFetchProducts} style={styles.button}>
        <Text style={styles.buttonText}>Go to Fetch Products</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HelloPage;
