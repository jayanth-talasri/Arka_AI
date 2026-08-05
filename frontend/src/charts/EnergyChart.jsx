import {

    ResponsiveContainer,
    AreaChart,
    Area,
    Tooltip,
    XAxis,
    CartesianGrid

} from "recharts";

const EnergyChart = ({ data }) => {

    return (

        <ResponsiveContainer
            width="100%"
            height={320}
        >

            <AreaChart data={data}>

                <defs>

                    <linearGradient
                        id="energyGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                        <stop
                            offset="5%"
                            stopColor="#f59e0b"
                            stopOpacity={0.8}
                        />

                        <stop
                            offset="95%"
                            stopColor="#f59e0b"
                            stopOpacity={0}
                        />

                    </linearGradient>

                </defs>

                <CartesianGrid strokeDasharray="4 4"/>

                <XAxis dataKey="name"/>

                <Tooltip/>

                <Area

                    type="monotone"

                    dataKey="value"

                    stroke="#f59e0b"

                    strokeWidth={4}

                    fill="url(#energyGradient)"

                />

            </AreaChart>

        </ResponsiveContainer>

    );

};

export default EnergyChart;