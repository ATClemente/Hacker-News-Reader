import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import React, { useState, Ref }  from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, DrawerLayoutAndroid, TouchableNativeFeedback } from 'react-native';


import News from './components/News';


let drawerRef: React.RefObject<DrawerLayoutAndroid> = React.createRef();

export default function App() {
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
          renderNavigationView={()=>navigationView(setNewsMode, drawerRef)}
          drawerWidth={250}
        >
          <News newsType={newsMode}/>
        </DrawerLayoutAndroid>
      </View>
    );
  }

}

function navigationView(setNewsMode: Function, drawer: any){
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
