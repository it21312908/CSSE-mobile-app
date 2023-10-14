import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { db } from '../config'
import { ref, set } from 'firebase/database'

const UpdateData = ({ route }) => {

    const { item } = route.params; // Get the supplier data passed from the previous screen

    const [supplierName, setSupplierName] = useState(item.supplierName);
    const [email, setEmail] = useState(item.email);
    const [companyName, setCompanyName] = useState(item.companyName);
    const [address, setAddress] = useState(item.address);
    const [telephone, setTelephone] = useState(item.telephone);

    const UpdateData = () => {
        const supplierRef = ref(db, `suppliers/${item.id}`);
        set(supplierRef, {
            supplierName: supplierName,
            email: email,
            companyName: companyName,
            address: address,
            telephone: telephone,
        })
            .then(() => {
                console.log('Supplier data updated successfully');
            })
            .catch((error) => {
                console.error('Error updating supplier data:', error);
            });
    };

    return (
        <View>
            <Text style={styles.header}>Update Supplier</Text>

            <TextInput
                placeholder='Supplier Name'
                value={supplierName}
                onChangeText={(text) => setSupplierName(text)}
                style={styles.input} />

            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input} />

            <TextInput
                placeholder='Company Name'
                value={companyName}
                onChangeText={(text) => setCompanyName(text)}
                style={styles.input} />

            <TextInput
                placeholder='Address'
                value={address}
                onChangeText={(text) => setAddress(text)}
                style={styles.input} />

            <TextInput
                placeholder='Telephone Number'
                value={telephone}
                onChangeText={(text) => setTelephone(text)}
                style={styles.input} />

            <Button title='Update Supplier' onPress={UpdateData} />
        </View>
    )
}

export default UpdateData

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 100,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        margin: 10,
        padding: 10,
        fontSize: 18,
        borderRadius: 6
    }
});
