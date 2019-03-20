import axios from 'axios';

export default async tour => {
  try {
    const { name, buildingName } = tour;
    const response = await axios.post(
      '/api/create-tour',
      { name, buildingName },
      {
        withCredentials: true
      }
    );

    const { token, uploadSession } = response.data;

    const uploadAsset = (asset, url, length, index) => {
      const formData = new FormData();
      formData.set('tourToken', token);
      formData.set('uploadSession', uploadSession);
      formData.set('totalAssetCount', length);
      formData.set('index', index);
      formData.set('file', asset.file);
      formData.set('label', asset.name);
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      };

      return axios.post(url, formData, config);
    };

    const promises = tour.floorplans.map((asset, index) => {
      return uploadAsset(
        asset,
        '/api/upload-floorplan',
        tour.floorplans.length,
        index
      );
    });

    promises.concat(
      tour.panoramas.map((asset, index) => {
        return uploadAsset(
          asset,
          '/api/upload-panorama',
          tour.panoramas.length,
          index
        );
      })
    );

    await Promise.all(promises);
  } catch (err) {
    console.log(err);
    alert('Failed to upload tour');
  }
};
