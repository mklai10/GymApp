import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

export function UserWeightForm({modalVisible, onCloseModal, onSubmit} : {modalVisible:boolean, onCloseModal:any, onSubmit:any}) {
    const [weight, setWeight] = useState("");

    const handleSubmit = () => {
        try {
            if (isNaN(+weight)) {
                throw new Error("Weight must be a number");
            }
        } catch (error) {
             Alert.alert("Error", (error as Error).message);
        }
        onSubmit(weight)
        onCloseModal();
    }

    return (
        <ScrollView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    onCloseModal();
                }}
                style={styles.page}
            >
                <KeyboardAvoidingView style={styles.modalContainer} behavior='height'>
                    <Entypo name="cross" size={24} style={styles.modalClose}  onPress={() => onCloseModal()}/>
                    <Text style={[styles.cardText, styles.baseText]}>
                        Weight
                    </Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        placeholder="Your New Weight"
                        value={weight.toString()}
                        onChangeText={(num) => {
                            setWeight(num);
                        }}
                    />
                    <TouchableOpacity
                        style={styles.addWeightButton}
                        onPress={async () =>  {
                            handleSubmit();
                        }}
                    >
                        <Text style={styles.baseText}>
                            Add Weight
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </ScrollView>
    )
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
        marginLeft: 20,
    },
    modalClose: {
        position: 'absolute',
        color: "white",
        alignSelf: 'flex-end',  
        top: 20,
        right: 20,
        zIndex: 1000,
    },
    cardText: {
		fontSize: 28,
		textAlign: "left",
		paddingTop: 8,
		paddingBottom: 8,
		fontWeight: "bold",
	},
    input: {
        color: "white",
        borderWidth: 1,
        borderColor: "white",
        height: 55,
        fontSize: 20,
        marginBottom: 10,
    },
    addWeightButton: {
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
})