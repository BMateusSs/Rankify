import React from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../app/App";
import TopContainer from "../components/TopContainer";
import { useFetch } from "../hooks/useFetch";
import { Album } from "../types/types";
import { API_URLS } from "../constants/api";
import { RouteProp } from "@react-navigation/native";
import ListItems from "../components/ListItems";

type TopAlbumsRouteProp = RouteProp<RootStackParamList, 'TopAlbums'>;
type TopAlbumsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopAlbums'>

type Props = {
    route: TopAlbumsRouteProp;
    navigation: TopAlbumsNavigationProp
};


const TopAlbums: React.FC<Props> = ({route, navigation}) => {

    const { data } = route.params

    return(
        <View style={{flex: 1, backgroundColor: '#eee'}}>
            <TopContainer
            album={data[0]}
            color="#1DB954"
            />
            <ListItems
            data={data}
            navigation={navigation}
            />
        </View>
    )
}

export default TopAlbums;