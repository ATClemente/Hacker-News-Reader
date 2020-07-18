import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect, Ref }  from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, DrawerLayoutAndroid, TouchableNativeFeedback, BackHandler, Alert } from 'react-native';
import * as StorageService from "./services/StorageService";

import Profile from './components/Profile';
import Thread from './components/Thread';

import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import News from './components/News';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';


let drawerRef: React.RefObject<DrawerLayoutAndroid> = React.createRef();
let newsRef: React.RefObject<News> = React.createRef();

function NewsScreen({route, navigation}: {route:any, navigation:any}){
  /*useEffect(() => {
    const backAction = () => {
      Alert.alert("", "Are you sure you want to close?", [
        {
          text: "NO",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);*/

  useFocusEffect(()=>{
    const onBackPress = () => {
      Alert.alert("", "Are you sure you want to close?", [
        {
          text: "NO",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  );

  const [newsMode, setNewsMode] = useState("top");
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  if(!resourcesLoaded){
    loadResources(setResourcesLoaded);
    return(
      <View style={styles.container}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    ); 
  }
  else{
    return (
      <View style={styles.container}>
        <StatusBar style="auto" backgroundColor={"rgb(255, 102, 0)"} />
        <View style={{marginTop: 24}}/>
        <DrawerLayoutAndroid
          ref={drawerRef}
          renderNavigationView={()=>navigationView(setNewsMode, drawerRef, navigation)}
          drawerWidth={250}
        >
          <News ref={newsRef} newsType={newsMode} navigation={navigation} drawerRef={drawerRef}/>
        </DrawerLayoutAndroid>
      </View>
    );
  }
}

function ProfileScreen({route, navigation}: {route:any, navigation:any}) {
  return (
    <Profile userId={route.params.userId} navigation={navigation} />
  );
}

function ThreadScreen({route, navigation}: {route:any, navigation:any}) {
  return (
    <Thread itemData={route.params.itemData} navigation={navigation} />
  );
}


export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="News"
      >
        <Stack.Screen options={{headerShown:false}} name="News" component={NewsScreen} />
        <Stack.Screen options={{headerShown:false}} name="Profile" component={ProfileScreen} />
        <Stack.Screen options={{headerShown:false}} name="Thread" component={ThreadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

function navigationView(setNewsMode: Function, drawer: any, navigation: any){
  return(
    <View style={{flex:1, padding: 20}}>

      <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("top", setNewsMode );}}>
        <View style={{flexDirection: "row", height: 60}}>
          <Text style={{fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>Top Stories</Text>

        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("best", setNewsMode );}}>
        <View style={{flexDirection: "row", height: 60}}>
          <Text style={{fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>Best Stories</Text>
          
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("new", setNewsMode );}}>
        <View style={{flexDirection: "row", height: 60}}>
          <Text style={{fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>New Stories</Text>
          
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("saved", setNewsMode );}}>
        <View style={{flexDirection: "row", height: 60}}>
          <Text style={{fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>Saved Stories</Text>
          
        </View>
      </TouchableNativeFeedback>


      <TouchableNativeFeedback onPress={() => {navigation.navigate('Profile',{userId:'tonz'})}}>
        <View style={{flexDirection: "row", height: 60}}>
          <Text style={{fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>Testing</Text>
          
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => {StorageService.clearReadItems()}}>
        <View style={{flexDirection: "row", height: 60}}>
          <Text style={{fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>Clear Read Items</Text>
          
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => {newsRef.current?.refTest(); StorageService.clearHiddenItems()}}>
        <View style={{flexDirection: "row", height: 60}}>
          <Text style={{fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>Clear Hidden Items</Text>
          
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => {newsRef.current?.refTest(); StorageService.clearSavedItems()}}>
        <View style={{flexDirection: "row", height: 60}}>
          <Text style={{fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>Clear Saved Items</Text>
          
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

function changeNewsData(type: string, setNewsMode: Function){
  setNewsMode(type);
}

async function loadResources(setResourcesLoaded: Function) {
  await Promise.all([
    Font.loadAsync({
      ...Feather.font,
    }),
  ]);

  setResourcesLoaded(true);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
