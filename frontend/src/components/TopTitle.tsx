import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { fonts } from '../style'

interface Props {
    text: string,
    color: string
}

const TopTitle: React.FC<Props> = ({text, color}) => {
    return(
        <View style={{width: '100%'}}>
            <View style={{backgroundColor: '#fff', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Text
                style={{fontFamily: fonts.mainFont, fontSize: 50, color: color}}
                >{text}</Text>
            </View>
        </View>
    )
}

export default TopTitle