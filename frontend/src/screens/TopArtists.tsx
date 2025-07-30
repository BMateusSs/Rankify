import React from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/App";
import TopContainer from "../components/TopContainer";
import { RouteProp } from "@react-navigation/native";
import ListItems from "../components/ListItems";

type TopTracksRouteProp = RouteProp<RootStackParamList, 'TopArtists'>;
type TopArtistNavigation = NativeStackNavigationProp<RootStackParamList, 'TopArtists'>;

type Props = {
    route: TopTracksRouteProp;
    navigation: TopArtistNavigation
};

const TopArtists: React.FC<Props> = ({route, navigation}) => {

    const { data } = route.params

    return(
        <View style={{flex: 1, backgroundColor: '#eee'}}>
            <TopContainer
            album={data[0]}
            color="#000"
            />
            <ListItems
            data={data}
            navigation={navigation}
            />
        </View>
    )
}

export default TopArtists;