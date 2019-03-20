export default (id, point) => {
  const [x, y] = point;
  const el = document.getElementById(id);
  const rect = el.getBoundingClientRect();

  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
};
