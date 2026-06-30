import { useEffect, useState } from "react";
import { getRecommendations } from "../services/recommendationService";

import DashboardLayout from "../layouts/DashboardLayout";
import RecommendationCard from "../components/cards/RecommendationCard";

import { toast } from "react-toastify";

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRecommendations(data);
        toast.success("Recommendations loaded successfully!", {
          toastId: "recommendations-success",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load recommendations");
      } 
    };

    fetchRecommendations();
  }, []);


  return (
    <DashboardLayout>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Smart Recommendations
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {
          recommendations.map((item) => (

          <RecommendationCard
              key={item.id}
              appliance={item.title}
              time={item.priority}
              description={item.description}
          />
        ))
      }
        </div>

      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;