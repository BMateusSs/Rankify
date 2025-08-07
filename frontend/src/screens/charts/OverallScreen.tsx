import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image, Button} from 'react-native'
import { Overall } from '../../types/types'
import { API_URLS } from '../../constants/api'
import { useFetch } from '../../hooks/useFetch'
import { fonts } from '../../style'
import ItemButton from '../../components/ItemButton'

type ItemType = 'albums' | 'tracks' | 'artists'

const OverallScreen: React.FC = () => {
    const [type, setType] = useState<ItemType>('albums')

    const url = type === 'albums' ? API_URLS.GET_TOP_ALBUMS_OVERALL : 
                type === 'tracks' ? API_URLS.GET_TOP_TRACKS_OVERALL : API_URLS.GET_TOP_ARTISTS_OVERALL

    const {data, loading, error} = useFetch<Overall[]>(url)

    if (loading){
        return <ActivityIndicator size={30}/>
    }

    const renderItem = ({item, index} : {item: Overall, index: number}) => {
        const rank = index + 1
        return(
            <View style={styles.itemContainer}>
                <View style={styles.peak}>
                    <Text style={styles.mainText}>{rank}</Text>
                </View>
                
                <Image
                source={{uri: item.cover}}
                style={styles.itemImage}
                />
                <View style={styles.itemArtist}>
                    <Text style={styles.mainText}>{item.name}</Text>
                    <Text style={styles.subText}>{item.artist}</Text>
                </View>
                <View style={styles.metaData}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaText}>{item.playcount}</Text>
                        <Text style={styles.metaLabel}>Plays</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaText}>{item.peak_position}</Text>
                        <Text style={styles.metaLabel}>Pico</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaText}>{item.total_weeks}</Text>
                        <Text style={styles.metaLabel}>Semanas</Text>
                    </View>
                </View>
                
            </View>
        )
    }

    return(
        <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', marginTop: 50}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            
            <ItemButton
            icon="music"
            color="blue"
            onPress={() => setType('tracks')}
            />

            <ItemButton
            icon="album"
            color="blue"
            onPress={() => setType('albums')}
            />

            <ItemButton
                icon="microphone-variant"
                color="blue"
                onPress={() => setType('artists')}
                />
            </View>
            
            <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.name} - ${item.artist}`}
            />
        </View>
    )
}

export default OverallScreen;

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '95%',
        
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
        alignItems: 'center'
    },
    itemArtist: {
        flex: 2,
        justifyContent: 'center',
        marginStart: 5
    },
    playcount: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    peakWeeks: {
        flex: 1.2,
        justifyContent: 'center'
    },
    mainText: {
        fontFamily: fonts.mainFont
    },
    subText: {
        fontFamily: fonts.simpleFont
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
})