import * as path from 'path';

export default function getConfig(env) {
  try {
    return require(path.resolve(__dirname, `../environments/${env}`)).config;
  } catch (e) {
    return {};
  }
}
