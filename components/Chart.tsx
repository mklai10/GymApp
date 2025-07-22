import { Circle, Text as SKText, useFont } from "@shopify/react-native-skia";
import { useSQLiteContext } from "expo-sqlite";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Set } from "./WeightForm";

export function MyChart({ workouts }: { workouts: Set[] }) {
	const db = useSQLiteContext();

	const inter = require("@/assets/fonts/Montserrat-Regular.ttf");
	const font = useFont(inter);

	const data: { id: number; weight: number; date: number }[] = [];

	workouts.forEach((set) => {
		let month = set.month > 9 ? set.month : `0${set.month}`;
		let day = set.day > 9 ? set.day : `0${set.day}`;
		let setNum = +set.setNum > 9
			? `${set.setNum.substring(0, 1)}:${set.setNum.substring(1)}`
			: `0:${set.setNum}`;
		let date = new Date(`${set.year}-${month}-${day}T0${setNum}0:00`).getTime()
		data.push({
			id: set.id,
			weight: +set.weight,
			date: date,
		});
	});

	const { state, isActive } = useChartPressState({ x: 0, y: { weight: 0 } });

	const value = useDerivedValue(() => {
		return state.y.weight.value.value + "lbs";
	}, [state]);

	const textXPosition = useDerivedValue(() => {
		return state.x.position.value - 15;
	}, [state]);

	const textYPosition = useDerivedValue(() => {
		return 20;
	}, [state]);

	if (data.length == 0) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
				<Text style={styles.baseText}>
					No Workout Data Yet
				</Text>
			</View>
	)}

	return (
		<View style={{ height: "80%", width: "100%" }}>
			<CartesianChart
				data={data}
				xKey="date"
				yKeys={["weight"]}
				domainPadding={{top: 50, bottom: 50, left: 30, right: 45}}
				chartPressState={state}
				// transformState={useChartTransformState().state}
				axisOptions={{
					font,
					labelColor: "white",
					lineColor: "white",
					// formatYLabel: (weight) => `${weight}`,
					labelPosition: "outset",
					formatXLabel: (date) => {
						let stringDate = new Date(date).toString();
						return stringDate.substring(4, 11);
					},
				}}
			>
				{({ points }) => {
					return (
						<>
							<Line
								points={points.weight}
								color="white"
								strokeWidth={3}
								curveType="linear"
							/>
							{isActive && (
								<View>
									<SKText
										x={textXPosition}
										y={textYPosition}
										text={value}
										font={font}
										color={"white"}
									/>
									<ToolTip x={state.x.position} y={state.y.weight.position} />
								</View>
							)}
						</>
					);
				}}
			</CartesianChart>
		</View>
	);
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
	return <Circle cx={x} cy={y} r={8} color="white" />;
}

const styles = StyleSheet.create({
	baseText: {
		color: 'darkgray',
		fontSize: 20,
		textAlign: 'center',
		marginTop: 20,
	},
	loadingContainer: {
		width: '100%',
		height: 300,
		justifyContent: 'center',
	},
});