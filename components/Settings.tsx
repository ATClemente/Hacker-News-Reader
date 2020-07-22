import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, TouchableNativeFeedback, Alert } from 'react-native';
import * as StorageService from "../services/StorageService";
import { Feather } from '@expo/vector-icons';


type SettingsProps = {
    navigation: any
}

type SettingsState = {
    showDataOptions: boolean
}

export default class Settings extends React.Component<SettingsProps, SettingsState>{
    constructor(props: SettingsProps){
        super(props)

        this.state = {
            showDataOptions: false
        }
    }

    render(){
        return(
        <View style={styles.container}>
            <View style={{marginTop: 24}}/>
            <View style={{flexDirection: "row", alignItems: "center", height: 50, backgroundColor: "rgb(255, 102, 0)"}}>
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("News")}>
                    <Feather style={{marginLeft: 10, textAlignVertical: "center"}} name="arrow-left" size={24} color="black" />
                </TouchableNativeFeedback>
                <Text style={{textAlignVertical: "center", fontSize: 20, fontWeight:"bold", marginLeft: 10}}>Settings</Text>        
            </View>



            <View style={{borderColor: '#ddd', borderBottomWidth: 1 }}></View>

            <TouchableOpacity onPress={() => this.setState({showDataOptions: !this.state.showDataOptions})}>
                <View style={styles.settingBlock}>
                    <Feather style={{marginLeft: 10, textAlignVertical: "center"}} name="database" size={24} color="black" />
                    <Text style={styles.settingBlockText}>Data</Text>
                    <View style={{flex:1}}></View>
                    <Feather style={{marginLeft: 10, textAlignVertical: "center"}} name={this.state.showDataOptions ? "chevron-up" : "chevron-down"} size={24} color="black" />
                </View>
            </TouchableOpacity>
            
            {!this.state.showDataOptions &&
                <View style={{borderColor: '#ddd', borderBottomWidth: 1 }}></View>
            }

            {this.state.showDataOptions &&
                <React.Fragment>
                    <View style={{borderColor: '#ddd', borderBottomWidth: 1 }}></View>

                    <TouchableOpacity onPress={() => {
                        Alert.alert("", "Are you sure you want to clear read items?", [
                            {
                                text: "NO",
                                onPress: () => null,
                                style: "cancel"
                            },
                            { text: "YES", onPress: () => StorageService.clearReadItems() }
                        ]);
                    }}>
                        <View style={styles.subSettingBlock}>
                            <Feather style={{marginLeft: 10, textAlignVertical: "center"}} name="book" size={24} color="black" />
                            <Text style={styles.settingBlockText}>Clear All Read Items</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{borderColor: '#ddd', borderBottomWidth: 1 }}></View>

                    <TouchableOpacity onPress={() => {
                        Alert.alert("", "Are you sure you want to clear hidden items?", [
                            {
                                text: "NO",
                                onPress: () => null,
                                style: "cancel"
                            },
                            { text: "YES", onPress: () => StorageService.clearHiddenItems() }
                        ]);
                    }}>
                        <View style={styles.subSettingBlock}>
                            <Feather style={{marginLeft: 10, textAlignVertical: "center"}} name="eye" size={24} color="black" />
                            <Text style={styles.settingBlockText}>Clear All Hidden Items</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{borderColor: '#ddd', borderBottomWidth: 1 }}></View>

                    <TouchableOpacity onPress={() => {
                        Alert.alert("", "Are you sure you want to clear saved items?", [
                            {
                                text: "NO",
                                onPress: () => null,
                                style: "cancel"
                            },
                            { text: "YES", onPress: () => StorageService.clearSavedItems() }
                        ]);
                    }}>
                        <View style={styles.subSettingBlock}>
                            <Feather style={{marginLeft: 10, textAlignVertical: "center"}} name="bookmark" size={24} color="black" />
                            <Text style={styles.settingBlockText}>Clear All Saved Items</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{borderColor: '#ddd', borderBottomWidth: 1 }}></View>


                </React.Fragment>
            }

        </View>
        );

    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    settingBlock:{
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    subSettingBlock:{
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 25,
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    settingBlockText:{
        marginLeft: 10,
        marginRight: 10,
        fontSize: 22
    }
});