import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { API_URLS } from '../constants/api';
import { useFetch } from '../hooks/useFetch';
import { Emblems } from '../types/types';
import { fonts } from '../style';

const { width } = Dimensions.get('window');
const SPACING = 6;
const numColumns = 3;
const cardWidth = (width - SPACING * (numColumns + 1)) / 3.2;

type Props = {
    description: string,
    title: string,
    url: string
} 

const GetEmblems: React.FC<Props> = ({description, title, url}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { data, loading, error } = useFetch<Emblems[]>(url);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Falha ao carregar os emblemas. Por favor, tente novamente.
        </Text>
      </View>
    );
  }

  const renderEmblemItem = ({ item }: { item: Emblems }) => {
    return (
      <View style={styles.emblemCard}>
        <Image
          source={{ uri: item.cover }}
          style={styles.emblemImage}
          accessibilityLabel={`Capa da música ${item.name}`}
        />
        <View style={styles.emblemTextContent}>
          <Text style={styles.emblemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.emblemArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <View style={styles.emblemDateRow}>
            <Text style={styles.emblemDateLabel}>Concedido:</Text>
            <Text style={styles.emblemDateValue}>{item.date}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContentCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => setIsVisible(!isVisible)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {isVisible ? '-' : '+'}
            </Text>
          </TouchableOpacity>
        </View>

        {isVisible && (
          <View style={styles.itemsContainer}>
            <Text style={styles.descriptionText}>
              {description}
            </Text>

            <FlatList
            data={data}
            renderItem={renderEmblemItem}
            keyExtractor={(item, index) => `${item.name}-${item.artist}-${index}`}
            numColumns={numColumns}
            contentContainerStyle={styles.flatListContent}
            scrollEnabled={false}
            />
          </View>
        )}

      </View>
    </View>
  );
};

export default GetEmblems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e3f2fd',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
    fontFamily: fonts.mainFont,
  },
  mainContentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: SPACING,
    marginTop: SPACING,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: SPACING,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  headerText: {
    flex: 1,
    fontFamily: fonts.mainFont,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 15,
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  itemsContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    marginBottom: 0
  },
  descriptionText: {
    fontFamily: fonts.simpleFont,
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    textAlign: 'center'
  },
  flatListContent: {
    paddingHorizontal: SPACING / 2, // Espaçamento interno ajustado
  },
  emblemCard: {
    width: cardWidth,
    margin: SPACING / 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emblemImage: {
    width: '100%',
    height: cardWidth,
  },
  emblemTextContent: {
    padding: SPACING / 2,
    alignItems: 'center',
  },
  emblemName: {
    fontFamily: fonts.mainFont,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  emblemArtist: {
    fontFamily: fonts.simpleFont,
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
  },
  emblemDateRow: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  emblemDateLabel: {
    fontFamily: fonts.simpleFont,
    fontSize: 8,
    color: '#999',
  },
  emblemDateValue: {
    fontFamily: fonts.simpleFont,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 4,
  },
});