import { ExcerciseForm } from "@/components/ExcerciseForm";
import { ExcerciseList } from "@/components/ExcerciseList";
import * as SQLite from "expo-sqlite";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  // const db = SQLite.openDatabaseSync('example.db');
  // const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState("");

  return (
    <SQLite.SQLiteProvider
      databaseName="weightliftingDatabase.db"
      onInit={async (db) => {
        // await db.execAsync(`DROP TABLE excercises`);
        await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS excercises (id INTEGER PRIMARY KEY AUTOINCREMENT,excerciseName TEXT NOT NULL UNIQUE, weight INTEGER, muscle TEXT NOT NULL);
                    PRAGMA journal_mode = WAL;
                `);
        // const results = await db.getAllAsync(`SELECT * FROM excercises`);
        // console.log(typeof(results[0]));
        // console.log(results);
      }}
      options={{ useNewConnection: false }}
    >
      <SafeAreaView>
        <View style={styles.pageHeaderContainer}>
          <Text style={styles.pageHeaderText}>Excercises</Text>
        </View>
        <View style={styles.page}>
          <View style={styles.searchBar}>
            <TextInput
              style={[styles.baseText, styles.searchText]}
              value={currentName}
              placeholder="Search Here"
              onChangeText={(newName) => setCurrentName(newName)}
            ></TextInput>
          </View>
          <ExcerciseForm />
          <ExcerciseList />
        </View>
      </SafeAreaView>
    </SQLite.SQLiteProvider>
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
  },
  pageHeaderContainer: {
    height: 100,
    justifyContent: "center",
  },
  pageHeaderText: {
    color: "white",
    paddingTop: StatusBar.currentHeight,
    textAlign: "center",
    textAlignVertical: "bottom",
    fontSize: 25,
  },
  searchBar: {
    backgroundColor: "#373737",
    width: "75%",
    height: 40,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "darkgray",
    padding: 10,
  },
  searchText: {
    fontSize: 15,
    textAlign: "left",
  },
});
