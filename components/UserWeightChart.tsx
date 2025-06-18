import { Circle, Text as SKText, useFont } from "@shopify/react-native-skia";
import { useSQLiteContext } from "expo-sqlite";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { CartesianChart, Line, useChartPressState } from "victory-native";

export interface Weights {
    id: number;
    weight: string;
    date: number;
}

export function UserWeightChart({ weights }: { weights: Weights[] }) {
	const db = useSQLiteContext();

	const inter = require("@/assets/fonts/Montserrat-Regular.ttf");
	const font = useFont(inter);

	const data: { id: number; weight: number; date: number }[] = [];

	weights.forEach((weight) => {
		data.push({
			id: weight.id,
			weight: +weight.weight,
			date: weight.date,
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
			<View style={styles.chartContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
				<Text style={styles.baseText}>
					No Weight Data Yet
				</Text>
			</View>
	)}

	return (
		<View style={styles.chartContainer}>
			<CartesianChart
				data={data}
				xKey="date"
				yKeys={["weight"]}
				domainPadding={{top: 50, bottom: 50, left: 30, right: 45}}
				chartPressState={state}
				axisOptions={{
					font,
					labelColor: "white",
					lineColor: "white",
					// formatYLabel: (weight) => `${weight}`,
					labelPosition: "outset",
					tickCount: 5,
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
    chartContainer: {
        height: 350,
        width: '90%',
        borderWidth: 1,
        borderColor: 'darkgray',
        borderRadius: 45,
        padding: 30,
		justifyContent: 'center',
    }
});