import { useEffect } from "react";

import { adsConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Ad placeholders.
 *
 * Nothing renders and no third-party script loads until VITE_ADSENSE_CLIENT_ID
 * holds a real publisher ID, so the layout never shows an empty grey block and
 * no fake or simulated advertising is ever displayed. Once a publisher ID is
 * configured, slots render a labelled, clearly separated container that real ad
 * code can mount into — never beside a calculate button or over the results.
 */

type Placement = "top" | "in-content" | "bottom";

const heights: Record<Placement, string> = {
  top: "min-h-[90px]",
  "in-content": "min-h-[250px]",
  bottom: "min-h-[250px]",
};

interface AdSlotProps {
  placement?: Placement;
  device?: "all" | "mobile" | "desktop";
  className?: string;
  slotId?: string;
}

export function AdSlot({
  placement = "in-content",
  device = "all",
  className,
  slotId,
}: AdSlotProps) {
  useEffect(() => {
    if (!adsConfig.enabled || !slotId) return;

    try {
      ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle ||= []).push({});
    } catch {
      // AdSense can be blocked by browser extensions; the content remains usable.
    }
  }, [slotId]);

  if (!adsConfig.enabled || !slotId) return null;

  return (
    <aside
      aria-label="Advertisement"
      data-ad-placement={placement}
      data-ad-slot={slotId}
      className={cn(
        "my-10 rounded-xl border border-dashed border-border bg-muted/40 p-3",
        heights[placement],
        device === "mobile" && "md:hidden",
        device === "desktop" && "hidden md:block",
        className,
      )}
    >
      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        Advertisement
      </p>
      <ins
        className="adsbygoogle block h-full w-full"
        style={{ display: "block" }}
        data-ad-client={adsConfig.clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

export const TopAdSlot = (props: Omit<AdSlotProps, "placement">) => (
  <AdSlot {...props} placement="top" />
);
export const InContentAdSlot = (props: Omit<AdSlotProps, "placement">) => (
  <AdSlot {...props} placement="in-content" />
);
export const BottomAdSlot = (props: Omit<AdSlotProps, "placement">) => (
  <AdSlot {...props} placement="bottom" />
);
export const MobileAdSlot = (props: Omit<AdSlotProps, "device">) => (
  <AdSlot {...props} device="mobile" />
);
export const DesktopAdSlot = (props: Omit<AdSlotProps, "device">) => (
  <AdSlot {...props} device="desktop" />
);
