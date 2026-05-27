import {
  Action,
  ActionPanel,
  Clipboard,
  Detail,
  Form,
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

const DEFAULT_FORMAT: BarcodeFormat = "code128";
const DEFAULT_HEIGHT = "120";
const DEFAULT_SCALE = "2";
const OUTPUT_NAMESPACE = "barcode";
const PREVIEW_IMAGE_WIDTH = 420;
const FORMAT_PREVIEW_DATA = "Raycast";
const FORMAT_PREVIEW_WIDTH = 280;
const FORMAT_PREVIEW_HEIGHT = 96;

const BARCODE_FORMATS: Array<{ label: string; value: BarcodeFormat }> = [
  { label: "EAN-13", value: "ean13" },
  { label: "EAN-8", value: "ean8" },
  { label: "UPC-A", value: "upca" },
  { label: "Code 39", value: "code39" },
  { label: "Code 128", value: "code128" },
  { label: "Codabar", value: "codabar" },
  { label: "Code 93", value: "code93" },
  { label: "ITF", value: "itf" },
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
              title="Show Format Previews"
              target={<FormatPreviewDetail previewPaths={formatPreviewPaths} />}
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
      {formatPreviewPaths ? (
        <Form.Description
          title="Format Previews"
          text={getFormatPreviewMarkdown(formatPreviewPaths)}
        />
      ) : null}
      <Form.TextField
        id="height"
        title="Height"
        defaultValue={DEFAULT_HEIGHT}
      />
      <Form.TextField id="scale" title="Scale" defaultValue={DEFAULT_SCALE} />
    </Form>
  );
}

function FormatPreviewDetail({
  previewPaths,
}: {
  previewPaths: Record<BarcodeFormat, string>;
}) {
  return (
    <Detail
      markdown={getFormatPreviewMarkdown(previewPaths)}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Preview Value"
            text={FORMAT_PREVIEW_DATA}
          />
        </Detail.Metadata>
      }
    />
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

function getFormatPreviewMarkdown(
  previewPaths: Record<BarcodeFormat, string>,
): string {
  return [
    "| Name | Image |",
    "| --- | --- |",
    ...BARCODE_FORMATS.map(
      (format) =>
        `| ${format.label} | <img src="${previewPaths[format.value]}" width="${FORMAT_PREVIEW_WIDTH}" /> |`,
    ),
  ].join("\n");
}

function getFormatPreviewPath(format: BarcodeFormat): string {
  return join(
    tmpdir(),
    "delphitools-raycast-extension",
    OUTPUT_NAMESPACE,
    "format-previews",
    `${format}-${FORMAT_PREVIEW_DATA.toLowerCase()}.svg`,
  );
}

function getFormatPreviewSvg(format: BarcodeFormat, label: string): string {
  const bars = getFormatPreviewBars(format);
  const barShapes = bars
    .map(
      (bar, index) =>
        `<rect x="${18 + index * 8}" y="${bar.y}" width="${bar.width}" height="${bar.height}" rx="1" fill="#111111" />`,
    )
    .join("");

  return `<svg width="${FORMAT_PREVIEW_WIDTH}" height="${FORMAT_PREVIEW_HEIGHT}" viewBox="0 0 ${FORMAT_PREVIEW_WIDTH} ${FORMAT_PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${FORMAT_PREVIEW_WIDTH}" height="${FORMAT_PREVIEW_HEIGHT}" rx="8" fill="#ffffff"/>
  <rect x="0.5" y="0.5" width="${FORMAT_PREVIEW_WIDTH - 1}" height="${FORMAT_PREVIEW_HEIGHT - 1}" rx="7.5" fill="none" stroke="#d8d1bd"/>
  <text x="18" y="18" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#06490e">${escapeSvgText(label)}</text>
  ${barShapes}
  <text x="${FORMAT_PREVIEW_WIDTH / 2}" y="84" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#111111">${escapeSvgText(FORMAT_PREVIEW_DATA)}</text>
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
    const isGuard = index < 2 || index > 27 || index === 14 || index === 15;
    const height = isGuard ? 52 : 32 + value * 2;

    return {
      height,
      width: value % 3 === 0 ? 4 : value % 2 === 0 ? 3 : 2,
      y: 24 + (52 - height),
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
