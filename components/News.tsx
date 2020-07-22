import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, Dimensions, TouchableOpacity, Modal } from 'react-native';
import * as StorageService from "../services/StorageService";
import { Feather } from '@expo/vector-icons';
import * as HN_Util from './HackerNewsAPIUtil';
import Item from './Item';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

type NewsProps = {
    newsType: string,
    navigation: any,
    drawerRef: any
}

type NewsState = {
    id: number,
    newsData: Array<any>,
    itemIDs: Array<number>,
    startSlice: number,
    dataLoading: boolean,
    readItems: number[],
    savedItems: number[],
}

let loadDataBatch = true;

const {width, height} = Dimensions.get('window');

export default class News extends React.Component<NewsProps, NewsState>{
    constructor(props: NewsProps){
        super(props)

        this.state = {
            id: 1,
            startSlice: 0,
            newsData: [],
            itemIDs: [],
            readItems: [],
            savedItems: [],
            dataLoading: true,
        }

    }

    async componentDidMount(){
        //let readItems = await StorageService.getReadItems();
        //let savedItems = await StorageService.getSavedItems();
        //await this.setState({readItems: readItems, savedItems: savedItems});
        this.loadInitialData();
    }

    async componentDidUpdate(prevProps: NewsProps){
        if(this.props.newsType !== prevProps.newsType){
            //let readItems = await StorageService.getReadItems();
            //let savedItems = await StorageService.getSavedItems();
            //await this.setState({readItems: readItems, savedItems: savedItems, newsData: []});
            this.loadInitialData();
        }
    }


    render(){
        if(this.state.dataLoading){
            return(
                <View style={{flex: 1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',}}>
                    <ActivityIndicator size={"large"}></ActivityIndicator>
                </View>
            );
        }
        else{
            return(
                <React.Fragment>
                    <FlatList
                        style={{backgroundColor: "#D3D3D3"}}
                        keyExtractor={(item) => item.id.toString()}
                        data={this.state.newsData}
                        renderItem={this._renderItem}
                        ItemSeparatorComponent={this._renderListSeparator}
                        ListHeaderComponent={this._renderListHeader}
                        ListFooterComponent={this._renderListFooter}
                        ListEmptyComponent={this._renderEmptyList}
                        //initialNumToRender={8}
                        //maxToRenderPerBatch={1}
                        windowSize={10}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.dataLoading}
                                onRefresh={this.loadInitialData}
                                colors={["red", "blue", "green"]}
                            />
                        }
                        onEndReached={this.loadNextBatch}
                        onEndReachedThreshold={0.5}
                    />
                </React.Fragment>
            );
        }
    }

    _renderItem = ({item, index} : {item: any, index: number}) => {
        return(
            <Item itemData={item} index={index} hideItem={this.hideItem} read={this.state.readItems.includes(item.id)} saved={this.state.savedItems.includes(item.id)} navigation={this.props.navigation} />
        );
    }

    _renderListHeader = () => {
        return(
            <View style={{flexDirection: "row", alignItems: "center", height: 50, width: width, backgroundColor: "rgb(255, 102, 0)", marginBottom: 10}}>
                <TouchableNativeFeedback onPress={() => this.props.drawerRef.current.openDrawer()}>
                    <Feather style={{marginLeft: 10}} name="menu" size={24} color="black" />
                </TouchableNativeFeedback>
                <Text style={{textAlignVertical: "center", fontSize: 20, fontWeight:"bold", marginLeft: 10}}>
                     {this.getHeaderText()}
                </Text>        
            </View>
        );
    }

    _renderListFooter = () => {
        if(this.state.startSlice > this.state.itemIDs.length-1){
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

    _renderListSeparator = () => {
        return(
            <View style={{marginTop:7}}/>
        );
    }

    _renderEmptyList = () => {
        return(
            <Text>Nothing here!</Text>
        );
    }

    getHeaderText = () => {
        if(this.props.newsType === "top"){
            return "Top Stories";
        }

        if(this.props.newsType === "best"){
            return "Best Stories";
        }

        if(this.props.newsType === "new"){
            return "New Stories";
        }

        if(this.props.newsType === "show"){
            return "Show HN";
        }

        if(this.props.newsType === "ask"){
            return "Ask HN";
        }

        if(this.props.newsType === "jobs"){
            return "Jobs";
        }

        if(this.props.newsType === "saved"){
            return "Saved Stories";
        }
    }

    hideItem = (index: number) => {
        let temp = this.state.newsData.slice();

        let itemId = temp[index].id;

        StorageService.addHiddenItem(itemId);

        temp.splice(index, 1);

        this.setState({newsData: temp});
    }


    loadInitialData = async () => {
        await this.setState({dataLoading: true, startSlice: 0});
        let data = [];
        switch(this.props.newsType){
            case "top":
                data = await HN_Util.getTopStories();
            break;
            case "best":
                data = await HN_Util.getBestStories();
            break;
            case "new":
                data = await HN_Util.getNewStories();
            break;
            case "show":
                data = await HN_Util.getShowStories();
            break;
            case "ask":
                data = await HN_Util.getAskStories();
            break;
            case "jobs":
                data = await HN_Util.getJobStories();
            break;
            case "saved":
                data = await StorageService.getSavedItems();
            break;
        }

        let hiddenItems = await StorageService.getHiddenItems();
        let readItems = await StorageService.getReadItems();
        let savedItems = await StorageService.getSavedItems();

        let itemData = [];
        let subIds = data.slice(this.state.startSlice, this.state.startSlice + 20)
        for(let i in subIds){
            if(!hiddenItems.includes(subIds[i])){
                let newData = await HN_Util.getItem(subIds[i]);
                if(!!newData){
                    itemData.push(newData);
                }
            }
        }



        this.setState({newsData: itemData, readItems: readItems, savedItems: savedItems, itemIDs: data, startSlice: this.state.startSlice + 20, dataLoading: false});
    }

    loadNextBatch = async () => {
        if(!loadDataBatch){
            return;
        }
        loadDataBatch = false;
        if(this.state.startSlice > this.state.itemIDs.length-1){
            return;
        }

        let hiddenItems = await StorageService.getHiddenItems();

        let itemData = [];
        let subIds = this.state.itemIDs.slice(this.state.startSlice, this.state.startSlice + 20)
        for(let i in subIds){
            if(!hiddenItems.includes(subIds[i])){
                let newData = await HN_Util.getItem(subIds[i]);
                if(!!newData){
                    itemData.push(newData);
                }
            }

        }


        //console.log("set state run with new data");
        //console.log(this.state.newsData[0]);
        //console.log(itemData[0]);

        //console.log([...this.state.newsData, itemData]);
        await this.setState({newsData: [...this.state.newsData, ...itemData], startSlice: this.state.startSlice + 20, dataLoading: false});
        loadDataBatch = true;
    }

    refTest = () => {
        console.log("in the news componen");
    }

}