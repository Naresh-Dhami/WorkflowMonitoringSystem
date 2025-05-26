
export const scrapeWebContent = async (url: string): Promise<string> => {
  try {
    // Validate URL
    new URL(url);
    
    // For demo purposes, we'll use a simple fetch with CORS proxy
    // In production, you'd want to use a proper scraping service
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const htmlContent = data.contents;
    
    // Basic HTML to text conversion
    const textContent = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Limit content length to avoid overwhelming the LLM
    const maxLength = 5000;
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
      
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website. Please check the URL and try again.');
  }
};
