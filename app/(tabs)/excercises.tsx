import DimensionsProvider, { useDimensions } from "@/components/DimensionsProvider";
import { ExcerciseForm } from "@/components/ExcerciseForm";
import { ExcerciseList } from "@/components/ExcerciseList";
import * as SQLite from "expo-sqlite";
import { memo, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export interface Excercise {
  id: number;
  excerciseName: string;
  weight: number;
}

export default function index() {
  const db = SQLite.openDatabaseSync('example.db');
  const [needsLoad, setNeedsLoad] = useState(0);
  const [updatedPr, setUpdatedPr] = useState(0);

  return (
    <DimensionsProvider>
    <SQLite.SQLiteProvider
      databaseName="weightliftingDatabase.db"
      onInit={async (db) => {
        // await db.execAsync(`
        //   DROP TABLE excercises;
        //   DROP TABLE workouts;
        //                   `);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("Bench", 135, 1, 8, 1, 0, 2023);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("Bench", 145, 1, 8, 15, 0, 2023);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("Bench", 155, 1, 8, 30, 0, 2023);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("Bench", 165, 1, 8, 1, 1, 2023);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("Bench", 185, 1, 8, 15, 1, 2023);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("Bench", 205, 1, 8, 30, 1, 2023);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("A", 205, 1, 8, 1, 1, 2023);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("A", 205, 1, 8, 1, 12, 2023);
          // INSERT INTO workouts (excerciseName, weight, setNum, reps, day, month, year) VALUES ("A", 10, 1, 8, 31, 5, 2025);
          // DELETE FROM workouts WHERE weight = 10;
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS excercises (id INTEGER PRIMARY KEY AUTOINCREMENT,excerciseName TEXT NOT NULL UNIQUE, weight INTEGER, muscle TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, excerciseName TEXT NOT NULL, weight INTEGER NOT NULL, setNum INTEGER NOT NULL, reps INTEGER NOT NULL, day INTEGER NOT NULL, month INTEGER NOT NULL, year INTEGER NOT NULL);
          PRAGMA journal_mode = WAL;
        `);
        // const results = await db.getAllAsync(`SELECT * FROM excercises`);
        const results = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
        // console.log(results);
      }}
      options={{ useNewConnection: false }}
    >
    <ExcerciseStuff loadNum={needsLoad} onNeed={() => setNeedsLoad((load) => load + 1)}/>
    </SQLite.SQLiteProvider>
    </DimensionsProvider>
  );
}

const ExcerciseStuff = memo(function ExcerciseStuff({loadNum, onNeed} : {loadNum:number, onNeed:any}) {
  const { SafeTopMargin } = useDimensions();

  return (
    <View style={{paddingTop: SafeTopMargin}}>
        <View style={styles.pageHeaderContainer}>
          <Text style={styles.pageHeaderText}>Excercises</Text>
        </View>
        <View style={styles.page}>
          <ExcerciseList needsLoad={loadNum} onUpdatePR={() => onNeed()}/>
          <ExcerciseForm onSubmit={() => onNeed()}/>
        </View>
      </View>
  )
})

// const List = memo(function List({test}:{test:number}) {
//   return (
//     <ExcerciseList needsLoad={test} onUpdatePR={() => }/>
//   )
// })

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
