import React from 'react'
import { View, TouchableOpacity, FlatList, Text, StyleSheet  } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../app/App'
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';

type TopTrackNavigation = NativeStackNavigationProp<RootStackParamList, 'TopTracks'>

interface Props {
    navigation:TopTrackNavigation
}

const ButtonTracks: React.FC = () => {
    return(
        <View>
            <TouchableOpacity
            
            style={styles.button}
            >
                <MaterialIcons name="music-note" size={24} color='#fff'/>
            

            </TouchableOpacity>
        </View>
    )
}

export default ButtonTracks;

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