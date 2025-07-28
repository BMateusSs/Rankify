import React from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { Artist } from '../types/types'
import { useFetch } from '../hooks/useFetch'
import { API_URLS } from '../constants/api'
import ItemArtistHome from './ItemArtistHome'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../app/App'
import { HomeScreenProps } from '../navigation/Tabs'

type Props = {
    navigation: HomeScreenProps['navigation']
}


const TopArtistHome: React.FC<Props> = ({navigation}) => {
    const {data, loading, error} = useFetch<Artist[]>(API_URLS.GET_WEEKLY_ARTISTS)

    if (loading) return <ActivityIndicator size='large'/>;
    if (error) return <Text>{error}</Text>
    if (!data || data.length === 0) return <Text>Nenhum Artista encontrado.</Text>;

    const handleTopArtists = () => {
        navigation.navigate('TopArtists', {data: data})
    }
    return(
        <View style={{flex: 1, marginTop: 50}}>
            <ItemArtistHome
            data={data}
            navigation={navigation}
            handleNavigation={handleTopArtists}
            />
            
        </View>
        
    )
}

export default TopArtistHome

const styles = StyleSheet.create({
    itemContainer: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rankText: {
        fontSize: 25,
        fontFamily: 'NeueHaasDisplayBold'
    },
    albumName: {
        fontSize: 15,
        fontFamily: 'NeueHaasDisplayBold'
    },
    artistName: {
        fontSize: 15,
        fontFamily: 'NeueHaasDisplayXThin',
        
    },
    albumArtist: {
        marginEnd: 20
    },
    
})