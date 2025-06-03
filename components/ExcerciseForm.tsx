import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
    Alert,
    Button,
    Modal,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

export function ExcerciseForm() {
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
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "An error has occured");
    }
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={form.weight}
            onChangeText={(text) => setForm({ ...form, weight: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Muscle"
            value={form.muscle}
            onChangeText={(text) => setForm({ ...form, muscle: text })}
          />
          <Button
            title="Add Excercise"
            onPress={() => {
              handleSubmit();
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
      <Button
        color={"white"}
        title="test"
        onPress={() => setModalVisible(true)}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  modalButton: {
    color: "white",
  },
  modalContainer: {
    backgroundColor: "white",
    top: 100,
    left: 50,
    width: 300,
    height: 500,
  },
  input: {
    color: "black",
    borderWidth: 1,
    borderColor: "black",
    width: 300,
    height: 100,
  },
});
