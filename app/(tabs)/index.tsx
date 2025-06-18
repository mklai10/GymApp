import { UserWeightChart, Weights } from '@/components/UserWeightChart';
import { WeightCard } from '@/components/WeightCard';
import * as SQLite from "expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


export default function index() {
    const [daysInGym, setDaysInGym] = useState(0);
    const [dayWent, setDayWent] = useState(0);
    const [wentToday, setWentToday] = useState(false);
    const [weight, setWeight] = useState("0");
    const [weights, setWeights] = useState<Weights[]>([]);

    const retrieveData = async () => {
        try {
            const days = await AsyncStorage.getItem('daysInGym');
            if (days !== null) {
                setDaysInGym(+days);
            }
            const date = await AsyncStorage.getItem('dayWent');
            if (date !== null) {
                setDayWent(+date);
            }
            const went = await AsyncStorage.getItem('wentToday');
            if (went !== null) {
                setWentToday(went === "true");
            }
            const currentWeight = await AsyncStorage.getItem('weight');
            if (currentWeight !== null) {
                setWeight(currentWeight);
            }
        } catch (error) {
            console.log("data couldnt be retrieved")
        }
    };

    const setAndStoreData = async (date: number, went: boolean, days: number) => {
        try {
            await AsyncStorage.setItem(
                'daysInGym',
                days.toString(),
            );
            setDaysInGym(() => days);
            await AsyncStorage.setItem(
                'dayWent',
                date.toString(),
            );
            setDayWent(date);
            await AsyncStorage.setItem(
                'wentToday',
                went.toString(),
            );
            setWentToday(went);
        } catch (error) {
            console.log("data couldnt be stored");
        }
    };

    const loadWeights = async () => {
        const db = await SQLite.openDatabaseAsync('weightliftingDatabase.db');
        try {
            const results = await db.getAllAsync(`SELECT * FROM weight`);
            console.log(results);
			setWeights(results as Weights[]);
		} catch (error) {
			console.error("Database error", error);
		}
    }

    const checkWentToday = () => {
        const todaysDate = new Date();
        const currentDayWent = new Date(dayWent);
        if (todaysDate.getDate != currentDayWent.getDate || todaysDate.getMonth != currentDayWent.getMonth || todaysDate.getFullYear != currentDayWent.getFullYear) {
            setWentToday(false);
        }
    }

    useEffect(() => {
        retrieveData();
        checkWentToday();
        loadWeights();
    }, [])

    return (
        <SQLite.SQLiteProvider
            databaseName="weightliftingDatabase.db"
            onInit={async (db) => {
                // await db.execAsync(`
                //     DROP TABLE weight;
                // `);
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS weight (id INTEGER PRIMARY KEY AUTOINCREMENT, weight INTEGER NOT NULL, date INTEGER NOT NULL);
                    PRAGMA journal_mode = WAL;
                `);
                const results = await db.getAllAsync(`SELECT * FROM weight`);
                // console.log(results)
            }}
            options={{ useNewConnection: false }}
        >
            <SafeAreaView onStartShouldSetResponder={() => {
                //   Keyboard.dismiss();
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
                        <Text style={[styles.baseText, styles.cardText]}>
                            {daysInGym}
                        </Text>
                        <Text style={[styles.baseText, styles.cardFooter]}>
                            The grind never stops
                        </Text>
                    </View>
                    <WeightCard loadWeights={() => loadWeights()}/>
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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={wentToday ? styles.disabledButton : styles.button}
                        disabled={wentToday}
                        onPress={async () =>  setAndStoreData((new Date()).getTime(), true, daysInGym + 1)}
                    >
                        <Text style={wentToday ? styles.disabledButtonText : styles.buttonText}>
                            I Went To The Gym
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={!wentToday ? styles.disabledButton : styles.button}
                        disabled={!wentToday}
                        onPress={async () =>  setAndStoreData(0, false, daysInGym - 1)}
                    >
                        <Text style={!wentToday ? styles.disabledButtonText : styles.buttonText}>
                            Nevermind I Didn't
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.chartContainer}>
                    <UserWeightChart weights={weights}/>
                </View>
            </SafeAreaView>
        </SQLite.SQLiteProvider>

    );
}

const styles = StyleSheet.create({
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
    buttonContainer: {
        width: '100%',
        height: 120,
        justifyContent: 'center',
        flexDirection: 'row',
        columnGap: 10,
    },
    button: {
        color: "white",
        width: 170,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 45,
        borderWidth: 1,
        borderColor: 'white',
    },
    disabledButton: {
        color: "white",
        width: 170,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 45,
        borderWidth: 1,
        borderColor: 'darkgray',
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',  
    },
    disabledButtonText: {
      color: 'darkgray',
      textAlign: 'center',  
    },
    chartContainer: {
        width: '100%',
        // padding: 20,
        alignItems: 'center',
    },
})