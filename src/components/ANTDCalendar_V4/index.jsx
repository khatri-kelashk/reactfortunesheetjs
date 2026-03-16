import React, { useState, useRef, useEffect } from "react";
import { Avatar, Button, Tooltip } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  DownOutlined,
  CheckOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const HOUR_WIDTH      = 64;   // px per hour column
const DAY_LABEL_W     = 110;  // px — fixed width for each "day name+number" label column
const ROW_HEIGHT      = 52;   // px per user row
const LEFT_PANEL_W    = 200;  // px — left sidebar
const HEADER_TOP_H    = 56;   // px — toolbar
const DAY_HEADER_H    = 64;   // px — sticky day-name + date row
const HOUR_TICK_H     = 22;   // px — sticky hour-tick row
const STICKY_TOP_H    = DAY_HEADER_H + HOUR_TICK_H; // total sticky header height

const HOURS     = Array.from({ length: 24 }, (_, i) => i);
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sat", "Sun"];

const USERS = [
  { id: 1, name: "Andrea Cuthbertson", color: "#f87fb1" },
  { id: 2, name: "Arbor Brain",         color: "#a8d8a8" },
  { id: 3, name: "Barry Richards",      color: "#f7c873" },
  { id: 4, name: "Cynthia Smith",       color: "#f4a0c8" },
  { id: 5, name: "Dave Miller",         color: "#ffe066" },
  { id: 6, name: "Deborah Cohen",       color: "#a0c4ff" },
  { id: 7, name: "Fred Scuttle",        color: "#b5ead7" },
];

// dayIndex: 0=Mon … 6=Sun
const EVENTS = [
  {
    id: 1, userId: 1, dayIndex: 1,
    title: "Design for new shoppin...",
    startHour: 18, endHour: 19.5,
    color: "#FF5FA0",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    label: "18:30",
  },
  {
    id: 2, userId: 2, dayIndex: 1,
    title: "New Images for Each Regional Office",
    startHour: 11, endHour: 23.9,
    color: "#FF5FA0",
    badges: ["#e63946","#457b9d","#2a9d8f","#e9c46a","#f4a261","#264653"],
    count: "3", hasLink: true,
  },
  {
    id: 3, userId: 3, dayIndex: 1,
    title: "NA, New product launch asset",
    startHour: 11, endHour: 19,
    color: "#b57bee",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    avatarBg: "#7b2d8b", avatarInitials: "NA",
  },
  {
    id: 4, userId: 4, dayIndex: 2,
    title: "Website content",
    startHour: 11, endHour: 16,
    color: "#FF7EB3",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
  },
  {
    id: 5, userId: 6, dayIndex: 2,
    title: "Japanese Launch Assets",
    startHour: 11, endHour: 23.9,
    color: "#52b788",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    count: "8", hasLink: true,
    avatarBg: "#2d6a4f", avatarInitials: "JL",
  },
  {
    id: 6, userId: 7, dayIndex: 2,
    title: "Sales video update - Forms v2...",
    startHour: 11, endHour: 16,
    color: "#FF7EB3",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    avatarBg: "#7b3f00", avatarInitials: "SV",
  },
  {
    id: 7, userId: 5, dayIndex: 4,
    title: "Update product packaging in-...",
    startHour: 11, endHour: 17,
    color: "#FF9A3C",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
  },
];

// ─── TOTAL INNER WIDTH ────────────────────────────────────────────────────────
// 7 days × (day-label column + 24 hour columns)
const DAY_TOTAL_W  = DAY_LABEL_W + 24 * HOUR_WIDTH;   // width of one full day
const GRID_TOTAL_W = 7 * DAY_TOTAL_W;                 // total scrollable width

// ─── MINI CALENDAR ────────────────────────────────────────────────────────────
function MiniCal({ month }) {
  const [cur, setCur] = useState(month);
  useEffect(() => setCur(month), [month]);
  const today     = dayjs();
  const firstDow  = cur.startOf("month").day();
  const offset    = firstDow === 0 ? 6 : firstDow - 1;
  const days      = cur.daysInMonth();
  const cells     = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <button style={Styles.miniNav} onClick={() => setCur(c => c.subtract(1,"month"))}>‹</button>
        <span style={{ fontSize:11, fontWeight:700, color:"#333" }}>{cur.format("MMMM YYYY")}</span>
        <button style={Styles.miniNav} onClick={() => setCur(c => c.add(1,"month"))}>›</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
          <span key={d} style={Styles.miniHead}>{d}</span>
        ))}
        {cells.map((d, i) => !d
          ? <span key={"e"+i} />
          : <button key={d} style={{ ...Styles.miniDay, ...(cur.date(d).isSame(today,"day") ? Styles.miniDayToday : {}) }}>
              {d}
            </button>
        )}
      </div>
    </>
  );
}

// ─── EVENT CHIP ───────────────────────────────────────────────────────────────
function EventChip({ ev }) {
  const left  = DAY_LABEL_W + ev.startHour * HOUR_WIDTH;
  const width = Math.max((ev.endHour - ev.startHour) * HOUR_WIDTH - 4, 36);

  return (
    <Tooltip title={ev.title} placement="top">
      <div
        style={{
          ...Styles.engagementBox,
          position:"absolute", top:6, left, width,
          height: ROW_HEIGHT - 12,
          background: ev.color,
        }}
        onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
        onMouseLeave={e => e.currentTarget.style.filter = "none"}
      >
        {ev.avatarInitials && (
          <Avatar size={20} style={{ ...Styles.avatarFont, background:ev.avatarBg, }}>
            {ev.avatarInitials}
          </Avatar>
        )}
        <span style={Styles.engagementTitle}>
          {ev.title}
        </span>
        {ev.count   && <span style={Styles.engagementCount}>{ev.count}</span>}
        {ev.hasLink && <span style={Styles.engagementIcon}>⇗</span>}
        {ev.label   && <span style={Styles.engagementLabel}>{ev.label}</span>}
        <span style={Styles.userColorBoxContainer}>
          {(ev.badges||[]).map((c,i) => (
            <span key={i} style={{...Styles.userColorBox, background:c}} />
          ))}
        </span>
      </div>
    </Tooltip>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function HorizontalScheduler() {
  const [weekStart, setWeekStart] = useState(dayjs());
  const scrollRef  = useRef(null);   // THE single scroll container
  const today      = dayjs();
  const nowHour    = today.hour() + today.minute() / 60;
  const nowDayIdx  = (() => { const d = today.day(); return d === 0 ? 6 : d - 1; })();
  const weekDates  = WEEK_DAYS.map((_, i) => weekStart.add(i, "day"));

  // Scroll to 9am on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 9 * HOUR_WIDTH;
    }
  }, []);

  return (
    <div style={Styles.root}>

      {/* ══════════ LEFT SIDEBAR ══════════ */}
      <div style={Styles.leftPanel}>

        {/* Mini cals */}
        <div style={{ padding:"12px 10px 8px", borderBottom:"1px solid #f0f0f0" }}>
          <MiniCal month={dayjs("2024-10-01")} />
          <div style={{ marginTop:12 }}>
            <MiniCal month={dayjs("2024-11-01")} />
          </div>
        </div>

        {/* Team label */}
        <div style={{ padding:"8px 14px 4px", display:"flex", alignItems:"center", gap:6 }}>
          <TeamOutlined style={{ color:"#bbb", fontSize:12 }} />
          <span style={{ fontSize:10, fontWeight:700, color:"#bbb", letterSpacing:1 }}>PEOPLE</span>
        </div>

        {/*
          Spacer that aligns with the sticky header rows in the grid:
          DAY_HEADER_H + HOUR_TICK_H
        */}
        <div style={{ height: DAY_HEADER_H + HOUR_TICK_H, flexShrink:0 }} />

        {/* User names — one per row, same height as grid rows */}
        <div style={{ flex:1, overflowY:"hidden" }}>
          {USERS.map(u => (
            <div key={u.id} style={{ ...Styles.leftUserRow, height:ROW_HEIGHT }}>
              <CheckOutlined style={{ color:u.color, fontSize:13, marginRight:8, flexShrink:0 }} />
              <span style={{ fontSize:12, color:"#333", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {u.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ RIGHT AREA ══════════ */}
      <div style={Styles.rightArea}>

        {/* Toolbar */}
        <div style={Styles.toolbar}>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <Button size="small" style={{ borderRadius:6, fontWeight:600, fontSize:12 }}
              onClick={() => setWeekStart(dayjs().startOf("isoWeek"))}>Today</Button>
            <Button icon={<LeftOutlined />}  size="small" style={{ borderRadius:6 }}
              onClick={() => setWeekStart(d => d.subtract(7,"day"))} />
            <Button icon={<RightOutlined />} size="small" style={{ borderRadius:6 }}
              onClick={() => setWeekStart(d => d.add(7,"day"))} />
          </div>
          <span style={{ flex:1, textAlign:"center", fontWeight:700, fontSize:15, color:"#1a1a2e" }}>
            {weekStart.format("MMMM")} – {weekStart.add(8,"week").format("MMMM YYYY")}
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:6, border:"1px solid #e5e5e5", borderRadius:8, padding:"4px 12px", background:"#fafafa", cursor:"pointer" }}>
            <CalendarOutlined style={{ color:"#888" }} />
            <span style={{ fontSize:13, color:"#444", fontWeight:500 }}>Month</span>
            <DownOutlined style={{ fontSize:9, color:"#aaa" }} />
          </div>
        </div>

        {/* ══ THE SINGLE SCROLL CONTAINER ══
            Everything inside scrolls together: day headers, hour ticks, event rows.
            Day name+number cells are sticky-left inside this scroll box.
        */}
        <div ref={scrollRef} style={Styles.scrollContainer}>

          {/* Inner canvas — full width of 7 days */}
          <div style={{ width: GRID_TOTAL_W, minWidth: GRID_TOTAL_W, position:"relative" }}>

            {/* ── ROW 1: Day name + date (sticky top) ── */}
            <div style={{ ...Styles.stickyRow, top:0, height:DAY_HEADER_H, zIndex:20, borderBottom:"1px solid #e0e0e0" }}>
              {weekDates.map((date, di) => {
                const isToday   = date.isSame(today,"day");
                const isWeekend = di >= 5;
                return (
                  <div key={di} style={{
                    ...Styles.dayHeaderCell,
                    width: DAY_TOTAL_W,
                    background: isWeekend ? "#fafafa" : "#fff",
                    borderRight: "1px solid #ececec",
                  }}>
                    {/* Sticky day label column inside the day */}
                    <div style={Styles.dayLabelSticky}>
                      <span style={Styles.dayNameTxt}>{WEEK_DAYS[di]}</span>
                      <span style={{ ...Styles.dayNumTxt, ...(isToday ? Styles.dayNumToday : {}) }}>
                        {date.date()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── ROW 2: Hour ticks (sticky top, below day row) ── */}
            <div style={{ ...Styles.stickyRow, top:DAY_HEADER_H, height:HOUR_TICK_H, zIndex:19, borderBottom:"2px solid #e0e0e0" }}>
              {weekDates.map((date, di) => {
                const isWeekend = di >= 5;
                return (
                  <div key={di} style={{
                    ...Styles.hourTickDayCell,
                    width: DAY_TOTAL_W,
                    background: isWeekend ? "#fafafa" : "#fff",
                    borderRight:"1px solid #ececec",
                  }}>
                    {/* blank under the sticky label */}
                    <div style={{ width:DAY_LABEL_W, height:"100%", borderRight:"1px solid #f0f0f0", flexShrink:0 }} />
                    {/* hour ticks */}
                    {HOURS.map(h => (
                      <div key={h} style={Styles.hourTickCell}>
                        <span style={Styles.hourTickTxt}>{String(h).padStart(2,"0")}:00</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* ── ROWS 3+: One row per user, across all 7 days ── */}
            {USERS.map((user, ui) => (
              <div key={user.id} style={{ display:"flex", height:ROW_HEIGHT, borderBottom:"1px solid #f0f0f0" }}>
                {weekDates.map((date, di) => {
                  const isWeekend = di >= 5;
                  const dayEvs    = EVENTS.filter(e => e.userId === user.id && e.dayIndex === di);

                  return (
                    <div key={di} style={{
                      position:"relative",
                      width: DAY_TOTAL_W,
                      height: ROW_HEIGHT,
                      flexShrink:0,
                      background: isWeekend ? "#fafafa" : "#fff",
                      borderRight:"1px solid #ececec",
                      overflow:"hidden",
                    }}>
                      {/* Sticky day-label column (left side of each day cell) */}
                      <div style={Styles.dayCellLabel} />

                      {/* Vertical hour lines */}
                      {HOURS.map(h => (
                        <div key={h} style={{
                          position:"absolute",
                          top:0, bottom:0,
                          left: DAY_LABEL_W + h * HOUR_WIDTH,
                          width:1,
                          background:"#f3f3f3",
                          zIndex:1,
                        }} />
                      ))}

                      {/* Now-line */}
                      {di === nowDayIdx && (
                        <div style={{
                          position:"absolute",
                          top:0, bottom:0,
                          left: DAY_LABEL_W + nowHour * HOUR_WIDTH,
                          width:2,
                          background:"#e63946",
                          zIndex:5,
                          pointerEvents:"none",
                        }} />
                      )}

                      {/* Event chips */}
                      {dayEvs.map(ev => <EventChip key={ev.id} ev={ev} />)}
                    </div>
                  );
                })}
              </div>
            ))}

          </div>{/* /inner canvas */}
        </div>{/* /scrollContainer */}
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const Styles = {
  root: {
    display:"flex", height:"100vh",
    fontFamily:"'DM Sans','Segoe UI',sans-serif",
    background:"#f5f6fa", overflow:"hidden",
  },

  /* LEFT */
  leftPanel: {
    width:LEFT_PANEL_W, minWidth:LEFT_PANEL_W,
    background:"#fff", borderRight:"1px solid #e8e8e8",
    display:"flex", flexDirection:"column", overflow:"hidden",
    zIndex:30,
  },
  leftUserRow: {
    display:"flex", alignItems:"center",
    padding:"0 14px",
    borderBottom:"1px solid #f5f5f5",
    boxSizing:"border-box",
  },

  /* RIGHT */
  rightArea: {
    flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0,
  },
  toolbar: {
    display:"flex", alignItems:"center",
    padding:"10px 16px",
    background:"#fff", borderBottom:"1px solid #e8e8e8",
    gap:12, flexShrink:0, height:HEADER_TOP_H, boxSizing:"border-box",
  },

  /* THE scroll container — overflow in both axes */
  scrollContainer: {
    flex:1,
    overflowX:"auto",
    overflowY:"auto",
    position:"relative",
  },

  /* Sticky header rows */
  stickyRow: {
    position:"sticky",
    display:"flex",
    background:"#fff",
  },

  /* Day header cell (one per day in the sticky day row) */
  dayHeaderCell: {
    flexShrink:0,
    display:"flex",
    alignItems:"flex-end",
    paddingBottom:6,
    boxSizing:"border-box",
    height:DAY_HEADER_H,
  },
  dayLabelSticky: {
    width:DAY_LABEL_W,
    flexShrink:0,
    paddingLeft:10,
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-end",
    paddingBottom:4,
  },
  dayNameTxt: {
    fontSize:10, fontWeight:700, color:"#aaa",
    textTransform:"uppercase", letterSpacing:0.8,
  },
  dayNumTxt: {
    fontSize:22, fontWeight:800, color:"#1a1a2e", lineHeight:1.1,
  },
  dayNumToday: { color:"#1677ff" },

  /* Hour tick row (one per day in the sticky hour row) */
  hourTickDayCell: {
    flexShrink:0, display:"flex", alignItems:"center",
    boxSizing:"border-box", height:HOUR_TICK_H,
  },
  hourTickCell: {
    width:HOUR_WIDTH, minWidth:HOUR_WIDTH,
    height:"100%",
    display:"inline-flex", alignItems:"center",
    borderRight:"1px solid #f0f0f0",
    paddingLeft:3, flexShrink:0, boxSizing:"border-box",
  },
  hourTickTxt: {
    fontSize:8.5, color:"#ccc",
    fontVariantNumeric:"tabular-nums", letterSpacing:0.2,
  },

  /* Per-cell left day label (blank separator, same width as DAY_LABEL_W) */
  dayCellLabel: {
    position:"absolute",
    top:0, bottom:0, left:0,
    width:DAY_LABEL_W,
    background:"inherit",
    borderRight:"1px solid #ececec",
    zIndex:2,
  },

  /* Mini cal */
  miniNav: {
    background:"none", border:"none", cursor:"pointer",
    fontSize:15, color:"#888", padding:"0 4px", lineHeight:1,
  },
  miniHead: {
    fontSize:8.5, fontWeight:700, color:"#bbb",
    textAlign:"center", padding:"1px 0", textTransform:"uppercase",
  },
  miniDay: {
    background:"none", border:"none", cursor:"pointer",
    fontSize:9.5, color:"#444", textAlign:"center",
    padding:"2px 0", borderRadius:4, fontFamily:"inherit", lineHeight:1.4,
  },
  miniDayToday: {
    background:"#1677ff", color:"#fff", borderRadius:10, fontWeight:700,
  },
  engagementBox: {
    borderRadius: 8,
    display:"flex", alignItems:"center",
    padding:"0 8px", gap:5,
    cursor:"pointer",
    boxShadow:"0 2px 8px rgba(0,0,0,.18)",
    overflow:"hidden",
    boxSizing:"border-box",
    zIndex:3,
    transition:"filter .15s",
    whiteSpace:"nowrap", 
  },
  engagementTitle: {
    color:"#fff", fontSize:11.5, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", flex:1 
  },
  engagementCount: {
    color:"#fff", fontSize:11, fontWeight:700, flexShrink:0 
  },
  engagementLabel:{ color:"#fff", fontSize:12, fontWeight:700, flexShrink:0 },
  engagementIcon: { color:"rgba(255,255,255,.7)", fontSize:10, flexShrink:0 
  },
  avatarFont: {
    fontSize:9, fontWeight:800, flexShrink:0,
  },
  userColorBoxContainer: {
    display:"flex", gap:2, flexShrink:0,
  },
  userColorBox: {
    display:"inline-block", width:9, height:9, borderRadius:2, border:"1px solid #fff"
  }
};
