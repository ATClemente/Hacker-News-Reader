import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, TouchableNativeFeedback } from 'react-native';
import HTML from 'react-native-render-html';
import * as WebBrowser from 'expo-web-browser';
import * as HN_Util from './HackerNewsAPIUtil';
import { Feather } from '@expo/vector-icons';

type ProfileItemProps = {
    itemData: any,
    index: number,
    navigation: any
}

const {width, height} = Dimensions.get('window');

export default function ProfileItem({itemData, index, navigation}: ProfileItemProps){
    return (
        <ScrollView 
            horizontal={true}
            snapToInterval={width}
            showsHorizontalScrollIndicator={false}
            decelerationRate={"fast"}
        >
            <TouchableNativeFeedback onPress={async () => {
                let threadData = itemData;
                if(itemData.type === 'comment'){
                    threadData = await HN_Util.getItem(itemData.parent);
                }
                if(!!threadData){
                    navigation.push('Thread', {itemData: threadData});
                }
            }}>
                <View style={styles.itemCard}>
                    {itemData.type === 'comment' &&
                        renderCommentInfo(itemData)
                    }
                    {itemData.type === 'story' &&
                        renderStoryInfo(itemData)
                    }
                    {itemData.type === 'job' &&
                        renderJobInfo(itemData)
                    }
                </View>
            </TouchableNativeFeedback>

            <View style={styles.controlsCard}>
                {itemData.type === 'comment' &&
                    renderCommentControls(itemData, navigation)
                }
                {itemData.type === 'story' &&
                    <Text>Story controls</Text>
                }
                {itemData.type === 'job' &&
                    <Text>Job controls</Text>
                }
            </View>

        </ScrollView>
    
    );
}

function renderCommentInfo(data: any){
    return (
        <React.Fragment>
            <View style={{flexDirection: "row", marginBottom: 5}}>
                <Text style={{textAlignVertical: "center"}}>Comment</Text>
                <Text style={{textAlignVertical: "center"}}> - </Text>
                <Text style={{textAlignVertical: "center"}}>{calcTime(data.time)}</Text>
            </View>
            <HTML html={data.text} onLinkPress={(event, href)=>WebBrowser.openBrowserAsync(href)}/>
        </React.Fragment>
    );
}

function renderStoryInfo(data: any){
    return (
        <React.Fragment>
            <View style={{flex: 9, padding: 5, justifyContent:"space-between"}}>
                <View style={{flexDirection: "row"}}>
                    <View style={{flexDirection:"row", flexWrap:"wrap"}}>
                        <Text style={styles.scoreStyle}>{data.score}</Text>
                        <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                        <Text style={{textAlignVertical: "center", marginRight: 10}}>{data.by}</Text>
                        <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                        <Text style={{textAlignVertical: "center", marginRight: 10}}>{calcTime(data.time)}</Text>
                        <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                        <Text style={{textAlignVertical: "center", marginRight: 10}}>{data.descendants} comment{data.descendants === 1 ? '' : 's'}</Text>
                    </View>
                </View>
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.titleText}>{data.title}</Text>
                </View>
                <View style={{flexDirection: "row", opacity: 0.5}}>
                    <Text style={styles.urlText}>{data.url}</Text>
                </View>
            </View>
        </React.Fragment>
    );
}

function renderJobInfo(data: any){
    return null;
}

function renderCommentControls(data: any, navigation: any){
    return(
        <View style={styles.controlsCard}>

        <View style={{alignItems: "center"}}>
            <Feather name="triangle" size={24} color="black" />
            <Text>Vote Up</Text>
        </View>

        <TouchableOpacity onPress={async () => {
            let itemData = data;
            while(!!itemData.parent){
                itemData = await HN_Util.getItem(itemData.parent);
            }
            if(!!itemData){
                navigation.push('Thread', {itemData: itemData});
            }
        }}>
            <View style={{alignItems: "center"}}>
                <Feather name="message-square" size={24} color="black" />
                <Text>Thread</Text>
            </View>
        </TouchableOpacity>

        <View style={{alignItems: "center"}}>
            <Feather name="send" size={24} color="black" />
            <Text>Reply</Text>
        </View>
    </View>
    );
}

function calcTime(postTime: any): string {
    let currentTime = new Date().getTime();
    
    let elapsedTime = (currentTime - postTime * 1000) / 1000;

    if(elapsedTime < 60){
        return Math.floor(elapsedTime) + "sec";
    }

    elapsedTime /= 60;

    if(elapsedTime < 60){
        return Math.floor(elapsedTime) + "min";
    }

    elapsedTime /= 60;

    if(elapsedTime < 24){
        return Math.floor(elapsedTime) + "hr";
    }

    elapsedTime /= 24;

    if(elapsedTime < 30){
        return Math.floor(elapsedTime) + "d";
    }

    elapsedTime /= 30;

    if(elapsedTime < 12){
        return Math.floor(elapsedTime) + "mon";
    }

    elapsedTime /= 12;


    return Math.floor(elapsedTime) + "yr";
    
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemCard:{
        width: width - 14,
        minHeight: 50,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 5,
        padding:10,
        backgroundColor: "white",
        //flexDirection: "row"
    },
    controlsCard:{
        width: width - 14,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 5,
        minHeight: 50,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',

    },
    scoreStyle:{
        fontSize: 16,
        textAlignVertical: "center", 
        marginRight: 10,
        color: "#2196F3"
    },
    urlText:{
        fontSize: 14,
        opacity: 0.8
    },
    titleText:{
        fontSize: 16,
        fontWeight: "700"
    }
  });