import React from "react";
import { StatusBar, StyleSheet, View, Text } from "react-native";
import Home from "./src/Home";
import Amplify from "aws-amplify";
import awsconfig from "./src/aws-exports";
Amplify.configure(awsconfig);

function App() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <Home />
    </View>
  );
}

export default App;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
});
