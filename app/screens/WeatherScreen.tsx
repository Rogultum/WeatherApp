import { Skia, SkPath, Canvas, Line, vec, Path } from "@shopify/react-native-skia"
import React, { useEffect, useState } from "react"

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
  const GRAPH_HEIGHT = 150
  const GRAPH_WIDTH = 370

  const [currWeather, setCurrWeather] = useState()
  const [weather, setWeather] = useState()
  const [humidity, setHumidity] = useState("")
  const [wind, setWind] = useState()
  const [qIndex, setQIndex] = useState()

  const makeGraph = (data: DataPoint[]): GraphData => {
    const min = Math.min(...data.map((val) => val.value))
    const max = Math.max(...data.map((val) => val.value))

    const getYAxis = scaleLinear().domain([min, max]).range([GRAPH_HEIGHT, 35])

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

  const wData = [
    { date: "2000-02-01T05:00:00.000Z", value: weather ? weather[3] : 1 },
    { date: "2000-02-02T05:00:00.000Z", value: weather ? weather[3] : 1 },
    { date: "2000-02-03T05:00:00.000Z", value: weather ? weather[3] : 1 },
    { date: "2000-02-04T05:00:00.000Z", value: weather ? weather[6] : 1 },
    { date: "2000-02-05T05:00:00.000Z", value: weather ? weather[6] : 1 },
    { date: "2000-02-06T05:00:00.000Z", value: weather ? weather[6] : 1 },
    { date: "2000-02-07T05:00:00.000Z", value: weather ? weather[9] : 1 },
    { date: "2000-02-08T05:00:00.000Z", value: weather ? weather[9] : 1 },
    { date: "2000-02-09T05:00:00.000Z", value: weather ? weather[9] : 1 },
    { date: "2000-02-10T05:00:00.000Z", value: weather ? weather[12] : 1 },
    { date: "2000-02-11T05:00:00.000Z", value: weather ? weather[12] : 1 },
    { date: "2000-02-12T05:00:00.000Z", value: weather ? weather[12] : 1 },
    { date: "2000-02-13T05:00:00.000Z", value: weather ? weather[15] : 1 },
    { date: "2000-02-14T05:00:00.000Z", value: weather ? weather[15] : 1 },
    { date: "2000-02-15T05:00:00.000Z", value: weather ? weather[15] : 1 },
  ]

  const graphData = makeGraph(wData)

  const getCurrentWeather = async () => {
    await axios.get(`${BASE_URL}/forecast.json?key=${API_KEY}&q=RIO&aqi=yes`).then((response) => {
      const res = response.data.forecast.forecastday[0]
      const arr = []
      res.hour.map((item) => {
        arr.push(item.feelslike_c)
      })

      setWeather(arr)
      setCurrWeather(res.day.avgtemp_c)
      setHumidity(res.day.avghumidity.toString())
      setWind(res.day.maxwind_kph.toString())
      setQIndex(res.day.air_quality["us-epa-index"])
    })
  }

  useEffect(() => {
    getCurrentWeather()
  }, [])

  return (
    <Screen contentContainerStyle={$container} safeAreaEdges={["top"]} preset="scroll">
      <SafeAreaView style={$container}>
        <View style={$degreeContainer}>
          <Text onPress={getCurrentWeather} style={$degreeNum} text={"35"} size="xxl" />
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
        <View style={$iconTextContainer}>
          <Text size="md" text={humidity} />
          <Text size="md" text={wind} />
          <Text size="md" text={qIndex} />
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
        <View style={$weatherPoints}>
          {weather &&
            weather.map((w: string, index: number) => {
              if (index % 3 === 0 && index <= 15) {
                return <Text key={index} text={w} size="xxs" />
              } else return <></>
            })}
        </View>
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
const $iconTextContainer: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-evenly",
  bottom: -80,
  marginBottom: 12,
  // left: -5,
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
const $weatherPoints: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-evenly",
}
