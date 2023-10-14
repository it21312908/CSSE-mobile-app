import 'react-native-gesture-handler';
// import { StyleSheet } from 'react-native';
import HelloPage from './src/index';
import AddSupplier from './src/AddSuppliers';
import FetchSuppliers from './src/FetchSuppliers';
import UpdateData from './src/UpdateData';
import AddOrder from './src/AddOrder';
import OrderHistory from './src/OrderHistory';
import UpdateOrder from './src/UpdateOrder';
import AddProducts from './src/AddProducts';
import FetchProducts from './src/FetchProducts';
import UpdateProduct from './src/UpdateProduct';
// import Registration from './src/Registration';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="index" component={HelloPage} />
        {/* <Stack.Screen name="Registration" component={Registration} /> */}
        <Stack.Screen name="FetchSuppliers" component={FetchSuppliers} />
        <Stack.Screen name="AddSupplier" component={AddSupplier} />
        <Stack.Screen name="UpdateData" component={UpdateData} />
        <Stack.Screen name="AddOrder" component={AddOrder} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} />
        <Stack.Screen name="UpdateOrder" component={UpdateOrder} />
        <Stack.Screen name="AddProducts" component={AddProducts} />
        <Stack.Screen name="FetchProducts" component={FetchProducts} />
        <Stack.Screen name="UpdateProduct" component={UpdateProduct} />
      </Stack.Navigator>

      {/* <TabNavigator /> */}
    </NavigationContainer>
  );
}

