import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { Feather, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect, Ref }  from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, DrawerLayoutAndroid, TouchableNativeFeedback, BackHandler, Alert, ScrollView } from 'react-native';
import * as StorageService from "./services/StorageService";

import Profile from './components/Profile';
import Thread from './components/Thread';
import Settings from './components/Settings';

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
  const [showOtherOptions, setShowOtherOptions] = useState(false);
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
          renderNavigationView={()=>navigationView(setNewsMode, setShowOtherOptions, showOtherOptions, drawerRef, navigation)}
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

function SettingsScreen({route, navigation}: {route:any, navigation:any}) {
  return (
    <Settings navigation={navigation} />
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
        <Stack.Screen options={{headerShown:false}} name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

function navigationView(setNewsMode: Function, setShowOtherOptions: Function, showOtherOptions: boolean, drawer: any, navigation: any){
  return(
    <View style={{flex:1,}}>
      <ScrollView style={{backgroundColor: "#FFE0B2"}} showsHorizontalScrollIndicator={false}>
        <View style={[styles.sideMenuMainItem, {backgroundColor: "#90CAF9"}]}>
        </View>
        <TouchableNativeFeedback onPress={() => {
            console.log("TODO: Implement Login function :)");
          }}>
          <View style={[styles.sideMenuMainItem, {backgroundColor: "#90CAF9"}]}>
            <Text style={styles.menuItemText}>Login</Text>
            <Feather style={styles.menuIcon} name="log-in" size={24} color="black" />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("top", setNewsMode );}}>
          <View style={styles.sideMenuMainItem}>
            <Text style={styles.menuItemText}>Top Stories</Text>
            <Feather style={styles.menuIcon} name="bar-chart" size={24} color="black" />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("best", setNewsMode );}}>
          <View style={styles.sideMenuMainItem}>
            <Text style={styles.menuItemText}>Best Stories</Text>
            <Feather style={styles.menuIcon} name="award" size={24} color="black" />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("new", setNewsMode );}}>
          <View style={styles.sideMenuMainItem}>
            <Text style={styles.menuItemText}>New Stories</Text>
            <Foundation style={styles.menuIcon} name="burst-new" size={24} color="black" />
          </View>
        </TouchableNativeFeedback>

        <View style={{marginLeft: 10, marginRight: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "black"}}/>

        <TouchableNativeFeedback onPress={() => {setShowOtherOptions(!showOtherOptions);}}>
          <View style={styles.sideMenuMainItem}>
            <Text style={styles.menuItemText}>Other</Text>
            <Feather style={styles.menuIcon} name={showOtherOptions ? "chevron-up" : "chevron-down"} size={24} color="black" />
          </View>
        </TouchableNativeFeedback>

        {!showOtherOptions && <View style={{marginLeft: 10, marginRight: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "black"}}/>}

        {showOtherOptions &&
          <View>
            <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("ask", setNewsMode ); setShowOtherOptions(!showOtherOptions);}}>
              <View style={styles.sideMenuMainItem}>
                <Text style={styles.menuSubItemText}>Ask</Text>
                <Feather style={styles.menuIcon} name="help-circle" size={24} color="black" />
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("show", setNewsMode ); setShowOtherOptions(!showOtherOptions);}}>
              <View style={styles.sideMenuMainItem}>
                <Text style={styles.menuSubItemText}>Show</Text>
                <MaterialCommunityIcons style={styles.menuIcon} name="presentation" size={24} color="black" />
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("jobs", setNewsMode ); setShowOtherOptions(!showOtherOptions);}}>
              <View style={styles.sideMenuMainItem}>
                <Text style={styles.menuSubItemText}>Jobs</Text>
                <Feather style={styles.menuIcon} name="briefcase" size={24} color="black" />
              </View>
            </TouchableNativeFeedback>

            <View style={{marginLeft: 10, marginRight: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "black"}}/>

          </View>
        }

        <TouchableNativeFeedback onPress={() => {drawer.current.closeDrawer(); changeNewsData("saved", setNewsMode );}}>
          <View style={styles.sideMenuMainItem}>
            <Text style={styles.menuItemText}>Saved Stories</Text>
            <Feather style={styles.menuIcon} name="bookmark" size={24} color="black" />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => {
            navigation.navigate('Settings');
          }}>
          <View style={styles.sideMenuMainItem}>
            <Text style={styles.menuItemText}>Settings</Text>
            <Feather style={styles.menuIcon} name="settings" size={24} color="black" />
          </View>
        </TouchableNativeFeedback>
      </ScrollView>
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
      ...Foundation.font,
      ...MaterialCommunityIcons.font
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
  sideMenuMainItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60
  },
  menuItemText:{
    paddingLeft: 10, 
    fontSize: 20, 
    textAlignVertical: "center",
    //color: "#929292"
    //color: "#424242"
    color: "#546E7A"
  },
  menuSubItemText:{
    paddingLeft: 25, 
    fontSize: 20, 
    textAlignVertical: "center",
    //color: "#929292"
    //color: "#424242"
    color: "#546E7A"
  },
  menuIcon:{
    paddingRight: 25,
    textAlignVertical: "center",
    color: "#546E7A"
  }
});
