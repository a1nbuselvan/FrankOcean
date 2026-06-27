/**
 * Frank Ocean — Blonde Album Player
 * Complete music player engine
 *
 * @description Handles playback, track list rendering, shuffle/repeat modes,
 *   seekable progress & volume bars, keyboard shortcuts, Media Session API,
 *   localStorage persistence, and mobile sidebar.
 */
document.addEventListener('DOMContentLoaded', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // DATA
  // ═══════════════════════════════════════════════════════════════════════════

  const TRACKS = [
    { number: 1, title: 'Nikes', file: '01 Nikes.mp3' },
    { number: 2, title: 'Ivy', file: '02 Ivy.mp3' },
    { number: 3, title: 'Pink + White', file: '03 Pink + White.mp3' },
    { number: 4, title: 'Be Yourself', file: '04 Be Yourself.mp3' },
    { number: 5, title: 'Solo', file: '05 Solo.mp3' },
    { number: 6, title: 'Skyline To', file: '06 Skyline To.mp3' },
    { number: 7, title: 'Self Control', file: '07 Self Control.mp3' },
    { number: 8, title: 'Good Guy', file: '08 Good Guy.mp3' },
    { number: 9, title: 'Nights', file: '09 Nights.mp3' },
    { number: 10, title: 'Solo (Reprise)', file: '10 Solo (Reprise).mp3' },
    { number: 11, title: 'Pretty Sweet', file: '11 Pretty Sweet.mp3' },
    { number: 12, title: 'Facebook Story', file: '12 Facebook Story.mp3' },
    { number: 13, title: 'Close to You', file: '13 Close to You.mp3' },
    { number: 14, title: 'White Ferrari', file: '14 White Ferrari.mp3' },
    { number: 15, title: 'Seigfried', file: '15 Seigfried.mp3' },
    { number: 16, title: 'Godspeed', file: '16 Godspeed.mp3' },
    { number: 17, title: 'Futura Free', file: '17 Futura Free.mp3' },
  ];

  const ARTIST = 'Frank Ocean';
  const ALBUM  = 'Blonde';
  const ALBUM_ART = 'Blonde.jpg';

  // ═══════════════════════════════════════════════════════════════════════════
  // SVG ICONS
  // ═══════════════════════════════════════════════════════════════════════════

  const ICONS = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="19,3 9,12 19,21"/><rect x="5" y="3" width="3" height="18"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 15,12 5,21"/><rect x="16" y="3" width="3" height="18"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>',
    repeatOne: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><text x="12" y="15" text-anchor="middle" font-size="7" font-weight="bold" fill="currentColor">1</text></svg>',
    volumeHigh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
    volumeMedium: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>',
    volumeLow: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 9v6h4l5 5V4l-5 5H7z"/></svg>',
    volumeMute: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
    heartOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    heartFilled: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOM REFERENCES
  // ═══════════════════════════════════════════════════════════════════════════

  const $ = (id) => document.getElementById(id);

  const audioPlayer        = $('audioPlayer');
  const playPauseBtn       = $('playPauseBtn');
  const prevBtn            = $('prevBtn');
  const nextBtn            = $('nextBtn');
  const shuffleBtn         = $('shuffleBtn');
  const repeatBtn          = $('repeatBtn');
  const playAllBtn         = $('playAllBtn');
  const shuffleToggle      = $('shuffleToggle');

  const progressBarWrapper = $('progressBarWrapper');
  const progressBar        = $('progressBar');
  const progressHandle     = $('progressHandle');
  const currentTimeEl      = $('currentTime');
  const totalTimeEl        = $('totalTime');

  const volumeBarWrapper   = $('volumeBarWrapper');
  const volumeBar          = $('volumeBar');
  const volumeHandle       = $('volumeHandle');
  const volumeBtn          = $('volumeBtn');

  const playerAlbumArt     = $('playerAlbumArt');
  const playerTrackName    = $('playerTrackName');
  const playerTrackArtist  = $('playerTrackArtist');
  const playerLikeBtn      = $('playerLikeBtn');

  const trackListEl        = $('trackList');
  const albumTrackCount    = $('albumTrackCount');
  const albumDuration      = $('albumDuration');
  const likeAlbum          = $('likeAlbum');
  const sidebar            = $('sidebar');
  const sidebarOverlay     = $('sidebarOverlay');
  const menuToggle         = $('menuToggle');
  const playerBar          = $('playerBar');

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  let currentTrackIndex = -1;
  let isPlaying         = false;
  let isShuffled        = false;
  let repeatMode        = 0; // 0 = off, 1 = all, 2 = one
  let shuffleOrder      = [];
  let trackDurations    = new Array(TRACKS.length).fill(0);
  let isMuted           = false;
  let previousVolume    = 0.7;
  let animFrameId       = null;
  let isDraggingProgress = false;
  let isDraggingVolume   = false;
  let isAlbumLiked       = false;
  let isTrackLiked       = false;
  let playerBarVisible   = false;

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Format seconds into mm:ss string
   * @param {number} seconds
   * @returns {string}
   */
  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Format seconds into human-readable duration string (e.g., '1 hr 2 min')
   * @param {number} totalSeconds
   * @returns {string}
   */
  const formatDuration = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  /**
   * Fisher-Yates shuffle — returns a new shuffled array of indices
   * @param {number} length — array length
   * @param {number} [currentIdx] — index to keep at position 0
   * @returns {number[]}
   */
  const createShuffleOrder = (length, currentIdx = -1) => {
    const arr = Array.from({ length }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Move the current track to the front so it plays first / stays current
    if (currentIdx >= 0) {
      const pos = arr.indexOf(currentIdx);
      if (pos > 0) {
        [arr[0], arr[pos]] = [arr[pos], arr[0]];
      }
    }
    return arr;
  };

  /**
   * Clamp a value between min and max
   * @param {number} val
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCAL STORAGE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  const loadVolume = () => {
    const stored = localStorage.getItem('blonde_volume');
    return stored !== null ? parseFloat(stored) : 0.7;
  };

  const saveVolume = (vol) => {
    localStorage.setItem('blonde_volume', vol.toString());
  };

  const loadLikedState = () => {
    return localStorage.getItem('blonde_album_liked') === 'true';
  };

  const saveLikedState = (liked) => {
    localStorage.setItem('blonde_album_liked', liked.toString());
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TRACK LIST RENDERING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Generate and insert the track list HTML into #trackList
   */
  const renderTrackList = () => {
    if (!trackListEl) return;

    const html = TRACKS.map((track, index) => `
      <div class="track-item" data-index="${index}">
        <div class="track-number-col">
          <span class="track-number">${track.number}</span>
          <span class="track-play-icon">${ICONS.play}</span>
          <div class="equalizer">
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
          </div>
        </div>
        <div class="track-info">
          <span class="track-title">${track.title}</span>
          <span class="track-artist">${ARTIST}</span>
        </div>
        <span class="track-duration" data-index="${index}">--:--</span>
      </div>
    `).join('');

    trackListEl.innerHTML = html;

    // Update track count
    if (albumTrackCount) {
      albumTrackCount.textContent = `${TRACKS.length} songs`;
    }

    // Attach click handlers
    trackListEl.querySelectorAll('.track-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        if (currentTrackIndex === idx && isPlaying) {
          togglePlayPause();
        } else if (currentTrackIndex === idx && !isPlaying) {
          togglePlayPause();
        } else {
          playTrack(idx);
        }
      });
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TRACK DURATION LOADING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Load all track durations by creating temporary Audio objects.
   * Updates the track list duration spans and the album total duration.
   */
  const loadAllDurations = () => {
    let loadedCount = 0;

    TRACKS.forEach((track, index) => {
      const tempAudio = new Audio();
      tempAudio.preload = 'metadata';

      tempAudio.addEventListener('loadedmetadata', () => {
        trackDurations[index] = tempAudio.duration;
        const durationSpan = trackListEl?.querySelector(`.track-duration[data-index="${index}"]`);
        if (durationSpan) {
          durationSpan.textContent = formatTime(tempAudio.duration);
        }

        loadedCount++;
        if (loadedCount === TRACKS.length) {
          updateAlbumDuration();
        }

        // Clean up
        tempAudio.src = '';
      });

      tempAudio.addEventListener('error', () => {
        loadedCount++;
        if (loadedCount === TRACKS.length) {
          updateAlbumDuration();
        }
      });

      tempAudio.src = track.file;
    });
  };

  /**
   * Calculate and display total album duration
   */
  const updateAlbumDuration = () => {
    const total = trackDurations.reduce((sum, d) => sum + d, 0);
    if (albumDuration) {
      albumDuration.textContent = formatDuration(total);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYBACK ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Load and play a specific track by index
   * @param {number} index — zero-based track index
   */
  const playTrack = (index) => {
    if (index < 0 || index >= TRACKS.length) return;

    currentTrackIndex = index;
    const track = TRACKS[index];

    // Set audio source and play
    audioPlayer.src = track.file;
    audioPlayer.play().then(() => {
      isPlaying = true;
      updatePlayPauseIcon();
      updateTrackListUI();
      updatePlayerBarInfo();
      showPlayerBar();
      updateMediaSession();
      startProgressAnimation();
    }).catch((err) => {
      console.warn('Playback failed:', err);
      // Still update UI even if autoplay is blocked
      isPlaying = false;
      updatePlayPauseIcon();
      updateTrackListUI();
      updatePlayerBarInfo();
      showPlayerBar();
      updateMediaSession();
    });
  };

  /**
   * Toggle play/pause state
   */
  const togglePlayPause = () => {
    if (currentTrackIndex === -1) {
      // No track loaded — play the first track (or first in shuffle order)
      const firstIdx = isShuffled && shuffleOrder.length ? shuffleOrder[0] : 0;
      playTrack(firstIdx);
      return;
    }

    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      cancelAnimationFrame(animFrameId);
    } else {
      audioPlayer.play().then(() => {
        isPlaying = true;
        startProgressAnimation();
      }).catch((err) => {
        console.warn('Resume failed:', err);
      });
    }

    updatePlayPauseIcon();
    updateTrackListUI();
  };

  /**
   * Skip to next track (respecting shuffle order and repeat mode)
   */
  const playNext = () => {
    if (currentTrackIndex === -1) return;

    let nextIndex;

    if (repeatMode === 2) {
      // Repeat One — replay same track
      playTrack(currentTrackIndex);
      return;
    }

    if (isShuffled && shuffleOrder.length) {
      const currentPosInShuffle = shuffleOrder.indexOf(currentTrackIndex);
      if (currentPosInShuffle < shuffleOrder.length - 1) {
        nextIndex = shuffleOrder[currentPosInShuffle + 1];
      } else if (repeatMode === 1) {
        // Repeat All — loop back
        shuffleOrder = createShuffleOrder(TRACKS.length);
        nextIndex = shuffleOrder[0];
      } else {
        // No repeat — stop
        isPlaying = false;
        updatePlayPauseIcon();
        updateTrackListUI();
        cancelAnimationFrame(animFrameId);
        return;
      }
    } else {
      if (currentTrackIndex < TRACKS.length - 1) {
        nextIndex = currentTrackIndex + 1;
      } else if (repeatMode === 1) {
        nextIndex = 0;
      } else {
        // No repeat — stop
        isPlaying = false;
        updatePlayPauseIcon();
        updateTrackListUI();
        cancelAnimationFrame(animFrameId);
        return;
      }
    }

    playTrack(nextIndex);
  };

  /**
   * Go to previous track, or restart current if more than 3 seconds in
   */
  const playPrev = () => {
    if (currentTrackIndex === -1) return;

    // If more than 3 seconds into the track, restart it
    if (audioPlayer.currentTime > 3) {
      audioPlayer.currentTime = 0;
      if (!isPlaying) {
        togglePlayPause();
      }
      return;
    }

    let prevIndex;

    if (isShuffled && shuffleOrder.length) {
      const currentPosInShuffle = shuffleOrder.indexOf(currentTrackIndex);
      if (currentPosInShuffle > 0) {
        prevIndex = shuffleOrder[currentPosInShuffle - 1];
      } else if (repeatMode === 1) {
        prevIndex = shuffleOrder[shuffleOrder.length - 1];
      } else {
        audioPlayer.currentTime = 0;
        return;
      }
    } else {
      if (currentTrackIndex > 0) {
        prevIndex = currentTrackIndex - 1;
      } else if (repeatMode === 1) {
        prevIndex = TRACKS.length - 1;
      } else {
        audioPlayer.currentTime = 0;
        return;
      }
    }

    playTrack(prevIndex);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // UI UPDATES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Update play/pause button icon */
  const updatePlayPauseIcon = () => {
    if (playPauseBtn) {
      playPauseBtn.innerHTML = isPlaying ? ICONS.pause : ICONS.play;
    }
  };

  /** Update player bar info (art, track name, artist) */
  const updatePlayerBarInfo = () => {
    if (currentTrackIndex < 0) return;
    const track = TRACKS[currentTrackIndex];

    if (playerAlbumArt) playerAlbumArt.src = ALBUM_ART;
    if (playerTrackName) playerTrackName.textContent = track.title;
    if (playerTrackArtist) playerTrackArtist.textContent = ARTIST;
  };

  /** Show player bar with slide-up animation */
  const showPlayerBar = () => {
    if (playerBarVisible || !playerBar) return;
    playerBarVisible = true;
    playerBar.classList.remove('hidden');
    playerBar.classList.add('visible');

    // Adjust main content padding
    const mainContent = document.querySelector('.main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.style.paddingBottom = `${playerBar.offsetHeight + 16}px`;
    }
  };

  /** Update track list active/playing states */
  const updateTrackListUI = () => {
    if (!trackListEl) return;

    trackListEl.querySelectorAll('.track-item').forEach((item) => {
      const idx = parseInt(item.dataset.index, 10);
      const isActive = idx === currentTrackIndex;

      item.classList.toggle('active', isActive);
      item.classList.toggle('playing', isActive && isPlaying);

      const trackNumber = item.querySelector('.track-number');
      const playIcon    = item.querySelector('.track-play-icon');
      const equalizer   = item.querySelector('.equalizer');

      if (isActive) {
        // Active track: hide number, show equalizer when playing
        if (trackNumber) trackNumber.style.display = 'none';
        if (playIcon) playIcon.style.display = 'none';
        if (equalizer) equalizer.style.display = isPlaying ? 'flex' : 'none';

        // If active but paused, show play icon
        if (!isPlaying) {
          if (playIcon) playIcon.style.display = 'flex';
        }
      } else {
        // Non-active: show number, hide equalizer
        if (trackNumber) trackNumber.style.display = '';
        if (playIcon) playIcon.style.display = '';
        if (equalizer) equalizer.style.display = 'none';
      }
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESS BAR
  // ═══════════════════════════════════════════════════════════════════════════

  /** Smooth real-time progress update using requestAnimationFrame */
  const startProgressAnimation = () => {
    cancelAnimationFrame(animFrameId);

    const update = () => {
      if (!isDraggingProgress) {
        updateProgressUI();
      }
      if (isPlaying) {
        animFrameId = requestAnimationFrame(update);
      }
    };

    animFrameId = requestAnimationFrame(update);
  };

  /** Update progress bar width, handle position, and current time text */
  const updateProgressUI = () => {
    const duration = audioPlayer.duration || 0;
    const current  = audioPlayer.currentTime || 0;
    const pct      = duration > 0 ? (current / duration) * 100 : 0;

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressHandle) progressHandle.style.left = `${pct}%`;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
  };

  /** Update total time display when metadata loads */
  const updateTotalTime = () => {
    if (totalTimeEl) {
      totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
  };

  /**
   * Seek to a position based on a click/touch X coordinate
   * @param {number} clientX — the pointer X position
   */
  const seekFromPosition = (clientX) => {
    if (!progressBarWrapper) return;
    const rect = progressBarWrapper.getBoundingClientRect();
    const pct  = clamp((clientX - rect.left) / rect.width, 0, 1);
    const duration = audioPlayer.duration || 0;
    audioPlayer.currentTime = pct * duration;
    updateProgressUI();
  };

  // Progress bar click to seek
  if (progressBarWrapper) {
    progressBarWrapper.addEventListener('click', (e) => {
      if (!isDraggingProgress) {
        seekFromPosition(e.clientX);
      }
    });
  }

  // Progress handle drag (mouse)
  if (progressHandle) {
    progressHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingProgress = true;
      document.body.style.userSelect = 'none';

      const onMove = (ev) => {
        seekFromPosition(ev.clientX);
      };
      const onUp = () => {
        isDraggingProgress = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    // Progress handle drag (touch)
    progressHandle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingProgress = true;

      const onMove = (ev) => {
        const touch = ev.touches[0];
        seekFromPosition(touch.clientX);
      };
      const onUp = () => {
        isDraggingProgress = false;
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };

      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }, { passive: false });
  }

  // Also allow dragging from the progress bar wrapper itself (touch)
  if (progressBarWrapper) {
    progressBarWrapper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDraggingProgress = true;
      const touch = e.touches[0];
      seekFromPosition(touch.clientX);

      const onMove = (ev) => {
        const t = ev.touches[0];
        seekFromPosition(t.clientX);
      };
      const onUp = () => {
        isDraggingProgress = false;
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };

      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }, { passive: false });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VOLUME CONTROL
  // ═══════════════════════════════════════════════════════════════════════════

  /** Update volume bar UI based on current audio volume */
  const updateVolumeUI = () => {
    const vol = audioPlayer.volume;
    const pct = vol * 100;

    if (volumeBar) volumeBar.style.width = `${pct}%`;
    if (volumeHandle) volumeHandle.style.left = `${pct}%`;

    // Update volume icon
    updateVolumeIcon();
  };

  /** Update volume icon SVG based on volume level and mute state */
  const updateVolumeIcon = () => {
    if (!volumeBtn) return;
    const vol = audioPlayer.volume;

    if (isMuted || vol === 0) {
      volumeBtn.innerHTML = ICONS.volumeMute;
    } else if (vol < 0.33) {
      volumeBtn.innerHTML = ICONS.volumeLow;
    } else if (vol < 0.66) {
      volumeBtn.innerHTML = ICONS.volumeMedium;
    } else {
      volumeBtn.innerHTML = ICONS.volumeHigh;
    }
  };

  /**
   * Set volume from a click/touch X coordinate
   * @param {number} clientX
   */
  const setVolumeFromPosition = (clientX) => {
    if (!volumeBarWrapper) return;
    const rect = volumeBarWrapper.getBoundingClientRect();
    const pct  = clamp((clientX - rect.left) / rect.width, 0, 1);
    audioPlayer.volume = pct;
    isMuted = pct === 0;
    previousVolume = pct > 0 ? pct : previousVolume;
    saveVolume(pct);
    updateVolumeUI();
  };

  /** Toggle mute/unmute */
  const toggleMute = () => {
    if (isMuted) {
      audioPlayer.volume = previousVolume;
      isMuted = false;
    } else {
      previousVolume = audioPlayer.volume;
      audioPlayer.volume = 0;
      isMuted = true;
    }
    updateVolumeUI();
  };

  // Volume bar click
  if (volumeBarWrapper) {
    volumeBarWrapper.addEventListener('click', (e) => {
      if (!isDraggingVolume) {
        setVolumeFromPosition(e.clientX);
      }
    });
  }

  // Volume handle drag (mouse)
  if (volumeHandle) {
    volumeHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingVolume = true;
      document.body.style.userSelect = 'none';

      const onMove = (ev) => {
        setVolumeFromPosition(ev.clientX);
      };
      const onUp = () => {
        isDraggingVolume = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    // Volume handle drag (touch)
    volumeHandle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingVolume = true;

      const onMove = (ev) => {
        const touch = ev.touches[0];
        setVolumeFromPosition(touch.clientX);
      };
      const onUp = () => {
        isDraggingVolume = false;
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };

      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }, { passive: false });
  }

  // Volume bar touch
  if (volumeBarWrapper) {
    volumeBarWrapper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDraggingVolume = true;
      const touch = e.touches[0];
      setVolumeFromPosition(touch.clientX);

      const onMove = (ev) => {
        const t = ev.touches[0];
        setVolumeFromPosition(t.clientX);
      };
      const onUp = () => {
        isDraggingVolume = false;
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };

      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }, { passive: false });
  }

  // Volume button click
  if (volumeBtn) {
    volumeBtn.addEventListener('click', toggleMute);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SHUFFLE MODE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Toggle shuffle mode on/off */
  const toggleShuffle = () => {
    isShuffled = !isShuffled;

    if (isShuffled) {
      shuffleOrder = createShuffleOrder(TRACKS.length, currentTrackIndex);
    } else {
      shuffleOrder = [];
    }

    // Update both shuffle buttons
    if (shuffleBtn) shuffleBtn.classList.toggle('active', isShuffled);
    if (shuffleToggle) shuffleToggle.classList.toggle('active', isShuffled);
  };

  if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
  if (shuffleToggle) shuffleToggle.addEventListener('click', toggleShuffle);

  // ═══════════════════════════════════════════════════════════════════════════
  // REPEAT MODE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Cycle through repeat modes: off → all → one → off */
  const cycleRepeatMode = () => {
    repeatMode = (repeatMode + 1) % 3;

    if (repeatBtn) {
      switch (repeatMode) {
        case 0:
          repeatBtn.innerHTML = ICONS.repeat;
          repeatBtn.classList.remove('active');
          break;
        case 1:
          repeatBtn.innerHTML = ICONS.repeat;
          repeatBtn.classList.add('active');
          break;
        case 2:
          repeatBtn.innerHTML = ICONS.repeatOne;
          repeatBtn.classList.add('active');
          break;
      }
    }
  };

  if (repeatBtn) repeatBtn.addEventListener('click', cycleRepeatMode);

  // ═══════════════════════════════════════════════════════════════════════════
  // LIKE / FAVORITE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Toggle album liked state */
  const toggleAlbumLike = () => {
    isAlbumLiked = !isAlbumLiked;

    if (likeAlbum) {
      likeAlbum.classList.toggle('liked', isAlbumLiked);
      likeAlbum.innerHTML = isAlbumLiked ? ICONS.heartFilled : ICONS.heartOutline;
    }

    saveLikedState(isAlbumLiked);
  };

  /** Toggle track liked state in player bar */
  const toggleTrackLike = () => {
    isTrackLiked = !isTrackLiked;

    if (playerLikeBtn) {
      playerLikeBtn.classList.toggle('liked', isTrackLiked);
      playerLikeBtn.innerHTML = isTrackLiked ? ICONS.heartFilled : ICONS.heartOutline;
    }
  };

  if (likeAlbum) likeAlbum.addEventListener('click', toggleAlbumLike);
  if (playerLikeBtn) playerLikeBtn.addEventListener('click', toggleTrackLike);

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAY ALL / SHUFFLE PLAY
  // ═══════════════════════════════════════════════════════════════════════════

  if (playAllBtn) {
    playAllBtn.addEventListener('click', () => {
      if (isShuffled) {
        // Already shuffled — just play
        shuffleOrder = createShuffleOrder(TRACKS.length);
        playTrack(shuffleOrder[0]);
      } else {
        playTrack(0);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER CONTROLS EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════════════════

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (prevBtn) prevBtn.addEventListener('click', playPrev);
  if (nextBtn) nextBtn.addEventListener('click', playNext);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO EVENTS
  // ═══════════════════════════════════════════════════════════════════════════

  audioPlayer.addEventListener('loadedmetadata', () => {
    updateTotalTime();
    updateProgressUI();
  });

  audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 2) {
      // Repeat One
      audioPlayer.currentTime = 0;
      audioPlayer.play().catch(() => {});
      return;
    }

    playNext();
  });

  audioPlayer.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    // Try to continue to the next track
    if (currentTrackIndex < TRACKS.length - 1) {
      playNext();
    }
  });

  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayPauseIcon();
    updateTrackListUI();
    cancelAnimationFrame(animFrameId);
  });

  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    updatePlayPauseIcon();
    updateTrackListUI();
    startProgressAnimation();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // MOBILE SIDEBAR
  // ═══════════════════════════════════════════════════════════════════════════

  /** Toggle sidebar open/close on mobile */
  const toggleSidebar = () => {
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('open');

    if (isOpen) {
      sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
    } else {
      sidebar.classList.add('open');
      if (sidebarOverlay) sidebarOverlay.classList.add('visible');
    }
  };

  if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════════════════════

  document.addEventListener('keydown', (e) => {
    // Ignore when focused on input/textarea
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (audioPlayer.duration) {
          audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 5, audioPlayer.duration);
          updateProgressUI();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 5, 0);
        updateProgressUI();
        break;
      case 'ArrowUp':
        e.preventDefault();
        audioPlayer.volume = clamp(audioPlayer.volume + 0.1, 0, 1);
        isMuted = false;
        saveVolume(audioPlayer.volume);
        updateVolumeUI();
        break;
      case 'ArrowDown':
        e.preventDefault();
        audioPlayer.volume = clamp(audioPlayer.volume - 0.1, 0, 1);
        if (audioPlayer.volume === 0) isMuted = true;
        saveVolume(audioPlayer.volume);
        updateVolumeUI();
        break;
      case 'm':
      case 'M':
        toggleMute();
        break;
      case 'n':
      case 'N':
        playNext();
        break;
      case 'p':
      case 'P':
        playPrev();
        break;
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDIA SESSION API
  // ═══════════════════════════════════════════════════════════════════════════

  /** Set up Media Session metadata for the current track */
  const updateMediaSession = () => {
    if (!('mediaSession' in navigator)) return;
    if (currentTrackIndex < 0) return;

    const track = TRACKS[currentTrackIndex];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: ARTIST,
      album: ALBUM,
      artwork: [
        { src: ALBUM_ART, sizes: '512x512', type: 'image/jpeg' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => {
      togglePlayPause();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      togglePlayPause();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      playPrev();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playNext();
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  const init = () => {
    // Render track list
    renderTrackList();

    // Load all track durations
    loadAllDurations();

    // Initialize volume from localStorage
    const savedVolume = loadVolume();
    audioPlayer.volume = savedVolume;
    previousVolume = savedVolume;
    updateVolumeUI();

    // Restore liked state
    isAlbumLiked = loadLikedState();
    if (likeAlbum) {
      likeAlbum.classList.toggle('liked', isAlbumLiked);
      likeAlbum.innerHTML = isAlbumLiked ? ICONS.heartFilled : ICONS.heartOutline;
    }

    // Initialize play/pause icon
    updatePlayPauseIcon();

    // Set initial button icons
    if (shuffleBtn) shuffleBtn.innerHTML = ICONS.shuffle;
    if (shuffleToggle) shuffleToggle.innerHTML = ICONS.shuffle;
    if (repeatBtn) repeatBtn.innerHTML = ICONS.repeat;
    if (prevBtn) prevBtn.innerHTML = ICONS.prev;
    if (nextBtn) nextBtn.innerHTML = ICONS.next;
    if (playerLikeBtn) playerLikeBtn.innerHTML = ICONS.heartOutline;

    // Set initial player album art
    if (playerAlbumArt) playerAlbumArt.src = ALBUM_ART;

    // Page load animation — add .loaded class after a short delay
    const appEl = document.querySelector('.app');
    if (appEl) {
      setTimeout(() => {
        appEl.classList.add('loaded');
      }, 100);
    }
  };

  init();
});
