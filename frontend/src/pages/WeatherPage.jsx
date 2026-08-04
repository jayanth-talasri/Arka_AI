import {useEffect,useState} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import WeatherCard from "../components/cards/WeatherCard";

import {getWeather} from "../services/weatherService";

const WeatherPage=()=>{

    const [weather,setWeather]=useState(null);

        useEffect(()=>{

            load();

        },[]);

        const load=async()=>{

            const data=await getWeather(
                17.385,
                78.487,
                "20240101",
                "20240107"
            );

            setWeather(data);

        }

        if(!weather)
            return (<DashboardLayout>
                <h2 className="text-2xl font-bold">Loading...</h2>
            </DashboardLayout>);

        return(

        <DashboardLayout>

            <WeatherCard weather={weather}/>

        </DashboardLayout>

        )
    
    }
    
export default WeatherPage;