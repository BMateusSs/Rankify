import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Album, Artist, AlbumChartData } from '../types/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import GetVariation from './GetVariation'
import { useInfoFetch } from '../hooks/useInfoFetch'
import { API_URLS } from '../constants/api'
import { RootStackParamList } from '../app/App'

type TopAlbumsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopAlbums'>
type TopTrackNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopTracks'>
type TopArtistNavigation = NativeStackNavigationProp<RootStackParamList, 'TopArtists'>;

interface Props {
    data: (Album | Artist)[];
    navigation: TopAlbumsNavigationProp | TopTrackNavigationProp | TopArtistNavigation
}

const ListItems: React.FC<Props> = ({data, navigation}) => {
    const renderItem = ({item}:{item: Album | Artist}) => {

        const handleChartInfo = ({artist, album, type} : {artist: string, album: string, type: string}) => {
            navigation.navigate('ItemInfos', {artist, album, type})
        }

        const isArtist = item.type === 'artist'
        return(
            <View style={styles.itemContainer}>
                <View style={styles.rankVariation}>
                    <Text style={styles.rankText}>{item.rank_position}</Text>
                    <GetVariation
                    rank_position={item.rank_position}
                    last_week={item.last_week}
                    total_weeks={item.total_weeks}
                    />
                </View>

                <View style={styles.cover}>
                    <Image
                    source={{uri: item.cover}}
                    style={{width: 80, height: 80}}
                    />
                </View>

                <View style={styles.itemInfos}>
                    <View style={styles.nameArtist}>
                        <Text style={styles.name}>{item.name}</Text>
                        {'artist' in item && item.artist && (
                            <Text style={styles.artist}>{item.artist}</Text>
                                                                        )}
                    </View>
                    <View style={styles.chartInfo}>
                        <View style={styles.imparContainer}>
                            <Text>{item.playcount}</Text>
                        </View>
                        <View style={styles.parContainer}>
                            <Text>{item.last_week}</Text>
                        </View>
                        <View style={styles.imparContainer}>
                            <Text>{item.peak_position}</Text>
                        </View>
                        <View style={styles.parContainer}>
                            <Text>{item.total_weeks}</Text>
                        </View>
                        
                            <View style={styles.imparContainer}>
                                <TouchableOpacity
                                    onPress={() => handleChartInfo({artist: item.artist, album: item.name, type: item.type})}>
                                        <Text>+</Text>
                                </TouchableOpacity>
                                
                            </View>
                        
                    </View>
                </View>
            </View>
        )
    }
    return(
        <View style={{width: '100%'}}>
            <FlatList<Album | Artist>
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) =>
                item.type === 'artist'
                    ? `artist-${item.name}`
                    : `${item.name}-${item.artist}`
                }

            />
        </View>
    )
}

export default ListItems;

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#fff',
        width: '100%',
        flexDirection: 'row'
    },
    rankVariation: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40
    },
    cover: {
        width: 80,
        height: 80
    },
    itemInfos: {
        flex: 1
    },
    nameArtist: {
        flex: 1,
        justifyContent: 'center',
        marginStart: 5
    },
    chartInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rankText: {
        fontFamily: 'NeueHaasDisplayBold'
    },
    name: {
        fontFamily: 'NeueHaasDisplayBold'
    },
    artist: {
        fontFamily: 'NeueHaasDisplayXThin',
    },
    imparContainer: {
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    parContainer: {
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }, 
    chartText: {
        fontFamily: 'NeueHaasDisplayXThin'
    }
})