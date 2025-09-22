// 歌单模板配置
export interface PlaylistTemplate {
  id: string;
  name: string;
  description: string;
  category: 'mood' | 'style' | 'creative' | 'artist';
  tags: string[];
  icon: string;
  gradient: string;
}

export const playlistTemplates: PlaylistTemplate[] = [
  // 心情与场景
  {
    id: 'morning-wake',
    name: '清晨唤醒',
    description: '温柔的晨光，轻快的节拍，开启美好的一天',
    category: 'mood',
    tags: ['轻音乐', '流行', '治愈系'],
    icon: '🌅',
    gradient: 'from-orange-400 via-yellow-400 to-amber-300'
  },
  {
    id: 'midnight-study',
    name: '深夜书房',
    description: '静谧的夜晚，专注的时光，思维的深度漫游',
    category: 'mood',
    tags: ['轻音乐', '古典', '环境音乐'],
    icon: '🌙',
    gradient: 'from-indigo-600 via-purple-600 to-blue-800'
  },
  {
    id: 'commute-energy',
    name: '通勤能量站',
    description: '充满活力的节拍，为忙碌的通勤路上注入能量',
    category: 'mood',
    tags: ['流行', '电子', '摇滚'],
    icon: '🚇',
    gradient: 'from-red-500 via-orange-500 to-yellow-500'
  },
  {
    id: 'rain-sleep',
    name: '雨声伴眠',
    description: '轻柔的雨声，安静的旋律，带你进入甜美梦乡',
    category: 'mood',
    tags: ['白噪音', '轻音乐', '治愈系'],
    icon: '🌧️',
    gradient: 'from-slate-400 via-gray-500 to-blue-600'
  },
  {
    id: 'workout-blast',
    name: '健身轰炸',
    description: '强劲的节拍，燃烧的激情，释放你的运动潜能',
    category: 'mood',
    tags: ['电子', '摇滚', '说唱'],
    icon: '💪',
    gradient: 'from-red-600 via-pink-600 to-purple-600'
  },
  {
    id: 'weekend-lazy',
    name: '周末慵懒',
    description: '慢节奏的午后，温暖的阳光，享受悠闲时光',
    category: 'mood',
    tags: ['轻摇滚', 'R&B', '民谣'],
    icon: '☕',
    gradient: 'from-amber-400 via-orange-400 to-red-400'
  },
  {
    id: 'travel-diary',
    name: '旅途漫记',
    description: '窗外的风景，心中的远方，记录每一段旅程',
    category: 'mood',
    tags: ['民谣', '独立音乐', '流行'],
    icon: '🚗',
    gradient: 'from-green-400 via-blue-400 to-purple-500'
  },
  {
    id: 'heartbreak-heal',
    name: '失恋疗愈',
    description: '温柔的拥抱，治愈的力量，陪伴你走过低谷',
    category: 'mood',
    tags: ['治愈系', 'R&B', '民谣'],
    icon: '💔',
    gradient: 'from-pink-400 via-rose-400 to-red-400'
  },
  {
    id: 'focus-study',
    name: '专注学习',
    description: '纯净的旋律，专注的氛围，提升学习效率',
    category: 'mood',
    tags: ['轻音乐', '古典', '环境音乐'],
    icon: '📚',
    gradient: 'from-blue-400 via-cyan-400 to-teal-400'
  },
  {
    id: 'party-night',
    name: '派对狂欢',
    description: '动感的节拍，狂欢的夜晚，释放你的激情',
    category: 'mood',
    tags: ['电子', '流行', '说唱'],
    icon: '🎉',
    gradient: 'from-purple-500 via-pink-500 to-red-500'
  },

  // 音乐风格
  {
    id: 'chinese-pop-memory',
    name: '华语流行记忆',
    description: '经典华语流行歌曲，承载着一代人的青春记忆',
    category: 'style',
    tags: ['华语流行', '经典', '怀旧'],
    icon: '🎤',
    gradient: 'from-red-500 via-yellow-500 to-red-600'
  },
  {
    id: 'indie-rock-voice',
    name: '独立摇滚之声',
    description: '原创的力量，独立的精神，摇滚的灵魂',
    category: 'style',
    tags: ['独立摇滚', '摇滚', '原创'],
    icon: '🎸',
    gradient: 'from-gray-700 via-red-600 to-black'
  },
  {
    id: 'jazz-cafe',
    name: '爵士咖啡馆',
    description: '慵懒的午后，醇香的咖啡，优雅的爵士乐',
    category: 'style',
    tags: ['爵士', '轻音乐', '咖啡馆'],
    icon: '🎷',
    gradient: 'from-amber-600 via-yellow-700 to-orange-800'
  },
  {
    id: 'electronic-maze',
    name: '电子迷宫',
    description: '未来的声音，科技的律动，电子音乐的无限可能',
    category: 'style',
    tags: ['电子', '科技', '未来'],
    icon: '🤖',
    gradient: 'from-cyan-400 via-blue-500 to-purple-600'
  },
  {
    id: 'classical-moment',
    name: '古典时刻',
    description: '永恒的经典，优雅的旋律，古典音乐的魅力',
    category: 'style',
    tags: ['古典', '交响乐', '优雅'],
    icon: '🎼',
    gradient: 'from-purple-800 via-indigo-700 to-blue-900'
  },
  {
    id: 'country-road',
    name: '乡村公路',
    description: '自由的风，开阔的路，乡村音乐的纯真',
    category: 'style',
    tags: ['乡村', '民谣', '自由'],
    icon: '🛣️',
    gradient: 'from-green-600 via-yellow-600 to-orange-600'
  },
  {
    id: 'metal-roar',
    name: '金属咆哮',
    description: '力量的释放，激情的咆哮，金属音乐的震撼',
    category: 'style',
    tags: ['金属', '重摇滚', '激情'],
    icon: '⚡',
    gradient: 'from-gray-900 via-red-800 to-black'
  },
  {
    id: 'rnb-romance',
    name: 'R&B浪漫律动',
    description: '丝滑的节拍，浪漫的情调，R&B的魅力',
    category: 'style',
    tags: ['R&B', '浪漫', '节奏'],
    icon: '💕',
    gradient: 'from-pink-500 via-purple-500 to-indigo-600'
  },
  {
    id: 'ancient-style',
    name: '古风雅韵',
    description: '古典的韵味，现代的编曲，古风音乐的诗意',
    category: 'style',
    tags: ['古风', '中国风', '诗意'],
    icon: '🏮',
    gradient: 'from-red-700 via-yellow-600 to-orange-700'
  },
  {
    id: 'funk-soul',
    name: '放克灵魂乐',
    description: '律动的灵魂，放克的节拍，音乐的纯粹快乐',
    category: 'style',
    tags: ['放克', '灵魂乐', '律动'],
    icon: '🕺',
    gradient: 'from-yellow-500 via-orange-500 to-red-600'
  },

  // 创意与诗意
  {
    id: 'future-past',
    name: '遇见未来的过去',
    description: '时间的交错，记忆的重叠，在音乐中穿越时空',
    category: 'creative',
    tags: ['电影原声', '独立音乐', '实验'],
    icon: '⏰',
    gradient: 'from-indigo-500 via-purple-600 to-pink-500'
  },
  {
    id: 'star-poems',
    name: '星辰下的诗篇',
    description: '夜空的诗意，星光的浪漫，音乐中的宇宙',
    category: 'creative',
    tags: ['民谣', '独立音乐', '诗意'],
    icon: '⭐',
    gradient: 'from-indigo-900 via-purple-800 to-blue-900'
  },
  {
    id: 'lyrics-secret',
    name: '藏在歌词里的秘密',
    description: '文字的力量，歌词的深度，音乐中的故事',
    category: 'creative',
    tags: ['民谣', '独立音乐', '故事'],
    icon: '📝',
    gradient: 'from-amber-500 via-orange-600 to-red-600'
  },
  {
    id: 'heart-journey',
    name: '心向远方的旅程',
    description: '内心的远方，音乐的旅程，灵魂的自由',
    category: 'creative',
    tags: ['民谣', '独立音乐', '旅行'],
    icon: '🧭',
    gradient: 'from-green-500 via-teal-500 to-blue-600'
  },
  {
    id: 'time-machine',
    name: '时光机',
    description: '回到过去，展望未来，音乐是最好的时光机',
    category: 'creative',
    tags: ['怀旧', '经典', '回忆'],
    icon: '🚀',
    gradient: 'from-purple-600 via-blue-600 to-cyan-500'
  },
  {
    id: 'city-lonely-walk',
    name: '城市孤独漫步',
    description: '霓虹灯下的孤独，城市中的漫步，现代人的心境',
    category: 'creative',
    tags: ['独立音乐', '城市', '孤独'],
    icon: '🌃',
    gradient: 'from-gray-600 via-blue-700 to-indigo-800'
  },
  {
    id: 'summer-loop-diary',
    name: '夏日循环日记',
    description: '夏天的记忆，循环的旋律，青春的日记',
    category: 'creative',
    tags: ['流行', '青春', '夏日'],
    icon: '🌻',
    gradient: 'from-yellow-400 via-orange-400 to-red-500'
  },
  {
    id: 'autumn-whisper',
    name: '秋日私语',
    description: '秋天的温柔，私语的浪漫，季节的诗意',
    category: 'creative',
    tags: ['轻音乐', '浪漫', '季节'],
    icon: '🍂',
    gradient: 'from-orange-600 via-red-600 to-yellow-700'
  }
];

export const templateCategories = [
  { id: 'mood', name: '心情与场景', icon: '🎭' },
  { id: 'style', name: '音乐风格', icon: '🎵' },
  { id: 'creative', name: '创意与诗意', icon: '✨' }
] as const;