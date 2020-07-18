import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, TouchableNativeFeedback, RefreshControl } from 'react-native';
import * as HN_Util from './HackerNewsAPIUtil';
import HTML from 'react-native-render-html';
import * as WebBrowser from 'expo-web-browser';
import ProfileItem from './ProfileItem';

type ProfileProps = {
    userId: string,
    navigation: any
}

type ProfileState = {
    profileData: any,
    totalSubmissions: number,
    storySubmissions: number,
    commentSubmissions: number,
    pollSubmissions: number,
    submissionData: any[],
    nextIndex: number,
    dataLoading: boolean
}

const {width, height} = Dimensions.get('window');

let loadBatch = false;

export default class Profile extends React.Component<ProfileProps, ProfileState>{
    constructor(props: ProfileProps){
        super(props)

        this.state = {
            profileData: null,
            totalSubmissions: 0,
            commentSubmissions: 0,
            pollSubmissions: 0,
            storySubmissions: 0,
            submissionData: [],
            nextIndex: 0,
            dataLoading: true,
        }
    }


    async componentDidMount(){
        let data = await HN_Util.getProfile(this.props.userId);
        let storyCount = 0;
        let pollCount = 0;
        let commentCount = 0;
        let totalSubmissions = !!data.submitted ? data.submitted.length : 0;
        let submissionData: any[] = [];
        if(totalSubmissions > 0){
            submissionData = await this.getInitialSubmissionData(data.submitted, 20);
        }
        /*for(let i in data.submitted){
            let subData = await HN_Util.getItem(data.submitted[i]);
            if(subData.type === "story"){
                storyCount++;
            }
            else if(subData.type === "comment"){
                commentCount++;
            }
            else if(subData.type === "poll"){
                pollCount++;
            }
            else{
                console.log(subData);
            }
        }*/
        await this.setState({
            profileData: data, 
            totalSubmissions: totalSubmissions, 
            submissionData: submissionData, 
            nextIndex: this.state.nextIndex + 20, 
            storySubmissions: storyCount, 
            pollSubmissions: pollCount, 
            commentSubmissions: commentCount,
            dataLoading: false
        });
    }

    render(){
        if(this.state.profileData === null){
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
            return (
                <View style={styles.container}>
                    <View style={{marginTop: 24}}/>
                    <FlatList
                        style={{backgroundColor: "#D3D3D3"}}
                        keyExtractor={(item)=>item.id.toString()}
                        data={this.state.submissionData}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this._renderHeaderComponent}
                        ListEmptyComponent={this._renderEmptyList}
                        ItemSeparatorComponent={() => <View style={{marginTop:7}}/>}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.dataLoading}
                                onRefresh={async () => {
                                    let data = await this.getInitialSubmissionData(this.state.profileData.submitted, 20);
                                    this.setState({submissionData: data, nextIndex: 20});
                                }}
                                colors={["red", "blue", "green"]}
                            />
                        }
                        onEndReached={async () => {await this.loadBatchSubmissionData(this.state.profileData.submitted, this.state.nextIndex, 20 )}}
                        onEndReachedThreshold={0.5}
                    />
                </View>
            );
        }

    }

    _renderItem = ({item, index}: {item:any, index:any}) => {
        return (
            <ProfileItem itemData={item} index={index} navigation={this.props.navigation}/>
        );
    }

    _renderHeaderComponent = () => {
        const data = this.state.profileData;
        return(
            <View style={{minHeight: 200, width: width, backgroundColor: "rgb(255, 102, 0)", marginBottom: 10, paddingTop:20, justifyContent:"space-between", alignItems:"center"}}>
                <View>
                    <Text style={{textAlign:"center", fontSize: 32, fontWeight: "bold"}}>{data.id}</Text>
                    <Text style={{textAlign:"center", fontSize: 20, fontStyle: "italic"}}>Karma: {data.karma}</Text>
                </View>


                {!!data.about &&
                    <View>
                        <Text style={{textAlign:"center", fontSize: 20, textDecorationLine:"underline"}}>About</Text>
                        <View style={{padding: 10}}>
                            <HTML html={data.about} onLinkPress={(event, href)=>WebBrowser.openBrowserAsync(href)}/>
                        </View>
                    </View>
                }

                <View style={{width: '100%', marginLeft:5, marginBottom: 2, flexDirection: "row", alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{textAlignVertical: "bottom", fontStyle:"italic", fontSize: 16}}>{this.state.totalSubmissions} submissions</Text>

                    <Text style={{paddingRight: 10, textAlignVertical: "bottom", fontStyle:"italic", fontSize: 16}}>Joined {this.calcTime(data.created)} ago</Text>
                </View>
            </View>
        );
    }

    _renderEmptyList = () => {
        return (
            <View>
                <Text>User has no submissions yet :)</Text>
            </View>
        );
    }

    getInitialSubmissionData = async (data:any[], amount: number):Promise<any[]> => {
        loadBatch = false;
        let results:any[] = [];

        let reduced = data.slice(0, amount);

        for(let i in reduced){
            let subData = await HN_Util.getItem(data[i]);
            if(!!subData && (subData.text || subData.url)){
                results.push(subData);
            }
        }
        loadBatch = true;
        return results;
    }

    loadBatchSubmissionData = async (data:any[], index: number, amount: number) => {
        if(this.state.submissionData.length >= this.state.totalSubmissions || !loadBatch){
            return;
        }
        loadBatch = false;
        this.setState({dataLoading: true});
        let results:any[] = [];
        let reduced = data.slice(index, index + amount);

        for(let i in reduced){
            let subData = await HN_Util.getItem(reduced[i]);
            if(!!subData && (subData.text || subData.url)){
                results.push(subData);
            }
        }

        await this.setState({submissionData: [...this.state.submissionData, ...results], nextIndex: this.state.nextIndex + 20, dataLoading: false});
        loadBatch = true;
        //return results;
    }

    getSubmissionDetails = () => {
        let ss = this.state.storySubmissions;
        let cs = this.state.commentSubmissions;
        let ps = this.state.pollSubmissions;
        return `${ss} ${ss === 1 ? 'story' : 'stories'}, ${cs} ${cs === 1 ? 'comment' : 'comments'}, ${ps} ${ps === 1 ? 'poll' : 'polls'}`
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
    container:{
        flex:1,
    }
});