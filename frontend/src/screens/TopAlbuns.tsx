import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../app/App";
import TopContainer from "../components/TopContainer";
import ListItems from "../components/ListItems";
import ButtonDates from "../components/ButtonDates";
import ButtonTracks from "../components/ButtomTracks";
import ButtonAlbum from "../components/ButtonAlbum";
import ButtonArtists from "../components/ButtonArtist";
import { useFetch } from "../hooks/useFetch";
import { Album, Date } from "../types/types";
import { API_URLS } from "../constants/api";
import { fonts } from "../style";
import ChartHeader from "../components/ChartHeader";

type TopAlbumsRouteProp = RouteProp<RootStackParamList, 'TopAlbums'>;
type TopAlbumsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopAlbums'>;

type Props = {
    route: TopAlbumsRouteProp;
    navigation: TopAlbumsNavigationProp;
};

const TopAlbums: React.FC<Props> = ({ route, navigation }) => {
    const { data } = route.params;

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

    return (
        <View style={{ flex: 1, backgroundColor: '#eee', alignItems: 'center' }}>
            <View style={{backgroundColor: '#fff', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Text
                style={{fontFamily: fonts.mainFont, fontSize: 50}}
                >Top 50 Álbuns</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', height: 100, alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                <ButtonDates setDate={handleChangeDate} />
                <ButtonTracks />
                <ButtonAlbum />
                <ButtonArtists />
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
    );
};

export default TopAlbums;
