import React, { Component } from "react";
import {
  ImageBackground,
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
} from "react-native";
export default class Chat extends Component {
  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;

    let bgColor = this.props.route.params.bgColor;

    this.props.navigation.setOptions({ title: name });

    return (
      <View
        style={{
          flex: 1, justifyContent: 'center', alignItems: 'center', 
          backgroundColor: bgColor,

        }}
      >
        <Text>hello</Text>
      </View>
    );
  }
}

// const styles = StyleSheet.create({
// })
