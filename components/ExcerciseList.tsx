import Entypo from '@expo/vector-icons/Entypo';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";
import { WeightForm } from "./WeightForm";

export interface Excercise {
		excerciseName: string;
		id: number;
		muscle: string;
		weight: number;
}

export function ExcerciseList({needsLoad} : {needsLoad:number}) {
	const [excercises, setExcercises] = useState<Excercise[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredExcercises, setFilteredExcercises] = useState<Excercise[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	
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
						setSearchQuery(newName);
						let filtered  = excercises.filter((excercise) => {
							return excercise.excerciseName.toLowerCase().includes(newName.toLowerCase());
						});
						setFilteredExcercises(filtered);
					}}
					autoCorrect={false}
				/>
			</View>
			<FlatList
				style={styles.excerciseContainer}
				showsVerticalScrollIndicator={false}
				data={searchQuery.length > 0 ? filteredExcercises:excercises}
				extraData={needsLoad}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={loadExcercises} />
				}
				keyExtractor={(item) => item.id as unknown as string}
				renderItem={({ item }) => (
					// <SQLiteProvider
					// 	databaseName="weightliftingDatabase.db"
					// 	onInit={async (db) => {
					// 		await db.execAsync(`
					// 			CREATE TABLE IF NOT EXISTS "${item.excerciseName}" (id INTEGER PRIMARY KEY AUTOINCREMENT, excerciseName TEXT NOT NULL, weight INTEGER NOT NULL, setNum INTEGER NOT NULL, reps INTEGER NOT NULL, date TEXT NOT NULL);
					// 			PRAGMA journal_mode = WAL;
					// 		`);
					// 		const results = await db.getAllAsync(`SELECT * FROM "${item.excerciseName}"`);
					// 		console.log(results);
					// 	}}
					// >
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
                			<Entypo name="cross" size={24} style={styles.modalClose}  onPress={async () => {
                    		db.runAsync(`
                        		DELETE FROM excercises WHERE excerciseName = $value`, {$value: item.excerciseName}
                    		)
							db.runAsync(`
								DELETE FROM workouts WHERE excerciseName = $value`, {$value: item.excerciseName}
							)
							loadExcercises();
                		}}/>
							<WeightForm item={item} modalVisible={modalVisible} onCloseModal={() => setModalVisible(false)}/>
            			</TouchableOpacity>
						
					// </SQLiteProvider>
						
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
	modalClose: {
        position: 'absolute',
        color: "white",
        alignSelf: 'flex-end',  
        top: 20,
        right: 20,
        zIndex: 1000,
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
