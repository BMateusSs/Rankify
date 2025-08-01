import React, {useEffect, useState} from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../app/App";
import TopContainer from "../components/TopContainer";
import { useFetch } from "../hooks/useFetch";
import { Album, Track, Date } from "../types/types";
import { API_URLS } from "../constants/api";
import { RouteProp } from "@react-navigation/native";
import ListItems from "../components/ListItems";
import ChartHeader from "../components/ChartHeader";
import ButtonDates from "../components/ButtonDates";

type TopTracksRouteProp = RouteProp<RootStackParamList, 'TopTracks'>;
type TopTrackNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopTracks'>

type Props = {
    route: TopTracksRouteProp;
    navigation: TopTrackNavigationProp
};


const TopTracks: React.FC<Props> = ({route, navigation}) => {

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

    return(
        <View style={{flex: 1, backgroundColor: '#eee'}}>
            <ButtonDates
            setDate={handleChangeDate}
            
            />
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
    )
}

export default TopTracks;