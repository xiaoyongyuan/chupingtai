import React, { Component } from "react";
import { Modal, Tree, Input, Form, Select } from 'antd';
import { Http } from '../../server/server'
import { CompanyGetlistAll, CompanyGetone } from "../../config/apiConfig"
import './enterprise.less'
import mapImg from "../../assets/images/mapImg.png";
const { Option } = Select;
var ifedit = false;
let marker;
class EnterpriseAddModal extends React.Component {
    formRef = React.createRef();
    state = {
        piddata: [],
        longitude: "",
        lng: "",
        lat: "",
        valueAdd: "",
        clng: "",
        clat: "",
    }
    RequestData() {
        // 所属值守
        var senddata = { ctype: 2 }
        Http(CompanyGetlistAll, senddata).then(res => {
            if (res.success) {
                this.setState({
                    piddata: res.data,
                })
            }
        })
    }
    componentDidMount() {
        let _this = this;
        _this.RequestData();
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.ifedit !== ifedit) {
            ifedit = nextProps.ifedit;
            if (nextProps.ifedit) {
                this.setState({
                    editdatas: nextProps.editdatas,
                }, () => {
                    this.modaledit();
                });
            }
        }
        if (nextProps.Rolev) {
            setTimeout(() => {
                this.mapRender();
            });
        }
    }
    // 编辑
    modaledit() {
        if (this.state.editdatas && ifedit) {
            var senddata = { ctype: 3, code: this.state.editdatas.code }
            Http(CompanyGetone, senddata).then(res => {
                if (res.success) {
                    this.formRef.current.setFieldsValue(res.data)
                    this.addMarker(res.data.clng, res.data.clat)
                    this.map.setCenter(new window.AMap.LngLat(res.data.clng, res.data.clat))
                }
            })
        }
    }

    // 确定
    handleOk() {
        let _this = this;
        this.formRef.current.validateFields()
            .then((values) => {
                if (ifedit) {
                    // 编辑
                    values.code = this.state.editdatas.code;
                    _this.props.ificonModal(values);
                } else {
                    // 新增
                    _this.props.ificonModal(values);
                }
                this.formRef.current.resetFields();
            })
    }
    // 取消
    handleCancel() {
        this.props.ificonModal();
        this.formRef.current.resetFields();
    }



    //地图
    map = {};
    mapRender = () => {
        let _this = this;
        this.map = new window.AMap.Map('container', {
            center: [113.315873, 23.155568],
            zoom: 16,
        });
        this.map.setDefaultCursor("pointer");
        const clickEventListener = this.map.on('click', function (e) {
            if (marker) {
                marker.setMap(null);
                marker = null;
            }
            _this.addMarker(e.lnglat.getLng(), e.lnglat.getLat());
            _this.setState({
                longitude: e.lnglat.getLng() + ',' + e.lnglat.getLat(),
                clng: e.lnglat.getLng(),
                clat: e.lnglat.getLat()
            })
            _this.formRef.current.setFieldsValue({ clng: _this.state.clng })
            _this.formRef.current.setFieldsValue({ clat: _this.state.clat })
            const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];
            regeocoder(lnglatXY);
        });

        const auto = new window.AMap.Autocomplete({
            input: "linkaddress",
        });
        //注册监听，当选中某条记录时会触发
        window.AMap.event.addListener(auto, "select", select);

        function select(e) {

            const lng = e.poi.location.lng;
            const lat = e.poi.location.lat;

            if (e.poi && e.poi.location) {
                _this.map.setZoom(15);
                _this.map.setCenter(e.poi.location);
                _this.addMarker(lng, lat);
            }
            _this.setState({
                longitude: lng + ',' + lat,
                lng,
                lat,
                clng: lng,
                clat: lat,
            });
            _this.formRef.current.setFieldsValue({ linkaddress: e.poi.name })
            if (lng && lat) {
                _this.formRef.current.setFieldsValue({ clng: lng })
                _this.formRef.current.setFieldsValue({ clat: lat })
            }
        }
        //坐标-地址
        function regeocoder(lnglatXY) { //逆地理编码
            const geocoder = new window.AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getAddress(lnglatXY, function (status, result) {
                _this.setState({
                    longitude: lnglatXY,
                    lng: lnglatXY[0],
                    lat: lnglatXY[1],
                    clng: lnglatXY[0],
                    clat: lnglatXY[1],
                });
                if (status === 'complete' && result.info === 'OK') {
                    geocoder_CallBack(result);
                }
            });
        }

        function geocoder_CallBack(data) {
            const valueAdd = data.regeocode.formattedAddress; //返回地址描述
            _this.setState({
                valueAdd,
            });
            _this.formRef.current.setFieldsValue({ clng: _this.state.clng })
            _this.formRef.current.setFieldsValue({ clat: _this.state.clat })
            _this.formRef.current.setFieldsValue({ linkaddress: valueAdd });
        }

    };
    // 实例化点标记
    addMarker = (lng, lat) => {
        marker = new window.AMap.Marker({
            position: [lng, lat],
            image: mapImg,
            map: this.map
        });
    };
    handleLocationChange = e => {
        this.map.clearMap()
        this.formRef.current.setFieldsValue({ linkaddress: e.target.value, clng: "", clat: "" })
    };








    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return (
            <div>
                <Modal
                    title={ifedit ? "修改企业" : "添加企业"}
                    className="modelBig"
                    visible={this.props.Rolev}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    maskClosable={false}
                >
                    <div className="modelBigenterprise">
                        <Form {...formItemLayout} ref={this.formRef} className="inputBox">
                            <Form.Item
                                label="企业名称"
                                name="cname"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input placeholder="请输入企业名称" />
                            </Form.Item>
                            <Form.Item
                                label="企业地址"
                                name="linkaddress"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input placeholder="请输入企业地址" id="linkaddress" onChange={(e) => this.handleLocationChange(e)
                                } />
                            </Form.Item>
                            {/* <Form.Item
                                label="经 纬 度"
                                name="longitude"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input type="text" disabled placeholder='自动获取经纬度' id="lnglat" />
                            </Form.Item> */}
                            <Form.Item
                                label="纬 度"
                                name="clat"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input type="text" disabled placeholder='自动获取经纬度' id="lnglat" />
                            </Form.Item>
                            <Form.Item
                                label="经 度"
                                name="clng"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input type="text" disabled placeholder='自动获取经纬度' id="lnglat" />
                            </Form.Item>
                            <Form.Item
                                label="负责人"
                                name="linkmen"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input placeholder="请输入负责人" />
                            </Form.Item>
                            <Form.Item
                                label="联系方式"
                                name="linktel"
                                rules={[{ required: true, message: '不能为空' }, {
                                    pattern: /^1[3456789]\d{9}$/, message: '电话号码格式不正确！'
                                }]}
                            >
                                <Input placeholder="请输入联系方式" />
                            </Form.Item>
                            <Form.Item
                                label="所属值守"
                                name="pid"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Select placeholder="请选择所属值守" allowClear>
                                    {this.state.piddata.map(pids => (
                                        <Option key={pids.code + ""} value={pids.code}>
                                            {pids.cname}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>

                        <div id="container" className='map'></div>
                    </div>
                </Modal>
            </div >
        )
    }
}

export default EnterpriseAddModal
// = Form.create()(EnterpriseAddModal);
