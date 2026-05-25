
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCpMgZ4DkpqfNvCisH-IJjlxP_r6S5LKU",
  authDomain: "fancalmmstz.firebaseapp.com",
  projectId: "fancalmmstz",
  storageBucket: "fancalmmstz.firebasestorage.app",
  messagingSenderId: "671096603122",
  appId: "1:671096603122:web:f1d7de0cda877d7330eb6b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firebaseTools = { collection, addDoc, getDocs, deleteDoc, doc, updateDoc };

// let members = [];
// let tierMembers = [];
// let posts = [];
// let visiblePostCount = 20;
// let autoRefreshTimerId = null;

// const POST_CACHE_KEY = 'calm_posts_cache_v4';
// const POST_CACHE_TIME_KEY = 'calm_posts_cache_time_v4';
// const POST_CACHE_MS = 5 * 60 * 1000;


let members = [];
let tierMembers = [];
let posts = [];
let visiblePostCount = 20;
let autoRefreshTimerId = null;

const LIVE_CACHE_KEY = 'calm_live_cache_v1';
const LIVE_CACHE_TIME_KEY = 'calm_live_cache_time_v1';
const LIVE_CACHE_MS = 60 * 1000;

const TIER_LIVE_CACHE_KEY = 'calm_tier_live_cache_v1';
const TIER_LIVE_CACHE_TIME_KEY = 'calm_tier_live_cache_time_v1';
const TIER_LIVE_CACHE_MS = 60 * 1000;

const POST_CACHE_KEY = 'calm_posts_cache_v2';
const POST_CACHE_TIME_KEY = 'calm_posts_cache_time_v2';
const POST_CACHE_MS = 5 * 60 * 1000;

const SOOP_PROXY_BASE_URL = 'https://fancalmmstz.hyungjoonjoo.workers.dev';
const AUTO_REFRESH_INTERVAL_MS = 60 * 1000;
const maps = ['투혼','폴리포이드','레트로','네메시스','버미어','라데온'];
const raceName = {T:'테란', Z:'저그', P:'프로토스', R:'랜덤', Terran:'테란', Zerg:'저그', Protoss:'프로토스'};
const raceIcon = {T:'T', Z:'Z', P:'P', R:'R', Terran:'T', Zerg:'Z', Protoss:'P'};
let schedules = [
  {date:'2026-05-19', title:'5월 정기 크루 내전', desc:'S~D 티어 밸런스 팀전', comments:[{nick:'시청자1', text:'오늘 엔트리 기대됩니다.'}]},
  {date:'2026-05-24', title:'시청자 참여 스타 대회', desc:'무작위 신청자와 크루 멤버 이벤트전', comments:[{nick:'팬', text:'저도 참가하고 싶어요!'}]}
];
let results = [
  {date:'2026-05-18', a:'캄철벽', b:'몬저그', map:'투혼', winner:'캄철벽'},
  {date:'2026-05-18', a:'스타토스', b:'캄랜덤', map:'폴리포이드', winner:'캄랜덤'},
  {date:'2026-05-17', a:'불꽃테란', b:'뮤탈장인', map:'레트로', winner:'뮤탈장인'},
  {date:'2026-05-17', a:'질럿대장', b:'초보탈출', map:'투혼', winner:'질럿대장'},
  {date:'2026-05-16', a:'캄철벽', b:'스타토스', map:'네메시스', winner:'캄철벽'}
];
const entry = [
  {set:1, a:'캄철벽', b:'뮤탈장인', map:'투혼', result:'대기'},
  {set:2, a:'질럿대장', b:'초보탈출', map:'폴리포이드', result:'대기'},
  {set:3, a:'몬저그', b:'스타토스', map:'레트로', result:'대기'},
  {set:4, a:'캄랜덤', b:'불꽃테란', map:'네메시스', result:'대기'}
];

function pageName(){ return document.body.dataset.page || 'home'; }
function setActiveNav(){
  const page = pageName();
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.page === page));
}
function escapeHtml(value){
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}
function normalizeRace(value){
  const v = String(value || '').trim();
  if(v === '테란') return 'T';
  if(v === '저그') return 'Z';
  if(v === '프로토스') return 'P';
  if(v === '랜덤') return 'R';
  if(v === 'Terran') return 'T';
  if(v === 'Zerg') return 'Z';
  if(v === 'Protoss') return 'P';
  return v;
}
function toggleTheme(){ document.body.classList.toggle('light-mode'); }

// async function fetchLiveData(soopId){
//   // const response = await fetch(`${SOOP_PROXY_BASE_URL}/?type=live&id=${encodeURIComponent(soopId)}&_=${Date.now()}`);
//   fetch(`${SOOP_PROXY_BASE_URL}/?type=live&id=${encodeURIComponent(soopId)}`);
//   if(!response.ok) throw new Error(`LIVE HTTP ${response.status}`);
//   return await response.json();
// }
// async function fetchPostData(soopId){
//   // const response = await fetch(`${SOOP_PROXY_BASE_URL}/?type=posts&id=${encodeURIComponent(soopId)}&_=${Date.now()}`);
//   fetch(`${SOOP_PROXY_BASE_URL}/?type=live&id=${encodeURIComponent(soopId)}`);
//   if(!response.ok) throw new Error(`POST HTTP ${response.status}`);
//   return await response.json();
// }
async function fetchLiveData(soopId){
  const response = await fetch(
    `${SOOP_PROXY_BASE_URL}/?type=live&id=${encodeURIComponent(soopId)}`
  );

  if(!response.ok) throw new Error(`LIVE HTTP ${response.status}`);
  return await response.json();
}

async function fetchPostData(soopId, force = false){
  const response = await fetch(
    `${SOOP_PROXY_BASE_URL}/?type=posts&id=${encodeURIComponent(soopId)}${force ? '&force=1' : ''}`
  );

  if(!response.ok) throw new Error(`POST HTTP ${response.status}`);
  return await response.json();
}


async function loadMembersFromFirebase(){
  const querySnapshot = await getDocs(collection(db, 'members'));
  members = [];
  querySnapshot.forEach(docSnap => members.push({ id: docSnap.id, ...docSnap.data() }));
  members.sort((a,b) => Number(a.order || 999) - Number(b.order || 999));
  setupSelects();
}

async function loadTierExcel(){
  if(!window.XLSX){ console.error('XLSX 라이브러리가 로드되지 않았습니다.'); return; }
  const response = await fetch('./tier.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type:'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  tierMembers = rows.map((row, index) => ({
    order: Number(row['순번'] || index + 1),
    name: String(row['이름'] || ''),
    crew: String(row['소속'] || ''),
    race: normalizeRace(row['종족'] || ''),
    tier: String(row['티어'] || ''),
    soopId: String(row['방송국ID'] || '').trim(),
    sourceDate: String(row['날짜'] || ''),
    station: `https://ch.sooplive.co.kr/${String(row['방송국ID'] || '').trim()}`,
    live: false
  })).filter(m => m.name).sort((a,b) => a.order - b.order);
  setupSelects();
renderTierCards();
await loadTierLiveWithCache();
}

function setupSelects(){
  const tierFilter = document.getElementById('tierFilter');

  if(tierFilter){
    const tierOrder = [
      'God',
      'King',
      'Jack',
      'Joker',
      'Spade',
      '0티어',
      '1티어',
      '2티어',
      '3티어',
      '4티어',
      '5티어',
      '6티어',
      '7티어',
      '8티어',
      '9티어',
      'Baby'
    ];

    const tiers = [...new Set(
      tierMembers.map(m => m.tier).filter(Boolean)
    )].sort((a,b)=>{
      const ai = tierOrder.indexOf(String(a));
      const bi = tierOrder.indexOf(String(b));

      if(ai === -1 && bi === -1) return String(a).localeCompare(String(b),'ko',{numeric:true});
      if(ai === -1) return 1;
      if(bi === -1) return -1;

      return ai - bi;
    });

    tierFilter.innerHTML =
      '<option value="all">전체 티어</option>' +
      tiers.map(t => `
        <option value="${escapeHtml(t)}">${escapeHtml(t)}</option>
      `).join('');
  }

  ['playerA','playerB','matchA','matchB'].forEach(id => {
    const el = document.getElementById(id);
    if(el){
      el.innerHTML = members
        .map(m => `<option value="${escapeHtml(m.name)}">${escapeHtml(m.name)}</option>`)
        .join('');
    }
  });

  const playerB = document.getElementById('playerB');
  if(playerB && playerB.options.length > 1) playerB.selectedIndex = 1;

  const matchB = document.getElementById('matchB');
  if(matchB && matchB.options.length > 1) matchB.selectedIndex = 1;

  ['mapFilter','matchMap'].forEach(id => {
    const el = document.getElementById(id);
    if(el){
      el.innerHTML =
        (id === 'mapFilter' ? '<option value="all">전체 맵</option>' : '') +
        maps.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
    }
  });
}

function loadPostsFromCache(){
  try{
    const cached = localStorage.getItem(POST_CACHE_KEY);
    if(!cached) return false;

    posts = JSON.parse(cached);
    visiblePostCount = 20;
    renderPosts();
    return true;
  }catch(error){
    console.warn('게시글 캐시 불러오기 실패', error);
    return false;
  }
}

function savePostsToCache(){
  try{
    localStorage.setItem(POST_CACHE_KEY, JSON.stringify(posts));
    localStorage.setItem(POST_CACHE_TIME_KEY, String(Date.now()));
  }catch(error){
    console.warn('게시글 캐시 저장 실패', error);
  }
}

function isPostCacheExpired(){
  const savedAt = Number(localStorage.getItem(POST_CACHE_TIME_KEY) || 0);
  return !savedAt || Date.now() - savedAt > POST_CACHE_MS;
}

async function loadPostsWithCache(){
  const hasCache = loadPostsFromCache();

  if(!hasCache || isPostCacheExpired()){
    await refreshPostsFromSoop();
  }
}
function isCacheExpired(timeKey, maxAge){
  const savedAt = Number(localStorage.getItem(timeKey) || 0);
  return !savedAt || Date.now() - savedAt > maxAge;
}

function saveLiveCache(key, timeKey, list){
  localStorage.setItem(key, JSON.stringify(list));
  localStorage.setItem(timeKey, String(Date.now()));
}

function applyLiveCache(key, targetList){
  try{
    const cached = JSON.parse(localStorage.getItem(key) || '[]');
    if(!cached.length) return false;

    cached.forEach(cachedMember => {
      const target = targetList.find(m => m.soopId === cachedMember.soopId);
      if(target){
        Object.assign(target, cachedMember);
      }
    });

    return true;
  }catch(error){
    console.warn('라이브 캐시 불러오기 실패', error);
    return false;
  }
}

async function loadLiveWithCache(){
  const hasCache = applyLiveCache(LIVE_CACHE_KEY, members);

  if(hasCache && !isCacheExpired(LIVE_CACHE_TIME_KEY, LIVE_CACHE_MS)){
    renderHome();
    renderMembers?.();
    return;
  }

  await refreshLiveStatus();

  saveLiveCache(
    LIVE_CACHE_KEY,
    LIVE_CACHE_TIME_KEY,
    members.map(m => ({
      soopId:m.soopId,
      live:m.live,
      liveUrl:m.liveUrl,
      liveTitle:m.liveTitle,
      liveThumbnail:m.liveThumbnail,
      viewerCount:m.viewerCount,
      profileImage:m.profileImage
    }))
  );
}

async function loadTierLiveWithCache(){
  const hasCache = applyLiveCache(TIER_LIVE_CACHE_KEY, tierMembers);

  if(hasCache && !isCacheExpired(TIER_LIVE_CACHE_TIME_KEY, TIER_LIVE_CACHE_MS)){
    renderTierCards();
    return;
  }

  await refreshTierLiveStatus();

  saveLiveCache(
    TIER_LIVE_CACHE_KEY,
    TIER_LIVE_CACHE_TIME_KEY,
    tierMembers.map(m => ({
      soopId:m.soopId,
      live:m.live,
      liveUrl:m.liveUrl,
      liveTitle:m.liveTitle,
      liveThumbnail:m.liveThumbnail,
      viewerCount:m.viewerCount,
      profileImage:m.profileImage
    }))
  );
}



function renderHome(){
  const live = members.filter(m => m.live === true);
  const liveCountEl = document.getElementById('liveCount');
  if(liveCountEl) liveCountEl.textContent = `${live.length}명 라이브 중`;
  const liveListEl = document.getElementById('liveList');
  if(liveListEl){
    liveListEl.innerHTML = live.map(m => `
      <a href="${escapeHtml(m.liveUrl || m.station || '#')}" target="_blank" class="live-card">
        <img src="${escapeHtml(m.liveThumbnail || m.profileImage || '')}" class="live-thumb">
        <div class="live-body">
          <div class="live-badge">🔴 LIVE</div>
          <div class="live-profile">
            <img src="${escapeHtml(m.profileImage || m.liveThumbnail || '')}">
            <div><div class="live-name">${escapeHtml(m.name)}</div><div class="live-viewer">👥 ${Number(m.viewerCount || 0).toLocaleString()}명 시청 중</div></div>
          </div>
          <div class="live-title">${escapeHtml(m.liveTitle || 'LIVE 방송 중')}</div>
        </div>
      </a>`).join('') || `<p class="meta">현재 방송 중인 멤버가 없습니다.</p>`;
  }
  renderPosts();
}

function renderMembers(){
  const el = document.getElementById('memberList');
  if(!el) return;
  el.innerHTML = members.map(m => {
    const profile = m.profileImage || m.liveThumbnail || '';
    const stationUrl = m.station || `https://ch.sooplive.co.kr/${m.soopId}`;
    return `<div class="crew-card">
      <span class="badge crew-live ${m.live ? 'is-on' : 'is-off'}">${m.live ? '● LIVE' : 'OFF'}</span>
      <img class="crew-profile" src="${escapeHtml(profile)}" onerror="this.style.display='none'">
      <div class="crew-name">${escapeHtml(m.name || '')}</div>
      <div class="crew-race race-${escapeHtml(normalizeRace(m.race || ''))}">${escapeHtml(raceName[normalizeRace(m.race)] || m.race || '')}</div>
      <a class="crew-station" href="${escapeHtml(stationUrl)}" target="_blank">방송국 바로가기</a>
    </div>`;
  }).join('');
}

function renderTierCards(){
  const el = document.getElementById('tierCards');
  if(!el) return;
  const q = document.getElementById('searchInput')?.value.trim() || '';
  const tier = document.getElementById('tierFilter')?.value || 'all';
  const race = document.getElementById('raceFilter')?.value || 'all';
  const live = document.getElementById('liveFilter')?.value || 'all';
  const filtered = tierMembers.filter(m => (!q || m.name.includes(q)) && (tier === 'all' || m.tier === tier) && (race === 'all' || m.race === race) && (live === 'all' || m.live));
  const tierOrder = ['God','King','Jack','Joker','Spade','0티어','1티어','2티어','3티어','4티어','5티어','6티어','7티어','8티어','Baby','미분류'];
  const grouped = {};
  filtered.forEach(m => { const key = m.tier || '미분류'; if(!grouped[key]) grouped[key] = []; grouped[key].push(m); });
  const keys = [...tierOrder.filter(t => grouped[t]?.length), ...Object.keys(grouped).filter(t => !tierOrder.includes(t))];
  el.innerHTML = keys.map(t => `
    <section class="tier-section">
      <div class="tier-header"><span class="tier-label">${escapeHtml(t)}</span><span class="tier-count">${grouped[t].length}명 · 라이브 ${grouped[t].filter(m => m.live).length}</span></div>
      <div class="tier-card-grid">
        ${grouped[t].map(m => {
          const img = m.live ? m.liveThumbnail : m.profileImage;
          const url = m.live ? m.liveUrl : m.station;
          return `<a class="tier-player-card race-card-${escapeHtml(m.race)} ${m.live ? 'is-live' : ''}" href="${escapeHtml(url || '#')}" target="_blank">
            <div class="tier-thumb-wrap ${m.live ? 'wide' : ''}"><img src="${escapeHtml(img || '')}" onerror="this.style.display='none'">${m.live ? `<span class="tier-live-badge">LIVE</span>` : ''}</div>
            <div class="tier-player-name">${escapeHtml(m.name)}</div>
            <div class="tier-player-meta"><span class="race-${escapeHtml(m.race)}">${escapeHtml(m.race)}</span><span>${escapeHtml(m.crew || '')}</span></div>
          </a>`;
        }).join('')}
      </div>
    </section>`).join('') || '<p class="meta">검색 결과가 없습니다.</p>';
}

async function refreshLiveStatus(){
  const button = document.querySelector('button[onclick="refreshLiveStatus()"]');

  if(button){
    button.textContent = '확인 중...';
    button.disabled = true;
  }

  const jobs = members
    .filter(m => m.soopId)
    .map(async m => {
      try{
        const liveData = await fetchLiveData(m.soopId.trim());

        m.live = liveData.live === true;
        m.liveUrl = m.live ? liveData.liveUrl : '';
        m.liveTitle = m.live ? liveData.liveTitle : '';
        m.liveThumbnail = m.live ? liveData.liveThumbnail : '';
        m.viewerCount = m.live ? Number(liveData.viewerCount || 0) : 0;
        m.profileImage = liveData.profileImage || m.profileImage || '';
      }catch(error){
        console.error(`${m.name} 라이브 확인 실패`, error);
        m.live = false;
      }
    });

  await Promise.all(jobs);

    saveLiveCache(
    LIVE_CACHE_KEY,
    LIVE_CACHE_TIME_KEY,
    members.map(m => ({
      soopId:m.soopId,
      live:m.live,
      liveUrl:m.liveUrl,
      liveTitle:m.liveTitle,
      liveThumbnail:m.liveThumbnail,
      viewerCount:m.viewerCount,
      profileImage:m.profileImage
    }))
  );

  renderHome();
  renderMembers?.();

  if(button){
    button.textContent = '라이브 새로고침';
    button.disabled = false;
  }
}

async function refreshTierLiveStatus(){
  const jobs = tierMembers
    .filter(m => m.soopId)
    .map(async m => {
      try{
        const liveData = await fetchLiveData(m.soopId.trim());

        m.live = liveData.live === true;
        m.liveUrl = m.live ? liveData.liveUrl : '';
        m.liveTitle = m.live ? liveData.liveTitle : '';
        m.liveThumbnail = m.live ? liveData.liveThumbnail : '';
        m.viewerCount = m.live ? Number(liveData.viewerCount || 0) : 0;
        m.profileImage = liveData.profileImage || m.profileImage || '';
      }catch(error){
        console.error(`${m.name} 티어 라이브 확인 실패`, error);
        m.live = false;
      }
    });

  await Promise.all(jobs);

  renderTierCards?.();
}

function normalizeSoopPost(channel, post){
  const userId = String(
    post?.userId ??
    post?.user_id ??
    post?.writerId ??
    post?.writer_id ??
    post?.bjId ??
    post?.bj_id ??
    post?.station_user_id ??
    post?.stationUserId ??
    ''
  ).trim().toLowerCase();

  const titleNo = String(
    post?.titleNo ??
    post?.title_no ??
    post?.postNo ??
    post?.post_no ??
    post?.bbsNo ??
    post?.bbs_no ??
    post?.boardNo ??
    post?.board_no ??
    post?.no ??
    ''
  );

  const title = String(
    post?.titleName ??
    post?.title_name ??
    post?.title ??
    post?.subject ??
    post?.board_title ??
    ''
  );

  const rawContent =
    post?.content ??
    post?.contents ??
    post?.description ??
    post?.text ??
    '';

  const content = String(
    typeof rawContent === 'string'
      ? rawContent
      : (rawContent?.text_content ?? rawContent?.summary ?? '')
  )
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const regDate = String(
    post?.regDate ??
    post?.reg_date ??
    post?.createdAt ??
    post?.created_at ??
    post?.writeDate ??
    post?.write_date ??
    post?.wdate ??
    post?.date ??
    post?.reg_datetime ??
    post?.regDt ??
    ''
  );

  const userName = String(
    post?.userNick ??
    post?.user_nick ??
    post?.writerNick ??
    post?.writer_nick ??
    post?.nick ??
    post?.nickname ??
    channel.name ??
    channel.soopId ??
    ''
  );

  return {
    id: `${channel.soopId}-${titleNo || title}`,
    userId,
    title,
    content,
    date: regDate ? regDate.slice(0, 10) : '',
    time: regDate,
    name: userName,
    profileImage: channel.profileImage || channel.liveThumbnail || '',
    url: post?.url || (titleNo ? `https://www.sooplive.com/station/${channel.soopId}/post/${titleNo}` : channel.station)
  };
}
function sortPostsByRecent(list){ return list.sort((a,b) => (Date.parse(String(b.time || b.date || '').replace(' ', 'T')) || 0) - (Date.parse(String(a.time || a.date || '').replace(' ', 'T')) || 0)); }

async function refreshPostsFromSoop(force = false){
  const jobs = members
    .filter(m => m.soopId)
    .map(async m => {
      try{
        const data = await fetchPostData(m.soopId.trim(), force);

        const rawPosts =
          Array.isArray(data?.posts) ? data.posts :
          Array.isArray(data?.data) ? data.data :
          Array.isArray(data?.items) ? data.items :
          Array.isArray(data?.list) ? data.list :
          Array.isArray(data?.result) ? data.result :
          Array.isArray(data?.data?.data) ? data.data.data :
          Array.isArray(data?.data?.items) ? data.data.items :
          [];

        return rawPosts
          .map(post => normalizeSoopPost(m, post))
.filter(post => {
  return post.title?.trim()?.length > 0;
});

      }catch(error){
        console.error(`${m.name} 게시글 확인 실패`, error);
        return [];
      }
    });

  const results = await Promise.all(jobs);
  const collected = results.flat();

  const unique = new Map();

  sortPostsByRecent(collected).forEach(post => {
    if(post.title && !unique.has(post.id)){
      unique.set(post.id, post);
    }
  });

posts = [...unique.values()];
visiblePostCount = 20;

savePostsToCache();
renderPosts();
}
function renderPosts(){
  const postListEl = document.getElementById('postList'); if(!postListEl) return;
  const sortedPosts = [...posts].sort((a,b) => (Date.parse(String(b.time || b.date || b.createdAt || '').replace(' ', 'T')) || 0) - (Date.parse(String(a.time || a.date || a.createdAt || '').replace(' ', 'T')) || 0));
  const visiblePosts = sortedPosts.slice(0, visiblePostCount);
  postListEl.innerHTML = visiblePosts.map(p => `<a class="post-item" href="${escapeHtml(p.url || '#')}" target="_blank"><div class="post-head"><img class="post-avatar" src="${escapeHtml(p.profileImage || '')}" onerror="this.style.display='none'"><div class="post-title-area"><div class="name">${escapeHtml(p.title || '제목 없음')}</div><div class="meta">${escapeHtml(p.name || p.author || '')} · ${escapeHtml(p.date || p.createdAt || '')}</div></div></div><div class="post-preview">${escapeHtml(p.content || p.description || '')}</div></a>`).join('') || `<p class="meta">게시글을 불러올 수 없습니다...<br>새로고침 해 보세요...</p>`;
  const moreBtn = document.getElementById('loadMorePostsButton'); if(moreBtn) moreBtn.style.display = sortedPosts.length > visiblePostCount ? 'block' : 'none';
}
function loadMorePosts(){ visiblePostCount += 20; renderPosts(); }

function renderSchedule(){
  const el = document.getElementById('scheduleList'); if(!el) return;
  el.innerHTML = schedules.map((s,idx) => `<div class="schedule-item" style="align-items:flex-start"><div style="width:100%"><div class="name">${escapeHtml(s.date)} · ${escapeHtml(s.title)}</div><div class="meta">${escapeHtml(s.desc)}</div><div class="comment-box">${s.comments.map(c => `<div class="comment"><b>${escapeHtml(c.nick)}</b><p>${escapeHtml(c.text)}</p></div>`).join('')}<div class="form" style="margin-top:0"><input id="nick-${idx}" placeholder="닉네임" class="wide" /><input id="comment-${idx}" placeholder="댓글을 입력하세요" class="wide" /><button class="ghost full" onclick="addComment(${idx})">댓글 등록</button></div></div></div></div>`).join('');
}
function addSchedule(){
  const date = document.getElementById('scheduleDate')?.value;
  const title = document.getElementById('scheduleTitle')?.value.trim();
  const desc = document.getElementById('scheduleDesc')?.value.trim();
  if(!date || !title){ alert('날짜와 제목을 입력하세요.'); return; }
  schedules.push({date,title,desc,comments:[]});
  document.getElementById('scheduleTitle').value = ''; document.getElementById('scheduleDesc').value = ''; renderSchedule();
}
function addComment(idx){
  const nick = document.getElementById(`nick-${idx}`).value.trim() || '익명';
  const text = document.getElementById(`comment-${idx}`).value.trim();
  if(!text){ alert('댓글 내용을 입력하세요.'); return; }
  schedules[idx].comments.push({nick,text}); renderSchedule();
}

function recentForm(name){
  const recent = results.filter(r => r.a === name || r.b === name).slice(0,5);
  if(!recent.length) return '-';
  const wins = recent.filter(r => r.winner === name).length;
  return `${wins}승 ${recent.length-wins}패`;
}
function tierScore(name){
  const m = members.find(x => x.name === name) || {tier:'C', win:50};
  const tier = {S:90,A:78,B:65,C:52,D:40}[m.tier] || 50;
  return tier + ((Number(m.win) || 50) - 50) * .7;
}
function predict(a,b){
  const sa = tierScore(a), sb = tierScore(b);
  const pa = Math.round(100 / (1 + Math.pow(10, (sb-sa)/25)));
  return Math.max(15, Math.min(85, pa));
}
function renderHeadToHead(){
  const summary = document.getElementById('headToHeadSummary'); const rowsEl = document.getElementById('headToHeadRows'); if(!summary || !rowsEl) return;
  const a = document.getElementById('playerA')?.value || ''; const b = document.getElementById('playerB')?.value || ''; const map = document.getElementById('mapFilter')?.value || 'all';
  const rows = results.filter(r => ((r.a === a && r.b === b) || (r.a === b && r.b === a)) && (map === 'all' || r.map === map));
  const aWins = rows.filter(r => r.winner === a).length; const bWins = rows.filter(r => r.winner === b).length; const total = rows.length;
  summary.innerHTML = `<div class="versus"><div>${escapeHtml(a)}<br><span class="meta">${aWins}승</span></div><div class="vs">VS</div><div>${escapeHtml(b)}<br><span class="meta">${bWins}승</span></div></div><div class="prediction-bar"><div class="prediction-fill" style="width:${total ? (aWins/total*100) : 50}%"></div></div><div class="prediction-label"><span>${total ? Math.round(aWins/total*100) : 50}%</span><span>총 ${total}경기</span><span>${total ? Math.round(bWins/total*100) : 50}%</span></div>`;
  rowsEl.innerHTML = rows.map(r => `<tr><td>${escapeHtml(r.date)}</td><td>${escapeHtml(r.map)}</td><td>${escapeHtml(r.a)}</td><td>${escapeHtml(r.b)}</td><td><b>${escapeHtml(r.winner)}</b></td></tr>`).join('') || '<tr><td colspan="5">상대전적이 없습니다.</td></tr>';
}
function renderEntries(){
  const rowsEl = document.getElementById('entryRows'); if(!rowsEl) return;
  rowsEl.innerHTML = entry.map(e => { const p = predict(e.a,e.b); return `<tr><td>${e.set}세트</td><td>${escapeHtml(e.a)}</td><td>${escapeHtml(e.b)}</td><td>${escapeHtml(e.map)}</td><td>${escapeHtml(e.a)} ${p}% : ${100-p}% ${escapeHtml(e.b)}</td><td>${escapeHtml(e.result)}</td></tr>`; }).join('');
  renderPredictionBox();
}
function renderPredictionBox(){
  const box = document.getElementById('predictionBox'); if(!box) return;
  const a = document.getElementById('matchA')?.value || members[0]?.name || '';
  const b = document.getElementById('matchB')?.value || members[1]?.name || '';
  const p = predict(a,b);
  box.innerHTML = `<div class="versus"><div>${escapeHtml(a)}</div><div class="vs">VS</div><div>${escapeHtml(b)}</div></div><div class="prediction-bar"><div class="prediction-fill" style="width:${p}%"></div></div><div class="prediction-label"><span>${escapeHtml(a)} ${p}%</span><span>${escapeHtml(b)} ${100-p}%</span></div><p class="meta">현재는 티어와 기본 승률만 반영한 데모입니다.</p>`;
}
function addMatchResult(){
  const a = document.getElementById('matchA').value; const b = document.getElementById('matchB').value; const map = document.getElementById('matchMap').value; const winnerSide = document.getElementById('matchWinner').value;
  if(a === b){ alert('서로 다른 선수를 선택하세요.'); return; }
  const winner = winnerSide === 'A' ? a : b;
  results.unshift({date:new Date().toISOString().slice(0,10), a,b,map,winner}); alert('경기 결과가 추가되었습니다.'); renderHeadToHead(); renderEntries();
}

async function saveMemberToFirebase(){
  const name = document.getElementById('adminName').value.trim();
  const soopId = document.getElementById('adminSoopId').value.trim();
  const race = document.getElementById('adminRace').value;
  const intro = document.getElementById('adminIntro').value.trim();
  const order = Number(document.getElementById('adminOrder').value || 999);
  if(!name || !soopId){ alert('닉네임과 SOOP ID는 필수입니다.'); return; }
  await addDoc(collection(db, 'members'), { name, soopId, order, race, intro, live:false, station:`https://ch.sooplive.co.kr/${soopId}`, createdAt:new Date().toISOString() });
  alert('멤버가 저장되었습니다.'); await loadMembersFromFirebase(); loadAdminMembers();
}
async function loadAdminMembers(){
  const el = document.getElementById('adminMemberList'); if(!el) return;
  const querySnapshot = await getDocs(collection(db, 'members'));
  const list = []; querySnapshot.forEach(docSnap => list.push({id:docSnap.id, ...docSnap.data()}));
  el.innerHTML = list.sort((a,b)=>Number(a.order||999)-Number(b.order||999)).map(m => `<div class="member-card"><div class="top"><div><div class="name">${Number(m.order || 999)}. ${escapeHtml(m.name)}</div><div class="meta">SOOP ID: ${escapeHtml(m.soopId || '')}</div><div class="meta">종족: ${escapeHtml(raceName[normalizeRace(m.race)] || m.race || '')}</div></div></div><p class="meta" style="line-height:1.6;margin-top:12px;">${escapeHtml(m.intro || '소개 없음')}</p><button class="ghost" style="margin-top:12px;width:100%;" onclick="editMemberFromFirebase('${m.id}')">수정</button><button class="ghost" style="margin-top:8px;width:100%;" onclick="deleteMemberFromFirebase('${m.id}')">삭제</button></div>`).join('');
}
async function deleteMemberFromFirebase(id){
  if(!confirm('이 멤버를 삭제할까요?')) return;
  await deleteDoc(doc(db, 'members', id)); alert('삭제되었습니다.'); await loadMembersFromFirebase(); loadAdminMembers();
}
async function editMemberFromFirebase(id){
  const target = members.find(m => m.id === id);
  if(!target){ alert('멤버 정보를 찾을 수 없습니다.'); return; }
  const name = prompt('멤버 닉네임', target.name || ''); if(name === null) return;
  const soopId = prompt('SOOP 방송국 ID', target.soopId || ''); if(soopId === null) return;
  const order = Number(prompt('정렬 번호', target.order || 999) || 999);
  const intro = prompt('멤버 소개', target.intro || ''); if(intro === null) return;
  await updateDoc(doc(db, 'members', id), { name:name.trim(), soopId:soopId.trim(), order, intro:intro.trim(), station:`https://ch.sooplive.co.kr/${soopId.trim()}` });
  alert('수정되었습니다.'); await loadMembersFromFirebase(); loadAdminMembers();
}

function startAutoRefresh(){
  if(autoRefreshTimerId) clearInterval(autoRefreshTimerId);

  autoRefreshTimerId = setInterval(async () => {
    const page = pageName();

    if(page === 'home'){
      await loadLiveWithCache();
    }

    if(page === 'members'){
      await loadLiveWithCache();
    }

    if(page === 'tiers'){
      await loadTierLiveWithCache();
    }

  }, AUTO_REFRESH_INTERVAL_MS);
}

// async function init(){
//   setActiveNav();
//   const page = pageName();
//   try{
//     if(['home','members','records','matches','admin'].includes(page)) await loadMembersFromFirebase();
//     // if(page === 'home'){ await refreshLiveStatus(); await refreshPostsFromSoop(); }
//     if(page === 'home'){
//   await refreshLiveStatus();
// }
//     if(page === 'members') await refreshLiveStatus();
//     if(page === 'tiers') await loadTierExcel();
//     if(page === 'records') renderHeadToHead();
//     if(page === 'schedule') renderSchedule();
//     if(page === 'matches') renderEntries();
//     if(page === 'admin') loadAdminMembers();
//     // startAutoRefresh();
//   }catch(error){
//     console.error('초기화 실패', error);
//   }
// }

async function init(){
  setActiveNav();

  const page = pageName();

  try{

    if(['home','members','records','matches','admin'].includes(page)){
      await loadMembersFromFirebase();
    }

    // if(page === 'home'){
    //   await refreshLiveStatus();
    //   await loadPostsWithCache();
    // }

if(page === 'home'){
  await loadLiveWithCache();
  await loadPostsWithCache();
}

if(page === 'members'){
  await loadLiveWithCache();
}

    if(page === 'tiers'){
      await loadTierExcel();
    }

    if(page === 'records'){
      renderHeadToHead();
    }

    if(page === 'schedule'){
      renderSchedule();
    }

    if(page === 'matches'){
      renderEntries();
    }

    if(page === 'admin'){
      loadAdminMembers();
    }

    // startAutoRefresh();

  }catch(error){
    console.error('초기화 실패', error);
  }
}

document.addEventListener('change', e => { if(['matchA','matchB','matchMap'].includes(e.target.id)) renderPredictionBox(); });
window.addEventListener('load', init);

Object.assign(window, { toggleTheme, renderTierCards, refreshLiveStatus, refreshPostsFromSoop, loadMorePosts, addSchedule, addComment, renderHeadToHead, addMatchResult, saveMemberToFirebase, loadAdminMembers, deleteMemberFromFirebase, editMemberFromFirebase });



const scrollTopBtn = document.getElementById("scrollTopBtn");

if(scrollTopBtn){

  // 클릭 시 맨 위로
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // 스크롤 시 표시/숨김
  window.addEventListener("scroll", () => {

    if(window.scrollY > 100){
      scrollTopBtn.style.display = "grid";
    }else{
      scrollTopBtn.style.display = "none";
    }

  });

  // 초기 숨김
  scrollTopBtn.style.display = "none";
}
