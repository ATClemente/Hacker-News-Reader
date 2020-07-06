import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import React, { useState }  from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';


import News from './components/News';

import * as HN_Util from './components/HackerNewsAPIUtil';


async function loadData(newsMode: string, setNewsObject: Function){
  let data = [];
  console.log(newsMode);
  if(newsMode === "top"){
    data = await HN_Util.getTopStories();
  }
  else if(newsMode === "best"){
    data = await HN_Util.getBestStories();
  }

  setNewsObject({newsData: data, isLoadingComplete: true, newsMode: newsMode});
}

export default function App() {
  const [newsObject, setNewsObject] = useState({newsData: [], isLoadingComplete: false, newsMode: "top"});
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  if(!resourcesLoaded){
    loadResources(setResourcesLoaded);
  }

  if(!newsObject.isLoadingComplete){
    loadData(newsObject.newsMode, setNewsObject);
    return(
      <View style={styles.container}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    ); 
  }
  else{
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={{marginTop: 24}}/>
        <News newsData={newsObject.newsData}/>
      </View>
    );
  }

}

function changeNewsData(type: string, setNewsObject: Function){
  setNewsObject({newsData: null, isLoadingComplete: false, newsMode: type});
  loadData(type, setNewsObject);
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
