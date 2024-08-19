import * as Highcharts from 'highcharts';

import Boost from 'highcharts/modules/boost';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import { HighchartsReact } from 'highcharts-react-official';
import React from 'react';

export const DEFAULT_CHART_HEIGHT = 400;

export interface IDatasetChartProps {
    options?: Highcharts.Options;
    height?: number;
    onMouseDown: () => void;
    onMouseUp: () => void;
}

Boost(Highcharts);
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);

export const Chart = React.forwardRef((props: IDatasetChartProps, ref?) => {
    const { options, height = DEFAULT_CHART_HEIGHT, onMouseDown, onMouseUp } = props;
    const [[chartWidth, chartHeight], setChartSize] = React.useState<[number?, number?]>(() => [undefined, height]);
    const resizeObserverRef = React.useRef<ResizeObserver | undefined>();
    // @ts-ignore TS2322 https://github.com/highcharts/highcharts-react/issues/230
    const chartRef = ref || React.createRef<typeof HighchartsReact.RefObject>();

    const containerProps = React.useMemo(() =>
        ({ style: { width: chartWidth, height: chartHeight } }),
    [chartWidth, chartHeight]);
    const onChartContainerChanged = React.useCallback((element: HTMLElement | null) => {
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = undefined;
        if (element) {
            if (chartWidth === undefined) {
                setChartSize([element.offsetWidth, height]);
            } else {
                resizeObserverRef.current = new ResizeObserver(e => {
                    // use 'requestAnimationFrame' to avoid error 'ResizeObserver loop limit exceeded'
                    // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded/58701523#58701523
                    window.requestAnimationFrame(() => {
                        if (!Array.isArray(e) || !e.length) {
                            return;
                        }
                        setChartSize([(e[0].target as HTMLElement).offsetWidth, height]);
                    });
                });
                resizeObserverRef.current.observe(element);
            }
        }
    }, [chartWidth, height]);

    return (<div ref={onChartContainerChanged} style={{ overflow: 'hidden', width: '100%', height: props.height ?? '100%' }} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            immutable={true}
            containerProps={containerProps}
            // @ts-ignore TS2322
            ref={chartRef}
        />

    </div>);
});
Chart.displayName = 'DatasetChart';
