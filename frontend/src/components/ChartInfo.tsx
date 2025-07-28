import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
    label: string | number,
    value: string | number
}

const ChartInfo: React.FC<Props> = ({label, value}) => {
    return(
        <View style={styles.chartInfo}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.info}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    chartInfo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    info: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 24,
    },
});

export default ChartInfo;
