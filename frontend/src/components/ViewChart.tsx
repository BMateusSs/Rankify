import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Props {
    color: string,
    onPress: () => void;
}

const ViewChart: React.FC<Props> = ({color, onPress}) => {
    return(
        <View style={[styles.container]}>
            <TouchableOpacity
            style={[styles.button, {backgroundColor: color}]}
            onPress={onPress}
            >
                <Text style={styles.text}>VER CHART</Text>
                <Text style={styles.seta}>{'>'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ViewChart;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 30,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    button: {
        flexDirection: 'row',
        width: 120,
        height: 30,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'NeueHaasDisplayBold',
        color: '#fff',
        marginEnd: 10
    },
    seta: {
        color: '#FFFF00',
        fontWeight: 'bold'
    }
})