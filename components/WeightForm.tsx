import Entypo from '@expo/vector-icons/Entypo';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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

export function WeightForm({item, modalVisible, onCloseModal} : 
    {item:Excercise, modalVisible:boolean, onCloseModal:any}) {
    const [numOfSets, setNumOfSets] = useState("");
    const [inputSets, setInputSets] = useState<Set[]>([]);
    const [workouts, setWorkouts] = useState<Set[]>([]);
    const [needsLoading, setNeedsLoading] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [chartTitle, setChartTitle] = useState("Chart");

    const inputSetsTemp: Set[] = [];

    const db = useSQLiteContext(); 

    const loadWorkouts = async () => {
        try {
            setIsLoading(true);
            const results = await db.getAllAsync(`SELECT * FROM workouts WHERE excerciseName = $value ORDER BY year DESC, month DESC, day DESC, setNum DESC`, {$value: item.excerciseName});
            // console.log(results);
			setWorkouts(results as Set[]);
		} catch (error) {
			console.error("Database error", error);
		} finally {
            setIsLoading(false);
            setNeedsLoading((count) => count + 1);
        }
    }

    const loadYear = async () => {
        try {
            setIsLoading(true);
            let currentYear = (new Date()).getFullYear();
            const results = await db.getAllAsync(`SELECT * FROM workouts WHERE excerciseName = $value AND year = $year ORDER BY month DESC, day DESC, setNum DESC`, {$value: item.excerciseName, $year: currentYear});
            // console.log(results);
			setWorkouts(results as Set[]);
		} catch (error) {
			console.error("Database error", error);
		} finally {
            setIsLoading(false);
            setNeedsLoading((count) => count + 1);
        }
    }

    const loadMonth = async () => {
        try {
            setIsLoading(true);
            let currentYear = (new Date()).getFullYear();
            let currentMonth = (new Date()).getMonth() + 1;
            const results = await db.getAllAsync(`SELECT * FROM workouts WHERE excerciseName = $value AND year = $year AND month = $month ORDER BY day DESC, setNum DESC`, {$value: item.excerciseName, $year: currentYear, $month: currentMonth});
            // console.log(results);
			setWorkouts(results as Set[]);
		} catch (error) {
			console.error("Database error", error);
		} finally {
            setIsLoading(false);
            setNeedsLoading((count) => count + 1);
        }
    }

    useEffect(() => {
        loadWorkouts();
    }, [item]);

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
            if (!numOfSets) {
                throw new Error("Input the number of sets");
            }

            inputSets.forEach((set) => {
                if (!set.weight || !set.reps) {
                    throw new Error("All fields are required");
                }
                if (isNaN(+set.weight) || isNaN(+set.reps)) {
                    throw new Error("Weight must be a number");
                }
            })

            for (let i = 0; i<inputSets.length; i++) {
                const date = new Date();
                const newDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
                 await db.runAsync(
                    `INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [inputSets[i].excerciseName, inputSets[i].weight, inputSets[i].setNum, inputSets[i].reps, date.getDate(), date.getMonth() + 1, date.getFullYear()]
                );
            }
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
                        style={styles.addWorkoutButton}
                        onPress={async () =>  {
                            handleSubmit();
                            loadWorkouts();
                            setInputSets([]);
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
                        extraData={[needsLoading, workouts]}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={loadWorkouts}/>
                        }
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={({ item }) => (
                            <View style={styles.setTextGroup}>
                                <Text style={styles.setText}>
                                    Set: {item.setNum} 
                                </Text>
                                <Text style={styles.setText}>
                                    Weight: {item.weight} 
                                </Text>
                                <Text style={styles.setText}>
                                    Reps: {item.reps} 
                                </Text>
                                <Text style={styles.setText}>
                                    Date: {item.day}/{item.month}/{item.year} 
                                </Text>
                            </View>
                        )}
                    />
                    <Text style={styles.cardFooter}>
                        Pull Down To Refresh
                    </Text>
                </View>
                <View style={[styles.modalContainer, styles.lastCard]}>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => onCloseModal()}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        {chartTitle}
                    </Text>
                    <MyChart workouts={workouts}/>
                    <View style={styles.timeContainer}>
                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={async () =>  {setChartTitle("All"); loadWorkouts()}}
                        >
                            <Text style={styles.baseText}>
                                All
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={async () =>  {setChartTitle("Year"); loadYear()}}
                        >
                            <Text style={styles.baseText}>
                                Year
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={async () =>  {setChartTitle("Month"); loadMonth()}}
                        >
                            <Text style={styles.baseText}>
                                Month
                            </Text>
                        </TouchableOpacity>
                    </View> 
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
		textAlign: "center",
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
    addWorkoutButton: {
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
        padding: 5,
        paddingBottom: 20,
    },
    setsListContainer: {
		width: "100%",
		height: "100%",
		borderColor: "darkgray",
	},
    setTextGroup: {
        width: "100%",
        flexDirection: 'row',
    },
    setText: {
        color: 'white',
        flexDirection: 'row',
        textAlign: 'center',
        padding: 5,
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
    },
    timeContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: 10,
        columnGap: 10,
    },
    timeButton: {
        color: "white",
        width: '25%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 45,
        borderWidth: 1,
        borderColor: 'darkgray',
    }
});
