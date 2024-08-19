/* eslint-disable react/jsx-no-undef */
import React, { useCallback, useState } from 'react';
import './App.css';
import { Chart } from './Chart';
import { AxisTypeValue, XAxisOptions } from 'highcharts';
import { Button, Dropdown, Input, Label, Option, ToggleButton } from '@fluentui/react-components';
import { HighchartsReactRefObject } from 'highcharts-react-official';

const colors1 = [
  "#7cb5ec",
  "#f7a35c",
  "#90ee7e",
  "#7798BF",
  "#aaeeee",
  "#ff0066",
  "#eeaaee",
  "#55BF3B",
  "#DF5353",
  "#7798BF",
  "#aaeeee",
];
const colors2 = [
  "#2b908f",
  "#90ee7e",
  "#f45b5b",
  "#7798BF",
  "#aaeeee",
  "#ff0066",
  "#eeaaee",
  "#55BF3B",
  "#DF5353",
  "#7798BF",
  "#aaeeee",
];

const defaultOptions: Highcharts.Options = {
  colors: colors1,
  chart: {
    type: "spline",
  },
  title: {
    text: "My chart",
  },
  series: [
    {
      type: 'line',
      data: [1, 2, 1, 4, 3, 6],
    },
  ],
  xAxis: {
    labels: {
      enabled: true
    },
    categories: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']
  }
}

const scaleOption = ['linear', 'logarithmic', 'datetime', 'category'];

function createKeyboardEvent(eventType: string, keyCode: number) {
  let event = new KeyboardEvent(eventType, {
      key: "Shift",
      code: "ShiftLeft",
      keyCode: keyCode,
      which: keyCode,
      shiftKey: eventType === 'keydown',
      bubbles: true
  });
  return event;
}

// 监听鼠标按下事件
document.addEventListener('mousedown', (event) => {
  if (event.button === 0) { // 检查是否是鼠标左键
      let shiftDownEvent = createKeyboardEvent('keydown', 16);
      document.dispatchEvent(shiftDownEvent);
  }
});

// 监听鼠标松开事件
document.addEventListener('mouseup', (event) => {
  if (event.button === 0) { // 检查是否是鼠标左键
      let shiftUpEvent = createKeyboardEvent('keyup', 16);
      document.dispatchEvent(shiftUpEvent);
  }
});

function App() {
  const [options, setOptions] = useState(defaultOptions);
  const [theme, setTheme] = useState('color1');
  const chartRef = React.useRef<HighchartsReactRefObject>(null);

  const onChangeTheme = useCallback(() => {
    const colors = theme === 'color1' ? colors2 : colors1;
    setOptions({
      ...options,
      colors,
    });
    setTheme(theme === 'color1' ? 'color2' : 'color1');
  }, [theme, options]);

  const onChangeTitle = useCallback((value: string) => {
    setOptions({
      ...options,
      title: {
        text: value
      },
    });
  }, [options]);

  const onChangeOptions = useCallback((value: Partial<Highcharts.Options>) => {
    setOptions({
      ...options,
      ...value,
    });
  }, [options]);

  const onClickZoomIn = useCallback(() => {
    chartRef.current?.chart.yAxis[0].setExtremes(10, 20);
  }, []);

  const onClickZoomOut = useCallback(() => {
    chartRef.current?.chart.zoomOut();
  }, []);

  const onClickZoomReset = useCallback(() => {
    chartRef.current?.chart.zoomOut();
  }, []);

  const onClickSelectToZoom = useCallback(() => {
    const chart = chartRef.current?.chart;
    const type = chart?.userOptions.chart?.zoomType === undefined ? 'xy' : undefined;
    const nextOptions = {...chart?.userOptions};
    nextOptions.chart = { ...chart?.userOptions.chart};
    nextOptions.chart.zoomType = type;
    chartRef.current?.chart.update(nextOptions);
  }, []);

  const onClickPanning = useCallback(() => {
    const chart = chartRef.current?.chart;
    if(!chart){
      return;
    }

    const optionsFromChart = chart.userOptions;
    if(optionsFromChart.chart?.panning?.enabled){
      optionsFromChart.chart.panning.enabled = false;
    } else {
      optionsFromChart.chart = {
        ...optionsFromChart.chart,
        panKey:'shift',
        panning:{
          enabled: true,
          type: 'xy',
        }
      }
    }

    chart.update(optionsFromChart);
  }, []);

  const onMouseDown = useCallback(()=>{

  }, []);

  const onMouseUp = useCallback(()=>{

  }, []);

  return <div>
    <Button onClick={onClickZoomIn}>Zoom In</Button>
    <Button onClick={onClickZoomOut}>Zoom Out</Button>
    <Button onClick={onClickZoomReset}>Reset Zoom</Button>
    <ToggleButton onClick={onClickSelectToZoom}>Select to Zoom</ToggleButton>
    <ToggleButton onClick={onClickPanning}>Panning</ToggleButton>
    <Chart
      options={options}
      ref={chartRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    ></Chart>
    <Label>{`Theme: ${theme}`}</Label>
    <div>
      <Button onClick={onChangeTheme}>Change Theme</Button>
    </div>
    <div>
      {`Change Title: `}
      <input value={options.title?.text} onChange={(e) => onChangeTitle(e.target.value)}
        name='Title'
      />
    </div>
    <div>
      {`Show Ledgend: `}
      <input type='checkbox' name='Show Ledgend' checked={options.legend?.enabled} onChange={(e) => {
        onChangeOptions({ legend: { enabled: e.target.checked } });
      }} />
    </div>
    <div>
      {`Show Labels: `}
      <input type='checkbox' name='Show Label' checked={(options.xAxis as XAxisOptions)?.labels?.enabled} onChange={(e) => {
        onChangeOptions({ xAxis: { labels: { enabled: e.target.checked } } });
      }} />
    </div>
    <div>
      {`X-axis Title: `}
      <input value={(options.xAxis as XAxisOptions).title?.text || ''} onChange={(e) => onChangeOptions({ xAxis: { title: { text: e.target.value } } })} />
    </div>
    <div>
      <label>X-axis Scale</label>
      <Dropdown
        multiselect={false}
        selectedOptions={[(options.xAxis as XAxisOptions)?.type || '']}
        onOptionSelect={(e, data) => { onChangeOptions({ xAxis: { type: data.optionValue as AxisTypeValue || 'linear' } }); }}
      >
        {scaleOption.map((option) => (
          <Option key={option}>
            {option}
          </Option>
        ))}
      </Dropdown>
    </div>
    <div>
    <Label>
        X-axis Range
      </Label>
      <Input type='number' value={String((options.xAxis as XAxisOptions).min)} onChange={(e, data) => { onChangeOptions({ xAxis: { min: Number(data.value) } }); }} />
      <Input type='number' value={String((options.xAxis as XAxisOptions).max)} onChange={(e, data) => { onChangeOptions({ xAxis: { max: Number(data.value) } }); }} />
    </div>
  </div>
}

export default App;
