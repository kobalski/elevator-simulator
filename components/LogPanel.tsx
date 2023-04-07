import { LogViewer } from "@patternfly/react-log-viewer";
import React from "react";

type LogPanelProps = {
  simulatorTime: number;
  mode: string;
  logs: string[];
};
const LogPanel = ({ simulatorTime, mode, logs }: LogPanelProps) => {
  return (
    <>
      <div className="flex justify-start gap-4 mb-5">
        <h2 className="text-3xl text-blue-500 text-center">
          Simulator Timer: {simulatorTime}
        </h2>
        <h2 className="text-3xl text-blue-500 text-center">Mode: {mode}</h2>
      </div>
      <div className="mr-10">
        <LogViewer
          hasLineNumbers={true}
          height={700}
          width="%100"
          scrollToRow={logs.length}
          data={logs}
          theme="dark"
        />
      </div>
    </>
  );
};

export default LogPanel;
