import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import { API_URLS } from '../constants/api'
import { Chart } from '../types/types'
import { useFetch } from '../hooks/useFetch'
import GetTitle from '../components/GetTitle'
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from '../navigation/Tabs'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '../app/App'


type ChartsTabProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Charts'>,
  NativeStackNavigationProp<RootStackParamList>
>

type Props = {
  navigation: ChartsTabProps
}

const ChartsScreen: React.FC<Props> = ({navigation}) => {
    const {data, loading, error} = useFetch<Chart[]>(API_URLS.GET_CHART_INFOS)

    const renderItem = ({item}: {item: Chart}) => {
        const handleChartRanking = ({metric, type}: {metric: string, type: string}) => {
            navigation.navigate('ChartRanking', {metric, type})
        }
        const title = <GetTitle
                      metric={item.metric_type}
                      type={item.type}
                      />
        return(
            <TouchableOpacity
            onPress={() => handleChartRanking({metric: item.metric_type, type: item.type})}
            >
                <View style={styles.itemContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.cover}>
                        <Image
                        source={{uri: item.cover}}
                        style={{width: 200, height: 200}}
                        
                        />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.textInfo}>{item.name}</Text>
                        <Text style={styles.textInfo}>{item.secondary_name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            
        )
    }

    return(
        <View style={{backgroundColor: '#eee', alignItems: 'center', marginTop: 50}}>
            <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.metric_type}-${item.name}`}
            numColumns={2}
            />
        </View>
    )
}

export default ChartsScreen;

const styles = StyleSheet.create({
    itemContainer: {
        width: 200,
        height: 250,
        marginBottom: 10,
        marginEnd: 10
    },
    titleContainer: {
        backgroundColor: 'blue',
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#fff',
        fontFamily: 'NeueHaasDisplayBold',
        textAlign: 'center'
    },
    cover: {
        width: 200,
        height: 200
    },
    info: {
        alignItems: 'center',
        bottom: 50
        
    },
    textInfo: {
        color: '#fff'
    }
})