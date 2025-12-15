import { FormatConverter } from "@/components/shared/format-converter";

export function CsvConverter() {
  return <FormatConverter defaultInput="csv" defaultOutput="json" />;
}
