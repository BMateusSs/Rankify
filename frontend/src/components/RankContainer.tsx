import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../style';

const RankContainer: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.rankBarContainer}>
                <View style={[styles.rankBar, styles.secondPlace]}>
                    <Text style={styles.rankText}>2</Text>
                </View>

                <View style={[styles.rankBar, styles.firstPlace]}>
                    <Text style={styles.rankText}>1</Text>
                </View>

                <View style={[styles.rankBar, styles.thirdPlace]}>
                    <Text style={styles.rankText}>3</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    rankBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    rankBar: {
        width: 80,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    firstPlace: {
        height: 200,
        width: 100,
        backgroundColor: '#FFD700',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    secondPlace: {
        height: 150,
        width: 100,
        backgroundColor: '#C0C0C0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    thirdPlace: {
        height: 100,
        width: 100,
        backgroundColor: '#CD7F32',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rankText: {
        fontFamily: fonts.mainFont,
        fontSize: 35,
        marginBottom: 10,
        color: 'white',
    },
});

export default RankContainer;