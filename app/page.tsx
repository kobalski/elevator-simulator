"use client";
import _ from "lodash";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl text-blue-500 text-center mt-5 mb-5">
          Elevator Simulator
        </h1>
        <section>
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="max-w-screen-lg text-gray-500 sm:text-lg">
              <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 ">
                Elevator Simulator Challenge with Client/Server Architecture
              </h2>
              <p className="mb-4 font-light">
                You are being asked to design and build the navigation logic for
                an elevator in a building. The building has 6 floors. Each floor
                has a button or buttons outside of the elevator to summon the
                elevator and tell it what direction a passenger wants to go.
                Floors 2-5 have up and down buttons, floor 1 has an up button
                only, and floor 6 has a down button only. The elevator has
                buttons inside for passengers to tell it what floor they want to
                go to, so there are 6 buttons inside, one for each floor. The
                navigation logic you write should asynchronously take button
                presses as input in a format of your choice. This simulates the
                button presses of a “passenger”. To show your navigation logic
                in use, you should log a simulated elevator’s movements and
                stops (in terms of the floor numbers) as output. Model the
                elevator as taking 3 seconds to go from one floor to the next
                and 4 seconds to make a stop at a floor.
              </p>

              <h2 className="mb-2 text-lg font-semibold text-gray-900 ">
                The navigation logic should satisfy these constraints:
              </h2>
              <ul className="space-y-1 text-gray-500 list-disc list-inside ">
                <li>
                  Passengers should be able to press an outside button to summon
                  the elevator to stop at their floor and an inside button to be
                  taken to the specified floor.
                </li>
                <li>
                  A passenger who presses an outside button should be passed by
                  the elevator at most one time before the elevator makes a stop
                  at their floor to pick them up.
                </li>
                <li>
                  A passenger who presses an inside button that is compatible
                  with the elevator’s current direction (e.g. floor 6 when the
                  elevator is at floor 3 traveling upwards) should be taken to
                  that floor without experiencing a change in the elevator’s
                  direction.
                </li>
                <li>
                  A passenger who presses an inside button that is NOT
                  compatible with the elevator’s current direction (e.g. floor 6
                  when the elevator is at floor 3 traveling downwards) should be
                  taken to the requested floor after all requests that are
                  compatible with the elevator’s current direction are
                  fulfilled.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-10 justify-center items-center">
            <Link
              href="/elevator-simulator"
              className="w-44 text-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              Start Simulator
            </Link>
            <a
              href="https://github.com/kobalski/elevator-simulator"
              target="_blank"
              className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
            >
              <svg
                className="w-4 h-4 mr-2 -ml-1"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="github"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
              >
                <path
                  fill="currentColor"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                ></path>
              </svg>
              See code on github
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
