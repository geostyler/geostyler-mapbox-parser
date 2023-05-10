const fillSimpleFillOutline: any = {
  version: 8,
  name: 'Simple Fill With outline',
  layers: [{
      id: 'Simple Fill With outline',
      type: "fill",
      paint: {
        "fill-color": "#ff0000"
      }
    },
    {
      id: "Simple Fill With outline",
      type: "line",
      paint: {
        "line-opacity": 0.5,
        "line-color": "#00ff00",
        "line-width": 2
      },
      layout: {
        "line-cap": "butt",
        "line-join": "round"
      }
    }
  ]
};

export default fillSimpleFillOutline;
