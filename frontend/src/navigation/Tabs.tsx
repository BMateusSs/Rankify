import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChartsScreen from "../screens/charts/ChartsScreen";
import Home from "../screens/home/Home";
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/App";
import Certifield from "../screens/certifield/Certifield";
import OverallScreen from "../screens/charts/OverallScreen";
import EmblemHome from "../screens/emblems/EmblemHome";

export type TabParamList = {
    Home: undefined,
    Charts: undefined,
    Certificados: undefined,
    Geral: undefined,
    Emblemas: undefined
}

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Tab = createBottomTabNavigator<TabParamList>();

export function MainTabs(){
    return(
        <Tab.Navigator
        screenOptions={{
            tabBarActiveTintColor: 'blue',
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#fff'
            }
        }}
        >   
            <Tab.Screen 
            name="Home" 
            component={Home}
            options={{
                tabBarIcon: () => (
                    <Ionicons name="home" color='blue' size={24}/>
                )
            }}/>

            <Tab.Screen 
            name="Geral" 
            component={OverallScreen}
            options={{
                tabBarIcon: () => (
                    <Ionicons name="musical-notes" color='blue' size={24}/>
                ),
                
            }}/>
            <Tab.Screen 
            name='Charts' 
            component={ChartsScreen}
            options={{
                tabBarIcon: () => (
                    <Ionicons name="stats-chart" color='blue' size={24}/>
                )
            }}
            />
            <Tab.Screen
            name='Certificados'
            component={Certifield}
            options={{
                tabBarIcon: () => (
                    <Ionicons name="disc" color='blue' size={24}/>
                )
            }}
            />

            <Tab.Screen
            name='Emblemas'
            component={EmblemHome}
            options={{
                tabBarIcon: () => (
                    <Ionicons name="disc" color='blue' size={24}/>
                )
            }}
            />

        </Tab.Navigator>
    );
}