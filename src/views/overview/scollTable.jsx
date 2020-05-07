import React from 'react';
import './scollTable.less';
import Image from '../../assets/images/warning_image.png'
import { AlarmGetlist } from '../../config/apiConfig'
import { Http } from '../../server/server'
export default class EditableTable extends React.Component {
    state = {
        data: []
    }
    componentDidMount = () => {
        Http(AlarmGetlist, { handlestatus: 2 }).then(res => {
            let alarmInfo = JSON.parse(sessionStorage.getItem('alarm')).alarmInfo;
            res.data.map(list => {
                let result = []
                let handleobject = list.handleobject?list.handleobject.split(','):[];
                alarmInfo.map((item, index) => {
                    switch (item) {
                        // eslint-disable-next-line no-lone-blocks
                        case '口罩': {
                            if (handleobject.indexOf(index.toString()) > -1) {
                                result.push('未戴口罩')
                            } 
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '帽子': {
                            if (handleobject.indexOf(index.toString()) > -1) {
                                result.push('未戴帽子')
                            } 
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '手套': {
                            if (handleobject.indexOf(index.toString()) > -1) {
                                result.push('未戴手套')
                            } 
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '香烟': {
                            if (handleobject.indexOf(index.toString()) > -1) {
                                result.push('发现香烟')
                            } 
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '手机': {
                            if (handleobject.indexOf(index.toString()) > -1) {
                                result.push('发现手机')
                            } 
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '生熟未分': {
                            if (handleobject.indexOf(index.toString()) > -1) {
                                result.push('生熟未分')
                            } 
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '不明生物': {
                            if (handleobject.indexOf(index.toString()) > -1) {
                                result.push('发现不明生物')
                            } 
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '卫生': {
                            if (handleobject.indexOf(index.toString()) > -1) {
                                result.push('卫生情况差')
                            } 
                            break;
                        };
                        default: {

                        }
                    }
                })
                list.result = result;
            })

            this.setState({
                data: res.data
            })
        })
        //文字无缝滚动
        this.industryNews = setInterval(this.taskIndustryNews, 50);
    }
    taskIndustryNews = () => {
        //console.log(this.refs.newDiv)
        if (this.refs.newDiv.scrollTop >= this.refs.newDivUI.offsetHeight - this.refs.newDiv.clientHeight) {
            this.refs.newDiv.scrollTop = 0;
        }
        else {
            this.refs.newDiv.scrollTop += 1;
        }
    }


    handleIndustryNewsEnter = () => {
        clearInterval(this.industryNews);
    }
    handleIndustryNewsLeave = () => {
        this.industryNews = setInterval(this.taskIndustryNews, 50);
    }
    componentWillUnmount = () => {
        clearInterval(this.industryNews);
    }
    render() {
        return (
            <div className='ceShiTable'>
                <div
                    ref='newDiv'
                    className='ceShiTable-body'
                    onMouseEnter={this.handleIndustryNewsEnter.bind(this)}
                    onMouseLeave={this.handleIndustryNewsLeave.bind(this)}
                >
                    <ul ref='newDivUI'>
                        {this.state.data && this.state.data.length > 0
                            ?
                            this.state.data.map(this.tableBody)
                            : <span className='noData'>暂无数据</span>

                        }
                    </ul>
                </div>
            </div>
        );
    }

    tableBody = (item, index) => {
        //console.log(item)
        return (
            <li key={index}>
                <span className='name' title={item.cname}>
                    <div className='name-div'>
                        {item.cname}
                    </div>
                </span>
                <span className='time'>
                    <div className='time-div'>
                        {item.handletime}
                    </div>
                </span>
                <span className='detail' title={item.result.join(" ")}>
                    <div className='detail-div'>
                        {item.result.join(" ")}
                    </div>
                </span>
                <span className='img'>
                    <img src={`http://${item.picpath}`} alt='' style={{ width: '100%', height: '100%' }} />
                </span>
            </li>
        );
    }


}
