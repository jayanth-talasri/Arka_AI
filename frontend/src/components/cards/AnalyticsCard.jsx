const AnalyticsCard = ({

    title,
    children

}) => {

    return (

        <div className="

            backdrop-blur-lg
            bg-white/80
            border
            border-white/40
            rounded-3xl
            p-6
            shadow-xl
            hover:shadow-2xl
            transition-all
            duration-300

        ">

            <h2 className="

                text-xl
                font-bold
                mb-6
                text-gray-800

            ">

                {title}

            </h2>

            {children}

        </div>

    );

};

export default AnalyticsCard;