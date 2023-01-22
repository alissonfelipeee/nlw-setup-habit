import { useContext } from "react";
import { NewHabit } from "../components/NewHabit";
import { SummaryTable } from "../components/SummaryTable";
import { Context } from "../context/UserContext";
import summaryExample from "../assets/summary-example.png";

export function Home() {
  const { user } = useContext(Context);

  return (
    <>
      <div className="flex items-center justify-center">
        {user ? (
          <div className="w-full max-w-5xl px-8 flex flex-col items-end gap-8">
            <NewHabit />
            <SummaryTable />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl font-bold text-center">
              Comece a controlar seus hábitos agora!
            </h1>
            <div className="w-full max-w-5xl">
              <img src={summaryExample} alt="Summary example" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
