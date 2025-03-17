import { HelpTooltip } from "@/components/HelpTooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { WorkflowBlockInput } from "@/components/WorkflowBlockInput";
import { WorkflowBlockInputTextarea } from "@/components/WorkflowBlockInputTextarea";
import { CodeEditor } from "@/routes/workflows/components/CodeEditor";
import { useDeleteNodeCallback } from "@/routes/workflows/hooks/useDeleteNodeCallback";
import { useNodeLabelChangeHandler } from "@/routes/workflows/hooks/useLabelChangeHandler";
import { WorkflowBlockTypes } from "@/routes/workflows/types/workflowTypes";
import {
  Handle,
  NodeProps,
  Position,
  useEdges,
  useNodes,
  useReactFlow,
} from "@xyflow/react";
import { useState } from "react";
import { helpTooltips, placeholders } from "../../helpContent";
import { EditableNodeTitle } from "../components/EditableNodeTitle";
import { NodeActionMenu } from "../NodeActionMenu";
import { errorMappingExampleValue } from "../types";
import { WorkflowBlockIcon } from "../WorkflowBlockIcon";
import { ParametersMultiSelect } from "../TaskNode/ParametersMultiSelect";
import { AppNode } from "..";
import { getAvailableOutputParameterKeys } from "../../workflowEditorUtils";
import { useIsFirstBlockInWorkflow } from "../../hooks/useIsFirstNodeInWorkflow";
import type { CookieNavNode } from "./types";
import { Button } from "@/components/ui/button";

function CookieNavNodeComponent({ id, data }: NodeProps<CookieNavNode>) {
  const { updateNodeData } = useReactFlow();
  const { editable } = data;
  const [label, setLabel] = useNodeLabelChangeHandler({
    id,
    initialValue: data.label,
  });
  const [inputs, setInputs] = useState({
    url: data.url,
    navigationGoal: data.navigationGoal,
    errorCodeMapping: data.errorCodeMapping,
    maxRetries: data.maxRetries,
    maxStepsOverride: data.maxStepsOverride,
    allowDownloads: data.allowDownloads,
    continueOnFailure: data.continueOnFailure,
    cacheActions: data.cacheActions,
    downloadSuffix: data.downloadSuffix,
    totpVerificationUrl: data.totpVerificationUrl,
    totpIdentifier: data.totpIdentifier,
    completeCriterion: data.completeCriterion,
    terminateCriterion: data.terminateCriterion,
    cookies: data.cookies,
  });
  const deleteNodeCallback = useDeleteNodeCallback();

  const nodes = useNodes<AppNode>();
  const edges = useEdges();
  const outputParameterKeys = getAvailableOutputParameterKeys(nodes, edges, id);

  const isFirstWorkflowBlock = useIsFirstBlockInWorkflow({ id });

  function handleChange(key: string, value: unknown) {
    if (!editable) {
      return;
    }
    setInputs({ ...inputs, [key]: value });
    updateNodeData(id, { [key]: value });
  }

  function saveCookiesToFile(cookiesJson: string) {
    try {
      // Create a hidden link element to trigger download
      const element = document.createElement("a");
      const file = new Blob([cookiesJson], { type: "application/json" });
      element.href = URL.createObjectURL(file);
      element.download = "temp_cookies.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      console.log("Cookies saved to temp_cookies.json");
    } catch (e) {
      console.error("Error saving cookies to file:", e);
    }
  }

  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="opacity-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        className="opacity-0"
      />
      <div className="w-[30rem] space-y-4 rounded-lg bg-slate-elevation3 px-6 py-4">
        <header className="flex h-[2.75rem] justify-between">
          <div className="flex gap-2">
            <div className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded border border-slate-600">
              <WorkflowBlockIcon
                workflowBlockType={WorkflowBlockTypes.Navigation}
                className="size-6"
              />
            </div>
            <div className="flex flex-col gap-1">
              <EditableNodeTitle
                value={label}
                editable={editable}
                onChange={setLabel}
                titleClassName="text-base"
                inputClassName="text-base"
              />
              <span className="text-xs text-slate-400">
                Cookie Navigation Block
              </span>
            </div>
          </div>
          <NodeActionMenu
            onDelete={() => {
              deleteNodeCallback(id);
            }}
          />
        </header>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label className="text-xs text-slate-300">
                Cookies (JSON format)
              </Label>
              <HelpTooltip content="Specify cookies to inject before navigation. Should be an array of objects with name, value, domain, and path properties." />
            </div>
            <CodeEditor
              value={inputs.cookies}
              onChange={(value) => {
                handleChange("cookies", value);
              }}
              language="json"
              className="nowheel nopan"
            />
            <div className="rounded-md bg-slate-800 p-2">
              <div className="space-y-1 text-xs text-slate-400">
                Example:{" "}
                {`[{"name": "sessionId", "value": "abc123", "domain": "example.com", "path": "/"}]`}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Label className="text-xs text-slate-300">URL</Label>
                <HelpTooltip content={helpTooltips["navigation"]["url"]} />
              </div>
              {isFirstWorkflowBlock ? (
                <div className="flex justify-end text-xs text-slate-400">
                  Tip: Use the {"+"} button to add parameters!
                </div>
              ) : null}
            </div>

            <WorkflowBlockInputTextarea
              nodeId={id}
              onChange={(value) => {
                handleChange("url", value);
              }}
              value={inputs.url}
              placeholder={placeholders["navigation"]["url"]}
              className="nopan text-xs"
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label className="text-xs text-slate-300">Navigation Goal</Label>
              <HelpTooltip
                content={helpTooltips["navigation"]["navigationGoal"]}
              />
            </div>
            <WorkflowBlockInputTextarea
              nodeId={id}
              onChange={(value) => {
                handleChange("navigationGoal", value);
              }}
              value={inputs.navigationGoal}
              placeholder={placeholders["navigation"]["navigationGoal"]}
              className="nopan text-xs"
            />
          </div>
          <div className="rounded-md bg-slate-800 p-2">
            <div className="space-y-1 text-xs text-slate-400">
              Tip: Try to phrase your prompt as a goal with an explicit
              completion criteria. While executing, Skyvern will take as many
              actions as necessary to accomplish the goal. Use words like
              "Complete" or "Terminate" to help Skyvern identify when it's
              finished or when it should give up.
            </div>
          </div>
        </div>
        <Separator />
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced" className="border-b-0">
            <AccordionTrigger className="py-0">
              Advanced Settings
            </AccordionTrigger>
            <AccordionContent className="pl-6 pr-1 pt-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <ParametersMultiSelect
                    parameters={data.parameterKeys}
                    availableOutputParameters={outputParameterKeys}
                    onParametersChange={(values) => {
                      updateNodeData(id, { parameterKeys: values });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-300">
                    Complete if...
                  </Label>
                  <WorkflowBlockInputTextarea
                    nodeId={id}
                    onChange={(value) => {
                      handleChange("completeCriterion", value);
                    }}
                    value={inputs.completeCriterion}
                    className="nopan text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-300">
                    Terminate if...
                  </Label>
                  <WorkflowBlockInputTextarea
                    nodeId={id}
                    onChange={(value) => {
                      handleChange("terminateCriterion", value);
                    }}
                    value={inputs.terminateCriterion}
                    className="nopan text-xs"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Max Retries
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["navigation"]["maxRetries"]}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder={placeholders["navigation"]["maxRetries"]}
                    className="nopan w-52 text-xs"
                    min="0"
                    value={inputs.maxRetries ?? ""}
                    onChange={(event) => {
                      const value =
                        event.target.value === ""
                          ? null
                          : Number(event.target.value);
                      handleChange("maxRetries", value);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Max Steps Override
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["navigation"]["maxStepsOverride"]}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder={placeholders["navigation"]["maxStepsOverride"]}
                    className="nopan w-52 text-xs"
                    min="0"
                    value={inputs.maxStepsOverride ?? ""}
                    onChange={(event) => {
                      const value =
                        event.target.value === ""
                          ? null
                          : Number(event.target.value);
                      handleChange("maxStepsOverride", value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <div className="flex gap-2">
                      <Label className="text-xs font-normal text-slate-300">
                        Error Messages
                      </Label>
                      <HelpTooltip
                        content={helpTooltips["navigation"]["errorCodeMapping"]}
                      />
                    </div>
                    <Checkbox
                      checked={inputs.errorCodeMapping !== "null"}
                      disabled={!editable}
                      onCheckedChange={(checked) => {
                        handleChange(
                          "errorCodeMapping",
                          checked
                            ? JSON.stringify(errorMappingExampleValue, null, 2)
                            : "null",
                        );
                      }}
                    />
                  </div>
                  {inputs.errorCodeMapping !== "null" && (
                    <div>
                      <CodeEditor
                        language="json"
                        value={inputs.errorCodeMapping}
                        onChange={(value) => {
                          handleChange("errorCodeMapping", value);
                        }}
                        className="nowheel nopan"
                        fontSize={8}
                      />
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Continue on Failure
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["navigation"]["continueOnFailure"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.continueOnFailure}
                      onCheckedChange={(checked) => {
                        handleChange("continueOnFailure", checked);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Cache Actions
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["navigation"]["cacheActions"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.cacheActions}
                      onCheckedChange={(checked) => {
                        handleChange("cacheActions", checked);
                      }}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Complete on Download
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["navigation"]["completeOnDownload"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.allowDownloads}
                      onCheckedChange={(checked) => {
                        handleChange("allowDownloads", checked);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      File Suffix
                    </Label>
                    <HelpTooltip content="Specify a suffix to append to downloaded files" />
                  </div>
                  <WorkflowBlockInput
                    nodeId={id}
                    type="text"
                    placeholder={placeholders["navigation"]["downloadSuffix"]}
                    className="nopan w-52 text-xs"
                    value={inputs.downloadSuffix ?? ""}
                    onChange={(value) => {
                      handleChange("downloadSuffix", value);
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-slate-300">
                      2FA Identifier
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["navigation"]["totpIdentifier"]}
                    />
                  </div>
                  <WorkflowBlockInputTextarea
                    nodeId={id}
                    onChange={(value) => {
                      handleChange("totpIdentifier", value);
                    }}
                    value={inputs.totpIdentifier ?? ""}
                    placeholder={placeholders["navigation"]["totpIdentifier"]}
                    className="nopan text-xs"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          onClick={() => saveCookiesToFile(inputs.cookies)}
          size="sm"
          variant="outline"
          className="mt-2"
        >
          Save Cookies to File
        </Button>
      </div>
    </div>
  );
}

export { CookieNavNodeComponent };
