import { is } from '../../utilityFunc/utilityFunc';

export default function traversalVector(vector, cb) {
  if(!is(cb, 'function')) {
    throw new TypeError('cb is not a function');
  }
  if(is(vector, 'array')) {
    vector.forEach((item, index) => {
      cb(index, index);
    })
  } else if(is(vector, 'object')) {
    let count = 0;
    for(let key in vector) {
      if(vector.hasOwnProperty(key)) {
        cb(key, count ++);
      }
    }
  }
}