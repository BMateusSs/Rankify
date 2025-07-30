import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Album, AlbumChartData, Artist, Track } from '../types/types';
import { MainTabs } from '../navigation/Tabs';
import TopAlbums from '../screens/TopAlbuns';
import TopTracks from '../screens/TopTracks';
import TopArtists from '../screens/TopArtists';
import ItemInfos from '../screens/ItemInfos';
import ChartRanking from '../screens/ChartRanking';
import { fonts } from '../style';

export type RootStackParamList = {
  MainTabs: undefined;
  TopAlbums: { data: Album[] };
  TopTracks: { data: Track[] };
  TopArtists: { data: Artist[] };
  ItemInfos: { artist: string, album: string, type: string}
  ChartRanking: {metric: string, type: string}
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    [fonts.mainFont]: require('../../assets/fonts/NeueHaasDisplayBold.ttf'),
    [fonts.simpleFont]: require('../../assets/fonts/NeueHaasDisplayXThin.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='MainTabs'>
        <Stack.Screen 
          name='MainTabs' 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name='TopAlbums' 
          component={TopAlbums}
          options={{ title: 'Top Álbuns' }}
        />
        <Stack.Screen 
          name='TopTracks' 
          component={TopTracks}
          options={{ title: 'Top Músicas' }}
        />
        <Stack.Screen 
          name='TopArtists' 
          component={TopArtists}
          options={{ title: 'Top Artistas' }}
        />
        <Stack.Screen 
          name='ItemInfos' 
          component={ItemInfos}
          options={{ title: 'Charts Info' }}
        />
        <Stack.Screen
        name='ChartRanking'
        component={ChartRanking}
        />
      </Stack.Navigator>
    </NavigationContainer>
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