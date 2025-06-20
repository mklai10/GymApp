import { useSQLiteContext } from "expo-sqlite";
import AsyncStorage from "expo-sqlite/kv-store";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserWeightForm } from "./UserWeightForm";

export function WeightCard({loadWeights} : {loadWeights: any}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [weight, setWeight] = useState("0");

    const db = useSQLiteContext();


    const storeWeight = async (weight: string) => {
        const date = (new Date()).getTime();
       
        try {
            await AsyncStorage.setItem(
                'weight',
                weight,
            );

            await db.runAsync(
                `INSERT INTO weight (weight, date) VALUES (?, ?)`,
                [weight, date]
            );
            setWeight(weight);
        } catch (error) {
            console.log("weight couldnt be stored");
        } finally {
            loadWeights();
        }
    }

    const retrieveWeight = async () => {
        try {
            const currentWeight = await AsyncStorage.getItem('weight');
            if (currentWeight !== null) {
                setWeight(currentWeight);
            }
        } catch (error) {
             console.log("weight data couldnt be retrieved");
        }
    }

    useEffect(() => {
        retrieveWeight();
    },[]);

    return (
        <View>
            <TouchableOpacity style={styles.homeCard} onPress={() => setModalVisible(true)}>
                <Text style={[styles.baseText, styles.cardHeader]}>
                    Weight
                </Text>
                <Text style={[styles.baseText, styles.cardText]}>
                    {weight}lbs
                </Text>
                <Text style={[styles.baseText, styles.cardFooter]}>
                    Don't be victim weight
                </Text>
            </TouchableOpacity>
            <UserWeightForm modalVisible={modalVisible} onCloseModal={() => setModalVisible(false)} onSubmit={(weight: string) => {storeWeight(weight)}}/>
        </View>
        
    )
}

const styles = StyleSheet.create({
    baseText: {
        color: 'white',
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
});