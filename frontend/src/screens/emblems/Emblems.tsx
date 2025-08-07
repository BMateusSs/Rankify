import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { API_URLS } from '../../constants/api'
import GetEmblems from '../../components/GetEmblems'
import Ranking from '../../components/RankingEmblems'

const EmblemRanking: React.FC = () => {
    
    return(
        <ScrollView>
            <View style={{flex: 1}}>
                <GetEmblems
                title='Semana de Ouro'
                description='Albums que ultrapassaram 100 reproduções em uma única semana'
                url={API_URLS.GET_100_PLAYCOUNT_EMBLEM}
                />

                <GetEmblems
                title='Reproduções Infinitas'
                description='Albums que ultrapassaram 1000 reproduções totais dentro do chart'
                url={API_URLS.GET_1000_PLAYCOUNT_EMBLEM}
                />

                <GetEmblems
                title='Clássico Moderno'
                description='Albums que ultrapassaram 52 semanas não consecutivas dentro do chart'
                url={API_URLS.GET_52_WEEKS_EMBLEM}
                />

                <GetEmblems
                title='Raízes no Topo'
                description='Albums que ultrapassaram 5 semanas não consecutivas no topo do chart'
                url={API_URLS.GET_5_WEEKS_AT_ONE_EMBLEM}
                />

                <GetEmblems
                title='Chegada Triunfal'
                description='Albums que estrearam diretamente no topo do chart'
                url={API_URLS.GET_DEBUT_AT_ONE_EMBLEM}
                />

                <Ranking
                url={API_URLS.GET_RANKING_ALBUMS_EMBLEMS}
                />
            </View>
        </ScrollView>
        
    )
}

export default EmblemRanking