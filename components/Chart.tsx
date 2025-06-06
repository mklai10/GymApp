import { useFont } from "@shopify/react-native-skia";
import { useSQLiteContext } from "expo-sqlite";
import { View } from "react-native";
import { CartesianChart, Line } from "victory-native";
import { Set } from "./WeightForm";

export function MyChart({ workouts }: { workouts: Set[] }) {
	const db = useSQLiteContext();

	const inter = require("@/assets/fonts/Montserrat-Regular.ttf");
	const font = useFont(inter);

	const data: {weight: number, date: number, month: number, year: number}[] = [];

	workouts.forEach((set) => {
		data.push({ weight: +set.weight, date: set.day, month: set.month, year: set.year});
	});

	return (
		<View style={{ height: '80%', width: '100%' }}>
			<CartesianChart
				data={data}
				// data={DATA}
				xKey="date"
				yKeys={["weight"]}
				axisOptions={{ font, labelColor: "white", lineColor: "white", formatYLabel: ((weight) => `${weight}lbs`), labelPosition: 'outset'}}
			>
				{({ points }) => <Line points={points.weight} color="white" strokeWidth={3} />}
			</CartesianChart>
		</View>
	);
}
