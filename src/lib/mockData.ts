import { SonicEra, SonicCurrent, PlayRecord, DiscoverySpike, ComfortAlbum, LoopObsession, DormantBanger } from '../types';
import { evaluatePlayRecord, DEFAULT_CLEANSER_CONFIG } from './cleanser';

export const SONIC_CURRENTS: SonicCurrent[] = [
  {
    id: 'current-rnb',
    name: 'Atmospheric R&B & Neo-Soul',
    shortName: 'Atmospheric R&B',
    color: '#7c5295',
    secondaryColor: '#523466',
    description: 'Nocturnal synth beds, Fender Rhodes chords, and intimate soul vocals.',
    anchorArtists: ['SiR', 'Brent Faiyaz', 'Frank Ocean', 'The Weeknd']
  },
  {
    id: 'current-hiphop',
    name: 'US / UK Hip-Hop & Wave',
    shortName: 'US/UK Hip-Hop',
    color: '#3b5998',
    secondaryColor: '#253963',
    description: 'Toronto nocturnal rap, melodic trap, and UK wave cadences.',
    anchorArtists: ['Drake', 'Future', 'Bryson Tiller', 'M Huncho']
  },
  {
    id: 'current-cinema',
    name: 'Tamil Cinema Scores & Folk',
    shortName: 'Tamil Cinema OST',
    color: '#c26d2e',
    secondaryColor: '#8c4919',
    description: 'Sweeping orchestral strings, rural folk brass, and South Indian soundtracks.',
    anchorArtists: ['Govind Vasantha', 'Santhosh Narayanan', 'Anirudh Ravichander', 'A.R. Rahman', 'Charan Raj', 'Ludwig Göransson']
  },
  {
    id: 'current-sufi',
    name: 'Sufi & Devotional Acoustic',
    shortName: 'Sufi & Devotional',
    color: '#2d7a64',
    secondaryColor: '#1a4d3e',
    description: 'Sacred vocal meditations, Carnatic-Sufi fusion, and grounding acoustics.',
    anchorArtists: ['Gayathri Krishnan', 'Dhanush & G.V. Prakash']
  },
  {
    id: 'current-tamil-soul',
    name: 'Tamil Indie Soul & R&B',
    shortName: 'Tamil Indie Soul',
    color: '#a85c7b',
    secondaryColor: '#733b52',
    description: 'Diaspora and independent Tamil R&B, dreamy vocal layering, and bedroom soul.',
    anchorArtists: ['Akshara', 'Bebhumika', 'Shreea Kaul', 'Achu & Arshan Anton']
  },
  {
    id: 'current-tamil-rap',
    name: 'Tamil Rap & Street Drill',
    shortName: 'Tamil Rap & Drill',
    color: '#d97736',
    secondaryColor: '#964c1b',
    description: 'Heavy 808 slide basslines, underground Tamil street lyricism, and trap velocity.',
    anchorArtists: ['JanZee Official', 'IFT PROD', 'Flameboi', 'Retro']
  },
  {
    id: 'current-jazz',
    name: 'Vocal Jazz & Standards',
    shortName: 'Vocal Jazz',
    color: '#c96a8b',
    secondaryColor: '#8c425c',
    description: 'Close-mic velvet jazz phrasing, cello-led ballads, and orchestral pop warmth.',
    anchorArtists: ['Laufey', 'Natalie Jinju']
  },
  {
    id: 'current-remix',
    name: '3D Spatial & Tamil Mixes',
    shortName: '3D Tamil Mixes',
    color: '#8b49b8',
    secondaryColor: '#5b2b7d',
    description: 'Spatial audio bass edits, club mashups, and high-energy Tamil DJ reworks.',
    anchorArtists: ['3d Sound', 'Clickz & 3d Sound', 'DJ Jeeva', 'HL mixes', 'PravZ']
  }
];

export const SONIC_ERAS: SonicEra[] = [
  {
    id: 'era-rnb-hiphop',
    name: 'Midnight Velvet & Drill',
    subtitle: 'R&B, UK & US Hip-Hop',
    timeRange: '2020 – 2021',
    startDate: '2020-01-01',
    endDate: '2021-12-31',
    color: '#8b5cf6', // Violet
    gradient: 'from-purple-900/40 via-indigo-900/30 to-blue-900/20',
    description: 'Late-night brooding basslines, moody synth layers, and atmospheric vocals defining the solitary quarantine and study seasons.',
    keyArtists: ['Brent Faiyaz', 'SiR', 'Drake', 'Frank Ocean', 'Bryson Tiller', 'Future', 'M Huncho'],
    vibeTags: ['Atmospheric R&B', 'Toronto Sound', 'UK Wave', 'Midnight Introspection'],
    icon: 'Moon'
  },
  {
    id: 'era-tamil-cinema',
    name: 'The Cinematic Awakening',
    subtitle: 'Tamil Cinema & Indie Immersion',
    timeRange: '2022 – Mid 2024',
    startDate: '2022-01-01',
    endDate: '2024-07-31',
    color: '#f59e0b', // Amber / Gold
    gradient: 'from-amber-900/40 via-orange-900/30 to-rose-900/20',
    description: 'A massive sonic shift into South Indian film scores and independent classical fusion. Driven by raw acoustic strings, rural folk horns, and cinematic goosebump orchestration.',
    keyArtists: ['Anirudh Ravichander', 'Santhosh Narayanan', 'Govind Vasantha', 'Gayathri Krishnan', 'Sean Roldan'],
    vibeTags: ['Cinematic Violin', 'Rural Folk', 'Santhosh Grit', 'Melancholic OSTs'],
    icon: 'Film'
  },
  {
    id: 'era-sufi-rap',
    name: 'Devotion & The Street Verse',
    subtitle: 'Sufism, Devotional & Tamil Rap',
    timeRange: 'Late 2024',
    startDate: '2024-08-01',
    endDate: '2024-12-31',
    color: '#10b981', // Emerald
    gradient: 'from-emerald-900/40 via-teal-900/30 to-cyan-900/20',
    description: 'An explosive period of discovering underground Tamil rappers, spiritual Sufi verses, and punchy trap cadences that ignited Rath’s gym and late-evening walks.',
    keyArtists: ['JanZee Official', 'Akshara', 'Flameboi', 'Retro', 'Achu & Arshan Anton'],
    vibeTags: ['Indie Tamil Rap', 'Sufi Devotional', '808 Cadence', 'Underground Heat'],
    icon: 'Flame'
  },
  {
    id: 'era-remix-laufey',
    name: '3D Reverberations & The Laufey Seasons',
    subtitle: 'Tamil Remix Culture + Vocal Jazz',
    timeRange: '2025 – 2026+',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    color: '#ec4899', // Pink / Rose
    gradient: 'from-pink-900/40 via-rose-900/30 to-purple-900/20',
    description: 'Spatial audio bass boosts and club-shaking remix culture running alongside an affectionate recurring winter retreat into Laufey’s velvet vocal jazz.',
    keyArtists: ['3d Sound', 'DJ Jeeva', 'HL mixes', 'PravZ', 'Laufey', 'Ludwig Göransson'],
    vibeTags: ['3D Spatial Bass', 'Club Edits', 'Vintage Jazz Standards', 'Cello & Piano Warmth'],
    icon: 'Sparkles'
  }
];

export const MOCK_DISCOVERY_SPIKES: DiscoverySpike[] = [
  {
    artistName: 'JanZee Official',
    firstTrack: 'ZAZA',
    firstPlayedDate: new Date('2024-09-14T17:42:00'),
    albumCover: '/covers/JanZee Official - ZAZA.jpg',
    playsNext7Days: 52,
    playsNext14Days: 124,
    playsNext30Days: 268,
    bingeVelocityScore: 99,
    notes: 'First heard ZAZA on repeat 18 times on day 1, immediately plunging into Bad Love and Dola within 48 hours.',
    allTimeCrownTrack: 'Bad Love',
    allTimePlays: 412,
    allTimeMinutes: 1280,
    peakMonth: 'October 2024',
    peakMonthShareOfEar: 41.2,
    daysToSecondRelease: 2,
    patternType: 'Flashfire Binge',
    discographySpread: [
      { albumName: 'ZAZA (Gateway EP)', plays: 148, minutes: 440, coverUrl: '/covers/JanZee Official - ZAZA.jpg' },
      { albumName: 'Bad Love', plays: 184, minutes: 590, coverUrl: '/covers/JanZee Official - Bad Love.jpg' },
      { albumName: 'Dola', plays: 80, minutes: 250, coverUrl: '/covers/JanZee Official - Dola.jpg' }
    ],
    trajectoryCurve: [18, 32, 45, 52, 68, 89, 105, 124, 150, 185, 220, 248, 268]
  },
  {
    artistName: 'Laufey',
    firstTrack: 'From The Start',
    firstPlayedDate: new Date('2023-10-04T22:15:00'),
    albumCover: '/covers/Laufey - Bewitched _Goddess Edition_.jpg',
    playsNext7Days: 34,
    playsNext14Days: 86,
    playsNext30Days: 194,
    bingeVelocityScore: 94,
    notes: 'Triggered the recurring autumn Laufey immersion loop that returns every autumn like clockwork.',
    allTimeCrownTrack: 'Promise',
    allTimePlays: 680,
    allTimeMinutes: 2110,
    peakMonth: 'November 2023',
    peakMonthShareOfEar: 32.8,
    daysToSecondRelease: 5,
    patternType: 'Seasonal Wave',
    discographySpread: [
      { albumName: 'Bewitched (Goddess Edition)', plays: 460, minutes: 1420, coverUrl: '/covers/Laufey - Bewitched _Goddess Edition_.jpg' },
      { albumName: 'Everything I Know About Love', plays: 220, minutes: 690, coverUrl: '/covers/Laufey - Everything I Know About Love _Deluxe_.jpg' }
    ],
    trajectoryCurve: [4, 12, 22, 34, 52, 70, 86, 110, 140, 172, 194]
  },
  {
    artistName: 'SiR',
    firstTrack: 'Hair Down (feat. Kendrick Lamar)',
    firstPlayedDate: new Date('2020-03-22T01:14:00'),
    albumCover: '/covers/SiR - Chasing Summer.jpg',
    playsNext7Days: 29,
    playsNext14Days: 57,
    playsNext30Days: 118,
    bingeVelocityScore: 86,
    notes: 'The gateway album to Top Dawg Entertainment R&B during early lockdown. Became Rath’s permanent anchor.',
    allTimeCrownTrack: 'John Redcorn',
    allTimePlays: 742,
    allTimeMinutes: 2450,
    peakMonth: 'April 2020',
    peakMonthShareOfEar: 28.5,
    daysToSecondRelease: 12,
    patternType: 'Permanent Anchor',
    discographySpread: [
      { albumName: 'Chasing Summer', plays: 590, minutes: 1950, coverUrl: '/covers/SiR - Chasing Summer.jpg' },
      { albumName: 'November & Seven Sundays', plays: 152, minutes: 500, coverUrl: '/covers/SiR - Chasing Summer.jpg' }
    ],
    trajectoryCurve: [6, 14, 21, 29, 38, 48, 57, 72, 90, 106, 118]
  },
  {
    artistName: 'Govind Vasantha',
    firstTrack: 'The Life of Ram (96)',
    firstPlayedDate: new Date('2022-01-11T14:10:00'),
    albumCover: '/covers/Govind Vasantha - 96 OST.jpg',
    playsNext7Days: 38,
    playsNext14Days: 79,
    playsNext30Days: 165,
    bingeVelocityScore: 92,
    notes: 'Ignited the deep 2022-2024 Tamil cinematic pilgrimage. Violin orchestration became an emotional sanctuary.',
    allTimeCrownTrack: 'Kaathalae Kaathalae',
    allTimePlays: 890,
    allTimeMinutes: 3240,
    peakMonth: 'February 2022',
    peakMonthShareOfEar: 36.4,
    daysToSecondRelease: 18,
    patternType: 'Permanent Anchor',
    discographySpread: [
      { albumName: '96 (Original Motion Picture Soundtrack)', plays: 720, minutes: 2650, coverUrl: '/covers/Govind Vasantha - 96 OST.jpg' },
      { albumName: 'Thaikkudam Bridge & Singles', plays: 170, minutes: 590, coverUrl: '/covers/Govind Vasantha - 96 OST.jpg' }
    ],
    trajectoryCurve: [8, 19, 28, 38, 54, 68, 79, 102, 134, 155, 165]
  },
  {
    artistName: 'Gayathri Krishnan',
    firstTrack: 'Create to Express',
    firstPlayedDate: new Date('2022-04-18T19:20:00'),
    albumCover: '/covers/Gayathri Krishnan - Create to Express.jpg',
    playsNext7Days: 26,
    playsNext14Days: 62,
    playsNext30Days: 130,
    bingeVelocityScore: 89,
    notes: 'Arunachala and vocal meditations became a deep grounding habit during evening walks.',
    allTimeCrownTrack: 'Arunachala',
    allTimePlays: 420,
    allTimeMinutes: 1540,
    peakMonth: 'May 2022',
    peakMonthShareOfEar: 22.1,
    daysToSecondRelease: 8,
    patternType: 'Permanent Anchor',
    discographySpread: [
      { albumName: 'Arunachala', plays: 240, minutes: 890, coverUrl: '/covers/Gayathri Krishnan - Arunachala.jpg' },
      { albumName: 'Create to Express', plays: 180, minutes: 650, coverUrl: '/covers/Gayathri Krishnan - Create to Express.jpg' }
    ],
    trajectoryCurve: [5, 12, 19, 26, 38, 49, 62, 80, 102, 118, 130]
  },
  {
    artistName: '3d Sound',
    firstTrack: 'Vibes Two (Remix Medley)',
    firstPlayedDate: new Date('2025-02-09T20:45:00'),
    albumCover: '/covers/3d Sound - Vibes Two.jpg',
    playsNext7Days: 42,
    playsNext14Days: 95,
    playsNext30Days: 210,
    bingeVelocityScore: 96,
    notes: 'Shifted car audio habits completely into 3D spatial Tamil remixes and high tempo mashups.',
    allTimeCrownTrack: 'Vibes Two Mashup',
    allTimePlays: 510,
    allTimeMinutes: 1890,
    peakMonth: 'March 2025',
    peakMonthShareOfEar: 34.6,
    daysToSecondRelease: 4,
    patternType: 'Flashfire Binge',
    discographySpread: [
      { albumName: 'Vibes Two', plays: 320, minutes: 1180, coverUrl: '/covers/3d Sound - Vibes Two.jpg' },
      { albumName: 'Love, Clickz 2 (with Clickz)', plays: 190, minutes: 710, coverUrl: '/covers/Clickz _ 3d Sound - Love_ Clickz 2 _Deluxe_.jpg' }
    ],
    trajectoryCurve: [10, 22, 34, 42, 60, 78, 95, 125, 160, 190, 210]
  }
];

export const MOCK_COMFORT_ALBUMS: ComfortAlbum[] = [
  {
    albumName: 'Chasing Summer',
    artistName: 'SiR',
    coverUrl: '/covers/SiR - Chasing Summer.jpg',
    totalPlays: 742,
    totalMinutes: 2450,
    topTrack: 'John Redcorn',
    highStressSpikePeriod: 'Exam periods & late coding marathons',
    emotionalTag: 'Ultimate Grounding Blanket',
    repeatRatio: 4.8
  },
  {
    albumName: '96 (Original Motion Picture Soundtrack)',
    artistName: 'Govind Vasantha',
    coverUrl: '/covers/Govind Vasantha - 96 OST.jpg',
    totalPlays: 890,
    totalMinutes: 3240,
    topTrack: 'Kaathalae Kaathalae',
    highStressSpikePeriod: 'Reflective evenings & long train rides',
    emotionalTag: 'Melancholic Healing',
    repeatRatio: 5.6
  },
  {
    albumName: 'Bewitched (Goddess Edition)',
    artistName: 'Laufey',
    coverUrl: '/covers/Laufey - Bewitched _Goddess Edition_.jpg',
    totalPlays: 680,
    totalMinutes: 2110,
    topTrack: 'Promise',
    highStressSpikePeriod: 'Autumn & Winter cool downs',
    emotionalTag: 'Warm Velvet Tea',
    repeatRatio: 4.1
  },
  {
    albumName: 'Sonder Son',
    artistName: 'Brent Faiyaz',
    coverUrl: '/covers/Brent Faiyaz - Sonder Son.jpg',
    totalPlays: 530,
    totalMinutes: 1820,
    topTrack: 'First Verse',
    highStressSpikePeriod: 'Solitary midnight contemplation',
    emotionalTag: 'Late-Night Introspection',
    repeatRatio: 3.9
  },
  {
    albumName: 'Mahaan (Original Soundtrack)',
    artistName: 'Santhosh Narayanan',
    coverUrl: '/covers/Mahaan - OST.jpg',
    totalPlays: 615,
    totalMinutes: 2310,
    topTrack: 'Evanda Enakku Custody',
    highStressSpikePeriod: 'High adrenaline deadline sprints',
    emotionalTag: 'Unstoppable Flow State',
    repeatRatio: 4.4
  }
];

export const MOCK_LOOP_OBSESSIONS: LoopObsession[] = [
  {
    trackName: 'Bad Love',
    artistName: 'JanZee Official',
    coverUrl: '/covers/JanZee Official - Bad Love.jpg',
    date: '2024-09-15',
    loopCount24h: 34,
    totalMinutes24h: 102
  },
  {
    trackName: 'Kaathalae Kaathalae',
    artistName: 'Govind Vasantha',
    coverUrl: '/covers/Govind Vasantha - 96 OST.jpg',
    date: '2022-03-24',
    loopCount24h: 28,
    totalMinutes24h: 118
  },
  {
    trackName: 'Promise',
    artistName: 'Laufey',
    coverUrl: '/covers/Laufey - Bewitched _Goddess Edition_.jpg',
    date: '2023-11-12',
    loopCount24h: 23,
    totalMinutes24h: 87
  },
  {
    trackName: 'John Redcorn',
    artistName: 'SiR',
    coverUrl: '/covers/SiR - Chasing Summer.jpg',
    date: '2021-02-18',
    loopCount24h: 25,
    totalMinutes24h: 75
  },
  {
    trackName: 'Vibes Two (3D Bass)',
    artistName: '3d Sound',
    coverUrl: '/covers/3d Sound - Vibes Two.jpg',
    date: '2025-04-03',
    loopCount24h: 31,
    totalMinutes24h: 124
  }
];

// Generate an authentic sample catalog representing 2020 - 2026
export function generateMockPlayHistory(): PlayRecord[] {
  const records: PlayRecord[] = [];

  const artistsByEra = {
    '2020-2021': [
      { artist: 'Brent Faiyaz', track: 'Dead Man Walking', album: 'WASTELAND', cover: '/covers/Brent Faiyaz - WASTELAND.jpg', genre: 'R&B/Soul' },
      { artist: 'SiR', track: 'John Redcorn', album: 'Chasing Summer', cover: '/covers/SiR - Chasing Summer.jpg', genre: 'R&B/Soul' },
      { artist: 'Drake', track: 'Fair Trade (feat. Travis Scott)', album: 'Certified Lover Boy', cover: '/covers/Drake - Certified Lover Boy.jpg', genre: 'Hip-Hop/Rap' },
      { artist: 'Frank Ocean', track: 'Nights', album: 'Blonde', cover: '/covers/Frank Ocean - Blonde.jpg', genre: 'Alternative R&B' },
      { artist: 'Bryson Tiller', track: 'Exchange', album: 'TRAPSOUL', cover: '/covers/Bryson Tiller - TRAPSOUL.jpg', genre: 'R&B/Trap' },
      { artist: 'Future', track: 'Solo', album: 'HNDRXX', cover: '/covers/Future - HNDRXX.jpg', genre: 'Hip-Hop/Rap' },
      { artist: 'M Huncho', track: 'Thumb', album: 'Chasing Euphoria', cover: '/covers/M Huncho - Chasing Euphoria.jpg', genre: 'UK Trap Wave' },
    ],
    '2022-2024': [
      { artist: 'Anirudh Ravichander', track: 'Why This Kolaveri Di', album: '3 (Moonu)', cover: '/covers/3 - OST _Moonu_.jpg', genre: 'Tamil Film' },
      { artist: 'Govind Vasantha', track: 'The Life of Ram', album: '96 OST', cover: '/covers/Govind Vasantha - 96 OST.jpg', genre: 'Tamil Acoustic' },
      { artist: 'Santhosh Narayanan', track: 'Evanda Enakku Custody', album: 'Mahaan OST', cover: '/covers/Mahaan - OST.jpg', genre: 'Tamil Film' },
      { artist: 'Gayathri Krishnan', track: 'Arunachala', album: 'Arunachala', cover: '/covers/Gayathri Krishnan - Arunachala.jpg', genre: 'Devotional Classical' },
      { artist: 'Santhosh Narayanan', track: 'Karu Karu Vizhigalaal', album: 'Pariyerum Perumal OST', cover: '/covers/Pariyerum Perumal - OST.jpg', genre: 'Tamil Indie' },
      { artist: 'A.R. Rahman', track: 'Marakkuma Nenjam', album: 'Vendhu Thanindhathu Kaadu', cover: '/covers/Vendhu Thanindhathu Kaadu - OST.jpg', genre: 'Tamil Film' },
      { artist: 'Dhanush & G.V. Prakash', track: 'Pirai Thedum', album: 'Mayakkam Enna', cover: '/covers/Mayakkam Enna - OST.jpg', genre: 'Tamil Classical' },
    ],
    'late-2024': [
      { artist: 'JanZee Official', track: 'Bad Love', album: 'Bad Love', cover: '/covers/JanZee Official - Bad Love.jpg', genre: 'Tamil Rap / Drill' },
      { artist: 'JanZee Official', track: 'Dola', album: 'Dola', cover: '/covers/JanZee Official - Dola.jpg', genre: 'Tamil Rap' },
      { artist: 'JanZee Official', track: 'ZAZA', album: 'ZAZA', cover: '/covers/JanZee Official - ZAZA.jpg', genre: 'Tamil Trap' },
      { artist: 'IFT PROD', track: 'Street Cipher', album: 'TAMIL EP', cover: '/covers/Retro - TAMIL EP.jpg', genre: 'Tamil Rap / Drill' },
      { artist: 'Akshara', track: 'Butterfly', album: 'Butterfly', cover: '/covers/Akshara - Butterfly.jpg', genre: 'Tamil Indie Soul' },
      { artist: 'Akshara', track: 'Light Years', album: 'Light Years', cover: '/covers/Akshara - Light Years.jpg', genre: 'Tamil Indie Soul' },
      { artist: 'Bebhumika', track: 'Nila', album: 'Experimental EP', cover: '/covers/Akshara - Experimental EP.jpg', genre: 'Tamil Indie Soul' },
      { artist: 'Shreea Kaul', track: 'Cruel Intentions', album: 'Cruel Intentions', cover: '/covers/Shreea Kaul - Cruel Intentions.jpg', genre: 'Tamil Indie Soul' },
      { artist: 'Achu & Arshan Anton', track: 'Kadhal Fever', album: 'Kadhal Fever', cover: '/covers/Achu _ Arshan Anton - Kadhal Fever.jpg', genre: 'Tamil Indie Soul' },
      { artist: 'Gayathri Krishnan', track: 'Create to Express', album: 'Create to Express', cover: '/covers/Gayathri Krishnan - Create to Express.jpg', genre: 'Devotional Classical' },
      { artist: 'Retro', track: 'Kanave Kanave', album: 'TAMIL EP', cover: '/covers/Retro - TAMIL EP.jpg', genre: 'Tamil Rap' },
    ],
    '2025-2026': [
      { artist: '3d Sound', track: 'Vibes Two Mashup', album: 'Vibes Two', cover: '/covers/3d Sound - Vibes Two.jpg', genre: '3D Tamil Remix' },
      { artist: 'Clickz & 3d Sound', track: 'Love, Clickz 2 Medley', album: 'Love, Clickz 2', cover: '/covers/Clickz _ 3d Sound - Love_ Clickz 2 _Deluxe_.jpg', genre: 'Tamil Remix' },
      { artist: 'Laufey', track: 'From The Start', album: 'Bewitched', cover: '/covers/Laufey - Bewitched _Goddess Edition_.jpg', genre: 'Traditional Pop / Jazz' },
      { artist: 'Laufey', track: 'Promise', album: 'Bewitched', cover: '/covers/Laufey - Bewitched _Goddess Edition_.jpg', genre: 'Vocal Jazz' },
      { artist: 'Ludwig Göransson', track: 'Can You Hear The Music', album: 'Oppenheimer OST', cover: '/covers/Ludwig Goransson - Oppenheimer OST.jpg', genre: 'Cinematic Score' },
      { artist: 'Charan Raj', track: 'Kadalanu', album: 'Sapta Sagaradaache Ello Side A', cover: '/covers/Sapta Sagaradaache Ello - Side A.jpg', genre: 'South Indie Cinema' },
    ]
  };

  const sleepPlaylists = [
    '🥱chilling and sleeping ?!?',
    '😴 sleeping in tamil',
    '50% sleepy deepy',
    'kan mooditu thoongu da'
  ];

  const ambientSleepTracks = [
    { track: 'Delta Waves 432Hz Sleep Loop', artist: 'Ambient Slumber', genre: 'Sleep Noise' },
    { track: 'Rain on Tin Roof & Distant Thunder', artist: 'Rainy Day Dreams', genre: 'Nature Sounds' },
    { track: 'Tamil Flute Lullaby 8-Hour Loop', artist: 'Night Meditation Sound', genre: 'Tamil Ambient' },
    { track: 'Deep Theta Ocean Waves', artist: 'Binaural Sleep Lab', genre: 'Binaural Beats' }
  ];

  let idCount = 1;

  // Let's create realistic date distributions across 2020 through 2026
  // Active plays: ~3,200 sampled records
  // Sleep contamination plays: ~2,400 sampled records (simulating the 55k+ volume)

  // 1. Generate Active Plays
  const dateRanges = [
    { era: '2020-2021', startYear: 2020, endYear: 2021, count: 650 },
    { era: '2022-2024', startYear: 2022, endYear: 2024, count: 1100 },
    { era: 'late-2024', startYear: 2024, endYear: 2024, count: 500, startMonth: 7 },
    { era: '2025-2026', startYear: 2025, endYear: 2026, count: 950 }
  ];

  dateRanges.forEach(dr => {
    const pool = (artistsByEra as any)[dr.era];
    for (let i = 0; i < dr.count; i++) {
      const year = dr.startYear + Math.floor(Math.random() * (dr.endYear - dr.startYear + 1));
      const month = dr.startMonth ? dr.startMonth + Math.floor(Math.random() * (12 - dr.startMonth)) : Math.floor(Math.random() * 12);
      const day = 1 + Math.floor(Math.random() * 28);
      
      // Active hours: 9 AM to 11 PM mostly
      const hour = 8 + Math.floor(Math.random() * 15);
      const min = Math.floor(Math.random() * 60);
      const date = new Date(year, month, day, hour, min);

      const song = pool[Math.floor(Math.random() * pool.length)];
      const durationMs = 150000 + Math.floor(Math.random() * 90000); // 2.5 - 4 mins
      const isSkip = Math.random() < 0.05; // 5% accidental skips
      const sourceRoll = Math.random();
      const sourceMode: 'album' | 'playlist' | 'search' | 'radio' = 
        sourceRoll < 0.48 ? 'album' : sourceRoll < 0.82 ? 'playlist' : sourceRoll < 0.94 ? 'search' : 'radio';

      const record: PlayRecord = evaluatePlayRecord({
        id: `active-${idCount++}`,
        trackName: song.track,
        artistName: song.artist,
        albumName: song.album,
        genre: song.genre,
        timestamp: date,
        playDurationMs: isSkip ? Math.floor(Math.random() * 8000) : durationMs,
        mediaDurationMs: durationMs,
        endReason: isSkip ? 'MANUAL_SKIP' : 'NATURAL_END_OF_TRACK',
        containerType: sourceMode === 'album' ? 'ALBUM' : sourceMode === 'playlist' ? 'PLAYLIST' : 'SEARCH',
        containerName: song.album,
        sourceMode,
        coverUrl: song.cover
      }, DEFAULT_CLEANSER_CONFIG);

      records.push(record);
    }
  });

  // 2. Generate Sleep Playlist Contamination (Nighttime: 11:45 PM - 6:30 AM)
  for (let i = 0; i < 2200; i++) {
    const year = 2021 + Math.floor(Math.random() * 6); // 2021-2026
    const month = Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    // Overnight: 23, 0, 1, 2, 3, 4, 5, 6
    const nightHours = [23, 0, 1, 2, 3, 4, 5, 6];
    const hour = nightHours[Math.floor(Math.random() * nightHours.length)];
    const min = Math.floor(Math.random() * 60);
    const date = new Date(year, month, day, hour, min);

    const sleepTrack = ambientSleepTracks[Math.floor(Math.random() * ambientSleepTracks.length)];
    const playlist = sleepPlaylists[Math.floor(Math.random() * sleepPlaylists.length)];
    const durationMs = 180000 + Math.floor(Math.random() * 300000);

    const record: PlayRecord = evaluatePlayRecord({
      id: `sleep-${idCount++}`,
      trackName: sleepTrack.track,
      artistName: sleepTrack.artist,
      albumName: playlist,
      genre: sleepTrack.genre,
      timestamp: date,
      playDurationMs: durationMs,
      mediaDurationMs: durationMs,
      endReason: 'NATURAL_END_OF_TRACK',
      containerType: 'PLAYLIST',
      containerName: playlist,
      coverUrl: undefined
    }, DEFAULT_CLEANSER_CONFIG);

    records.push(record);
  }

  // Sort chronological
  records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return records;
}

export const MOCK_DORMANT_BANGERS: DormantBanger[] = [
  {
    id: 'dormant-sir-john-redcorn',
    trackName: 'John Redcorn',
    artistName: 'SiR',
    albumName: 'Chasing Summer',
    coverUrl: '/covers/SiR - Chasing Summer.jpg',
    peakPeriodLabel: 'Oct 2020',
    peakPlaysInMonth: 44,
    lastPlayedDate: new Date('2021-04-12'),
    daysInHibernation: 914,
    totalHistoricalPlays: 88,
    eraName: 'Midnight Velvet & Drill',
    eraColor: '#7c5295'
  },
  {
    id: 'dormant-frank-nights',
    trackName: 'Nights',
    artistName: 'Frank Ocean',
    albumName: 'Blonde',
    coverUrl: '/covers/Frank Ocean - Blonde.jpg',
    peakPeriodLabel: 'Dec 2020',
    peakPlaysInMonth: 38,
    lastPlayedDate: new Date('2021-06-20'),
    daysInHibernation: 845,
    totalHistoricalPlays: 76,
    eraName: 'Midnight Velvet & Drill',
    eraColor: '#7c5295'
  },
  {
    id: 'dormant-brent-clouded',
    trackName: 'Clouded',
    artistName: 'Brent Faiyaz',
    albumName: 'Fuck The World',
    coverUrl: '/covers/Brent Faiyaz - Fuck The World.jpg',
    peakPeriodLabel: 'Feb 2021',
    peakPlaysInMonth: 35,
    lastPlayedDate: new Date('2021-09-14'),
    daysInHibernation: 760,
    totalHistoricalPlays: 69,
    eraName: 'Midnight Velvet & Drill',
    eraColor: '#7c5295'
  },
  {
    id: 'dormant-govind-ram',
    trackName: 'The Life of Ram',
    artistName: 'Govind Vasantha',
    albumName: '96 (Original Motion Picture Soundtrack)',
    coverUrl: '/covers/96 - Govind Vasantha.jpg',
    peakPeriodLabel: 'Mar 2022',
    peakPlaysInMonth: 48,
    lastPlayedDate: new Date('2022-10-05'),
    daysInHibernation: 610,
    totalHistoricalPlays: 92,
    eraName: 'Tamil Cinema & Folk Awakening',
    eraColor: '#c26d2e'
  },
  {
    id: 'dormant-charan-tagaru',
    trackName: 'Soul of Tagaru',
    artistName: 'Charan Raj',
    albumName: 'Tagaru',
    coverUrl: '/covers/Charan Raj - Tagaru.jpg',
    peakPeriodLabel: 'Jun 2022',
    peakPlaysInMonth: 31,
    lastPlayedDate: new Date('2023-01-18'),
    daysInHibernation: 512,
    totalHistoricalPlays: 58,
    eraName: 'Tamil Cinema & Folk Awakening',
    eraColor: '#c26d2e'
  },
  {
    id: 'dormant-santhosh-kandaa',
    trackName: 'Kandaa Vara Sollunga',
    artistName: 'Santhosh Narayanan',
    albumName: 'Karnan (Original Motion Picture Soundtrack)',
    coverUrl: '/covers/Karnan - Santhosh Narayanan.jpg',
    peakPeriodLabel: 'Jul 2022',
    peakPlaysInMonth: 42,
    lastPlayedDate: new Date('2023-03-22'),
    daysInHibernation: 450,
    totalHistoricalPlays: 84,
    eraName: 'Tamil Cinema & Folk Awakening',
    eraColor: '#c26d2e'
  }
];
