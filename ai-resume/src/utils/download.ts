export const downloadPdf = (data: Blob, name: string) => {
  //创建blob对象
  const blob = new Blob([data], { type: "application/pdf" });
  //通过URL创建base64链接
  const url = window.URL.createObjectURL(blob);
  //创建a元素
  const link = document.createElement("a");
  //设置下载url
  link.href = url;
  //设置下载名称
  link.download = `${name || "resume"}.pdf`;
  //追加a元素
  document.body.appendChild(link);
  //模拟点击下载
  link.click();
  //移除a元素
  document.body.removeChild(link);
  //释放base64链接
  window.URL.revokeObjectURL(url);
};
