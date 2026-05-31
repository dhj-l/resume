export const downloadPdf = (data: Blob, name: string) => {
  downloadFile(data, `${name || "resume"}.pdf`, "application/pdf");
};

export const downloadFile = (data: Blob, filename: string, mimeType?: string) => {
  const blob = new Blob([data], { type: mimeType || data.type || "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
