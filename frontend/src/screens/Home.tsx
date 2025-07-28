import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import TopHome from '../components/TopHome';
import { useFonts } from 'expo-font';
import TopTrackHome from '../components/TopTrackHome';
import TopArtistHome from '../components/TopArtistHome';
import { RootStackParamList } from '../app/App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import UserInfoContainer from '../components/UserInfoContainer';
import { HomeScreenProps } from '../navigation/Tabs';

export default function Home({navigation}: HomeScreenProps) {
  
  return (
    <ScrollView style={{flex:1}}>
      <View style={styles.container}>
        <UserInfoContainer
        color='blue'
        />
        <TopArtistHome
        navigation={navigation}
        />
        <TopHome
        navigation={navigation}
        />
        <TopTrackHome
        navigation={navigation}
        />
        
      </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
