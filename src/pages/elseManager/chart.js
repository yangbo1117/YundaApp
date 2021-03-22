import React from 'react';
 import {Divider} from 'antd'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import  'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import axios from '../../axios';
import QueryForm from './components/queryForm.js'
class Chart extends React.Component {
    constructor(props){
        super(props)
        this.state={
            timer:'',//定时器
            lastTime:'', // 最后一个日期
            currentLastTime:'', //当前文件的最后一个日期
            originLastTime:'', //原始文件的最后一个日期
            ldLastTime:'', //录单文件的最后一个日期
            timeData:[], //日期
            currentCount:[], //当前文件数量
            currentSize:[], //当前文件大小
            currentTimeDifference:[], //当前文件时间差
            currentCreateTime:[], //当前文件创建时间
            originCount:[], //原始文件数量
            originSize:[], //原始文件大小
            originTimeDifference:[], //原始文件时间差
            originCreateTime:[], //当前文件创建时间
            ldCount:[], //录单文件数量
            ldSize:[], //录单文件大小
            ldTimeDifference:[], //录单文件时间差
            ldCreateTime:[], //当前文件创建时间
        }
    }
    //获取所有文件数据
    async getAllList(type){
        let dateType  = type
        let fileType  = 'all'
        let url = `file/${fileType}/${dateType}`
        let datas = await axios.get({
            url
        })
        console.log(datas)
        let currentData = datas.data.current
        let originData = datas.data.origin
        let ldData = datas.data.ld
        let currentTimeData = Object.keys(currentData)
        let originTimeData = Object.keys(originData)
        let ldTimeData = Object.keys(ldData)
        let timeData //选取的x轴数据
        let max = Math.max(currentTimeData[0],originTimeData[0],ldTimeData[0])
        max = max+''
        console.log(max)
        let originIndex =  originTimeData.indexOf(max)
        let ldIndex =  ldTimeData.indexOf(max)
        let currentIndex = currentTimeData.indexOf(max)
        if(currentTimeData[0]==max){ //当x轴为当前文件数据
            timeData = currentTimeData
        }else if(originTimeData[0]==max){ //当x轴为原始文件数据
            timeData = originTimeData
        }else{ //当x轴为录单文件数据
            timeData =ldTimeData 
        }
        
        
        //console.log(`${currentIndex}++${originIndex}++${ldIndex}`)
        //当前文件数量，当前文件大小，当前文件时间差,当前文件创建时间
        let currentCount=[]
        let currentSize = []
        let currentTimeDifference = []
        let currentCreateTime = []
         //原始文件数量，原始文件大小，原始文件时间差，原始文件创建时间
        let originCount = []
        let originSize = []
        let originTimeDifference = []
        let originCreateTime = []
         //录单文件数量，录单文件大小，录单文件时间差，录单文件创建时间
        let ldCount = []
        let ldSize = []
        let ldTimeDifference = []
        let ldCreateTime = []
        timeData.forEach(value=>{
                let currentVal = currentData[value]
                if(currentVal!==undefined){
                    let currentValArr = currentVal.split(',')
                    currentCount.push(currentValArr[0])
                    currentSize.push(currentValArr[1]/1024/1024)
                    currentTimeDifference.push((currentValArr[3]/60).toFixed(1))
                    currentCreateTime.push(currentValArr[2])
                }            
                let originVal = originData[value]
                if(originVal!==undefined){
                    let originValArr = originVal.split(',')
                    originCount.push(originValArr[0])
                    originSize.push(originValArr[1]/1024/1024)
                    originTimeDifference.push((originValArr[3]/60).toFixed(1))
                    originCreateTime.push(originValArr[2])
                }
                let ldVal = ldData[value]
                if(ldVal!==undefined){
                    let ldValArr = ldVal.split(',')
                    ldCount.push(ldValArr[0])
                    ldSize.push(ldValArr[1]/1024/1024)
                    ldTimeDifference.push((ldValArr[3]/60).toFixed(1))
                    ldCreateTime.push(ldValArr[2])
                }         
        })
        let currentTimeIndex = timeData.length-1-currentIndex
        let originTimeIndex = timeData.length-1-originIndex
        let ldTimeIndex = timeData.length-1-ldIndex
        console.log(currentTimeIndex)
        this.setState({
            timeData,
            currentLastTime:timeData[currentTimeIndex],
            originLastTime:timeData[originTimeIndex],
            ldLastTime:timeData[ldTimeIndex],
            currentCount,
            currentSize,
            currentTimeDifference,
            currentCreateTime,
            originCount,
            originSize,
            originTimeDifference,
            originCreateTime,
            ldCount,
            ldSize,
            ldTimeDifference,
            ldCreateTime
        },()=>{
            this.initEchart()
        })
    }
    // 获取下个时间点的数据
    async getNextData(){  
        let currentData = await axios.get({
            url:'/file/current',
            data:{
                dateTime :this.state.currentLastTime
            }
        }) 
        console.log(currentData)
        let originData = await axios.get({
            url:'/file/origin',
            data:{
                dateTime :this.state.originLastTime
            }
        }) 
        console.log(originData)
        let ldData = await axios.get({
            url:'/file/ld',
            data:{
                dateTime :this.state.ldLastTime
            }
        }) 
        console.log(ldData)
        let current = currentData.data.current
        let origin = originData.data.origin
        let ld = ldData.data.ld
        //当前文件参数
        let currentCount = this.state.currentCount
        let currentSize = this.state.currentSize
        let currentTimeDifference = this.state.currentTimeDifference
        let currentCreateTime = this.state.currentCreateTime
        let currentNowTime
        let originNowTime
        let ldNowTime
        //原始文件参数
        let originCount = this.state.originCount
        let originSize = this.state.originSize
        let originTimeDifference = this.state.originTimeDifference
        let originCreateTime = this.state.originCreateTime
        //录单文件参数
        let ldCount = this.state.ldCount
        let ldSize = this.state.ldSize
        let ldTimeDifference = this.state.ldTimeDifference
        let ldCreateTime = this.state.ldCreateTime
        if(current!==''){
            let currentArr = current.split(',')
            if(currentArr.length===5){ 
                currentNowTime = currentArr[0]        
                currentCount.splice(0,1)
                currentCount.push(currentArr[1])
                currentSize.splice(0,1)
                currentSize.push(currentArr[2]/1024/1024)
                currentTimeDifference.splice(0,1)
                currentTimeDifference.push((currentArr[4]/60).toFixed(1))
                currentCreateTime.splice(0,1)
                currentCreateTime.push(currentArr[3])
            }
        }
        if(origin!==''){
            let originArr = origin.split(',')
            if(originArr.length===5){
                originNowTime = originArr[0]
                originCount.splice(0,1)
                originCount.push(originArr[1])
                originSize.splice(0,1)
                originSize.push(originArr[2]/1024/1024)
                originTimeDifference.splice(0,1)
                originTimeDifference.push((originArr[4]/60).toFixed(1))
                originCreateTime.splice(0,1)
                originCreateTime.push(originArr[3])
            }
        }

        if(ld!==''){
            let ldArr = ld.split(',')
            if(ldArr.length===5){
                ldNowTime = ldArr[0]
                ldCount.splice(0,1)
                ldCount.push(ldArr[1])
                ldSize.splice(0,1)
                ldSize.push(ldArr[2]/1024/1024)
                ldTimeDifference.splice(0,1)
                ldTimeDifference.push((ldArr[4]/60).toFixed(1))
                ldCreateTime.splice(0,1)
                ldCreateTime.push(ldArr[3])
            }
        }
        let maxTime
        if(currentNowTime!==undefined||originNowTime!==undefined||ldNowTime!==undefined){
            maxTime = Math.max(currentNowTime,originNowTime,ldNowTime)
            maxTime= maxTime+''
        }
        
        let timeData = this.state.timeData
        timeData.splice(0,1)
        timeData.push(maxTime)
        this.setState({
            currentCount,
            currentSize,
            currentTimeDifference,
            originCount,
            originSize,
            originTimeDifference,
            ldCount,
            ldSize,
            ldTimeDifference,
            currentLastTime:currentNowTime!==undefined?currentNowTime:this.state.currentLastTime,
            originLastTime:originNowTime!==undefined?originNowTime:this.state.originLastTime,
            ldLastTime:ldNowTime!==undefined?ldNowTime:this.state.ldLastTime,
            timeData
        },()=>{
            this.initEchart()
        })
        /* if(current!==''&&origin!==''&&ld!==''){
            let currentArr = current.split(',')
            let originArr = origin.split(',')
            let ldArr = ld.split(',')
            if(currentArr.length===5&&originArr.length===5&&ldArr.length===5){
                let currentCount = this.state.currentCount
                let currentSize = this.state.currentSize
                let currentTimeDifference = this.state.currentTimeDifference
                currentCount.splice(0,1)
                currentCount.push(currentArr[1])
                currentSize.splice(0,1)
                currentSize.push(currentArr[2]/1024/1024)
                currentTimeDifference.splice(0,1)
                currentTimeDifference.push((currentArr[4]/60).toFixed(1))
                
                let originCount = this.state.originCount
                let originSize = this.state.originSize
                let originTimeDifference = this.state.originTimeDifference
                originCount.splice(0,1)
                originCount.push(originArr[1])
                originSize.splice(0,1)
                originSize.push(originArr[2]/1024/1024)
                originTimeDifference.splice(0,1)
                originTimeDifference.push((originArr[4]/60).toFixed(1))
                
                let ldCount = this.state.ldCount
                let ldSize = this.state.ldSize
                let ldTimeDifference = this.state.ldTimeDifference
                ldCount.splice(0,1)
                ldCount.push(ldArr[1])
                ldSize.splice(0,1)
                ldSize.push(ldArr[2]/1024/1024)
                ldTimeDifference.splice(0,1)
                ldTimeDifference.push((ldArr[4]/60).toFixed(1))

                let timeData = this.state.timeData
                timeData.splice(0,1)
                timeData.push(currentArr[0])
                console.log(currentCount)
                this.setState({
                    currentCount,
                    currentSize,
                    currentTimeDifference,
                    originCount,
                    originSize,
                    originTimeDifference,
                    ldCount,
                    ldSize,
                    ldTimeDifference,
                    lastTime:currentArr[0],
                    timeData
                },()=>{
                    this.initEchart()
                })
            }
           
        } */

    }
    initEchart(){
        const _this = this
        // 基于准备好的dom，初始化echarts实例
        //当前文件表
        var  currentChart = echarts.init(document.getElementById('mainA'));
    /*     //原始文件表
        var originChart = echarts.init(document.getElementById('mainB'));
        //录单文件表
        var ldChart = echarts.init(document.getElementById('mainC')); */
        // 绘制图表
        currentChart.setOption({
            title: {
                text: '文件数量统计'
            },
            tooltip: {
                trigger: 'item', //axis item
                formatter(params){
                    console.log(params)
                   let index = params.dataIndex
                   let size=''
                   let createTime = ''
                   if(params.seriesName === '指数计算文件'){
                        createTime = _this.state.currentCreateTime[index]
                        size =  _this.state.currentSize[index]
                   }else if(params.seriesName === '扫描原始文件'){
                        createTime = _this.state.originCreateTime[index]
                        size =  _this.state.originSize[index]
                   }else{
                        createTime = _this.state.ldCreateTime[index]
                        size =  _this.state.ldSize[index]
                   }
 
                   return params.seriesName+'<br/>数量：'+params.value+ '<br/>创建时间：'+createTime+ '<br/>文件大小：'+size+'M'+ '<br/>批次时间：'+params.name
                  },
            },
            legend: {
                data:['指数计算文件','扫描原始文件','录单文件']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:this.state.timeData,
                axisTick:{
                    //interval:2
                }
            },
            yAxis: {
                name:'文件数量/个',
                type: 'value',
            },
            dataZoom: [{
                      show:true,
                      type: 'slider',
                      start: 0,
                      end: 100,
                      handleSize: 5
                  }, {
                      show:true,
                      type: 'inside',
                      start: 0,
                      end: 100
                  }],
            series: [
                {
                    name:'指数计算文件',
                    type:'line',
                   // stack: '总量',
                    data:this.state.currentCount
                },
                {
                    name:'扫描原始文件',
                    type:'line',
                  //  stack: '总量',
                    data:this.state.originCount
                },
                {
                    name:'录单文件',
                    type:'line',
                  //  stack: '总量',
                    data:this.state.ldCount
                }
            ]
        });
     /*    originChart.setOption({
            title: {
                text: '文件大小统计'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['指数计算文件','扫描原始文件','录单文件']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.timeData,
                axisTick:{
                    //interval:2
                }
            },
            yAxis: {
                type: 'value',
                name:'文件大小/M'
            },
            dataZoom: [{
                      show:true,
                      type: 'slider',
                      start: 0,
                      end: 10,
                      handleSize: 5
                  }, {
                      show:true,
                      type: 'inside',
                      start: 0,
                      end: 100
                  }],
            series: [
                {
                    name:'指数计算文件',
                    type:'line',
                    stack: '总量',
                    data:this.state.currentSize
                },
                {
                    name:'扫描原始文件',
                    type:'line',
                    stack: '总量',
                    data:this.state.originSize
                },
                {
                    name:'录单文件',
                    type:'line',
                    stack: '总量',
                    data:this.state.ldSize
                }
            ]
        }); */
       /*  ldChart.setOption({
            title: {
                text: '文件时间差统计'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['指数计算文件','扫描原始文件','录单文件']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.timeData,
                axisTick:{
                    //interval:2
                }
            },
            yAxis: {
                type: 'value',
                name:'文件时间差/分钟'
            },
            dataZoom: [{
                      show:true,
                      type: 'slider',
                      start: 0,
                      end: 10,
                      handleSize: 5
                  }, {
                      show:false,
                      type: 'inside',
                      start: 0,
                      end: 100
                  }],
            series: [
                {
                    name:'指数计算文件',
                    type:'line',
                    stack: '总量',
                    data:this.state.currentTimeDifference
                },
                {
                    name:'扫描原始文件',
                    type:'line',
                    stack: '总量',
                    data:this.state.originTimeDifference
                },
                {
                    name:'录单文件',
                    type:'line',
                    stack: '总量',
                    data:this.state.ldTimeDifference
                }
            ]
        }); */
    }
    componentDidMount() {
        this.getAllList('now')
        let timer = setInterval(()=>{
            this.getNextData()
        },300000)
        this.setState({
            timer
        })
    }
    search(params){
        console.log(params)
        clearInterval(this.state.timer)
        let date = params.frequencyDate
        this.getAllList(date)
        let timer = setInterval(()=>{
            this.getNextData()
        },300000)
        this.setState({
            timer
        })
    }
    render() {
        return (
            <div>
                <QueryForm search={this.search.bind(this)}></QueryForm>
                <Divider/>
                <div id="mainA" style={{ width: 1200, height: 'calc(60vh)',margin:'0 auto' }}></div>
                {/* 
                <div id="mainB" style={{ width: 1200, height: 'calc(50vh)',margin:'0 auto' }}></div>
                <Divider/>
                <div id="mainC" style={{ width: 1200, height: 'calc(50vh)',margin:'0 auto' }}></div> */}
            </div>
            
        );
    }
    componentWillUnmount(){
        console.log('关闭定时器')
        clearInterval(this.state.timer)
    }
}
 
export default Chart;