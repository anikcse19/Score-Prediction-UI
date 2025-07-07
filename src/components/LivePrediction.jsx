import { Trophy, CircleDot } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import baseUrl from "../../config";

const LivePrediction = () => {
  const [matchData, setMatchData] = useState(null);
  const [predictionData, setPredictiondata] = useState({});
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get("matchId");

  console.log("mmm", matchId);
  console.log("pred", predictionData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/get-st-single-match/${matchId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setMatchData(data?.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [matchId]);

  console.log(matchData);

  const fetchPredictionData = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/stb?path=Predictions/api/Predictions/getPredictionsByModels/`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log("all pred", data?.result);

      // Find prediction object with entitySportsMatchId === matchId
      const matchedPrediction = data?.result?.find(
        (item) => item?.entitySportsMatchId == matchId
      );

      setPredictiondata(matchedPrediction || {}); // fallback to empty object if not found
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchPredictionData();
  }, [matchId]);

  function formatISOStringToIST(isoString) {
    const date = new Date(isoString);

    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const parts = formatter.formatToParts(date);

    const getPart = (type) => parts.find((p) => p.type === type)?.value;

    return `${getPart("weekday")} ${getPart("day")} ${getPart(
      "month"
    )} at ${getPart("hour")}:${getPart("minute")} ${getPart(
      "dayPeriod"
    )?.toLowerCase()} IST`;
  }

  return (
    <div className="w-full h-[50vh] bg-white dark:bg-gray-800 shadow-md flex flex-col justify-center items-center px-4">
      {/* Live and Match Info */}
      <div className="flex self-baseline">
        <span className="flex bg-red-100 py-2 px-6 rounded-full items-center text-red-600 text-sm mr-2">
          <CircleDot className="w-3 h-3 mr-2 fill-red-600 animate-ping text-red-800" />
          LIVE
        </span>
      </div>

      <div className="flex flex-col items-center justify-center w-full mb-2">
        <div className="flex items-center mb-1"></div>
        <span className="text-gray-600 dark:text-gray-300 text-base text-center">
          {matchData?.created && formatISOStringToIST(matchData?.created)}
        </span>
      </div>

      {/* Match Title */}
      <div className="text-center mb-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
          {matchData?.format_str}, {matchData?.venue?.name},{" "}
          {matchData?.venue?.location}
        </h2>
      </div>

      {/* Teams and Score */}
      <div className="flex justify-center items-center mb-4">
        <div className="flex flex-col items-center mx-4">
          <div className="flex gap-2">
            <img
              src={matchData?.team_a?.logo}
              alt="Turkey Women"
              className="w-8 h-8 mb-1 object-contain"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {matchData?.team_a?.shortname}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {matchData?.team_a?.scores} ({matchData?.team_a?.overs}ov)
          </span>
        </div>

        <span className="mx-2 text-gray-600 dark:text-gray-300">vs</span>

        <div className="flex flex-col items-center mx-4">
          <div className="flex gap-2">
            <img
              src={matchData?.team_b?.logo}
              alt="Turkey Women"
              className="w-8 h-8 mb-1 object-contain"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {matchData?.team_b?.shortname}
            </span>
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {matchData?.team_b?.scores} ({matchData?.team_a?.overs}ov)
          </span>
        </div>
      </div>
      <p className="py-2 text-white">{matchData?.status_note}</p>

      {/* Divider */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-4"></div>

      {/* Prediction and Forecast */}
      {predictionData?.aiWinPrediction && (
        <>
          {/* Prediction and Forecast */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 mb-4">
            <div className="flex flex-col gap-2 items-center mb-2 md:mb-0">
              <span className="text-lg text-black font-semibold dark:text-gray-400">
                Predicted Winner
              </span>
              <span className="flex items-center border p-2 rounded-2xl text-gray-700 dark:text-gray-200 font-medium">
                <Trophy className="w-5 h-5 mr-1 text-yellow-500" />
                {predictionData.aiWinPrediction.teamAProb >
                predictionData.aiWinPrediction.teamBProb
                  ? predictionData.aiWinPrediction.teamAName
                  : predictionData.aiWinPrediction.teamBName}
              </span>
            </div>

            <div className="text-sm flex flex-col gap-2 text-gray-500 dark:text-gray-400">
              <span className="text-lg text-black font-semibold dark:text-gray-400">
                Score Forecast
              </span>
              Score probability will be provided once available
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-600">
                {predictionData.aiWinPrediction.teamAName} (
                {predictionData.aiWinPrediction.teamAProb}%)
              </span>
              <span className="text-red-600">
                {predictionData.aiWinPrediction.teamBName} (
                {predictionData.aiWinPrediction.teamBProb}%)
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full flex overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{
                  width: `${predictionData.aiWinPrediction.teamAProb}%`,
                }}
              ></div>
              <div
                className="bg-red-500 h-full"
                style={{
                  width: `${predictionData.aiWinPrediction.teamBProb}%`,
                }}
              ></div>
            </div>
          </div>
        </>
      )}

      {/* View Prediction Button */}
      <button className="mt-4 text-blue-600 font-medium hover:underline">
        VIEW PREDICTION
      </button>
    </div>
  );
};

export default LivePrediction;
