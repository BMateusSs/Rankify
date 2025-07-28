import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

interface Props {
    rank_position: number,
    last_week: number,
    total_weeks: number
}

const GetVariation: React.FC<Props> = ({rank_position, last_week, total_weeks}) => {
    const variation = () => {
        if (last_week === 0){
            if (total_weeks === 1){
                return <View style={styles.new}><Text style={styles.newReentryText}>NEW</Text></View>
            }else{
                return <View style={styles.reentry}><Text style={styles.newReentryText}>RE</Text></View>
            } 
        } else{
            if (last_week > rank_position){
                return <View style={styles.up}><Text>↑</Text></View>
            }else if (last_week < rank_position){
                return <View style={styles.down}><Text>↓</Text></View>
            }else{
                return <View style={styles.same}><Text style={styles.text}>=</Text></View>
            }
        }
    }
    return(
        variation()
    )
}

export default GetVariation

const styles = StyleSheet.create({
    up: {
        width: 25,
        height: 25,
        borderRadius: 100,
        backgroundColor: '#00D4AA',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
     down: {
        width: 25,
        height: 25,
        borderRadius: 100,
        backgroundColor: '#FF6B6B',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reentry: {
        backgroundColor: '#F39C12',
        width: 35,
        height: 25,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    same: {
        width: 25,
        height: 25,
        borderRadius: 100,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    new: {
        backgroundColor: 'yellow',
        borderRadius: 6,
        width: 35,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold'
    },
    newReentryText: {
        fontSize: 10,
        fontFamily: 'NeueHaasDisplayBold'
    }
})