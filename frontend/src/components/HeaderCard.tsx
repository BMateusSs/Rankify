import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { fonts } from '../style'

type Props = {
    color: string,
    text: string,

}

const HeaderCard: React.FC<Props> = ({color, text}) => {
    return(
        <View style={{width: '100%', height: 50, backgroundColor: color}}>
            <Text style={{textAlign: 'center', color: '#fff', fontFamily: fonts.mainFont}}>{text}</Text>
        </View>
    )
}

export default HeaderCard;