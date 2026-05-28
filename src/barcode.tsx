import {
  Action,
  ActionPanel,
  Clipboard,
  Detail,
  Form,
  Grid,
  Icon,
  showToast,
  Toast,
  useNavigation,
} from "@raycast/api";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { useEffect, useState } from "react";

import {
  DelphitoolsInstallStatusView,
  getDelphitoolsInstallStatus,
} from "./delphitools-install";

const execFileAsync = promisify(execFile);

type BarcodeFormat =
  | "ean13"
  | "ean8"
  | "upca"
  | "code39"
  | "code128"
  | "codabar"
  | "code93"
  | "itf";

type FormValues = {
  data: string;
  format: BarcodeFormat;
  height: string;
  scale: string;
};

type BarcodeResult = {
  data: string;
  format: BarcodeFormat;
  height: number;
  outputPath: string;
  scale: number;
};

type BarcodeFormatOption = {
  description: string;
  label: string;
  value: BarcodeFormat;
};

const DEFAULT_FORMAT: BarcodeFormat = "code128";
const DEFAULT_HEIGHT = "120";
const DEFAULT_SCALE = "2";
const OUTPUT_NAMESPACE = "barcode";
const PREVIEW_IMAGE_WIDTH = 420;
const FORMAT_PREVIEW_DATA = "Raycast";
const FORMAT_PREVIEW_WIDTH = 520;
const FORMAT_PREVIEW_HEIGHT = 260;
const FORMAT_PREVIEW_VERSION = "v2";

const BARCODE_FORMATS: BarcodeFormatOption[] = [
  { label: "EAN-13", value: "ean13", description: "13-digit retail barcode" },
  { label: "EAN-8", value: "ean8", description: "8-digit retail barcode" },
  { label: "UPC-A", value: "upca", description: "12-digit retail barcode" },
  {
    label: "Code 39",
    value: "code39",
    description: "Uppercase letters, numbers, and symbols",
  },
  {
    label: "Code 128",
    value: "code128",
    description: "General-purpose text and numeric data",
  },
  {
    label: "Codabar",
    value: "codabar",
    description: "Numeric data with a small symbol set",
  },
  {
    label: "Code 93",
    value: "code93",
    description: "Compact alphanumeric barcode",
  },
  { label: "ITF", value: "itf", description: "Even-length numeric data" },
];

export default function Command() {
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
    <BarcodeForm isCheckingInstall={isDelphitoolsInstalled === undefined} />
  );
}

function BarcodeForm({ isCheckingInstall }: { isCheckingInstall: boolean }) {
  const { push } = useNavigation();
  const [format, setFormat] = useState<BarcodeFormat>(DEFAULT_FORMAT);
  const [formatPreviewPaths, setFormatPreviewPaths] =
    useState<Record<BarcodeFormat, string>>();

  useEffect(() => {
    async function loadFormatPreviews() {
      setFormatPreviewPaths(await writeFormatPreviewSvgs());
    }

    loadFormatPreviews();
  }, []);

  async function handleSubmit(values: FormValues) {
    const data = values.data.trim();

    if (!data) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Enter barcode data",
      });
      return;
    }

    const height = parsePositiveInteger(values.height, "Height");
    const scale = parsePositiveInteger(values.scale, "Scale");

    if (height instanceof Error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid barcode settings",
        message: height.message,
      });
      return;
    }

    if (scale instanceof Error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid barcode settings",
        message: scale.message,
      });
      return;
    }

    try {
      const result = await generateBarcode({
        data,
        format: values.format,
        height,
        scale,
      });

      await showToast({
        style: Toast.Style.Success,
        title: "Barcode ready",
      });

      push(<BarcodeDetail result={result} />);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await showToast({
        style: Toast.Style.Failure,
        title: "Could not generate barcode",
        message,
      });
    }
  }

  return (
    <Form
      isLoading={isCheckingInstall}
      actions={
        <ActionPanel>
          <Action.SubmitForm<FormValues>
            icon={Icon.BarCode}
            title="Generate Barcode"
            onSubmit={handleSubmit}
          />
          {formatPreviewPaths ? (
            <Action.Push
              icon={Icon.Eye}
              title="Show Supported Formats"
              target={
                <FormatPreviewGrid
                  previewPaths={formatPreviewPaths}
                  onSelectFormat={setFormat}
                />
              }
            />
          ) : null}
        </ActionPanel>
      }
    >
      <Form.TextArea id="data" title="Data" placeholder="Data to encode" />
      <Form.Dropdown
        id="format"
        title="Format"
        value={format}
        onChange={(value) => setFormat(value as BarcodeFormat)}
      >
        {BARCODE_FORMATS.map((option) => (
          <Form.Dropdown.Item
            key={option.value}
            title={option.label}
            value={option.value}
          />
        ))}
      </Form.Dropdown>
      <Form.Description
        title=""
        text="Use Show Supported Formats to preview all barcode formats."
      />
      <Form.TextField
        id="height"
        title="Height"
        defaultValue={DEFAULT_HEIGHT}
      />
      <Form.TextField id="scale" title="Scale" defaultValue={DEFAULT_SCALE} />
    </Form>
  );
}

function FormatPreviewGrid({
  onSelectFormat,
  previewPaths,
}: {
  onSelectFormat: (format: BarcodeFormat) => void;
  previewPaths: Record<BarcodeFormat, string>;
}) {
  const { pop } = useNavigation();

  return (
    <Grid
      aspectRatio="16/9"
      columns={2}
      fit={Grid.Fit.Contain}
      inset={Grid.Inset.Medium}
      searchBarPlaceholder="Search supported barcode formats"
    >
      {BARCODE_FORMATS.map((format) => (
        <Grid.Item
          key={format.value}
          content={previewPaths[format.value]}
          keywords={[format.value, format.description]}
          title={format.label}
          subtitle={format.description}
          actions={
            <ActionPanel>
              <Action
                icon={Icon.CheckCircle}
                title="Use Format"
                onAction={() => {
                  onSelectFormat(format.value);
                  pop();
                }}
              />
              <Action.CopyToClipboard
                title="Copy CLI Value"
                content={format.value}
              />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  );
}

function BarcodeDetail({ result }: { result: BarcodeResult }) {
  async function copyImage() {
    await Clipboard.copy({ file: result.outputPath });
    await showToast({
      style: Toast.Style.Success,
      title: "Copied Barcode Image",
    });
  }

  return (
    <Detail
      markdown={getDetailMarkdown(result)}
      actions={
        <ActionPanel>
          <Action.Open
            icon={Icon.BarCode}
            title="Open Barcode Image"
            target={result.outputPath}
          />
          <Action
            icon={Icon.Clipboard}
            title="Copy Barcode Image"
            onAction={copyImage}
          />
          <Action.CopyToClipboard
            title="Copy Barcode Image Path"
            content={result.outputPath}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
          <Action.CopyToClipboard
            title="Copy Barcode Data"
            content={result.data}
            shortcut={{ modifiers: ["cmd"], key: "b" }}
          />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Format"
            text={getFormatLabel(result.format)}
          />
          <Detail.Metadata.Label title="Height" text={`${result.height}px`} />
          <Detail.Metadata.Label title="Scale" text={`${result.scale}px`} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Path" text={result.outputPath} />
        </Detail.Metadata>
      }
    />
  );
}

async function generateBarcode({
  data,
  format,
  height,
  scale,
}: {
  data: string;
  format: BarcodeFormat;
  height: number;
  scale: number;
}): Promise<BarcodeResult> {
  const outputPath = getOutputPath({ data, format, height, scale });

  await mkdir(dirname(outputPath), { recursive: true });
  await execFileAsync("delphitools", [
    "barcode",
    "--quiet",
    "--format",
    format,
    "--height",
    String(height),
    "--scale",
    String(scale),
    "--output",
    outputPath,
    data,
  ]);

  return {
    data,
    format,
    height,
    outputPath,
    scale,
  };
}

function getOutputPath({
  data,
  format,
  height,
  scale,
}: {
  data: string;
  format: BarcodeFormat;
  height: number;
  scale: number;
}): string {
  const hash = createHash("sha256")
    .update(JSON.stringify({ data, format, height, scale }))
    .digest("hex")
    .slice(0, 16);

  return join(
    tmpdir(),
    "delphitools-raycast-extension",
    OUTPUT_NAMESPACE,
    `${format}-${height}-${scale}-${hash}.png`,
  );
}

function parsePositiveInteger(value: string, label: string): number | Error {
  const parsed = Number(value.trim());

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return new Error(`${label} must be a positive whole number.`);
  }

  return parsed;
}

function getFormatLabel(format: BarcodeFormat): string {
  return (
    BARCODE_FORMATS.find((option) => option.value === format)?.label ?? format
  );
}

function getDetailMarkdown(result: BarcodeResult): string {
  return [
    `# ${getFormatLabel(result.format)}`,
    "",
    `<img src="${result.outputPath}" width="${PREVIEW_IMAGE_WIDTH}" />`,
    "",
    "## Data",
    "",
    "```text",
    result.data,
    "```",
  ].join("\n");
}

async function writeFormatPreviewSvgs(): Promise<
  Record<BarcodeFormat, string>
> {
  const entries = await Promise.all(
    BARCODE_FORMATS.map(async (format) => {
      const outputPath = getFormatPreviewPath(format.value);

      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(
        outputPath,
        getFormatPreviewSvg(format.value, format.label),
        "utf8",
      );

      return [format.value, outputPath] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<BarcodeFormat, string>;
}

function getFormatPreviewPath(format: BarcodeFormat): string {
  return join(
    tmpdir(),
    "delphitools-raycast-extension",
    OUTPUT_NAMESPACE,
    "format-previews",
    `${format}-${FORMAT_PREVIEW_DATA.toLowerCase()}-${FORMAT_PREVIEW_VERSION}.svg`,
  );
}

function getFormatPreviewSvg(format: BarcodeFormat, label: string): string {
  const bars = getFormatPreviewBars(format);
  const barShapes = bars
    .map(
      (bar, index) =>
        `<rect x="${32 + index * 14}" y="${bar.y}" width="${bar.width}" height="${bar.height}" rx="1.5" fill="#111111" />`,
    )
    .join("");

  return `<svg width="${FORMAT_PREVIEW_WIDTH}" height="${FORMAT_PREVIEW_HEIGHT}" viewBox="0 0 ${FORMAT_PREVIEW_WIDTH} ${FORMAT_PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${FORMAT_PREVIEW_WIDTH}" height="${FORMAT_PREVIEW_HEIGHT}" rx="16" fill="#ffffff"/>
  <rect x="0.5" y="0.5" width="${FORMAT_PREVIEW_WIDTH - 1}" height="${FORMAT_PREVIEW_HEIGHT - 1}" rx="15.5" fill="none" stroke="#d8d1bd"/>
  <text x="32" y="40" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#06490e">${escapeSvgText(label)}</text>
  ${barShapes}
  <text x="${FORMAT_PREVIEW_WIDTH / 2}" y="226" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#111111">${escapeSvgText(FORMAT_PREVIEW_DATA)}</text>
</svg>`;
}

function getFormatPreviewBars(format: BarcodeFormat): Array<{
  height: number;
  width: number;
  y: number;
}> {
  const seed = Array.from(`${format}:${FORMAT_PREVIEW_DATA}`).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return Array.from({ length: 30 }, (_, index) => {
    const value = (seed + index * 17 + (index % 5) * 11) % 9;
    const height = 112;

    return {
      height,
      width: value % 3 === 0 ? 8 : value % 2 === 0 ? 6 : 4,
      y: 86,
    };
  });
}

function escapeSvgText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
