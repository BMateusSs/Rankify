import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
    metric: string,
    type: string
}

const GetTitle: React.FC<Props> = ({metric, type}) => {
    const getTitle = () => {
        if (metric === 'highest_playcount'){
            if (type === 'artist'){
                return <Text style={styles.title}>Maior Número de Reproduções Artista</Text>
            }else if (type === 'album'){
                return <Text style={styles.title}>Maior Número de Reproduções Album</Text>
            }else {
                return <Text style={styles.title}>Maior Número de Reproduções Músicas</Text>
            }
        } else if (metric === 'most_weeks_at_1'){
            if (type === 'artist'){
                return <Text style={styles.title}>Artistas Com Mais Semanas em #1</Text>
            }else if (type === 'album'){
                return <Text style={styles.title}>Álbuns Com Mais Semanas em #1</Text>
            }else {
                return <Text style={styles.title}>Músicas Com Mais Semanas em #1</Text>
            }
            
        } else if (metric === 'highest_debut'){
            if (type === 'artist'){
                return <Text style={styles.title}>Artistas Com Maiores Estreias</Text>
            }else if (type === 'album'){
                return <Text style={styles.title}>Álbuns Com Maiores Estreias</Text>
            }else {
                return <Text style={styles.title}>Músicas Com Maiores Estreias</Text>
            }
        } else if (metric === 'most_tracks_debuting_at_1'){
            return <Text style={styles.title}>Artistas Com Mais Músicas Que Estrearam Em #1</Text>
        }else if (metric === 'most_albums_debuting_at_1'){
            return <Text style={styles.title}>Artistas Com Mais Álbuns Que Estrearam Em #1</Text>
        }else if (metric === 'most_distinct_tracks_at_1'){
            return <Text style={styles.title}>Artistas Com Mais Músicas Em #1</Text>
        }else if (metric === 'most_distinct_albums_at_1'){
            return <Text style={styles.title}>Artistas Com Mais Álbuns Em #1</Text>
        }
        
        else{return <Text>{metric}</Text>}
    }
    return(
        <View>
            {getTitle()}
        </View>
    )
}

export default GetTitle;
const styles = StyleSheet.create({
    title: {
        color: '#fff',
        fontFamily: 'NeueHaasDisplayBold',
        textAlign: 'center'
    }
})