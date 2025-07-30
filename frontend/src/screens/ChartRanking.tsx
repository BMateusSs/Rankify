import React from 'react'
import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../app/App'
import { useInfoFetch } from '../hooks/useInfoFetch'
import { HighestPlaycount } from '../types/types'
import { API_URLS } from '../constants/api'
import { fonts } from '../style'

type ChartRankingRoute = RouteProp<RootStackParamList, 'ChartRanking'>

type Props = {
  route: ChartRankingRoute
}

const ChartRanking: React.FC<Props> = ({ route }) => {
  const { metric, type } = route.params

  const { data, loading, error } = useInfoFetch<HighestPlaycount[]>(
    API_URLS.GET_HIGHEST_PLAYCOUNT,
    metric,
    type
  )

  if (loading) return <Text style={styles.loadingText}>Carregando dados...</Text>
  if (error) return <Text style={styles.errorText}>Ocorreu um erro ao buscar os dados.</Text>
  if (!data || data.length === 0) return <Text style={styles.noDataText}>Nenhum álbum encontrado.</Text>

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* The 'Album' header needs to match the combined width of image + textContainer */}
      <Text style={[styles.headerText, styles.albumHeader]}>Álbum</Text>
      <Text style={[styles.headerText, styles.playcountHeader]}>Playcount</Text>
      <Text style={[styles.headerText, styles.rankPosHeader]}>Rank Pos.</Text>
      <Text style={[styles.headerText, styles.weeksHeader]}>Weeks</Text>
    </View>
  )

  const renderItem = ({ item, index }: { item: HighestPlaycount; index: number }) => (
    <View style={styles.itemContainer}>
      {/* Image and the overall infoContainer wrapper */}
      <View style={styles.leftContentWrapper}>
        <Image source={{ uri: item.cover }} style={styles.image} />
        <View style={styles.infoContainer}>
          {/* Top view: Album Name and Artist */}
          <View style={styles.textDetailsContainer}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <Text style={styles.artistName} numberOfLines={1} ellipsizeMode="tail">{item.artist}</Text>
          </View>

          {/* Bottom view: Playcount, Rank Position, Weeks */}
          <View style={styles.dataRow}>
            <View style={styles.dataCell}>
              <Text style={styles.dataText}>{item.playcount}</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.dataText}>{item.rank_position}</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.dataText}>{item.week_number}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}-${item.artist}-${item.week_number}-${index}`}
      />
    </View>
  )
}

export default ChartRanking

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontFamily: fonts.mainFont,
    color: '#333',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontFamily: fonts.mainFont,
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontFamily: fonts.mainFont,
    color: '#666',
  },
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
    fontFamily: fonts.mainFont,
    fontSize: 14,
  },
  albumHeader: {
    flex: 2, 
    textAlign: 'left', 
  },
  playcountHeader: {
    flex: 1,
    textAlign: 'center',

  },
  rankPosHeader: {
    flex: 1,
    textAlign: 'center',
  },
  weeksHeader: {
    flex: 1,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  leftContentWrapper: {
    flexDirection: 'row',
    flex: 2, // This wrapper contains the image and the main infoContainer, matching 'Album' header flex
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 3,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1, // Allows the infoContainer to take available space next to the image
    justifyContent: 'center',
  },
  textDetailsContainer: {
    marginBottom: 4, // Spacing between album/artist and data
  },
  itemName: {
    fontFamily: fonts.mainFont,
    fontSize: 14,
    color: '#333',
  },
  artistName: {
    fontFamily: fonts.simpleFont,
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  dataRow: {
    flexDirection: 'row',
    // We want this row to span the remaining width that the image doesn't take up in the leftContentWrapper
    // And align its internal cells with the respective headers
    flex: 1, // Allow this row to fill available horizontal space within infoContainer
    justifyContent: 'space-between', // Distribute items evenly
    alignItems: 'center',
    paddingRight: 5, // Small padding to align with header right edge, if needed
  },
  dataCell: {
    flex: 1, // Each data cell takes equal space within the dataRow
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2, // Fine-tune internal spacing for data values
  },
  dataText: {
    fontFamily: fonts.simpleFont,
    fontSize: 13,
    color: '#444',
  },
})