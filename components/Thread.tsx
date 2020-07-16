import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, TouchableNativeFeedback, RefreshControl } from 'react-native';
import * as StorageService from "../services/StorageService";
import { Feather } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import * as WebBrowser from 'expo-web-browser';
import * as HN_Util from './HackerNewsAPIUtil';
import Item from './Item';
import Comment from './Comment';

type ThreadProps = {
    //visible: boolean,
    //setVisible: Function,
    itemData: any,
    navigation: any
}

type ThreadState = {
    dataLoading: boolean,
    itemData: any,
    kidIds: number[],
    kidData: any[],
    startSlice: number,
}

let loadDataBatch = true;

const {width, height} = Dimensions.get('window');

export default class Thread extends React.Component<ThreadProps, ThreadState>{
    constructor(props: ThreadProps){
        super(props)

        this.state = {
            dataLoading: true,
            itemData: null,
            kidIds: [],
            kidData: [],
            startSlice: 0,
        }
    }

    async componentDidMount(){
        let itemData = await HN_Util.getItem(this.props.itemData.id);
        await this.setState({itemData: itemData, kidIds: itemData.kids});
        this.loadCommentData();
    }

    /*async componentDidUpdate(prevProps: ThreadProps){
        if(prevProps.visible !== this.props.visible){
            await this.setState({showItemModal: this.props.visible});
            if(this.state.showItemModal){
                let itemData = await HN_Util.getItem(this.props.itemData.id);
                await this.setState({itemData: itemData, kidIds: itemData.kids});
                this.loadCommentData();
            }
            else{
                this.setState({itemData: null, kidData: [], kidIds: []});
            }
        }
    }*/

    render(){
        return(
            <React.Fragment>
                <View style={{marginTop: 28}}></View>
                {this.state.itemData &&
                    <FlatList
                        style={{backgroundColor: "#D3D3D3"}}
                        keyExtractor={(item) => item.id.toString()}
                        data={this.state.kidData}
                        renderItem={this._renderItem}
                        //ItemSeparatorComponent={() => <View style={{borderWidth: StyleSheet.hairlineWidth, borderTopColor: "black"}}/>}
                        ListHeaderComponent={this._renderListHeader}
                        ListFooterComponent={this._renderListFooter}
                        ListEmptyComponent={this._renderEmptyList}
                        //initialNumToRender={8}
                        //maxToRenderPerBatch={1}
                        windowSize={10}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.dataLoading}
                                onRefresh={this.loadCommentData}
                                colors={["red", "blue", "green"]}
                            />
                        }
                        onEndReached={this.loadCommentBatch}
                        onEndReachedThreshold={0.5}
                    
                    />
                }

                {!this.state.itemData &&
                    <View style={{flex: 1,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',}}>
                        <ActivityIndicator size={"large"}></ActivityIndicator>
                    </View>
                }

            </React.Fragment>
        );
    }

    _renderItem = ({item, index} : {item: any, index: number}) => {
        return(<Comment commentData={item} threadLevel={0} navigation={this.props.navigation}/>);
    }

    _renderListHeader = () => {
        const { itemData } = this.state;
        return(
            <View style={{minHeight: 200, width: width, backgroundColor: "rgb(255, 102, 0)", justifyContent:"space-between"}}>
                <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                        <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { this.props.navigation.push("Profile", {userId: itemData.by}) }}>
                        <Feather name="user" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View>
                    {!!itemData.title &&
                        <Text style={{textAlignVertical: "center", fontSize: 20, fontWeight:"bold", marginLeft: 10, marginRight: 10}}>{itemData.title}</Text>
                    }
                    {!itemData.title &&
                        <Text style={{textAlignVertical: "center", fontSize: 20, fontWeight:"bold", marginLeft: 10, marginRight: 10}}>Comment Thread</Text>
                    }
                    
                </View>
                <View style={{justifyContent:"space-between"}}>
                    {!!itemData.url &&
                        <TouchableOpacity onPress={() => {WebBrowser.openBrowserAsync(itemData.url)}}>
                            <Text style={{fontStyle:"italic", fontSize: 16, color:"blue"}}>{itemData.url}</Text>
                        </TouchableOpacity>
                    }
                    {!!itemData.text &&
                        <View style={{margin: 10}}>
                            <HTML html={itemData.text} onLinkPress={(event, href)=>WebBrowser.openBrowserAsync(href)}/>
                        </View>
                    }

                    <View style={{flexDirection:"row", marginLeft: 10, marginBottom: 2}}>
                        <Text>{itemData.by}</Text>
                        <Text> - </Text>
                        {itemData.score &&
                        <React.Fragment>
                            <Text>{itemData.score}</Text>
                            <Text> - </Text>
                        </React.Fragment>
                        }
                        {itemData.descendants &&
                        <React.Fragment>
                            <Text>{itemData.descendants} comments</Text>
                            <Text> - </Text>
                        </React.Fragment>
                        }
                        <Text>{this.calcTime(itemData.time)}</Text>
                    </View>   
                </View>   
            </View>
        );
    }

    _renderListFooter = () => {
        if(!this.state.itemData.kids || this.state.kidData.length===0 || this.state.startSlice > this.state.itemData.kids.length-1){
            return null
        }
        else{
            return(
                <View style={{height: 50, width: width, marginTop: 15}}>
                    <ActivityIndicator size={"large"}/>
                </View>
            );
        }
    }

    _renderEmptyList = () => {
        if(!this.state.itemData.kids || this.state.itemData.kids.length===0){
            return(
                <Text>Nothing here yet!</Text>
            );
        }
        return null;
        /*else{
            return(
                <View style={{flex: 1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',}}>
                    <ActivityIndicator size={"large"}></ActivityIndicator>
                </View>
            );

        }*/

    }

    loadCommentData = async () => {
        loadDataBatch = false;
        await this.setState({kidData: [], dataLoading: true, startSlice: 0});
        let data = this.state.itemData.kids;

        let kidData = [];
        if(!!data){
            let subIds = data.slice(this.state.startSlice, this.state.startSlice + 20)
            for(let i in subIds){
                let newData = await HN_Util.getItem(subIds[i]);
                if(!!newData && !!newData.text){
                    kidData.push(newData);
                }
            }
        }

        this.setState({kidData: kidData, startSlice: this.state.startSlice + 20, dataLoading: false});
        loadDataBatch = true;
    }

    loadCommentBatch = async () => {
        if(!loadDataBatch){
            return;
        }
        loadDataBatch = false;
        if(!this.state.itemData.kids || this.state.startSlice > this.state.itemData.kids.length-1){
            loadDataBatch = true;
            return;
        }
        let kidData = [];
        let subIds = this.state.itemData.kids.slice(this.state.startSlice, this.state.startSlice + 20);
        for(let i in subIds){
            let newData = await HN_Util.getItem(subIds[i]);
            if(!!newData && !!newData.text){
                kidData.push(newData);
            }
        }

        await this.setState({kidData: [...this.state.kidData, ...kidData], startSlice: this.state.startSlice + 20, dataLoading: false});
        loadDataBatch = true;
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