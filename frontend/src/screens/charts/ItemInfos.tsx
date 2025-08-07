import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { useFetch } from '../../hooks/useFetch';
import { API_URLS } from '../../constants/api';
import { AlbumChartData, artistData, ChartRunItem } from '../../types/types';
import ChartInfo from '../../components/ChartInfo';
import ChartRun from '../../components/ChartRun';
import ChartInfoTitle from '../../components/ChartInfoTitle';
import WeekAt from '../../components/WeekAt';
import { useInfoFetch } from '../../hooks/useInfoFetch';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../app/App';
import ArtistData from '../../components/ArtistData';
import Accordion from '../../components/Accordion';

type ItemInfosRouteProp = RouteProp<RootStackParamList, 'ItemInfos'>;

type Props = {
    route: ItemInfosRouteProp
};

const ItemInfos: React.FC<Props> = ({route}) => {
    const { artist, album, type} = route.params

    let url: string | null = null

    if (type == 'album'){
        url = API_URLS.GET_CHARTS_DATA
    } else if (type == 'track'){
        url = API_URLS.GET_TRACK_CHART_DATA
    } else{
        url = API_URLS.GET_ARTIST_CHART_DATA
    }

    if (url === null) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Tipo de item desconhecido: {type}</Text>
                <Text style={styles.errorText}>Não foi possível carregar as informações.</Text>
            </View>
        );
    }

    const {data, loading, error} = useInfoFetch<AlbumChartData[]>(url, artist, album)
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erro ao carregar dados: {error}</Text>
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text>Nenhum dado disponível</Text>
            </View>
        );
    }

    const albumData = data[0];
    const historyLabel = `Histórico de ${album}`
    const albumLabel = `Álbuns de ${album}`
    const trackyLabel = `Músicas de ${album}`

    return (
         <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.mainContainer}>
                {/* Cabeçalho com capa e informações básicas */}
                <View style={[styles.topContainer, { backgroundColor: 'blue' }]}>
                    <View style={styles.cover}>
                        <Image
                            source={{ uri: albumData.cover }}
                            style={styles.coverImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.albumInfo}>
                        <Text style={styles.albumName}>{albumData.name}</Text>
                        <Text style={styles.artistName}>{albumData.artist}</Text>
                    </View>
                </View>

                {/* Estatísticas do álbum */}
                <View style={styles.bottomContainer}>
                    <ChartInfo
                    label='ESTREIA'
                    value={formatDate(albumData.debut_date)}
                    />
                    
                    <ChartInfo
                    label='PEAK'
                    value={albumData.peak_position}
                    />
                
                    <ChartInfo
                    label='SEMANAS'
                    value={albumData.total_weeks}
                    />
                </View>
                
                <Accordion title={historyLabel} initiallyVisible>
                    <ChartInfoTitle
                    title='Semanas no'
                    />
                    <View style={styles.weeksContainer}>
                    
                    <WeekAt
                    label='No #1'
                    value={albumData.weeks_at_1}
                    />

                    <WeekAt
                    label='Top 3'
                    value={albumData.weeks_at_3}
                    />

                    <WeekAt
                    label='Top 5'
                    value={albumData.weeks_at_5}
                    />

                    <WeekAt
                    label='Top 10'
                    value={albumData.weeks_at_10}
                    />
                </View>
                <ChartInfoTitle
                    title='Chart Run'
                    />
                    <ChartRun
                    albumData={albumData}
                    peak_position={albumData.peak_position}
                    />
                </Accordion>

                {type === 'artist' && (
                    <Accordion
                    title={albumLabel}
                    initiallyVisible
                    >
                        <ArtistData
                    album={album}
                    type='albums'
                    />
                    </Accordion>
                    
                    
                )}
                {type === 'artist' && (
                    <Accordion
                    title={trackyLabel}
                    initiallyVisible
                    >
                    <ArtistData
                    album={album}
                    type='tracks'
                    />
                    </Accordion>
                    
                    
                )}
            </View>
        </ScrollView>
        
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
    paddingBottom: 40, // evita corte no fim da tela
    backgroundColor: '#fff',
},

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
        flex: 1,
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

export default ItemInfos;
