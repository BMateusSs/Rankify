import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app/App";
import TopContainer from "../../components/TopContainer";
import { RouteProp } from "@react-navigation/native";
import ListItems from "../../components/ListItems";
import ChartHeader from "../../components/ChartHeader";
import { Artist, Date } from "../../types/types";
import { useFetch } from "../../hooks/useFetch";
import { API_URLS } from "../../constants/api";
import ButtonDates from "../../components/ButtonDates";
import ItemButton from "../../components/ItemButton";
import TopTitle from "../../components/TopTitle";

type TopTracksRouteProp = RouteProp<RootStackParamList, 'TopArtists'>;
type TopArtistNavigation = NativeStackNavigationProp<RootStackParamList, 'TopArtists'>;

type Props = {
    route: TopTracksRouteProp;
    navigation: TopArtistNavigation
};

const TopArtists: React.FC<Props> = ({navigation}) => {

    const [artist, setArtists] = useState<Artist[]>([])

    const {data: initialDate, loading: loadingDate, error: errorDate} = useFetch<Date[]>(API_URLS.GET_RECENT_WEEK)

    const {data: result, loading: loadingPost, error: errorPost, fetchData} = useFetch<Artist[]>(API_URLS.GET_TOP_WEEKLY_ARTISTS)

    useEffect(() => {
        if (initialDate && initialDate.length > 0){
            const selectedDate = initialDate[0].start_date
            fetchData({
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ date: selectedDate})
            })
        }
    }, [initialDate, loadingDate])

    useEffect(() => {
        if(result){
            setArtists(result)
        }
    }, [result])

    const handleChangeDate = (newDate: string) => {
        const selectedDate = newDate
        fetchData({
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ date: selectedDate})
        })
    }

    if (loadingDate || loadingPost) {
            return <ActivityIndicator size={30} />;
        }

    const handleTopTrack = () => {
        navigation.navigate('TopTracks')
    }
    
    const handleTopAlbum = () => {
        navigation.navigate('TopAlbums')
    }

    return(
        <ScrollView style={{flex: 1}}>
        <View style={{backgroundColor: '#eee'}}>
            <TopTitle
            text="Top 50 Artistas"
            color="#000"
            />
            <View style={{ flexDirection: 'row', width: '100%', height: 100, alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                <ButtonDates 
                setDate={handleChangeDate}
                color='#000' />
                <ItemButton
                icon="music"
                color="#000"
                onPress={handleTopTrack}
                />
                <ItemButton
                icon="album"
                color="#000"
                onPress={handleTopAlbum}
                />

                <ItemButton
                icon="microphone-variant"
                color="#000"
                />
            </View>
            { artist.length > 0 
            && <TopContainer
            album={artist[0]}
            color="#000"
            />}

            <ChartHeader
            backgroundColor="#000"
            />
            <ListItems
            data={artist}
            navigation={navigation}
            />
        </View>
        </ScrollView>
    )
}

export default TopArtists;