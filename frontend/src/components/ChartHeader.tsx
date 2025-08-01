import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  backgroundColor: string;
}

const ChartHeader: React.FC<Props> = ({ backgroundColor }) => {
  return (
    <View style={[styles.headerContainer, { backgroundColor }]}>
      <View style={styles.headerEmpty1} />
      <View style={styles.headerEmpty2} />
      <View style={styles.headerColumn}>
        <Text style={styles.headerText}>Plays</Text>
      </View>
      <View style={styles.headerColumn}>
        <Text style={styles.headerText}>Semana{'\n'}anterior</Text>
      </View>
      <View style={styles.headerColumn}>
        <Text style={styles.headerText}>Pico</Text>
      </View>
      <View style={styles.headerColumn}>
        <Text style={styles.headerText}>Total de{'\n'}semanas</Text>
      </View>
      <View style={styles.headerEmpty3}/>
    </View>
  );
};

export default ChartHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  headerEmpty1: {
    flex: 1.5, // posição + variação
  },
  headerEmpty2: {
    width: 80, // capa
  },
  headerEmpty3: {
    flex: 2.2
  },
  headerColumn: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});
