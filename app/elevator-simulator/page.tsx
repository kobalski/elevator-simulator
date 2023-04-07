"use client";
import "@patternfly/react-core/dist/styles/base.css";
import { useEffect, useState } from "react";
import _ from "lodash";
import PusherService from "@/service/pusher.service";
import { ElevatorDispatcherData } from "@/types/ElevatorDispatcherData";
import ClientMode from "@/components/ClientMode";
import ElevatorDispatcher from "@/model/ElevatorDispatcher";
import ServerMode from "@/components/ServerMode";
import { BallTriangle } from "react-loader-spinner";

enum Mode {
  SERVER = "Server",
  CLIENT = "Client",
  UNDECIDED = "Undecided",
}
export default function Home() {
  const [mode, setMode] = useState(Mode.UNDECIDED);
  useEffect(() => {
    const messageCallback = (data: ElevatorDispatcherData) => {
      if (data) {
        setMode(Mode.CLIENT);
        clearTimeout(timeout);
      }
    };
    const pusherService = new PusherService();
    pusherService.bind(messageCallback);
    const timeout = setTimeout(() => {
      pusherService.unbind();
      setMode(Mode.SERVER);
    }, 6000);
    return () => {
      pusherService.unbind;
    };
  }, []);

  return (
    <>
      <h1 className="text-3xl text-blue-500 text-center mt-5 mb-5">
        Elevator Simulator
      </h1>
      {mode === Mode.CLIENT ? (
        <ClientMode dispatcher={new ElevatorDispatcher()} />
      ) : mode === Mode.SERVER ? (
        <ServerMode />
      ) : (
        <div className="flex flex-col justify-center items-center mt-52">
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#87CEEB"
            ariaLabel="ball-triangle-loading"
            visible={true}
          />
          <p className="text-center text-gray-950 mt-20">
            Trying to decide server/client mode. Simulator will start in a few
            seconds.
          </p>
        </div>
      )}
    </>
  );
}
