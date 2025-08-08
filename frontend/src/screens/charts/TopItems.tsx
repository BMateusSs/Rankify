import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../app/App";
import TopContainer from "../../components/TopContainer";
import ListItems from "../../components/ListItems";
import ButtonDates from "../../components/ButtonDates";
import { useFetch } from "../../hooks/useFetch";
import { Album, Date } from "../../types/types";
import { API_URLS } from "../../constants/api";
import ChartHeader from "../../components/ChartHeader";
import ItemButton from "../../components/ItemButton";
import TopTitle from "../../components/TopTitle";

type TopItemsRouteProp = RouteProp<RootStackParamList, 'TopItems'>;
type TopItemsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopItems'>;
type TopTracksNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopTracks'>;

type Props = {
    route: TopItemsRouteProp;
    navigation: TopItemsNavigationProp | TopTracksNavigationProp;

};

const TopItems: React.FC<Props> = ({navigation, route}) => {
    const {type} = route.params

    const { data: initialDate, loading: loadingDate, error: errorDate } = useFetch<Date[]>(API_URLS.GET_RECENT_WEEK);
    const [typeItem, setTypeItem] = useState<string>(type)
    const [date, setDate] = useState<string>('');
    const [albums, setAlbums] = useState<Album[]>([]);

    const url = typeItem === 'album' ? API_URLS.GET_TOP_WEEKLY_ALBUMS : 
                typeItem === 'track'? API_URLS.GET_TOP_WEEKLY_TRACKS : API_URLS.GET_TOP_WEEKLY_ARTISTS

    const color = typeItem === 'album' ? "#1DB954" : 
                  typeItem === 'track' ? "#D51007" : '#000'

    const {
        data: result,
        loading: postLoading,
        error: postError,
        fetchData
    } = useFetch<Album[]>(url);

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
    }, [initialDate, loadingDate, typeItem, url]);

    useEffect(() => {
        if (result) {
            setAlbums(result);
        }
    }, [result, typeItem]);

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
        <ScrollView style={{flex: 1}}>

        
        <View style={{backgroundColor: '#eee', alignItems: 'center' }}>
            <TopTitle
            text="Top 50 Álbuns"
            color={color}
            />
            <View style={{ flexDirection: 'row', width: '100%', height: 100, alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                <ButtonDates 
                setDate={handleChangeDate}
                color={color} />
                <ItemButton
                icon="music"
                color={color}
                onPress={() => setTypeItem('track')}
                />
                <ItemButton
                icon="album"
                color={color}
                onPress={() => setTypeItem('album')}
                />

                <ItemButton
                icon="microphone-variant"
                color={color}
                onPress={() => setTypeItem('artist')}
                />
            </View>

            {albums.length > 0 && (
                <TopContainer
                    album={albums[0]}
                    color={color}
                />
            )}

            <ChartHeader
                backgroundColor={color}
            />
            <ListItems
                data={albums}
                navigation={navigation}
            />
        </View>
        </ScrollView>
    );
};

export default TopItems;
