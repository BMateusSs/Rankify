import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const ButtonAlbum: React.FC = () => {
    return(
        <View>
            <TouchableOpacity
            style={styles.button}
            >
                <FontAwesome6 name='record-vinyl' size={24} color='#fff'/>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonAlbum;

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: '#1DB954',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    }
})