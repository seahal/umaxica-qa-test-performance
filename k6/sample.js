import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',
};

export default function () {
  const response = http.get('https://umaxica.net/');

  check(response, {
    'status is 200': (res) => res.status === 200,
  });

  sleep(1);
}
