import React, { Component } from "react";
//adding firebase google database
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
//external library gifted-chat
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      uid:0,
      messages: [],
      createdAt:"",
      text:"",
      user:""
    };
    //configurations to allow this app to connect to Cloud Firestore database
    const firebaseConfig = {
      apiKey: "AIzaSyBGKlFEGjaYkQjYU8vXXvGCQ4bGwrhrNes",
      authDomain: "chatapp-ed889.firebaseapp.com",
      projectId: "chatapp-ed889",
      storageBucket: "chatapp-ed889.appspot.com",
      messagingSenderId: "337278130100",
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

    this.setState({
      //setting state for chat messages and for users
      //normal inital static message to welcome the user
      messages: [
        {
          _id: 1,
          text: "Welcome " + name + "!",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },

        //adding a system message to see when the user was last active
        //static system message that the user has entered the chat + the username
        {
          _id: 2,
          text: "User " + name + " has entered the chat",
          createdAt: new Date(),
          system: true,
        },
      ],
    });

    //snapShot function "listens" for updates in them messages collection
    this.referenceMessages = firebase.firestore().collection("messages");

    //This takes a momentarely record of your database/collection to update it
    //to stop the onSnapshot function create unsusbscribe function

    if (!undefined || !null) {
      this.unsubscribe = this.referenceMessages.onSnapshot(
        this.onCollectionUpdate
      );
    } else {
      alert("not found!");
    }

    //Firestore User Authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  //whenever there are changes to the "messages" collection this function needs to be called
  //the function retrieves the current data of "messages" collection and stores it in "state messages", allowing the data to be rendered in the view
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
        user: data.user,
      });
      this.setState({messages})
    });
  };

  //this function adds new chat messages to the state
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),

        })); 
        () => {
          this.addMessages();
        }

  }

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

  addMessages() {
    // add a new message + user data  to the messages collection
    this.referenceMessages.add({
      _id: data._id,
      text: data.text,
      createdAt: data.createdAt.toDate(),
      user: data.user,
      uid: this.state.uid,
    });
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
            _id: 1,
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
