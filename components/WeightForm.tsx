import Entypo from '@expo/vector-icons/Entypo';
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Excercise } from './ExcerciseList';

export function WeightForm(item: Excercise) {
    const [modalVisible, setModalVisible] = useState(false);
    const [numOfSets, setNumOfSets] = useState("");
    const [inputSets, setInputSets] = useState<Set[]>([]);
    
    interface Set {
        excerciseName: string;
        id: number;
        weight: string;
        setNum: string;
        reps: string,
        date: string;
    }

    const inputSetsTemp: Set[] = [];

    const db = useSQLiteContext();

    const handleNumOfSets = (num: string) => {
        try {
            if (isNaN(+num)) {
                throw new Error("Number of sets must be a number");
            }

            for (let i = 1; i<=+num; i++) {
                let tempSet: Set ={
                    excerciseName: item.excerciseName,
                    id: 0,
                    weight: "",
                    setNum: `${i}`,
                    reps: "",
                    date: ""
                }
                inputSetsTemp.push(tempSet);
            }
            setInputSets(inputSetsTemp);
        } catch (error) {
            Alert.alert("Error", (error as Error).message);   
        }
    }

    // const loadSets = async () => {
    //     try {
	// 		const results = await db.getAllAsync(`SELECT * FROM "${item.excerciseName}" GROUP BY date`)
    //         setSets(results as Set[]);
	// 	} catch (error) {
	// 		console.error("Database error", error);
	// 	}
    // }

    const handleSubmit = async () => {
        try {
            
            inputSets.forEach((set) => {
                if (!set.weight || !set.reps) {
                    throw new Error("All fields are required");
                }
                if (isNaN(+set.weight) || isNaN(+set.reps)) {
                    throw new Error("Weight must be a number");
                }
            })

            inputSets.forEach(async (set) => {
                await db.runAsync(
                    `INSERT INTO "${item.excerciseName}" (excerciseName, weight, setNum, reps, date) VALUES (?, ?, ?, ?, ?)`,
                    [set.excerciseName, set.weight, set.setNum, set.reps, Date()]
                );
            })
           

            Alert.alert("Success", "Excercise added successfully");
            setNumOfSets("");
        } catch (error) {
            Alert.alert("Error", (error as Error).message);
        }
    };
    
    return (
        <View style={styles.page}>
            <TouchableOpacity style={styles.excerciseCard} onPress={() => {
                setModalVisible(true);
            }}>
                <Text style={[styles.baseText, styles.cardHeader]}>
                    {item.excerciseName}
                </Text>
                <Text style={[styles.baseText, styles.cardText]}>
                    {`${item.weight}lbs`}
                </Text>
                <Text style={[styles.baseText, styles.cardFooter]}>
                    {item.muscle}
                </Text>
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed");
                    setModalVisible(!modalVisible);
                }}
                style={styles.page}
            >
                <ScrollView 
                        style={styles.modalScrollContainer}
                        horizontal={true} 
                        showsHorizontalScrollIndicator={true} 
                        contentContainerStyle={{columnGap: 100}}
                    >
                <View style={[styles.modalContainer, styles.firstCard]}>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => setModalVisible(false)}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        {item.excerciseName}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Number of Sets"
                        value={numOfSets}
                        onChangeText={(num) => {
                            setNumOfSets(num);
                            handleNumOfSets(num as string);
                        }}
                    />
                    <FlatList 
                        style={styles.setsListContainer}
				        showsVerticalScrollIndicator={false}
				        data={inputSets}
                        keyExtractor={(item) => `${item.setNum}`}
                        renderItem={({ item }) => (
                            <View style={styles.setContainer}>
                                <TextInput 
                                    style={[styles.setInput]}
                                    placeholder='Weight'
                                    value={`${item.weight}`}
                                    onChangeText={(text) => {
                                        setInputSets(inputSets.map(i => (i.setNum === item.setNum ? {...i, weight: text}:i)))
                                    }}
                                />
                                <TextInput 
                                    style={[styles.setInput]}
                                    placeholder='Reps'
                                    value={`${item.reps}`}
                                    onChangeText={(text) => {
                                        setInputSets(inputSets.map(i => (i.setNum === item.setNum ? {...i, reps: text}:i)))
                                    }}
                                />
                            </View>
                        )}
                    />
                    <TouchableOpacity
                        style={styles.addExcerciseButton}
                        onPress={async () =>  handleSubmit()}
                    >
                        <Text style={styles.baseText}>
                            Add Worked
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.modalContainer}>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => setModalVisible(false)}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        {item.excerciseName}
                    </Text>
                    {/* <TextInput
                        style={styles.input}
                        placeholder="Weight"
                        value={form.weight}
                        onChangeText={(text) => setForm({ ...form, weight: text })}
                    /> */}
                    <TouchableOpacity
                        style={styles.addExcerciseButton}
                        onPress={async () =>  handleSubmit()}
                    >
                        <Text style={styles.baseText}>
                            Add Worked
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.modalContainer, styles.lastCard]}>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => setModalVisible(false)}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        {item.excerciseName}
                    </Text>
                    {/* <TextInput
                        style={styles.input}
                        placeholder="Weight"
                        value={form.weight}
                        onChangeText={(text) => setForm({ ...form, weight: text })}
                    /> */}
                    <TouchableOpacity
                        style={styles.addExcerciseButton}
                        onPress={async () =>  handleSubmit()}
                    >
                        <Text style={styles.baseText}>
                            Add Worked
                        </Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        alignItems: "center",
        justifyContent: "center",
    },
    baseText: {
        color: "white",
        textAlign: 'center',
    },
    excerciseCard: {
		width: "100%",
		height: 120,
		borderColor: "darkgray",
		borderWidth: 1,
		borderRadius: 15,
		padding: 15,
	},
	cardHeader: {
		fontSize: 15,
		textAlign: "left",
	},
	cardText: {
		fontSize: 28,
		textAlign: "left",
		paddingTop: 8,
		paddingBottom: 8,
		fontWeight: "bold",
	},
	cardFooter: {
		color: "darkgray",
		fontSize: 12,
		textAlign: "left",
	},
    modalScrollContainer: {
        width: '100%',
    },
    modalContainer: {
        backgroundColor: "black",
        top: '25%',
        left: '0%',
        width: 350,
        height: '50%',
        borderWidth: 1,
        borderColor: "darkgray",
        borderRadius: 45,
        padding: 20,
    },
    modalClose: {
        position: 'absolute',
        color: "white",
        alignSelf: 'flex-end',  
        top: 20,
        right: 20,
    },
    input: {
        color: "white",
        borderWidth: 1,
        borderColor: "white",
        height: 55,
        fontSize: 20,
        marginBottom: 10,
    },
    addExcerciseButton: {
        backgroundColor: 'black',
        position: 'absolute',
        color: "white",
        width: '50%',
        height: 30,
        bottom: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 45,
        borderWidth: 1,
        borderColor: 'darkgray',
    },
    firstCard: {
        marginLeft: 20,
    },
    lastCard: {
        marginRight: 20,
    },
    setsListContainer: {
		width: "100%",
		height: "100%",
		borderColor: "darkgray",
	},
    setContainer: {
        width: "100%",
		height: 120,
		borderColor: "darkgray",
		borderWidth: 1,
		borderRadius: 15,
		padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 10,
        marginBottom: 15,
    },
    setInput: {
        color: 'white',
        width: "40%",
        height: 100,
        borderWidth: 1,
        borderColor: "white",
        fontSize: 25,
        textAlign: 'center',
    }
});
