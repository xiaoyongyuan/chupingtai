import React from 'react';
import "../warning/warning.less"
import { Breadcrumb, Button, Modal,Empty } from 'antd';
import SearchForm from "../../components/myForm/searchForm"
import MyPagination from "../../components/myPagination/myPagination"
import { Http } from '../../server/server'
import { AlarmGetlist, AlarmGetone } from "../../config/apiConfig"

import moment from 'moment'
import Image from "../../assets/images/warning_image.png"
import PassIcon from "../../assets/images/icon_pass.png"
import TimeIcon from "../../assets/images/icon_time.png"
import PassDetailImage from "../../assets/images/warning_detail_image_pass.png"
import NopassDetailImage from "../../assets/images/warning_detail_image_nopass.png"
import CloseIcon from "../../assets/images/icon_close.png"
class AuditProcessing extends React.Component {
    state = {
        xScale: 0, // x的比例
        yScale: 0, // y的比例
        handleinfo: [],
        alarmInfo: [],
        searchdata: {},
        alarmInfo: [],
        pagination: {
            total: 0,
            pageSize: 12,
            current: 1
        },
        showDetailModal: false,
        warningList: [],
        detail: {},
        searchFormList: [
            {
                type: 'INPUT',
                label: "企业名称",
                id: 'cname',
                placeholder: '请输入企业名称',
                width: 200,
            },
            {
                type: 'DATES',
                label: '时间',
                id: 'searchTime',
                // initialValue: moment(),
                width: 360,
                showTime: true
            },
            {
                type: 'SELECT',
                label: '状态',
                id: 'handlestatus',
                placeholder: '请选择状态',
                initialValue: 'all',
                width: 117,
                list: [{ name: '全部', value: 'all' }, { name: '通过', value: '1' }, { name: '未通过', value: '2' }]
            },
            {
                type: 'SELECT',
                label: '类型',
                id: 'handleobject',
                placeholder: '请选择类型',
                initialValue: 'all',
                width: 117,
                list: []
            },
        ]
    }
    componentWillMount() {
        var alarm = JSON.parse(sessionStorage.getItem("alarm"));
        var list = [{ name: '全部', value: 'all' }];
        var searchFormList = this.state.searchFormList;
        alarm.alarmInfo.map((item, index) => {
            list.push({
                name: item, value: index + ""
            })
        })
        searchFormList[3].list = list;
        this.setState({
            searchFormList,
            alarmInfo: alarm.alarmInfo,
        })
    }
    componentDidMount() {
        let _this = this;
        _this.RequestData();
    };
    RequestData() {
        // 审核处理列表
        var senddata = { pagesize: this.state.pagination.pageSize, pageindex: this.state.pagination.current };
        if (Object.keys(this.state.searchdata).length) {
            if (this.state.searchdata.cname) {
                senddata.cname = this.state.searchdata.cname;
            }
            if (this.state.searchdata.handleobject) {
                senddata.handleobject = this.state.searchdata.handleobject;
            }
            if (this.state.searchdata.handlestatus) {
                senddata.handlestatus = this.state.searchdata.handlestatus;
            }
            if (this.state.searchdata.bdate) {
                senddata.bdate = this.state.searchdata.bdate;
                senddata.edate = this.state.searchdata.edate;
            }
        }
        Http(AlarmGetlist, senddata).then(res => {
            if (res.success) {
                this.setState({
                    warningList: res.data,
                    pagination: {
                        total: res.totalcount,
                        pageSize: res.pagesize,
                        current: res.page,
                    }
                })
            }
        })
    }
    handleSearch = values => {
        var searchdata = {};
        searchdata.cname = values.cname;
        searchdata.handleobject = values.handleobject == "all" ? "" : values.handleobject;
        searchdata.handlestatus = values.handlestatus == "all" ? "" : values.handlestatus;
        searchdata.bdate = values.searchTime ? values.searchTime[0].format("YYYY-MM-DD HH:mm:ss") : "";
        searchdata.edate = values.searchTime ? values.searchTime[1].format("YYYY-MM-DD HH:mm:ss") : "";
        this.setState({
            searchdata
        }, () => {
            this.RequestData();
        })
    }
    paginationChange = pagination => {
        this.setState({
            pagination
        }, () => {
            this.RequestData();
        })
    }
    // 获取详情
    showDetailModal = item => {
        var senddata = { code: item.code + "" };
        Http(AlarmGetone, senddata).then(res => {
            if (res.success) {
                let xScale = parseFloat(parseInt(res.data.pic_w) / 635).toFixed(2);
                let yScale = parseFloat(parseInt(res.data.pic_h) / 432).toFixed(2);
                this.setState({
                    handleinfo: res.data.handleinfo,
                    detail: res.data,
                    showDetailModal: true,
                    xScale,
                    yScale
                }, () => {
                    setTimeout(() => {
                        this.canvasfun();
                    });
                })
            }
        })
    }
    canvasfun() {
        let ele = document.getElementById("rollcallObj");
        let ctx = ele.getContext("2d");
        ctx.clearRect(0, 0, 635, 432); //清除画布
        let handleinfo = this.state.handleinfo ? this.state.handleinfo : [];
        handleinfo.map(item => {
            let X = parseFloat(parseInt(item.left) / this.state.xScale).toFixed(2);
            let Y = parseFloat(parseInt(item.top) / this.state.yScale).toFixed(2);
            let W = parseFloat(parseInt(item.width) / this.state.xScale).toFixed(2);
            let H = parseFloat(parseInt(item.height) / this.state.yScale).toFixed(2);
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#F52323';
            ctx.rect(X, Y, W, H);
            ctx.stroke();
        })
    }
    // 取消看详情
    handleModalCancel = () => {
        this.setState({
            showDetailModal: false,
            detail: {},
            handleinfo: [],
            xScale: 0,
            yScale: 0,
        })
    }
    render() {
        return (
            <div className='warningWrap'>
                <Breadcrumb>
                    <Breadcrumb.Item>审核处理</Breadcrumb.Item>
                </Breadcrumb>
                <div className='mySearchFormWrap'>
                    <SearchForm formList={this.state.searchFormList} buttonText='搜索' handleSearch={this.handleSearch} />
                    {/* <Button>批量导出</Button> */}
                </div>
                <div className='listWrap'>
                    <div className='flexWrap'>
                        {this.state.warningList.length>0?this.state.warningList.map(item => {
                            return <div className="warningItem" key={item.code} onClick={() => { this.showDetailModal(item) }}>
                                <div className='imgWrap'>
                                    <img src={item.picpath.search('http') == -1 ? sessionStorage.getItem("picpath")+item.picpath : item.picpath} style={{ width: '100%', height: "100%" }} alt='审核处理'></img>
                                </div>
                                <div className='timeWrap'>
                                    <div className='icon'><img src={TimeIcon} alt="timeIcon" style={{ width: '100%', height: "100%" }}></img></div>
                                    <div className='text'>{item.handletime}</div>
                                </div>
                                {item.handlestatus == 1 ?
                                    <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>审核通过</div></div> :
                                    <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>审核未通过</div></div>
                                }
                            </div>
                        }):<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{textAlign:'center',width:'100%'}}/>}
                    </div>
                    <MyPagination pagination={this.state.pagination} handlePaginationChange={this.paginationChange} pageSizeOptions={[12, 18, 24, 30]} />
                </div>
                <Modal
                    title=""
                    visible={this.state.showDetailModal}
                    onCancel={this.handleModalCancel}
                    footer={null}
                    className='processDetailModal'
                    destroyOnClose
                >
                    <div className='detailWrap'>
                        <div className='detailImage'>
                            <canvas width="635px" height="432px"
                                id="rollcallObj"
                                style={{
                                    backgroundImage: this.state.detail.picpath ? "url(" + `${this.state.detail.picpath.search('http') == -1 ? sessionStorage.getItem("picpath")+this.state.detail.picpath : this.state.detail.picpath}` + ") " : '',
                                    backgroundSize: "100% 100%",
                                    backgroundRepeat: "no-repeat"
                                }}
                            />
                        </div>
                        <div className='itemWrap'>
                            <div className='detailItem'>
                                <div className='title'>卫生情况</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("0") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>良好</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>戴口罩</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("1") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>戴帽子</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("2") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>戴手套</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("3") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>香烟</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("4") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>手机</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("5") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>

                            <div className='detailItem'>
                                <div className='title'>生熟分开</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("6") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem detailItemLast'>
                                <div className='title'>小动物</div>
                                <div className='result'>
                                    {this.state.detail.handleobject && this.state.detail.handleobject.indexOf("7") > -1 ?
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='infoItem'>
                                <div className='title'>企业</div>
                                <div className='result' title={this.state.detail.cname}>{this.state.detail.cname}</div>
                            </div>
                            <div className='infoItem'>
                                <div className='title'>地址</div>
                                <div className='result' title={this.state.detail.linkaddress}>{this.state.detail.linkaddress}</div>
                            </div>
                            <div className='infoItem'>
                                <div className='title'>负责人</div>
                                <div className='result' title={this.state.detail.linkmen}>{this.state.detail.linkmen}</div>
                            </div>
                            <div className='infoItem infoItemLast'>
                                <div className='title'>联系方式</div>
                                <div className='result' title={this.state.detail.linktel}>{this.state.detail.linktel}</div>
                            </div>
                            <div className='infoItem'>
                                <div className='title'>审核人</div>
                                <div className='result' title={this.state.detail.handlemen}>{this.state.detail.handlemen}</div>
                            </div>
                            <div className='infoItem infoItemLast'>
                                <div className='title'>审核时间</div>
                                <div className='result' title={this.state.detail.handletime}>{this.state.detail.handletime}</div>
                            </div>
                        </div>
                    </div>

                </Modal>
            </div>
        )
    }
}

export default AuditProcessing;