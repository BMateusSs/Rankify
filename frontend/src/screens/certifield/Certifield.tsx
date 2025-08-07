import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useFetch } from '../../hooks/useFetch';
import { API_URLS } from '../../constants/api';
import { AlbumChartData, ChartRunItem } from '../../types/types';
import ChartInfo from '../../components/ChartInfo';
import ChartRun from '../../components/ChartRun';
import ChartInfoTitle from '../../components/ChartInfoTitle';
import WeekAt from '../../components/WeekAt';
import ButtonDates from '../../components/ButtonDates';
import OverallScreen from '../charts/OverallScreen';

const Certified: React.FC = () => {

    return (
        <View style={styles.mainContainer}>
            <OverallScreen/>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#fff',
        marginTop: 45
    },
    topContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        alignItems: 'center',
    },
    bottomContainer: {
        backgroundColor: '#fff',
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    weeksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
    },
    cover: {
        width: 110,
        height: 110,
    },
    coverImage: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    },
    albumInfo: {
        flex: 1,
        marginLeft: 15,
    },
    albumName: {
        fontFamily: 'NeueHaasDisplayBold',
        color: '#fff',
        fontSize: 22,
        marginBottom: 5,
    },
    artistName: {
        fontFamily: 'NeueHaasDisplayXThin',
        color: '#fff',
        fontSize: 16,
    },
    chartInfo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    info: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 24,
    },
    weekStat: {
        alignItems: 'center',
    },
    weekNumber: {
        fontFamily: 'NeueHaasDisplayBold',
        fontSize: 18,
        color: '#333',
    },
    weekLabel: {
        fontFamily: 'NeueHaasDisplayXThin',
        fontSize: 12,
        color: '#666',
    },
});

export default Certified;
