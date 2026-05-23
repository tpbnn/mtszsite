let matchRows = [];
let currentTab = "team";
let selectedMatchTypes = new Set();
let selectedResult = "all";

async function loadMatchResult(){

  const res = await fetch("match_result.xlsx");
  const buf = await res.arrayBuffer();

  const workbook = XLSX.read(buf, { type:"array" });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  matchRows = XLSX.utils.sheet_to_json(sheet, {
    header:1,
    defval:""
  });

initMatchFilters();

renderTeamStatsSummary();
  renderTeamResult();

}

loadMatchResult();

function setMatchTab(tab){

  currentTab = tab;

  document.querySelectorAll(".match-tabs button")
    .forEach(btn => btn.classList.remove("active"));

  document.querySelectorAll(".match-view")
    .forEach(v => v.classList.remove("active"));

  if(tab === "team"){
    document.querySelector(".match-tabs button:nth-child(1)")
      .classList.add("active");

    document.getElementById("teamResultView")
      .classList.add("active");

    renderTeamResult();

  }else{

    document.querySelector(".match-tabs button:nth-child(2)")
      .classList.add("active");

    document.getElementById("playerResultView")
      .classList.add("active");

    renderPlayerButtons();
  }
}


function renderTeamStatsSummary(){
  const box = document.getElementById("teamStatsSummary");
  if(!box) return;

  const targetTypes = ["대학대전", "미니대전"];
  const races = ["T", "Z", "P"];

  const matches = [];

  for(let i = 1; i < matchRows.length; i++){
    const row = matchRows[i];
    if(!row[0]) continue;

    const type = row[2];
    if(!targetTypes.includes(type)) continue;

    const match = {
      type,
      result: row[3],
      sets: []
    };

    let j = i;

    while(j < matchRows.length){
      const r = matchRows[j];
      if(j !== i && r[0]) break;

      if(r[9]){
        match.sets.push({
          race: r[11],
          result: r[12]
        });
      }

      j++;
    }

    matches.push(match);
    i = j - 1;
  }

  const calcMatchStats = list => {
    const total = list.length;
    const win = list.filter(m => m.result === "승").length;
    const lose = list.filter(m => m.result === "패").length;
    const rate = total ? Math.round((win / total) * 100) : 0;
    return `${total}전 ${win}승 ${lose}패 (${rate}%)`;
  };

  const calcRaceStats = list => {
    const allSets = list.flatMap(m => m.sets);

    return races.map(race => {
      const rows = allSets.filter(s => s.race === race);
      const total = rows.length;
      const win = rows.filter(s => s.result === "승").length;
      const lose = rows.filter(s => s.result === "패").length;
      const rate = total ? Math.round((win / total) * 100) : 0;

      const label = race === "T" ? "테란" : race === "Z" ? "저그" : "프로토스";

      return `
        <div class="team-stat-line">
          <span class="race-${race}">${label}</span>
          <b>${total}전 ${win}승 ${lose}패 (${rate}%)</b>
        </div>
      `;
    }).join("");
  };

  const totalMatches = matches;
  const collegeMatches = matches.filter(m => m.type === "대학대전");
  const miniMatches = matches.filter(m => m.type === "미니대전");

  box.innerHTML = `
    <div class="team-stat-box">
      <h3>총 전적 (대학대전+미니대전)</h3>
      <strong>${calcMatchStats(totalMatches)}</strong>
      ${calcRaceStats(totalMatches)}
    </div>

    <div class="team-stat-box">
      <h3>대학대전 총 전적</h3>
      <strong>${calcMatchStats(collegeMatches)}</strong>
      ${calcRaceStats(collegeMatches)}
    </div>

    <div class="team-stat-box">
      <h3>미니대전 총 전적</h3>
      <strong>${calcMatchStats(miniMatches)}</strong>
      ${calcRaceStats(miniMatches)}
    </div>
  `;
}


function initMatchFilters(){

  const typeBox = document.getElementById("matchTypeFilter");
  const resultFilter = document.getElementById("matchResultFilter");

  if(resultFilter){
    resultFilter.addEventListener("change", () => {
      selectedResult = resultFilter.value;
      renderTeamResult();
    });
  }

  if(!typeBox) return;

  const order = ["대학대전", "미니대전", "CK/PL", "끝장전"];

  const types = [...new Set(
    matchRows
      .slice(1)
      .filter(row => row[0] && row[2])
      .map(row => row[2])
  )].sort((a,b) => order.indexOf(a) - order.indexOf(b));

  selectedMatchTypes = new Set(types);

  typeBox.innerHTML = types.map(type => `
    <button class="type-chip active"
            data-type="${type}"
            type="button">
      ${type}
    </button>
  `).join("");

  typeBox.querySelectorAll(".type-chip").forEach(btn => {

    btn.addEventListener("click", () => {

      const type = btn.dataset.type;

      if(selectedMatchTypes.has(type)){
        selectedMatchTypes.delete(type);
        btn.classList.remove("active");

      }else{
        selectedMatchTypes.add(type);
        btn.classList.add("active");
      }

      renderTeamResult();
    });
  });
}

function renderTeamResult(){
  const wrap = document.getElementById("teamResultList");
  wrap.innerHTML = "";

  const matches = [];

  for(let i = 1; i < matchRows.length; i++){
    const row = matchRows[i];
    if(!row[0]) continue;

    const match = {
      date: row[0],
      opponent: row[1],
      type: row[2],
      result: row[3],
      win: row[4],
      lose: row[5],
      note: row[7],
      sets: []
    };

    let j = i;

    while(j < matchRows.length){
      const r = matchRows[j];

      if(j !== i && r[0]) break;

      if(r[9]){
match.sets.push({
  set: r[9],
  player: r[10],
  race: r[11],
  result: r[12],
  enemy: r[13],
  url: String(r[14] || "").trim()
});
      }

      j++;
    }

    matches.push(match);
    i = j - 1;
  }

  matches
    .filter(m => selectedMatchTypes.size === 0 || selectedMatchTypes.has(m.type))
.filter(m => selectedResult === "all" || m.result === selectedResult)
    .sort((a,b) => new Date(String(b.date).replace(/\./g,"-")) - new Date(String(a.date).replace(/\./g,"-")))
    .forEach(match => {
      const card = document.createElement("div");
      card.className = "team-match-card";

      card.innerHTML = `
        <div class="team-match-head">
          <div class="match-date">${match.date}</div>
          <div class="match-opponent">${match.opponent ? `vs ${match.opponent}` : ""}</div>
          <div class="match-type">${match.type}</div>
          <div class="team-match-result ${match.result === "승" ? "win" : "lose"}">${match.result}</div>
          <div class="match-note-inline">${match.note || ""}</div>
          <div class="match-score">${match.win}승 ${match.lose}패</div>
          <button class="set-toggle" type="button">세트 보기</button>
        </div>

        <div class="set-list collapsed">
          ${match.sets.map(set => `
      <div class="set-row">
  <div class="set-no">${set.set}</div>
  <div class="set-player">${set.player}</div>
  <div class="set-race race-${set.race}">${set.race}</div>
  <div class="set-result ${set.result === "승" ? "win" : "lose"}">${set.result}</div>
  <div class="set-enemy">${set.enemy ? `vs ${set.enemy}` : ""}</div>
  <div class="set-video">
  ${set.url ? `
    <a href="${set.url}" target="_blank" class="youtube-link">
      <img src="./Youtube_logo.png" alt="YouTube">
    </a>
  ` : ""}
</div>
</div>
          `).join("")}
        </div>
      `;

      card.querySelector(".set-toggle").addEventListener("click", e => {
        const list = card.querySelector(".set-list");
        list.classList.toggle("collapsed");
        e.target.textContent = list.classList.contains("collapsed") ? "세트 보기" : "세트 접기";
      });

      wrap.appendChild(card);
    });
}

let selectedPlayerName = "";

function renderPlayerButtons(){
  const box = document.getElementById("playerNameButtons");
  if(!box) return;

  // P열 = index 15
  const names = [...new Set(
    matchRows
      .slice(1)
      .map(row => String(row[15] || "").trim())
      .filter(Boolean)
  )];

  if(!selectedPlayerName && names.length){
    selectedPlayerName = names[0];
  }

  box.innerHTML = names.map(name => `
    <button class="player-name-chip ${name === selectedPlayerName ? "active" : ""}" data-name="${name}" type="button">
      ${name}
    </button>
  `).join("");

  box.querySelectorAll(".player-name-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedPlayerName = btn.dataset.name;
      renderPlayerButtons();
      renderPlayerResult();
    });
  });

  renderPlayerResult();
}


function renderPlayerResult(){
  const area = document.getElementById("playerResultArea");
  const statsBox = document.getElementById("playerStatsSummary");

  if(!area || !selectedPlayerName) return;

  const games = [];

  for(let i = 1; i < matchRows.length; i++){
    const row = matchRows[i];

    if(!row[0]) continue;
    if(!["대학대전", "미니대전"].includes(row[2])) continue;

    const date = row[0];
    const opponent = row[1];
    const type = row[2];

    let j = i;

    while(j < matchRows.length){
      const r = matchRows[j];
      if(j !== i && r[0]) break;

      if(r[10] === selectedPlayerName){
        games.push({
          date,
          opponent,
          type,
          player: r[10],
          race: r[11],
          result: r[12],
          enemy: r[13],
          url: String(r[14] || "").trim()
        });
      }

      j++;
    }

    i = j - 1;
  }

  const calc = list => {
    const total = list.length;
    const win = list.filter(g => g.result === "승").length;
    const lose = list.filter(g => g.result === "패").length;
    const rate = total ? Math.round((win / total) * 100) : 0;
    return { total, win, lose, rate };
  };

games.sort((a, b) => {
  const dateA = new Date(String(a.date).replace(/\./g, "-"));
  const dateB = new Date(String(b.date).replace(/\./g, "-"));
  return dateB - dateA;
});

  const total = calc(games);
  const college = calc(games.filter(g => g.type === "대학대전"));
  const mini = calc(games.filter(g => g.type === "미니대전"));

  if(statsBox){
    statsBox.innerHTML = `
      <div class="team-stat-box">
        <h3>${selectedPlayerName} 총 전적</h3>
        <strong>${total.total}전 ${total.win}승 ${total.lose}패 (${total.rate}%)</strong>
      </div>

      <div class="team-stat-box">
        <h3>대학대전 전적</h3>
        <strong>${college.total}전 ${college.win}승 ${college.lose}패 (${college.rate}%)</strong>
      </div>

      <div class="team-stat-box">
        <h3>미니대전 전적</h3>
        <strong>${mini.total}전 ${mini.win}승 ${mini.lose}패 (${mini.rate}%)</strong>
      </div>
    `;
  }

  area.innerHTML = `
    <div class="player-result-card">
      <div class="player-game-list">
        ${games.map(g => `
          <div class="player-game-row">
            <div>${g.date}</div>
            <div>${g.opponent ? `vs ${g.opponent}` : ""}</div>
            <div>${g.type}</div>
            <div class="race-${g.race}">${g.race}</div>
            <div class="${g.result === "승" ? "win" : "lose"}">${g.result}</div>
            <div>${g.enemy ? `vs ${g.enemy}` : ""}</div>
            <div>
              ${g.url && g.url.startsWith("http") ? `
                <a href="${g.url}" target="_blank" rel="noopener noreferrer" class="youtube-link">
                  <img src="./Youtube_logo.png" alt="YouTube">
                </a>
              ` : ""}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

window.setMatchTab = setMatchTab;
window.renderTeamResult = renderTeamResult;
window.renderPlayerResult = renderPlayerResult;

