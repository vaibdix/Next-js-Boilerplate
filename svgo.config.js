export const SVGOConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertTransform: false,
          inlineStyles: false,
        },
      },
    },
    'removeViewBox',
    { name: 'removeDimensions' },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['path:fill', 'circle:fill', 'g:fill'],
      },
    },
  ],
};
