export default function groupByKey<T>(array: any[], key: string) {
  return (array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) });
  }, {})) as Record<string, T[]>;
}