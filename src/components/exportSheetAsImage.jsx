// utils/exportSheetAsImage.ts
import html2canvas from "html2canvas";

export async function exportSheetAsImage(el) {
  const canvas = await html2canvas(el, { useCORS: true });
  const link = document.createElement("a");
  link.download = "sheet.png";
  link.href = canvas.toDataURL();
  link.click();
}
