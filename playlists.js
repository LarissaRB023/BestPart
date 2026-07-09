// ======================================================
// PLAYLISTS MODULE - Playlist Management
// ======================================================

class PlaylistManager {
    constructor() {
        this.playlists = this.loadPlaylists();
        this.currentPlaylist = null;
    }

    createPlaylist(name) {
        const playlist = {
            id: `playlist-${Date.now()}`,
            name: name,
            songs: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublic: false,
        };

        this.playlists.push(playlist);
        this.savePlaylists();
        console.log(`✅ Playlist created: ${name}`);
        return playlist;
    }

    addSongToPlaylist(playlistId, song) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist) {
            playlist.songs.push({
                id: `song-${Date.now()}`,
                name: song.name,
                duration: song.duration,
                url: song.url,
                addedAt: new Date().toISOString(),
            });
            this.savePlaylists();
            console.log(`✅ Song added to playlist`);
        }
    }

    removeSongFromPlaylist(playlistId, songId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist) {
            playlist.songs = playlist.songs.filter(s => s.id !== songId);
            this.savePlaylists();
            console.log(`✅ Song removed from playlist`);
        }
    }

    deletePlaylist(playlistId) {
        this.playlists = this.playlists.filter(p => p.id !== playlistId);
        this.savePlaylists();
        console.log(`✅ Playlist deleted`);
    }

    getPlaylist(playlistId) {
        return this.playlists.find(p => p.id === playlistId);
    }

    getAllPlaylists() {
        return this.playlists;
    }

    searchSongs(query) {
        const results = [];
        this.playlists.forEach(playlist => {
            playlist.songs.forEach(song => {
                if (song.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({ ...song, playlistId: playlist.id });
                }
            });
        });
        return results;
    }

    savePlaylists() {
        localStorage.setItem('loopStudio_playlists', JSON.stringify(this.playlists));
    }

    loadPlaylists() {
        const stored = localStorage.getItem('loopStudio_playlists');
        return stored ? JSON.parse(stored) : [];
    }

    exportPlaylist(playlistId) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist) {
            return JSON.stringify(playlist, null, 2);
        }
        return null;
    }

    importPlaylist(jsonData) {
        try {
            const playlist = JSON.parse(jsonData);
            playlist.id = `playlist-${Date.now()}`;
            this.playlists.push(playlist);
            this.savePlaylists();
            console.log(`✅ Playlist imported: ${playlist.name}`);
            return playlist;
        } catch (error) {
            console.error('Failed to import playlist:', error);
            return null;
        }
    }
}

window.PlaylistManager = PlaylistManager;
