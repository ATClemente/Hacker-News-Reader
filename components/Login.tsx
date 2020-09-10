import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, TouchableNativeFeedback, Alert } from 'react-native';
import * as StorageService from "../services/StorageService";
import { Feather } from '@expo/vector-icons';


type LoginProps = {
    navigation: any
}

type LoginState = {
    
}

export default class Settings extends React.Component<LoginProps, LoginState>{
    constructor(props: LoginProps){
        super(props)

        this.state = {

        }
    }

    render(){
        return(
            <View style={{marginTop: '100%', height: '50%', backgroundColor: 'white'}}>
                <Text style={{}}>Login Screen</Text>
            </View>
        );
    }
}