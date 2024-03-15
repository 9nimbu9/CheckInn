import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const LineGraph = () => {
  const [requestData, setRequestData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://checkinn.co/api/v1/int/requests');
      setRequestData(response.data.requests);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (requestData.length > 0) {
      renderLineGraph();
    }
  }, [requestData]);

  const renderLineGraph = () => {
    const hotelRequests = {};
    requestData.forEach(request => {
      const hotelName = request.hotel.name;
      if (!hotelRequests[hotelName]) {
        hotelRequests[hotelName] = 1;
      } else {
        hotelRequests[hotelName]++;
      }
    });

    const labels = Object.keys(hotelRequests);
    const data = Object.values(hotelRequests);

    const ctx = document.getElementById('lineGraph');
    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Requests Per Hotel',
          data: data,
          borderColor: 'rgba(70, 130, 180, 1)',
          borderWidth: 5
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 10
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const hotelName = context.dataset.label;
                const requestCount = context.parsed.y;
                return `Requests: ${requestCount}`;
              }
            },
            position: 'nearest',
            intersect: false,
            mode: 'index',
            intersect: false
          }
        }
      }
    });
    setChartInstance(newChartInstance);
  };

  return (
    <div>
      <canvas id="lineGraph"></canvas>
    </div>
  );
};

export default LineGraph;
