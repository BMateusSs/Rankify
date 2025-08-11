import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { API_URLS } from '../../constants/api'
import GetEmblems from '../../components/GetEmblems'
import Ranking from '../../components/RankingEmblems'
import ItemButton from '../../components/ItemButton'
import { useFetch } from '../../hooks/useFetch'
import { Emblems } from '../../types/types'
import RankContainer from '../../components/RankContainer'

const EmblemRanking: React.FC = () => {
    const [type, setType,] = useState<string>('album')

    const url = type === 'album' ? API_URLS.GET_RANKING_ALBUMS_EMBLEMS : API_URLS.GET_RANKING_TRACKS_EMBLEMS

    const {data, loading, error, fetchData} = useFetch<Emblems[]>(url)

    useEffect(() => {
        console.log(type)
        fetchData({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: type }),
            });
    }, [type])

    if (!data || data.length===0){
        return(
            <Text>Sem álbums</Text>
        )
    }
    
    return(
        <ScrollView>
            <View style={{flex: 1, backgroundColor: '#87CEFA'}}>
                <ItemButton
                color='blue'
                icon='music'
                onPress={() => setType('track')}
                />
                <ItemButton
                color='blue'
                icon='disc'
                onPress={() => setType('album')}
                />
                <RankContainer/>
                <Ranking
                data={data}
                />
            </View>
        </ScrollView>
        
    )
}

export default EmblemRanking