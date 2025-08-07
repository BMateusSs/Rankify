import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { fonts } from '../style'

type Props = {
    label: string,
    value: number
}

const WeekAt: React.FC<Props> = ({label, value}) => {
    return(
        <View style={styles.weekStat}>
            <Text style={styles.weekNumber}>{value}</Text>
            <Text style={styles.weekLabel}>{label}</Text>
        </View>
    )
}

export default WeekAt;

const styles = StyleSheet.create({
    weekNumber: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 30
    },
    weekLabel: {
        fontFamily: fonts.simpleFont,
        fontSize: 18,
        color: 'blue'
    },
    weekStat: {
        alignItems: 'center',
    }
})