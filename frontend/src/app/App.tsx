import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from '../navigation/Tabs';
import ItemInfos from '../screens/charts/ItemInfos';
import ChartRanking from '../screens/charts/ChartRanking';
import EmblemRanking from '../screens/emblems/EmblemRanking';
import { fonts } from '../style';
import TopItems from '../screens/charts/TopItems';

export type RootStackParamList = {
  MainTabs: undefined;
  TopItems: {type: string};
  ItemInfos: { artist: string, album: string, type: string}
  ChartRanking: {metric: string, type: string},
  Ranking: undefined
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
          name='TopItems' 
          component={TopItems}
          options={{ title: 'Top Álbuns' }}
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
        <Stack.Screen
        name='Ranking'
        component={EmblemRanking}
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