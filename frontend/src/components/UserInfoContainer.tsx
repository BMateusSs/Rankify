import React from 'react'
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native'
import { User } from '../types/types'
import { useFetch } from '../hooks/useFetch'
import { API_URLS } from '../constants/api'

interface Props {
    color: string
}

const UserInfoContainer: React.FC<Props> = ({color}) => {
    const {data, loading, error} = useFetch<User>(API_URLS.GET_USER_INFOS)

    return(
        <View style={styles.mainContainer}>
            <View style={[styles.topContainer, {backgroundColor: color}]}>
                <View style={styles.cover}>
                    <Image
                    source={{uri: data?.image}}
                    style={{width: 110, height: 110}}
                    />
                </View>
                <View style={styles.albumArtist}>
                    <Text style={styles.nameText}>{data?.name}</Text>
                </View>
                <View style={styles.rank}>
                    <Text style={styles.rankText}>{data?.playcount}</Text>
                    <Text style={[styles.label, {color: '#fff'}]}>REPRODUÇÕES</Text>
                </View>
                
                
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.chartInfo}>
                    <Text style={styles.label}>SEMANAS</Text>
                    <Text style={styles.info}>{data?.total_weeks}</Text>
                </View>
                <View style={styles.chartInfo}>
                    <Text style={styles.label}>ARTISTAS</Text>
                    <Text style={styles.info}>{data?.artist_numbers}</Text>
                </View>
                <View style={styles.chartInfo}>
                    <Text style={styles.label}>ÁLBUNS</Text>
                    <Text style={styles.info}>{data?.album_numbers}</Text>
                </View>
                <View style={styles.chartInfo}>
                    <Text style={styles.label}>MÚSICAS</Text>
                    <Text style={styles.info}>{data?.track_numbers}</Text>
                </View>
            </View>
        </View>
    )
}

export default UserInfoContainer;

const styles = StyleSheet.create({
    mainContainer: {
        
        width: '100%',
        marginBottom: 20
    },
    topContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        backgroundColor: '#fff',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rank: {
        flex: 2,
        justifyContent: 'center',
        marginStart: 10,
        alignItems: 'center'
    },
    albumArtist: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cover: {
        width: 110,
        height: 110
        
    },
    rankText: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 50,
        color: '#fff'
    },
    nameText: {
        fontFamily: 'NeueHaasDisplayBold',
        color: '#fff',
        fontSize: 30
    },
    artistText: {
        fontFamily: 'NeueHaasDisplayXThin',
        color: '#fff'
    },
    chartInfo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 8
    },
    info: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 30
    }
})