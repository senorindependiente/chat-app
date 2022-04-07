import React, { Component } from "react";
import {
  ImageBackground,
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native-web";

export default class Start extends Component {
  //setting state for name and backgroundcolor
  constructor(props) {
    super(props);
    this.state = { name: "", bgColor: this.colors.dark };
  }

  // function to setState to change the backgroundcolor on user select of background
  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  // background colors the user can select
  colors = {
    dark: "#090C08",
    purple: "#474056",
    blue: "#8A95A5",
    green: "#B9C6AE",
  };

  //function that will invoke the setState of text
  // This will handle the input of the user

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require("./image.png")} >
          <Text style={styles.title}>Chat-App</Text>
          <View style={styles.wrapper}>
            <View style={styles.inputBox}>
            <Image source={require("./icon.png")} style={styles.image} />
              <TextInput
                // value assign from the state text
                value={this.state.name}
                //onChangeText react native event handler, uses change of input from user
                onChangeText={(name) => this.setState({ name })}
                style={styles.input}
                placeholder="Your Name"
              />
            </View>
            <Text syle={styles.text}>Choose Background Color</Text>
            <View style={styles.colorwrapper}>
              <TouchableOpacity
                style={styles.circle1}
                onPress={() => this.changeBgColor(this.colors.dark)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.circle2}
                onPress={() => this.changeBgColor(this.colors.purple)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.circle3}
                onPress={() => this.changeBgColor(this.colors.blue)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.circle4}
                onPress={() => this.changeBgColor(this.colors.green)}
              ></TouchableOpacity>
            </View>
            <Button
              title="Start Chatting"
              color="#757083"
              style={styles.button}
              //onPress react native event handler, user presses on something
              // here the pressing of the button will navigate to the different (screen) component called "Chat"
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  bgColor: this.state.bgColor,
                })
              }
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
// image:{
// height:2, 
// },
// inputBox:{
//     flex: 1, flexDirection: "row",
// },
  wrapper: {
    backgroundColor: "white",
    width: "88%",
    height: "30%",
    padding: 20,
    marginBottom: 60,
  },
  button: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: 600,
    color: "#FFFFFF",
  },
  input: {
    paddingLeft: 10,
    height: 40,
    borderColor: "orange",
    borderWidth: 1,
    fontSize: 16,
    fontWeight: 300,
    color: "#757083",
    opacity: "50%",
    marginBottom: 30,
  },
  title: {
    marginTop: 0,
    color: "#FFFFFF",
    fontSize: 45,
    lineHeight: 600,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
  },
  colorwrapper: { flex: 1, flexDirection: "row", marginTop: 10 },

  circle1: {
    backgroundColor: "#090C08",
    borderRadius: "50%",
    width: 30,
    height: 30,
    marginRight: 10,
  },
  circle2: {
    backgroundColor: "#474056",
    borderRadius: "50%",
    width: 30,
    height: 30,
    marginRight: 10,
  },
  circle3: {
    backgroundColor: "#8A95A5",
    borderRadius: "50%",
    width: 30,
    height: 30,
    marginRight: 10,
  },
  circle4: {
    backgroundColor: "#B9C6AE",
    borderRadius: "50%",
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
