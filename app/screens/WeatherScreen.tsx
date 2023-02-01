import { Skia, SkPath, Canvas, Line, vec, Path } from "@shopify/react-native-skia"
import React, { useState } from "react"

import { scaleLinear, scaleTime, line, curveBasis } from "d3"

import { ViewStyle, View, TextStyle, ImageStyle, Image } from "react-native"

import { AutoImage, Icon, Screen, Text } from "../components"
import { DataPoint, originalData } from "../data"

// to get current weather for London: JSON: http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London
// XML: http://api.weatherapi.com/v1/current.xml?key=<YOUR_API_KEY>&q=London

// To get 7 day weather for US Zipcode 07112: JSON: http://api.weatherapi.com/v1/forecast.json?key=<YOUR_API_KEY>&q=07112&days=7
// XML: http://api.weatherapi.com/v1/forecast.xml?key=<YOUR_API_KEY>&q=07112&days=7

// Search for cities starting with Lond: JSON: http://api.weatherapi.com/v1/search.json?key=<YOUR_API_KEY>&q=lond
// XML: http://api.weatherapi.com/v1/search.xml?key=<YOUR_API_KEY>&q=lond

import { BASE_URL, API_KEY } from "../.env/WeatherApi"
import axios from "axios"
import { SafeAreaView } from "react-native-safe-area-context"

interface GraphData {
  max: number
  min: number
  curve: SkPath
}

export const WeatherScreen = () => {
  const GRAPH_HEIGHT = 200
  const GRAPH_WIDTH = 370

  const [weather, setWeather] = useState([])

  const makeGraph = (data: DataPoint[]): GraphData => {
    const min = Math.min(...data.map((val) => val.value))
    const max = Math.max(...data.map((val) => val.value))

    const getYAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35])

    const getXAxis = scaleTime()
      .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
      .range([10, GRAPH_WIDTH - 10])

    const curvedLine = line<DataPoint>()
      .x((d) => getXAxis(new Date(d.date)))
      .y((d) => getYAxis(d.value))
      .curve(curveBasis)(data)

    const skPath = Skia.Path.MakeFromSVGString(curvedLine)

    return {
      min,
      max,
      curve: skPath,
    }
  }

  const graphData = makeGraph(originalData)

  const getCurrentWeather = async () => {
    await axios
      .get(`${BASE_URL}/forecast.json?key=${API_KEY}&q=LONDON&aqi=yes`)
      .then((response) => {
        setWeather(response.data.forecast.forecastday.hour)
      })
    console.log(weather)

    // console.log(
    //   weather.map((h) => {
    //     console.log(h)
    //   }),
    // )
  }

  return (
    <Screen contentContainerStyle={$container} safeAreaEdges={["top"]} preset="scroll">
      <SafeAreaView style={$container}>
        <View style={$degreeContainer}>
          <Text onPress={getCurrentWeather} style={$degreeNum} text="35" size="xxl" />
          <Text text="°" size="xl" style={$degreeSym} />
        </View>
        <AutoImage style={$image} maxWidth={250} source={require("../../assets/images/sun.png")} />
        <Image style={$image} source={require("../../assets/images/sun.png")} />
        <Text text="ANK" size="xl" style={$city} />
        <View style={$iconContainer}>
          <Icon containerStyle={$icon} size={26} icon="humidity" />
          <Icon containerStyle={$icon} size={26} icon="wind" />
          <Icon containerStyle={$icon} size={26} icon="air" />
        </View>
        <Canvas
          style={[
            {
              height: GRAPH_HEIGHT,
              width: GRAPH_WIDTH,
            },
            $canvas,
          ]}
        >
          <Line strokeWidth={0.5} color="lightGrey" p1={vec(10, 130)} p2={vec(400, 130)} />
          <Path strokeWidth={2.5} color="black" path={graphData.curve} style="stroke" />
        </Canvas>
      </SafeAreaView>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingTop: 5,
  paddingHorizontal: 5,
}
const $degreeContainer: ViewStyle = {
  flexDirection: "row",
}
const $degreeNum: TextStyle = {
  zIndex: 2,
  top: -70,
}
const $degreeSym: TextStyle = {
  zIndex: 2,
  top: -70,
  position: "absolute",
  right: -55,
}
const $city: TextStyle = {}
const $iconContainer: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-evenly",
  zIndex: 2,
  bottom: -80,
}
const $icon: ViewStyle = {
  borderWidth: 0.7,
  borderRadius: 20,
  padding: 5,
}
const $image: ImageStyle = {
  zIndex: 1,
  position: "absolute",
  opacity: 0.7,
  maxWidth: 400,
  resizeMode: "contain",
  top: -100,
}
const $canvas = {
  bottom: -35,
}
