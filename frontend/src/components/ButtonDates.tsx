import React, { useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { useFetch } from '../hooks/useFetch';
import { ValidWeeks } from '../types/types';
import { API_URLS } from '../constants/api';
import { fonts } from '../style';
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';

interface Props {
  setDate: (date: string) => void;
  color: string
}


const ButtonDates: React.FC<Props> = ({setDate, color}) => {
    const [visible, setVisible] = useState<boolean>(false);

    const {data, loading, error} = useFetch<ValidWeeks[]>(API_URLS.GET_WEEKS)

    const renderItem = ({item}:{item: ValidWeeks}) => {
        return(
            <View style={styles.itemContainer}>
                <TouchableOpacity
                onPress={() => {
                    setDate(item.start_date);
                    setVisible(false);
                    }}
                style={styles.pickerDate}>
                    <View style={styles.weekContainer}>
                        <Text style={[styles.weekText, {color: color}]}>Semana {item.week}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text>{item.start_date}</Text>
                        <Text> até </Text>
                        <Text>{item.end_date}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <View>
            <TouchableOpacity
            onPress={() => setVisible(true)}
            style={[styles.button, {backgroundColor: color}]}
            >
                <View >
                    <MaterialIcons name='calendar-month' size={24} color='#fff'/>

                </View>
            </TouchableOpacity>

            <Modal
            visible={visible}
            >

                <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
                showsVerticalScrollIndicator={false}
                >
                </FlatList>
            </Modal>
        </View>


    )
}

export default ButtonDates;

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    itemContainer: {
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        padding: 10
    },
    pickerDate: {
        width: '100%',
        alignItems: 'center'
    },
    weekContainer: {
        width: '100%',
        alignItems: 'center'
    },
    dateContainer: {
        flexDirection: 'row'
    },
    weekText: {
        fontFamily: fonts.mainFont,
        color: 'black'
    }
})