import {

    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer

} from "recharts";

const COLORS=[

    "#16a34a",
    "#f59e0b",
    "#3b82f6"

];

const SavingsChart=({data})=>{

    return(

        <ResponsiveContainer
            width="100%"
            height={320}
        >

            <PieChart>

                <Pie

                    data={data}

                    dataKey="value"

                    nameKey="name"

                    outerRadius={110}

                    innerRadius={70}

                    paddingAngle={5}

                >

                    {

                        data.map((entry,index)=>(

                            <Cell

                                key={index}

                                fill={COLORS[index]}

                            />

                        ))

                    }

                </Pie>

                <Tooltip/>

            </PieChart>

        </ResponsiveContainer>

    );

};

export default SavingsChart;