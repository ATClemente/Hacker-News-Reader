import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, TouchableNativeFeedback } from 'react-native';

type ProfileProps = {
    userId: number
}

type ProfileState = {

}

export default class Profile extends React.Component<ProfileProps, ProfileState>{
    constructor(props: ProfileProps){
        super(props)

        this.state = {

        }
    }

    render(){
        console.log(this.props.userId);
        return (
            <View style={styles.container}>
                <Text>{this.props.userId}</Text>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "red",
        padding: 50
    }
});