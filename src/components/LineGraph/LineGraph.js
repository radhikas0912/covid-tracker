import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
   legend:{
        display: false,
    },
    elements: {
        point: {
            radius: 0
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipsItems, data) {
                return numeral(tooltipsItems.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [{
            type: "time",
            time: {
                format: "MM/DD/YY"
            },
            tooltipFormat: "ll"
        }],
        yAxes: [{
            gridLines: {
                display: false
            },
            ticks: {
                callbacks: function(value, index, values) {
                        return numeral(value).format("0a")
                }
                
            }
        }]
    }
}
function LineGraph() {
    const [data, setData] = useState({});

    const buildChartData = (data, caseType='cases') => {
        const chartdata = [];
        let lastDataPoint;
        for(let date in data.cases) {
            if(lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data['cases'][date] - lastDataPoint
                }
                chartdata.push(newDataPoint);
            }
            lastDataPoint = data[caseType][date];
            console.log(lastDataPoint);
        };
        return chartdata;
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastday=120')
            .then(res => res.json())
            .then(data => {
                const chartData = buildChartData(data);
                setData(chartData);
            })
        }
        fetchData();
    }, []);

    return (
        <div>
            {/* {console.log(data)} */}
            { data?.length > 0 && (
                <Line 
                    data = {{
                        datasets: [
                            {   
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data
                            }
                        ]
                    }}
                    options={options}
                    />
                )
            }
        </div>
    )
}

export default LineGraph;
