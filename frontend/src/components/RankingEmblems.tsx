import React from 'react'
import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import { API_URLS } from '../constants/api'
import { useFetch } from '../hooks/useFetch'
import { Emblems } from '../types/types'
import { fonts } from '../style'

type Props = {
    data: Emblems[]
}

const Ranking: React.FC<Props> = ({data}) => {
    

    let rank;
    
    const renderItem = ({item, index}: {item: Emblems, index: number}) => {
        rank = index + 1
        return(
            <View style={styles.itemContainer}>
                <View style={styles.rank}>
                    <Text style={styles.rankText}>{rank}</Text>
                </View>
                <Image
                source={{uri: item.cover}}
                style={{width: 80, height: 80}}
                />
                <View style={styles.itemArtist}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.artist}>{item.artist}</Text>
                </View>
                <View style={styles.pointsContainer}>
                    <Text style={styles.points}>
                        {item.total_pontos}
                    </Text>
                </View>
            </View>
        )
    }
    return(
        
        <View style={{backgroundColor: '#fff', paddingTop: 20, borderTopRightRadius: 30, borderTopLeftRadius: 30}}>
            <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.cover}-${item.name}`}
            scrollEnabled={false}
            />
        </View>
    )
}

export default Ranking;

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 5,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rank: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rankText: {
        fontFamily: fonts.mainFont,
        fontSize: 20
    },
    itemArtist: {
        flex: 2,
        padding: 10,
        justifyContent: 'center'
    },
    name: {
        fontFamily: fonts.mainFont
    },
    artist: {
        fontFamily: fonts.simpleFont
    },
    pointsContainer: {
        padding: 10,
        justifyContent: 'center'
    },
    points: {
        fontFamily: fonts.mainFont
    }
})