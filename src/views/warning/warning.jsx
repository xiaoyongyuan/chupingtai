import React from 'react';
import "./warning.less"
import { Breadcrumb, Button, Modal,Empty  } from 'antd';
import SearchForm from "../../components/myForm/searchForm"
import MyPagination from "../../components/myPagination/myPagination"
import PassIcon from "../../assets/images/icon_pass.png"
import TimeIcon from "../../assets/images/icon_time.png"
import WarningIcon from "../../assets/images/icon_warning.png"
import PassDetailImage from "../../assets/images/warning_detail_image_pass.png"
import NopassDetailImage from "../../assets/images/warning_detail_image_nopass.png"
import CloseIcon from "../../assets/images/icon_close.png"
import { Http } from '../../server/server'
import { AI_LIST, AlarmGetone } from "../../config/apiConfig"
class Warning extends React.Component {
    state = {
        pagination: {
            total: 800,
            pageSize: 12,
            current: 1
        },
        search: {}, //搜索条件
        showDetailModal: false,
        warningList: [],
        detail: {},  //弹窗里显示的信息
        AIinfo: [],   // canvas上要画的框框
        xScale: 0, // x的比例
        yScale: 0, // y的比例
    }
    renderSearchFormList = () => {
        let types = [{ name: '全部', value: 'all' }]
        JSON.parse(sessionStorage.getItem('alarm')).alarmInfo.map((item, index) => {
            types.push({ name: item, value: index.toString() })
        })
        let searchFormList = [
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
                width: 360,
                showTime: true
            },
            {
                type: 'SELECT',
                label: '状态',
                id: 'AIstatus',
                placeholder: '请选择状态',
                initialValue: 'all',
                width: 117,
                list: [{ name: '全部', value: 'all' }, { name: '通过', value: '1' }, { name: '预警', value: '2' }]
            },
            {
                type: 'SELECT',
                label: '类型',
                id: 'AIobject',
                placeholder: '请选择类型',
                initialValue: 'all',
                width: 117,
                list: types
            },
        ]
        return searchFormList
    }

    componentDidMount = () => {
        this.getList()
    }
    getList = () => {
        Http(AI_LIST, { pageindex: this.state.pagination.current, pagesize: this.state.pagination.pageSize, ...this.state.search }).then(res => {
            let pagination = {}
            pagination.pageSize = res.pagesize ? parseInt(res.pagesize) : 10;
            pagination.current = res.page ? parseInt(res.page) : 1;
            pagination.total = res.totalcount ? parseInt(res.totalcount) : 0;
            this.setState({
                pagination,
                warningList: res.data
            })
        })
    }
    handleSearch = values => {
        let search = {}
        search.cname = values.cname;
        if (values.searchTime && values.searchTime.length == 2) {
            search.bdate = values.searchTime[0].format('YYYY-MM-DD HH:mm:ss');
            search.edate = values.searchTime[1].format('YYYY-MM-DD HH:mm:ss')
        }
        if (values.AIstatus != 'all') {
            search.AIstatus = values.AIstatus
        }
        if (values.AIobject != 'all') {
            search.AIobject = values.AIobject
        }
        this.setState({
            search
        }, () => {
            this.getList()
        })
    }
    paginationChange = pagination => {
        this.setState({
            pagination
        }, () => {
            this.getList()
        })
    }
    showDetailModal = item => {
        let alarmInfo = JSON.parse(sessionStorage.getItem('alarm')).alarmInfo;
        let detail = {}
        Http(AlarmGetone, { code: item.code }).then(res => {
            if (res.data.AIobject) {
                alarmInfo.map((item, index) => {
                    switch (item) {
                        // eslint-disable-next-line no-lone-blocks
                        case '口罩': {
                            if (res.data.AIobject.indexOf(index.toString()) > -1) {
                                detail.mask = false;
                            } else {
                                detail.mask = true;
                            }
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '帽子': {
                            if (res.data.AIobject.indexOf(index.toString()) > -1) {
                                detail.hat = false;
                            } else {
                                detail.hat = true;
                            }
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '手套': {
                            if (res.data.AIobject.indexOf(index.toString()) > -1) {
                                detail.glove = false;
                            } else {
                                detail.glove = true;
                            }
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '香烟': {
                            if (res.data.AIobject.indexOf(index.toString()) > -1) {
                                detail.cigarette = false;
                            } else {
                                detail.cigarette = true;
                            }
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '手机': {
                            if (res.data.AIobject.indexOf(index.toString()) > -1) {
                                detail.phone = false;
                            } else {
                                detail.phone = true;
                            }
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '生熟未分': {
                            if (res.data.AIobject.indexOf(index.toString()) > -1) {
                                detail.separate = false;
                            } else {
                                detail.separate = true;
                            }
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '不明生物': {
                            if (res.data.AIobject.indexOf(index.toString()) > -1) {
                                detail.animal = false;
                            } else {
                                detail.animal = true;
                            }
                            break;
                        };
                        // eslint-disable-next-line no-lone-blocks
                        case '卫生': {
                            if (res.data.AIobject.indexOf(index.toString()) > -1) {
                                detail.hygiene = false;
                            } else {
                                detail.hygiene = true;
                            }
                            break;
                        };
                        default: {

                        }
                    }
                })
            } else {
                detail.mask = true;
                detail.hat = true;
                detail.glove = true;
                detail.cigarette = true;
                detail.phone = true;
                detail.separate = true;
                detail.animal = true;
                detail.hygiene = true;
            }
            detail.cname = res.data.cname;
            detail.linkaddress = res.data.linkaddress;
            detail.linkmen = res.data.linkmen;
            detail.linktel = res.data.linktel;
            detail.AItime = res.data.AItime;
            detail.picpath = res.data.picpath;
            let xScale = parseFloat(parseInt(res.data.pic_w) / 635).toFixed(2);
            let yScale = parseFloat(parseInt(res.data.pic_h) / 432).toFixed(2);
            this.setState({
                AIinfo: res.data.AIinfo,
                detail,
                xScale,
                yScale,
                showDetailModal: true
            }, () => {
                setTimeout(() => {
                    this.draw()
                });
            })
        })
    }
    handleModalCancel = () => {
        this.setState({
            showDetailModal: false,
            detail: {},
            AIinfo: [],
            xScale: 0,
            yScale: 0,
        })
    }
    draw = () => {
        let ele = document.getElementById("AICanvas");
        let ctx = ele.getContext("2d");
        ctx.clearRect(0, 0, 635, 432); //清除画布
        let AIinfo = this.state.AIinfo;
        AIinfo.map(item => {
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
    render() {
        console.log(sessionStorage.getItem("picpath"))
        return (
            <div className='warningWrap'>
                <Breadcrumb>
                    <Breadcrumb.Item>AI预警</Breadcrumb.Item>
                </Breadcrumb>
                <div className='mySearchFormWrap'>
                    <SearchForm formList={this.renderSearchFormList()} buttonText='搜索' handleSearch={this.handleSearch} />
                    {/* <Button>批量导出</Button> */}
                </div>
                <div className='listWrap'>
                    <div className='flexWrap'>
                        {this.state.warningList.length>0?this.state.warningList.map(item => {
                            return <div className="warningItem" onClick={() => { this.showDetailModal(item) }} key={item.code}>
                                <div className='imgWrap'>
                                    <img src={item.picpath.search('http') == -1 ? sessionStorage.getItem("picpath")+item.picpath : item.picpath} style={{ width: '100%', height: "100%" }} alt='AI预警'></img>
                                </div>
                                <div className='timeWrap'>
                                    <div className='icon'><img src={TimeIcon} alt="timeIcon" style={{ width: '100%', height: "100%" }}></img></div>
                                    <div className='text'>{item.AItime}</div>
                                </div>
                                {item.AIstatus == '1' ?
                                    <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div> :
                                    <div className='statusWrap'><div className='icon'><img src={WarningIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>预警</div></div>
                                }
                            </div>
                        }):
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{textAlign:'center',width:'100%'}}/>
                        }
                    </div>
                    <MyPagination pagination={this.state.pagination} handlePaginationChange={this.paginationChange} pageSizeOptions={[12, 18, 24, 30]} />
                </div>
                <Modal
                    title=""
                    visible={this.state.showDetailModal}
                    onCancel={this.handleModalCancel}
                    footer={null}
                    className='warningDetailModal'
                    destroyOnClose
                >
                    <div className='detailWrap'>
                        <div className='detailImage'>
                            <canvas width="635px" height="432px"
                                id="AICanvas"
                                style={{
                                    backgroundImage: this.state.detail.picpath ? "url(" + `${this.state.detail.picpath.search('http') == -1 ? sessionStorage.getItem("picpath")+this.state.detail.picpath : this.state.detail.picpath}` + ") " : '',
                                    backgroundSize: "100% 100%",
                                    backgroundRepeat: "no-repeat"
                                }}
                            />
                        </div>
                        <div className='itemWrap'>
                            <div className='detailItem'>
                                <div className='title'>戴口罩</div>
                                <div className='result'>
                                    {this.state.detail.mask ?
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>戴帽子</div>
                                <div className='result'>
                                    {this.state.detail.hat ?
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>戴手套</div>
                                <div className='result'>
                                    {this.state.detail.glove ?
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>香烟</div>
                                <div className='result'>
                                    {this.state.detail.cigarette ?
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>未发现</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>手机</div>
                                <div className='result'>
                                    {this.state.detail.phone ?
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>未发现</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>卫生情况</div>
                                <div className='result'>
                                    {this.state.detail.hygiene ?
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>良好</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem'>
                                <div className='title'>生熟分开</div>
                                <div className='result'>
                                    {this.state.detail.separate ?
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>通过</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div>
                                    }
                                </div>
                            </div>
                            <div className='detailItem detailItemLast'>
                                <div className='title'>小动物</div>
                                <div className='result'>
                                    {this.state.detail.animal ?
                                        <div className='statusWrap'><div className='icon'><img src={PassIcon} alt="passIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textPass'>未发现</div></div> :
                                        <div className='statusWrap'><div className='icon'><img src={CloseIcon} alt="warningIcon" style={{ width: '100%', height: "100%" }}></img></div><div className='textWarning'>未通过</div></div>
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
                            <div className='infoItem'>
                                <div className='title'>联系方式</div>
                                <div className='result' title={this.state.detail.linktel}>{this.state.detail.linktel}</div>
                            </div>
                            <div className='infoItem infoItemLast'>
                                <div className='title'>时间</div>
                                <div className='result' title={this.state.detail.AItime}>{this.state.detail.AItime}</div>
                            </div>
                        </div>
                    </div>

                </Modal>
            </div>
        )
    }
}

export default Warning;