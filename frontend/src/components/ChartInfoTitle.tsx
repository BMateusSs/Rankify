import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

type Props = {
    title: string
}
const ChartInfoTitle: React.FC<Props> = ({title}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            <View style={styles.line} />
        </View>
    );
};

const { width } = Dimensions.get('window');
const TEXT_WIDTH = 120;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginStart: 12,
        marginVertical: 10,
    },
    text: {
        fontSize: 20,
        color: 'blue',
        fontFamily: 'NeueHaasDisplayBold',
        marginRight: 10, 
    },
    line: {
        flex: 1, 
        height: 2, 
        backgroundColor: 'blue',
        borderRadius: 1, 
    },
});

export default ChartInfoTitle;