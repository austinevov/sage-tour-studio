import {
  SageTourInternal

} from '../packages/sage-tour/src'

export default (container, panoramas, token) => {
  const panoramaGraph = panoramas.map(panorama => {
    const [x, y] = panorama.position;

    return {
      id: panorama.id,
      position: [
        y,
        panorama.floor,
        -x
      ],
      edges: panorama.edges.map((edge) => Number(edge)),
      name: panorama.label,
      floor: panorama.floor
    };
  });

  console.log(panoramaGraph);

  const opts = {
    imagePathRoot: `https://s3.amazonaws.com/assets.sagetourstudio/${token}`,
    disableControls: false,
    forceLD: true,
    hideUI: true
  };

  const onLoad = () => {};
  const tour = new SageTourInternal(container, panoramaGraph, onLoad, opts);
  return tour;
};