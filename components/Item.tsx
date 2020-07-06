import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import * as HN_Util from './HackerNewsAPIUtil';
import * as WebBrowser from 'expo-web-browser';
import { Feather } from '@expo/vector-icons';

type ItemProps = {
    itemID: number,
    index: number
}

type ItemState = {
    itemData: any
}


const {width, height} = Dimensions.get('window');

export default class Item extends React.PureComponent<ItemProps, ItemState>{
    constructor(props: ItemProps){
        super(props)

        this.state = {
            itemData: null
        }
    }

    async componentDidMount(){
        let data = await HN_Util.getItem(this.props.itemID);
        this.setState({itemData: data});
    }


    render(){
        if(!this.state.itemData){
            return(
                <View style={[styles.itemCard, {justifyContent: "center"}]}>
                    <ActivityIndicator size={"large"}/>
                </View>
            );
        }
        else{
            return(
                <ScrollView 
                    horizontal={true}
                    snapToInterval={width}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={"fast"}
                >
                    {this.renderInfoCard(this.state.itemData)}
                    {this.renderControls(this.state.itemData)}
                </ScrollView>
            );

        }
    }

    renderInfoCard = (itemData: any) => {
        return(
            <TouchableOpacity onPress={() => {WebBrowser.openBrowserAsync(itemData.url)}}>
                <View style={styles.itemCard}>
                        <View style={{flex:1, borderColor: "gray", borderRightWidth: 1, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{textAlignVertical: "center"}}>{this.props.index+1}</Text>
                        </View>
                        <View style={{flex: 9, padding: 5}}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>{itemData.score}</Text>
                                <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                                <Text style={{textAlignVertical: "center", marginRight: 10}}>{itemData.by}</Text>
                                <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                                <Text style={{textAlignVertical: "center", marginRight: 10}}>{this.calcTime(itemData.time)}</Text>
                                <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                                <Text style={{textAlignVertical: "center", marginRight: 10}}>{itemData.descendants} comments</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={{fontSize: 18}}>{itemData.title}</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={{fontSize: 14}}>{itemData.url}</Text>
                            </View>
                        </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderControls = (itemData: any) => {
        return(
            <View style={styles.controlsCard}>
                <View style={{alignItems: "center"}}>
                    <Feather name="triangle" size={24} color="black" />
                    <Text>Vote Up</Text>
                </View>
                <View style={{alignItems: "center"}}>
                    <Feather name="message-square" size={24} color="black" />
                    <Text>Comments</Text>
                </View>

                <View style={{alignItems: "center"}}>
                    <Feather name="share-2" size={24} color="black" />
                    <Text>Share</Text>
                </View>

                <View style={{alignItems: "center"}}>
                    <Feather name="x" size={24} color="black" />
                    <Text>Hide</Text>
                </View>

                <View style={{alignItems: "center"}}>
                    <Feather name="pocket" size={24} color="black" />
                    <Text>Save</Text>
                </View>

                <View style={{alignItems: "center"}}>
                    <Feather name="more-vertical" size={24} color="black" />
                    <Text>More</Text>
                </View>

                
            </View>
        );
    }


    calcTime = (postTime: any): string => {
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


}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemCard:{
        width: width - 10,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 3,
        minHeight: 100,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        flexDirection: "row"
    },
    controlsCard:{
        width: width - 10,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 3,
        minHeight: 100,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
    }
  });