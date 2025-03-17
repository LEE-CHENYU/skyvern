import type { Node } from "@xyflow/react";
import { NodeBaseData } from "../types";

export type CookieNavNodeData = NodeBaseData & {
  url: string;
  navigationGoal: string;
  errorCodeMapping: string;
  completeCriterion: string;
  terminateCriterion: string;
  maxRetries: number | null;
  maxStepsOverride: number | null;
  allowDownloads: boolean;
  downloadSuffix: string | null;
  parameterKeys: Array<string>;
  totpVerificationUrl: string | null;
  totpIdentifier: string | null;
  cacheActions: boolean;
  cookies: string; // JSON string containing cookie data
};

export type CookieNavNode = Node<CookieNavNodeData, "cookie_nav">;

export const cookieNavNodeDefaultData: CookieNavNodeData = {
  label: "",
  url: "",
  navigationGoal: "",
  completeCriterion: "",
  terminateCriterion: "",
  errorCodeMapping: "null",
  maxRetries: null,
  maxStepsOverride: null,
  allowDownloads: false,
  downloadSuffix: null,
  editable: true,
  parameterKeys: [],
  totpVerificationUrl: null,
  totpIdentifier: null,
  continueOnFailure: false,
  cacheActions: false,
  cookies: "[]", // Default empty array of cookies
} as const;

export function isCookieNavNode(node: Node): node is CookieNavNode {
  return node.type === "cookie_nav";
}
