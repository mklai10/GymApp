import Entypo from '@expo/vector-icons/Entypo';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MyChart } from './Chart';
import { Excercise } from './ExcerciseList';

export interface Set {
    excerciseName: string;
    id: number;
    weight: string;
    setNum: string;
    reps: string,
    day: number;
    month: number;
    year: number;
}

// export function WeightForm({item, excercises}:{item:Excercise, excercises:Excercise[]}) {
// export function WeightForm({item, onDeleteExcercise}:{item:Excercise, onDeleteExcercise:any}) {
export function WeightForm({item, modalVisible, onCloseModal} : {item:Excercise, modalVisible:boolean, onCloseModal:any}) {
    const [numOfSets, setNumOfSets] = useState("");
    const [inputSets, setInputSets] = useState<Set[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [workouts, setWorkouts] = useState<Set[]>([]);

    const inputSetsTemp: Set[] = [];

    const db = useSQLiteContext();

    const loadWorkouts = async () => {
        try {
			setIsLoading(true);
            const results = await db.getAllAsync(`SELECT * FROM workouts WHERE excerciseName = $value AND month = 0`, {$value: item.excerciseName});
			// const results = await db.getAllAsync(`SELECT * FROM workouts WHERE excerciseName = $value ORDER BY year, month, day, setNUM ASC`, {$value: item.excerciseName});
            // const results = await db.getAllAsync(`SELECT * FROM workouts`);
            console.log(results);
			setWorkouts(results as Set[]);
		} catch (error) {
			console.error("Database error", error);
		} finally {
			setIsLoading(false);
		}
    }

    useEffect(() => {
		loadWorkouts();
	}, []);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

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
                    day: 0,
                    month: 0,
                    year: 0,
                }
                inputSetsTemp.push(tempSet);
            }
            setInputSets(inputSetsTemp);
        } catch (error) {
            Alert.alert("Error", (error as Error).message);   
        }
    }

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
                const date = new Date();
                const newDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
                await db.runAsync(
                    `INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [set.excerciseName, set.weight, set.setNum, set.reps, date.getDate(), date.getMonth() + 1, date.getFullYear()]
                );
            })
           

            Alert.alert("Success", "Workout added successfully");
            setNumOfSets("");
        } catch (error) {
            Alert.alert("Error", (error as Error).message);
        }
    };
    
    return (
        <View style={styles.page}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed");
                    onCloseModal();
                }}
                style={styles.page}
            >
                <ScrollView 
                        style={styles.modalScrollContainer}
                        horizontal={true} 
                        showsHorizontalScrollIndicator={true} 
                        contentContainerStyle={{columnGap: 100}}
                    >
                        {/* <RepInputModal item={item} onClose={(thhing: boolean) => setModalVisible(thhing)} /> */}
                <KeyboardAvoidingView style={[styles.modalContainer, styles.firstCard]} behavior='height'>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => onCloseModal()}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        {item.excerciseName}
                    </Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
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
                                    keyboardType='numeric'
                                    placeholder='Weight'
                                    value={`${item.weight}`}
                                    onChangeText={(text) => {
                                        setInputSets(inputSets.map(i => (i.setNum === item.setNum ? {...i, weight: text}:i)))
                                    }}
                                />
                                <TextInput 
                                    style={[styles.setInput]}
                                    keyboardType='numeric'
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
                        onPress={async () =>  {
                            handleSubmit();
                            setInputSets([]);
                            loadWorkouts();
                        }}
                    >
                        <Text style={styles.baseText}>
                            Add Workout
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
                <View style={styles.modalContainer}>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => onCloseModal()}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        Workouts
                    </Text>
                    <FlatList 
                        showsVerticalScrollIndicator={false}
				        data={workouts}
                        extraData={inputSets}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={({ item }) => (
                            <Text style={styles.baseText}>
                                Set: {item.setNum}, Weight: {item.weight}, Reps: {item.reps}, Date: {item.day}/{item.month}/{item.year}
                            </Text>
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
                <View style={[styles.modalContainer, styles.lastCard]}>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => onCloseModal()}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        Chart
                    </Text>
                    <MyChart workouts={workouts}/>
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
        zIndex: 1000,
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
