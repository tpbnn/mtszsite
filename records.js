import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

let allMatches = [];
let currentMatches = [];
let visibleCount = 20;
let playerNames = [];
let membersData = [];
let mapFilter = "all";
let mapExpanded = false;


window.searchPlayer = searchPlayer;

async function loadMembers(){

  const response = await fetch("tier.xlsx");
  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, {
    type: "array"
  });

  const sheet =
    workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: ""
  });

  membersData = rows.map((row, index) => {
    const name =
      row.name ||
      row.Name ||
      row.이름 ||
      row.선수명 ||
      row.playerName ||
      row["선수 이름"] ||
      "";

    const race =
      row.race ||
      row.Race ||
      row.종족 ||
      "";

    const tier =
      row.tier ||
      row.Tier ||
      row.티어 ||
      "";

    const crew =
      row.crew ||
      row.Crew ||
      row.소속 ||
      row.팀 ||
      "";

      const soopId =
  row.soopId ||
  row.SOOPID ||
  row.soopid ||
  row.stationId ||
  row.방송국ID ||
  row.방송국아이디 ||
  row.아이디 ||
  "";

    return {
  id: safeLocalId(name || `player-${index}`),
  name: String(name).trim(),
  race: String(race).trim(),
  tier: String(tier).trim(),
  crew: String(crew).trim(),
  soopId: String(soopId).trim(),

  profileImage: soopId
    ? `https://profile.img.sooplive.co.kr/LOGO/${String(soopId).slice(0,2)}/${soopId}/${soopId}.jpg`
    : ""
};
  }).filter(m => m.name);

  playerNames = [
    ...new Set(
      membersData
        .map(m => m.name)
        .filter(Boolean)
    )
  ].sort((a,b)=>a.localeCompare(b,'ko'));

  console.log("tier.xlsx 선수 로딩 완료:", membersData.length);
}

async function searchPlayer(){

  setRecordLoading(true);

  const keyword =
    document.getElementById("playerSearchInput")
      .value
      .trim();

  if(!keyword){
    alert("선수 이름을 입력해줘.");
    return;
  }

  const memberInfo = membersData.find(m => {

    const a =
      String(m.name || "")
        .replaceAll("_","")
        .toLowerCase();

    const b =
      keyword
        .replaceAll("_","")
        .toLowerCase();

    return a.includes(b);
  });

if(!memberInfo){

  setRecordLoading(false);

  alert("선수를 찾을 수 없습니다.");

  return;
}

 

  const url =
  `https://mstz-elo-sync.hyungjoonjoo.workers.dev/proxy-records?name=${encodeURIComponent(memberInfo.name)}&secret=calm2026sync`;

  const res = await fetch(url);

  const data = await res.json();

 if(!data.ok){

  console.error(data);

  setRecordLoading(false);

  alert("전적 조회 실패");

  return;
}

  currentMatches = (data.matches || [])
    .sort((a,b)=>
      String(b.date)
        .localeCompare(String(a.date))
    );

  visibleCount = 20;

  renderPlayerInfo(memberInfo.name);

  renderStats();

  
  renderMapStats();

renderMatches();

setRecordLoading(false);

console.log(
  "불러온 경기수:",
  currentMatches.length
);
}


function renderPlayerInfo(name){
  const sample = currentMatches[0];

  const memberInfo = membersData.find(
    m => String(m.name || "").trim() === String(name).trim()
  );

  const stat30 = calculateStatsByDate(30, new Date()).total;
  const recent10 = currentMatches.slice(0, 10);

  document.getElementById("playerInfo").innerHTML = `
    <div class="player-card enhanced-player-card">
      <div class="player-avatar">
  ${
    memberInfo?.profileImage
      ? `<img src="${escapeHtml(memberInfo.profileImage)}" alt="${escapeHtml(name)}">`
      : escapeHtml(name).slice(0,1)
  }
</div>

      <div class="player-info-main">
        <div class="player-name">${escapeHtml(name)}</div>

        <div class="player-badges">
          ${memberInfo?.crew ? `<span>${escapeHtml(memberInfo.crew)}</span>` : ""}
          <span class="race-badge race-${escapeHtml(memberInfo?.race || "")}">
            ${raceLabel(memberInfo?.race)}
          </span>
          ${memberInfo?.tier ? `<span class="tier-badge">${escapeHtml(memberInfo.tier)}</span>` : ""}
        </div>

        <div class="player-summary">
          최근 30일 · ${stat30.wins}승 ${stat30.losses}패 · ${stat30.rate}%
        </div>

        <div class="recent-form">
          ${recent10.map(m => `
            <span class="${isWin(m.result) ? "form-win" : "form-lose"}">
              ${isWin(m.result) ? "승" : "패"}
            </span>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function raceLabel(race){
  const r = normalizeRace(race);
  if(r === "T") return "테란";
  if(r === "Z") return "저그";
  if(r === "P") return "프로토스";
  return race || "-";
}

function renderStats(){
  const now = new Date();

  const stat30 = calculateStatsByDate(30, now);
  const stat90 = calculateStatsByDate(90, now);
  const statAll = calculateStats(currentMatches);

  document.getElementById("statsArea").innerHTML = `
    ${renderStatCard("최근 30일", stat30)}
    ${renderStatCard("최근 90일", stat90)}
    ${renderStatCard("전체 통계", statAll)}
  `;
}

function calculateStatsByDate(days, now){
  const start = new Date(now);
  start.setDate(start.getDate() - days);

  const filtered = currentMatches.filter(m => {
    const d = parseDate(m.playedAt || m.date);
    return d && d >= start;
  });

  return calculateStats(filtered);
}

function calculateStats(matches){
  return {
    total: calcRecord(matches),
    P: calcRecord(matches.filter(m => normalizeRace(m.opponentRace) === "P")),
    Z: calcRecord(matches.filter(m => normalizeRace(m.opponentRace) === "Z")),
    T: calcRecord(matches.filter(m => normalizeRace(m.opponentRace) === "T"))
  };
}

function calcRecord(matches){
  const wins = matches.filter(m => isWin(m.result)).length;
  const losses = matches.filter(m => isLoss(m.result)).length;
  const total = wins + losses;
  const rate = total ? ((wins / total) * 100).toFixed(1) : "0.0";

  return { wins, losses, rate };
}

function renderStatCard(title, stat){
  return `
    <div class="stats-card">
      <div class="stats-title">${title}</div>
      ${renderStatRow("전체", stat.total)}
      ${renderStatRow("vs 프로토스", stat.P)}
      ${renderStatRow("vs 저그", stat.Z)}
      ${renderStatRow("vs 테란", stat.T)}
    </div>
  `;
}

function renderStatRow(label, data){
  return `
    <div class="stats-row">
      <span>${label}</span>
      <strong>${data.wins}승 ${data.losses}패 · ${data.rate}%</strong>
    </div>
  `;
}

function renderMatches(){

  const list =
    currentMatches.slice(0, visibleCount);

  document.getElementById("matchList").innerHTML = `
    ${list.map(m => {

      const opponentName =
        m.opponent || m.opponentName || "-";

      const opponentInfo = membersData.find(x =>
        String(x.name || "").trim()
          === String(opponentName).trim()
      );

      return `
        <div class="match-item">

          <div class="match-date">
            ${escapeHtml(m.playedAt || m.date || "-")}
          </div>

          <div class="match-result ${isWin(m.result) ? "win" : "lose"}">
            ${isWin(m.result) ? "승" : "패"}
          </div>

          <div class="match-name">
  <strong>${escapeHtml(opponentName)}</strong>
</div>

<div class="match-badges">
  ${opponentInfo?.crew ? `<span>${escapeHtml(opponentInfo.crew)}</span>` : ""}
  ${opponentInfo?.race ? `<span>${raceLabel(opponentInfo.race)}</span>` : ""}
  ${opponentInfo?.tier ? `<span>${escapeHtml(opponentInfo.tier)}</span>` : ""}
</div>

          <div class="match-map">
            ${escapeHtml(m.map || "-")}
          </div>

        </div>
      `;
    }).join("")}

    ${currentMatches.length > visibleCount ? `
      <button
        class="load-more-button"
        onclick="loadMoreMatches()"
      >
        다음 20개 더 보기
      </button>
    ` : ""}
  `;
}
window.loadMoreMatches = function(){
  visibleCount += 20;
  renderMatches();
};

function isWin(result){
  return ["WIN", "W", "승"].includes(String(result).toUpperCase());
}

function isLoss(result){
  return ["LOSE", "LOSS", "L", "패"].includes(String(result).toUpperCase());
}

function normalizeRace(race){
  const r = String(race || "").toUpperCase();

  if(r === "P" || r === "PROTOSS" || race === "프로토스") return "P";
  if(r === "Z" || r === "ZERG" || race === "저그") return "Z";
  if(r === "T" || r === "TERRAN" || race === "테란") return "T";

  return r;
}

function parseDate(value){
  if(!value) return null;

  const d = new Date(value);
  if(!isNaN(d.getTime())) return d;

  return null;
}

function escapeHtml(value){
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("playerSearchInput");

  if(input){
    input.addEventListener("keydown", e => {
      if(e.key === "Enter"){
        e.preventDefault();
        searchPlayer();
      }
    });
  }
});

window.setMapFilter = function(type){
  mapFilter = type;
  mapExpanded = false;
  renderMapStats();
};


window.toggleMapExpanded = function(){
  mapExpanded = !mapExpanded;
  renderMapStats();
};



function renderMapStats(){
  const area = document.getElementById("mapStatsArea");
  if(!area) return;

  const grouped = {};

  currentMatches.forEach(m => {
    if(!m.map) return;

    const map = m.map;

    if(!grouped[map]) grouped[map] = [];
    grouped[map].push(m);
  });

  let maps = Object.keys(grouped);

  if(mapFilter === "10"){
    maps = maps.filter(map => grouped[map].length >= 10);
  }

  if(mapFilter === "20"){
    maps = maps.filter(map => grouped[map].length >= 20);
  }

  maps = maps.sort((a,b) => {
    if(mapFilter === "winrate"){
      const statA = calculateStats(grouped[a]).total;
      const statB = calculateStats(grouped[b]).total;
      return Number(statB.rate) - Number(statA.rate);
    }

    return grouped[b].length - grouped[a].length;
  });

  const visibleMaps = mapExpanded ? maps : maps.slice(0, 6);

  area.innerHTML = `
    ${visibleMaps.map(map => {
      const stat = calculateStats(grouped[map]);
      return renderStatCard(map, stat);
    }).join("")}

    ${maps.length > 6 ? `
      <button class="map-toggle-button" onclick="toggleMapExpanded()">
        ${mapExpanded ? "접기" : `전체 맵 보기 (${maps.length}개)`}
      </button>
    ` : ""}
  `;
}



document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("playerSearchInput");
  const suggestionBox = document.getElementById("searchSuggestions");

  if(!input || !suggestionBox) return;

  input.addEventListener("input", () => {

    const keyword = input.value.trim().toLowerCase();

    if(!keyword){
      suggestionBox.innerHTML = "";
      suggestionBox.style.display = "none";
      return;
    }

    const matched = playerNames
      .filter(name => name.toLowerCase().includes(keyword))
      .slice(0, 8);

    suggestionBox.innerHTML = matched.map(name => `
      <div class="suggestion-item" data-name="${escapeHtml(name)}">
        ${escapeHtml(name)}
      </div>
    `).join("");

    suggestionBox.style.display = matched.length ? "block" : "none";
  });

  suggestionBox.addEventListener("click", e => {

    const item = e.target.closest(".suggestion-item");

    if(!item) return;

    input.value = item.dataset.name;

    suggestionBox.style.display = "none";

    searchPlayer();
  });

  input.addEventListener("keydown", e => {

    if(e.key === "Enter"){
      e.preventDefault();
      suggestionBox.style.display = "none";
      searchPlayer();
    }
  });

  document.addEventListener("click", e => {

    if(!e.target.closest(".search-wrap")){
      suggestionBox.style.display = "none";
    }
  });
});

function safeLocalId(value){
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣_.-]/gi, "-")
    .replace(/-+/g, "-")
    .slice(0, 140);
}

function setRecordLoading(isLoading){
  const el = document.getElementById("recordLoading");
  if(!el) return;

  el.classList.toggle("active", isLoading);
}

loadMembers();
