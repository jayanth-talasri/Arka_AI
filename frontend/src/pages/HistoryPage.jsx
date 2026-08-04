import {useEffect,useState} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {getHistory} from "../services/historyService";

const HistoryPage=()=>{

    const [history,setHistory]=useState([]);

        useEffect(()=>{

            load();

        },[]);

        const load=async()=>{

            const data=await getHistory();

            setHistory(data);

        }

        return(

            <DashboardLayout>

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-2xl font-bold mb-5">

                    Prediction History

                </h2>

                <table className="w-full">

                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Radiation</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            history.map((item,index)=>(

                            <tr key={index}>

                                <td>{item.date}</td>

                                <td>{item.predicted_radiation}</td>

                                <td>{item.status}</td>

                            </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </DashboardLayout>

    )

}

export default HistoryPage;