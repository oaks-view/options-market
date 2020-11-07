function formatThousands(num: number | string) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const getUnixTimestamp = (date = new Date()): number => {
  return Math.floor(date.getTime() / 1000);
};

const getDateFromUnixTimeStamp = (timestamp: string | number): Date => {
  return new Date(+timestamp * 1000);
};

export { getUnixTimestamp, formatThousands, getDateFromUnixTimeStamp };
