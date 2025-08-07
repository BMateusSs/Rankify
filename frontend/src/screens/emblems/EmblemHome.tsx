 import React from 'react'
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { API_URLS } from '../../constants/api'
import { useFetch } from '../../hooks/useFetch'
import { Emblems } from '../../types/types'
import HeaderCard from '../../components/HeaderCard'
import { FontAwesome6, FontAwesome } from '@expo/vector-icons'
import { fonts } from '../../style'
import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TabParamList } from '../../navigation/Tabs'
import { RootStackParamList } from '../../app/App'

type ChartsTabProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Emblemas'>,
  NativeStackNavigationProp<RootStackParamList>
>

type Props = {
  navigation: ChartsTabProps
}

const EmblemHome: React.FC<Props> = ({navigation}) => {
  const { data, loading, error } = useFetch<Emblems[]>(API_URLS.GET_MAX_ALBUMS_EMBLEMS)

  if (loading) {
    return <Text style={styles.loadingText}>Carregando...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Ocorreu um erro ao buscar os dados.</Text>;
  }

  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>Nenhum álbum com emblemas encontrado.</Text>;
  }

  const album = data[0]

  const formattedPontos = Number(album.total_pontos).toFixed(1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <HeaderCard
          color='blue'
          text='Ranking de Álbuns'
        />
        <Image
          source={{ uri: album.cover }}
          style={styles.albumCover}
        />
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesome6 name='ranking-star' size={20} color='#FFD700' />
            <Text style={styles.infoText}>#1</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome6 name='medal' size={20} color='#C0C0C0' />
            <Text style={styles.infoText}>{album.total_emblems}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name='star' size={20} color='#FFD700' />
            <Text style={styles.infoText}>{formattedPontos}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button}
      onPress={() => navigation.navigate('Ranking')}
      >
        <Text style={styles.buttonText}>Ver ranking completo</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 50,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Added a subtle background color for contrast
  },
  cardContainer: {
    width: 300,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8, // For Android shadow
    marginBottom: 20,
  },
  albumCover: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#333', // A dark background for the icons and text
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  infoItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: '#fff',
    fontFamily: fonts.mainFont,
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold', // Made the text bold for better readability
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.mainFont,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    fontFamily: fonts.mainFont,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    fontFamily: fonts.mainFont,
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    fontFamily: fonts.mainFont,
  },
});

export default EmblemHome