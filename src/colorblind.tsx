import type { LaunchProps } from "@raycast/api";
import {
  Action,
  ActionPanel,
  Clipboard,
  Detail,
  Form,
  getSelectedText,
  Icon,
  showToast,
  Toast,
} from "@raycast/api";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { useEffect, useRef, useState } from "react";

import {
  DelphitoolsInstallStatusView,
  getDelphitoolsInstallStatus,
} from "./delphitools-install";

const execFileAsync = promisify(execFile);

type ColorBlindnessType =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "protanomaly"
  | "deuteranomaly"
  | "tritanomaly"
  | "achromatopsia"
  | "achromatomaly";

type FormValues = {
  colour: string;
  type: ColorBlindnessType;
};

type ColorBlindnessResult = {
  colour: string;
  simulatedColour: string;
  type: ColorBlindnessType;
};

const DEFAULT_COLOUR = "#e63946";
const DEFAULT_TYPE: ColorBlindnessType = "normal";

const COLOR_BLINDNESS_TYPES: Array<{
  label: string;
  value: ColorBlindnessType;
}> = [
  { label: "Normal", value: "normal" },
  { label: "Protanopia", value: "protanopia" },
  { label: "Deuteranopia", value: "deuteranopia" },
  { label: "Tritanopia", value: "tritanopia" },
  { label: "Protanomaly", value: "protanomaly" },
  { label: "Deuteranomaly", value: "deuteranomaly" },
  { label: "Tritanomaly", value: "tritanomaly" },
  { label: "Achromatopsia", value: "achromatopsia" },
  { label: "Achromatomaly", value: "achromatomaly" },
];

export default function Command(
  props: LaunchProps<{ arguments: Arguments.Colorblind }>,
) {
  return (
    <ColorBlindnessCommand
      initialColour={props.arguments.colour}
      initialType={getInitialColorBlindnessType(props.arguments.type)}
    />
  );
}

function ColorBlindnessCommand({
  initialColour = "",
  initialType = DEFAULT_TYPE,
}: {
  initialColour?: string;
  initialType?: ColorBlindnessType;
}) {
  const [isDelphitoolsInstalled, setIsDelphitoolsInstalled] =
    useState<boolean>();

  useEffect(() => {
    async function checkInstallStatus() {
      const status = await getDelphitoolsInstallStatus();

      setIsDelphitoolsInstalled(status.installed);
    }

    checkInstallStatus();
  }, []);

  if (isDelphitoolsInstalled === false) {
    return <DelphitoolsInstallStatusView status={{ installed: false }} />;
  }

  return (
    <ColorBlindnessForm
      initialColour={initialColour}
      initialType={initialType}
    />
  );
}

function ColorBlindnessForm({
  initialColour,
  initialType,
}: {
  initialColour: string;
  initialType: ColorBlindnessType;
}) {
  const [values, setValues] = useState<FormValues>({
    colour: initialColour || DEFAULT_COLOUR,
    type: initialType,
  });
  const [result, setResult] = useState<ColorBlindnessResult>();
  const [isProcessing, setIsProcessing] = useState(false);
  const lastToastErrorRef = useRef("");

  useEffect(() => {
    async function hydrateInitialColour() {
      const colour = await getInitialColour();

      if (!colour) {
        return;
      }

      setValues((currentValues) => {
        if (currentValues.colour !== DEFAULT_COLOUR) {
          return currentValues;
        }

        return {
          ...currentValues,
          colour,
        };
      });
    }

    hydrateInitialColour();
  }, []);

  useEffect(() => {
    if (!values.colour.trim()) {
      setResult(undefined);
      lastToastErrorRef.current = "";
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    const timeout = setTimeout(async () => {
      try {
        const simulatedColour = await runColorBlindnessSimulation(
          values.colour,
          values.type,
        );

        setResult({
          colour: values.colour,
          simulatedColour,
          type: values.type,
        });
        lastToastErrorRef.current = "";
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const toastErrorKey = `${values.type}:${values.colour}:${message}`;

        setResult(undefined);

        if (lastToastErrorRef.current !== toastErrorKey) {
          lastToastErrorRef.current = toastErrorKey;
          await showToast({
            style: Toast.Style.Failure,
            title: "Could not simulate colour blindness",
            message,
          });
        }
      } finally {
        setIsProcessing(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [values.colour, values.type]);

  async function copySimulatedColour() {
    if (!result) {
      return;
    }

    await Clipboard.copy(result.simulatedColour);
    await showToast({
      style: Toast.Style.Success,
      title: "Copied Simulated Colour",
    });
  }

  async function copyPreviewUrl() {
    const previewUrl = getPreviewImageUrl(result ?? values);

    await Clipboard.copy(previewUrl);
    await showToast({
      style: Toast.Style.Success,
      title: "Copied Preview Image URL",
    });
  }

  return (
    <Form
      isLoading={isProcessing}
      actions={
        <ActionPanel>
          {result ? (
            <Action.Push
              icon={Icon.Eye}
              title="Show Colour Blindness Preview"
              target={<ColorBlindnessDetail result={result} />}
            />
          ) : null}
          <Action
            icon={Icon.Clipboard}
            title="Copy Simulated Colour"
            onAction={copySimulatedColour}
          />
          <Action.CopyToClipboard
            title="Copy Source Colour"
            content={values.colour}
            shortcut={{ modifiers: ["cmd"], key: "b" }}
          />
          <Action
            icon={Icon.Link}
            title="Copy Preview Image URL"
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            onAction={copyPreviewUrl}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="colour"
        title="Colour"
        placeholder="#e63946, red, rgb(230 57 70), hsl(355 78% 56%)"
        value={values.colour}
        onChange={(colour) =>
          setValues((currentValues) => ({
            ...currentValues,
            colour,
          }))
        }
      />
      <Form.Dropdown
        id="type"
        title="Colour Blindness Type"
        value={values.type}
        onChange={(type) =>
          setValues((currentValues) => ({
            ...currentValues,
            type: type as ColorBlindnessType,
          }))
        }
      >
        {COLOR_BLINDNESS_TYPES.map((type) => (
          <Form.Dropdown.Item
            key={type.value}
            title={type.label}
            value={type.value}
          />
        ))}
      </Form.Dropdown>
      <Form.Description
        title="Simulated Colour"
        text={getResultText(result, isProcessing)}
      />
    </Form>
  );
}

function ColorBlindnessDetail({ result }: { result: ColorBlindnessResult }) {
  async function copySimulatedColour() {
    await Clipboard.copy(result.simulatedColour);
    await showToast({
      style: Toast.Style.Success,
      title: "Copied Simulated Colour",
    });
  }

  return (
    <Detail
      markdown={getDetailMarkdown(result)}
      actions={
        <ActionPanel>
          <Action
            icon={Icon.Clipboard}
            title="Copy Simulated Colour"
            onAction={copySimulatedColour}
          />
          <Action.CopyToClipboard
            title="Copy Source Colour"
            content={result.colour}
            shortcut={{ modifiers: ["cmd"], key: "b" }}
          />
          <Action.CopyToClipboard
            title="Copy Preview Image URL"
            content={getPreviewImageUrl(result)}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Source Colour"
            text={result.colour}
            icon={{ source: Icon.Circle, tintColor: result.colour }}
          />
          <Detail.Metadata.Label
            title="Simulated Colour"
            text={result.simulatedColour}
            icon={{
              source: Icon.Circle,
              tintColor: result.simulatedColour,
            }}
          />
          <Detail.Metadata.Label
            title="Colour Blindness Type"
            text={getColorBlindnessTypeLabel(result.type)}
          />
        </Detail.Metadata>
      }
    />
  );
}

async function getInitialColour(): Promise<string> {
  try {
    const selectedText = await getSelectedText();

    if (selectedText.trim()) {
      return selectedText.trim();
    }
  } catch {
    // Selection is optional; clipboard is the fallback source.
  }

  return ((await Clipboard.readText()) ?? "").trim();
}

async function runColorBlindnessSimulation(
  colour: string,
  type: ColorBlindnessType,
): Promise<string> {
  const { stdout } = await execFileAsync("delphitools", [
    "colorblind",
    "--json",
    "--colour",
    "--cb-type",
    type,
    colour,
  ]);

  return parseColourOutput(stdout);
}

function parseColourOutput(stdout: string): string {
  const parsed = JSON.parse(stdout) as unknown;

  if (typeof parsed === "string") {
    return parsed;
  }

  if (parsed && typeof parsed === "object") {
    for (const key of ["hex", "colour", "color", "result"]) {
      const value = (parsed as Record<string, unknown>)[key];

      if (typeof value === "string") {
        return value;
      }
    }
  }

  throw new Error("Unexpected colour blindness output from delphitools.");
}

function getInitialColorBlindnessType(
  type: string | undefined,
): ColorBlindnessType {
  return isColorBlindnessType(type) ? type : DEFAULT_TYPE;
}

function isColorBlindnessType(
  type: string | undefined,
): type is ColorBlindnessType {
  return COLOR_BLINDNESS_TYPES.some((item) => item.value === type);
}

function getColorBlindnessTypeLabel(type: ColorBlindnessType): string {
  return (
    COLOR_BLINDNESS_TYPES.find((item) => item.value === type)?.label ?? "Normal"
  );
}

function getResultText(
  result: ColorBlindnessResult | undefined,
  isProcessing: boolean,
): string {
  if (isProcessing) {
    return result ? `${result.simulatedColour}...` : "...";
  }

  return result?.simulatedColour || " ";
}

function getDetailMarkdown(result: ColorBlindnessResult): string {
  return [
    `![Colour blindness preview](${getPreviewImageUrl(result)})`,
    "",
    `# ${getColorBlindnessTypeLabel(result.type)}`,
    "",
    `Source: \`${result.colour}\``,
    "",
    `Simulated: \`${result.simulatedColour}\``,
  ].join("\n");
}

function getPreviewImageUrl({
  colour,
  type,
}: {
  colour: string;
  type: ColorBlindnessType;
}): string {
  const params = new URLSearchParams({
    color: colour,
  });

  if (type !== "normal") {
    params.set("type", type);
  }

  return `http://localhost:3000/colorblind-sim/image?${params.toString()}`;
}
