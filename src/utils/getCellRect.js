// utils/getCellRect.ts
// import { SheetImage } from "../models/SheetImage";

export function getCellRect(img) {
  const cell = document.querySelector(
    `[data-row="${img.row}"][data-col="${img.col}"]`
  );

  if (!cell) return null;

  const rect = cell.getBoundingClientRect();

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width * (img.colSpan ?? 1),
    height: rect.height * (img.rowSpan ?? 1),
  };
}
