import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, Dimensions, TouchableOpacity, Modal } from 'react-native';
import * as StorageService from "../services/StorageService";

import * as HN_Util from './HackerNewsAPIUtil';
import Item from './Item';
import ItemModal from './ItemModal';

type NewsProps = {
    newsType: string
}

type NewsState = {
    id: number,
    newsData: Array<any>,
    itemIDs: Array<number>,
    startSlice: number,
    dataLoading: boolean,
    readItems: number[],
    showItemModal: boolean,
    selectedItem: any
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
            dataLoading: true,
            showItemModal: false,
            selectedItem: {}
        }

    }

    async componentDidMount(){
        let readItems = await StorageService.getReadItems();
        await this.setState({readItems: readItems});
        this.loadInitialData();
    }

    componentDidUpdate(prevProps: NewsProps){
        if(this.props.newsType !== prevProps.newsType){
            this.setState({newsData: []});
            this.loadInitialData();
        }
    }


    render(){
        if(this.state.newsData.length < 1){
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
                        ItemSeparatorComponent={() => <View style={{marginTop:7}}/>}
                        ListHeaderComponent={this._renderListHeader}
                        ListFooterComponent={this._renderListFooter}
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
                    <ItemModal
                        visible={ this.state.showItemModal }
                        setVisible={ (vis: boolean) => { this.setModalVisible(vis) }}
                        itemData={this.state.selectedItem}
                    >
                    </ItemModal>
                </React.Fragment>

            );
        }
    }

    _renderItem = ({item, index} : {item: any, index: number}) => {
        return(
            <Item itemData={item} index={index} hideItem={this.hideItem} read={this.state.readItems.includes(item.id)} openItemModal={this.showItemModal}/>
        );
    }

    _renderListHeader = () => {
        return(
            <View style={{flexDirection: "row", height: 50, width: width, backgroundColor: "rgb(255, 102, 0)", marginBottom: 10}}>
                <Text style={{textAlignVertical: "center", fontSize: 20, fontWeight:"bold", marginLeft: 10}}>{this.getHeaderText()}</Text>        
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
    }

    hideItem = (index: number) => {
        let temp = this.state.newsData.slice();

        temp.splice(index, 1);

        this.setState({newsData: temp});
    }
    
    showItemModal = (item: any) => {
        this.setState({showItemModal: true, selectedItem: item});
    }

    setModalVisible = (visible: boolean) => {
        this.setState({showItemModal: visible});
    }


    loadInitialData = async () => {
        await this.setState({dataLoading: true, startSlice: 0});
        let data = [];
        if(this.props.newsType === "top"){
            data = await HN_Util.getTopStories();
        }
        else if(this.props.newsType === "best"){
            data = await HN_Util.getBestStories();
        }
        else if(this.props.newsType === "new"){
            data = await HN_Util.getNewStories();
        }

        let itemData = [];
        let subIds = data.slice(this.state.startSlice, this.state.startSlice + 20)
        for(let i in subIds){
            let newData = await HN_Util.getItem(subIds[i]);
            itemData.push(newData);
        }



        this.setState({newsData: itemData, itemIDs: data, startSlice: this.state.startSlice + 20, dataLoading: false});
    }

    loadNextBatch = async () => {
        if(!loadDataBatch){
            return;
        }
        loadDataBatch = false;
        if(this.state.startSlice > this.state.itemIDs.length-1){
            return;
        }
        let itemData = [];
        let subIds = this.state.itemIDs.slice(this.state.startSlice, this.state.startSlice + 20)
        for(let i in subIds){
            let newData = await HN_Util.getItem(subIds[i]);
            itemData.push(newData);
        }


        //console.log("set state run with new data");
        //console.log(this.state.newsData[0]);
        //console.log(itemData[0]);

        //console.log([...this.state.newsData, itemData]);
        await this.setState({newsData: [...this.state.newsData, ...itemData], startSlice: this.state.startSlice + 20, dataLoading: false});
        loadDataBatch = true;
    }

}