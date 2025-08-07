import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../app/App";
import TopContainer from "../../components/TopContainer";
import ListItems from "../../components/ListItems";
import ButtonDates from "../../components/ButtonDates";
import ButtonTracks from "../../components/ButtomTracks";
import ButtonAlbum from "../../components/ItemButton";
import ButtonArtists from "../../components/ButtonArtist";
import { useFetch } from "../../hooks/useFetch";
import { Album, Date } from "../../types/types";
import { API_URLS } from "../../constants/api";
import { fonts } from "../../style";
import ChartHeader from "../../components/ChartHeader";
import ItemButton from "../../components/ItemButton";
import TopTitle from "../../components/TopTitle";

type TopAlbumsRouteProp = RouteProp<RootStackParamList, 'TopAlbums'>;
type TopAlbumsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopAlbums'>;
type TopTracksNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopTracks'>;

type Props = {
    route: TopAlbumsRouteProp;
    navigation: TopAlbumsNavigationProp | TopTracksNavigationProp;
};

const TopAlbums: React.FC<Props> = ({navigation }) => {

    const { data: initialDate, loading: loadingDate, error: errorDate } = useFetch<Date[]>(API_URLS.GET_RECENT_WEEK);

    const [date, setDate] = useState<string>('');
    const [albums, setAlbums] = useState<Album[]>([]);

    const {
        data: result,
        loading: postLoading,
        error: postError,
        fetchData
    } = useFetch<Album[]>(API_URLS.GET_TOP_WEEKLY_ALBUMS);

    useEffect(() => {
        if (initialDate && initialDate.length > 0) {
            const selectedDate = initialDate[0].start_date;
            setDate(selectedDate);
            fetchData({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate }),
            });
        }
    }, [initialDate, loadingDate]);

    useEffect(() => {
        if (result) {
            setAlbums(result);
        }
    }, [result]);

    const handleChangeDate = (newDate: string) => {
        setDate(newDate);
        fetchData({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: newDate }),
        });
    };

    if (loadingDate || postLoading) {
        return <ActivityIndicator size={30} />;
    }

    const handleTopTrack = () => {
        navigation.navigate('TopTracks')
    }
    
    const handleTopArtist = () => {
        navigation.navigate('TopArtists')
    }

    return (
        <ScrollView style={{flex: 1}}>

        
        <View style={{backgroundColor: '#eee', alignItems: 'center' }}>
            <TopTitle
            text="Top 50 Álbuns"
            color="#1DB954"
            />
            <View style={{ flexDirection: 'row', width: '100%', height: 100, alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                <ButtonDates 
                setDate={handleChangeDate}
                color='#1DB954' />
                <ItemButton
                icon="music"
                color="#1DB954"
                onPress={handleTopTrack}
                />
                <ItemButton
                icon="album"
                color="#1DB954"
                />

                <ItemButton
                icon="microphone-variant"
                color="#1DB954"
                onPress={handleTopArtist}
                />
            </View>

            {albums.length > 0 && (
                <TopContainer
                    album={albums[0]}
                    color="#1DB954"
                />
            )}

            <ChartHeader
                backgroundColor='#1DB954'
            />
            <ListItems
                data={albums}
                navigation={navigation}
            />
        </View>
        </ScrollView>
    );
};

export default TopAlbums;
