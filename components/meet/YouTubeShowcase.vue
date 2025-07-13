<template>
  <div class="youtube-showcase">
    <h2>Featured Content</h2>
    
    <div class="videos-grid">
      <a 
        v-for="video in videos" 
        :key="video.id"
        :href="`https://youtube.com/watch?v=${video.id}`"
        target="_blank"
        class="video-card"
      >
        <div class="video-thumbnail">
          <img :src="video.thumbnail" :alt="video.title" />
          <span class="video-duration">{{ video.duration }}</span>
          <div class="play-overlay">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        <div class="video-info">
          <h3>{{ video.title }}</h3>
          <div class="video-meta">
            <span>{{ video.views }} views</span>
            <span>•</span>
            <span>{{ video.publishedAt }}</span>
          </div>
        </div>
      </a>
    </div>
    
    <div v-if="youtubeChannel" class="channel-cta">
      <p>Want to see more content?</p>
      <a :href="youtubeChannel" target="_blank" class="youtube-button">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        Subscribe on YouTube
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from './ExpertGrid.vue'

interface Props {
  videos: Video[]
  youtubeChannel?: string
}

defineProps<Props>()
</script>

<style scoped>
.youtube-showcase {
  margin-top: 3rem;
}

.youtube-showcase h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.video-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: var(--border-secondary);
}

.video-thumbnail {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  background: var(--bg-quaternary);
}

.video-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .play-overlay {
  opacity: 1;
}

.video-info {
  padding: 1rem;
}

.video-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.channel-cta {
  text-align: center;
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
}

.channel-cta p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.youtube-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: #FF0000;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.youtube-button:hover {
  background: #CC0000;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .videos-grid {
    grid-template-columns: 1fr;
  }
}
</style>