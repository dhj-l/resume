import confetti from "canvas-confetti";

/**
 * AI 生成完成庆祝：克制、短暂的彩带。
 * 尊重 prefers-reduced-motion：用户设置减少动效时不触发。
 */
export const playCelebration = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#1677ff", "#4096ff", "#722ed1", "#52c41a"];
  const defaults = { colors, ticks: 200 };

  confetti({ ...defaults, particleCount: 80, spread: 70, origin: { y: 0.6 } });

  setTimeout(() => {
    confetti({ ...defaults, particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
    confetti({ ...defaults, particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
  }, 200);
};
