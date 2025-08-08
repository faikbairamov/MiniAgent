export async function search(query: string): Promise<string> {
  try {
    // Clean and format the query for better results
    const cleanQuery = query.trim().toLowerCase();

    // Try Wikipedia API first for factual information
    const wikiResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        query
      )}`
    );

    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();

      if (wikiData.extract) {
        return `Search results for "${query}":\n\n📖 **Summary**: ${wikiData.extract}\n\n🔗 **Source**: Wikipedia`;
      }
    }

    // Try with common variations for better results
    const variations = [
      query,
      query.replace(/\s+/g, "_"), // Replace spaces with underscores
      query.split(" ").slice(0, 2).join("_"), // Take first two words
      query.replace(/[^\w\s]/g, "").trim(), // Remove special characters
    ];

    for (const variation of variations) {
      if (variation === query) continue; // Skip the original query we already tried

      const wikiResponse2 = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          variation
        )}`
      );

      if (wikiResponse2.ok) {
        const wikiData2 = await wikiResponse2.json();

        if (wikiData2.extract) {
          return `Search results for "${query}":\n\n📖 **Summary**: ${wikiData2.extract}\n\n🔗 **Source**: Wikipedia`;
        }
      }
    }

    // Fallback: Try DuckDuckGo Instant Answer API
    const ddgResponse = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(
        query
      )}&format=json&no_html=1&skip_disambig=1`
    );

    if (ddgResponse.ok) {
      const ddgData = await ddgResponse.json();

      let result = `Search results for "${query}":\n\n`;

      if (ddgData.Abstract) {
        result += `Summary: ${ddgData.Abstract}\n\n`;
      }

      if (ddgData.Answer) {
        result += `Direct Answer: ${ddgData.Answer}\n\n`;
      }

      if (ddgData.Definition) {
        result += `Definition: ${ddgData.Definition}\n\n`;
      }

      if (ddgData.RelatedTopics && ddgData.RelatedTopics.length > 0) {
        result += `Related Topics:\n`;
        ddgData.RelatedTopics.slice(0, 3).forEach(
          (topic: any, index: number) => {
            if (topic.Text) {
              result += `${index + 1}. ${topic.Text}\n`;
            }
          }
        );
        result += "\n";
      }

      if (ddgData.Abstract || ddgData.Answer || ddgData.Definition) {
        return result;
      }
    }

    // If no results found, provide a helpful response
    return `Search results for "${query}":\n\n❌ No specific information found. Try:\n• Rephrasing your search\n• Being more specific\n• Using different keywords\n\n💡 **Tip**: For current events, try searching for specific news sources.`;
  } catch (error) {
    console.error("Search error:", error);
    return `Search results for "${query}":\n\n❌ Sorry, I couldn't search for "${query}" at the moment. Please try again later.\n\nError: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}
