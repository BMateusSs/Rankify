import React, {useEffect, useState} from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../app/App";
import TopContainer from "../../components/TopContainer";
import { useFetch } from "../../hooks/useFetch";
import { Album, Track, Date } from "../../types/types";
import { API_URLS } from "../../constants/api";
import { RouteProp } from "@react-navigation/native";
import ListItems from "../../components/ListItems";
import ChartHeader from "../../components/ChartHeader";
import ButtonDates from "../../components/ButtonDates";
import ItemButton from "../../components/ItemButton";
import TopTitle from "../../components/TopTitle";

type TopTracksRouteProp = RouteProp<RootStackParamList, 'TopTracks'>;
type TopTrackNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopTracks'>
type TopAlbumNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopAlbums'>

type Props = {
    route: TopTracksRouteProp;
    navigation: TopTrackNavigationProp | TopAlbumNavigationProp
};


const TopTracks: React.FC<Props> = ({navigation}) => {

    const [date, setDate] = useState<string>('')
    const [tracks, setTracks] = useState<Track[]>([])

    const {data: initialDate, loading: loadingDate, error: errorDate} = useFetch<Date[]>(API_URLS.GET_RECENT_WEEK)

    const {data: result, loading: resultLoading, error: errorResult, fetchData} = useFetch<Track[]>(API_URLS.GET_TOP_WEEKLY_TRACKS)

    useEffect(() => {
        if (initialDate && initialDate.length > 0){
            const selectedDate = initialDate[0].start_date
            setDate(selectedDate);
            fetchData({
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({date: selectedDate})
            })
        }
    }, [initialDate, loadingDate])

    useEffect(() => {
        if (result){
            setTracks(result)
        }
    }, [result])

    
    const handleChangeDate = (newDate: string) => {
        const selectedDate = newDate
        fetchData({
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({date: selectedDate})
        })
    }
    
    if (loadingDate || resultLoading){
        return <ActivityIndicator size={30}/>
    }

    const handleTopAlbum = () => {
        navigation.navigate('TopAlbums')
    }
    
    const handleTopArtist = () => {
        navigation.navigate('TopArtists')
    }

    return(
        <ScrollView style={{flex: 1}}>
        <View style={{backgroundColor: '#eee'}}>
            <TopTitle
            text="Top 50 Músicas"
            color="#D51007"
            />
            <View style={{ flexDirection: 'row', width: '100%', height: 100, alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                <ButtonDates 
                setDate={handleChangeDate}
                color='#D51007' />
                
                <ItemButton
                icon="music"
                color="#D51007"
                />
                <ItemButton
                icon="album"
                color="#D51007"
                onPress={handleTopAlbum}
                />

                <ItemButton
                icon="microphone-variant"
                color="#D51007"
                onPress={handleTopArtist}
                />
            </View>

            {tracks.length > 0 && (
            <TopContainer
                album={tracks[0]}
                color="#D51007"
            />
            )}

            <ChartHeader
            backgroundColor="#D51007"
            />

            <ListItems
            data={tracks}
            navigation={navigation}
            />
        </View>
        </ScrollView>
    )
}

export default TopTracks;