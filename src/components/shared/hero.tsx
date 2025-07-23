import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div className="relative px-4 pt-16 mx-auto lg:py-32 md:px-8 xl:px-20 sm:max-w-xl md:max-w-full">
      <div className="max-w-xl mx-auto lg:max-w-screen-xl">
        <div className="mb-16 lg:max-w-lg lg:mb-0">
          <div className="max-w-xl mb-6">
            <div>
              <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-green-100">
                Fin-Flow
              </p>
            </div>
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
              Visualize Market Volatility
              <br className="hidden md:block" />
              and Performance Over{" "}
              <span className="inline-block text-deep-purple-accent-400">
                Time with Fin-Flow
              </span>
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              Fin-Flow is your interactive financial calendar dashboard —
              explore market trends, volatility heatmaps, liquidity metrics, and
              performance indicators across daily, weekly, and monthly views.
              Make smarter decisions with clearer insights.
            </p>
          </div>
          <div className="flex flex-col w-full md:flex-row md:w-fit gap-3">
            <Link href={"/dashboard"}>
              <Button className="cursor-pointer">Get started</Button>
            </Link>
            <Link href={"/about"}>
              <Button className="cursor-pointer" variant={"outline"}>
                Know More
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center h-full overflow-hidden lg:w-2/3 xl:w-1/2 mx-16 lg:absolute lg:justify-start lg:bottom-0 lg:right-0 lg:items-end">
        <img
          src="https://kitwind.io/assets/kometa/full-browser.png"
          className="object-cover object-top w-full h-64 max-w-xl -mb-16 rounded shadow-2xl lg:ml-64 xl:ml-8 lg:-mb-24 xl:-mb-28 lg:h-auto lg:max-w-screen-md"
          alt="Fin-Flow Preview"
        />
      </div>
    </div>
  );
}
