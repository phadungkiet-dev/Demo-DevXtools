"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/buttons/copy-button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface SubnetResult {
  ipAddress: string;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  usableRange: string;
  totalHosts: string;
  usableHosts: string;
  cidr: string;
  ipClass: string;
  binaryIp: string;
}

// Helper Logic (ย้ายออกมานอก Component เพื่อความสะอาดและ Performance)
const calculateSubnet = (
  ipStr: string,
  cidrStr: string
): SubnetResult | null => {
  // Validate IP
  const ipParts = ipStr.split(".").map(Number);
  if (
    ipParts.length !== 4 ||
    ipParts.some((part) => isNaN(part) || part < 0 || part > 255)
  ) {
    return null;
  }

  const cidr = parseInt(cidrStr);

  // Convert IP to Long
  const ipLong =
    (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

  // Create Mask
  const maskLong = cidr === 0 ? 0 : -1 << (32 - cidr);

  // Calculate Network & Broadcast
  const networkLong = ipLong & maskLong;
  const broadcastLong = networkLong | ~maskLong;

  // Helper: Long to IP String (ใช้ unsigned right shift >>> เพื่อจัดการเรื่องเครื่องหมาย)
  const longToIp = (long: number) => {
    return [
      (long >>> 24) & 255,
      (long >>> 16) & 255,
      (long >>> 8) & 255,
      long & 255,
    ].join(".");
  };

  const usableStart = networkLong + 1;
  const usableEnd = broadcastLong - 1;

  // คำนวณจำนวน Host
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHostsCount = totalHosts - 2 > 0 ? totalHosts - 2 : 0;

  // Determine Class
  const firstOctet = ipParts[0];
  let ipClass = "Unknown";
  if (firstOctet >= 0 && firstOctet <= 127) ipClass = "A";
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = "B";
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = "C";
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = "D (Multicast)";
  else if (firstOctet >= 240 && firstOctet <= 255) ipClass = "E (Experimental)";

  return {
    ipAddress: ipStr,
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    subnetMask: longToIp(maskLong),
    usableRange: `${longToIp(usableStart)} - ${longToIp(usableEnd)}`,
    totalHosts: totalHosts.toLocaleString(),
    usableHosts: usableHostsCount.toLocaleString(),
    cidr: `/${cidr}`,
    ipClass,
    binaryIp: ipParts.map((p) => p.toString(2).padStart(8, "0")).join("."),
  };
};

export function IPv4SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.1");
  const [cidr, setCidr] = useState("24");

  // 2. ใช้ useMemo แทน useEffect เพื่อแก้ปัญหา Cascading Render
  // ค่า result จะถูกคำนวณใหม่เฉพาะเมื่อ ip หรือ cidr เปลี่ยนเท่านั้น
  const result = useMemo(() => calculateSubnet(ip, cidr), [ip, cidr]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.1"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>CIDR (Subnet Mask)</Label>
              <Select value={cidr} onValueChange={setCidr}>
                <SelectTrigger className="font-mono">
                  <SelectValue placeholder="Select CIDR" />
                </SelectTrigger>
                <SelectContent className="h-60">
                  {Array.from({ length: 33 }, (_, i) => (
                    <SelectItem key={32 - i} value={(32 - i).toString()}>
                      /{32 - i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <Table>
            <TableBody>
              <ResultRow
                label="Network Address"
                value={result.networkAddress}
              />
              <ResultRow
                label="Broadcast Address"
                value={result.broadcastAddress}
              />
              <ResultRow label="Subnet Mask" value={result.subnetMask} />
              <ResultRow label="Usable Host Range" value={result.usableRange} />
              <ResultRow label="Usable Hosts" value={result.usableHosts} />
              <ResultRow label="Total Hosts" value={result.totalHosts} />
              <ResultRow label="IP Class" value={result.ipClass} />
              <ResultRow label="Binary IP" value={result.binaryIp} code />
              <ResultRow label="CIDR Notation" value={result.cidr} />
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

// Sub-component for clean JSX
function ResultRow({
  label,
  value,
  code,
}: {
  label: string;
  value: string;
  code?: boolean;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium w-1/3 text-muted-foreground">
        {label}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`${
              code ? "font-mono text-xs md:text-sm bg-muted px-1 rounded" : ""
            } font-medium`}
          >
            {value}
          </span>
          <CopyButton text={value} />
        </div>
      </TableCell>
    </TableRow>
  );
}
