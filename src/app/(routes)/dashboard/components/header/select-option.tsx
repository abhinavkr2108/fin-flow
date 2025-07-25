"use client";

import { useId, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCryptoStore } from "@/store";

const cryptoCurrencies = [
  { value: "bitcoin", label: "Bitcoin (BTC)" },
  { value: "ethereum", label: "Ethereum (ETH)" },
  { value: "usd-coin", label: "USD Coin (USDC)" },
  { value: "binance-usd", label: "Binance USD" },
  { value: "cardano", label: "Cardano (ADA)" },
  { value: "dogecoin", label: "Dogecoin (DOGE)" },
  { value: "matic-network", label: "Polygon (MATIC)" },
  { value: "ripple", label: "Ripple (XRP)" },
  { value: "tether", label: "Tether (USDT)" },
];

export default function SelectOption() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { setSelectedCrypto, selectedCrypto } = useCryptoStore();

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span
              className={cn(
                "truncate",
                !selectedCrypto && "text-muted-foreground"
              )}
            >
              {selectedCrypto
                ? cryptoCurrencies.find((c) => c.value === selectedCrypto)
                    ?.label
                : "Select Crypto Currency"}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search crypto currencies..." />
            <CommandList>
              <CommandEmpty>No crypto currencies found.</CommandEmpty>
              <CommandGroup>
                <span className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                  Crypto Currencies
                </span>
                {cryptoCurrencies.map((coin) => (
                  <CommandItem
                    key={coin.value}
                    value={coin.value}
                    onSelect={(value) => {
                      setSelectedCrypto(value);
                      setOpen(false);
                    }}
                  >
                    {coin.label}
                    {selectedCrypto === coin.value && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
