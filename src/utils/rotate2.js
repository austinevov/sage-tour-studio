export default (vec, ang) => {
  const [x, y] = vec;
  const rx = x * Math.cos(ang) - y * Math.sin(ang);
  const ry = x * Math.sin(ang) + y * Math.cos(ang);

  return [rx, ry];
};
