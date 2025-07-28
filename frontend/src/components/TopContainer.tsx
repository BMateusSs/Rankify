import React from 'react'
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native'
import { Album, Track, Artist } from '../types/types'

interface Props {
    album: Album | Track | Artist,
    color: string
}

const TopContainer: React.FC<Props> = ({album, color}) => {
    const isNew = album.last_week === 0
    const last_week = isNew? '-' : album.last_week
    return(
        <View style={styles.mainContainer}>
            <View style={[styles.topContainer, {backgroundColor: color}]}>
                <View style={styles.rank}>
                    <Text style={styles.rankText}>{album.rank_position}</Text>
                </View>
                <View style={styles.albumArtist}>
                    <Text style={styles.nameText}>{album.name}</Text>
                    <Text style={styles.artistText}>{album.artist}</Text>
                </View>
                <View style={styles.cover}>
                    <Image
                    source={{uri: album.cover}}
                    style={{width: 110, height: 110}}
                    />
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.chartInfo}>
                    <Text style={styles.label}>SEMANA PASSADA</Text>
                    <Text style={styles.info}>{last_week}</Text>
                </View>
                <View style={styles.chartInfo}>
                    <Text style={styles.label}>SEMANAS NO 1</Text>
                    <Text style={styles.info}>{album.weeks_on_top}</Text>
                </View>
                <View style={styles.chartInfo}>
                    <Text style={styles.label}>TOTAL DE SEMANAS</Text>
                    <Text style={styles.info}>{album.total_weeks}</Text>
                </View>
            </View>
        </View>
    )
}

export default TopContainer;

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
        flex: 1,
        justifyContent: 'center',
        marginStart: 10
    },
    albumArtist: {
        flex: 2,
        justifyContent: 'center'
    },
    cover: {
        width: 110,
        height: 110
        
    },
    rankText: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 90,
        color: '#fff'
    },
    nameText: {
        fontFamily: 'NeueHaasDisplayBold',
        color: '#fff'
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