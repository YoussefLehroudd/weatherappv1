import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake, faSmog, faBolt } from '@fortawesome/free-solid-svg-icons';

export default function Axioss() {
    const api = {
        key: 'fbb7ee19b421484ff90da1b5a931a567',
        base: "https://api.openweathermap.org/data/2.5/",
    };

    const [datas, setDatas] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    // Wrap fetchWeatherData with useCallback
    const fetchWeatherData = useCallback((city) => {
        axios.get(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`)
            .then(res => setDatas(res.data))
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    setError("City not found. Please try again.");
                } else {
                    console.error("Error fetching data:", err);
                    setError("An error occurred while fetching data.");
                }
            });
    }, [api.key, api.base]);

    useEffect(() => {
        fetchWeatherData("London"); // Fetch default weather data
    }, [fetchWeatherData]); // Include fetchWeatherData in the dependency array

    const cherche = (e) => {
        e.preventDefault();
        setError("");
        if (search) {
            fetchWeatherData(search);
        }
    };

    const getLocalSunriseTime = (timestamp) => {
        const utcDate = new Date(timestamp * 1000);
        return utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
    };

    const getLocalTimeWithOffset = (timestamp, offset) => {
        const date = new Date((timestamp + offset) * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getWeatherIcon = (description) => {
        const iconMap = {
            "clear sky": faSun,
            "few clouds": faCloud,
            "scattered clouds": faCloud,
            "broken clouds": faCloud,
            "shower rain": faCloudRain,
            "light rain": faCloudRain,
            "rain": faCloudRain,
            "thunderstorm": faBolt,
            "snow": faSnowflake,
            "mist": faSmog,
        };
        return iconMap[description] || faCloud;
    };

    const getBackgroundImage = (description) => {
        const imageMap = {
            "clear sky": "url('https://img.freepik.com/free-photo/white-clouds-with-blue-sky-background_1253-231.jpg?t=st=1729982934~exp=1729986534~hmac=186de6eb14b86dcf64da501ba1bd435a8ed2ac857dd28efc96bb41f740636817&w=1380')",
            "few clouds": "url('https://st5.depositphotos.com/3564249/69587/i/450/depositphotos_695879086-stock-photo-view-blue-sky-few-clouds.jpg')",
            "scattered clouds": "url('https://media.istockphoto.com/id/480531006/photo/cirrocumulus-cloud.jpg?s=612x612&w=0&k=20&c=FnYho0qjG9dc86WxyOKai_mGBU_2HFsabfKKV0haVYc=')",
            "broken clouds": "url('https://www.shutterstock.com/image-photo/july-10-2024-whittier-ca-260nw-2492514523.jpg')",
            "overcast clouds": "url('https://c1.wallpaperflare.com/preview/748/977/304/storm-sky-cloudy-weather.jpg')",
            "light rain": "url('https://media.istockphoto.com/id/453684353/photo/rain-at-the-fields.jpg?s=612x612&w=0&k=20&c=JXVnwl83Oifw3ook_yhZy9IIeHm2Ey6PrxgZUK1_vZs=')",
            "shower rain": "url('https://media.istockphoto.com/id/503284599/photo/rainy-weather.jpg?s=612x612&w=0&k=20&c=pV38CVp0CLArYEZ6OUWnaqo6J5mo4JpbEZd61Vxr_I4=')",
            "rain": "url('https://media.istockphoto.com/id/503284599/photo/rainy-weather.jpg?s=612x612&w=0&k=20&c=pV38CVp0CLArYEZ6OUWnaqo6J5mo4JpbEZd61Vxr_I4=')",
            "moderate rain": "url('https://media.istockphoto.com/id/503284599/photo/rainy-weather.jpg?s=612x612&w=0&k=20&c=pV38CVp0CLArYEZ6OUWnaqo6J5mo4JpbEZd61Vxr_I4=')",
            "thunderstorm": "url('https://images.unsplash.com/photo-1500674425229-f692875b0ab7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTd8fHxlbnwwfHx8fHw%3D')",
            "snow": "url('https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg?cs=srgb&dl=pexels-eberhardgross-1004665.jpg&fm=jpg')",
            "mist": "url('https://images.pexels.com/photos/158672/fog-forest-mountain-world-clouds-158672.jpeg?cs=srgb&dl=pexels-pixabay-158672.jpg&fm=jpg')",
        };
        return imageMap[description] || "url('https://t4.ftcdn.net/jpg/02/66/38/15/360_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg')";
    };

    return (
        <div className="App" 
            style={{
                backgroundImage: datas ? getBackgroundImage(datas.weather[0].description) : "",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
            }}
        >

<header className="App-header" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "5px" }}>
    <h1 className="text-center text-white" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Weather App</h1>

    <form onSubmit={cherche} className="d-flex justify-content-center mt-4 mb-4">
        <input 
            type="text" 
            className="form-control me-2" 
            placeholder="Enter city/town..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            required 
            style={{ borderRadius: "20px", padding: "10px", width: "300px" }}
        />
        <button type="submit" className="btn btn-outline-light" style={{ borderRadius: "20px", padding: "10px 20px" }}>Search</button>
    </form>
</header>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {datas && !error && (
                    <div className="row d-flex justify-content-center py-5">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card text-body" style={{ borderRadius: "35px", backgroundColor: "rgba(255, 255, 255, 0.6)" }}>

                                <div className="card-body p-4">
                                    <div className="d-flex">
                                        <h6 className="flex-grow-1">{datas.name}</h6>
                                        <h6>Local Time: {getLocalTimeWithOffset(Date.now() / 1000, datas.timezone)}</h6>
                                    </div>

                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                        <h6 className="display-4 mb-0 font-weight-bold"> {datas.main.temp}°C </h6>
                                        <span className="small" style={{ color: "#868B94" }}>{datas.weather[0].description}</span>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1" style={{ fontSize: "1rem" }}>
                                            <div><i className="fas fa-wind fa-fw" style={{ color: "#868B94" }}></i> <span className="ms-1"> {datas.wind.speed} m/s </span></div>
                                            <div><i className="fas fa-tint fa-fw" style={{ color: "#868B94" }}></i> <span className="ms-1"> {datas.main.humidity}% </span></div>
                                            <div><i className="fas fa-sun fa-fw" style={{ color: "#868B94" }}></i> <span className="ms-1"> {getLocalSunriseTime(datas.sys.sunrise)}</span></div>
                                            <div><i className="fas fa-moon fa-fw" style={{ color: "#868B94" }}></i> <span className="ms-1"> {getLocalSunriseTime(datas.sys.sunset)}</span></div>
                                        </div>
                                        <div>
                                            <FontAwesomeIcon 
                                                icon={getWeatherIcon(datas.weather[0].description)} 
                                                size="4x" 
                                                color="#868B94" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
