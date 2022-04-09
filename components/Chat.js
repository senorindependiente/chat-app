import React, { Component } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  ImageBackground,
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  Platform, KeyboardAvoidingView
} from "react-native";
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
         {
    _id: 2,
    text: 'This is a system message',
    createdAt: new Date(),
    system: true,
   },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }


  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'white',
          },
          right: {
            backgroundColor: 'blue'
          }
        }}
      />
    )
  }




  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;

    let bgColor = this.props.route.params.bgColor;

    this.props.navigation.setOptions({ title: name });

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor,
        }}
      >
        <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}

          
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
 }
      </View>
    );
  }
}

// const styles = StyleSheet.create({
// })
