import React from "react";
import { StatusBar, StyleSheet, View, Text } from "react-native";

import Amplify from "aws-amplify";
import awsconfig from "./src/aws-exports";
Amplify.configure(awsconfig);

function App() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <Text>Are we ON?????</Text>
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
