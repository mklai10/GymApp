import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";

export function ExcerciseList() {
  const [excercises, setExcercises] = useState<Excercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = useSQLiteContext();

  interface Excercise {
    excerciseName: string;
    id: number;
    muscle: string;
    weight: number;
  }

  const loadExcercises = async () => {
    try {
      setIsLoading(true);
      const results = await db.getAllAsync(
        `SELECT * FROM excercises ORDER BY id DESC`
      );
      setExcercises(results as Excercise[]);
      typeof results;
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
    <FlatList
      style={styles.excerciseContainer}
      showsVerticalScrollIndicator={false}
      data={excercises}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadExcercises} />
      }
      keyExtractor={(item) => item.id.toString as unknown as string}
      // keyExtractor={(item) => item.excerciseName}
      renderItem={({ item }) => (
        <View style={styles.excerciseCard}>
          <Text style={[styles.baseText, styles.cardHeader]}>
            {item.excerciseName}
          </Text>
          <Text style={[styles.baseText, styles.cardText]}>
            {`${item.weight}lbs`}
          </Text>
          <Text style={[styles.baseText, styles.cardFooter]}>
            {item.muscle}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  baseText: {
    color: "white",
  },
  excerciseContainer: {
    // backgroundColor: 'white',
    // opacity: 0.1,
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
    // opacity: 1,
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
