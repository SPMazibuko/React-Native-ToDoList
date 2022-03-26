import React from "react";
import { StatusBar, StyleSheet, View, Text } from "react-native";
import Home from "./src/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Amplify from "aws-amplify";
import awsconfig from "./src/aws-exports";
import Register from "./src/Register";
import Login from "./src/Login";
import ConfirmSignUp from "./src/ConfirmSignUp";

Amplify.configure(awsconfig);
const AppStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <AppStack.Screen name="Login" component={Login} />
        <AppStack.Screen name="Register" component={Register} />
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="ConfirmSignUp" component={ConfirmSignUp} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
});
