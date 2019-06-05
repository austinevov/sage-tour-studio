import axios from 'axios';

export default tour => {
  const {
    token,
    panoramas,
    floorplans,
    viewBoxX,
    viewBoxY
  } = tour;

  axios.post('/api/update-tour', {
    tourToken: token,
    vbx: viewBoxX,
    vby: viewBoxY
  }, {
    withCredentials: true
  });

  panoramas.forEach(panorama => {
    console.log('PANORAMA: ', panorama);
    const panorama_id = panorama.id;
    const [x, y] = panorama.position;
    const panorama_position = [y, 0, -x].toString();
    const panorama_floor = panorama.floor;
    const panorama_edges = panorama.edges.toString();
    const panorama_label = panorama.label;
    const panorama_bayed = panorama.isBayed;

    axios
      .post(
        '/api/update-panorama', {
          tourToken: token,
          panorama_id,
          panorama_position,
          panorama_floor,
          panorama_edges,
          panorama_label,
          panorama_bayed
        }, {
          withCredentials: true
        }
      )
      .catch(err => {
        console.log('Could not update panorama');
      });
  });

  floorplans.forEach(floorplan => {
    const floorplan_id = floorplan.id;
    const floorplan_floor = floorplan.floor;
    const floorplan_vbx = viewBoxX;
    const floorplan_vby = viewBoxY;
    const floorplan_theta = floorplan.theta;

    axios
      .post(
        '/api/update-floorplan', {
          tourToken: token,
          floorplan_id,
          floorplan_floor,
          floorplan_vbx,
          floorplan_vby,
          floorplan_theta
        }, {
          withCredentials: true
        }
      )
      .catch(err => {
        console.log('Could not update floorplan');
      });
  });
};