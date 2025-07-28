import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

interface Props {
    color: string,
    text: string
}

const HomeHeader: React.FC<Props> = ({color, text}) => {
    return(
        <View style={{width: '100%', height: 50, backgroundColor: color, justifyContent: 'center'}}>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

export default HomeHeader;

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginStart: 10,
        fontFamily: 'NeueHaasDisplayBold'
    }
})