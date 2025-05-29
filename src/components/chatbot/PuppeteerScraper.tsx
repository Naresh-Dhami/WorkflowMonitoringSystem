
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Camera, FileText, Settings, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PuppeteerService from "@/utils/puppeteerService";

interface PuppeteerScraperProps {
  onScrapedData: (data: any) => void;
  isLoading: boolean;
}

const PuppeteerScraper = ({ onScrapedData, isLoading }: PuppeteerScraperProps) => {
  const [url, setUrl] = useState("");
  const [waitForSelector, setWaitForSelector] = useState("");
  const [extractForms, setExtractForms] = useState(true);
  const [takeScreenshot, setTakeScreenshot] = useState(false);

  const handleScrape = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to scrape");
      return;
    }

    try {
      console.log("Starting Puppeteer scrape of:", url);
      
      const scrapedData = await PuppeteerService.scrapePage({
        url,
        waitForSelector: waitForSelector || undefined,
        extractText: true,
        extractForms,
        screenshot: takeScreenshot
      });

      let screenshot = null;
      if (takeScreenshot) {
        screenshot = await PuppeteerService.takeScreenshot(url);
      }

      const enhancedData = {
        ...scrapedData,
        screenshot,
        config: {
          waitForSelector,
          extractForms,
          takeScreenshot
        }
      };

      onScrapedData(enhancedData);
      
      toast.success("Successfully scraped website with Puppeteer");
      
      // Clear form
      setUrl("");
      setWaitForSelector("");
      
    } catch (error) {
      console.error("Puppeteer scraping failed:", error);
      toast.error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Puppeteer Web Scraper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Target URL</label>
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Wait for Selector (Optional)</label>
          <Input
            placeholder="e.g., .content, #main, [data-loaded]"
            value={waitForSelector}
            onChange={(e) => setWaitForSelector(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="extractForms"
              checked={extractForms}
              onChange={(e) => setExtractForms(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="extractForms" className="text-sm">Extract Forms</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="takeScreenshot"
              checked={takeScreenshot}
              onChange={(e) => setTakeScreenshot(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="takeScreenshot" className="text-sm">Take Screenshot</label>
          </div>
        </div>

        <Separator />

        <Button
          onClick={handleScrape}
          disabled={isLoading || !url.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scraping with Puppeteer...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Scrape with Puppeteer
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p><strong>Note:</strong> This uses simulated Puppeteer functionality. For full browser automation, deploy a backend service with Puppeteer.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppeteerScraper;
