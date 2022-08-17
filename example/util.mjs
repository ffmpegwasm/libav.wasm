const toMB = (n) => Math.round((n / 1024 / 1024) * 100) / 100;

export const printMemoryUsage = (libav) => {
  console.log(`memory total: ${toMB(libav.HEAP8.length)} MB`);
};
