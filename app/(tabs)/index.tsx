import { DaysController } from '@/components/DaysController';
import DimensionsProvider, { useDimensions } from '@/components/DimensionsProvider';
import { UserWeightChart, Weights } from '@/components/UserWeightChart';
import * as SQLite from "expo-sqlite";
import React, { memo, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';


export default function index() {
    const [weights, setWeights] = useState<Weights[]>([]);

    const loadWeights = async () => {
        const db = await SQLite.openDatabaseAsync('weightliftingDatabase.db');
        try {
            const results = await db.getAllAsync(`SELECT * FROM weight`);
            // console.log(results);
			setWeights(results as Weights[]);
		} catch (error) {
			console.error("Database error", error);
		}
    }

    useEffect(() => {
        loadWeights();
    }, [])

    return (
        <DimensionsProvider>
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
            {/* <SafeAreaView onStartShouldSetResponder={() => {
                //   Keyboard.dismiss();
                  return false;
            }}>
                <View style={styles.pageHeaderContainer}>
                    <Text style={[styles.baseText, styles.pageHeaderText]}>
                        My Activity
                    </Text>
                </View>
                <DaysController onWeightUpdate={() => loadWeights()}/>
                <View style={styles.chartContainer}>
                    <UserWeightChart weights={weights}/>
                </View>
            </SafeAreaView> */}
            <FrontPage weights={weights} onLoad={() => loadWeights()}/>
        </SQLite.SQLiteProvider>
        </DimensionsProvider>
    );
}

const FrontPage = memo(function FrontPage({weights, onLoad}:{weights:Weights[], onLoad:any}) {
    const { SafeTopMargin } = useDimensions();

    return (
        <View style={{paddingTop: SafeTopMargin}}>
            <View style={styles.pageHeaderContainer}>
                <Text style={[styles.baseText, styles.pageHeaderText]}>
                    My Activity
                </Text>
            </View>
            <DaysController onWeightUpdate={() => onLoad()}/>
            <View style={styles.chartContainer}>
                <UserWeightChart weights={weights}/>
            </View>
        </View>
    )
})

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