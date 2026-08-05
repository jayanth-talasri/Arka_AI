import React from "react";
import {
    TrendingUp,
    Circle
} from "lucide-react";

const KPICard = ({
    title,
    value,
    unit,
    icon: Icon = Circle,
    color = "from-amber-500 to-orange-500",
    trend = "+4.8%"
}) => {

    return (

        <div className="
            group
            relative
            overflow-hidden
            rounded-3xl
            bg-white
            p-6
            shadow-lg
            hover:shadow-2xl
            transition-all
            duration-300
            hover:-translate-y-1
        ">

            <div className={`

                absolute
                inset-0
                bg-gradient-to-br
                ${color}
                opacity-5
                group-hover:opacity-10

            `}></div>

            <div className="flex justify-between items-start">

                <div>

                    <p className="text-gray-500 text-sm">

                        {title}

                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {value}

                        <span className="text-base text-gray-500">

                            {" "}{unit}

                        </span>

                    </h2>

                </div>

                <div className={`
                    h-14
                    w-14
                    rounded-2xl
                    bg-gradient-to-br
                    ${color}
                    flex
                    items-center
                    justify-center
                    shadow-lg
                `}>

                    <Icon className="text-white" size={28}/>

                </div>

            </div>

            <div className="mt-5 flex items-center gap-2">

                <TrendingUp
                    size={18}
                    className="text-green-600"
                />

                <span className="text-green-600 font-medium">

                    {trend}

                </span>

                <span className="text-gray-400">

                    since yesterday

                </span>

            </div>

        </div>

    );

};

export default KPICard;