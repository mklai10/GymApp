import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export function ExcerciseForm({onSubmit} : {onSubmit:any}) {
    const [form, setForm] = useState({
        name: "",
        weight: "",
        muscle: "",
    });

    const [modalVisible, setModalVisible] = useState(false);

    const db = useSQLiteContext();

    const handleSubmit = async () => {
        try {
            if (!form.name || !form.weight || !form.muscle) {
                throw new Error("All Fields are required");
            }

            if (isNaN(+form.weight)) {
                throw new Error("Weight must be a number");
            }

            await db.runAsync(
                "INSERT INTO excercises (excerciseName, weight, muscle) VALUES (?, ?, ?)",
                [form.name, form.weight, form.muscle]
            );

            Alert.alert("Success", "Excercise added successfully");
            setForm({
                name: "",
                weight: "",
                muscle: "",
            });
            onSubmit();
            setModalVisible(false);
        } catch (error) {
            Alert.alert("Error", (error as Error).message);
        }
    };

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                style={styles.page}
            >
                <View style={styles.modalContainer}>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => setModalVisible(false)}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={form.name}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="PR"
                        value={form.weight}
                        onChangeText={(text) => setForm({ ...form, weight: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Muscle"
                        value={form.muscle}
                        onChangeText={(text) => setForm({ ...form, muscle: text })}
                    />
                    <TouchableOpacity
                        style={styles.addExcerciseButton}
                        onPress={() => {
                            handleSubmit();
                        }}
                    >
                        <Text style={styles.baseText}>
                            Add Excercise
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <AntDesign name="plus" style={styles.plusButton} size={24} onPress={() => setModalVisible(true)}/>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
    	width: "100%",
    	alignItems: "center",
    	justifyContent: "center",
  	},
    baseText: {
        color: "white",
        textAlign: 'center',
    },
    plusButton: {
        color: "white",
        marginTop: 20,
    },
    modalContainer: {
        backgroundColor: "black",
        top: '25%',
        left: 20,
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
});
