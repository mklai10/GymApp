import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StyleSheet,
	TextInput,
	View
} from "react-native";
import { WeightForm } from "./WeightForm";

export interface Excercise {
		excerciseName: string;
		id: number;
		muscle: string;
		weight: number;
}

export function ExcerciseList() {
	const [excercises, setExcercises] = useState<Excercise[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredExcercises, setFilteredExcercises] = useState<Excercise[]>([]);
	
	const db = useSQLiteContext();

	const loadExcercises = async () => {
		try {
			setIsLoading(true);
			const results = await db.getAllAsync(`SELECT * FROM excercises ORDER BY id DESC`);
			setExcercises(results as Excercise[]);
		} catch (error) {
			console.error("Database error", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadExcercises();
	}, []);

	if (isLoading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	return (
		<View style={styles.page}>
			<View style={styles.searchBar}>
				<TextInput
					style={[styles.baseText, styles.searchText]}
					value={searchQuery}
					placeholder="Search Here"
					onChangeText={(newName) => {
						// console.log(newName);
						setSearchQuery(newName);
						let filtered  = excercises.filter((excercise) => {
							return excercise.excerciseName.toLowerCase().includes(newName.toLowerCase());
						});
						// console.log(filtered);
						setFilteredExcercises(filtered);
					}}
					autoCorrect={false}
				/>
			</View>
			<FlatList
				style={styles.excerciseContainer}
				showsVerticalScrollIndicator={false}
				data={searchQuery.length > 0 ? filteredExcercises:excercises}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={loadExcercises} />
				}
				keyExtractor={(item) => item.id as unknown as string}
				renderItem={({ item }) => (
					// <View style={styles.excerciseCard}>
					// 	<Text style={[styles.baseText, styles.cardHeader]}>
					// 		{item.excerciseName}
					// 	</Text>
					// 	<Text style={[styles.baseText, styles.cardText]}>
					// 		{`${item.weight}lbs`}
					// 	</Text>
					// 	<Text style={[styles.baseText, styles.cardFooter]}>{item.muscle}</Text>
					// </View>
					<SQLiteProvider
						databaseName={`${item.excerciseName}Table.db`}
						onInit={async (db) => {
							// const name = item.excerciseName.re
							// await db.execAsync(`DROP TABLE "${item.excerciseName}"`);
							await db.execAsync(`
								CREATE TABLE IF NOT EXISTS "${item.excerciseName}" (id INTEGER PRIMARY KEY AUTOINCREMENT, excerciseName TEXT NOT NULL, weight INTEGER NOT NULL, setNum INTEGER NOT NULL, reps INTEGER NOT NULL, date TEXT NOT NULL);
								PRAGMA journal_mode = WAL;
								`);
							// const results = await db.getAllAsync(`SELECT * FROM "${item.excerciseName}"`);
							// console.log(typeof(results[0]));
							// console.log(results);
						}}
					>
						<WeightForm{...item}/>
					</SQLiteProvider>
						
				)}
			/>
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
	excerciseContainer: {
		width: "75%",
		height: 500,
		borderWidth: 1,
		borderColor: "darkgray",
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
});
