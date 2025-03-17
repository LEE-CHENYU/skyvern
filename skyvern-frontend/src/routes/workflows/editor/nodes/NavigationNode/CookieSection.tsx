import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CookieSectionProps {
  cookies: Record<string, string>;
  onChange: (cookies: Record<string, string>) => void;
}

export function CookieSection({ cookies, onChange }: CookieSectionProps) {
  const [cookieKey, setCookieKey] = useState("");
  const [cookieValue, setCookieValue] = useState("");
  const [parsedCookies, setParsedCookies] = useState<Record<string, string>>(
    cookies || {},
  );

  // Handle initial JSON string input and convert to object
  useEffect(() => {
    if (typeof cookies === "string") {
      try {
        // Try to parse if it's a JSON string
        const parsed = JSON.parse(cookies);
        if (Array.isArray(parsed)) {
          // Handle array of cookie objects (browser export format)
          const cookieObj = parsed.reduce(
            (acc, cookie) => {
              if (cookie.name && cookie.value) {
                acc[cookie.name] = cookie.value;
              }
              return acc;
            },
            {} as Record<string, string>,
          );
          setParsedCookies(cookieObj);
          onChange(cookieObj);
        } else if (typeof parsed === "object") {
          setParsedCookies(parsed);
        }
      } catch (e) {
        // If not valid JSON, treat as regular cookie value
        console.error("Error parsing cookies:", e);
        setParsedCookies({});
      }
    } else {
      setParsedCookies(cookies || {});
    }
  }, [cookies, onChange]);

  const addCookie = () => {
    if (cookieKey && cookieValue) {
      const updatedCookies = {
        ...parsedCookies,
        [cookieKey]: cookieValue,
      };
      setParsedCookies(updatedCookies);
      onChange(updatedCookies);
      setCookieKey("");
      setCookieValue("");
    }
  };

  const removeCookie = (key: string) => {
    const updatedCookies = { ...parsedCookies };
    delete updatedCookies[key];
    setParsedCookies(updatedCookies);
    onChange(updatedCookies);
  };

  // Handle pasting browser cookie export
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        e.preventDefault(); // Prevent default paste
        const cookieObj = parsed.reduce(
          (acc, cookie) => {
            if (cookie.name && cookie.value) {
              acc[cookie.name] = cookie.value;
            }
            return acc;
          },
          {} as Record<string, string>,
        );
        setParsedCookies(cookieObj);
        onChange(cookieObj);
      }
    } catch (e) {
      // Not a valid JSON array, continue with normal paste
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Cookies</h3>
        <span className="text-xs text-slate-400">
          {Object.keys(parsedCookies).length} cookies
        </span>
      </div>

      {/* Display current cookies */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(parsedCookies).map(([key, value]) => (
          <Badge
            key={key}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <span className="max-w-[200px] truncate" title={`${key}=${value}`}>
              {key}={value.length > 10 ? `${value.substring(0, 10)}...` : value}
            </span>
            <span
              className="ml-1 cursor-pointer"
              onClick={() => removeCookie(key)}
            >
              &times;
            </span>
          </Badge>
        ))}
      </div>

      {/* Add new cookie */}
      <div className="flex gap-2">
        <Input
          placeholder="Cookie Name"
          value={cookieKey}
          onChange={(e) => setCookieKey(e.target.value)}
          className="flex-1"
          onPaste={handlePaste}
        />
        <Input
          placeholder="Cookie Value"
          value={cookieValue}
          onChange={(e) => setCookieValue(e.target.value)}
          className="flex-1"
        />
        <Button onClick={addCookie} disabled={!cookieKey || !cookieValue}>
          Add
        </Button>
      </div>

      <div className="text-xs text-slate-400">
        Tip: You can paste browser cookies exported as JSON directly into the
        Cookie Name field
      </div>
    </div>
  );
}
