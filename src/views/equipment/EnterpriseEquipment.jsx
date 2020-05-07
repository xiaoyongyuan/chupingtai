import React from 'react';
import { Breadcrumb, Button, Space, message, Modal } from 'antd'
import SearchForm from "../../components/myForm/searchForm"
import MyPagination from "../../components/myPagination/myPagination"
import MyTable from "../../components/myTable/myTable"
import EnterpriseAddModal from './EnterpriseAddModal'
import EquipmentAddModal from './EquipmentAddModal'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Icon from '@ant-design/icons';
import { Http } from '../../server/server'
import { CompanyGetlist, CompanyAdduser, CompanyUpdate, CompanyDel, CameraGetlist, CameraAdd, CameraUpdate, CameraDel, CompanyGetlistAll, } from "../../config/apiConfig"
import "./enterprise.less"
class EnterpriseEquipment extends React.Component {
    state = {
        piddata: [],//所属值守
        company: [],//所属企业
        searchdata: {},
        data1: [],//企业列表
        data2: [],//设备列表
        lokcamera: {},//查看企业得设备（企业）
        ifedit: false,
        ifedit2: false,
        editdatas: {},
        editdatas2: {},
        openAnimation: false,
        Rolev: false,//添加企业模态框
        Rolev2: false,//添加设备模态框
        pagination1: {
            total: 0,
            pageSize: 10,
            current: 1
        },
        pagination2: {
            total: 0,
            pageSize: 10,
            current: 1
        },
    }
    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => <div className='tableIndex'>{index + 1}</div>,
            width: 80
        },
        {
            title: '企业名称',
            dataIndex: 'cname',
            key: 'cname',
            ellipsis: true,
        },
        {
            title: '企业地址',
            dataIndex: 'linkaddress',
            key: 'linkaddress',
            ellipsis: true,
        },
        {
            title: '负责人',
            dataIndex: 'linkmen',
            key: 'linkmen',
            ellipsis: true,
        },
        {
            title: '联系方式',
            dataIndex: 'linktel',
            key: 'linktel',
            ellipsis: true,
        },
        {
            title: '摄像头数量',
            dataIndex: 'cameracount',
            key: 'cameracount',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => <Space>
                <div className='editBtn' title='编辑' onClick={this.DropdownSubmit.bind(this, { id: 3, name: "编辑企业" }, record)}><EditOutlined /></div>
                <div className='deleteBtn' title='删除' onClick={this.DropdownSubmit.bind(this, { id: 5, name: "删除企业" }, record)}><DeleteOutlined /></div>
            </Space>
        }
    ];
    columns2 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => <div className='tableIndex'>{index + 1}</div>,
            width: '20%',
            ellipsis: true,
        },
        {
            title: '设备位置',
            dataIndex: 'location',
            key: 'location',
            width: '20%',
            ellipsis: true,
        },
        {
            title: '云信息',
            dataIndex: 'info',
            key: 'info',
            width: '40%',
            ellipsis: true,
            render: (text, record) => <div className='tableInfo'><div>账号:{record.ausername}</div><br /><div>密码:{record.apassword}</div></div>

        },
        {
            title: '状态',
            dataIndex: 'cstatus',
            key: 'cstatus',
            width: '20%',
            ellipsis: true,
            render: (text, record) => record.ifonline === 1 ? <span style={{ color: '#03BE92' }}>在线</span> : <span style={{ color: '#F52323' }}>离线</span>
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: '20%',
            render: (text, record) => <Space>
                <div className='editBtn' title='编辑' onClick={this.DropdownSubmit.bind(this, { id: 4, name: "编辑设备" }, record)}><EditOutlined /></div>
                <div className='deleteBtn' title='删除' onClick={this.DropdownSubmit.bind(this, { id: 6, name: "删除设备" }, record)}><DeleteOutlined /></div>
            </Space>
        }
    ];
    searchFormList = [
        {
            type: 'INPUT',
            label: "企业名称",
            id: 'cname',
            placeholder: '请输入企业名称',
            width: 200,
        },
        {
            type: 'INPUT',
            label: "负责人",
            id: 'linkmen',
            placeholder: '请输入负责人',
            width: 200,
        },
        {
            type: 'INPUTNUMBER',
            label: "电话",
            id: 'linktel',
            placeholder: '请输入电话',
            width: 200,
        },
    ]
    componentDidMount() {
        let _this = this;
        _this.RequestData();
        _this.RequestDataC();
    };
    RequestData() {
        // 企业列表
        var senddata = { pagesize: this.state.pagination1.pageSize, pageindex: this.state.pagination1.current, ctype: 3 }
        if (Object.keys(this.state.searchdata).length) {
            if (this.state.searchdata.cname) {
                senddata.cname = this.state.searchdata.cname;
            }
            if (this.state.searchdata.linkmen) {
                senddata.linkmen = this.state.searchdata.linkmen;
            }
            if (this.state.searchdata.linktel) {
                senddata.linktel = this.state.searchdata.linktel + "";
            }
        }

        Http(CompanyGetlist, senddata).then(res => {
            if (res.success) {
                this.setState({
                    data1: res.data,
                    pagination1: {
                        total: res.totalcount,
                        pageSize: res.pagesize,
                        current: res.page,
                    }
                })
            }
        })
    }
    RequestData2() {
        // 设备列表
        var senddata = { pagesize: this.state.pagination2.pageSize + "", pageindex: this.state.pagination2.current + "", ccode: this.state.lokcamera.code + "" }
        Http(CameraGetlist, senddata).then(res => {
            if (res.success) {
                this.setState({
                    data2: res.data,
                    pagination2: {
                        total: res.totalcount,
                        pageSize: res.pagesize,
                        current: res.page,
                    }
                })
            }
        })
    }
    handleSelect = (record) => {
        // if (!this.state.openAnimation) {
        this.setState({
            openAnimation: true,
            lokcamera: record
        }, () => {
            this.RequestData2();
        })
        // }
    }
    paginationChange1 = pagination1 => {
        this.setState({
            pagination1
        }, () => {
            this.RequestData();
        })
    }
    paginationChange2 = pagination2 => {
        this.setState({
            pagination2
        }, () => {
            this.RequestData2();
        })
    }
    handleSearch = (val) => {
        this.setState({
            searchdata: val
        }, () => {
            this.RequestData();
        })
    }
    RequestDataC() {
        // 所属值守
        var senddata = { ctype: 2 }
        Http(CompanyGetlistAll, senddata).then(res => {
            if (res.success) {
                this.setState({
                    piddata: res.data,
                })
            }
        })
        // 所属企业
        var senddata = { ctype: 3 }
        Http(CompanyGetlist, senddata).then(res => {
            if (res.success) {
                this.setState({
                    company: res.data
                })
            }
        })
    }
    // 添加企业 确定
    ificonModal(formdata) {
        if (formdata && this.state.ifedit) {
            // 编辑
            var senddata = { ...formdata, ctype: 3 }
            Http(CompanyUpdate, senddata).then(res => {
                if (res.success) {
                    message.success('编辑成功！');
                    this.RequestData();
                    this.RequestDataC();
                }
            })
        } else if (formdata && !this.state.ifedit) {
            // 新增
            var senddata = { ...formdata, ctype: 3 }
            Http(CompanyAdduser, senddata).then(res => {
                if (res.success) {
                    message.success('新增成功！');
                    this.RequestData();
                    this.RequestDataC();
                }
            })
        }
        this.setState({
            Rolev: false,
            ifedit: false,
        })
    }
    // 添加设备 确定
    ificonModal2(formdata) {
        if (formdata && this.state.ifedit2) {
            // 编辑
            var senddata = formdata
            Http(CameraUpdate, senddata).then(res => {
                if (res.success) {
                    message.success('编辑成功！');
                    this.RequestData2();
                }
            })
        } else if (formdata && !this.state.ifedit2) {
            // 新增
            var senddata = formdata
            Http(CameraAdd, senddata).then(res => {
                if (res.success) {
                    message.success('新增成功！');
                    this.RequestData2();
                }
            })
        }
        this.setState({
            Rolev2: false,
            ifedit2: false,
        })
    }
    DropdownSubmit(val, record, e) {
        if (val.id == 1) {
            // 添加企业
            this.setState({
                Rolev: true,
                ifedit: false,
                editdatas: {},
            })
        } else if (val.id == 2) {
            // 添加设备
            this.setState({
                Rolev2: true,
                ifedit2: false,
                editdatas2: {},
            })
        } else if (val.id == 3) {
            e.stopPropagation();
            // 编辑企业
            this.setState({
                Rolev: true,
                ifedit: true,
                editdatas: record,
            })
        } else if (val.id == 4) {
            // 编辑设备
            this.setState({
                Rolev2: true,
                ifedit2: true,
                editdatas2: record,
            })
        } else if (val.id == 5) {
            e.stopPropagation();
            // 删除企业
            Modal.confirm({
                title: '提示',
                icon: React.createElement(Icon["ExclamationCircleOutlined"]),
                content: '确定要删除此企业吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    var senddata = { code: record.code + "", ctype: 3 }
                    Http(CompanyDel, senddata).then(res => {
                        if (res.success) {
                            message.success('删除成功！');
                            this.RequestData();
                            this.RequestDataC();
                        }
                    })
                }
            });
        } else if (val.id == 6) {
            // 删除企业
            Modal.confirm({
                title: '提示',
                icon: React.createElement(Icon["ExclamationCircleOutlined"]),
                content: '确定要删除此设备吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    var senddata = { code: record.code + "" }
                    Http(CameraDel, senddata).then(res => {
                        if (res.success) {
                            message.success('删除成功！');
                            this.RequestData2();
                        }
                    })
                }
            });
        }
    }
    render() {
        return (
            <div className='enterpriseWrap'>
                <Breadcrumb>
                    <Breadcrumb.Item>企业设备</Breadcrumb.Item>
                </Breadcrumb>
                <div className='mySearchFormWrap'>
                    <SearchForm formList={this.searchFormList} buttonText='搜索' handleSearch={this.handleSearch} />
                    <Space size='middle'>
                        <Button onClick={this.DropdownSubmit.bind(this, { id: 1, name: "添加企业" })}>添加企业</Button>
                        <Button onClick={this.DropdownSubmit.bind(this, { id: 2, name: "添加设备" })}>添加设备</Button>
                        {/* <Button>批量添加</Button> */}
                        {/* <Button>下载表格</Button> */}
                    </Space>
                </div>
                <div className='tablesWrap' >
                    <div className='leftTable' style={{ animationName: this.state.openAnimation ? 'leftChange' : 'none' }}>
                        <MyTable
                            columns={this.columns1}
                            data={this.state.data1}
                            options={{
                                onRow: (record) => {
                                    return {
                                        onClick: () => { this.handleSelect(record) }
                                    }
                                }
                            }} />
                        <MyPagination pagination={this.state.pagination1} handlePaginationChange={this.paginationChange1} pageSizeOptions={[10, 20, 30, 40]} />
                    </div>
                    <div className='rightTable' style={{ animationName: this.state.openAnimation ? 'rightChange' : 'none' }}>
                        <MyTable columns={this.columns2} data={this.state.data2} />
                        <div style={{ width: '100%', height: "25px", whiteSpace: "nowrap" }}>
                            <MyPagination pagination={this.state.pagination2} handlePaginationChange={this.paginationChange2} pageSizeOptions={[10, 20, 30, 40]} />
                        </div>
                    </div>
                </div>
                <EnterpriseAddModal Rolev={this.state.Rolev} ificonModal={this.ificonModal.bind(this)} ifedit={this.state.ifedit} editdatas={this.state.editdatas} />
                <EquipmentAddModal
                    piddata={this.state.piddata}
                    company={this.state.company}
                    Rolev={this.state.Rolev2}
                    ificonModal={this.ificonModal2.bind(this)}
                    ifedit={this.state.ifedit2}
                    editdatas={this.state.editdatas2} />

            </div>
        )
    }
}

export default EnterpriseEquipment;