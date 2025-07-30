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

type TopTracksRouteProp = RouteProp<RootStackParamList, 'TopTracks'>;
type TopTrackNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopTracks'>

type Props = {
    route: TopTracksRouteProp;
    navigation: TopTrackNavigationProp
};


const TopTracks: React.FC<Props> = ({route, navigation}) => {

    const { data } = route.params

    return(
        <View style={{flex: 1, backgroundColor: '#eee'}}>
            <TopContainer
            album={data[0]}
            color="#D51007"
            />
            <ListItems
            data={data}
            navigation={navigation}
            />
        </View>
    )
}

export default TopTracks;