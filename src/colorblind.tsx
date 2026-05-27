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
import { createTempSwatchPng, normaliseHexColour } from "./swatch-png";

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

type ColorBlindnessCliResult = {
  colour: string;
  simulatedColour: string;
};

type SwatchPreview = {
  sourcePath: string;
  simulatedPath: string;
};

const DEFAULT_COLOUR = "#e63946";
const DEFAULT_TYPE: ColorBlindnessType = "normal";
const SWATCH_NAMESPACE = "colorblind";

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
        const nextResult = await runColorBlindnessSimulation(
          values.colour,
          values.type,
        );

        setResult({
          colour: nextResult.colour,
          simulatedColour: nextResult.simulatedColour,
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
  const [swatchPreview, setSwatchPreview] = useState<SwatchPreview>();
  const [swatchError, setSwatchError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function createPreview() {
      try {
        const nextSwatchPreview = {
          sourcePath: await createSwatchPng(result.colour),
          simulatedPath: await createSwatchPng(result.simulatedColour),
        };

        if (!isMounted) {
          return;
        }

        setSwatchPreview(nextSwatchPreview);
        setSwatchError("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSwatchPreview(undefined);
        setSwatchError(error instanceof Error ? error.message : String(error));
      }
    }

    createPreview();

    return () => {
      isMounted = false;
    };
  }, [result.colour, result.simulatedColour]);

  async function copySimulatedColour() {
    await Clipboard.copy(result.simulatedColour);
    await showToast({
      style: Toast.Style.Success,
      title: "Copied Simulated Colour",
    });
  }

  return (
    <Detail
      isLoading={!swatchPreview && !swatchError}
      markdown={getDetailMarkdown(result, swatchPreview, swatchError)}
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
          {swatchPreview ? (
            <Action.CopyToClipboard
              title="Copy Simulated Swatch Path"
              content={swatchPreview.simulatedPath}
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            />
          ) : null}
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
): Promise<ColorBlindnessCliResult> {
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

function parseColourOutput(stdout: string): ColorBlindnessCliResult {
  const parsed = JSON.parse(stdout) as unknown;

  if (typeof parsed === "string") {
    const colour = normaliseHexColour(parsed);

    return {
      colour,
      simulatedColour: colour,
    };
  }

  if (parsed && typeof parsed === "object") {
    const output = parsed as Record<string, unknown>;

    for (const key of ["hex", "colour", "color", "result"]) {
      const value = output[key];

      if (typeof value === "string") {
        return {
          colour: getOriginalHex(output) ?? normaliseHexColour(value),
          simulatedColour: normaliseHexColour(value),
        };
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

function getDetailMarkdown(
  result: ColorBlindnessResult,
  swatchPreview: SwatchPreview | undefined,
  swatchError: string,
): string {
  if (swatchError) {
    return [
      `# ${getColorBlindnessTypeLabel(result.type)}`,
      "",
      "Could not generate swatch preview.",
      "",
      swatchError,
      "",
      `Source: \`${result.colour}\``,
      "",
      `Simulated: \`${result.simulatedColour}\``,
    ].join("\n");
  }

  if (!swatchPreview) {
    return [
      `# ${getColorBlindnessTypeLabel(result.type)}`,
      "",
      "Generating swatch preview...",
    ].join("\n");
  }

  return [
    `# ${getColorBlindnessTypeLabel(result.type)}`,
    "",
    `| Original | ${getColorBlindnessTypeLabel(result.type)} |`,
    "| --- | --- |",
    `| ![Original swatch](${swatchPreview.sourcePath}) | ![Simulated swatch](${swatchPreview.simulatedPath}) |`,
    `| \`${result.colour}\` | \`${result.simulatedColour}\` |`,
  ].join("\n");
}

function getOriginalHex(output: Record<string, unknown>): string | undefined {
  for (const key of ["original_hex", "originalHex", "input"]) {
    const value = output[key];

    if (typeof value === "string") {
      return normaliseHexColour(value);
    }
  }

  return undefined;
}

async function createSwatchPng(colour: string): Promise<string> {
  return createTempSwatchPng({
    colour,
    namespace: SWATCH_NAMESPACE,
  });
}
