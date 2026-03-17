import React, { useState, useRef, useEffect } from "react";
import { Avatar, Button, Tooltip, Checkbox } from "antd";
import {
  LeftOutlined, RightOutlined,
  CalendarOutlined, DownOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "./styles.css";
dayjs.extend(isoWeek);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const HOUR_WIDTH   = 64;
const DAY_LABEL_W  = 110;
const ROW_HEIGHT   = 52;
const LEFT_PANEL_W = 200;
const HEADER_TOP_H = 56;
const DAY_HEADER_H = 64;
const HOUR_TICK_H  = 22;

const HOURS     = Array.from({ length: 24 }, (_, i) => i);
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sat", "Sun"];

// Width of one full day column (label + 24 hours)
const DAY_TOTAL_W  = DAY_LABEL_W + 24 * HOUR_WIDTH;
// Total canvas width for 7 days
const GRID_TOTAL_W = 7 * DAY_TOTAL_W;

// ─── USERS ────────────────────────────────────────────────────────────────────
const USERS = [
  { id: 1, name: "Andrea Cuthbertson",  color: "#f87fb1" },
  { id: 2, name: "Arbor Brain",         color: "#a8d8a8" },
  { id: 3, name: "Barry Richards",      color: "#f7c873" },
  { id: 4, name: "Cynthia Smith",       color: "#f4a0c8" },
  { id: 5, name: "Dave Miller",         color: "#ffe066" },
  { id: 6, name: "Deborah Cohen",       color: "#a0c4ff" },
  { id: 7, name: "Fred Scuttle",        color: "#b5ead7" },
];

// ─── EVENTS ───────────────────────────────────────────────────────────────────
//
//  Single-day events  → { ..., startDay, startHour, endDay: same, endHour }
//  Multi-day events   → { ..., startDay, startHour, endDay: different, endHour }
//
//  startDay / endDay : 0 = Monday … 6 = Sunday
//
const EVENTS = [
  // ── single-day originals ──────────────────────────────────────────────────
  {
    id: 1, userId: 1,
    title: "Design for new shoppin...",
    startDay: 1, startHour: 18,
    endDay:   1, endHour:   19.5,
    color: "#FF5FA0",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    label: "18:30",
  },
  {
    id: 2, userId: 2,
    title: "New Images for Each Regional Office",
    startDay: 1, startHour: 11,
    endDay:   1, endHour:   23.9,
    color: "#FF5FA0",
    badges: ["#e63946","#457b9d","#2a9d8f","#e9c46a","#f4a261","#264653"],
    count: "3", hasLink: true,
  },
  {
    id: 3, userId: 3,
    title: "NA, New product launch asset",
    startDay: 1, startHour: 11,
    endDay:   1, endHour:   19,
    color: "#b57bee",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    avatarBg: "#7b2d8b", avatarInitials: "NA",
  },
  {
    id: 4, userId: 4,
    title: "Website content",
    startDay: 19, startHour: 11,
    endDay:   19, endHour:   16,
    color: "#FF7EB3",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
  },
  {
    id: 5, userId: 6,
    title: "Japanese Launch Assets",
    startDay: 2, startHour: 11,
    endDay:   2, endHour:   23.9,
    color: "#52b788",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    count: "8", hasLink: true,
    avatarBg: "#2d6a4f", avatarInitials: "JL",
  },
  {
    id: 6, userId: 7,
    title: "Sales video update - Forms v2...",
    startDay: 2, startHour: 11,
    endDay:   2, endHour:   16,
    color: "#FF7EB3",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    avatarBg: "#7b3f00", avatarInitials: "SV",
  },
  {
    id: 7, userId: 5,
    title: "Update product packaging in-...",
    startDay: 4, startHour: 11,
    endDay:   4, endHour:   17,
    color: "#FF9A3C",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
  },

  // ── NEW multi-day events ──────────────────────────────────────────────────
  {
    id: 8, userId: 1,
    title: "Brand Campaign Sprint",
    startDay: 2, startHour: 9,
    endDay:   4, endHour:   17,
    color: "#7B61FF",
    badges: ["#ff6b35","#ffd166","#06d6a0"],
    avatarBg: "#4c3a99", avatarInitials: "BC",
  },
  {
    id: 9, userId: 3,
    title: "Q4 Product Roadmap Review",
    startDay: 3, startHour: 14,
    endDay:   5, endHour:   11,
    color: "#FF8C42",
    badges: ["#e63946","#457b9d","#2a9d8f"],
    count: "5",
  },
  {
    id: 10, userId: 5,
    title: "Dev Handoff & QA Cycle",
    startDay: 0, startHour: 8,
    endDay:   2, endHour:   12,
    color: "#00B4D8",
    badges: ["#ff6b35","#ffd166","#06d6a0","#118ab2"],
    avatarBg: "#005f73", avatarInitials: "QA",
    hasLink: true,
  },
  {
    id: 11, userId: 2,
    title: "Content Calendar Planning",
    startDay: 3, startHour: 10,
    endDay:   6, endHour:   15,
    color: "#E9C46A",
    badges: ["#e63946","#2a9d8f"],
    avatarBg: "#9b7700", avatarInitials: "CP",
  },
  {
    id: 12, userId: 4,
    title: "UX Research Sessions",
    startDay: 1, startHour: 13,
    endDay:   3, endHour:   18,
    color: "#06D6A0",
    badges: ["#ff6b35","#ffd166"],
    avatarBg: "#047857", avatarInitials: "UX",
    count: "4",
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Given an event, return its absolute pixel left & width
 * within the full GRID_TOTAL_W canvas.
 */
function eventPixels(ev) {
  const left  = ev.startDay * DAY_TOTAL_W + DAY_LABEL_W + ev.startHour * HOUR_WIDTH;
  const right = ev.endDay   * DAY_TOTAL_W + DAY_LABEL_W + ev.endHour   * HOUR_WIDTH;
  return { left, width: Math.max(right - left - 4, 36) };
}

/**
 * Return the absolute pixel top of a user row inside the grid body.
 * (header rows sit above; body rows start at 0 within the body container)
 */
function rowTop(userIndex) {
  return userIndex * ROW_HEIGHT;
}

// ─── MINI CALENDAR ────────────────────────────────────────────────────────────
function MiniCal({ month }) {
  const [cur, setCur] = useState(month);

  const today    = dayjs();
  const firstDow = cur.startOf("month").day();
  const offset   = firstDow === 0 ? 6 : firstDow - 1;
  const days     = cur.daysInMonth();
  const cells    = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  useEffect(() => setCur(month), [month]);

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">
        <button className="mini-nav" onClick={() => setCur(c => c.subtract(1,"month"))}>‹</button>
        <span className="mini-month-text">{cur.format("MMMM YYYY")}</span>
        <button className="mini-nav" onClick={() => setCur(c => c.add(1,"month"))}>›</button>
      </div>
      <div className="mini-grid">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
          <span key={d} className="mini-head">{d}</span>
        ))}
        {cells.map((d, i) => !d
          ? <span key={"e"+i} />
          : <button key={d} className={`mini-day ${cur.date(d).isSame(today,"day") ? "mini-day-today" : ""}`}>
              {d}
            </button>
        )}
      </div>
    </div>
  );
}

// ─── EVENT CHIP ───────────────────────────────────────────────────────────────
function EventChip({ ev, top, left, width, isMultiDay }) {
  const borderRadius = isMultiDay ? "8px" : "8px";

  return (
    <Tooltip
      title={
        isMultiDay
          ? `${ev.title} · ${WEEK_DAYS[ev.startDay]} ${String(Math.floor(ev.startHour)).padStart(2,"0")}:00 → ${WEEK_DAYS[ev.endDay]} ${String(Math.floor(ev.endHour)).padStart(2,"0")}:00`
          : ev.title
      }
      placement="top"
    >
      <div
        className={`event-chip ${isMultiDay ? "event-chip-multi" : "event-chip-single"}`}
        style={{
          top: top + 6,
          left,
          width,
          height: ROW_HEIGHT - 12,
          background: ev.color,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.filter = "brightness(1.1)";
          e.currentTarget.style.boxShadow = isMultiDay
            ? "0 4px 18px rgba(0,0,0,0.28)"
            : "0 4px 18px rgba(0,0,0,0.28)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.filter = "none";
          e.currentTarget.style.boxShadow = isMultiDay
            ? "0 3px 12px rgba(0,0,0,0.22)"
            : "0 2px 8px rgba(0,0,0,0.18)";
        }}
      >
        {/* Multi-day indicator stripe */}
        {isMultiDay && (
          <div className="event-chip-stripe" />
        )}

        {ev.avatarInitials && (
          <Avatar size={20} style={{ background:ev.avatarBg }} className={`event-chip-avatar ${isMultiDay ? "event-chip-avatar-multi" : ""}`}>
            {ev.avatarInitials}
          </Avatar>
        )}

        <span className="event-chip-title">
          {ev.title}
        </span>

        {isMultiDay && (
          <span className="event-chip-date-range">
            {WEEK_DAYS[ev.startDay].slice(0,3)} → {WEEK_DAYS[ev.endDay].slice(0,3)}
          </span>
        )}

        {ev.count   && <span className="event-chip-count">{ev.count}</span>}
        {ev.hasLink && <span className="event-chip-link">⇗</span>}
        {ev.label   && <span className="event-chip-label">{ev.label}</span>}

        <span className="event-chip-badges">
          {(ev.badges||[]).map((c,i) => (
            <span key={i} className="event-chip-badge" style={{ background:c }} />
          ))}
        </span>
      </div>
    </Tooltip>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function HorizontalScheduler() {
    const scrollRef = useRef(null);
    const today     = dayjs();
    const nowHour   = today.hour() + today.minute() / 60;
    const nowDayIdx = (() => { const d = today.day(); return d === 0 ? 6 : d - 1; })();
    const [weekStart, setWeekStart] = useState(dayjs());
    const weekDates = WEEK_DAYS.map((_, i) => weekStart.add(i, "day"));

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 9 * HOUR_WIDTH;
  }, []);

  // Split events into single-day vs multi-day
  const singleDayEvents = EVENTS.filter(e => e.startDay === e.endDay);
  const multiDayEvents  = EVENTS.filter(e => e.startDay !== e.endDay);

  // Total body height (below the sticky headers) = users × row height
  const bodyH = USERS.length * ROW_HEIGHT;

  return (
    <div className="calendar-root">

      {/* ══════════ LEFT SIDEBAR ══════════ */}
      <div className="calendar-left-panel">
        <div className="mini-cal-container">
          <MiniCal month={dayjs("2024-10-01")} />
          <div className="mini-cal-second">
            <MiniCal month={dayjs("2024-11-01")} />
          </div>
        </div>

        <div className="people-header">
          <TeamOutlined className="people-icon" />
          <span className="people-label">PEOPLE</span>
        </div>

        {/* Spacer aligning with sticky headers */}
        <div className="header-spacer" style={{ height: DAY_HEADER_H + HOUR_TICK_H }} />

        {/* User names */}
        <div className="user-list-container">
          {USERS.map(u => (
            <div key={u.id} className="left-user-row" style={{ height:ROW_HEIGHT, background:u.color + "22" }}>
              {/* <CheckOutlined style={{ color:u.color, fontSize:13, marginRight:8, flexShrink:0 }} /> */}
              <Checkbox checked>
              <span className="user-name-text">
                {u.name}
              </span>
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ RIGHT AREA ══════════ */}
      <div className="calendar-right-area">

        {/* Toolbar */}
        <div className="calendar-toolbar">
          <div className="toolbar-buttons-group">
            <Button size="small" className="toolbar-button-today"
              onClick={() => setWeekStart(dayjs().startOf("isoWeek"))}>Today</Button>
            <Button icon={<LeftOutlined />}  size="small" className="toolbar-button"
              onClick={() => setWeekStart(d => d.subtract(7,"day"))} />
            <Button icon={<RightOutlined />} size="small" className="toolbar-button"
              onClick={() => setWeekStart(d => d.add(7,"day"))} />
          </div>
          <span className="toolbar-title">
            {weekStart.format("MMMM")} – {weekStart.add(8,"week").format("MMMM YYYY")}
          </span>
          <div className="toolbar-dropdown">
            <CalendarOutlined className="toolbar-dropdown-icon" />
            <span className="toolbar-dropdown-text">Month</span>
            <DownOutlined className="toolbar-dropdown-arrow" />
          </div>
        </div>

        {/* ══ SINGLE SCROLL CONTAINER ══ */}
        <div ref={scrollRef} className="calendar-scroll-container">
          <div className="grid-canvas" style={{ width:GRID_TOTAL_W, minWidth:GRID_TOTAL_W }}>

            {/* ── Sticky Row 1: Day name + date ── */}
            <div className={`sticky-row sticky-row-day-header`} style={{ height:DAY_HEADER_H }}>
              {weekDates.map((date, di) => (
                <div key={di} className={`day-header-cell ${di >= 5 ? "day-header-weekend" : "day-header-weekday"}`} style={{ width:DAY_TOTAL_W }}>
                  <div className="day-label-sticky">
                    <span className="day-name-text">{WEEK_DAYS[di]}</span>
                    <span className={`day-num-text ${date.isSame(today,"day") ? "day-num-today" : ""}`}>
                      {date.date()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Sticky Row 2: Hour ticks ── */}
            <div className={`sticky-row sticky-row-hour-ticks`} style={{ top:DAY_HEADER_H, height:HOUR_TICK_H }}>
              {weekDates.map((_, di) => (
                <div key={di} className={`hour-tick-day-cell ${di >= 5 ? "day-header-weekend" : "day-header-weekday"}`} style={{ width:DAY_TOTAL_W }}>
                  <div className="day-label-spacer" style={{ width:DAY_LABEL_W }} />
                  {HOURS.map(h => (
                    <div key={h} className="hour-tick-cell" style={{ width:HOUR_WIDTH, minWidth:HOUR_WIDTH, height:"100%" }}>
                      <span className="hour-tick-text">{String(h).padStart(2,"0")}:00</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* ── Grid body: background cells + single-day events ── */}
            <div className="grid-body" style={{ height:bodyH }}>

              {/* Background cells (day × user grid) */}
              {USERS.map((user, ui) => (
                <div key={user.id} className="user-row" style={{ height:ROW_HEIGHT }}>
                  {weekDates.map((_, di) => (
                    <div key={di} className={`day-cell ${di >= 5 ? "day-cell-weekend" : "day-cell-weekday"}`} style={{
                      width:DAY_TOTAL_W, height:ROW_HEIGHT, flexShrink:0,
                    }}>
                      {/* Day-label spacer */}
                      <div className="day-label-spacer" style={{ width:DAY_LABEL_W }} />

                      {/* Hour grid lines */}
                      {HOURS.map(h => (
                        <div key={h} className="hour-grid-line" style={{
                          left: DAY_LABEL_W + h * HOUR_WIDTH,
                        }} />
                      ))}

                      {/* Now-line */}
                      {di === nowDayIdx && (
                        <div className="now-line" style={{
                          left: DAY_LABEL_W + nowHour * HOUR_WIDTH,
                        }} />
                      )}

                      {/* Single-day event chips */}
                      {singleDayEvents
                        .filter(e => e.userId === user.id && e.startDay === di)
                        .map(ev => {
                          const { left, width } = eventPixels(ev);
                          // left is absolute; adjust relative to this cell's origin
                          const cellOrigin = di * DAY_TOTAL_W;
                          return (
                            <EventChip
                              key={ev.id} ev={ev}
                              top={0}
                              left={left - cellOrigin}
                              width={width}
                              isMultiDay={false}
                            />
                          );
                        })
                      }
                    </div>
                  ))}
                </div>
              ))}

              {/* ── Multi-day event overlay ──
                  Absolutely positioned above the grid body.
                  Uses the FULL GRID_TOTAL_W as coordinate space.
                  Pointer-events only on actual chips (children).
              ── */}
              <div className="multi-day-overlay" style={{
                width:GRID_TOTAL_W,
                height:bodyH,
              }}>
                {multiDayEvents.map(ev => {
                  const userIdx = USERS.findIndex(u => u.id === ev.userId);
                  if (userIdx === -1) return null;
                  const { left, width } = eventPixels(ev);
                  const top = rowTop(userIdx);
                  return (
                    <div key={ev.id} className="multi-day-event-wrapper">
                      <EventChip
                        ev={ev}
                        top={top}
                        left={left}
                        width={width}
                        isMultiDay={true}
                      />
                    </div>
                  );
                })}
              </div>

            </div>{/* /grid body */}
          </div>{/* /inner canvas */}
        </div>{/* /scrollContainer */}
      </div>
    </div>
  );
}

// Styles are now in ANTDCalendar_V5.css