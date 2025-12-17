"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/buttons/copy-button";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

export function RsaKeyGenerator() {
  const [keySize, setKeySize] = useState("2048");
  const [keys, setKeys] = useState<{
    publicKey: string;
    privateKey: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const exportKey = async (key: CryptoKey, type: "pkcs8" | "spki") => {
    const exported = await window.crypto.subtle.exportKey(type, key);
    const exportedAsBase64 = arrayBufferToBase64(exported);
    const pemExported = `-----BEGIN ${
      type === "pkcs8" ? "PRIVATE" : "PUBLIC"
    } KEY-----\n${exportedAsBase64.match(/.{1,64}/g)?.join("\n")}\n-----END ${
      type === "pkcs8" ? "PRIVATE" : "PUBLIC"
    } KEY-----`;
    return pemExported;
  };

  const generateKeys = async () => {
    setIsGenerating(true);
    setKeys(null);

    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: parseInt(keySize),
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      const publicKey = await exportKey(keyPair.publicKey, "spki");
      const privateKey = await exportKey(keyPair.privateKey, "pkcs8");

      setKeys({ publicKey, privateKey });
      toast.success("RSA Key Pair generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate keys");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="space-y-2 flex-1 w-full">
              <Label>Key Size (Bits)</Label>
              <Select value={keySize} onValueChange={setKeySize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024">
                    1024 bit (Fast, Less Secure)
                  </SelectItem>
                  <SelectItem value="2048">2048 bit (Standard)</SelectItem>
                  <SelectItem value="4096">
                    4096 bit (More Secure, Slow)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={generateKeys}
              disabled={isGenerating}
              className="w-full md:w-auto"
              size="lg"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              Generate Key Pair
            </Button>
          </div>
        </CardContent>
      </Card>

      {keys && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <KeyDisplay label="Public Key" value={keys.publicKey} />
          <KeyDisplay label="Private Key" value={keys.privateKey} isPrivate />
        </div>
      )}
    </div>
  );
}

function KeyDisplay({
  label,
  value,
  isPrivate,
}: {
  label: string;
  value: string;
  isPrivate?: boolean;
}) {
  return (
    <Card
      className={`relative ${
        isPrivate
          ? "border-destructive/20 bg-destructive/5"
          : "border-primary/20 bg-primary/5"
      }`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Label
            className={`font-bold ${
              isPrivate ? "text-destructive" : "text-primary"
            }`}
          >
            {label}
          </Label>
          <CopyButton text={value} />
        </div>
        <Textarea
          readOnly
          value={value}
          className="font-mono text-xs h-[300px] resize-none bg-background/50"
        />
      </CardContent>
    </Card>
  );
}
