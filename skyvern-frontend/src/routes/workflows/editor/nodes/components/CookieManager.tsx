import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { HelpTooltip } from "@/components/HelpTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeEditor } from "@/routes/workflows/components/CodeEditor";
import { X, Upload, Plus, Trash2, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
}

interface CookieManagerProps {
  cookiesJson: string;
  onChange: (cookiesJson: string) => void;
  disabled?: boolean;
}

export function CookieManager({ cookiesJson, onChange, disabled = false }: CookieManagerProps) {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [cookieImportText, setCookieImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCookieIndex, setSelectedCookieIndex] = useState<number | null>(null);
  
  // New cookie form state
  const [newCookie, setNewCookie] = useState<Cookie>({
    name: "",
    value: "",
    domain: "",
    path: "/",
  });

  // Parse cookies from JSON string on component mount or when props change
  useEffect(() => {
    try {
      const parsedCookies = cookiesJson ? JSON.parse(cookiesJson) : [];
      setCookies(Array.isArray(parsedCookies) ? parsedCookies : []);
    } catch (error) {
      console.error("Failed to parse cookies:", error);
      setCookies([]);
    }
  }, [cookiesJson]);

  // Update parent component when cookies change
  const updateCookies = (updatedCookies: Cookie[]) => {
    setCookies(updatedCookies);
    onChange(JSON.stringify(updatedCookies));
  };

  // Add a new cookie
  const addCookie = () => {
    if (!newCookie.name || !newCookie.value) return;
    
    // Create a clean cookie object - remove empty properties
    const cookieToAdd: Cookie = {
      name: newCookie.name,
      value: newCookie.value,
    };
    
    if (newCookie.domain && newCookie.domain.trim()) cookieToAdd.domain = newCookie.domain;
    if (newCookie.path && newCookie.path.trim()) cookieToAdd.path = newCookie.path;
    
    updateCookies([...cookies, cookieToAdd]);
    
    // Reset form
    setNewCookie({
      name: "",
      value: "",
      domain: "",
      path: "/",
    });
  };

  // Delete a cookie
  const deleteCookie = (index: number) => {
    const updatedCookies = [...cookies];
    updatedCookies.splice(index, 1);
    updateCookies(updatedCookies);
  };

  // Edit a cookie
  const editCookie = (index: number) => {
    setSelectedCookieIndex(index);
    setNewCookie({...cookies[index]});
    setIsEditModalOpen(true);
  };

  // Update a cookie
  const updateCookie = () => {
    if (selectedCookieIndex === null) return;
    
    const updatedCookies = [...cookies];
    updatedCookies[selectedCookieIndex] = newCookie;
    updateCookies(updatedCookies);
    
    setIsEditModalOpen(false);
    setSelectedCookieIndex(null);
    setNewCookie({
      name: "",
      value: "",
      domain: "",
      path: "/",
    });
  };

  // Import cookies from JSON
  const importCookies = () => {
    setImportError(null);
    
    try {
      let importedCookies: Cookie[] = [];
      const parsedData = JSON.parse(cookieImportText);
      
      if (Array.isArray(parsedData)) {
        importedCookies = parsedData.map(cookie => {
          if (cookie.name && cookie.value) {
            return {
              name: cookie.name,
              value: cookie.value,
              domain: cookie.domain || undefined,
              path: cookie.path || '/',
            };
          }
          throw new Error("Invalid cookie format");
        });
      } 
      else if (typeof parsedData === 'object' && parsedData !== null) {
        importedCookies = Object.entries(parsedData).map(([name, value]) => ({
          name,
          value: String(value),
        }));
      }
      
      if (importedCookies.length === 0) {
        throw new Error("No valid cookies found in import data");
      }
      
      updateCookies([...cookies, ...importedCookies]);
      setIsImportModalOpen(false);
      setCookieImportText("");
      
    } catch (error) {
      console.error("Failed to import cookies:", error);
      setImportError("Invalid cookie format. Please check your input and try again.");
    }
  };

  return (
    <div className="cookie-manager space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Label className="text-xs text-slate-300">Cookies</Label>
          <HelpTooltip content="Add cookies that will be set before navigating to the page." />
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={disabled}
              >
                <Upload className="h-3 w-3 mr-1" /> Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Cookies</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Paste cookies in JSON format. Supports: arrays of cookie objects, or simple key-value objects.
                </p>
                <CodeEditor
                  language="json"
                  value={cookieImportText}
                  onChange={setCookieImportText}
                />
                {importError && (
                  <div className="text-xs text-red-500">{importError}</div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">Cancel</Button>
                </DialogClose>
                <Button size="sm" onClick={importCookies}>Import Cookies</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Cookie list */}
      <div className="cookie-list border rounded-md p-2 min-h-[100px] max-h-[250px] bg-slate-950 space-y-2">
        <ScrollArea className="h-full w-full">
          {cookies.length === 0 ? (
            <p className="text-xs text-slate-500 p-2">No cookies added yet. Add cookies below or import them.</p>
          ) : (
            <div className="space-y-2 p-1">
              {cookies.map((cookie, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-900 rounded p-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs">{cookie.name}</span>
                      {cookie.domain && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {cookie.domain}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 truncate max-w-[350px]">
                      {cookie.value}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => editCookie(index)}
                      disabled={disabled}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500"
                      onClick={() => deleteCookie(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Add cookie form */}
      <div className="add-cookie-form space-y-3 border rounded-md p-2 bg-slate-900">
        <div className="flex justify-between items-center">
          <Label className="text-xs">Add Cookie</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Name</Label>
            <Input
              placeholder="Cookie name"
              className="text-xs mt-1"
              value={newCookie.name}
              onChange={(e) => setNewCookie({...newCookie, name: e.target.value})}
              disabled={disabled}
            />
          </div>
          <div>
            <Label className="text-xs">Value</Label>
            <Input
              placeholder="Cookie value"
              className="text-xs mt-1"
              value={newCookie.value}
              onChange={(e) => setNewCookie({...newCookie, value: e.target.value})}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Domain (optional)</Label>
            <Input
              placeholder="example.com"
              className="text-xs mt-1"
              value={newCookie.domain || ''}
              onChange={(e) => setNewCookie({...newCookie, domain: e.target.value})}
              disabled={disabled}
            />
          </div>
          <div>
            <Label className="text-xs">Path (optional)</Label>
            <Input
              placeholder="/"
              className="text-xs mt-1"
              value={newCookie.path || '/'}
              onChange={(e) => setNewCookie({...newCookie, path: e.target.value})}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            size="sm" 
            onClick={addCookie}
            disabled={disabled || !newCookie.name || !newCookie.value}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Cookie
          </Button>
        </div>
      </div>
      
      {/* Edit cookie modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cookie</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  placeholder="Cookie name"
                  className="text-xs mt-1"
                  value={newCookie.name}
                  onChange={(e) => setNewCookie({...newCookie, name: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-xs">Value</Label>
                <Input
                  placeholder="Cookie value"
                  className="text-xs mt-1"
                  value={newCookie.value}
                  onChange={(e) => setNewCookie({...newCookie, value: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Domain (optional)</Label>
                <Input
                  placeholder="example.com"
                  className="text-xs mt-1"
                  value={newCookie.domain || ''}
                  onChange={(e) => setNewCookie({...newCookie, domain: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-xs">Path (optional)</Label>
                <Input
                  placeholder="/"
                  className="text-xs mt-1"
                  value={newCookie.path || '/'}
                  onChange={(e) => setNewCookie({...newCookie, path: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Cancel</Button>
            </DialogClose>
            <Button 
              size="sm" 
              onClick={updateCookie}
              disabled={!newCookie.name || !newCookie.value}
            >
              Update Cookie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}