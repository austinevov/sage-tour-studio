import { SageTourInternal } from '../../packages/sage-tour';

export default (container, panoramas, token) => {
  const panoramaGraph = panoramas.map(panorama => {
    const [x, y] = panorama.position;
    return {
      id: panorama.id,
      position: { x, y },
      edges: [],
      name: panorama.label,
      floor: panorama.floor
    };
  });

  const opts = {
    imagePathRoot: `https://s3.amazonaws.com/assets.sagetourstudio/${token}`,
    disableControls: false
  };

  const onLoad = () => {};
  console.log(container);
  console.log(panoramaGraph);
  return new SageTourInternal(container, panoramaGraph, onLoad, opts);
};
