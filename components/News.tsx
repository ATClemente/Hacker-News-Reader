import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import Item from './Item';

type NewsProps = {
    newsData: Array<any>
}

type NewsState = {
    id: number
}


export default class News extends React.Component<NewsProps, NewsState>{
    constructor(props: NewsProps){
        super(props)

        this.state = {
            id: 1
        }
    }

    componentDidMount(){

    }


    render(){
        return(
            <FlatList
                style={{backgroundColor: "#D3D3D3"}}
                keyExtractor={(item) => item.toString()}
                data={this.props.newsData}
                renderItem={this._renderItem}
                ItemSeparatorComponent={() => <View style={{marginTop:5}}/>}
                ListHeaderComponent={() => <View style={{marginTop:5}}/>}
            />
        );
    }

    _renderItem = ({item, index} : {item: number, index: number}) => {
        return(
            <Item itemID={item} index={index}/>
        );
    }

}