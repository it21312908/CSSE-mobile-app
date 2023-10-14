import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ImageBackground } from 'react-native';
import { db } from '../config';
import { ref, set, push } from 'firebase/database';

const AddSupplier = () => {
  const [supplierName, setSupplierName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');

  const addSupplier = () => {
    // Use the Firebase Realtime Database reference to push (add) data
    const supplierRef = ref(db, 'suppliers');
    const newSupplierRef = push(supplierRef); // Generates a unique ID
    set(newSupplierRef, {
      supplierName: supplierName,
      email: email,
      companyName: companyName,
      address: address,
      telephone: telephone,
    })
      .then(() => {
        console.log('Supplier added successfully');
        setSupplierName('');
        setEmail('');
        setCompanyName('');
        setAddress('');
        setTelephone('');
      })
      .catch((error) => {
        console.error('Error adding supplier:', error);
      });
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.header}>Add Supplier</Text>

      <TextInput
        placeholder='Supplier Name'
        value={supplierName}
        onChangeText={(text) => setSupplierName(text)}
        style={styles.input}
      />

      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />

      <TextInput
        placeholder='Company Name'
        value={companyName}
        onChangeText={(text) => setCompanyName(text)}
        style={styles.input}
      />

      <TextInput
        placeholder='Address'
        value={address}
        onChangeText={(text) => setAddress(text)}
        style={styles.input}
      />

      <TextInput
        placeholder='Telephone Number'
        value={telephone}
        onChangeText={(text) => setTelephone(text)}
        style={styles.input}
      />

      <Button title='Add Supplier' onPress={addSupplier} />
    </View>
  );
};

export default AddSupplier;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 100,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
});

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, Button, ImageBackground } from 'react-native';
// import { db } from '../config';
// import { ref, set, push } from 'firebase/database';
// import { TouchableOpacity } from 'react-native';

// const AddSupplier = () => {
//   const [supplierName, setSupplierName] = useState('');
//   const [email, setEmail] = useState('');
//   const [companyName, setCompanyName] = useState('');
//   const [address, setAddress] = useState('');
//   const [telephone, setTelephone] = useState('');

//   const addSupplier = () => {
//     // Use the Firebase Realtime Database reference to push (add) data
//     const supplierRef = ref(db, 'suppliers');
//     const newSupplierRef = push(supplierRef); // Generates a unique ID
//     set(newSupplierRef, {
//       supplierName: supplierName,
//       email: email,
//       companyName: companyName,
//       address: address,
//       telephone: telephone,
//     })
//       .then(() => {
//         console.log('Supplier added successfully');
//         setSupplierName('');
//         setEmail('');
//         setCompanyName('');
//         setAddress('');
//         setTelephone('');
//       })
//       .catch((error) => {
//         console.error('Error adding supplier:', error);
//       });
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/c2.jpeg')}
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>
//         <Text style={styles.header}>Add Supplier</Text>

//         <TextInput
//           placeholder='Supplier Name'
//           value={supplierName}
//           onChangeText={(text) => setSupplierName(text)}
//           style={styles.input}
//         />

//         <TextInput
//           placeholder='Email'
//           value={email}
//           onChangeText={(text) => setEmail(text)}
//           style={styles.input}
//         />

//         <TextInput
//           placeholder='Company Name'
//           value={companyName}
//           onChangeText={(text) => setCompanyName(text)}
//           style={styles.input}
//         />

//         <TextInput
//           placeholder='Address'
//           value={address}
//           onChangeText={(text) => setAddress(text)}
//           style={styles.input}
//         />

//         <TextInput
//           placeholder='Telephone Number'
//           value={telephone}
//           onChangeText={(text) => setTelephone(text)}
//           style={styles.input}
//         />

//         {/* <Button style={styles.addButton} title='Add Supplier' onPress={addSupplier} /> */}
//         <TouchableOpacity
//   style={styles.addButton} // Apply the custom style to the button
//   onPress={addSupplier}
// >
//   <Text style={styles.buttonText}>Add Supplier</Text>
// </TouchableOpacity>

//       </View>
//     </ImageBackground>
//   );
// };

// export default AddSupplier;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'transparent', // Set to transparent to allow the background image to show
//   },
//   header: {
//     fontSize: 30,
//     textAlign: 'center',
//     marginTop: 100,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 3,
//     borderColor: 'black',
//     margin: 10,
//     padding: 10,
//     fontSize: 18,
//     borderRadius: 6,
//     fontWeight:'bold',
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     width: '100%',
//     height: '100%',
//   },
//   addButton: {
//     backgroundColor: '#08457e', // Background color
//     borderRadius: 20, // Rounded corners
//     borderWidth: 2, // Border width
//     borderColor: '#0074e4', // Border color
//     padding: 10,
//     alignItems: 'center',
//     marginBottom: 60,
//     width: 160,
//     alignSelf: 'center', // Center the button horizontally
//     position: 'absolute',
//     bottom: 0,
    
//   },
//   buttonText: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold' // Text color
//   },
// });
