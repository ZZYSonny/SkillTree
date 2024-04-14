import * as echarts from 'echarts';
import { ISkillRecord, ISkillSelection, IState, RecordFilter, SkillTreeMap, SkillTreeReduce, StateToString } from './data';
import { compare, range } from './utils'

const mainChart = echarts.init(document.getElementById("main") as HTMLDivElement);
const sliderChart = echarts.init(document.getElementById("slider") as HTMLDivElement);

function windowSetCallback() {
    window.addEventListener("resize", (ev) => {
        mainChart.resize();
        sliderChart.resize();
    })
}

function echartsSetBaseOptions() {
    const minYear = SkillTreeReduce(
        (cur) => Math.min(...cur.history.map(rec => rec.year)),
        (cur, children) => Math.min(...children)
    )
    const maxYear = SkillTreeReduce<number>(
        (cur) => Math.max(...cur.history.map(rec => rec.year)),
        (cur, children) => Math.max(...children)
    )
    const numStates = Object.values(IState).length / 2;
    const xAxisString = range(minYear, maxYear + 1).flatMap(
        year => range(1, 4 + 1).map(month => `${year}-${month}`)
    );
    const yAxisString = range(0, numStates).map(
        state => StateToString(state)
    )
    sliderChart.setOption({
        xAxis: {
            show: false,
            type: "category",
            data: xAxisString
        },
        yAxis: {
            show: false,
            type: "category",
            data: yAxisString
        },
        dataZoom: [
            {
                type: "slider",
                id: "datazoom-x",
                xAxisIndex: 0,
                bottom: "1%",
            },
            {
                type: "slider",
                id: "datazoom-y",
                yAxisIndex: 0,
                right: "1%",
            }
        ],
    })
}


let curSelection: ISkillSelection = {
    startYear: 0,
    startQuarter: 0,
    endYear: 9999,
    endQuarter: 12,
    minState: IState.LESS_FAMILIAR,
    maxState: IState.DAILY
}

function echartsSetSunburst(newSelection: ISkillSelection) {
    interface ISunburstData {
        name: string;
        value: number;
        history: ISkillRecord[];
        children?: ISunburstData[];
    }
    curSelection = newSelection;
    const filteredData = SkillTreeMap<ISunburstData | null>(
        (leaf) => {
            const filteredHistory = RecordFilter(newSelection,leaf.history);
            if (filteredHistory.length === 0) return null;
            else return {
                name: leaf.name,
                value: 1,
                history: filteredHistory
            }
        },
        (parent, children) => {
            const filteredChildren = children.filter(v => v !== null) as ISunburstData[];
            if (filteredChildren.length === 0) return null;
            else return {
                name: parent!.name,
                value: filteredChildren.reduce((acc, x) => acc + x.value, 0),
                children: filteredChildren,
                history: []
            }
        },
        (categories) => categories.filter(v => v !== null)
    ) as ISunburstData[];
    mainChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                if(Array.isArray(params)){
                    return "???"
                }else{
                    const data: ISunburstData = params.data;
                    const header = `${params.marker}<font size="+1"><b>${data.name}</b></font><br>`
                    const lines = data.history.map(d => `&emsp;&emsp;${d.year}.${d.quarter} ${StateToString(d.state)}`).join("<br>")
                    return header + lines;
                }
                
            }
        },
        series: [{
            name: "SkillDisk",
            type: 'sunburst',
            data: filteredData,
        }]
    })
}

function echartsShouldUpdate(newSelection: ISkillSelection) {
    if(JSON.stringify(curSelection) === JSON.stringify(newSelection)) return false;
    return SkillTreeReduce<boolean>(
        (leaf) => {
            const oldHistory = RecordFilter(curSelection, leaf.history);
            const newHistory = RecordFilter(newSelection, leaf.history);
            return compare(newHistory, oldHistory)
        },
        (parent, children) => children.some(v=>v)
    )
}

function echartSetCallbacks() {
    sliderChart.on("datazoom", ev => {
        let newSelection: ISkillSelection = {
            startYear: curSelection.startYear,
            startQuarter: curSelection.startQuarter,
            endYear: curSelection.endYear,
            endQuarter: curSelection.endQuarter,
            minState: curSelection.minState,
            maxState: curSelection.maxState
        }
        const option = sliderChart.getOption();
        if (ev.dataZoomId === "datazoom-x") {
            //Create date
            const startID = option.dataZoom![0].startValue! as number;
            const endID = option.dataZoom![0].endValue! as number;
            const startYearMonthString = option.xAxis![0].data![startID] as string;
            const endYearMonthString = option.xAxis![0].data![endID] as string;
            newSelection.startYear = parseInt(startYearMonthString.split("-")[0]);
            newSelection.startQuarter = parseInt(startYearMonthString.split("-")[1]);
            newSelection.endYear = parseInt(endYearMonthString.split("-")[0]);
            newSelection.endQuarter = parseInt(endYearMonthString.split("-")[1]);
        }
        if (ev.dataZoomId === "datazoom-y") {
            newSelection.minState = option.dataZoom![1].startValue as IState;
            newSelection.maxState = option.dataZoom![1].endValue as IState;
        }
        console.log(newSelection);
        if (echartsShouldUpdate(newSelection)) {
            console.log("Updating")
            echartsSetSunburst(newSelection);
        }
    })
}

windowSetCallback();
echartsSetBaseOptions();
echartsSetSunburst(curSelection);
echartSetCallbacks();