// Build: ecuador-2026-v2
import React, { useState, useEffect, useMemo } from "react";

// ─── DATES ────────────────────────────────────────────────────────────────────
var TOURNAMENT_START = new Date("2026-06-11T15:00:00Z");
var LATE_DEADLINE    = new Date("2026-06-15T04:00:00Z");
var EDIT_DEADLINE    = new Date("2026-06-11T15:00:00Z");

function isTournamentStarted() { return new Date() >= TOURNAMENT_START; }
function isPastLateDeadline()  { return new Date() >= LATE_DEADLINE; }
function isPastEditDeadline()  { return new Date() >= EDIT_DEADLINE; }

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
var GROUPS = {
  A: ["Mexico","South Korea","South Africa","Czech Republic"],
  B: ["Canada","Switzerland","Qatar","Bosnia and Herzegovina"],
  C: ["Brazil","Morocco","Haiti","Scotland"],
  D: ["USA","Paraguay","Australia","Türkiye"],
  E: ["Germany","Curaçao","Côte d'Ivoire","Ecuador"],
  F: ["Netherlands","Japan","Sweden","Tunisia"],
  G: ["Belgium","Egypt","Iran","New Zealand"],
  H: ["Spain","Saudi Arabia","Cabo Verde","Uruguay"],
  I: ["France","Senegal","Iraq","Norway"],
  J: ["Argentina","Algeria","Austria","Jordan"],
  K: ["Portugal","Colombia","Uzbekistan","DR Congo"],
  L: ["England","Croatia","Ghana","Panama"]
};

var GROUP_FIXTURES = {
  A:[["Mexico","South Africa"],["South Korea","Czech Republic"],["Mexico","South Korea"],["South Africa","Czech Republic"],["Mexico","Czech Republic"],["South Korea","South Africa"]],
  B:[["Canada","Bosnia and Herzegovina"],["Qatar","Switzerland"],["Canada","Qatar"],["Switzerland","Bosnia and Herzegovina"],["Canada","Switzerland"],["Bosnia and Herzegovina","Qatar"]],
  C:[["Brazil","Morocco"],["Haiti","Scotland"],["Brazil","Haiti"],["Scotland","Morocco"],["Brazil","Scotland"],["Morocco","Haiti"]],
  D:[["USA","Paraguay"],["Australia","Türkiye"],["USA","Australia"],["Türkiye","Paraguay"],["USA","Türkiye"],["Paraguay","Australia"]],
  E:[["Germany","Curaçao"],["Côte d'Ivoire","Ecuador"],["Germany","Côte d'Ivoire"],["Ecuador","Curaçao"],["Germany","Ecuador"],["Curaçao","Côte d'Ivoire"]],
  F:[["Netherlands","Japan"],["Sweden","Tunisia"],["Netherlands","Sweden"],["Tunisia","Japan"],["Netherlands","Tunisia"],["Japan","Sweden"]],
  G:[["Belgium","Egypt"],["Iran","New Zealand"],["Belgium","Iran"],["New Zealand","Egypt"],["Belgium","New Zealand"],["Egypt","Iran"]],
  H:[["Spain","Cabo Verde"],["Saudi Arabia","Uruguay"],["Spain","Saudi Arabia"],["Uruguay","Cabo Verde"],["Spain","Uruguay"],["Cabo Verde","Saudi Arabia"]],
  I:[["France","Senegal"],["Iraq","Norway"],["France","Iraq"],["Norway","Senegal"],["France","Norway"],["Senegal","Iraq"]],
  J:[["Argentina","Algeria"],["Austria","Jordan"],["Argentina","Austria"],["Jordan","Algeria"],["Argentina","Jordan"],["Algeria","Austria"]],
  K:[["Portugal","DR Congo"],["Uzbekistan","Colombia"],["Portugal","Uzbekistan"],["Colombia","DR Congo"],["Portugal","Colombia"],["DR Congo","Uzbekistan"]],
  L:[["England","Croatia"],["Ghana","Panama"],["England","Ghana"],["Panama","Croatia"],["England","Panama"],["Croatia","Ghana"]]
};

var KO_ROUNDS = ["r32","r16","qf","sf","final"];
var KO_NAMES = {r32:"Ronda de 32",r16:"Ronda de 16",qf:"Cuartos de final",sf:"Semifinales",final:"Final"};
var ROUND_PTS = {r32:5,r16:8,qf:10,sf:12,final:18};
var GQ_PTS = 3;
var SCORE_BONUS = 3;
var ADMIN_PW = "adminecuador2026";

var FLAG_CODES = {
  "Mexico":"mx","South Korea":"kr","South Africa":"za","Czech Republic":"cz",
  "Canada":"ca","Switzerland":"ch","Qatar":"qa","Bosnia and Herzegovina":"ba",
  "Brazil":"br","Morocco":"ma","Haiti":"ht","Scotland":"gb-sct",
  "USA":"us","Paraguay":"py","Australia":"au","Türkiye":"tr",
  "Germany":"de","Curaçao":"cw","Côte d'Ivoire":"ci","Ecuador":"ec",
  "Netherlands":"nl","Japan":"jp","Sweden":"se","Tunisia":"tn",
  "Belgium":"be","Egypt":"eg","Iran":"ir","New Zealand":"nz",
  "Spain":"es","Saudi Arabia":"sa","Cabo Verde":"cv","Uruguay":"uy",
  "France":"fr","Senegal":"sn","Iraq":"iq","Norway":"no",
  "Argentina":"ar","Algeria":"dz","Austria":"at","Jordan":"jo",
  "Portugal":"pt","Colombia":"co","Uzbekistan":"uz","DR Congo":"cd",
  "England":"gb-eng","Croatia":"hr","Ghana":"gh","Panama":"pa"
};

var R32_SLOTS = [
  {a:{type:"2nd",g:"A"},b:{type:"2nd",g:"B"},label:"M73"},
  {a:{type:"1st",g:"E"},b:{type:"3rd",gs:"A/B/C/D/F"},label:"M74"},
  {a:{type:"1st",g:"F"},b:{type:"2nd",g:"C"},label:"M75"},
  {a:{type:"1st",g:"C"},b:{type:"2nd",g:"F"},label:"M76"},
  {a:{type:"1st",g:"I"},b:{type:"3rd",gs:"C/D/F/G/H"},label:"M77"},
  {a:{type:"2nd",g:"E"},b:{type:"2nd",g:"I"},label:"M78"},
  {a:{type:"1st",g:"A"},b:{type:"3rd",gs:"C/E/F/H/I"},label:"M79"},
  {a:{type:"1st",g:"L"},b:{type:"3rd",gs:"E/H/I/J/K"},label:"M80"},
  {a:{type:"1st",g:"D"},b:{type:"3rd",gs:"B/E/F/I/J"},label:"M81"},
  {a:{type:"1st",g:"G"},b:{type:"3rd",gs:"A/E/H/I/J"},label:"M82"},
  {a:{type:"2nd",g:"K"},b:{type:"2nd",g:"L"},label:"M83"},
  {a:{type:"1st",g:"H"},b:{type:"2nd",g:"J"},label:"M84"},
  {a:{type:"1st",g:"B"},b:{type:"3rd",gs:"E/F/G/I/J"},label:"M85"},
  {a:{type:"1st",g:"J"},b:{type:"2nd",g:"H"},label:"M86"},
  {a:{type:"1st",g:"K"},b:{type:"3rd",gs:"D/E/I/J/L"},label:"M87"},
  {a:{type:"2nd",g:"D"},b:{type:"2nd",g:"G"},label:"M88"}
];
var R16_PAIRS = [[0,2],[1,4],[3,5],[6,7],[10,11],[8,9],[13,15],[12,14]];
var QF_PAIRS  = [[0,1],[4,5],[2,3],[6,7]]; // M97=W89vW90, M98=W93vW94, M99=W91vW92, M100=W95vW96
var SF_PAIRS  = [[0,1],[2,3]];

var KP = "ecuador-v1p";
var KR = "ecuador-v1r";
var KS = "ecuador-v1s";

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

// ─── SUPABASE STORAGE ────────────────────────────────────────────────────────
// All data is stored in Supabase so it's shared across all devices/browsers.
var SB_URL = "https://xjozuqhkftcdbxcacifq.supabase.co";
var SB_KEY = "sb_publishable_nzJqcdzviO-PR-ItH0s6yQ_PybpwlGx";

function sbHeaders() {
  return {
    "apikey": SB_KEY,
    "Authorization": "Bearer " + SB_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
  };
}

function storeGet(k) {
  // Try Claude.ai window.storage first (when running inside Claude.ai)
  if (window.storage && typeof window.storage.get === "function") {
    return window.storage.get(k, true).then(function(r) {
      try { return r ? JSON.parse(r.value) : null; }
      catch(e) { return null; }
    }).catch(function() { return supabaseGet(k); });
  }
  return supabaseGet(k);
}

function supabaseGet(k) {
  // Use body-based filter to avoid URL encoding issues with special chars in keys
  return fetch(SB_URL + "/rest/v1/kvstore?select=value&key=eq." + k, {
    headers: Object.assign({}, sbHeaders(), {"Accept": "application/json"})
  }).then(function(r) {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }).then(function(rows) {
    if (rows && Array.isArray(rows) && rows.length > 0) {
      try { return JSON.parse(rows[0].value); }
      catch(e) { return null; }
    }
    return null;
  }).catch(function(e) {
    console.error("Supabase GET error:", e);
    return null;
  });
}

function storeSet(k, v) {
  var json = JSON.stringify(v);
  // Also write to window.storage if inside Claude.ai
  if (window.storage && typeof window.storage.set === "function") {
    window.storage.set(k, json, true).catch(function() {});
  }
  return supabaseSet(k, json);
}

function supabaseSet(k, json) {
  return fetch(SB_URL + "/rest/v1/kvstore", {
    method: "POST",
    headers: {
      "apikey": SB_KEY,
      "Authorization": "Bearer " + SB_KEY,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify({ key: k, value: json, updated_at: new Date().toISOString() })
  }).then(function(r) {
    if (!r.ok) return r.text().then(function(t) { console.error("Supabase SET error:", r.status, t); });
    return null;
  }).catch(function(e) {
    console.error("Supabase SET error:", e);
    return null;
  });
}

// ─── LOGIC ────────────────────────────────────────────────────────────────────

function resolveSlot(slot, gRes, best8, used) {
  var gkeys = Object.keys(GROUPS);
  if (slot.type === "1st") return (gRes[slot.g] && gRes[slot.g].winner) || ("1ro Grp " + slot.g);
  if (slot.type === "2nd") return (gRes[slot.g] && gRes[slot.g].runnerUp) || ("2do Grp " + slot.g);
  if (slot.type === "3rd") {
    var parts = slot.gs.split("/");
    for (var i = 0; i < best8.length; i++) {
      var t = best8[i];
      if (used && used[t]) continue; // skip already assigned teams
      for (var j = 0; j < gkeys.length; j++) {
        var gk = gkeys[j];
        if (GROUPS[gk].indexOf(t) >= 0 && parts.indexOf(gk) >= 0) return t;
      }
    }
    return "Mejor 3ro";
  }
  return "TBD";
}

function calcStandings(g, scores) {
  var teams = GROUPS[g];
  var st = {};
  for (var ti = 0; ti < teams.length; ti++) {
    st[teams[ti]] = {pts:0,gf:0,ga:0,gd:0,w:0,d:0,l:0,played:0};
  }
  var fixtures = GROUP_FIXTURES[g];
  for (var fi = 0; fi < fixtures.length; fi++) {
    var fx = fixtures[fi];
    var sc = (scores || {})[g + "_" + fi];
    if (!sc || sc.h === "" || sc.a === "" || sc.h === undefined || sc.a === undefined) continue;
    var hg = parseInt(sc.h) || 0;
    var ag = parseInt(sc.a) || 0;
    var h = fx[0]; var a = fx[1];
    st[h].gf += hg; st[h].ga += ag; st[h].gd += hg-ag; st[h].played++;
    st[a].gf += ag; st[a].ga += hg; st[a].gd += ag-hg; st[a].played++;
    if (hg > ag) { st[h].pts += 3; st[h].w++; st[a].l++; }
    else if (hg === ag) { st[h].pts++; st[a].pts++; st[h].d++; st[a].d++; }
    else { st[a].pts += 3; st[a].w++; st[h].l++; }
  }
  var sorted = teams.slice().sort(function(a, b) {
    if (st[b].pts !== st[a].pts) return st[b].pts - st[a].pts;
    if (st[b].gd !== st[a].gd) return st[b].gd - st[a].gd;
    if (st[b].gf !== st[a].gf) return st[b].gf - st[a].gf;
    return a.localeCompare(b);
  });
  return {sorted: sorted, st: st};
}

function computeQualifiers(scores) {
  var gRes = {};
  var thirds = [];
  var gkeys = Object.keys(GROUPS);
  for (var gi = 0; gi < gkeys.length; gi++) {
    var g = gkeys[gi];
    var r = calcStandings(g, scores);
    gRes[g] = {winner:r.sorted[0], runnerUp:r.sorted[1], third:r.sorted[2], sorted:r.sorted, st:r.st};
    thirds.push({team:r.sorted[2], st:r.st[r.sorted[2]]});
  }
  thirds.sort(function(a, b) {
    if (b.st.pts !== a.st.pts) return b.st.pts - a.st.pts;
    if (b.st.gd !== a.st.gd) return b.st.gd - a.st.gd;
    if (b.st.gf !== a.st.gf) return b.st.gf - a.st.gf;
    return a.team.localeCompare(b.team);
  });
  var best8 = [];
  for (var i = 0; i < 8; i++) best8.push(thirds[i].team);
  return {gRes: gRes, best8: best8};
}


// ─── SCORING HELPERS ──────────────────────────────────────────────────────────

// Returns true only if admin has entered all 6 results for a group
function isGroupComplete(g, rSc) {
  var fxs = GROUP_FIXTURES[g];
  for (var fi = 0; fi < fxs.length; fi++) {
    var sc = (rSc || {})[g + "_" + fi];
    if (!sc || sc.h === "" || sc.a === "" || sc.h === undefined || sc.a === undefined) return false;
  }
  return true;
}

// Returns true only if admin has entered ALL 72 group results
function allGroupsComplete(rSc) {
  var gkeys = Object.keys(GROUPS);
  for (var gi = 0; gi < gkeys.length; gi++) {
    if (!isGroupComplete(gkeys[gi], rSc)) return false;
  }
  return true;
}

function calcScore(pred, results, penalty, isLate) {
  if (!pred) return 0;
  var pts = isLate ? -Math.abs(penalty || 0) : 0;
  if (!results) return pts;
  var pSc = pred.groupScores || {};
  var rSc = results.groupScores || {};
  var gkeys = Object.keys(GROUPS);

  // 1. Exact score bonus: only for matches admin has already confirmed
  for (var gi0 = 0; gi0 < gkeys.length; gi0++) {
    var g0 = gkeys[gi0];
    var fxs0 = GROUP_FIXTURES[g0];
    for (var fi0 = 0; fi0 < fxs0.length; fi0++) {
      var key0 = g0 + "_" + fi0;
      var ps0 = pSc[key0]; var rs0 = rSc[key0];
      if (!rs0 || rs0.h === "" || rs0.h === undefined) continue; // admin hasn't entered this match yet
      if (!ps0 || ps0.h === "" || ps0.h === undefined) continue;
      if (String(ps0.h) === String(rs0.h) && String(ps0.a) === String(rs0.a)) pts += SCORE_BONUS;
    }
  }

  // 2. Group qualifiers (1st/2nd): only when admin completed ALL 6 matches of that group
  var pQ = computeQualifiers(pSc);
  var rQ = computeQualifiers(rSc);
  for (var gi = 0; gi < gkeys.length; gi++) {
    var g = gkeys[gi];
    if (!isGroupComplete(g, rSc)) continue; // group not finished yet
    var pTeams = [pQ.gRes[g].winner, pQ.gRes[g].runnerUp];
    for (var ti = 0; ti < pTeams.length; ti++) {
      var t = pTeams[ti];
      if (t && (t === rQ.gRes[g].winner || t === rQ.gRes[g].runnerUp)) pts += GQ_PTS;
    }
  }

  // 3. Best 3rd place: only when admin completed ALL 72 group matches
  if (allGroupsComplete(rSc)) {
    for (var bi = 0; bi < pQ.best8.length; bi++) {
      if (rQ.best8.indexOf(pQ.best8[bi]) >= 0) pts += GQ_PTS;
    }
  }

  // 4. Knockout rounds: as before
  for (var ri = 0; ri < KO_ROUNDS.length; ri++) {
    var rd = KO_ROUNDS[ri];
    var pA = pred[rd + "_adv"] || [];
    var rA = results[rd + "_adv"] || [];
    for (var ai = 0; ai < pA.length; ai++) {
      if (pA[ai] && rA.indexOf(pA[ai]) >= 0) pts += ROUND_PTS[rd] || 0;
    }
  }
  return pts;
}

function getBreakdown(pred, results, penalty, isLate) {
  var bd = {
    exactScores:[], groupQualifiers:[], best3rd:[],
    r32:[], r16:[], qf:[], sf:[], final:[],
    penalty: isLate ? -Math.abs(penalty||0) : 0,
    total: 0
  };
  if (!pred || !results) { bd.total = bd.penalty; return bd; }
  var pSc = pred.groupScores || {};
  var rSc = results.groupScores || {};
  var pQ = computeQualifiers(pSc);
  var rQ = computeQualifiers(rSc);
  var gkeys = Object.keys(GROUPS);
  for (var gi = 0; gi < gkeys.length; gi++) {
    var g = gkeys[gi];
    var fxs = GROUP_FIXTURES[g];
    for (var fi = 0; fi < fxs.length; fi++) {
      var key = g + "_" + fi;
      var ps = pSc[key]; var rs = rSc[key];
      if (!ps || ps.h === "" || ps.h === undefined) continue;
      // Only show exact score result if admin has confirmed this specific match
      if (!rs || rs.h === "" || rs.h === undefined) continue;
      var hit = String(ps.h) === String(rs.h) && String(ps.a) === String(rs.a);
      bd.exactScores.push({home:fxs[fi][0], away:fxs[fi][1], score:ps.h+"-"+ps.a, hit:hit, pts:hit?SCORE_BONUS:0});
    }
  }
  for (var gi2 = 0; gi2 < gkeys.length; gi2++) {
    var g2 = gkeys[gi2];
    var qTeams = [pQ.gRes[g2].winner, pQ.gRes[g2].runnerUp];
    var groupDone2 = isGroupComplete(g2, rSc);
    for (var qi = 0; qi < qTeams.length; qi++) {
      var qt = qTeams[qi];
      if (!qt) continue;
      // Only award qualifier points when admin completed the full group
      var qhit = groupDone2 && (qt === rQ.gRes[g2].winner || qt === rQ.gRes[g2].runnerUp);
      bd.groupQualifiers.push({team:qt, label:qt+" (Grp "+g2+" "+(qi===0?"1ro":"2do")+")", hit:qhit, pts:(groupDone2 && qhit)?GQ_PTS:0, pending:!groupDone2});
    }
  }
  var allDone = allGroupsComplete(rSc);
  for (var b8i = 0; b8i < pQ.best8.length; b8i++) {
    var bt = pQ.best8[b8i];
    var bhit = allDone && rQ.best8.indexOf(bt) >= 0;
    bd.best3rd.push({team:bt, label:bt, hit:bhit, pts:(allDone && bhit)?GQ_PTS:0, pending:!allDone});
  }
  for (var rdi = 0; rdi < KO_ROUNDS.length; rdi++) {
    var rdk = KO_ROUNDS[rdi];
    var pAk = pred[rdk+"_adv"] || [];
    var rAk = results[rdk+"_adv"] || [];
    for (var ai2 = 0; ai2 < pAk.length; ai2++) {
      var at = pAk[ai2];
      if (!at) continue;
      var ahit = rAk.indexOf(at) >= 0;
      bd[rdk].push({team:at, label:at, hit:ahit, pts:ahit?ROUND_PTS[rdk]:0});
    }
  }
  var total = bd.penalty;
  var allSecs = [bd.exactScores,bd.groupQualifiers,bd.best3rd,bd.r32,bd.r16,bd.qf,bd.sf,bd.final];
  for (var si = 0; si < allSecs.length; si++) {
    for (var xi = 0; xi < allSecs[si].length; xi++) total += allSecs[si][xi].pts;
  }
  bd.total = total;
  return bd;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
var shadow   = "0 2px 6px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.04)";
var shadowSm = "0 1px 4px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.03)";
var S = {
  page:  {maxWidth:560,margin:"0 auto",padding:"1.25rem 1rem 2rem",fontFamily:"var(--font-sans)"},
  h1:    {fontSize:24,fontWeight:500,margin:"8px 0 0",color:"var(--color-text-primary)"},
  h2:    {fontSize:20,fontWeight:500,margin:"12px 0 14px",color:"var(--color-text-primary)"},
  card:  {background:"var(--color-background-secondary)",borderRadius:12,padding:"0.85rem 1rem"},
  hint:  {fontSize:13,color:"var(--color-text-secondary)",marginTop:0,marginBottom:10},
  warn:  {background:"var(--color-background-warning)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"var(--color-text-warning)"},
  info:  {background:"var(--color-background-info)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"var(--color-text-info)"},
  danger:{background:"var(--color-background-danger)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"var(--color-text-danger)"}
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Fl(props) {
  var code = FLAG_CODES[props.team] || "un";
  var sz = props.size || 18;
  var h = Math.round(sz * 0.67);
  return React.createElement("img", {
    src: "https://flagcdn.com/w40/" + code + ".png",
    alt: props.team || "",
    style: {width:sz, height:h, objectFit:"cover", borderRadius:2, flexShrink:0, display:"inline-block", verticalAlign:"middle"}
  });
}

function GreenCheck() {
  return (
    <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:18,height:18,borderRadius:"50%",background:"#3B6D11",flexShrink:0}}>
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

function EmptyCheck() {
  return (
    <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:18,height:18,borderRadius:"50%",border:"1.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",flexShrink:0}} />
  );
}

function Btn(props) {
  return (
    <button onClick={props.onClick} style={{padding:"11px 20px",minHeight:44,borderRadius:10,cursor:"pointer",fontSize:15,fontFamily:"var(--font-sans)",fontWeight:props.primary?500:400,border:"0.5px solid var(--color-border-secondary)",background:props.primary?"var(--color-text-primary)":"var(--color-background-primary)",color:props.primary?"var(--color-background-primary)":"var(--color-text-primary)",boxShadow:shadow}}>
      {props.children}
    </button>
  );
}

function BackBtn(props) {
  return (
    <button onClick={props.onClick} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,color:"var(--color-text-secondary)",padding:"8px 0",fontFamily:"var(--font-sans)",minHeight:44,display:"flex",alignItems:"center"}}>
      ← Volver
    </button>
  );
}

function TabBtn(props) {
  return (
    <button onClick={props.onClick} style={{padding:"7px 13px",minHeight:36,borderRadius:20,cursor:"pointer",fontSize:13,fontFamily:"var(--font-sans)",border:"0.5px solid var(--color-border-secondary)",background:props.active?"var(--color-text-primary)":"var(--color-background-primary)",color:props.active?"var(--color-background-primary)":"var(--color-text-primary)",boxShadow:props.active?shadow:shadowSm}}>
      {props.label}
    </button>
  );
}

function Pill(props) {
  return (
    <span style={{display:"inline-block",padding:"2px 8px",borderRadius:20,fontSize:11,background:"var(--color-background-"+props.color+")",color:"var(--color-text-"+props.color+")"}}>
      {props.text}
    </span>
  );
}

// ─── ScoreBox ─────────────────────────────────────────────────────────────────
// Uses text input to avoid browser number-input quirks that prevent editing.
// Accepts only digits 0-30, passes raw string up so parent decides how to store.
function ScoreBox(props) {
  // local display state so user can type freely (e.g. clear field before typing new number)
  var stLocal = useState(props.val !== undefined && props.val !== "" ? String(props.val) : "");
  var local = stLocal[0]; var setLocal = stLocal[1];

  // sync when parent value changes (e.g. group switch)
  useEffect(function() {
    var incoming = props.val !== undefined && props.val !== "" ? String(props.val) : "";
    setLocal(incoming);
  }, [props.val]);

  function handleChange(e) {
    var raw = e.target.value;
    // allow empty (clearing field) or digits only, max 2 chars
    if (raw === "" || (/^\d{1,2}$/.test(raw) && parseInt(raw) <= 30)) {
      setLocal(raw);
      props.onChange(raw === "" ? "" : parseInt(raw));
    }
  }

  function handleBlur() {
    // on blur, if empty keep as empty; otherwise normalize
    if (local === "") {
      props.onChange("");
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={function(e) { e.target.select(); }}
      style={{width:52,height:44,textAlign:"center",padding:0,borderRadius:8,border:"0.5px solid var(--color-border-secondary)",fontSize:20,fontWeight:600,background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",boxShadow:shadowSm,outline:"none"}}
    />
  );
}

function TeamBtn(props) {
  var tbd = !props.team || props.team === "TBD";
  return (
    <button
      onClick={props.onClick}
      disabled={tbd || props.locked}
      style={{flex:1,padding:props.big?"16px 8px":"12px 6px",minHeight:props.big?56:48,borderRadius:10,cursor:(tbd||props.locked)?"default":"pointer",fontSize:props.big?15:13,fontWeight:props.selected?500:400,fontFamily:"var(--font-sans)",border:props.selected?"2px solid #3B6D11":"0.5px solid "+(tbd?"var(--color-border-tertiary)":"var(--color-border-secondary)"),background:props.selected?"#EAF3DE":tbd?"var(--color-background-secondary)":"var(--color-background-primary)",color:props.selected?"#27500A":tbd?"var(--color-text-tertiary)":"var(--color-text-primary)",textAlign:"center",overflow:"hidden",boxShadow:tbd?"none":shadowSm}}
    >
      <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5}}>
        {props.selected && (
          <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:16,height:16,borderRadius:"50%",background:"#3B6D11",flexShrink:0}}>
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
        {!tbd && <Fl team={props.team} size={15} />}
        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{props.team || "TBD"}</span>
      </span>
    </button>
  );
}

function Spinner() {
  return <div style={{display:"flex",justifyContent:"center",padding:"3rem",color:"var(--color-text-tertiary)",fontSize:14}}>Cargando…</div>;
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  var stateView = useState("home");
  var view = stateView[0]; var setView = stateView[1];
  var stateLoad = useState(true);
  var loading = stateLoad[0]; var setLoading = stateLoad[1];
  var stateParts = useState([]);
  var parts = stateParts[0]; var setParts = stateParts[1];
  var stateRes = useState({});
  var results = stateRes[0]; var setResults = stateRes[1];
  var stateSet = useState({penalty:20,lateDeadlinePassed:false});
  var settings = stateSet[0]; var setSettings = stateSet[1];
  var stateUser = useState(null);
  var currentUser = stateUser[0]; var setCurrentUser = stateUser[1];
  var stateAdmin = useState(false);
  var adminUnlocked = stateAdmin[0]; var setAdminUnlocked = stateAdmin[1];

  useEffect(function() {
    setLoading(true);
    var timeout = setTimeout(function() { setLoading(false); }, 5000);
    Promise.all([storeGet(KP), storeGet(KR), storeGet(KS)]).then(function(vals) {
      clearTimeout(timeout);
      if (vals[0]) setParts(vals[0]);
      if (vals[1]) setResults(vals[1]);
      if (vals[2]) setSettings(vals[2]);
      setLoading(false);
    }).catch(function() {
      clearTimeout(timeout);
      setLoading(false);
    });
  }, []);

  function saveParts(list) { setParts(list); storeSet(KP, list); }
  function saveResults(r)  { setResults(r);  storeSet(KR, r); }
  function saveSettings(s) { setSettings(s); storeSet(KS, s); }

  var scored = useMemo(function() {
    return parts.slice().map(function(p) {
      var copy = Object.assign({}, p);
      copy.score = calcScore(p.prediction, results, settings.penalty, p.isLate);
      return copy;
    }).sort(function(a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return (a.submittedAt||9e15) - (b.submittedAt||9e15);
    });
  }, [parts, results, settings]);

  if (loading) return <Spinner />;

  var sh = {view:view,setView:setView,parts:parts,scored:scored,results:results,settings:settings,currentUser:currentUser,setCurrentUser:setCurrentUser,adminUnlocked:adminUnlocked,setAdminUnlocked:setAdminUnlocked,saveParts:saveParts,saveResults:saveResults,saveSettings:saveSettings};

  return (
    <div style={{minHeight:"100vh",paddingBottom:34}}>
      {view === "home"        && <HomeView        {...sh} />}
      {view === "join"        && <JoinView         {...sh} />}
      {view === "predict"     && <PredictView      {...sh} />}
      {view === "leaderboard" && <LeaderboardView  {...sh} />}
      {view === "dashboard"   && <DashboardView    {...sh} />}
      {view === "admin"       && <AdminView        {...sh} />}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomeView(props) {
  var ap = props.parts.filter(function(p) { return p.status === "approved"; });
  var pe = props.parts.filter(function(p) { return p.status === "pending"; });
  var items = [
    {icon:"📋",label:"Llenar mi quiniela",sub:"Predice marcadores, clasificados y campeón",v:"join",primary:true},
    {icon:"🏆",label:"Tabla de posiciones",sub:"Ver clasificación y puntajes actuales",v:"leaderboard"},
    {icon:"📊",label:"Panel de jugadores",sub:"Desglose detallado de puntos por jugador",v:"dashboard"},
    {icon:"⚙️",label:"Panel de administrador",sub:"Gestionar participantes e ingresar resultados",v:"admin"}
  ];
  var scoring = [
    ["🎯","Marcador exacto","+3 pts"],["🏟️","Clasificado de grupo","3 pts"],
    ["3️⃣","Mejor 3ro del grupo","3 pts"],["⚽","Ronda de 32","5 pts"],
    ["⚽","Ronda de 16","8 pts"],["⚽","Cuartos de final","10 pts"],
    ["⚽","Semifinal","12 pts"],["🏆","Campeón","18 pts"]
  ];
  return (
    <div style={S.page}>
      <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
          <svg width="110" height="120" viewBox="0 0 110 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B21A8"/>
                <stop offset="40%" stopColor="#1D4ED8"/>
                <stop offset="100%" stopColor="#EA580C"/>
              </linearGradient>
              <linearGradient id="lg2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EA580C"/>
                <stop offset="50%" stopColor="#1D4ED8"/>
                <stop offset="100%" stopColor="#6B21A8"/>
              </linearGradient>
            </defs>
            <path d="M8 38 C8 20 18 10 34 10 C50 10 58 20 58 34 C58 46 50 54 36 62 L36 68 L58 68 L58 78 L8 78 L8 68 C8 68 38 52 42 44 C46 36 44 26 34 26 C24 26 22 32 22 38 Z" fill="url(#lg1)"/>
            <path d="M102 10 L70 44" stroke="url(#lg2)" strokeWidth="14" strokeLinecap="round" fill="none"/>
            <circle cx="80" cy="60" r="22" fill="none" stroke="url(#lg2)" strokeWidth="14"/>
            <circle cx="55" cy="10" r="7" fill="url(#lg1)" opacity="0.85"/>
            <text x="55" y="96" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="7" fill="#6B21A8" letterSpacing="3">FIFA WORLD CUP</text>
            <text x="55" y="107" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="9" fill="#1D4ED8" letterSpacing="4">2026</text>
            <text x="42" y="118" textAnchor="middle" fontSize="8" fill="#EA580C">★</text>
            <text x="55" y="118" textAnchor="middle" fontSize="8" fill="#EA580C">★</text>
            <text x="68" y="118" textAnchor="middle" fontSize="8" fill="#EA580C">★</text>
          </svg>
        </div>
        <h1 style={S.h1}>Quiniela Mundial 2026</h1>
        <p style={{color:"var(--color-text-secondary)",margin:"4px 0 0",fontSize:14}}>EUA · Canadá · México · 48 equipos</p>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:14,flexWrap:"wrap"}}>
          <div style={{textAlign:"center",padding:"8px 20px",borderRadius:10,background:"var(--color-background-secondary)"}}>
            <div style={{fontSize:22,fontWeight:500,color:"var(--color-text-success)"}}>{ap.length}</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>Aprobados</div>
          </div>
          {pe.length > 0 && (
            <div style={{textAlign:"center",padding:"8px 20px",borderRadius:10,background:"var(--color-background-warning)"}}>
              <div style={{fontSize:22,fontWeight:500,color:"var(--color-text-warning)"}}>{pe.length}</div>
              <div style={{fontSize:11,color:"var(--color-text-warning)",marginTop:2}}>Pendientes</div>
            </div>
          )}
          <div style={{textAlign:"center",padding:"8px 20px",borderRadius:10,background:"var(--color-background-secondary)"}}>
            <div style={{fontSize:22,fontWeight:500}}>11 Jun</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>Inicio</div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {items.map(function(item) {
          return (
            <button key={item.v} onClick={function() { props.setView(item.v); }} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:12,cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:item.primary?"var(--color-text-primary)":"var(--color-background-primary)",color:item.primary?"var(--color-background-primary)":"var(--color-text-primary)",fontFamily:"var(--font-sans)",textAlign:"left",width:"100%",boxShadow:shadow}}>
              <span style={{fontSize:22,lineHeight:1,flexShrink:0}}>{item.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:500}}>{item.label}</div>
                <div style={{fontSize:12,opacity:item.primary?0.7:1,color:item.primary?"inherit":"var(--color-text-secondary)",marginTop:2}}>{item.sub}</div>
              </div>
              <span style={{fontSize:18,opacity:0.4}}>›</span>
            </button>
          );
        })}
      </div>

      <div style={{marginTop:"1.5rem",borderRadius:12,border:"0.5px solid var(--color-border-tertiary)",overflow:"hidden"}}>
        <div style={{padding:"10px 14px",borderBottom:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)"}}>
          <div style={{fontSize:13,fontWeight:500}}>Cómo funciona el puntaje</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:"var(--color-background-primary)"}}>
          {scoring.map(function(row, i) {
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderBottom:i<6?"0.5px solid var(--color-border-tertiary)":"none",borderRight:i%2===0?"0.5px solid var(--color-border-tertiary)":"none"}}>
                <span style={{fontSize:15,flexShrink:0}}>{row[0]}</span>
                <span style={{flex:1,fontSize:12,color:"var(--color-text-secondary)"}}>{row[1]}</span>
                <span style={{fontSize:13,fontWeight:500}}>{row[2]}</span>
              </div>
            );
          })}
        </div>
        <div style={{padding:"8px 14px",borderTop:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)"}}>
          <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>Desempate: gana quien envió primero · Edición hasta 11 jun 10am CT · Envío tardío hasta 14 jun 11pm CT</div>
        </div>
      </div>
    </div>
  );
}

// ─── JOIN ─────────────────────────────────────────────────────────────────────

function JoinView(props) {
  var stN = useState(""); var name = stN[0]; var setName = stN[1];
  var stE = useState(""); var err = stE[0]; var setErr = stE[1];
  var pastDeadline = isPastLateDeadline();

  function go() {
    var n = name.trim();
    if (!n) { setErr("Ingresa tu nombre."); return; }
    var ex = null;
    for (var i = 0; i < props.parts.length; i++) {
      if (props.parts[i].name.toLowerCase() === n.toLowerCase()) { ex = props.parts[i]; break; }
    }
    if (ex) {
      if (pastDeadline && ex.status === "draft") { setErr("El plazo de envío ya venció (Dom 14 jun, 11pm CT)."); return; }
      props.setCurrentUser(ex); props.setView("predict"); return;
    }
    if (pastDeadline) { setErr("El plazo de envío tardío ya venció. No se pueden agregar nuevos participantes."); return; }
    var isLate = isTournamentStarted();
    var user = {id:genId(),name:n,status:"draft",isLate:isLate,joinedAt:Date.now(),prediction:{groupScores:{}},submittedAt:null};
    props.saveParts(props.parts.concat([user]));
    props.setCurrentUser(user); props.setView("predict");
  }

  return (
    <div style={S.page}>
      <BackBtn onClick={function() { props.setView("home"); }} />
      <h2 style={S.h2}>Unirse a la quiniela</h2>
      {pastDeadline ? (
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,...S.danger}}>
          <span style={{fontSize:18}}>🔒</span>
          <div>
            <div style={{fontWeight:500,fontSize:13}}>Plazo vencido</div>
            <div style={{fontSize:12,marginTop:2}}>El plazo para enviar predicciones venció el Dom 14 jun a las 11pm CT.</div>
          </div>
        </div>
      ) : isTournamentStarted() ? (
        <div style={{...S.warn,marginBottom:12}}>⚠️ Ingreso tardío: -{props.settings.penalty} pts de penalización. Plazo: Dom 14 jun 11pm CT. No podrás editar después de enviar.</div>
      ) : (
        <div style={{...S.info,marginBottom:12}}>⏰ Sin penalización hasta el 11 jun 10am CT. Edición permitida hasta esa fecha.</div>
      )}
      {!pastDeadline && (
        <div>
          <input autoFocus placeholder="Tu nombre completo" value={name} onChange={function(e) { setName(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") go(); }} style={{width:"100%",boxSizing:"border-box",marginTop:8,fontSize:16}} />
          {err && <p style={{color:"var(--color-text-danger)",fontSize:13,marginTop:6}}>{err}</p>}
          <div style={{marginTop:14}}><Btn primary={true} onClick={go}>Continuar →</Btn></div>
        </div>
      )}
      {pastDeadline && (
        <div>
          <p style={{color:"var(--color-text-secondary)",fontSize:13}}>Si ya enviaste tu quiniela, ingresa tu nombre para consultarla.</p>
          <input placeholder="Tu nombre completo" value={name} onChange={function(e) { setName(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") go(); }} style={{width:"100%",boxSizing:"border-box",marginTop:8,fontSize:16}} />
          {err && <p style={{color:"var(--color-text-danger)",fontSize:13,marginTop:6}}>{err}</p>}
          <div style={{marginTop:14}}><Btn onClick={go}>Ver mi quiniela →</Btn></div>
        </div>
      )}
    </div>
  );
}

// ─── PREDICT ─────────────────────────────────────────────────────────────────

var PRED_TABS = ["grupos","r32","r16","qf","sf","final"];
var TAB_LABELS_MAP = {grupos:"Grupos",r32:"Ronda de 32",r16:"Ronda de 16",qf:"Cuartos",sf:"Semifinales",final:"Final"};

function PredictView(props) {
  var user = null;
  for (var i = 0; i < props.parts.length; i++) {
    if (props.parts[i].id === (props.currentUser && props.currentUser.id)) { user = props.parts[i]; break; }
  }
  if (!user) user = props.currentUser;

  var initPred = (user && user.prediction) ? user.prediction : {groupScores:{}};
  var stPred = useState(initPred); var pred = stPred[0]; var setPred = stPred[1];
  var stTab = useState("grupos"); var tab = stTab[0]; var setTab = stTab[1];
  var stG = useState("A"); var activeG = stG[0]; var setActiveG = stG[1];
  var stSub = useState(user && (user.status==="pending"||user.status==="approved")); var submitted = stSub[0]; var setSubmitted = stSub[1];
  var stEd = useState(false); var editing = stEd[0]; var setEditing = stEd[1];

  var tournamentStarted = isTournamentStarted();
  var pastDeadline = isPastLateDeadline();
  var editClosed = isPastEditDeadline();
  var canEdit = !editClosed && !(user && user.isLate && submitted);
  var isLocked = (submitted && !editing) || pastDeadline;

  var qualData = useMemo(function() {
    return computeQualifiers(pred.groupScores || {});
  }, [pred.groupScores]);

  function buildR32Pairs() {
    // Build teamGroup map
    var gkeys = Object.keys(GROUPS);
    var teamGroup = {};
    for (var gi = 0; gi < gkeys.length; gi++) {
      var gk = gkeys[gi];
      for (var ti = 0; ti < GROUPS[gk].length; ti++) teamGroup[GROUPS[gk][ti]] = gk;
    }

    // Collect 3rd-place slot definitions
    var thirdSlotDefs = [];
    for (var si = 0; si < R32_SLOTS.length; si++) {
      var sl = R32_SLOTS[si];
      if (sl.a.type === "3rd") thirdSlotDefs.push({idx:si, side:"a", groups:sl.a.gs.split("/")});
      if (sl.b.type === "3rd") thirdSlotDefs.push({idx:si, side:"b", groups:sl.b.gs.split("/")});
    }

    // Use backtracking to find a valid complete assignment
    var best8 = qualData.best8.slice(); // already sorted by pts desc
    var assignment = {}; // key -> team

    function backtrack(slotIdx, used) {
      if (slotIdx === thirdSlotDefs.length) return true; // all assigned
      var slotDef = thirdSlotDefs[slotIdx];
      for (var ti = 0; ti < best8.length; ti++) {
        var team = best8[ti];
        if (used[team]) continue;
        if (slotDef.groups.indexOf(teamGroup[team]) >= 0) {
          assignment[slotDef.idx + "_" + slotDef.side] = team;
          used[team] = true;
          if (backtrack(slotIdx + 1, used)) return true;
          // backtrack
          delete assignment[slotDef.idx + "_" + slotDef.side];
          used[team] = false;
        }
      }
      return false;
    }

    backtrack(0, {});

    // Build pairs
    var pairs = [];
    for (var pi = 0; pi < R32_SLOTS.length; pi++) {
      var pslot = R32_SLOTS[pi];
      var ta = pslot.a.type === "3rd"
        ? (assignment[pi + "_a"] || "Mejor 3ro")
        : resolveSlot(pslot.a, qualData.gRes, qualData.best8, {});
      var tb = pslot.b.type === "3rd"
        ? (assignment[pi + "_b"] || "Mejor 3ro")
        : resolveSlot(pslot.b, qualData.gRes, qualData.best8, {});
      pairs.push({a: ta, b: tb, label: pslot.label});
    }
    return pairs;
  }

  function getPairs(advKey, pairDefs, labels) {
    var adv = pred[advKey + "_adv"] || [];
    var result = [];
    for (var i = 0; i < pairDefs.length; i++) {
      result.push({a: adv[pairDefs[i][0]]||"TBD", b: adv[pairDefs[i][1]]||"TBD", label: labels ? labels[i] : ""+(i+1)});
    }
    return result;
  }

  function getFinalPair() {
    var a = pred["sf_adv"] || [];
    return {a: a[0]||"TBD", b: a[1]||"TBD"};
  }

  function setScore(g, i, side, val) {
    var v = val === "" ? "" : Math.max(0, parseInt(val) || 0);
    var key = g + "_" + i;
    setPred(function(prev) {
      var sc = Object.assign({}, prev.groupScores);
      sc[key] = Object.assign({}, sc[key] || {}, {[side]: v});
      var next = Object.assign({}, prev, {groupScores: sc});
      // auto-save draft immediately so progress is never lost
      if (props.currentUser) {
        var saved = props.parts.map(function(p) {
          if (p.id !== props.currentUser.id) return p;
          return Object.assign({}, p, {prediction: next, lastEditedAt: Date.now()});
        });
        props.saveParts(saved);
      }
      return next;
    });
  }

  function setWinner(round, idx, team) {
    var key = round + "_adv";
    var ri = KO_ROUNDS.indexOf(round);
    setPred(function(prev) {
      var cur = (prev[key] || []).slice();
      while (cur.length <= idx) cur.push(null);
      cur[idx] = team;
      var next = Object.assign({}, prev);
      next[key] = cur;
      for (var i = ri+1; i < KO_ROUNDS.length; i++) next[KO_ROUNDS[i]+"_adv"] = [];
      // auto-save draft
      if (props.currentUser) {
        var saved = props.parts.map(function(p) {
          if (p.id !== props.currentUser.id) return p;
          return Object.assign({}, p, {prediction: next, lastEditedAt: Date.now()});
        });
        props.saveParts(saved);
      }
      return next;
    });
  }

  function submit() {
    var updated = props.parts.map(function(p) {
      if (p.id !== props.currentUser.id) return p;
      var copy = Object.assign({}, p);
      copy.prediction = pred;
      copy.status = "pending";
      copy.submittedAt = p.submittedAt || Date.now();
      copy.lastEditedAt = Date.now();
      return copy;
    });
    props.saveParts(updated);
    setSubmitted(true); setEditing(false);
  }

  var noop = function() {};

  return (
    <div style={{...S.page, maxWidth:660}}>
      <BackBtn onClick={function() { props.setView("home"); }} />
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,marginBottom:8}}>
        <h2 style={{...S.h2, margin:0}}>{props.currentUser ? props.currentUser.name : ""}</h2>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {user && user.status==="approved" && !editing && <Pill text="Aprobado ✓" color="success" />}
          {user && user.status==="pending"  && !editing && <Pill text="Pendiente" color="warning" />}
          {editing && <Pill text="Editando…" color="info" />}
          {canEdit && isLocked && !editing && (
            <button onClick={function() { setEditing(true); }} style={{background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:6,cursor:"pointer",fontSize:13,padding:"6px 12px",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",minHeight:36}}>✏️ Editar</button>
          )}
        </div>
      </div>

      {pastDeadline && (
        <div style={{...S.danger,display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:18}}>🔒</span>
          <div><div style={{fontWeight:500,fontSize:13}}>Plazo vencido</div><div style={{fontSize:12,marginTop:2}}>El plazo para enviar venció el Dom 14 jun 11pm CT.</div></div>
        </div>
      )}
      {!pastDeadline && editClosed && user && user.isLate && submitted && (
        <div style={{...S.danger,display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:18}}>🔒</span>
          <div style={{fontSize:13}}>Los envíos tardíos no pueden editarse una vez enviados.</div>
        </div>
      )}
      {!pastDeadline && !editClosed && isLocked && !editing && (
        <div style={{...S.info,display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:18}}>ℹ️</span>
          <div style={{fontSize:13}}>Predicciones enviadas. Haz clic en Editar para actualizar antes del 11 jun 10am CT.</div>
        </div>
      )}
      {editing && (
        <div style={{...S.warn,display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:18}}>✏️</span>
          <div style={{fontSize:13}}>Modo edición — re-envía cuando termines. Tu estado volverá a pendiente.</div>
        </div>
      )}
      {!pastDeadline && tournamentStarted && !editClosed && !submitted && (
        <div style={{...S.warn,display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div style={{fontSize:13}}>Ingreso tardío (-{props.settings.penalty} pts). No podrás editar después de enviar. Cierra Dom 14 jun 11pm CT.</div>
        </div>
      )}

      <div style={{display:"flex",gap:5,flexWrap:"wrap",margin:"4px 0 16px"}}>
        {PRED_TABS.map(function(t) {
          return <TabBtn key={t} label={TAB_LABELS_MAP[t]} active={tab===t} onClick={function() { setTab(t); }} />;
        })}
      </div>

      {tab === "grupos" && <GroupsTab activeG={activeG} setActiveG={setActiveG} pred={pred} setScore={isLocked?noop:setScore} qualData={qualData} />}
      {tab === "r32"    && <BracketRound advKey="r32" pairs={buildR32Pairs()} pred={pred} setWinner={isLocked?noop:setWinner} locked={isLocked} hint="Selecciona el ganador de cada partido (emparejamientos oficiales FIFA)." />}
      {tab === "r16"    && <BracketRound advKey="r16" pairs={getPairs("r32", R16_PAIRS, ["M89","M90","M91","M92","M93","M94","M95","M96"])} pred={pred} setWinner={isLocked?noop:setWinner} locked={isLocked} hint="Selecciona el ganador de cada partido." />}
      {tab === "qf"     && <BracketRound advKey="qf"  pairs={getPairs("r16", QF_PAIRS,  ["M97","M98","M99","M100"])}                              pred={pred} setWinner={isLocked?noop:setWinner} locked={isLocked} hint="Completa la Ronda de 16 primero." />}
      {tab === "sf"     && <BracketRound advKey="sf"  pairs={getPairs("qf",  SF_PAIRS,  ["M101","M102"])}                                          pred={pred} setWinner={isLocked?noop:setWinner} locked={isLocked} hint="Completa los cuartos primero." />}
      {tab === "final"  && <FinalTab pair={getFinalPair()} pred={pred} setWinner={isLocked?noop:setWinner} locked={isLocked} />}

      <div style={{marginTop:20,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:16}}>
        {pastDeadline ? (
          <div style={{textAlign:"center"}}>
            <span style={{fontSize:28}}>🔒</span>
            <p style={{fontWeight:500,margin:"8px 0 4px"}}>Plazo vencido.</p>
            <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>El admin puede aprobar las quinielas enviadas.</p>
          </div>
        ) : isLocked && !canEdit ? (
          <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>{user&&user.status==="approved"?"✅ Aprobado.":"⏳ Esperando aprobación."} No se puede editar.</p>
        ) : isLocked ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>{user&&user.status==="approved"?"✅ Aprobado.":"⏳ Esperando aprobación."}</p>
            <Btn onClick={function() { setEditing(true); }}>✏️ Editar predicciones</Btn>
          </div>
        ) : editing ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <p style={{fontSize:13,color:"var(--color-text-warning)",margin:0,fontWeight:500}}>⚠️ Necesitará re-aprobación después de re-enviar.</p>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={function() { setPred(initPred); setEditing(false); }}>Cancelar</Btn>
              <Btn primary={true} onClick={submit}>Re-enviar</Btn>
            </div>
          </div>
        ) : (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <p style={{fontSize:13,color:tournamentStarted?"var(--color-text-warning)":"var(--color-text-secondary)",margin:0,fontWeight:tournamentStarted?500:400}}>
              {tournamentStarted ? "⚠️ Ingreso tardío (-"+props.settings.penalty+" pts). No podrás editar después de enviar." : "Completa la quiniela y envía para aprobación."}
            </p>
            <Btn primary={true} onClick={submit}>Enviar</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GROUPS TAB ───────────────────────────────────────────────────────────────

function GroupsTab(props) {
  var activeG = props.activeG;
  var fxs = GROUP_FIXTURES[activeG];
  var res = calcStandings(activeG, props.pred.groupScores || {});
  var sorted = res.sorted; var st = res.st;
  var gRes = props.qualData.gRes[activeG];
  var best8 = props.qualData.best8;
  var gkeys = Object.keys(GROUPS);

  return (
    <div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
        {gkeys.map(function(g) {
          var fixtures = GROUP_FIXTURES[g];
          var filled = 0;
          for (var fi = 0; fi < fixtures.length; fi++) {
            var sc = (props.pred.groupScores||{})[g+"_"+fi];
            if (sc && sc.h !== "" && sc.h !== undefined && sc.a !== "" && sc.a !== undefined) filled++;
          }
          var done = filled === fixtures.length;
          return (
            <button key={g} onClick={function() { props.setActiveG(g); }.bind(null,g)} style={{padding:"5px 10px",borderRadius:20,cursor:"pointer",fontSize:12,fontFamily:"var(--font-sans)",display:"flex",alignItems:"center",gap:5,border:activeG===g?"2px solid #1D4ED8":"0.5px solid var(--color-border-secondary)",background:activeG===g?"#DBEAFE":done?"#EAF3DE":"var(--color-background-primary)",color:activeG===g?"#1D4ED8":done?"#27500A":"var(--color-text-primary)",fontWeight:activeG===g?600:400,boxShadow:activeG===g?shadow:shadowSm}}>
              {activeG === g && <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#1D4ED8",flexShrink:0,marginRight:1}}/>}
              {done && activeG !== g && (
                <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",background:"#3B6D11",flexShrink:0}}>
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none"><path d="M1 3L2.8 5L6 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
              Grp {g}
            </button>
          );
        })}
      </div>

      <div style={{...S.card, marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Grupo {activeG} — posiciones</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{color:"var(--color-text-tertiary)"}}>
              {["","Equipo","PJ","G","E","P","GF","GC","DG","Pts",""].map(function(h, i) {
                return <th key={i} style={{textAlign:i===1?"left":"center",padding:"3px 0",fontWeight:400,width:i===0?22:i===1?"auto":24}}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map(function(t, i) {
              var s = st[t];
              var isQ = t === gRes.winner || t === gRes.runnerUp;
              var isB3 = best8.indexOf(t) >= 0;
              return (
                <tr key={t} style={{background:isQ?"#EAF3DE":isB3?"var(--color-background-info)":"transparent"}}>
                  <td style={{textAlign:"center",padding:"5px 0"}}>{isQ ? <GreenCheck /> : <EmptyCheck />}</td>
                  <td style={{padding:"5px 0",fontWeight:i<2?500:400,fontSize:13}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Fl team={t} size={16} />{t}</span>
                  </td>
                  <td style={{textAlign:"center"}}>{s.played}</td>
                  <td style={{textAlign:"center"}}>{s.w}</td>
                  <td style={{textAlign:"center"}}>{s.d}</td>
                  <td style={{textAlign:"center"}}>{s.l}</td>
                  <td style={{textAlign:"center"}}>{s.gf}</td>
                  <td style={{textAlign:"center"}}>{s.ga}</td>
                  <td style={{textAlign:"center"}}>{s.gd > 0 ? "+" + s.gd : s.gd}</td>
                  <td style={{textAlign:"center",fontWeight:500}}>{s.pts}</td>
                  <td style={{textAlign:"center"}}>
                    {isQ && <Pill text={i===0?"1ro":"2do"} color="success" />}
                    {!isQ && isB3 && <Pill text="Mejor 3ro" color="info" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginTop:8,display:"flex",gap:12}}>
          <span><span style={{display:"inline-block",width:10,height:10,background:"#EAF3DE",border:"1px solid #3B6D11",borderRadius:2,marginRight:4}}></span>Clasifica top 2</span>
          <span><span style={{display:"inline-block",width:10,height:10,background:"var(--color-background-info)",borderRadius:2,marginRight:4}}></span>Mejor 3ro</span>
        </div>
      </div>

      <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Marcadores predichos</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {fxs.map(function(match, i) {
          var key = activeG + "_" + i;
          var sc = (props.pred.groupScores || {})[key] || {};
          var day = i < 2 ? "J1" : i < 4 ? "J2" : "J3";
          var done = sc.h !== "" && sc.h !== undefined && sc.a !== "" && sc.a !== undefined;
          return (
            <div key={i} style={{...S.card, display:"flex", alignItems:"center", gap:8}}>
              <div style={{fontSize:11,color:"var(--color-text-tertiary)",minWidth:28}}>{day}</div>
              <div style={{flex:1,fontSize:12,fontWeight:500,textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:5,overflow:"hidden"}}>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{match[0]}</span>
                <Fl team={match[0]} size={15} />
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                <ScoreBox val={sc.h} onChange={function(v) { props.setScore(activeG, i, "h", v); }} />
                <span style={{color:"var(--color-text-tertiary)",fontWeight:500}}>–</span>
                <ScoreBox val={sc.a} onChange={function(v) { props.setScore(activeG, i, "a", v); }} />
              </div>
              <div style={{flex:1,fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:5,overflow:"hidden"}}>
                <Fl team={match[1]} size={15} />
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{match[1]}</span>
              </div>
              <div style={{flexShrink:0}}>{done ? <GreenCheck /> : <EmptyCheck />}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BRACKET ROUND ───────────────────────────────────────────────────────────

function BracketRound(props) {
  var adv = props.pred[props.advKey + "_adv"] || [];
  return (
    <div>
      <p style={S.hint}>{props.hint || "Haz clic en el ganador de cada partido."}</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {props.pairs.map(function(pair, i) {
          var tA = pair.a || "TBD";
          var tB = pair.b || "TBD";
          var w = adv[i] || null;
          return (
            <div key={i} style={{...S.card, display:"flex", alignItems:"center", gap:8}}>
              <div style={{fontSize:11,color:"var(--color-text-tertiary)",minWidth:36,textAlign:"center",fontWeight:500}}>{pair.label||i+1}</div>
              <TeamBtn team={tA} selected={w===tA} locked={props.locked} onClick={function() { if (tA !== "TBD" && !props.locked) props.setWinner(props.advKey, i, tA); }.bind(null,i,tA)} />
              <span style={{fontSize:12,color:"var(--color-text-tertiary)",flexShrink:0}}>vs</span>
              <TeamBtn team={tB} selected={w===tB} locked={props.locked} onClick={function() { if (tB !== "TBD" && !props.locked) props.setWinner(props.advKey, i, tB); }.bind(null,i,tB)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FinalTab(props) {
  var tA = props.pair.a || "TBD";
  var tB = props.pair.b || "TBD";
  var w = (props.pred["final_adv"] || [])[0] || null;
  return (
    <div>
      <p style={S.hint}>M104 · Elige tu campeón del Mundial.</p>
      <div style={S.card}>
        <div style={{textAlign:"center",fontSize:24,marginBottom:12}}>🏆</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <TeamBtn team={tA} selected={w===tA} big={true} locked={props.locked} onClick={function() { if (tA !== "TBD" && !props.locked) props.setWinner("final", 0, tA); }} />
          <span style={{fontSize:14,color:"var(--color-text-tertiary)",flexShrink:0}}>vs</span>
          <TeamBtn team={tB} selected={w===tB} big={true} locked={props.locked} onClick={function() { if (tB !== "TBD" && !props.locked) props.setWinner("final", 0, tB); }} />
        </div>
        {w && <div style={{textAlign:"center",marginTop:14,fontSize:15,fontWeight:500,color:"#27500A"}}>🥇 {w}</div>}
      </div>
    </div>
  );
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

function LeaderboardView(props) {
  var ap = props.scored.filter(function(p) { return p.status === "approved"; });
  var hasR = props.results && Object.keys(props.results).length > 0;
  return (
    <div style={S.page}>
      <BackBtn onClick={function() { props.setView("home"); }} />
      <h2 style={S.h2}>Tabla de posiciones</h2>
      <div style={{marginBottom:14}}><Btn onClick={function() { props.setView("dashboard"); }}>📊 Ver desglose por jugador</Btn></div>
      {!hasR && <div style={{...S.warn, marginBottom:14}}>El administrador aún no ha ingresado resultados.</div>}
      {ap.length === 0 && <p style={{color:"var(--color-text-secondary)"}}>Aún no hay participantes aprobados.</p>}
      {ap.map(function(p, i) {
        var medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":null;
        return (
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            <div style={{width:28,textAlign:"center",fontSize:i<3?18:14,color:i<3?"var(--color-text-warning)":"var(--color-text-tertiary)",flexShrink:0}}>{medal || ("#"+(i+1))}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:i===0?500:400}}>{p.name}</div>
              <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>
                {p.isLate ? "Tardío · " : ""}
                {p.submittedAt ? "Enviado " + new Date(p.submittedAt).toLocaleDateString("es-MX",{month:"short",day:"numeric"}) : ""}
              </div>
            </div>
            <div style={{fontWeight:500,fontSize:20,color:i===0?"var(--color-text-warning)":"var(--color-text-primary)"}}>{p.score}<span style={{fontSize:12,fontWeight:400,color:"var(--color-text-secondary)",marginLeft:2}}>pts</span></div>
          </div>
        );
      })}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function DashboardView(props) {
  var ap = props.scored.filter(function(p) { return p.status === "approved"; });
  var stSel = useState(ap.length > 0 ? ap[0].id : null);
  var sel = stSel[0]; var setSel = stSel[1];
  var hasR = props.results && Object.keys(props.results).length > 0;
  var player = null;
  for (var i = 0; i < ap.length; i++) { if (ap[i].id === sel) { player = ap[i]; break; } }
  var bd = player ? getBreakdown(player.prediction, props.results, props.settings.penalty, player.isLate) : null;
  var sections = [
    {key:"exactScores",label:"Marcadores exactos",icon:"🎯"},
    {key:"groupQualifiers",label:"Clasificados de grupo",icon:"🏟️"},
    {key:"best3rd",label:"Mejor 3ro",icon:"3️⃣"},
    {key:"r32",label:"Ronda de 32",icon:"⚽"},
    {key:"r16",label:"Ronda de 16",icon:"⚽"},
    {key:"qf",label:"Cuartos de final",icon:"⚽"},
    {key:"sf",label:"Semifinales",icon:"⚽"},
    {key:"final",label:"Final / Campeón",icon:"🏆"}
  ];
  return (
    <div style={{...S.page, maxWidth:640}}>
      <BackBtn onClick={function() { props.setView("home"); }} />
      <h2 style={S.h2}>Panel de jugadores</h2>
      {!hasR && <div style={{...S.warn, marginBottom:16}}>Resultados no ingresados aún.</div>}
      {ap.length === 0 && <p style={{color:"var(--color-text-secondary)"}}>Aún no hay participantes aprobados.</p>}
      {ap.length > 0 && (
        <div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
            {ap.map(function(p, i) {
              var medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"";
              return (
                <button key={p.id} onClick={function() { setSel(p.id); }.bind(null,p.id)} style={{padding:"6px 12px",borderRadius:20,cursor:"pointer",fontSize:13,fontFamily:"var(--font-sans)",fontWeight:sel===p.id?500:400,border:sel===p.id?"2px solid #3B6D11":"0.5px solid var(--color-border-secondary)",background:sel===p.id?"#EAF3DE":"var(--color-background-primary)",color:sel===p.id?"#27500A":"var(--color-text-primary)",boxShadow:shadow}}>
                  {medal} {p.name}
                </button>
              );
            })}
          </div>
          {player && bd && (
            <div>
              <div style={{...S.card, marginBottom:16, display:"flex", alignItems:"center", gap:16}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:18,fontWeight:500}}>{player.name}</div>
                  <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginTop:2}}>
                    {player.isLate ? "⚠️ Tardío · " : ""}
                    {player.submittedAt ? "Enviado " + new Date(player.submittedAt).toLocaleDateString("es-MX",{month:"short",day:"numeric"}) : ""}
                  </div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:36,fontWeight:500,lineHeight:1,color:"var(--color-text-warning)"}}>{bd.total}</div>
                  <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>total pts</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8,marginBottom:20}}>
                {sections.map(function(sec) {
                  var items = bd[sec.key] || [];
                  if (items.length === 0) return null;
                  var earned = 0;
                  for (var xi = 0; xi < items.length; xi++) earned += items[xi].pts;
                  var hits = 0;
                  for (var hi = 0; hi < items.length; hi++) { if (items[hi].hit) hits++; }
                  return (
                    <div key={sec.key} style={{...S.card, textAlign:"center", padding:"0.6rem 0.5rem"}}>
                      <div style={{fontSize:18}}>{sec.icon}</div>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)",margin:"3px 0"}}>{sec.label}</div>
                      <div style={{fontSize:18,fontWeight:500,color:earned>0?"#27500A":"var(--color-text-primary)"}}>{earned}</div>
                      <div style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{hits}/{items.length} correctos</div>
                    </div>
                  );
                })}
                {bd.penalty !== 0 && (
                  <div style={{...S.card, textAlign:"center", padding:"0.6rem 0.5rem"}}>
                    <div style={{fontSize:18}}>⚠️</div>
                    <div style={{fontSize:11,color:"var(--color-text-secondary)",margin:"3px 0"}}>Penalización tardío</div>
                    <div style={{fontSize:18,fontWeight:500,color:"var(--color-text-danger)"}}>{bd.penalty}</div>
                  </div>
                )}

              </div>
              {sections.map(function(sec) {
                var items = bd[sec.key] || [];
                if (items.length === 0) return null;
                var earned = 0;
                for (var xi = 0; xi < items.length; xi++) earned += items[xi].pts;
                return (
                  <div key={sec.key} style={{marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{fontSize:13,fontWeight:500}}>{sec.icon} {sec.label}</div>
                      <div style={{fontSize:13,fontWeight:500,color:earned>0?"#27500A":"var(--color-text-tertiary)"}}>+{earned} pts</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {items.map(function(item, idx) {
                        return (
                          <div key={idx} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,background:item.hit?"#EAF3DE":"var(--color-background-secondary)",border:"0.5px solid "+(item.hit?"#3B6D11":"var(--color-border-tertiary)")}}>
                            <span style={{fontSize:15,flexShrink:0}}>{item.hit ? "✅" : item.pending ? "⏳" : hasR ? "❌" : "⏳"}</span>
                            <span style={{display:"inline-flex",alignItems:"center",gap:5,flex:1,fontSize:12,color:item.hit?"#27500A":"var(--color-text-primary)"}}>
                              {item.home ? (
                                <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
                                  <Fl team={item.home} size={14} />{item.home} <strong>{item.score}</strong> <Fl team={item.away} size={14} />{item.away}
                                </span>
                              ) : (
                                <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
                                  <Fl team={item.team} size={14} />{item.label}
                                </span>
                              )}
                            </span>
                            <span style={{fontSize:12,fontWeight:500,color:item.hit?"#27500A":"var(--color-text-tertiary)",flexShrink:0}}>
                              {item.hit ? ("+" + item.pts + " pts") : item.pending ? "⏳" : hasR ? "0 pts" : "?"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* ── PRONOSTICO COMPLETO (acordeones compactos) ── */}
              <FullPredictionView prediction={player.prediction} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FULL PREDICTION VIEW ─────────────────────────────────────────────────────
// Compact collapsible sections showing the player's complete prediction
function FullPredictionView(props) {
  var pred = props.prediction || {};
  var stOpen = useState({});
  var open = stOpen[0]; var setOpen = stOpen[1];

  function toggle(k) {
    setOpen(function(prev) {
      var next = Object.assign({}, prev);
      next[k] = !prev[k];
      return next;
    });
  }

  var gkeys = Object.keys(GROUPS);

  // Build group scores summary per group
  var groupSections = gkeys.map(function(g) {
    var fxs = GROUP_FIXTURES[g];
    var rows = [];
    for (var fi = 0; fi < fxs.length; fi++) {
      var sc = (pred.groupScores || {})[g + "_" + fi];
      var day = fi < 2 ? "J1" : fi < 4 ? "J2" : "J3";
      rows.push({home: fxs[fi][0], away: fxs[fi][1], h: sc ? sc.h : "", a: sc ? sc.a : "", day: day});
    }
    var filled = rows.filter(function(r) { return r.h !== "" && r.h !== undefined; }).length;
    return {g: g, rows: rows, filled: filled};
  });

  // KO rounds
  var koSections = [
    {key:"r32_adv", label:"Ronda de 32", matches: R32_SLOTS.map(function(s) { return s.label; })},
    {key:"r16_adv", label:"Ronda de 16", matches: ["M89","M90","M91","M92","M93","M94","M95","M96"]},
    {key:"qf_adv",  label:"Cuartos de Final", matches: ["M97","M98","M99","M100"]},
    {key:"sf_adv",  label:"Semifinales", matches: ["M101","M102"]},
    {key:"final_adv", label:"Final — Campeón", matches: ["M104"]},
  ];

  function AccordionHeader(aProps) {
    var isOpen = open[aProps.id];
    return (
      <button onClick={function() { toggle(aProps.id); }} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:isOpen?"8px 8px 0 0":8,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",cursor:"pointer",fontFamily:"var(--font-sans)",marginBottom:isOpen?0:4}}>
        <span style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)"}}>{aProps.label}</span>
        <span style={{fontSize:11,color:"var(--color-text-tertiary)",display:"flex",alignItems:"center",gap:6}}>
          {aProps.badge && <span style={{background:"var(--color-background-primary)",borderRadius:10,padding:"1px 7px",fontSize:11}}>{aProps.badge}</span>}
          <span>{isOpen ? "▲" : "▼"}</span>
        </span>
      </button>
    );
  }

  return (
    <div style={{marginTop:20,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:16}}>
      <div style={{fontSize:13,fontWeight:500,marginBottom:10,color:"var(--color-text-secondary)"}}>📋 Pronóstico completo</div>

      {/* Groups — one accordion per group, shown in a 2-col grid */}
      <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-tertiary)",marginBottom:6,letterSpacing:"0.5px"}}>FASE DE GRUPOS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:12}}>
        {groupSections.map(function(gs) {
          var id = "grp-" + gs.g;
          var isOpen = open[id];
          return (
            <div key={gs.g}>
              <button onClick={function() { toggle(id); }} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",borderRadius:isOpen?"6px 6px 0 0":6,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>
                <span style={{fontSize:12,fontWeight:500}}>Grupo {gs.g}</span>
                <span style={{fontSize:10,color:"var(--color-text-tertiary)",display:"flex",alignItems:"center",gap:4}}>
                  <span style={{background:"var(--color-background-primary)",borderRadius:8,padding:"1px 5px"}}>{gs.filled}/6</span>
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {isOpen && (
                <div style={{border:"0.5px solid var(--color-border-secondary)",borderTop:"none",borderRadius:"0 0 6px 6px",padding:"6px 8px",background:"var(--color-background-primary)"}}>
                  {gs.rows.map(function(r, ri) {
                    var hasScore = r.h !== "" && r.h !== undefined;
                    return (
                      <div key={ri} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 0",borderBottom:ri<5?"0.5px solid var(--color-border-tertiary)":"none"}}>
                        <span style={{fontSize:9,color:"var(--color-text-tertiary)",minWidth:14}}>{r.day}</span>
                        <Fl team={r.home} size={11} />
                        <span style={{flex:1,fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.home}</span>
                        <span style={{fontSize:11,fontWeight:600,color:hasScore?"var(--color-text-primary)":"var(--color-text-tertiary)",minWidth:28,textAlign:"center"}}>
                          {hasScore ? r.h + "-" + r.a : "—"}
                        </span>
                        <span style={{flex:1,fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"}}>{r.away}</span>
                        <Fl team={r.away} size={11} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* KO rounds — one accordion each */}
      <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-tertiary)",marginBottom:6,letterSpacing:"0.5px"}}>ELIMINATORIAS</div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {koSections.map(function(rd) {
          var adv = pred[rd.key] || [];
          var filled = adv.filter(function(t) { return t && t !== "TBD"; }).length;
          var id = "ko-" + rd.key;
          var isOpen = open[id];
          return (
            <div key={rd.key}>
              <button onClick={function() { toggle(id); }} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:isOpen?"8px 8px 0 0":8,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>
                <span style={{fontSize:12,fontWeight:500}}>{rd.label}</span>
                <span style={{fontSize:10,color:"var(--color-text-tertiary)",display:"flex",alignItems:"center",gap:4}}>
                  <span style={{background:"var(--color-background-primary)",borderRadius:8,padding:"1px 5px"}}>{filled}/{rd.matches.length}</span>
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {isOpen && (
                <div style={{border:"0.5px solid var(--color-border-secondary)",borderTop:"none",borderRadius:"0 0 8px 8px",padding:"8px 10px",background:"var(--color-background-primary)"}}>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {rd.matches.map(function(m, mi) {
                      var team = adv[mi];
                      var hasTeam = team && team !== "TBD";
                      return (
                        <div key={mi} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 6px",borderRadius:6,background:hasTeam?"var(--color-background-secondary)":"transparent"}}>
                          <span style={{fontSize:10,color:"var(--color-text-tertiary)",minWidth:32,fontWeight:500}}>{m}</span>
                          {hasTeam ? (
                            <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12}}>
                              <Fl team={team} size={13} />{team}
                            </span>
                          ) : (
                            <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>— sin selección</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────

function AdminView(props) {
  var stPw  = useState(""); var pw = stPw[0]; var setPw = stPw[1];
  var stTab = useState("approvals"); var tab = stTab[0]; var setTab = stTab[1];
  var stLR  = useState(props.results || {}); var lRes = stLR[0]; var setLRes = stLR[1];
  var stLS  = useState(props.settings); var lSet = stLS[0]; var setLSet = stLS[1];
  var stSav = useState(false); var saving = stSav[0]; var setSaving = stSav[1];
  var stMsg = useState(""); var msg = stMsg[0]; var setMsg = stMsg[1];
  var stAG  = useState("A"); var activeG = stAG[0]; var setActiveG = stAG[1];

  function flash(m) { setMsg(m); setTimeout(function() { setMsg(""); }, 2500); }

  function saveAll() {
    setSaving(true);
    props.saveResults(lRes);
    props.saveSettings(lSet);
    setSaving(false);
    flash("Guardado ✓");
  }

  function approve(id) {
    var updated = props.parts.map(function(p) {
      if (p.id === id) return Object.assign({}, p, {status:"approved"});
      return p;
    });
    props.saveParts(updated);
    flash("¡Aprobado!");
  }

  function rejectP(id) {
    props.saveParts(props.parts.map(function(p) {
      return p.id === id ? Object.assign({}, p, {status:"rejected"}) : p;
    }));
  }

  function removeP(id) {
    if (!window.confirm("¿Eliminar este participante?")) return;
    props.saveParts(props.parts.filter(function(p) { return p.id !== id; }));
  }

  function resetF(id) {
    if (!window.confirm("¿Borrar el pronóstico? El participante tendrá que re-enviarlo.")) return;
    props.saveParts(props.parts.map(function(p) {
      if (p.id !== id) return p;
      return Object.assign({}, p, {prediction:{groupScores:{}},status:"draft",submittedAt:null,lastEditedAt:null});
    }));
    flash("Pronóstico borrado.");
  }

  var aQ = useMemo(function() {
    return computeQualifiers(lRes.groupScores || {});
  }, [lRes.groupScores]);

  // ── FIX: capture activeG at call time via closure parameter ──
  function setAScore(g, i, side, val) {
    var v = val === "" ? "" : Math.max(0, parseInt(val) || 0);
    var key = g + "_" + i;
    setLRes(function(prev) {
      var sc = Object.assign({}, prev.groupScores || {});
      sc[key] = Object.assign({}, sc[key] || {}, {[side]: v});
      return Object.assign({}, prev, {groupScores: sc});
    });
  }

  function setAKO(rd, idx, team) {
    var key = rd + "_adv";
    var ri = KO_ROUNDS.indexOf(rd);
    setLRes(function(prev) {
      var cur = (prev[key] || []).slice();
      while (cur.length <= idx) cur.push(null);
      cur[idx] = team;
      var next = Object.assign({}, prev);
      next[key] = cur;
      for (var i = ri+1; i < KO_ROUNDS.length; i++) next[KO_ROUNDS[i]+"_adv"] = [];
      return next;
    });
  }

  function exportCSV() {
    var approved = props.parts.filter(function(p) { return p.status==="approved"||p.status==="pending"; });
    if (approved.length === 0) { alert("No hay participantes para exportar."); return; }
    var rows = [];
    var nameRow = ["Sección","Detalle"];
    for (var ni = 0; ni < approved.length; ni++) nameRow.push(approved[ni].name + (approved[ni].isLate?" ⚠️":""));
    rows.push(nameRow);
    var statusRow = ["","Estado"];
    for (var si = 0; si < approved.length; si++) statusRow.push(approved[si].status==="approved"?"Aprobado":"Pendiente");
    rows.push(statusRow);
    var dateRow = ["","Enviado"];
    for (var di = 0; di < approved.length; di++) dateRow.push(approved[di].submittedAt ? new Date(approved[di].submittedAt).toLocaleDateString("es-MX") : "-");
    rows.push(dateRow);
    rows.push(["",""]);
    rows.push(["FASE DE GRUPOS - MARCADORES",""]);
    var gkeys = Object.keys(GROUPS);
    for (var gi = 0; gi < gkeys.length; gi++) {
      var g = gkeys[gi];
      rows.push(["Grupo "+g,""]);
      var fxs = GROUP_FIXTURES[g];
      for (var fi = 0; fi < fxs.length; fi++) {
        var matchRow = ["", fxs[fi][0]+" vs "+fxs[fi][1]];
        for (var pi = 0; pi < approved.length; pi++) {
          var sc = (approved[pi].prediction&&approved[pi].prediction.groupScores||{})[g+"_"+fi];
          matchRow.push(sc&&sc.h!==""&&sc.h!==undefined ? "\t"+sc.h+"-"+sc.a : "-");
        }
        rows.push(matchRow);
      }
    }
    rows.push(["",""]);
    rows.push(["CLASIFICADOS DE GRUPO",""]);
    for (var gi2 = 0; gi2 < gkeys.length; gi2++) {
      var g2 = gkeys[gi2];
      var qualRow = ["Grupo "+g2,"1ro / 2do"];
      for (var pi2 = 0; pi2 < approved.length; pi2++) {
        var pQ = computeQualifiers(approved[pi2].prediction&&approved[pi2].prediction.groupScores||{});
        qualRow.push((pQ.gRes[g2]&&pQ.gRes[g2].winner||"-")+" / "+(pQ.gRes[g2]&&pQ.gRes[g2].runnerUp||"-"));
      }
      rows.push(qualRow);
    }
    rows.push(["",""]);
    var koSecs = [
      {key:"r32",label:"RONDA DE 32",count:16},{key:"r16",label:"RONDA DE 16",count:8},
      {key:"qf",label:"CUARTOS DE FINAL",count:4},{key:"sf",label:"SEMIFINALES",count:2},{key:"final",label:"FINAL / CAMPEÓN",count:1}
    ];
    for (var rdi = 0; rdi < koSecs.length; rdi++) {
      var rd = koSecs[rdi];
      rows.push([rd.label,""]);
      for (var mi = 0; mi < rd.count; mi++) {
        var mRow = ["","Partido "+(mi+1)];
        for (var mpi = 0; mpi < approved.length; mpi++) {
          var adv = (approved[mpi].prediction||{})[rd.key+"_adv"]||[];
          mRow.push(adv[mi]||"-");
        }
        rows.push(mRow);
      }
      rows.push(["",""]);
    }
    var csv = "";
    for (var rowi = 0; rowi < rows.length; rowi++) {
      var cols = [];
      for (var ci = 0; ci < rows[rowi].length; ci++) {
        var cell = String(rows[rowi][ci] == null ? "" : rows[rowi][ci]);
        if (cell.indexOf(",") >= 0 || cell.indexOf('"') >= 0) cell = '"' + cell.replace(/"/g,'""') + '"';
        cols.push(cell);
      }
      csv += cols.join(",") + "\n";
    }
    var blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8;"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "quiniela_mundial_2026_" + new Date().toISOString().slice(0,10) + ".csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  if (!props.adminUnlocked) {
    return (
      <div style={S.page}>
        <BackBtn onClick={function() { props.setView("home"); }} />
        <h2 style={S.h2}>Panel de administrador</h2>
        <input type="password" placeholder="Contraseña" value={pw} onChange={function(e) { setPw(e.target.value); }} onKeyDown={function(e) { if (e.key==="Enter"&&pw===ADMIN_PW) props.setAdminUnlocked(true); }} style={{width:"100%",boxSizing:"border-box",marginTop:8,fontSize:16}} />
        <div style={{marginTop:12}}><Btn primary={true} onClick={function() { if(pw===ADMIN_PW) props.setAdminUnlocked(true); else alert("Contraseña incorrecta"); }}>Desbloquear</Btn></div>

      </div>
    );
  }

  var pending  = props.parts.filter(function(p) { return p.status === "pending"; });
  var approved = props.parts.filter(function(p) { return p.status === "approved"; });
  var tabLabels = {approvals:"Aprobaciones","group results":"Resultados grupo",knockout:"Eliminatorias",settings:"Ajustes"};

  return (
    <div style={{...S.page, maxWidth:660}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <BackBtn onClick={function() { props.setView("home"); }} />
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {msg && <span style={{fontSize:13,color:"var(--color-text-success)"}}>{msg}</span>}
          <button onClick={exportCSV} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",minHeight:44,borderRadius:10,cursor:"pointer",fontSize:13,fontFamily:"var(--font-sans)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",boxShadow:shadow}}>📥 Exportar CSV</button>
          <Btn primary={true} onClick={saveAll}>{saving?"Guardando…":"Guardar resultados"}</Btn>
        </div>
      </div>
      <h2 style={{...S.h2, marginTop:0}}>Panel de administrador</h2>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {["approvals","group results","knockout","settings"].map(function(t) {
          return <TabBtn key={t} label={tabLabels[t]} active={tab===t} onClick={function() { setTab(t); }.bind(null,t)} />;
        })}
      </div>

      {tab === "approvals" && (
        <div>
          {pending.length === 0 && <p style={{color:"var(--color-text-secondary)",fontSize:14}}>No hay envíos pendientes.</p>}
          {pending.map(function(p) {
            return (
              <div key={p.id} style={{...S.card, display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:15}}>{p.name}</div>
                  <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>
                    {p.isLate?"⚠️ Tardío · ":""}
                    {p.submittedAt ? new Date(p.submittedAt).toLocaleString("es-MX",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : "—"}
                  </div>
                </div>
                <Btn primary={true} onClick={function() { approve(p.id); }.bind(null,p.id)}>Aprobar</Btn>
                <Btn onClick={function() { rejectP(p.id); }.bind(null,p.id)}>Rechazar</Btn>
                <button onClick={function() { resetF(p.id); }.bind(null,p.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,padding:"0 4px"}}>🗑️</button>
              </div>
            );
          })}
          {approved.length > 0 && (
            <div>
              <div style={{fontWeight:500,fontSize:14,marginTop:16,marginBottom:8}}>Aprobados ({approved.length})</div>
              {approved.map(function(p) {
                return (
                  <div key={p.id} style={{borderBottom:"0.5px solid var(--color-border-tertiary)",padding:"8px 0"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Pill text="✓" color="success" />
                      <div style={{flex:1,fontSize:14}}>{p.name}{p.isLate?" ⚠️":""}</div>

                      <button onClick={function() { resetF(p.id); }.bind(null,p.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--color-text-secondary)",padding:0}}>🗑️ Borrar</button>
                      <button onClick={function() { removeP(p.id); }.bind(null,p.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--color-text-danger)",padding:0}}>Eliminar</button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
          <AdminDraftList parts={props.parts} removeP={removeP} resetF={resetF} />
        </div>
      )}

      {tab === "group results" && (
        <AdminGroupResults
          activeG={activeG}
          setActiveG={setActiveG}
          lRes={lRes}
          aQ={aQ}
          setAScore={setAScore}
        />
      )}

      {tab === "knockout" && (
        <div>
          <div style={{fontWeight:500,fontSize:14,marginBottom:8}}>Ronda de 32 (emparejamientos FIFA oficiales)</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {(function() {
              // Backtracking assignment for best8 -> 3rd slots
              var gkeys2 = Object.keys(GROUPS);
              var teamGrp2 = {};
              for (var gi2 = 0; gi2 < gkeys2.length; gi2++) {
                var gk2 = gkeys2[gi2];
                for (var ti2 = 0; ti2 < GROUPS[gk2].length; ti2++) teamGrp2[GROUPS[gk2][ti2]] = gk2;
              }
              var thirdSlots2 = [];
              for (var si2 = 0; si2 < R32_SLOTS.length; si2++) {
                var sl2 = R32_SLOTS[si2];
                if (sl2.a.type === "3rd") thirdSlots2.push({idx:si2,side:"a",groups:sl2.a.gs.split("/")});
                if (sl2.b.type === "3rd") thirdSlots2.push({idx:si2,side:"b",groups:sl2.b.gs.split("/")});
              }
              var asgn2 = {};
              function bt2(si, used) {
                if (si === thirdSlots2.length) return true;
                var sd = thirdSlots2[si];
                for (var ti = 0; ti < aQ.best8.length; ti++) {
                  var tm = aQ.best8[ti];
                  if (used[tm]) continue;
                  if (sd.groups.indexOf(teamGrp2[tm]) >= 0) {
                    asgn2[sd.idx+"_"+sd.side] = tm; used[tm] = true;
                    if (bt2(si+1, used)) return true;
                    delete asgn2[sd.idx+"_"+sd.side]; used[tm] = false;
                  }
                }
                return false;
              }
              bt2(0, {});
              return R32_SLOTS.map(function(slot, i) {
                var tA = slot.a.type==="3rd" ? (asgn2[i+"_a"]||"Mejor 3ro") : resolveSlot(slot.a, aQ.gRes, aQ.best8, {});
                var tB = slot.b.type==="3rd" ? (asgn2[i+"_b"]||"Mejor 3ro") : resolveSlot(slot.b, aQ.gRes, aQ.best8, {});
                var w = (lRes["r32_adv"]||[])[i]||null;
                return (
                  <div key={i} style={{...S.card, display:"flex", alignItems:"center", gap:8}}>
                    <div style={{fontSize:11,color:"var(--color-text-tertiary)",minWidth:36,textAlign:"center",fontWeight:500}}>{slot.label}</div>
                    <TeamBtn team={tA} selected={w===tA} onClick={function() { if(tA!=="TBD") setAKO("r32",i,tA); }.bind(null,i,tA)} />
                    <span style={{fontSize:12,color:"var(--color-text-tertiary)",flexShrink:0}}>vs</span>
                    <TeamBtn team={tB} selected={w===tB} onClick={function() { if(tB!=="TBD") setAKO("r32",i,tB); }.bind(null,i,tB)} />
                  </div>
                );
              });
            })()}
          </div>
          {[
            {title:"Ronda de 16",pairs:R16_PAIRS,advKey:"r16",srcKey:"r32",labels:["M89","M90","M91","M92","M93","M94","M95","M96"]},
            {title:"Cuartos de final",pairs:QF_PAIRS,advKey:"qf",srcKey:"r16",labels:["M97","M98","M99","M100"]},
            {title:"Semifinales",pairs:SF_PAIRS,advKey:"sf",srcKey:"qf",labels:["M101","M102"]}
          ].map(function(rd) {
            var srcAdv = lRes[rd.srcKey+"_adv"]||[];
            var adv = lRes[rd.advKey+"_adv"]||[];
            return (
              <div key={rd.title} style={{marginBottom:20}}>
                <div style={{fontWeight:500,fontSize:14,marginBottom:8}}>{rd.title}</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {rd.pairs.map(function(pair, i) {
                    var tA = srcAdv[pair[0]]||"TBD";
                    var tB = srcAdv[pair[1]]||"TBD";
                    var w = adv[i]||null;
                    return (
                      <div key={i} style={{...S.card, display:"flex", alignItems:"center", gap:8}}>
                        <div style={{fontSize:11,color:"var(--color-text-tertiary)",minWidth:36,textAlign:"center",fontWeight:500}}>{rd.labels ? rd.labels[i] : (i+1)}</div>
                        <TeamBtn team={tA} selected={w===tA} onClick={function() { if(tA!=="TBD") setAKO(rd.advKey,i,tA); }.bind(null,i,tA)} />
                        <span style={{fontSize:12,color:"var(--color-text-tertiary)",flexShrink:0}}>vs</span>
                        <TeamBtn team={tB} selected={w===tB} onClick={function() { if(tB!=="TBD") setAKO(rd.advKey,i,tB); }.bind(null,i,tB)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <AdminFinal lRes={lRes} setAKO={setAKO} />
        </div>
      )}

      {tab === "settings" && (
        <div style={S.card}>
          <div style={{fontWeight:500,marginBottom:12}}>Penalización por ingreso tardío</div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <label style={{fontSize:14,flex:1}}>La fase de grupos ha comenzado</label>
            <input type="checkbox" checked={lSet.lateDeadlinePassed} onChange={function(e) { setLSet(Object.assign({},lSet,{lateDeadlinePassed:e.target.checked})); }} style={{width:18,height:18,cursor:"pointer"}} />
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <label style={{fontSize:14,flex:1}}>Penalización (puntos negativos)</label>
            <input type="number" min={0} value={lSet.penalty} onChange={function(e) { setLSet(Object.assign({},lSet,{penalty:parseInt(e.target.value)||0})); }} style={{width:70,textAlign:"center",fontSize:16}} />
          </div>
          <div style={{marginTop:16,padding:"10px 12px",borderRadius:8,background:"var(--color-background-secondary)",fontSize:12,color:"var(--color-text-secondary)"}}>
            <div style={{fontWeight:500,marginBottom:4,color:"var(--color-text-primary)"}}>Fechas límite automáticas</div>
            <div>🔒 Edición cierra: <strong>11 jun 2026, 10am CT</strong></div>
            <div>📅 Último envío tardío: <strong>14 jun 2026, 11pm CT</strong></div>
            <div style={{marginTop:4,fontSize:11}}>Los envíos tardíos no pueden editarse una vez enviados.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BONUS INPUT ──────────────────────────────────────────────────────────────
// Uses local state so user can type freely; saves on blur or Enter
function BonusInput(props) {
  var stV = useState(String(props.value || 0));
  var local = stV[0]; var setLocal = stV[1];

  useEffect(function() {
    setLocal(String(props.value || 0));
  }, [props.value]);

  function commit(raw) {
    if (raw === "" || raw === "-") { setLocal(raw); return; }
    var n = parseInt(raw);
    if (isNaN(n)) n = 0;
    // clamp to reasonable range
    if (n > 999) n = 999;
    if (n < -999) n = -999;
    setLocal(String(n));
    props.onChange(n);
  }

  return (
    <input
      type="number"
      value={local}
      min={-999} max={999}
      onChange={function(e) { setLocal(e.target.value); }}
      onBlur={function(e) { commit(e.target.value); }}
      onKeyDown={function(e) { if (e.key === "Enter") commit(e.target.value); }}
      onFocus={function(e) { e.target.select(); }}
      style={{width:60,textAlign:"center",fontSize:13,borderRadius:6,border:"0.5px solid var(--color-border-secondary)",padding:"3px 4px",fontFamily:"var(--font-sans)",outline:"none"}}
    />
  );
}

// ─── ADMIN DRAFT LIST ─────────────────────────────────────────────────────────
// Shows participants who have started but NOT yet submitted (status === "draft")
// Admin can see their partial progress and delete if needed.
function AdminDraftList(props) {
  var drafts = props.parts.filter(function(p) { return p.status === "draft"; });
  var stExp = useState(null); var expanded = stExp[0]; var setExpanded = stExp[1];
  if (drafts.length === 0) return null;

  function countFilled(pred) {
    var total = 0;
    var gkeys = Object.keys(GROUPS);
    for (var gi = 0; gi < gkeys.length; gi++) {
      var g = gkeys[gi];
      var fxs = GROUP_FIXTURES[g];
      for (var fi = 0; fi < fxs.length; fi++) {
        var sc = (pred.groupScores||{})[g+"_"+fi];
        if (sc && sc.h !== "" && sc.h !== undefined && sc.a !== "" && sc.a !== undefined) total++;
      }
    }
    return total;
  }

  var totalMatches = 72; // 12 groups × 6 fixtures

  return (
    <div style={{marginTop:20}}>
      <div style={{fontWeight:500,fontSize:14,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
        <span>En progreso — sin enviar ({drafts.length})</span>
        <Pill text="Draft" color="warning" />
      </div>
      {drafts.map(function(p) {
        var filled = countFilled(p.prediction || {});
        var pct = Math.round(filled / totalMatches * 100);
        var isExp = expanded === p.id;
        var gkeys = Object.keys(GROUPS);
        return (
          <div key={p.id} style={{...S.card, marginBottom:8, padding:"10px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                  {p.name}
                  {p.isLate && <Pill text="Tardío" color="warning" />}
                </div>
                <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginTop:3}}>
                  {filled} / {totalMatches} marcadores · {pct}% completado
                  {p.lastEditedAt ? " · Editado " + new Date(p.lastEditedAt).toLocaleString("es-MX",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : ""}
                </div>
                <div style={{marginTop:6,height:5,background:"var(--color-border-tertiary)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:pct+"%",background:pct===100?"#3B6D11":"#1D4ED8",borderRadius:3,transition:"width 0.3s"}}/>
                </div>
              </div>
              <button onClick={function() { setExpanded(isExp ? null : p.id); }} style={{background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:6,cursor:"pointer",fontSize:12,padding:"5px 10px",color:"var(--color-text-secondary)",fontFamily:"var(--font-sans)"}}>
                {isExp ? "Ocultar" : "Ver avance"}
              </button>
              <button onClick={function() { props.removeP(p.id); }.bind(null,p.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--color-text-danger)",padding:0}}>Eliminar</button>
            </div>
            {isExp && (
              <div style={{marginTop:12,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:10}}>
                <div style={{fontSize:12,fontWeight:500,marginBottom:8,color:"var(--color-text-secondary)"}}>Marcadores ingresados:</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:4}}>
                  {gkeys.map(function(g) {
                    var fxs = GROUP_FIXTURES[g];
                    var groupFilled = [];
                    for (var fi = 0; fi < fxs.length; fi++) {
                      var sc = ((p.prediction||{}).groupScores||{})[g+"_"+fi];
                      if (sc && sc.h !== "" && sc.h !== undefined && sc.a !== "" && sc.a !== undefined) {
                        groupFilled.push(fxs[fi][0]+" "+sc.h+"-"+sc.a+" "+fxs[fi][1]);
                      }
                    }
                    if (groupFilled.length === 0) return null;
                    return groupFilled.map(function(line, li) {
                      return (
                        <div key={g+li} style={{fontSize:11,padding:"3px 6px",borderRadius:4,background:"#EAF3DE",color:"#27500A"}}>
                          <strong>G{g}</strong> {line}
                        </div>
                      );
                    });
                  })}
                </div>
                {filled === 0 && <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Ningún marcador ingresado aún.</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ADMIN GROUP RESULTS (extracted to fix closure/stale-state bug) ───────────
// By extracting this into its own component, activeG and lRes are always fresh
// props — no stale closure over the outer AdminView render cycle.
function AdminGroupResults(props) {
  var activeG = props.activeG;
  var lRes = props.lRes;
  var aQ = props.aQ;

  var standingsData = calcStandings(activeG, lRes.groupScores || {});

  return (
    <div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
        {Object.keys(GROUPS).map(function(g) {
          var fxs = GROUP_FIXTURES[g];
          var filled = 0;
          for (var fi = 0; fi < fxs.length; fi++) {
            var sc = (lRes.groupScores||{})[g+"_"+fi];
            if (sc && sc.h !== "" && sc.h !== undefined && sc.a !== "" && sc.a !== undefined) filled++;
          }
          var done = filled === fxs.length;
          var isActive = activeG === g;
          return (
            <button key={g} onClick={function() { props.setActiveG(g); }.bind(null,g)}
              style={{padding:"5px 10px",borderRadius:20,cursor:"pointer",fontSize:12,fontFamily:"var(--font-sans)",display:"flex",alignItems:"center",gap:5,
                border:isActive?"2px solid #1D4ED8":"0.5px solid var(--color-border-secondary)",
                background:isActive?"#DBEAFE":done?"#EAF3DE":"var(--color-background-primary)",
                color:isActive?"#1D4ED8":done?"#27500A":"var(--color-text-primary)",
                fontWeight:isActive?600:400,boxShadow:isActive?shadow:shadowSm}}>
              {isActive && <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#1D4ED8",flexShrink:0}}/>}
              {done && !isActive && (
                <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",background:"#3B6D11",flexShrink:0}}>
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none"><path d="M1 3L2.8 5L6 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
              Grp {g}
            </button>
          );
        })}
      </div>
      <div style={{...S.card, marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:6}}>Grupo {activeG} — posiciones en vivo</div>
        {standingsData.sorted.map(function(t, i) {
          var isQ = t===aQ.gRes[activeG].winner || t===aQ.gRes[activeG].runnerUp;
          var isB3 = aQ.best8.indexOf(t) >= 0;
          var pts = standingsData.st[t].pts;
          return (
            <div key={t} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
              <div style={{flexShrink:0}}>{isQ ? <GreenCheck /> : <EmptyCheck />}</div>
              <div style={{flex:1,fontSize:13,fontWeight:isQ?500:400,display:"inline-flex",alignItems:"center",gap:6}}><Fl team={t} size={15} />{t}</div>
              <div style={{fontSize:12,color:"var(--color-text-tertiary)",minWidth:36}}>{pts} pts</div>
              {isQ && <Pill text={i===0?"1ro":"2do"} color="success" />}
              {!isQ && isB3 && <Pill text="Mejor 3ro" color="info" />}
            </div>
          );
        })}
      </div>
      {GROUP_FIXTURES[activeG].map(function(match, i) {
        var key = activeG+"_"+i;
        var sc = (lRes.groupScores||{})[key]||{};
        var day = i<2?"J1":i<4?"J2":"J3";
        var done = sc.h!==""&&sc.h!==undefined&&sc.a!==""&&sc.a!==undefined;
        // capture g and i explicitly for the onChange closures
        var capturedG = activeG;
        var capturedI = i;
        return (
          <div key={i} style={{...S.card, display:"flex", alignItems:"center", gap:8, marginBottom:8}}>
            <div style={{fontSize:11,color:"var(--color-text-tertiary)",minWidth:28}}>{day}</div>
            <div style={{flex:1,fontSize:12,fontWeight:500,textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:5,overflow:"hidden"}}>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{match[0]}</span><Fl team={match[0]} size={15} />
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
              <ScoreBox
                val={sc.h}
                onChange={function(v) { props.setAScore(capturedG, capturedI, "h", v); }}
              />
              <span style={{color:"var(--color-text-tertiary)"}}>–</span>
              <ScoreBox
                val={sc.a}
                onChange={function(v) { props.setAScore(capturedG, capturedI, "a", v); }}
              />
            </div>
            <div style={{flex:1,fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:5,overflow:"hidden"}}>
              <Fl team={match[1]} size={15} /><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{match[1]}</span>
            </div>
            <div style={{flexShrink:0}}>{done ? <GreenCheck /> : <EmptyCheck />}</div>
          </div>
        );
      })}
    </div>
  );
}

function AdminFinal(props) {
  var sfAdv = props.lRes["sf_adv"] || [];
  var tA = sfAdv[0] || "TBD";
  var tB = sfAdv[1] || "TBD";
  var w = (props.lRes["final_adv"] || [])[0] || null;
  return (
    <div>
      <div style={{fontWeight:500,fontSize:14,marginBottom:8}}>Final</div>
      <div style={{...S.card, display:"flex", alignItems:"center", gap:8}}>
        <div style={{fontSize:18,flexShrink:0}}>🏆</div>
        <TeamBtn team={tA} selected={w===tA} big={true} onClick={function() { if(tA!=="TBD") props.setAKO("final",0,tA); }} />
        <span style={{fontSize:12,color:"var(--color-text-tertiary)",flexShrink:0}}>vs</span>
        <TeamBtn team={tB} selected={w===tB} big={true} onClick={function() { if(tB!=="TBD") props.setAKO("final",0,tB); }} />
      </div>
    </div>
  );
}
