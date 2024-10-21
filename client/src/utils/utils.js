export function getDate(d) {
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate - d;

  const seconds = differenceInMilliseconds / 1000; // milliseconds to seconds
  const minutes = seconds / 60; // seconds to minutes
  const hours = minutes / 60; // minutes to hours
  const days = hours / 24; // hours to days
  
  if (minutes < 1) {
    return `${Math.floor(seconds)} seconds ago`;
  }
  if (hours < 1) {
    return `${Math.floor(minutes)} minutes ago`;
  }
  if (days < 1) {
    return `${Math.floor(hours)} hours ago`;
  }
  return d.toUTCString();
}

export function getDateProfile(d) {
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate - d;

  const seconds = differenceInMilliseconds / 1000; // milliseconds to seconds
  const minutes = seconds / 60; // seconds to minutes
  const hours = minutes / 60; // minutes to hours
  const days = hours / 24; // hours to days
  const months = days / 30;
  const years = months / 12;
  
  if (minutes < 1) {
    return `${Math.floor(seconds)} seconds ago`;
  }
  if (hours < 1) {
    return `${Math.floor(minutes)} minutes ago`;
  }
  if (days < 1) {
    return `${Math.floor(hours)} hours ago`;
  }
  if (months < 1) {
    return `${Math.floor(days)} days ago`;
  }
  if (years < 1) {
    return `${Math.floor(months)} months ago`;
  }
  return `${Math.floor(years)} years ago`;
}

export function hasInvalidLink(text) {
  let regex = /\[(.+?)\]\((.*?)\)/g;
  const matches = text.match(regex);
  if (matches == null) return false;
  regex = /\[(.+?)\]\(((http:\/\/|https:\/\/).+?)\)/g;
  for (let m of matches) {
    regex.lastIndex = 0;
    if (!regex.test(m)) {
      return true;
    }
  }
  return false;
}