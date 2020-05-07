import React, { Component } from "react";
import { Modal, Tree, Input, Form, Select } from 'antd';
import { Http } from '../../server/server'
import { CompanyGetlistAll, CompanyGetlist, CameraGetone, } from "../../config/apiConfig"
import './enterprise.less'
const { Option } = Select;
var ifedit = false;
class EquipmentAddModal extends React.Component {
    formRef = React.createRef();
    state = {
        piddata: [],//所属值守
        company: [],//所属企业
    }

    componentDidMount() {

    };
    componentWillReceiveProps(nextProps) {
        this.setState({
            piddata: nextProps.piddata,
            company: nextProps.company,
        })
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
    }
    // 编辑
    modaledit() {
        if (this.state.editdatas && ifedit) {
            var senddata = { code: this.state.editdatas.code }
            Http(CameraGetone, senddata).then(res => {
                if (res.success) {
                    this.formRef.current.setFieldsValue(res.data)
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
                    values.code = this.state.editdatas.code + "";
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
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        return (
            <div>
                <Modal
                    title={ifedit ? "修改设备" : "添加设备"}
                    //className="modelBig2"
                    visible={this.props.Rolev}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    maskClosable={false}
                >
                    <div className="modelBigenterprise">
                        <Form {...formItemLayout} ref={this.formRef}>
                            <Form.Item
                                label="设备名称"
                                name="name"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input placeholder="请输入设备名称" />
                            </Form.Item>
                            <Form.Item
                                label="云信息账号"
                                name="ausername"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input placeholder="请输入云信息账号" />
                            </Form.Item>
                            <Form.Item
                                label="云信息密码"
                                name="apassword"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input placeholder="请输入云信息密码" />
                            </Form.Item>
                            <Form.Item
                                label="设备位置"
                                name="location"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Input placeholder="请输入设备位置" />
                            </Form.Item>
                            <Form.Item
                                label="所属值守"
                                name="companycode"
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
                            <Form.Item
                                label="所属企业"
                                name="ccode"
                                rules={[{ required: true, message: '不能为空' }]}
                            >
                                <Select placeholder="请选择所属企业" allowClear>
                                    {this.state.company.map(comp => (
                                        <Option key={comp.code + ""} value={comp.code}>
                                            {comp.cname}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div >
        )
    }
}

export default EquipmentAddModal
// = Form.create()(EnterpriseAddModal);
