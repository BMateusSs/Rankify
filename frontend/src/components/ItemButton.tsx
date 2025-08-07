import { FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Props {
    icon: string,
    color: string,
    onPress: () => void
}

const ItemButton: React.FC<Props> = ({onPress, icon, color}) => {
    return(
        <View>
            <TouchableOpacity
            style={[styles.button, {backgroundColor: color}]}
            onPress={onPress}
            >
                
                <MaterialCommunityIcons name={icon} size={24} color='#fff'/>
            </TouchableOpacity>
        </View>
    )
}

export default ItemButton;

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
})