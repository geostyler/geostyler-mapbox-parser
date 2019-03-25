import { Style } from 'geostyler-style';

const rasterSimpleRaster: Style = {
  'name': 'Simple Raster',
  'rules': [{
    'name': 'Simple Raster',
    'symbolizers': [{
      'kind': 'Raster',
      'opacity': 0.5,
      'brightnessMax': 1,
      'brightnessMin': 0,
      'saturation': 1,
      'contrast': 1,
      'resampling': 'linear',
      'fadeDuration': 200
    }]
  }]
};

export default rasterSimpleRaster;
