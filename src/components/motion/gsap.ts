"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const FULL_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

export { gsap, useGSAP };
