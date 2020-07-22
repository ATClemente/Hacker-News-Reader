import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, TouchableNativeFeedback } from 'react-native';
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';
import * as HN_Util from './HackerNewsAPIUtil';
import * as WebBrowser from 'expo-web-browser';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import * as StorageService from "../services/StorageService";
import Styles from '../constants/Styles';

type CommentProps = {
    commentData: any,
    threadLevel: number,
    navigation: any,
    originalPoster: string
}

type CommentState = {
    itemData: any
    childCommentData: any[],
    childDataLoading: boolean,
    showChildComments: boolean
}


const {width, height} = Dimensions.get('window');

export default class Comment extends React.PureComponent<CommentProps, CommentState>{
    constructor(props: CommentProps){
        super(props)

        this.state = {
            itemData: null,
            childCommentData: [],
            childDataLoading: false,
            showChildComments: true
        }
    }

    componentDidMount(){
        if(!!this.props.commentData.kids && this.props.commentData.kids.length > 0){
            this.setState({childDataLoading: true});
            this.loadChildCommentData();
        }
    }

    render(){
        const threadLevel = this.props.threadLevel;
        const customStyles = {
            borderLeftColor: Styles.COMMENT_COLORS[threadLevel % Styles.COMMENT_COLORS.length], 
            borderLeftWidth: threadLevel === 0 ? 0 : 5, 
            width: width-(10*threadLevel),
            marginLeft: 10 * threadLevel
        };
        if(!this.props.commentData){
            return(
                <View style={[styles.itemCard, {justifyContent: "center"}]}>
                    <ActivityIndicator size={"large"}/>
                </View>
            );
        }
        else{
            return(
                <React.Fragment>
                    <ScrollView 
                        horizontal={true}
                        snapToInterval={width}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={"fast"}
                    >
                        {this.renderCommentCard(this.props.commentData)}
                        {this.renderCommentControls(this.props.commentData)}
                    </ScrollView>
                    {this.state.showChildComments && this.props.commentData.kids && this.props.commentData.kids.length > 0 && this.state.childCommentData.length > 0 &&
                        <FlatList
                            style={{backgroundColor: "#D3D3D3"}}
                            keyExtractor={(item) => item.id.toString()}
                            data={this.state.childCommentData}
                            renderItem={this._renderItem}
                            //ItemSeparatorComponent={() => <View style={{borderWidth: StyleSheet.hairlineWidth, borderTopColor: "black"}}/>}
                            //ListHeaderComponent={() => <View style={{borderWidth: StyleSheet.hairlineWidth, borderTopColor: "black"}}/>}
                            //ListFooterComponent={this._renderListFooter}
                            //ListEmptyComponent={this._renderEmptyList}
                            //initialNumToRender={8}
                            //maxToRenderPerBatch={1}
                            //windowSize={10}
                        />
                    }
                    {
                        this.state.childDataLoading &&
                        <View style={[styles.itemCard, customStyles, {justifyContent: "center", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "black"}]}>
                            <ActivityIndicator size={"large"}/>
                        </View>
                    }
                </React.Fragment>
            );

        }
    }

    _renderItem = ({item, index} : {item: any, index: number}) => {
        return(<Comment commentData={item} threadLevel={this.props.threadLevel + 1} navigation={this.props.navigation} originalPoster={this.props.originalPoster}/>);
    }

    loadChildCommentData = async () => {
        //await this.setState({dataLoading: true, startSlice: 0});
        let data = this.props.commentData.kids;

        let kidData = [];
        if(!!data){
            //let subIds = data.slice(this.state.startSlice, this.state.startSlice + 20)
            for(let i in data){
                let newData = await HN_Util.getItem(data[i]);
                if(!!newData && !!newData.text){
                    kidData.push(newData);
                }
            }
        }

        this.setState({childCommentData: kidData, childDataLoading: false});
    }

    renderCommentCard = (data:any) => {
        const threadLevel = this.props.threadLevel;
        const customStyles = {
            borderLeftColor: Styles.COMMENT_COLORS[threadLevel % Styles.COMMENT_COLORS.length], 
            borderLeftWidth: threadLevel === 0 ? 0 : 3, 
            width: width-(3*threadLevel),
            marginLeft: 3 * threadLevel
        };
        const authorColor = data.by === this.props.originalPoster ? "white" : "black";
        const authorBackgroundColor = data.by === this.props.originalPoster ? "orange" : "rgba(255, 255, 255, 0)";
        return(
            <TouchableNativeFeedback onPress={() => {this.setState({showChildComments: !this.state.showChildComments})}}>
                <View style={[styles.itemCard, customStyles, {borderBottomWidth: 1, borderBottomColor: "#D3D3D3"}]}>
                    <View style={{flexDirection: "row", marginBottom: 5}}>
                        <View style={{paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5, marginLeft: -5, borderRadius: 7, backgroundColor: authorBackgroundColor}}>
                            <Text style={{color: authorColor, textAlignVertical: "center"}}>{data.by}</Text>
                        </View>
                        <Text style={{textAlignVertical: "center"}}> - </Text>
                        <Text style={{textAlignVertical: "center"}}>{this.calcTime(data.time)}</Text>
                        {!this.state.showChildComments && !!data.kids && data.kids.length > 0 && this.state.childCommentData.length > 0 && 
                            <React.Fragment>
                                <View style={{flex:1}}/>
                                <Text style={{textAlignVertical: "center"}}>+{data.kids.length}</Text>
                                <Feather name="message-square" size={24} color="black" />
                            </React.Fragment>
                        }
                    </View>
                    <HTML html={data.text} onLinkPress={(event, href)=>WebBrowser.openBrowserAsync(href)}/>
                </View>
            </TouchableNativeFeedback>

        );
    }

    renderCommentControls = (data: any) => {
        return(
            <View style={styles.controlsCard}>

                <View style={{alignItems: "center"}}>
                    <Feather name="triangle" size={24} color="black" />
                    <Text>Vote Up</Text>
                </View>

                <TouchableOpacity onPress={() => {this.props.navigation.push('Profile', {userId: this.props.commentData.by})}}>
                    <View style={{alignItems: "center"}}>
                        <Feather name="user" size={24} color="black" />
                        <Text>User</Text>
                    </View>
                </TouchableOpacity>

                <View style={{alignItems: "center"}}>
                    <Feather name="send" size={24} color="black" />
                    <Text>Reply</Text>
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
        width: width,
        minHeight: 50,
        padding:10,
        backgroundColor: "white",
        //flexDirection: "row"
    },
    controlsCard:{
        width: width,
        minHeight: 50,
        backgroundColor: "#D3D3D3",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: "#D3D3D3"
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