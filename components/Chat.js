import React, { Component } from "react";
//adding firebase google database

import * as firebase from 'firebase';
import 'firebase/firestore';
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";

//import package to determine if user is online or not
import NetInfo from "@react-native-community/netinfo";
//local storage solution for react native
import AsyncStorage from "@react-native-async-storage/async-storage";
//external library gifted-chat
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

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
      isConnected: false,
      image: null,
      location: null,
    };
    //configurations to allow this app to connect to Cloud Firestore database
    const firebaseConfig = {
      apiKey: "AIzaSyBGKlFEGjaYkQjYU8vXXvGCQ4bGwrhrNes",
      authDomain: "chatapp-ed889.firebaseapp.com",
      projectId: "chatapp-ed889",
      storageBucket: "chatapp-ed889.appspot.com",
      messagingSenderId: "337278130100",
      appId: "1:337278130100:web:296202d3e8af5ad94d84e1",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }


    //this creates a reference to my Firestore collection "messages"
    //This stores and retrieves the chat messages the users send.
    this.referenceMessages = firebase.firestore().collection("messages");
    this.refMsgsUser = null;
  }
  //retrieve messsages asynchronious trough asyncstorage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  //function to save message in asynstorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  //function to delet message in asynstorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    //  takes the entered username from start.js assigned to a variable "name"
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");
        // listens for updates in the collection
        this.unsubscribe = this.referenceMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);

        // user authentication
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              return await firebase.auth().signInAnonymously();
            }

            //update user state with currently active user data
            this.setState({
              uid: user.uid,
              messages: [],
              user: {
                _id: user.uid,
                name: name,
                avatar: "https://placeimg.com/140/140/any",
              },
            });

            //messages for current user
            this.refMsgsUser = firebase
              .firestore()
              .collection("messages")
              .where("uid", "==", this.state.uid);
          });

        // save messages locally
        this.saveMessages();
      } else {
        // if the user is offline
        this.setState({ isConnected: false });
        console.log("offline");
        this.getMessages();
      }
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
        image: data.image,
        location: data.locationl,
      });
    });
    this.setState({
      messages: messages,
    });

    this.saveMessages();
  };

  addMessages() {
    // add a new message + user data  to the messages collection
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image,
      location: message.location,
    });
  }

  //this function adds new chat messages to the state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
      }
    );
  }

  componentWillUnmount() {
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.unsubscribe();
        this.authUnsubscribe();
      }
    });
  }
  //changes how the chat bar is rendered
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
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

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  renderCustomActions(props) {
    return <CustomActions {...props} />;
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
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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
