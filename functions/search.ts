export async function search(query: string): Promise<string> {
  try {
    // Clean and validate the query
    const cleanQuery = query.trim();
    if (!cleanQuery || cleanQuery.length < 2) {
      return "Error: Search query is too short. Please provide a more specific query.";
    }

    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Search timeout")), 10000)
    );

    // Try Wikipedia API first for factual information
    const wikiPromise = fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        cleanQuery
      )}`
    );

    const wikiResponse = (await Promise.race([
      wikiPromise,
      timeoutPromise,
    ])) as Response;

    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();

      if (wikiData.extract) {
        return `Search results for "${cleanQuery}":\n\n📖 **Summary**: ${wikiData.extract}\n\n🔗 **Source**: Wikipedia`;
      }
    }

    // Try with common variations for better results
    const variations = [
      cleanQuery,
      cleanQuery.replace(/\s+/g, "_"), // Replace spaces with underscores
      cleanQuery.split(" ").slice(0, 2).join("_"), // Take first two words
      cleanQuery.replace(/[^\w\s]/g, "").trim(), // Remove special characters
    ];

    for (const variation of variations) {
      if (variation === cleanQuery) continue; // Skip the original query we already tried

      try {
        const wikiResponse2 = (await Promise.race([
          fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              variation
            )}`
          ),
          timeoutPromise,
        ])) as Response;

        if (wikiResponse2.ok) {
          const wikiData2 = await wikiResponse2.json();

          if (wikiData2.extract) {
            return `Search results for "${cleanQuery}":\n\n📖 **Summary**: ${wikiData2.extract}\n\n🔗 **Source**: Wikipedia`;
          }
        }
      } catch (error) {
        // Continue to next variation if this one fails
        continue;
      }
    }

    // Fallback: Try DuckDuckGo Instant Answer API
    try {
      const ddgPromise = fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(
          cleanQuery
        )}&format=json&no_html=1&skip_disambig=1`
      );

      const ddgResponse = (await Promise.race([
        ddgPromise,
        timeoutPromise,
      ])) as Response;

      if (ddgResponse.ok) {
        const ddgData = await ddgResponse.json();

        let result = `Search results for "${cleanQuery}":\n\n`;

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
    } catch (error) {
      console.error("DuckDuckGo search error:", error);
    }

    // If no results found, provide a helpful response
    return `Search results for "${cleanQuery}":\n\n❌ No specific information found. Try:\n• Rephrasing your search\n• Being more specific\n• Using different keywords\n\n💡 **Tip**: For current events, try searching for specific news sources.`;
  } catch (error) {
    console.error("Search error:", error);

    if (error instanceof Error && error.message === "Search timeout") {
      return `Search results for "${query}":\n\n⏰ Search timed out. Please try again with a different query.`;
    }

    return `Search results for "${query}":\n\n❌ Sorry, I couldn't search for "${query}" at the moment. Please try again later.\n\nError: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}
