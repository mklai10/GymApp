import Entypo from '@expo/vector-icons/Entypo';
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Excercise } from './ExcerciseList';

export function WeightForm(item: Excercise) {
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({
        weight: "",
    });

    const db = useSQLiteContext();

    const handleSubmit = async () => {
        try {
            if (!form.weight) {
                throw new Error("All Fields are required");
            }

            if (isNaN(+form.weight)) {
                throw new Error("Weight must be a number");
            }

            await db.runAsync(
                `INSERT INTO "${item.excerciseName}" (weight, date) VALUES (?, ?)`,
                [form.weight, Date()]
            );

            Alert.alert("Success", "Excercise added successfully");
            setForm({
                weight: "",
            });
            setModalVisible(false);
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
                        placeholder="Weight"
                        value={form.weight}
                        onChangeText={(text) => setForm({ ...form, weight: text })}
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
                    <TextInput
                        style={styles.input}
                        placeholder="Weight"
                        value={form.weight}
                        onChangeText={(text) => setForm({ ...form, weight: text })}
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
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => setModalVisible(false)}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        {item.excerciseName}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Weight"
                        value={form.weight}
                        onChangeText={(text) => setForm({ ...form, weight: text })}
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
    plusButton: {
        color: "white",
        marginTop: 20,
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
        color: "white",
        alignSelf: 'flex-end',  
    },
    input: {
        color: "white",
        borderBottomWidth: 1,
        borderColor: "white",
        height: 55,
        fontSize: 20,
    },
    addExcerciseButton: {
        backgroundColor: 'black',
        color: "white",
        width: '50%',
        height: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 45,
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
});
