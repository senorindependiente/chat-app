import React, { Component } from "react";
//adding firebase google database
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
//local storage solution for react native
import AsyncStorage from "@react-native-async-storage/async-storage";
//external library gifted-chat
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    };
    //configurations to allow this app to connect to Cloud Firestore database
    const firebaseConfig = {
      apiKey: "AIzaSyBGKlFEGjaYkQjYU8vXXvGCQ4bGwrhrNes",
      authDomain: "chatapp-ed889.firebaseapp.com",
      projectId: "chatapp-ed889",
      storageBucket: "chatapp-ed889.appspot.com",
      messagingSenderId: "337278130100",
      appId: "1:337278130100:web:296202d3e8af5ad94d84e1"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //this creates a reference to my Firestore collection "messages"
    //This stores and retrieves the chat messages the users send.
    this.referenceMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    //  takes the entered username from start.js assigned to a variable "name"
    let name = this.props.route.params.name;

    //This takes a momentarely record of your database/collection to update it
    //to stop the onSnapshot function create unsusbscribe function

    this.unsubscribe = this.referenceMessages.onSnapshot(
      this.onCollectionUpdate
    );

    //Firestore User Authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages: messages,
    });
  };

  addMessages() {
    // add a new message + user data  to the messages collection
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user,
    });
  }

  //this function adds new chat messages to the state
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
    });
  };
    
  

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  //whenever there are changes to the "messages" collection this function needs to be called
  //the function retrieves the current data of "messages" collection and stores it in "state messages", allowing the data to be rendered in the view

  // adds background colors for the chat text to the different chat users
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "white",
          },
          right: {
            backgroundColor: "blue",
          },
        }}
      />
    );
  }

  render() {
    // takes the input parameters of background color defined in the start.js component

    let bgColor = this.props.route.params.bgColor;
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
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar,
          }}
        />
        {/* this fixes android keyboard */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
// })
