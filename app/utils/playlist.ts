// 뮤직 플레이어 플레이리스트. 곡을 추가하려면 배열에 한 줄 추가하면 된다.
// `src` 는 baseURL(/freak) 을 포함한 절대 경로로 둔다.
export interface Track {
  src: string
  title: string
  artist: string
}

export const PLAYLIST: Track[] = [
  {
    src: '/freak/music/song_01.mp3',
    title: '꿈을꿨어요',
    artist: '카더가든',
  },
  {
    src: '/freak/music/song_02.mp3',
    title: '기다린 만큼 더',
    artist: '검정치마',
  },
]
