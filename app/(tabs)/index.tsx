import React, { useState } from 'react';
import { Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
    const [text, setText] = useState('');
    return (
        <SafeAreaView style={styles.screen} onStartShouldSetResponder={() => {
                  Keyboard.dismiss();
                  return false;
                }}>
            <View style={styles.pageHeaderContainer}>
                <Text style={[styles.baseText, styles.pageHeaderText]}>
                    My Activity
                </Text>
            </View>
            <ScrollView 
                style={styles.homeCardContainer} 
                horizontal={true} 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{columnGap: 1}} 
                >
                
                <View style={styles.homeCard}>
                    <Text style={[styles.baseText, styles.cardHeader]}>
                        Days In Gym
                    </Text>
                    <TextInput 
                        style={[styles.baseText, styles.cardText]}
                        placeholder="Type Here!"
                        onChangeText={newText => setText(newText)}
                        defaultValue={text}
                        >
                    </TextInput>
                    <Text style={[styles.baseText, styles.cardFooter]}>
                        The grind never stops
                    </Text>
                </View>
                <View style={styles.homeCard}>
                    <Text style={[styles.baseText, styles.cardHeader]}>
                        Weight
                    </Text>
                    <Text style={[styles.baseText, styles.cardText]}>
                        165lbs
                    </Text>
                    <Text style={[styles.baseText, styles.cardFooter]}>
                        Don't be victim weight
                    </Text>
                </View>
                <View style={[styles.homeCard, styles.lastCard]}>
                    <Text style={[styles.baseText, styles.cardHeader]}>
                        Girls
                    </Text>
                    <Text style={[styles.baseText, styles.cardText]}>
                        0
                    </Text>
                    <Text style={[styles.baseText, styles.cardFooter]}>
                        I'm scared of them
                    </Text>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        height: '100%',
        width: '100%',
    },
    baseText: {
        color: 'white',
    },
    pageHeaderContainer: {
        height: 100,
        justifyContent: 'center'
    },
    pageHeaderText: {
        paddingTop: StatusBar.currentHeight,
        textAlign: 'center',
        fontSize: 25
    },
    homeCardContainer: {
        width: '100%',
        height: 120,
        // borderWidth: 1,
        // borderColor: 'white',
        // flexDirection: 'row',
    },
    homeCard: {
        width: 220,
        height: 120,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 15,
        marginLeft: 20,
        padding: 15,
    },
    lastCard: {
        marginRight: 20,
    },
    cardHeader: {
        fontSize: 15,
        textAlign: 'left',
    },
    cardText: {
        fontSize: 28,
        textAlign: 'left',
        paddingTop: 8,
        paddingBottom: 8,
        fontWeight: 'bold',
    },
    cardFooter: {
        color: 'darkgray',
        fontSize: 12,
        textAlign: 'left',
    },
})