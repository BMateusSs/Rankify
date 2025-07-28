import React from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { Album, Track } from '../types/types'
import GetVariation from './GetVariation'
import HomeHeader from './HomeHeader'
import ViewChart from './ViewChart'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../app/App'
import { HomeScreenProps } from '../navigation/Tabs'

type Props = {
    data: Album[] | Track[],
    navigation: HomeScreenProps['navigation'],
    handleNavigation: () => void

}

const ItemHome: React.FC<Props> = ({data, navigation, handleNavigation}) => {

    if (!data || data.length === 0) return <Text>Nenhum álbum encontrado.</Text>;

 const renderItem = ({ item }: { item: Album | Track }) => {
    

    const cover = item.cover
    const name = item.name
    const artist = item.artist;

    return (
        <View style={styles.itemContainer}>
            <Image
                source={{ uri: cover }}
                style={{ width: 100, height: 100 }}
            />

            <View style={styles.rankContainer}>
                <Text style={styles.rankText}>{item.rank_position}</Text>
                <GetVariation
                    rank_position={item.rank_position}
                    last_week={item.last_week}
                    total_weeks={item.total_weeks}
                />
            </View>

            <View style={styles.albumArtist}>
                <Text style={styles.albumName}>{name}</Text>
                <Text style={styles.artistName}>{artist}</Text>
            </View>
        </View>
    );
};

    const isAlbum = data[0].type === 'album';
    const color = isAlbum? '#1DB954' : '#D51007'
    const text = isAlbum? 'Top Álbuns' : 'Top Músicas'

    return(
        <View style={{height: 400}}>
            <HomeHeader
            color={color}
            text={text}
            />
            <FlatList
            data={data.slice(0, 3)}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.name}-${item.artist}`}
            scrollEnabled={false}
            ListFooterComponent={<ViewChart
            color={color}
            onPress={handleNavigation}
            />}
            />
            
        </View>
    )
}

export default ItemHome

const styles = StyleSheet.create({
    itemContainer: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 0.5
    },
    rankText: {
        fontSize: 30,
        fontFamily: 'NeueHaasDisplayBold',
        marginEnd: 10
    },
    albumName: {
        fontSize: 15,
        fontFamily: 'NeueHaasDisplayBold',
        
    },
    artistName: {
        fontSize: 15,
        fontFamily: 'NeueHaasDisplayXThin',
        
    },
    albumArtist: {
        flex: 3,
        height: '100%',
        justifyContent: 'center'
        
    },
    rankContainer: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
        
    }
})