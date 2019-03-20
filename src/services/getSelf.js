import axios from 'axios';

export default () => {
  return new Promise((resolve, reject) => {
    axios
      .get('/getSelf')
      .then(response => {
        const { email, firstName, lastName } = response.data;

        resolve({ email, firstName, lastName });
      })
      .catch(err => {
        reject({ error: 'Cannot get self' });
      });
  });
};
