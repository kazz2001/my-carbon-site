const https = require('https');
const fs = require('fs');

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync('apple-music-view-details-urls.json', 'utf8'));

// Function to fetch HTML content from a URL
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to extract JSON data from the script tag
function extractJsonData(html) {
  const match = html.match(/<script type="application\/json" id="serialized-server-data">(.*?)<\/script>/s);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      return null;
    }
  }
  return null;
}

// Function to extract track details from the parsed JSON
function extractTrackDetailsFromJson(jsonData) {
  const details = {
    performingArtists: [],
    compositionAndLyrics: [],
    producers: []
  };

  try {
    if (jsonData && jsonData[0] && jsonData[0].data && jsonData[0].data.sections) {
      const sections = jsonData[0].data.sections;
      
      // Find the performer section
      const performerSection = sections.find(s => s.id === 'performer');
      if (performerSection && performerSection.items) {
        details.performingArtists = performerSection.items.map(item => ({
          name: item.name,
          roles: item.roleNames || []
        }));
      }
      
      // Find the composer and lyrics section
      const composerSection = sections.find(s => s.id === 'composer-and-lyrics');
      if (composerSection && composerSection.items) {
        details.compositionAndLyrics = composerSection.items.map(item => ({
          name: item.name,
          roles: item.roleNames || []
        }));
      }
      
      // Find the production and engineering section
      const productionSection = sections.find(s => s.id === 'production-and-engineering');
      if (productionSection && productionSection.items) {
        details.producers = productionSection.items.map(item => ({
          name: item.name,
          roles: item.roleNames || []
        }));
      }
    }
  } catch (e) {
    console.error('Error extracting details:', e.message);
  }

  return details;
}

// Function to format producer names with "and"
function formatProducerNames(producers) {
  // Filter only producers (not engineers, etc.)
  const producerList = producers.filter(p => 
    p.roles.some(role => role.toLowerCase().includes('producer'))
  );
  
  if (producerList.length === 0) return '';
  if (producerList.length === 1) return producerList[0].name;
  if (producerList.length === 2) return `${producerList[0].name} and ${producerList[1].name}`;
  
  // For 3 or more producers
  const lastProducer = producerList[producerList.length - 1].name;
  const otherProducers = producerList.slice(0, -1).map(p => p.name).join(', ');
  return `${otherProducers} and ${lastProducer}`;
}

// Main function to process all tracks
async function processAllTracks() {
  console.log(`Processing ${jsonData.trackUrls.length} tracks from "${jsonData.albumTitle}" by ${jsonData.albumArtist}...\n`);
  
  const results = [];
  
  for (let i = 0; i < jsonData.trackUrls.length; i++) {
    const track = jsonData.trackUrls[i];
    console.log(`[${i + 1}/${jsonData.trackUrls.length}] Fetching: ${track.title}...`);
    
    try {
      const html = await fetchUrl(track.url);
      const parsedJson = extractJsonData(html);
      const details = extractTrackDetailsFromJson(parsedJson);
      
      results.push({
        trackNumber: track.trackNumber,
        title: track.title,
        url: track.url,
        performingArtists: details.performingArtists,
        compositionAndLyrics: details.compositionAndLyrics,
        producers: details.producers
      });
      
      console.log(`  ✓ Completed - Found ${details.performingArtists.length} performers, ${details.compositionAndLyrics.length} composers, ${details.producers.length} production credits`);
      
      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      results.push({
        trackNumber: track.trackNumber,
        title: track.title,
        url: track.url,
        performingArtists: [],
        compositionAndLyrics: [],
        producers: [],
        error: error.message
      });
    }
  }
  
  // Save results to JSON file
  const outputJson = {
    albumTitle: jsonData.albumTitle,
    albumArtist: jsonData.albumArtist,
    albumUrl: jsonData.albumUrl,
    tracks: results
  };
  
  fs.writeFileSync('apple-music-track-details.json', JSON.stringify(outputJson, null, 2));
  console.log('\n✓ Results saved to apple-music-track-details.json');
  
  // Create a readable markdown file
  let markdown = `# ${jsonData.albumTitle} - Track Details\n\n`;
  markdown += `**Artist:** ${jsonData.albumArtist}\n\n`;
  markdown += `**Album URL:** ${jsonData.albumUrl}\n\n`;
  markdown += `---\n\n`;
  
  results.forEach(track => {
    markdown += `## ${track.trackNumber}. ${track.title}\n\n`;
    
    if (track.performingArtists && track.performingArtists.length > 0) {
      markdown += `### Performing Artists\n`;
      track.performingArtists.forEach(artist => {
        markdown += `- **${artist.name}** - ${artist.roles.join(', ')}\n`;
      });
      markdown += `\n`;
    }
    
    if (track.compositionAndLyrics && track.compositionAndLyrics.length > 0) {
      markdown += `### Composition & Lyrics\n`;
      const composerNames = track.compositionAndLyrics.map(c => c.name).join(', ');
      markdown += `${composerNames}\n\n`;
    }
    
    if (track.producers && track.producers.length > 0) {
      markdown += `### Producer\n`;
      const producerNames = formatProducerNames(track.producers);
      if (producerNames) {
        markdown += `${producerNames}\n\n`;
      }
    }
    
    markdown += `**URL:** ${track.url}\n\n`;
    markdown += `---\n\n`;
  });
  
  fs.writeFileSync('apple-music-track-details.md', markdown);
  console.log('✓ Results saved to apple-music-track-details.md');
  
  // Create a simple text list
  let textList = `${jsonData.albumTitle} by ${jsonData.albumArtist}\n`;
  textList += `${'='.repeat(60)}\n\n`;
  
  results.forEach(track => {
    textList += `Track ${track.trackNumber}: ${track.title}\n`;
    textList += `${'─'.repeat(60)}\n`;
    
    if (track.performingArtists && track.performingArtists.length > 0) {
      textList += `Performing Artists:\n`;
      track.performingArtists.forEach(artist => {
        textList += `  • ${artist.name} (${artist.roles.join(', ')})\n`;
      });
    }
    
    if (track.compositionAndLyrics && track.compositionAndLyrics.length > 0) {
      textList += `Composition & Lyrics:\n`;
      const composerNames = track.compositionAndLyrics.map(c => c.name).join(', ');
      textList += `  ${composerNames}\n`;
    }
    
    if (track.producers && track.producers.length > 0) {
      textList += `Producer:\n`;
      const producerNames = formatProducerNames(track.producers);
      if (producerNames) {
        textList += `  ${producerNames}\n`;
      }
    }
    
    textList += `\n`;
  });
  
  fs.writeFileSync('apple-music-track-details.txt', textList);
  console.log('✓ Results saved to apple-music-track-details.txt');
  
  console.log('\n✓ All done!');
}

// Run the script
processAllTracks().catch(console.error);

// Made with Bob
