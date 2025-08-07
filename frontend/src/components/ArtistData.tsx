import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useFetch } from '../hooks/useFetch'
import { artistData } from '../types/types'
import { fonts } from '../style'
import { API_URLS } from '../constants/api'

type Props = {
    album: string,
    type: string
}

const ArtistData: React.FC<Props> = ({ album, type }) => {
    const [visible, setVisible] = useState<boolean>(true)

    let url: string | null
    if (type === 'albums'){
        url = API_URLS.GET_ARTIST_ALBUMS_DATA
    } else{
        url = API_URLS.GET_ARTIST_TRACKS_DATA
    }

    const {
        data: albumsData,
        loading: loadingData,
        error: errorData,
        fetchData
    } = useFetch<artistData[]>(url)

    useEffect(() => {
        fetchData({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ artist: album })
        })
    }, [])

    const isVisible = () => {
        setVisible(!visible)
    }

    const renderItem = ({ item }: { item: artistData }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.peak}>
                    <Text style={styles.mainText}>{item.peak_position}</Text>
                </View>

                <Image
                    source={{ uri: item.cover }}
                    style={styles.itemImage}
                />

                <View style={styles.itemArtist}>
                    <Text style={styles.mainText}>{item.name}</Text>
                </View>

                <View style={styles.metaData}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaText}>{item.total_weeks}</Text>
                        <Text style={styles.metaLabel}>Semanas</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            
            <FlatList
                data={albumsData}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.name}`}
                scrollEnabled={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum álbum encontrado</Text>
                }
            />
            
        </View>
    )
}

export default ArtistData

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 15,
    },
    header: {
        height: 50,
        width: '100%',
        backgroundColor: 'blue',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
    },
    closeText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        borderWidth: 1,
        borderColor: 'blue',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: '100%',
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginBottom: 20
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 2,
        width: '100%',
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    peak: {
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemArtist: {
        flex: 2,
        justifyContent: 'center',
        marginStart: 5,
    },
    mainText: {
        fontFamily: fonts.mainFont,
    },
    metaData: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    metaItem: {
        alignItems: 'center',
        marginLeft: 15,
    },
    metaText: {
        fontFamily: fonts.mainFont,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#444',
    },
    metaLabel: {
        fontFamily: fonts.simpleFont,
        fontSize: 10,
        color: '#888',
    },
    emptyText: {
        fontFamily: fonts.simpleFont,
        padding: 15,
        textAlign: 'center',
        color: '#666',
    },
})
