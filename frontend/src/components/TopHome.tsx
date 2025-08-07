import React from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { Album } from '../types/types'
import { useFetch } from '../hooks/useFetch'
import { API_URLS } from '../constants/api'
import { useFonts } from 'expo-font'
import ItemHome from './ItemHome'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../app/App'
import { HomeScreenProps } from '../navigation/Tabs'

type Props = {
    navigation: HomeScreenProps['navigation']
}

const TopHome: React.FC<Props> = ({navigation}) => {
    const {data, loading, error} = useFetch<Album[]>(API_URLS.GET_WEEKLY_ALBUMS)

    if (loading) return <ActivityIndicator size='large'/>;
    if (error) return <Text>{error}</Text>
    if (!data || data.length === 0) return <Text>Nenhum álbum encontrado.</Text>;

    const handleTopAlbums = () => {
        navigation.navigate('TopAlbums')
    }

    return(
        <View style={{flex: 1, marginTop: 50}}>
            <ItemHome
            data={data}
            navigation={navigation}
            handleNavigation={handleTopAlbums}
            />
        </View>
        
    )
}

export default TopHome

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
    }
})
