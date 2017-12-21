import React from 'react';
import ReactDOM from 'react-dom';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush}  from 'recharts';

const data = [
      {name: 'Page A', inside: 4000, outside: 2400, amt: 2400},
      {name: 'Page B', inside: 3000, outside: 1398, amt: 2210},
      {name: 'Page C', inside: 2000, outside: 9800, amt: 2290},
      {name: 'Page D', inside: 2780, outside: 3908, amt: 2000},
      {name: 'Page E', inside: 1890, outside: 4800, amt: 2181},
      {name: 'Page F', inside: 2390, outside: 3800, amt: 2500},
      {name: 'Page G', inside: 3490, outside: 4300, amt: 2100},
];

export default class SimpleLineChart extends React.Component {
	render () {
  	return (
    	<LineChart width={600} height={300} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line name="Inside" type="monotone" dataKey="inside" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line name="Outside" type="monotone" dataKey="outside" stroke="#82ca9d" />
      </LineChart>
    );
  }
}