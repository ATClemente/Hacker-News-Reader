import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedbackBase, Clipboard, Share } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import * as HN_Util from './HackerNewsAPIUtil';
import * as WebBrowser from 'expo-web-browser';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import * as StorageService from "../services/StorageService";

type ItemProps = {
    //itemID: number,
    itemData: any,
    index: number,
    hideItem: Function,
    read: boolean,
    navigation: any,
    saved: boolean,
}

type ItemState = {
    itemData: any,
    hasBeenRead: boolean,
    isSaved: boolean
}

export interface ItemStuff {
    name: string;
    age: number;
}


const {width, height} = Dimensions.get('window');

//let menuRef: React.RefObject<Menu>[] = React.createRef<Menu[]>();

export default class Item extends React.PureComponent<ItemProps, ItemState, {name: string}>{

    menuRefs: any[] = [];
    copyMenuRefs: any[] = [];
    constructor(props: ItemProps){
        super(props)

        this.state = {
            itemData: null,
            hasBeenRead: false,
            isSaved: false
        }
        
    }

    async componentDidMount(){
        //let data = await HN_Util.getItem(this.props.itemID);
        //await this.setState({itemData: data});
        //console.log("item is mounting! " + this.props.index);

        this.setState({itemData: this.props.itemData, hasBeenRead: this.props.read, isSaved: this.props.saved});
    }

    async componentDidUpdate(prevProps: ItemProps, prevState: ItemState){
        if(prevProps.itemData.descendants !== this.props.itemData.descendants || prevProps.itemData.score !== this.props.itemData.score ){
            this.setState({itemData: this.props.itemData});
        }
        //let data = await HN_Util.getItem(this.props.itemID);

        /*if(!!prevState.itemData){
            let data = await HN_Util.getItem(this.props.itemID);
            if(prevState.itemData.descendants !== data.descendants || prevState.itemData.score !== data.score){
                await this.setState({itemData: data});
            }
        }*/
        //if(prevState.itemData.descendants !== data.descendants){
        //    this.setState({itemData: data});
        //}

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
                    {this.renderControls(this.state.itemData, this.props.index)}
                </ScrollView>
            );

        }
    }

    renderInfoCard = (itemData: any) => {
        const itemNumberJustify = itemData.type === "job" ? 'flex-end' : 'center';
        return(
            <TouchableNativeFeedback onPress={() => {this.viewItem(itemData)}}>
                <View style={styles.itemCard}>
                    <View style={{flex:1, backgroundColor: "rgb(255, 212, 184)", borderColor: "rgb(255, 212, 184)", borderRightWidth: 1, alignItems: "center", justifyContent: "center"}}>
                        <View style={{flex:1}}/>
                        <View style={{flex:1, justifyContent:itemNumberJustify}}>
                            <Text style={{textAlignVertical: "center"}}>{this.props.index+1}</Text>
                        </View>
                        <View style={{flex:1,justifyContent:'flex-end'}}>
                            {itemData.type === "job" &&
                                <Feather name="briefcase" size={24} color="black" />
                            }
                        </View>
                    </View>
                    <View style={{flex: 9, padding: 5, justifyContent:"space-between"}}>
                        <View style={{flexDirection: "row"}}>
                            <View style={{flexDirection:"row", flexWrap:"wrap"}}>
                                <Text style={styles.scoreStyle}>{itemData.score}</Text>
                                <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                                <Text style={{textAlignVertical: "center", marginRight: 10}}>{itemData.by}</Text>
                                <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                                <Text style={{textAlignVertical: "center", marginRight: 10}}>{this.calcTime(itemData.time)}</Text>
                                {itemData.descendants !== undefined &&
                                    <React.Fragment>
                                        <Text style={{fontSize: 16, textAlignVertical: "center", marginRight: 10}}>-</Text>
                                        <Text style={{textAlignVertical: "center", marginRight: 10}}>{itemData.descendants} comment{itemData.descendants === 1 ? '' : 's'}</Text>
                                    </React.Fragment>
                                }
                            </View>
                            
                            {this.state.hasBeenRead &&
                                <React.Fragment>
                                    <View style={{flex:1}}/>
                                    <Feather name="book-open" size={24} color="black" />
                                </React.Fragment>
                            }
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.titleText}>{itemData.title}</Text>
                        </View>
                        <View style={{flexDirection: "row", opacity: 0.5}}>
                            <Text style={styles.urlText}>{itemData.url}</Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }

    renderControls = (itemData: any, index: number) => {
        return(
            <View style={styles.controlsCard}>
                <View style={{alignItems: "center"}}>
                    <Feather name="triangle" size={24} color="black" />
                    <Text>Vote Up</Text>
                </View>

                <TouchableOpacity onPress={() => {this.props.navigation.push('Thread', {itemData: this.state.itemData})}}>
                    <View style={{alignItems: "center"}}>
                        <Feather name="message-square" size={24} color="black" />
                        <Text>Comments</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={async () => {
                    let shareLink = '';
                    if(!!this.state.itemData.url){
                        shareLink = this.state.itemData.url
                    }
                    else{
                        shareLink = "https://news.ycombinator.com/item?id=" + this.state.itemData.id;
                    }

                    try {
                        const result = await Share.share({
                            message: shareLink,
                        });
                        if (result.action === Share.sharedAction) {
                            if (result.activityType) {
                                // shared with activity type of result.activityType
                                console.log(result.activityType);
                            } 
                            else {
                                // shared
                                console.log("shared");
                            }
                        } else if (result.action === Share.dismissedAction) {
                            // dismissed
                            console.log("dismissed");
                        }
                    }catch(error){
                        console.log(error.message);
                    }
                        
                }}>
                    <View style={{alignItems: "center"}}>
                        <Feather name="share-2" size={24} color="black" />
                        <Text>Share</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this.props.hideItem(this.props.index)}}>
                    <View style={{alignItems: "center"}}>
                        <Feather name="x" size={24} color="black" />
                        <Text>Hide</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    if(this.state.isSaved){
                        StorageService.removeSaveItem(this.state.itemData.id);
                        this.setState({isSaved: false});
                    }
                    else{
                        StorageService.addSavedItem(this.state.itemData.id);
                        this.setState({isSaved: true});
                    }
                }}>
                    <View style={{alignItems: "center"}}>
                        <Feather name="bookmark" size={24} color={this.state.isSaved ? 'green' : 'black'} />
                        <Text>Save</Text>
                    </View>
                </TouchableOpacity>

                <Menu
                    ref={(ref: any) =>this.menuRefs[index] = ref}
                    button={
                        <TouchableOpacity onPress={() => this.showMenu(index)}>
                        <View style={{alignItems: "center"}}>
                            <Feather name="more-vertical" size={24} color="black" />
                            <Text>More</Text>
                            </View>
                        </TouchableOpacity>
                    }
                >
                    <MenuItem onPress={() => {
                        this.hideMenu(index);
                        this.props.navigation.push('Profile', {userId: this.state.itemData.by});
                    }}>
                        <Feather name="user" size={20} color="black" /><Text style={{textAlignVertical: "center"}}>  {itemData.by}</Text>
                    </MenuItem>

                    <MenuItem onPress={() => {
                        if(this.state.hasBeenRead){
                            StorageService.removeReadItem(this.state.itemData.id);
                            this.setState({hasBeenRead: false});
                        }else{
                            StorageService.addReadItem(this.state.itemData.id);
                            this.setState({hasBeenRead: true});
                        }
                        this.hideMenu(index);
                    }}>
                        <Feather name={this.state.hasBeenRead ? 'eye-off' : 'eye'} size={20} color="black" /><Text style={{textAlignVertical: "center"}}>  {this.state.hasBeenRead ? 'Mark Unread' : 'Mark Read'}</Text>
                    </MenuItem>

                    <MenuItem onPress={() => {
                        this.hideMenu(index);
                        this.showCopyMenu(index);
                    }}>
                        <Feather name="copy" size={20} color="black" /><Text style={{textAlignVertical: "center"}}>  Copy</Text>
                    </MenuItem>
                </Menu>

                <Menu ref={(ref: any) =>this.copyMenuRefs[index] = ref}>
                    <MenuItem disabled={true} disabledTextColor={"black"}>Copy</MenuItem>
                    <MenuItem onPress={() => {
                        this.hideCopyMenu(index);
                        let link = "";
                        if(!!this.state.itemData.url){
                            link = this.state.itemData.url
                        }
                        else{
                            link = "https://news.ycombinator.com/item?id=" + this.state.itemData.id;
                        }
                        Clipboard.setString(link);
                    }}>
                        <Feather name="link" size={20} color="black" /><Text style={{textAlignVertical: "center"}}>  Link</Text>
                    </MenuItem>

                    <MenuItem onPress={() => {
                        this.hideCopyMenu(index);
                        let link = "https://news.ycombinator.com/item?id=" + this.state.itemData.id;
                        Clipboard.setString(link);
                    }}>
                        <Feather name="message-square" size={20} color="black" /><Text style={{textAlignVertical: "center"}}>  Comments</Text>
                    </MenuItem>

                    <MenuItem onPress={() => {
                        this.hideCopyMenu(index);
                        Clipboard.setString(this.state.itemData.title);
                    }}>
                        <Feather name="type" size={20} color="black" /><Text style={{textAlignVertical: "center"}}>  Title</Text>
                    </MenuItem>
                </Menu>



                
            </View>
        );
    }

    showMenu = (index: number) => {
        this.menuRefs[index].show();
    }

    hideMenu = (index: number) => {
        this.menuRefs[index].hide();
    }

    showCopyMenu = (index: number) => {
        this.copyMenuRefs[index].show();
    }

    hideCopyMenu = (index: number) => {
        this.copyMenuRefs[index].hide();
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

    viewItem = async (itemData: any) => {
        if(!!itemData.url){
            WebBrowser.openBrowserAsync(itemData.url);
        }
        else if(!!itemData.text){
            this.props.navigation.push('Thread', {itemData: this.state.itemData});
        }
        else{
            //Same as if else, just not sure who many fall into this category.  I know "ASK HN" does:
            this.props.navigation.push('Thread', {itemData: this.state.itemData});
        }
        StorageService.addReadItem(itemData.id);
        this.setState({hasBeenRead: true});
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
        width: width - 14,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 5,
        minHeight: 100,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 3,
        flexDirection: "row"
    },
    controlsCard:{
        width: width - 14,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 5,
        minHeight: 100,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 3,
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