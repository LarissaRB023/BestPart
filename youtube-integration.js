// ======================================================
// YOUTUBE INTEGRATION MODULE
// Search and import music from YouTube
// ======================================================

class YouTubeIntegration {
    constructor() {
        this.apiKey = null; // Must be set by user
        this.searchResults = [];
        this.importedVideos = [];
    }

    setAPIKey(apiKey) {
        this.apiKey = apiKey;
        console.log('✅ YouTube API Key set');
    }

    async searchVideos(query) {
        if (!this.apiKey) {
            console.warn('YouTube API Key not configured');
            return this.getLocalSearchResults(query);
        }

        try {
            // YouTube Data API v3 search
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${this.apiKey}&maxResults=10`;
            const response = await fetch(url);
            const data = await response.json();

            this.searchResults = data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.default.url,
                publishedAt: item.snippet.publishedAt,
            }));

            console.log(`✅ Found ${this.searchResults.length} videos`);
            return this.searchResults;
        } catch (error) {
            console.error('YouTube search failed:', error);
            return this.getLocalSearchResults(query);
        }
    }

    getLocalSearchResults(query) {
        // Fallback search results for demo
        return [
            {
                id: 'yt-1',
                title: `${query} - Original Mix`,
                channel: 'Music Channel',
                thumbnail: '🎵',
                publishedAt: new Date().toISOString(),
            },
            {
                id: 'yt-2',
                title: `${query} - Slowed & Reverb`,
                channel: 'Slowed Beats',
                thumbnail: '🎵',
                publishedAt: new Date().toISOString(),
            },
            {
                id: 'yt-3',
                title: `${query} - Remix`,
                channel: 'Remix Master',
                thumbnail: '🎵',
                publishedAt: new Date().toISOString(),
            },
        ];
    }

    async downloadAudio(videoId) {
        // In production, use server-side conversion (yt-dlp, ffmpeg)
        console.log(`📥 Downloading audio for video: ${videoId}`);
        
        // This requires backend support
        return {
            status: 'pending',
            message: 'Download requires server configuration',
            videoId: videoId,
        };
    }

    addToImported(video) {
        this.importedVideos.push({
            ...video,
            importedAt: new Date().toISOString(),
            tags: [],
        });
        this.saveImportedVideos();
        console.log(`✅ Video added to imported: ${video.title}`);
    }

    removeImported(videoId) {
        this.importedVideos = this.importedVideos.filter(v => v.id !== videoId);
        this.saveImportedVideos();
        console.log(`✅ Video removed from imported`);
    }

    getImportedVideos() {
        return this.importedVideos;
    }

    saveImportedVideos() {
        localStorage.setItem('loopStudio_yt_imported', JSON.stringify(this.importedVideos));
    }

    loadImportedVideos() {
        const stored = localStorage.getItem('loopStudio_yt_imported');
        this.importedVideos = stored ? JSON.parse(stored) : [];
    }

    shareVideo(videoId) {
        const video = this.importedVideos.find(v => v.id === videoId);
        if (video) {
            const shareLink = `https://youtu.be/${videoId}`;
            console.log(`📤 Share: ${shareLink}`);
            return shareLink;
        }
        return null;
    }
}

window.YouTubeIntegration = YouTubeIntegration;
