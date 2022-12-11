export function formatDifficulty(value: number) {
  return ['Beginner', 'Easy', 'Intermediate', 'Hard', 'Expert'][value - 1];
}

export function formatTime(value: number) {
  if (value > 60) {
    const hours = (value / 60).toFixed(0);
    const min = value % 60;
    return hours + ' h' + (min ? ' ' + min + ' min' : '');
  }
  else
    return value.toFixed(0) + ' min';
}

export function formatLength(value: number) {
  if (value > 1) return value.toFixed(0) + ' km'
  else return (value * 1000).toFixed(0) + ' m'
}
