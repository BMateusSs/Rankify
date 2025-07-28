import React from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import { ChartRunItem, AlbumChartData } from '../types/types'

type Props = {
    albumData: AlbumChartData,
    peak_position: number
}

const ChartRun: React.FC<Props> = ({albumData, peak_position}) => {
    const renderItem = ({item}: {item: ChartRunItem}) => {
        const isTop = item.rank_position === 1
        const isPeak = item.rank_position === peak_position
        const colorNumb = isTop? 'gold' : '#000'
        const colorBorder = isPeak? '#1DB954' : '#d2d2d2'

        return(
            <View style={{width: 30, height: 30, backgroundColor: '#fff', margin: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colorBorder}}>
                <Text style={{color: colorNumb}}>{item.rank_position}</Text>
            </View>
        )
    }

    return(
            <FlatList<ChartRunItem>
            data={albumData.chart_run}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.start_date}-${item.rank_position}`}
            numColumns={10}
            scrollEnabled={false}
        />
    )
}

export default ChartRun;