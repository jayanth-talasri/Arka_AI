import aiApi from "./aiApi";

export const getHistory=async()=>{

const response=await aiApi.get("/history/history");

return response.data;

}