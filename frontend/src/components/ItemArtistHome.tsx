// ItemArtistHome.tsx
import React from 'react'
import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
import { Artist } from '../types/types'
import HomeHeader from './HomeHeader'
import GetVariation from './GetVariation'
import ViewChart from './ViewChart'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../app/App'
import { HomeScreenProps } from '../navigation/Tabs'

type Props = {
    data: Artist[],
    navigation: HomeScreenProps['navigation'],
    handleNavigation: () => void

}

const ItemArtistHome: React.FC<Props> = ({data, navigation, handleNavigation}) => { // <-- Adicione 'navigation' aqui
    const renderItem = ({item}:{item: Artist}) => {
        return(
            <View style={styles.itemContainer}>
                <Image
                source={{uri: item.cover}}
                style={{width: 110, height: 110}}
                />
                <Text style={styles.rankText}>{item.rank_position}</Text>
                <Text style={styles.text}>{item.name}</Text>
                <View style={styles.variation}>
                    <GetVariation
                    rank_position={item.rank_position}
                    last_week={item.last_week}
                    total_weeks={item.total_weeks}
                    />
                </View>

            </View>
        )

    }
    return(
        <View style={{flex: 1, height: 260}}>
            <HomeHeader
            color='#000'
            text='Top Artistas'
            />
            <FlatList
            data={data.slice(0, 3)}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.name}`}
            horizontal={true}
            />
            <ViewChart
            color='#000'
            onPress={handleNavigation}
            />
        </View>
    )
}

export default ItemArtistHome;

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#fff',
        width: 144,
        marginEnd: 0.5,
        alignItems: 'center',
        padding: 15
    },
    text: {
        fontSize: 15,
        fontFamily: 'NeueHaasDisplayBold',
        textAlign: 'center'
    },
    variation: {
        position: 'absolute',
        right: 5,
        top: 5
    },
    rankText: {
        fontSize: 30,
        fontFamily: 'NeueHaasDisplayBold',
        marginEnd: 10
    }
})