import { FormatConverter } from "@/components/shared/format-converter";


export function JsonConverter() {
  return <FormatConverter defaultInput="json" defaultOutput="yaml" />;
}
